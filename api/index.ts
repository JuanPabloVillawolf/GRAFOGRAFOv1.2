import express from "express";
import { google } from "googleapis";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(express.json());

// Google OAuth Setup
const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  `${process.env.APP_URL}/auth/callback`
);

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// 1. Get Google Auth URL
app.get("/api/auth/google/url", (req, res) => {
  const scopes = [
    "https://www.googleapis.com/auth/spreadsheets",
    "https://www.googleapis.com/auth/drive.file",
  ];

  const url = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: scopes,
    prompt: "consent",
  });

  res.json({ url });
});

// 2. OAuth Callback
app.get("/auth/callback", async (req, res) => {
  const { code } = req.query;

  try {
    const { tokens } = await oauth2Client.getToken(code as string);
    
    res.send(`
      <html>
        <body>
          <script>
            if (window.opener) {
              window.opener.postMessage({ 
                type: 'GOOGLE_AUTH_SUCCESS', 
                tokens: ${JSON.stringify(tokens)} 
              }, '*');
              window.close();
            } else {
              window.location.href = '/';
            }
          </script>
          <p>Autenticación exitosa. Esta ventana se cerrará automáticamente.</p>
        </body>
      </html>
    `);
  } catch (error) {
    console.error("Error exchanging code for tokens:", error);
    res.status(500).send("Error en la autenticación");
  }
});

// 3. Get Data from Google Sheets
app.post("/api/sheets/data", async (req, res) => {
  const { tokens, spreadsheetId } = req.body;
  if (!tokens || !spreadsheetId) {
    return res.status(400).json({ error: "Tokens and Spreadsheet ID are required" });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title || "") || [];

    const requiredSheets = [
      { title: "Inventario", headers: ["ID", "Nombre", "Categoría", "Precio", "Stock", "Icono"] },
      { title: "Ventas", headers: ["ID Transacción", "Fecha/Hora", "Producto", "Categoría", "Cantidad", "Precio Unit.", "Total", "Método de Pago", "Usuario"] },
      { title: "Movimientos", headers: ["Fecha/Hora", "ID Producto", "Producto", "Tipo", "Cantidad", "Stock Resultante", "Notas", "Usuario"] },
      { title: "Usuarios", headers: ["Usuario", "Contraseña", "Nombre", "Rol"] },
      { title: "Caja", headers: ["Fecha", "Usuario", "Tipo", "Monto", "Notas"] },
      { title: "Gastos", headers: ["ID", "Fecha/Hora", "Concepto", "Monto", "Categoría", "Usuario", "Notas"] },
      { title: "Cuentas Pendientes", headers: ["ID", "Cliente", "Fecha Creación", "Última Actualización", "Items (JSON)", "Pagos (JSON)", "Estado"] }
    ];

    for (const reqSheet of requiredSheets) {
      const exists = sheetTitles.some(t => t.trim().toLowerCase() === reqSheet.title.toLowerCase());
      if (!exists) {
        try {
          await sheets.spreadsheets.batchUpdate({
            spreadsheetId,
            requestBody: {
              requests: [{
                addSheet: { properties: { title: reqSheet.title, gridProperties: { frozenRowCount: 1 } } }
              }]
            }
          });
          await sheets.spreadsheets.values.update({
            spreadsheetId,
            range: `${reqSheet.title}!A1`,
            valueInputOption: "RAW",
            requestBody: { values: [reqSheet.headers] }
          });
        } catch (err: any) {
          if (!err.message?.includes("already exists") && !err.message?.includes("Ya existe")) {
            throw err;
          }
        }
      }
    }

    const batchRes = await sheets.spreadsheets.values.batchGet({
      spreadsheetId,
      ranges: requiredSheets.map(s => `${s.title}!A2:L`)
    });

    const valueRanges = batchRes.data.valueRanges || [];
    
    const getSheetValues = (title: string) => {
      const vr = valueRanges.find(v => {
        if (!v.range) return false;
        const sheetPart = v.range.split('!')[0];
        const normalizedSheetName = sheetPart.replace(/'/g, '');
        return normalizedSheetName === title;
      });
      return vr?.values || [];
    };

    const inventory = getSheetValues("Inventario").map((row, index) => ({
      id: row[0] || `row-${index + 2}`,
      name: row[1],
      category: row[2],
      price: parseFloat(row[3]) || 0,
      stock: parseInt(row[4]) || 0,
      icon: row[5]
    }));

    const sales = getSheetValues("Ventas").map(row => ({
      id: row[0],
      timestamp: row[1],
      productName: row[2],
      category: row[3],
      quantity: parseInt(row[4]) || 0,
      amount: parseFloat(row[6]) || 0,
      paymentMethod: row[7] || "Efectivo",
      username: row[8] || ""
    })).reverse();

    const movements = getSheetValues("Movimientos").map(row => ({
      timestamp: row[0],
      productId: row[1],
      productName: row[2],
      type: row[3],
      quantity: parseInt(row[4]) || 0,
      stockResult: parseInt(row[5]) || 0,
      notes: row[6] || "",
      username: row[7] || ""
    })).reverse();

    const expenses = getSheetValues("Gastos").map(row => ({
      id: row[0],
      timestamp: row[1],
      description: row[2],
      amount: parseFloat(row[3]) || 0,
      category: row[4],
      username: row[5],
      notes: row[6] || ""
    })).reverse();

    const cashLogs = getSheetValues("Caja").map(row => ({
      timestamp: row[0],
      username: row[1],
      type: row[2],
      amount: parseFloat(row[3]) || 0,
      notes: row[4] || ""
    })).reverse();

    const pendingAccounts = getSheetValues("Cuentas Pendientes").map(row => {
      let items = [];
      let payments = [];
      try {
        items = JSON.parse(row[4] || "[]");
      } catch (e) {
        console.error("Error parsing items JSON:", row[4]);
      }
      try {
        payments = JSON.parse(row[5] || "[]");
      } catch (e) {
        console.error("Error parsing payments JSON:", row[5]);
      }
      return {
        id: row[0],
        customerName: row[1],
        createdAt: row[2],
        updatedAt: row[3],
        items,
        payments,
        status: row[6] || 'Abierta'
      };
    });

    const users = getSheetValues("Usuarios").map(row => ({
      username: row[0],
      name: row[2],
      role: row[3]
    }));

    res.json({ inventory, sales, movements, expenses, cashLogs, pendingAccounts, users });
  } catch (error: any) {
    console.error("Error fetching data from sheets:", error);
    res.status(500).json({ error: error.message });
  }
});

// 4. Login Validation
app.post("/api/auth/login", async (req, res) => {
  const { tokens, spreadsheetId, username, password } = req.body;
  if (!tokens || !spreadsheetId || !username || !password) {
    return res.status(400).json({ error: "Faltan credenciales" });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: "Usuarios!A2:D",
    });

    const rows = response.data.values || [];
    const user = rows.find(row => row[0] === username && row[1] === password);

    if (user) {
      res.json({ 
        success: true, 
        user: { 
          username: user[0], 
          name: user[2], 
          role: user[3] 
        } 
      });
    } else {
      if (rows.length === 0 && username === "admin" && password === "admin") {
        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Usuarios!A1",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [["admin", "admin", "Administrador", "admin"]]
          }
        });
        return res.json({ 
          success: true, 
          user: { username: "admin", name: "Administrador", role: "admin" } 
        });
      }
      res.status(401).json({ error: "Usuario o contraseña incorrectos" });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 5. Cash Fund Management
app.post("/api/sheets/cash-fund", async (req, res) => {
  const { tokens, spreadsheetId, amount, username, notes } = req.body;
  if (!tokens || !spreadsheetId || amount === undefined || !username) {
    return res.status(400).json({ error: "Faltan datos para el fondo de caja" });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });
    const now = new Date().toLocaleString('es-MX', { hour12: false });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Caja!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[now, username, "Fondo Inicial", amount, notes || "Apertura de caja"]]
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 6. Record an Expense
app.post("/api/sheets/expense", async (req, res) => {
  const { tokens, spreadsheetId, expense } = req.body;
  if (!tokens || !spreadsheetId || !expense) {
    return res.status(400).json({ error: "Faltan datos para el gasto" });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Gastos!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          expense.id,
          expense.timestamp,
          expense.description,
          expense.amount,
          expense.category,
          expense.username,
          expense.notes
        ]]
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 7. Record a Sale
app.post("/api/sheets/sale", async (req, res) => {
  const { tokens, spreadsheetId, sale, productId } = req.body;
  if (!tokens || !spreadsheetId || !sale) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Ventas!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          sale.id,
          sale.timestamp,
          sale.productName,
          sale.category,
          sale.quantity,
          sale.amount / sale.quantity,
          sale.amount,
          sale.paymentMethod,
          sale.username || ""
        ]]
      }
    });

    const inventoryRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Inventario!A2:E" });
    const inventoryRows = inventoryRes.data.values || [];
    const rowIndex = inventoryRows.findIndex((row, idx) => {
      const id = row[0] || `row-${idx + 2}`;
      return id === productId;
    });

    if (rowIndex !== -1) {
      const currentStock = parseInt(inventoryRows[rowIndex][4]) || 0;
      const newStock = currentStock - sale.quantity;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Inventario!E${rowIndex + 2}`,
        valueInputOption: "RAW",
        requestBody: { values: [[newStock]] }
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Movimientos!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            new Date().toLocaleString(),
            productId,
            sale.productName,
            "Salida (Venta)",
            -sale.quantity,
            newStock,
            `Venta ID: ${sale.id}`,
            sale.username || ""
          ]]
        }
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error recording sale:", error);
    res.status(500).json({ error: error.message });
  }
});

// 8. Update Stock
app.post("/api/sheets/inventory/update", async (req, res) => {
  const { tokens, spreadsheetId, productId, adjustment, notes } = req.body;
  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    const inventoryRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Inventario!A2:E" });
    const inventoryRows = inventoryRes.data.values || [];
    const rowIndex = inventoryRows.findIndex((row, idx) => {
      const id = row[0] || `row-${idx + 2}`;
      return id === productId;
    });

    if (rowIndex !== -1) {
      const currentStock = parseInt(inventoryRows[rowIndex][4]) || 0;
      const newStock = currentStock + adjustment;
      
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `Inventario!E${rowIndex + 2}`,
        valueInputOption: "RAW",
        requestBody: { values: [[newStock]] }
      });

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Movimientos!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: {
          values: [[
            new Date().toLocaleString(),
            productId,
            inventoryRows[rowIndex][1],
            adjustment > 0 ? "Entrada" : "Ajuste/Salida",
            adjustment,
            newStock,
            notes || "",
            req.body.username || ""
          ]]
        }
      });
    }
    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 9. Add Product
app.post("/api/sheets/inventory/add", async (req, res) => {
  const { tokens, spreadsheetId, product } = req.body;
  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Inventario!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          product.id,
          product.name,
          product.category,
          product.price,
          product.stock,
          product.icon
        ]]
      }
    });

    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: "Movimientos!A1",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[
          new Date().toLocaleString(),
          product.id,
          product.name,
          "Alta de Producto",
          product.stock,
          product.stock,
          "Registro inicial",
          req.body.username || ""
        ]]
      }
    });

    res.json({ success: true });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// 10. Sync Pending Accounts
app.post("/api/sheets/pending-accounts/sync", async (req, res) => {
  const { tokens, spreadsheetId, accounts } = req.body;
  if (!tokens || !spreadsheetId || !accounts) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    oauth2Client.setCredentials(tokens);
    const sheets = google.sheets({ version: "v4", auth: oauth2Client });

    // Clear existing accounts (except headers) and write new ones
    await sheets.spreadsheets.values.clear({
      spreadsheetId,
      range: "Cuentas Pendientes!A2:Z"
    });

    if (accounts.length > 0) {
      const values = accounts.map((acc: any) => [
        acc.id,
        acc.customerName,
        acc.createdAt,
        acc.updatedAt,
        JSON.stringify(acc.items),
        JSON.stringify(acc.payments || []),
        acc.status || 'Abierta'
      ]);

      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: "Cuentas Pendientes!A2",
        valueInputOption: "USER_ENTERED",
        requestBody: { values }
      });
    }

    res.json({ success: true });
  } catch (error: any) {
    console.error("Error syncing pending accounts:", error);
    res.status(500).json({ error: error.message });
  }
});

export default app;
