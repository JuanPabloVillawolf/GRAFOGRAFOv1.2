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
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-parchment overflow-hidden flex flex-col min-h-[600px]">
        <div className="px-6 py-4 border-b border-parchment flex items-center justify-between bg-cream/50">
          <div className="flex items-center gap-4">
            <h3 className="font-serif text-base text-espresso flex items-center gap-2">
              <History size={18} />
              Registros de Inventario
            </h3>
            {currentDate && (
              <span className="px-3 py-1 bg-espresso/5 rounded-full text-[10px] font-bold text-espresso uppercase tracking-widest">
                {currentDate === new Date().toLocaleDateString('es-MX') ? 'Hoy' : currentDate}
              </span>
            )}
          </div>
          <span className="text-[10px] uppercase tracking-widest text-dust">{currentMovements.length} movimientos</span>
        </div>
        
        <div className="flex-1 overflow-auto">
          <table className="w-full text-left text-[13px]">
            <thead className="bg-cream/30 sticky top-0">
              <tr>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Hora</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Producto</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Tipo</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider text-center">Cant.</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider text-center">Stock Final</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Usuario</th>
                <th className="px-4 py-2 font-medium text-dust uppercase tracking-wider">Notas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-parchment">
              {currentMovements.map((move, index) => (
                <tr key={`${move.timestamp}-${index}`} className="hover:bg-cream/20 transition-colors">
                  <td className="px-4 py-3 text-dust whitespace-nowrap">
                    {move.timestamp.includes(',') ? move.timestamp.split(',')[1].trim() : move.timestamp}
                  </td>
                  <td className="px-4 py-3 font-medium text-ink">{move.productName}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-1.5">
                      {move.type.includes('Entrada') || move.type.includes('Alta') ? (
                        <ArrowUpRight size={12} className="text-green-600" />
                      ) : move.type.includes('Salida') ? (
                        <ArrowDownLeft size={12} className="text-red-500" />
                      ) : (
                        <History size={12} className="text-dust" />
                      )}
                      <span className={cn(
                        "px-2 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider",
                        move.type.includes('Entrada') || move.type.includes('Alta') ? "bg-green-100 text-green-700" :
                        move.type.includes('Salida') ? "bg-red-100 text-red-700" : "bg-parchment text-dust"
                      )}>
                        {move.type}
                      </span>
                    </div>
                  </td>
                  <td className={cn(
                    "px-4 py-3 text-center font-bold",
                    move.quantity > 0 ? "text-green-600" : "text-red-500"
                  )}>
                    {move.quantity > 0 ? `+${move.quantity}` : move.quantity}
                  </td>
                  <td className="px-4 py-3 text-center font-medium text-espresso">{move.stockResult}</td>
                  <td className="px-4 py-3 text-dust font-medium whitespace-nowrap">{move.username || '---'}</td>
                  <td className="px-4 py-3 text-dust italic max-w-xs truncate" title={move.notes}>
                    {move.notes}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {currentMovements.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-dust text-sm italic opacity-50 space-y-2 py-20">
              <History size={40} strokeWidth={1} />
              <p>No hay movimientos registrados para este día</p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {sortedDates.length > 1 && (
          <div className="p-4 border-t border-parchment bg-cream/30 flex items-center justify-center gap-4">
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
      </div>
    </div>
  );
}
