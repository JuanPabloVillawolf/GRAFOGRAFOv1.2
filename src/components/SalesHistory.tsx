import { useState } from 'react';
import { Sale, Expense, CashLog } from '../types';
import { formatCurrency, cn, parseESDate, getTodayMX } from '../lib/utils';
import { Receipt, FileText, ChevronLeft, ChevronRight } from 'lucide-react';
import { generateDailyReport } from '../lib/pdfGenerator';

interface SalesHistoryProps {
  sales: Sale[];
  expenses: Expense[];
  cashLogs: CashLog[];
}

export function SalesHistory({ sales, expenses, cashLogs }: SalesHistoryProps) {
  const [selectedDayOffset, setSelectedDayOffset] = useState(0);

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
  const currentSales = currentDate ? [...groupedSales[currentDate]].sort((a, b) => parseESDate(b.timestamp).getTime() - parseESDate(a.timestamp).getTime()) : [];
  const currentTotal = currentSales.reduce((acc, s) => acc + s.amount, 0);

  return (
    <div className="max-w-none mx-auto space-y-6 px-2 lg:px-4">
      <div className="bg-white rounded-2xl border border-parchment overflow-hidden flex flex-col min-h-[750px] shadow-sm">
        <div className="px-8 py-5 border-b border-parchment flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-6">
            <h3 className="font-serif text-xl text-espresso flex items-center gap-3">
              <Receipt size={24} className="text-bark" />
              Registro Detallado de Ventas
            </h3>
            {currentDate && (
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 bg-espresso text-cream rounded-full text-xs font-bold uppercase tracking-widest">
                  {currentDate === getTodayMX().toLocaleDateString('es-MX') ? 'Hoy' : currentDate}
                </span>
                <span className="text-xs text-dust font-medium italic">
                  {currentSales.length} transacciones registradas
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right flex flex-col mr-4">
              <span className="text-[10px] font-bold text-dust uppercase tracking-widest">Venta del día</span>
              <span className="text-xl font-bold text-espresso">{formatCurrency(currentTotal)}</span>
            </div>
            <button 
              onClick={() => generateDailyReport(sales, expenses, cashLogs, currentDate || getTodayMX().toLocaleDateString('es-MX'))}
              disabled={currentSales.length === 0}
              className="px-6 py-2.5 bg-bark text-white rounded-xl font-bold text-xs hover:bg-espresso transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
            >
              <FileText size={16} />
              PDF
            </button>
          </div>
        </div>
        
        <div className="flex-1 overflow-auto bg-white">
          <div className="min-w-full inline-block align-middle">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm border-separate border-spacing-0">
                <thead className="bg-parchment/30 sticky top-0 z-10 backdrop-blur-md">
                  <tr>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Hora</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Producto</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Categoría</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Método de Pago</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Responsable</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] text-right border-b border-parchment/50">Importe</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment/50">
                  {currentSales.map((sale, index) => (
                    <tr key={`${sale.id}-${index}`} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-6 py-4 text-dust font-mono text-xs whitespace-nowrap">
                        {sale.timestamp.includes(',') ? sale.timestamp.split(',')[1].trim() : sale.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-espresso group-hover:text-bark transition-colors">{sale.productName}</div>
                        {sale.note && (
                          <div className="text-[10px] text-dust italic mt-0.5 truncate max-w-[200px]" title={sale.note}>
                            Nota: {sale.note}
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2.5 py-1 bg-parchment/40 text-bark rounded-lg text-[10px] font-bold uppercase tracking-tight">
                          {sale.category}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={cn(
                          "px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider block w-fit shadow-sm border",
                          sale.paymentMethod.includes('Gratis') 
                            ? "bg-white border-parchment text-dust" 
                            : "bg-espresso border-espresso text-cream"
                        )}>
                          {sale.paymentMethod}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2 text-dust">
                          <div className="w-6 h-6 rounded-full bg-parchment flex items-center justify-center text-[10px] font-bold text-bark uppercase">
                            {sale.username?.substring(0, 2) || '??'}
                          </div>
                          <span className="text-xs font-semibold">{sale.username || 'Sistema'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 font-serif text-espresso font-bold text-right text-base tracking-tight whitespace-nowrap">
                        {formatCurrency(sale.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {currentSales.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-dust text-sm italic opacity-50 space-y-4 py-32">
              <div className="w-20 h-20 bg-parchment/20 rounded-full flex items-center justify-center">
                <Receipt size={48} strokeWidth={1} />
              </div>
              <p className="text-base">No se encontraron registros para este periodo</p>
            </div>
          )}
        </div>

        <div className="px-8 py-6 border-t border-parchment bg-cream/10 flex flex-col items-center gap-6">
          {/* Pagination Controls */}
          {sortedDates.length > 1 && (
            <div className="flex items-center gap-8">
              <button 
                onClick={() => setSelectedDayOffset(prev => Math.max(prev - 1, 0))}
                disabled={selectedDayOffset === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-espresso hover:text-cream text-espresso disabled:opacity-30 transition-all font-bold text-xs uppercase tracking-widest border border-parchment shadow-sm"
              >
                <ChevronLeft size={16} />
                Siguiente
              </button>
              
              <div className="flex gap-3">
                {sortedDates.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDayOffset(idx)}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all border border-bark/20",
                      selectedDayOffset === idx ? "bg-gold scale-125 border-gold ring-4 ring-gold/10" : "bg-dust/20 hover:bg-dust/40"
                    )}
                  />
                ))}
              </div>

              <button 
                onClick={() => setSelectedDayOffset(prev => Math.min(prev + 1, sortedDates.length - 1))}
                disabled={selectedDayOffset === sortedDates.length - 1}
                className="flex items-center gap-2 px-4 py-2 rounded-xl hover:bg-espresso hover:text-cream text-espresso disabled:opacity-30 transition-all font-bold text-xs uppercase tracking-widest border border-parchment shadow-sm"
              >
                Anterior
                <ChevronRight size={16} />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
