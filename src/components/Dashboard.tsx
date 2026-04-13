import { Sale, Product, Expense } from '../types';
import { formatCurrency } from '../lib/utils';
import { TrendingUp, Receipt, Book, AlertTriangle, Wallet, CreditCard, Trophy, ArrowDownCircle } from 'lucide-react';
import { motion } from 'motion/react';

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  expenses: Expense[];
}

export function Dashboard({ sales, products, expenses }: DashboardProps) {
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

  const todaySales = sales.filter(s => isToday(s.timestamp));
  const todayExpenses = expenses.filter(e => isToday(e.timestamp));
  
  const totalIncome = todaySales.reduce((acc, sale) => acc + sale.amount, 0);
  const totalOutflow = todayExpenses.reduce((acc, exp) => acc + exp.amount, 0);
  const netBalance = totalIncome - totalOutflow;
  
  const totalSalesCount = todaySales.length;
  const booksSold = todaySales.filter(s => s.category === 'Libros').length;
  const lowStockAlerts = products.filter(p => p.stock < 5).length;

  // Payment methods breakdown
  const paymentMethods = todaySales.reduce((acc, sale) => {
    const method = sale.paymentMethod || 'Efectivo';
    acc[method] = (acc[method] || 0) + sale.amount;
    return acc;
  }, {} as Record<string, number>);

  // Top products
  const productSales = todaySales.reduce((acc, sale) => {
    acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  const metrics = [
    { label: 'Ingresos hoy', value: formatCurrency(totalIncome), change: 'Entradas totales', icon: TrendingUp, color: 'gold' },
    { label: 'Gastos hoy', value: formatCurrency(totalOutflow), change: 'Salidas registradas', icon: ArrowDownCircle, color: 'terra' },
    { label: 'Balance Neto', value: formatCurrency(netBalance), change: 'Utilidad del día', icon: Wallet, color: 'sage' },
    { label: 'Alertas Stock', value: lowStockAlerts, change: 'Revisar inventario', icon: AlertTriangle, color: 'bark' },
  ];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-5 rounded-xl border border-parchment relative overflow-hidden group hover:-translate-y-1 transition-transform`}
          >
            <div className={`absolute top-0 left-0 right-0 h-[3px] bg-${metric.color}`} />
            <div className="text-[12px] tracking-widest uppercase text-dust mb-2">{metric.label}</div>
            <div className="font-serif text-3xl text-espresso">{metric.value}</div>
            <div className="text-[13px] mt-1.5 flex items-center gap-1 text-dust">
              {metric.change}
            </div>
            <metric.icon size={28} className="absolute right-4 top-1/2 -translate-y-1/2 opacity-10 group-hover:opacity-20 transition-opacity" />
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div className="lg:col-span-2 space-y-5">
          {/* Sales by Category */}
          <div className="bg-white rounded-xl border border-parchment overflow-hidden">
            <div className="px-5 py-4 border-b border-parchment flex items-center justify-between">
              <h3 className="font-serif text-lg text-espresso">Ventas por categoría — hoy</h3>
              <span className="text-[13px] text-dust">Total: {formatCurrency(totalIncome)}</span>
            </div>
            <div className="p-5 space-y-6">
              {[...new Set([...products.map(p => p.category), ...todaySales.map(s => s.category)])].map((cat) => {
                const catSales = todaySales.filter(s => s.category === cat).reduce((acc, s) => acc + s.amount, 0);
                if (catSales === 0 && !products.some(p => p.category === cat)) return null;

                const percentage = totalIncome > 0 ? (catSales / totalIncome) * 100 : 0;
                const colors: Record<string, string> = { 
                  Libros: 'bg-bark', 
                  Café: 'bg-terra',
                  Bebidas: 'bg-terra', 
                  Nieve: 'bg-gold',
                  Snacks: 'bg-gold', 
                  Eventos: 'bg-sage' 
                };
                
                return (
                  <div key={cat} className="flex items-center gap-3 text-xs">
                    <div className="w-16 text-dust text-right shrink-0">{cat}</div>
                    <div className="flex-1 h-2.5 bg-parchment rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={`h-full ${colors[cat] || 'bg-dust'}`} 
                      />
                    </div>
                    <div className="w-20 font-serif text-espresso font-semibold">{formatCurrency(catSales)}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Last Transactions */}
          <div className="bg-white rounded-xl border border-parchment overflow-hidden">
            <div className="px-5 py-4 border-b border-parchment">
              <div className="text-[12px] uppercase tracking-widest text-dust">Últimas transacciones de hoy</div>
            </div>
            <div className="p-4 space-y-2">
              {todaySales.slice(0, 5).map((sale, index) => (
                <div key={`${sale.id}-${index}`} className="flex items-center justify-between p-3 bg-cream rounded-lg text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full ${
                      sale.category === 'Libros' ? 'bg-bark' : 
                      sale.category === 'Bebidas' ? 'bg-terra' : 
                      sale.category === 'Snacks' ? 'bg-gold' : 'bg-sage'
                    }`} />
                    <div>
                      <div className="font-medium text-ink">{sale.productName}</div>
                      <div className="text-[12px] text-dust uppercase tracking-wider">{sale.category} · {sale.paymentMethod}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-serif text-sm font-semibold text-espresso">{formatCurrency(sale.amount)}</div>
                    <div className="text-[10px] text-dust">{sale.timestamp.includes(',') ? sale.timestamp.split(',')[1].trim() : sale.timestamp}</div>
                  </div>
                </div>
              ))}
              {todaySales.length === 0 && (
                <div className="text-center py-6 text-dust text-xs italic">No hay ventas registradas hoy</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-5">
          {/* Payment Methods */}
          <div className="bg-white rounded-xl border border-parchment overflow-hidden">
            <div className="px-5 py-4 border-b border-parchment">
              <h3 className="font-serif text-base text-espresso">Métodos de Pago</h3>
            </div>
            <div className="p-5 space-y-4">
              {Object.entries(paymentMethods).sort(([, a], [, b]) => b - a).map(([method, total]) => (
                <div key={method} className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-dust">
                    {method.toLowerCase().includes('tarjeta') ? <CreditCard size={14} /> : <Wallet size={14} />}
                    {method}
                  </div>
                  <div className="font-serif text-espresso font-semibold">{formatCurrency(total)}</div>
                </div>
              ))}
              <div className="pt-2 border-t border-parchment flex items-center justify-between text-[12px] uppercase tracking-widest text-dust">
                <span>Total Hoy</span>
                <span>{formatCurrency(totalIncome)}</span>
              </div>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-xl border border-parchment overflow-hidden">
            <div className="px-5 py-4 border-b border-parchment">
              <h3 className="font-serif text-base text-espresso">Más Vendidos Hoy</h3>
            </div>
            <div className="p-4 space-y-3">
              {topProducts.map(([name, qty], index) => (
                <div key={name} className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gold/10 flex items-center justify-center text-gold">
                    {index === 0 ? <Trophy size={12} /> : <span className="text-[10px] font-bold">{index + 1}</span>}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-ink truncate">{name}</div>
                    <div className="text-[10px] text-dust">{qty} unidades</div>
                  </div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center py-4 text-dust text-xs italic">Sin datos aún</div>
              )}
            </div>
          </div>

          {/* Inventory Alerts */}
          <div className="bg-white rounded-xl border border-parchment overflow-hidden">
            <div className="px-5 py-4 border-b border-parchment">
              <h3 className="font-serif text-base text-espresso">Alertas de inventario</h3>
            </div>
            <div className="p-4 space-y-2">
              {products.filter(p => p.stock < 5).slice(0, 3).map((p, index) => (
                <div key={`${p.id}-${index}`} className="bg-[#FAEEE6] p-3 rounded-lg text-xs text-terra flex items-start gap-2">
                  <AlertTriangle size={14} className="shrink-0 mt-0.5" />
                  <span>{p.name} · {p.stock} unid.</span>
                </div>
              ))}
              {products.filter(p => p.stock < 5).length === 0 && (
                <div className="text-center py-2 text-sage text-xs">Inventario saludable ✓</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
