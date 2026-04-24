import { useState } from 'react';
import { InventoryMovement } from '../types';
import { History, ArrowUpRight, ArrowDownLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../lib/utils';

interface InventoryHistoryProps {
  movements: InventoryMovement[];
}

export function InventoryHistory({ movements }: InventoryHistoryProps) {
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

  // Group movements by date
  const groupedMovements = movements.reduce((acc, move) => {
    const date = parseESDate(move.timestamp).toLocaleDateString('es-MX');
    if (!acc[date]) acc[date] = [];
    acc[date].push(move);
    return acc;
  }, {} as Record<string, InventoryMovement[]>);

  // Get unique dates sorted descending
  const sortedDates = Object.keys(groupedMovements).sort((a, b) => {
    return parseESDate(b).getTime() - parseESDate(a).getTime();
  }).slice(0, 5); // Max 5 days

  const currentDate = sortedDates[selectedDayOffset];
  const currentMovements = currentDate ? groupedMovements[currentDate] : [];

  return (
    <div className="max-w-none mx-auto space-y-6 px-2 lg:px-4">
      <div className="bg-white rounded-2xl border border-parchment overflow-hidden flex flex-col min-h-[750px] shadow-sm">
        <div className="px-8 py-5 border-b border-parchment flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-6">
            <h3 className="font-serif text-xl text-espresso flex items-center gap-3">
              <History size={24} className="text-bark" />
              Registro de Movimientos de Inventario
            </h3>
            {currentDate && (
              <div className="flex items-center gap-2">
                <span className="px-4 py-1.5 bg-espresso text-cream rounded-full text-xs font-bold uppercase tracking-widest">
                  {currentDate === new Date().toLocaleDateString('es-MX') ? 'Hoy' : currentDate}
                </span>
                <span className="text-xs text-dust font-medium italic">
                  {currentMovements.length} movimientos registrados
                </span>
              </div>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <span className="text-[10px] font-bold text-dust uppercase tracking-widest block mb-1">Control de Stock</span>
              <span className="text-xs font-medium text-bark italic">Historial detallado de movimientos</span>
            </div>
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
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Tipo de Movimiento</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] text-center border-b border-parchment/50">Cantidad</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] text-center border-b border-parchment/50">Stock Resultante</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Responsable</th>
                    <th className="px-6 py-4 font-bold text-espresso/70 uppercase tracking-widest text-[10px] border-b border-parchment/50">Notas / Observaciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-parchment/50">
                  {currentMovements.map((move, index) => (
                    <tr key={`${move.timestamp}-${index}`} className="hover:bg-cream/30 transition-colors group">
                      <td className="px-6 py-4 text-dust font-mono text-xs whitespace-nowrap">
                        {move.timestamp.includes(',') ? move.timestamp.split(',')[1].trim() : move.timestamp}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="font-bold text-espresso group-hover:text-bark transition-colors">{move.productName}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          <div className={cn(
                            "w-6 h-6 rounded-lg flex items-center justify-center shrink-0",
                            move.type.includes('Entrada') || move.type.includes('Alta') ? "bg-green-100 text-green-600" :
                            move.type.includes('Salida') ? "bg-red-100 text-red-600" : "bg-parchment text-dust"
                          )}>
                            {move.type.includes('Entrada') || move.type.includes('Alta') ? (
                              <ArrowUpRight size={14} />
                            ) : move.type.includes('Salida') ? (
                              <ArrowDownLeft size={14} />
                            ) : (
                              <History size={14} />
                            )}
                          </div>
                          <span className={cn(
                            "text-[10px] font-bold uppercase tracking-wider",
                            move.type.includes('Entrada') || move.type.includes('Alta') ? "text-green-700" :
                            move.type.includes('Salida') ? "text-red-700" : "text-dust"
                          )}>
                            {move.type}
                          </span>
                        </div>
                      </td>
                      <td className={cn(
                        "px-6 py-4 text-center font-mono text-base font-bold whitespace-nowrap",
                        move.quantity > 0 ? "text-green-600" : "text-red-500"
                      )}>
                        {move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center px-3 py-1 bg-parchment/30 rounded-lg font-mono text-sm font-bold text-espresso">
                          {move.stockResult}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-dust font-semibold text-xs capitalize italic whitespace-nowrap">
                        {move.username || 'Sistema'}
                      </td>
                      <td className="px-6 py-4 text-dust italic text-xs max-w-xs truncate" title={move.notes}>
                        {move.notes || '---'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          {currentMovements.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-dust text-sm italic opacity-50 space-y-4 py-32">
              <div className="w-20 h-20 bg-parchment/20 rounded-full flex items-center justify-center">
                <History size={48} strokeWidth={1} />
              </div>
              <p className="text-base font-serif">No se encontraron movimientos registrados</p>
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
