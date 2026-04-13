import { useState } from 'react';
import { Sale, Expense, CashLog } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Receipt, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateDailyReport } from '../lib/pdfGenerator';

interface SalesHistoryProps {
  sales: Sale[];
  expenses: Expense[];
  cashLogs: CashLog[];
}

export function SalesHistory({ sales, expenses, cashLogs }: SalesHistoryProps) {
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

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

  // Group sales by date
  const groupedSales = sales.reduce((acc, sale) => {
    const date = parseESDate(sale.timestamp).toLocaleDateString('es-MX');
    if (!acc[date]) acc[date] = [];
    acc[date].push(sale);
    return acc;
  }, {} as Record<string, Sale[]>);

  // Get unique dates sorted descending
  const sortedDates = Object.keys(groupedSales).sort((a, b) => {
    return parseESDate(b).getTime() - parseESDate(a).getTime();
  }).slice(0, 5); // Max 5 days

  const currentDate = sortedDates[selectedDayOffset];
  const currentSales = currentDate ? groupedSales[currentDate] : [];
  const currentTotal = currentSales.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-parchment overflow-hidden flex flex-col min-h-[600px]">
        <div className="px-6 py-4 border-b border-parchment flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-4">
            <h3 className="font-serif text-base text-espresso flex items-center gap-2">
              <Receipt size={18} />
              Registros de Ventas
            </h3>
            {currentDate && (
              <span className="px-3 py-1 bg-espresso/5 rounded-full text-[10px] font-bold text-espresso uppercase tracking-widest">
                {currentDate === new Date().toLocaleDateString('es-MX') ? 'Hoy' : currentDate}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-dust">{currentSales.length} items</span>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-cream/30 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Hora</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Producto</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Categoría</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Pago</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider text-right">Monto</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment">
              {currentSales.map((sale, index) => (
                <tr key={`${sale.id}-${index}`} className="hover:bg-cream/20 transition-colors">
                  <td className="px-4 py-3 text-dust">
                    {sale.timestamp.includes(',') ? sale.timestamp.split(',')[1].trim() : sale.timestamp}
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink">{sale.productName}</div>
                  </td>
                  <td className="px-4 py-3 text-dust">{sale.category}</td>
                  <td className="px-4 py-3">
                    <span className={cn(
                      "px-2 py-1 rounded-lg text-[11px] font-bold uppercase tracking-wider block w-fit max-w-[150px] truncate",
                      sale.paymentMethod.includes('Gratis') ? "bg-parchment text-dust" : "bg-espresso/10 text-espresso"
                    )} title={sale.paymentMethod}>
                      {sale.paymentMethod}
                    </span>
                  </td>
                  <td className="px-4 py-3 font-serif text-espresso font-semibold text-right">{formatCurrency(sale.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentSales.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-dust text-sm italic opacity-50 space-y-2 py-20">
              <Receipt size={40} strokeWidth={1} />
              <p>No hay ventas registradas para este día</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t border-parchment bg-cream/30 space-y-4">
          {/* Pagination Controls */}
          {sortedDates.length > 1 && (
            <div className="flex items-center justify-center gap-4 pb-2">
              <button 
                onClick={() => setSelectedDayOffset(prev => Math.max(prev - 1, 0))}
                disabled={selectedDayOffset === 0}
                className="p-2 rounded-full hover:bg-espresso/5 text-espresso disabled:opacity-30 transition-colors"
                title="Día Siguiente"
              >
                <ChevronLeft size={20} />
              </button>
              
              <div className="flex gap-2">
                {sortedDates.map((_, idx) => (
                  <div 
                    key={idx}
                    className={cn(
                      "w-2 h-2 rounded-full transition-all",
                      selectedDayOffset === idx ? "bg-gold w-4" : "bg-dust/30"
                    )}
                  />
                ))}
              </div>

              <button 
                onClick={() => setSelectedDayOffset(prev => Math.min(prev + 1, sortedDates.length - 1))}
                disabled={selectedDayOffset === sortedDates.length - 1}
                className="p-2 rounded-full hover:bg-espresso/5 text-espresso disabled:opacity-30 transition-colors"
                title="Día Anterior"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          )}

          <div className="flex justify-between items-center">
            <button 
              onClick={() => generateDailyReport(sales, expenses, cashLogs)}
              disabled={currentSales.length === 0}
              className="px-8 py-3 bg-espresso text-cream rounded-xl font-medium text-sm hover:bg-bark transition-colors shadow-lg shadow-espresso/10 flex items-center justify-center gap-2 disabled:opacity-50"
            >
              <FileText size={18} />
              Imprimir Corte (PDF)
            </button>
            <div className="flex flex-col text-left">
              <span className="text-[11px] font-bold text-dust uppercase tracking-widest">Total del Día</span>
              <span className="font-serif text-2xl text-espresso font-bold">
                {formatCurrency(currentTotal)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
