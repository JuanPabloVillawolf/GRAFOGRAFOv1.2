import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Sale, Expense, CashLog } from '../types';
import { formatCurrency } from './utils';

// Helper to parse "DD/MM/YYYY HH:MM:SS" or similar es-MX strings
const parseESDate = (str: string) => {
  if (!str) return new Date();
  const match = str.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (match) {
    const day = parseInt(match[1]);
    const month = parseInt(match[2]) - 1;
    const year = parseInt(match[3]);
    return new Date(year, month, day);
  }
  return new Date(str);
};

const isToday = (dateStr: string) => {
  const date = parseESDate(dateStr);
  const today = new Date();
  return date.getDate() === today.getDate() &&
         date.getMonth() === today.getMonth() &&
         date.getFullYear() === today.getFullYear();
};

const normalizeMethod = (method: string): string => {
  // Extract first part before space or parenthesis
  const base = method.split(' ')[0].split('(')[0];
  return base
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[.,:;]/g, "") // Remove punctuation
    .trim()
    .toLowerCase()
    .replace(/^\w/, (c) => c.toUpperCase()); // Capitalize first letter
};

export const generateDailyReport = (sales: Sale[], expenses: Expense[], cashLogs: CashLog[]) => {
  const doc = new jsPDF();
  const now = new Date();
  const dateStr = now.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const timeStr = now.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' });
  
  const colors = {
    espresso: [44, 24, 16] as [number, number, number],
    gold: [212, 175, 55] as [number, number, number],
    cream: [245, 245, 240] as [number, number, number],
    dust: [140, 126, 109] as [number, number, number]
  };

  // --- HEADER ---
  doc.setFillColor(...colors.espresso);
  doc.rect(0, 0, 210, 40, 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFont('times', 'bold');
  doc.setFontSize(26);
  doc.text('Grafógrafo', 105, 18, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(...colors.gold);
  doc.text('CORTE DE CAJA DIARIO', 105, 26, { align: 'center' });
  
  doc.setTextColor(200, 200, 200);
  doc.setFontSize(9);
  doc.text(`Fecha: ${dateStr}  |  Hora de Corte: ${timeStr}`, 105, 33, { align: 'center' });

  let y = 50;

  // --- DATA FILTERING ---
  const todaySales = sales.filter(s => isToday(s.timestamp));
  const todayExpenses = expenses.filter(e => isToday(e.timestamp));
  const todayCashLogs = cashLogs.filter(log => isToday(log.timestamp));

  // --- CALCULATIONS ---
  const totalSales = todaySales.reduce((acc, s) => acc + s.amount, 0);
  const totalExpenses = todayExpenses.reduce((acc, e) => acc + e.amount, 0);
  const initialFund = todayCashLogs
    .filter(log => log.type === 'Fondo Inicial')
    .reduce((sum, log) => sum + log.amount, 0);
    
  const balanceFinal = totalSales - totalExpenses + initialFund;

  // --- 1. RESUMEN GENERAL ---
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.espresso);
  doc.text('1. RESUMEN GENERAL', 14, y);
  y += 6;

  autoTable(doc, {
    startY: y,
    head: [['Concepto', 'Monto']],
    body: [
      ['Ventas Totales (Ingresos)', formatCurrency(totalSales)],
      ['Gastos Totales (Egresos)', `-${formatCurrency(totalExpenses)}`],
      ['Fondo de Caja Inicial', formatCurrency(initialFund)],
      ['Balance Neto Final', formatCurrency(balanceFinal)]
    ],
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 2 },
    headStyles: { halign: 'left' },
    columnStyles: { 
      0: { cellWidth: 140 },
      1: { halign: 'right', fontStyle: 'bold' } 
    },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 1) {
        data.cell.styles.halign = 'right';
      }
    },
    margin: { left: 14, right: 14 }
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- 2. MÉTODOS DE PAGO ---
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.text('2. MÉTODOS DE PAGO', 14, y);
  y += 6;

  const paymentBreakdown: Record<string, number> = {};
  todaySales.forEach(sale => {
    const rawMethods = sale.paymentMethod.split('+').map(m => m.trim());
    const splitAmount = sale.amount / rawMethods.length;
    
    rawMethods.forEach(m => {
      const normalized = normalizeMethod(m);
      paymentBreakdown[normalized] = (paymentBreakdown[normalized] || 0) + splitAmount;
    });
  });

  autoTable(doc, {
    startY: y,
    head: [['Método', 'Total']],
    body: Object.entries(paymentBreakdown).map(([method, amount]) => [method, formatCurrency(amount)]),
    theme: 'plain',
    styles: { fontSize: 9, cellPadding: 1.5 },
    columnStyles: { 
      0: { cellWidth: 140 },
      1: { halign: 'right' } 
    },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 1) {
        data.cell.styles.halign = 'right';
      }
    },
    margin: { left: 14, right: 14 }
  });

  y = (doc as any).lastAutoTable.finalY + 10;

  // --- 3. VENTAS POR CATEGORÍA ---
  doc.setFont('times', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(...colors.espresso);
  doc.text('3. VENTAS POR CATEGORÍA', 14, y);
  y += 6;

  const categoryData: any[] = [];
  const categories = [...new Set(todaySales.map(s => s.category))];
  
  categories.forEach(cat => {
    const catSales = todaySales.filter(s => s.category === cat);
    const catTotal = catSales.reduce((sum, s) => sum + s.amount, 0);
    
    categoryData.push([
      { content: cat, styles: { fontStyle: 'bold', fillColor: [245, 245, 240] } },
      { content: formatCurrency(catTotal), styles: { halign: 'right', fontStyle: 'bold', fillColor: [245, 245, 240] } }
    ]);
    
    const productMap: Record<string, { qty: number, total: number }> = {};
    catSales.forEach(s => {
      if (!productMap[s.productName]) productMap[s.productName] = { qty: 0, total: 0 };
      productMap[s.productName].qty += s.quantity;
      productMap[s.productName].total += s.amount;
    });
    
    Object.entries(productMap).forEach(([name, data]) => {
      categoryData.push([`   ${name} (x${data.qty})`, formatCurrency(data.total)]);
    });
  });

  autoTable(doc, {
    startY: y,
    body: categoryData,
    theme: 'plain',
    styles: { fontSize: 8.5, cellPadding: 1.5 },
    columnStyles: { 
      0: { cellWidth: 140 },
      1: { halign: 'right' } 
    },
    margin: { left: 14, right: 14 }
  });

  // --- PAGE 2: DETALLE DE MOVIMIENTOS ---
  doc.addPage();
  y = 20;

  doc.setFont('times', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(...colors.espresso);
  doc.text('DETALLE DE MOVIMIENTOS (INGRESOS Y GASTOS)', 14, y);
  y += 8;

  const allMovements = [
    ...todaySales.map(s => ({
      time: s.timestamp.split(',')[1]?.trim() || s.timestamp,
      type: 'INGRESO',
      concept: s.productName,
      category: s.category,
      amount: s.amount,
      color: [21, 128, 61]
    })),
    ...todayExpenses.map(e => ({
      time: e.timestamp.split(',')[1]?.trim() || e.timestamp,
      type: 'GASTO',
      concept: e.description,
      category: e.category,
      amount: -e.amount,
      color: [185, 28, 28]
    }))
  ].sort((a, b) => a.time.localeCompare(b.time));

  autoTable(doc, {
    startY: y,
    head: [['Hora', 'Tipo', 'Concepto', 'Categoría', 'Monto']],
    body: allMovements.map(m => [
      m.time,
      m.type,
      m.concept,
      m.category,
      formatCurrency(m.amount)
    ]),
    headStyles: { fillColor: colors.espresso },
    alternateRowStyles: { fillColor: colors.cream },
    styles: { fontSize: 8 },
    columnStyles: { 
      4: { halign: 'right', fontStyle: 'bold' }
    },
    didParseCell: (data) => {
      if (data.section === 'head' && data.column.index === 4) {
        data.cell.styles.halign = 'right';
      }
      if (data.section === 'body' && data.column.index === 1) {
        if (data.cell.raw === 'INGRESO') data.cell.styles.textColor = [21, 128, 61];
        if (data.cell.raw === 'GASTO') data.cell.styles.textColor = [185, 28, 28];
      }
      if (data.section === 'body' && data.column.index === 4) {
        const val = data.cell.raw as string;
        if (val.includes('-')) data.cell.styles.textColor = [185, 28, 28];
        else data.cell.styles.textColor = [21, 128, 61];
      }
    },
    margin: { left: 14, right: 14 }
  });

  // --- FOOTER ---
  const pageCount = (doc as any).internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(...colors.dust);
    doc.text(`Página ${i} de ${pageCount}  |  Grafógrafo POS  |  Generado: ${dateStr} ${timeStr}`, 105, 285, { align: 'center' });
  }

  // Save the PDF
  const fileName = `Corte_Caja_${dateStr.replace(/\//g, '-')}.pdf`;
  doc.save(fileName);
};
