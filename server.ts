import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { google } from "googleapis";
import dotenv from "dotenv";
import serverless from "serverless-http";

dotenv.config();

const app = express();
const PORT = 3000;

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
      // In a real app, you'd store tokens in a session or DB.
      // For this demo, we'll send them back to the client to store in localStorage (less secure but works for demo).
      
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

  // 3. Get Data from Google Sheets (Inventory and Sales)
  app.post("/api/sheets/data", async (req, res) => {
    const { tokens, spreadsheetId } = req.body;
    if (!tokens || !spreadsheetId) {
      return res.status(400).json({ error: "Tokens and Spreadsheet ID are required" });
    }

    try {
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: "v4", auth: oauth2Client });

      const requiredSheets = [
        { title: "Inventario", headers: ["ID", "Nombre", "Categoría", "Precio", "Stock", "Icono"] },
        { title: "Ventas", headers: ["ID Transacción", "Fecha/Hora", "Producto", "Categoría", "Cantidad", "Precio Unit.", "Total", "Método de Pago", "Usuario", "Nota"] },
        { title: "Movimientos", headers: ["Fecha/Hora", "ID Producto", "Producto", "Tipo", "Cantidad", "Stock Resultante", "Notas", "Usuario"] },
        { title: "Usuarios", headers: ["Usuario", "Contraseña", "Nombre", "Rol"] },
        { title: "Caja", headers: ["Fecha", "Usuario", "Tipo", "Monto", "Notas"] },
        { title: "Gastos", headers: ["ID", "Fecha/Hora", "Concepto", "Monto", "Categoría", "Usuario", "Notas"] },
        { title: "Cuentas Pendientes", headers: ["ID", "Cliente", "Fecha Creación", "Última Actualización", "Items (JSON)", "Pagos (JSON)", "Estado"] }
      ];

      // Try to fetch data first (saves 1 read request if sheets exist)
      let batchRes;
      try {
        batchRes = await sheets.spreadsheets.values.batchGet({
          spreadsheetId,
          ranges: requiredSheets.map(s => `${s.title}!A2:L`)
        });
      } catch (err: any) {
        // If sheets don't exist, initialize them
        if (err.message?.includes("range") || err.message?.includes("not found") || err.code === 400) {
          const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
          const sheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title || "") || [];

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
              } catch (initErr: any) {
                if (!initErr.message?.includes("already exists")) throw initErr;
              }
            }
          }
          // Retry fetch
          batchRes = await sheets.spreadsheets.values.batchGet({
            spreadsheetId,
            ranges: requiredSheets.map(s => `${s.title}!A2:L`)
          });
        } else {
          throw err;
        }
      }

      const valueRanges = batchRes.data.valueRanges || [];
      
      const getSheetValues = (title: string) => {
        const vr = valueRanges.find(v => {
          if (!v.range) return false;
          // Extract sheet name from range string (e.g., "'Sheet Name'!A2:H" or "SheetName!A2:H")
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
        username: row[8] || "",
        note: row[9] || ""
      })).reverse(); // Newest first

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
        // If no users exist yet, allow a default admin login for first time setup
        if (rows.length === 0 && username === "admin" && password === "admin") {
          // Auto-create admin in sheet
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
      const now = new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana' });

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

      // 1. Append to Ventas
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
            sale.quantity > 0 ? sale.amount / sale.quantity : 0,
            sale.amount,
            sale.paymentMethod,
            sale.username || "",
            sale.note || ""
          ]]
        }
      });

      // 2. Update Inventory Stock (only if quantity is not 0)
      if (sale.quantity !== 0) {
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

          // 3. Record Movement
          await sheets.spreadsheets.values.append({
            spreadsheetId,
            range: "Movimientos!A1",
            valueInputOption: "USER_ENTERED",
            requestBody: {
              values: [[
                new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana' }),
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
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error recording sale:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 7b. Record Batch Sales (Optimized for multiple items/payments)
  app.post("/api/sheets/sales/batch", async (req, res) => {
    const { tokens, spreadsheetId, sales, inventoryUpdates } = req.body;
    if (!tokens || !spreadsheetId || !sales || !Array.isArray(sales)) {
      return res.status(400).json({ error: "Faltan datos para ventas masivas" });
    }

    try {
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: "v4", auth: oauth2Client });

      // 1. Record all sales in one append call
      const saleValues = sales.map((s: any) => [
        s.id,
        s.timestamp,
        s.productName,
        s.category,
        s.quantity,
        s.quantity > 0 ? s.amount / s.quantity : 0,
        s.amount,
        s.paymentMethod,
        s.username || "",
        s.note || ""
      ]);

      await sheets.spreadsheets.values.append({
        spreadsheetId,
        range: "Ventas!A1",
        valueInputOption: "USER_ENTERED",
        requestBody: { values: saleValues }
      });

      // 2. Batch update inventory movements
      if (inventoryUpdates && Array.isArray(inventoryUpdates) && inventoryUpdates.length > 0) {
        const movementValues = inventoryUpdates.map((m: any) => [
          m.timestamp,
          m.productId,
          m.productName,
          m.type,
          m.quantity,
          m.stockResult,
          m.notes,
          m.username
        ]);

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Movimientos!A1",
          valueInputOption: "USER_ENTERED",
          requestBody: { values: movementValues }
        });

        // 3. Update individual stock cells (This is still single-calls unfortunately for Sheets API v4 batch values update, 
        // but we can group them if needed. For now, since it's inventory, it's safer per-row).
        // Actually, let's keep it simple but reliable.
        for (const update of inventoryUpdates) {
          const inventoryRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Inventario!A2:E" });
          const inventoryRows = inventoryRes.data.values || [];
          const rowIndex = inventoryRows.findIndex((row, idx) => (row[0] || `row-${idx + 2}`) === update.productId);
          
          if (rowIndex !== -1) {
            const currentStock = parseInt(inventoryRows[rowIndex][4]) || 0;
            const newStock = currentStock + update.quantity; // adjustment is expected to be negative for sales
            await sheets.spreadsheets.values.update({
              spreadsheetId,
              range: `Inventario!E${rowIndex + 2}`,
              valueInputOption: "RAW",
              requestBody: { values: [[newStock]] }
            });
          }
        }
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error in batch sales:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 5. Update Stock
  app.post("/api/sheets/inventory/update", async (req, res) => {
    const { tokens, spreadsheetId, productId, adjustment, notes, icon } = req.body;
    try {
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: "v4", auth: oauth2Client });

      const inventoryRes = await sheets.spreadsheets.values.get({ spreadsheetId, range: "Inventario!A2:F" });
      const inventoryRows = inventoryRes.data.values || [];
      const rowIndex = inventoryRows.findIndex((row, idx) => {
        const id = row[0] || `row-${idx + 2}`;
        return id === productId;
      });

      if (rowIndex !== -1) {
        const currentStock = parseInt(inventoryRows[rowIndex][4]) || 0;
        const newStock = currentStock + adjustment;
        
        // Update both stock (E) and icon (F)
        await sheets.spreadsheets.values.update({
          spreadsheetId,
          range: `Inventario!E${rowIndex + 2}:F${rowIndex + 2}`,
          valueInputOption: "RAW",
          requestBody: { values: [[newStock, icon || inventoryRows[rowIndex][5] || ""]] }
        });

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: "Movimientos!A1",
          valueInputOption: "USER_ENTERED",
          requestBody: {
            values: [[
              new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana' }),
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

  // 6. Add Product
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
            new Date().toLocaleString('es-MX', { hour12: false }),
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

  // 7. Export to Google Sheets (Original, kept for compatibility if needed)
  app.post("/api/export-sheets", async (req, res) => {
    const { tokens, updates, title, spreadsheetId: existingId } = req.body;

    if (!tokens) {
      return res.status(401).json({ error: "No tokens provided" });
    }

    try {
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: "v4", auth: oauth2Client });

      let spreadsheetId = existingId;
      let spreadsheetUrl = "";
      let existingSheets: string[] = [];

      if (!spreadsheetId) {
        // Create a new spreadsheet if no ID provided
        const spreadsheet = await sheets.spreadsheets.create({
          requestBody: {
            properties: {
              title: title || `Reporte Grafógrafo - ${new Date().toLocaleDateString('es-MX', { timeZone: 'America/Tijuana' })}`,
            },
          },
        });
        spreadsheetId = spreadsheet.data.spreadsheetId;
        spreadsheetUrl = spreadsheet.data.spreadsheetUrl || "";
        existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title || "") || [];
      } else {
        // Get existing spreadsheet info
        try {
          const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
          spreadsheetUrl = spreadsheet.data.spreadsheetUrl || "";
          existingSheets = spreadsheet.data.sheets?.map(s => s.properties?.title || "") || [];
        } catch (err: any) {
          if (err.code === 404) {
            throw new Error("El ID de la hoja de cálculo no es válido o el archivo no existe.");
          }
          throw err;
        }
      }

      // Process each update (one per sheet/category)
      for (const update of updates) {
        const { sheetName, values, append = true } = update;
        
        // If sheet doesn't exist, create it
        if (!existingSheets.includes(sheetName)) {
          try {
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: spreadsheetId!,
              requestBody: {
                requests: [{
                  addSheet: {
                    properties: { 
                      title: sheetName,
                      gridProperties: { frozenRowCount: 1 }
                    }
                  }
                }]
              }
            });
            existingSheets.push(sheetName);
            
            // Add headers for the new sheet
            await sheets.spreadsheets.values.update({
              spreadsheetId: spreadsheetId!,
              range: `${sheetName}!A1`,
              valueInputOption: "RAW",
              requestBody: {
                values: [["ID Transacción", "Fecha/Hora", "Producto", "Categoría", "Cantidad", "Precio Unit.", "Total"]]
              }
            });

            // Format headers (Bold, Background Color)
            await sheets.spreadsheets.batchUpdate({
              spreadsheetId: spreadsheetId!,
              requestBody: {
                requests: [
                  {
                    repeatCell: {
                      range: {
                        sheetId: (await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId! })).data.sheets?.find(s => s.properties?.title === sheetName)?.properties?.sheetId,
                        startRowIndex: 0,
                        endRowIndex: 1
                      },
                      cell: {
                        userEnteredFormat: {
                          backgroundColor: { red: 0.1, green: 0.1, blue: 0.1 },
                          textFormat: { 
                            foregroundColor: { red: 1, green: 1, blue: 1 }, 
                            bold: true 
                          },
                          horizontalAlignment: "CENTER"
                        }
                      },
                      fields: "userEnteredFormat(backgroundColor,textFormat,horizontalAlignment)"
                    }
                  },
                  {
                    updateSheetProperties: {
                      properties: {
                        sheetId: (await sheets.spreadsheets.get({ spreadsheetId: spreadsheetId! })).data.sheets?.find(s => s.properties?.title === sheetName)?.properties?.sheetId,
                        gridProperties: { frozenRowCount: 1 }
                      },
                      fields: "gridProperties.frozenRowCount"
                    }
                  }
                ]
              }
            });
          } catch (err) {
            console.error(`Error creating/formatting sheet ${sheetName}:`, err);
          }
        }

        const targetSheet = update.sheetName;
        
        if (append) {
          await sheets.spreadsheets.values.append({
            spreadsheetId: spreadsheetId!,
            range: `${targetSheet}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
          });
        } else {
          await sheets.spreadsheets.values.update({
            spreadsheetId: spreadsheetId!,
            range: `${targetSheet}!A1`,
            valueInputOption: "USER_ENTERED",
            requestBody: { values },
          });
        }
      }

      res.json({ success: true, url: spreadsheetUrl });
    } catch (error: any) {
      console.error("Error exporting to sheets:", error);
      res.status(500).json({ error: error.message });
    }
  });

  // 10. Sync Pending Accounts
  app.post("/api/sheets/pending-accounts/sync", async (req, res) => {
    const { tokens, spreadsheetId, accounts } = req.body;
    if (!tokens || !spreadsheetId || !accounts) {
      return res.status(400).json({ error: "Faltan datos para sincronizar cuentas" });
    }

    try {
      oauth2Client.setCredentials(tokens);
      const sheets = google.sheets({ version: "v4", auth: oauth2Client });

      // Overwrite the entire Cuentas Pendientes sheet with the current state
      // First, clear existing data (except headers)
      await sheets.spreadsheets.values.clear({
        spreadsheetId,
        range: "Cuentas Pendientes!A2:G",
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
          valueInputOption: "RAW",
          requestBody: { values }
        });
      }

      res.json({ success: true });
    } catch (error: any) {
      console.error("Error syncing pending accounts:", error);
      res.status(500).json({ error: error.message });
    }
  });

// Production/Development middleware
async function setupMiddleware() {
  if (process.env.NODE_ENV === "production" || process.env.NETLIFY) {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  } else {
    try {
      const { createServer } = await import("vite");
      const vite = await createServer({
        server: { middlewareMode: true },
        appType: "spa",
      });
      app.use(vite.middlewares);
    } catch (e) {
      console.warn("Vite not found or could not be loaded dynamically");
    }
  }
}

setupMiddleware();

// Local server start
if (!process.env.NETLIFY && process.env.NODE_ENV !== "test") {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

export const handler = serverless(app);
export default app;
