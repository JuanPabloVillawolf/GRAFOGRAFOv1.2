import { Event } from '../types';
import { formatCurrency } from '../lib/utils';
import { Calendar, Users, Plus } from 'lucide-react';

interface EventsProps {
  events: Event[];
}

export function Events({ events }: EventsProps) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="font-serif text-xl text-espresso">Agenda Cultural — Abril 2026</h2>
        <button className="flex items-center gap-2 px-4 py-2 text-xs font-medium bg-espresso text-cream rounded-lg hover:bg-bark transition-colors">
          <Plus size={14} />
          Nuevo Evento
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-parchment overflow-hidden">
        <div className="p-6 space-y-6">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col md:flex-row gap-6 p-6 bg-cream/30 rounded-2xl border border-parchment/50 hover:border-bark/30 transition-colors">
              <div className="w-16 flex flex-col items-center justify-center shrink-0 border-r border-parchment pr-6">
                <div className="font-serif text-3xl text-espresso leading-none">{event.date.split('-')[2]}</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-dust mt-1">Abr</div>
              </div>
              
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-serif text-espresso">{event.title}</h3>
                  <span className={`text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${
                    event.type === 'Cultural' ? 'bg-[#E8F0E2] text-[#3D6035]' : 'bg-[#FAEEE6] text-[#7A3418]'
                  }`}>
                    {event.type}
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-6 text-xs text-dust">
                  <div className="flex items-center gap-2">
                    <Calendar size={14} />
                    {event.time}
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={14} />
                    Cupo: {event.capacity} personas
                  </div>
                  <div className="font-medium text-bark">
                    {event.price === 0 ? 'Entrada Libre' : `Costo: ${formatCurrency(event.price)}`}
                  </div>
                </div>

                <div className="pt-2">
                  <div className="flex justify-between text-[10px] uppercase tracking-widest text-dust mb-1.5">
                    <span>Reservaciones</span>
                    <span>{event.confirmed} / {event.capacity}</span>
                  </div>
                  <div className="w-full h-1.5 bg-parchment rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sage rounded-full" 
                      style={{ width: `${(event.confirmed / event.capacity) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              <div className="w-full md:w-32 flex flex-col justify-center items-end border-t md:border-t-0 md:border-l border-parchment pt-4 md:pt-0 md:pl-6">
                <div className="text-[10px] uppercase tracking-widest text-dust mb-1">Ingresos Est.</div>
                <div className="font-serif text-2xl text-espresso font-bold">
                  {formatCurrency(event.confirmed * event.price)}
                </div>
                <button className="mt-4 text-[11px] font-bold text-bark hover:text-espresso transition-colors">
                  Gestionar Lista →
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
