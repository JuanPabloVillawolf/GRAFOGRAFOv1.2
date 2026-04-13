import { useState, useEffect } from 'react';
import { LayoutDashboard, ShoppingCart, Package, Receipt, Coffee, History, Users, ArrowDownCircle } from 'lucide-react';
import { cn } from '../lib/utils';

interface SidebarProps {
  activeView: string;
  setActiveView: (view: string) => void;
  currentUser: any;
}

export function Sidebar({ activeView, setActiveView, currentUser }: SidebarProps) {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setNow(new Date());
    }, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, section: 'Operaciones' },
    { id: 'ventas', label: 'Ventas del día', icon: ShoppingCart, section: 'Operaciones' },
    { id: 'gastos', label: 'Gastos del día', icon: ArrowDownCircle, section: 'Operaciones' },
    { id: 'cuentas', label: 'Cuentas abiertas', icon: Users, section: 'Operaciones' },
    { id: 'inventario', label: 'Inventario', icon: Package, section: 'Operaciones' },
    { id: 'registros', label: 'Registro de ventas', icon: Receipt, section: 'Registros' },
    { id: 'registros_inventario', label: 'Registro de inventario', icon: History, section: 'Registros' },
  ];

  const sections = ['Operaciones', 'Registros'];

  return (
    <aside className="w-[280px] min-w-[280px] max-w-[280px] h-screen sticky top-0 bg-espresso flex flex-col shrink-0 overflow-hidden">
      <div className="p-8 border-b border-white/10">
        <div className="font-serif text-3xl text-cream tracking-wide flex items-center gap-3">
          <Coffee size={28} className="text-gold" />
          Grafógrafo
        </div>
        <div className="text-[12px] text-dust tracking-[0.15em] uppercase mt-2 font-medium">
          Punto de Venta
        </div>
      </div>

      <nav className="py-8 flex-1 flex flex-col">
        {sections.map((section, idx) => (
          <div key={section} className={cn("mb-8", idx === sections.length - 1 && "mt-auto mb-4")}>
            <div className="text-[11px] tracking-[0.2em] uppercase text-dust/60 px-8 mb-5 font-bold">
              {section}
            </div>
            <div className="space-y-2">
              {menuItems
                .filter((item) => item.section === section)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveView(item.id)}
                    className={cn(
                      "w-full flex items-center justify-start text-left gap-4 px-8 py-4 text-[16px] transition-colors border-l-4 h-[56px]",
                      activeView === item.id
                        ? "text-gold bg-gold/10 border-gold font-medium"
                        : "text-white/40 hover:text-cream hover:bg-white/5 border-transparent"
                    )}
                  >
                    <item.icon size={20} />
                    <span className="truncate">{item.label}</span>
                  </button>
                ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="p-8 border-t border-white/10 text-dust text-[13px] bg-black/10 space-y-4">
        {currentUser && (
          <div className="flex items-center gap-3 pb-4 border-b border-white/5">
            <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-gold shrink-0">
              <Users size={20} />
            </div>
            <div className="overflow-hidden">
              <div className="text-white/80 font-medium truncate">{currentUser.name}</div>
              <div className="text-[10px] uppercase tracking-widest text-gold/60 font-bold">{currentUser.role}</div>
            </div>
          </div>
        )}
        <div>
          <div className="capitalize font-medium text-white/50">{now.toLocaleDateString('es-MX', { weekday: 'long' })}</div>
          <div className="text-white/30 text-sm mt-1">
            {now.toLocaleDateString('es-MX', { day: 'numeric', month: 'long', year: 'numeric' })}
          </div>
        </div>
      </div>
    </aside>
  );
}
