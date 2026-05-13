import React from 'react';
import { Sale, Product, Expense, CashLog } from '../types';
import { formatCurrency, cn, parseESDate, isSameDay, getTodayMX } from '../lib/utils';
import { 
  Library,
  TrendingUp, 
  Receipt, 
  AlertTriangle, 
  Wallet, 
  CreditCard, 
  Trophy, 
  ArrowDownCircle,
  Coffee,
  GlassWater,
  IceCream,
  Cookie,
  Utensils,
  Gift,
  Ticket,
  Wine,
  Sparkles,
  BookOpen,
  CupSoda,
  ShoppingBag,
  Beer,
  Zap,
  PenTool,
  Wrench,
  ChevronRight,
  TrendingDown,
  Activity,
  Tag,
  BarChart3,
  PieChart as PieIcon,
  AlertCircle,
  FileText,
  DollarSign,
  Printer
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area
} from 'recharts';
import { generateDailyReport } from '../lib/pdfGenerator';

const ICON_MAP: Record<string, any> = {
  'library': Library,
  'librería': Library,
  'book': BookOpen,
  'books': BookOpen,
  'libro': BookOpen,
  'libros': BookOpen,
  'coffee': Coffee,
  'cafe': Coffee,
  'café': Coffee,
  'taza': Coffee,
  'chai': Coffee,
  'té': Coffee,
  'te': Coffee,
  'drink': GlassWater,
  'drinks': GlassWater,
  'bebida': GlassWater,
  'bebidas': GlassWater,
  'vaso': GlassWater,
  'cup': GlassWater,
  'copa': GlassWater,
  'soda': CupSoda,
  'refresco': CupSoda,
  'popote': CupSoda,
  'ice-cream': IceCream,
  'icecream': IceCream,
  'nieve': IceCream,
  'helado': IceCream,
  'postre': IceCream,
  'shopping': ShoppingBag,
  'bag': ShoppingBag,
  'bolsa': ShoppingBag,
  'merch': ShoppingBag,
  'cookie': Cookie,
  'cookies': Cookie,
  'snack': Cookie,
  'snacks': Cookie,
  'panadería': Cookie,
  'galleta': Cookie,
  'bread': Cookie,
  'pan': Cookie,
  'food': Utensils,
  'alimento': Utensils,
  'alimentos': Utensils,
  'comida': Utensils,
  'plato': Utensils,
  'utensils': Utensils,
  'gift': Gift,
  'regalo': Gift,
  'regalos': Gift,
  'bazar': ShoppingBag,
  'detalle': Gift,
  'ticket': Ticket,
  'event': Ticket,
  'evento': Ticket,
  'bolete': Ticket,
  'entrada': Ticket,
  'wine': Wine,
  'vino': Wine,
  'vinos': Wine,
  'alcohol': Wine,
  'beer': Beer,
  'cerveza': Beer,
  'sparkles': Sparkles,
  'otros': Sparkles,
  'otro': Sparkles,
  'estrella': Sparkles,
};

const CATEGORY_STYLES: Record<string, { icon: any, color: string, bg: string, border: string, text: string, hex: string }> = {
  'Libros': { icon: Library, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust', hex: '#8B6F47' },
  'Books': { icon: Library, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust', hex: '#8B6F47' },
  'Librería': { icon: Library, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust', hex: '#8B6F47' },
  'Café': { icon: Coffee, color: 'bg-dust/10', bg: 'bg-espresso/5', border: 'border-espresso/10', text: 'text-dust', hex: '#2C1A0E' },
  'Coffee': { icon: Coffee, color: 'bg-dust/10', bg: 'bg-espresso/5', border: 'border-espresso/10', text: 'text-dust', hex: '#2C1A0E' },
  'Bebidas': { icon: CupSoda, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Drinks': { icon: CupSoda, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Nieve': { icon: IceCream, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust', hex: '#6B7B5E' },
  'Ice Cream': { icon: IceCream, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust', hex: '#6B7B5E' },
  'Helados': { icon: IceCream, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust', hex: '#6B7B5E' },
  'Snacks': { icon: Cookie, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust', hex: '#8B6F47' },
  'Cookies': { icon: Cookie, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust', hex: '#8B6F47' },
  'Alimentos': { icon: Utensils, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Food': { icon: Utensils, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Accesorios': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'Regalos': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'Gifts': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'Bazar': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'Eventos': { icon: Ticket, color: 'bg-dust/10', bg: 'bg-gold/5', border: 'border-gold/10', text: 'text-dust', hex: '#D4A843' },
  'Events': { icon: Ticket, color: 'bg-dust/10', bg: 'bg-gold/5', border: 'border-gold/10', text: 'text-dust', hex: '#D4A843' },
  'Vinos': { icon: Wine, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Wine': { icon: Wine, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Otros': { icon: Sparkles, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'Other': { icon: Sparkles, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'General': { icon: Receipt, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust', hex: '#9E8E7A' },
  'Servicios': { icon: Zap, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Comida': { icon: Utensils, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust', hex: '#C4622D' },
  'Papelería': { icon: PenTool, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust', hex: '#6B7B5E' },
  'Mantenimiento': { icon: Wrench, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust', hex: '#8B6F47' },
};

const EXPENSE_CATEGORY_STYLES: Record<string, { icon: any, hex: string }> = {
  'General': { icon: Receipt, hex: '#A89F91' },
  'Servicios': { icon: Zap, hex: '#3C2A21' },
  'Comida': { icon: Utensils, hex: '#D27C5A' },
  'Papelería': { icon: PenTool, hex: '#87986A' },
  'Mantenimiento': { icon: Wrench, hex: '#634832' },
  'Otros': { icon: Sparkles, hex: '#403d39' },
  'Insumos': { icon: Library, hex: '#634832' },
  'Limpieza': { icon: Sparkles, hex: '#A89F91' },
  'Publicidad': { icon: Gift, hex: '#C5A059' }
};

const getCategoryStyle = (cat: string) => {
  const normalized = cat.trim().toLowerCase();
  const key = Object.keys(CATEGORY_STYLES).find(k => k.toLowerCase() === normalized);
  return CATEGORY_STYLES[key || 'Otros'];
};

const getProductIcon = (iconName: string | undefined, category: string) => {
  if (iconName) {
    const normalized = iconName.trim().toLowerCase();
    if (ICON_MAP[normalized]) return ICON_MAP[normalized];
  }
  return getCategoryStyle(category).icon;
};

interface DashboardProps {
  sales: Sale[];
  products: Product[];
  expenses: Expense[];
  cashLogs: CashLog[];
}

const parseAmount = (val: string): number => {
  if (!val) return 0;
  const clean = val.replace(/[^0-9.-]/g, '');
  const parsed = parseFloat(clean);
  return isNaN(parsed) ? 0 : parsed;
};

// Helper to parse time from timestamp string
const getTimePart = (str: string) => {
  if (!str) return '00:00';
  if (str.includes(',')) return str.split(',')[1].trim();
  if (str.includes(' ')) {
    const parts = str.split(' ');
    return parts[parts.length - 1].trim();
  }
  return str;
};

const normalizeMethod = (method: string) => {
  const m = method.toLowerCase();
  if (m.includes('efectivo')) return 'Efectivo';
  if (m.includes('tarjeta')) return 'Tarjeta';
  if (m.includes('transferencia')) return 'Transferencia';
  if (m.includes('pendiente')) return 'Pendiente';
  if (m.includes('gratis')) return 'Gratis';
  return method.charAt(0).toUpperCase() + method.slice(1);
};

export function Dashboard({ sales, products, expenses, cashLogs }: DashboardProps) {
  const { todaySales, todayExpenses, totalIncome, totalOutflow, netBalance, lowStockAlerts, paymentMethods, hourlyData, trendData, topProducts, categoryChartData, expenseChartData } = React.useMemo(() => {
    const todayMX = getTodayMX();
    const ts = sales
      .filter(s => isSameDay(s.timestamp, todayMX))
      .sort((a, b) => parseESDate(b.timestamp).getTime() - parseESDate(a.timestamp).getTime());
    const te = expenses.filter(e => isSameDay(e.timestamp, todayMX));
    
    const income = ts.reduce((acc, sale) => acc + sale.amount, 0);
    const outflow = te.reduce((acc, exp) => acc + exp.amount, 0);
    const balance = income - outflow;
    
    const alerts = products.filter(p => p.stock < 5).length;

    // Payment methods breakdown
    const methods = ts.reduce((acc, sale) => {
      const methodStr = sale.paymentMethod || 'Efectivo';
      
      if (methodStr.includes(' + ') && methodStr.includes(':')) {
        const parts = methodStr.split(' + ');
        let totalInString = 0;
        const parsedParts = parts.map(part => {
          const colonIndex = part.indexOf(':');
          if (colonIndex !== -1) {
            const method = part.substring(0, colonIndex).trim();
            const amountStr = part.substring(colonIndex + 1).trim();
            const amount = parseAmount(amountStr);
            totalInString += amount;
            return { method, amount };
          }
          return { method: part.trim(), amount: 0 };
        });

        parsedParts.forEach(part => {
          const proportion = totalInString > 0 ? part.amount / totalInString : 0;
          const distributedAmount = sale.amount * proportion;
          const normalizedMethod = normalizeMethod(part.method);
          acc[normalizedMethod] = (acc[normalizedMethod] || 0) + distributedAmount;
        });
      } else {
        let method = methodStr;
        let amount = sale.amount;
        if (methodStr.includes(':')) {
          const colonIndex = methodStr.indexOf(':');
          method = methodStr.substring(0, colonIndex).trim();
        }
        const normalizedMethod = normalizeMethod(method);
        acc[normalizedMethod] = (acc[normalizedMethod] || 0) + amount;
      }
      return acc;
    }, {} as Record<string, number>);

    // Hourly data for today (Full day 00-23 to avoid missing early/late data)
    const hourly = [...Array(24)].map((_, i) => {
      const hour = i.toString().padStart(2, '0') + ':00';
      const hourSales = ts.filter(s => {
        const timePart = getTimePart(s.timestamp);
        const sHour = timePart.split(':')[0].trim();
        return parseInt(sHour) === i;
      });

      const hourExpenses = te.filter(e => {
        const timePart = getTimePart(e.timestamp);
        const eHour = timePart.split(':')[0].trim();
        return parseInt(eHour) === i;
      });

      return {
        name: hour,
        ventas: hourSales.reduce((acc, s) => acc + s.amount, 0),
        gastos: hourExpenses.reduce((acc, e) => acc + e.amount, 0),
      };
    }).filter(h => {
      // Filter out empty hours at start/end of day but keep a decent business range
      const hourNum = parseInt(h.name.split(':')[0]);
      const hasActivity = h.ventas > 0 || h.gastos > 0;
      return hasActivity || (hourNum >= 9 && hourNum <= 21);
    });

    // Last 7 days trend
    const trend = [...Array(7)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const ds = d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
      
      const dayS = sales.filter(s => {
        const sDate = parseESDate(s.timestamp);
        return sDate.getDate() === d.getDate() && 
               sDate.getMonth() === d.getMonth() && 
               sDate.getFullYear() === d.getFullYear();
      });
      
      const dayE = expenses.filter(e => {
        const eDate = parseESDate(e.timestamp);
        return eDate.getDate() === d.getDate() && 
               eDate.getMonth() === d.getMonth() && 
               eDate.getFullYear() === d.getFullYear();
      });

      return {
        name: ds,
        ventas: dayS.reduce((acc, s) => acc + s.amount, 0),
        gastos: dayE.reduce((acc, e) => acc + e.amount, 0),
      };
    });

    // Top products
    const pSales = ts.reduce((acc, sale) => {
      acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
      return acc;
    }, {} as Record<string, number>);

    const topProducts = Object.entries(pSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);

    // Category chart data
    const catData = [...new Set([...products.map(p => p.category), ...ts.map(s => s.category)])]
      .map(cat => {
        const cSales = ts.filter(s => s.category === cat).reduce((acc, s) => acc + s.amount, 0);
        return { name: cat, value: cSales };
      })
      .filter(item => item.value > 0)
      .sort((a, b) => b.value - a.value);

    // Expense charts data
    const eCats = [...new Set(te.map(e => e.category))];
    const eChartData = eCats.map(cat => ({
      name: cat,
      amount: te.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
    })).sort((a, b) => b.amount - a.amount);

    return { 
      todaySales: ts, 
      todayExpenses: te, 
      totalIncome: income, 
      totalOutflow: outflow, 
      netBalance: balance, 
      lowStockAlerts: alerts,
      paymentMethods: methods,
      hourlyData: hourly,
      trendData: trend,
      topProducts,
      categoryChartData: catData,
      expenseChartData: eChartData
    };
  }, [sales, expenses, products]);

  const [expenseChartType, setExpenseChartType] = React.useState<'bar' | 'pie'>('bar');
  const [timeFilter, setTimeFilter] = React.useState<'today' | 'week'>('today');

  const metrics = [
    { label: 'Ingresos hoy', value: formatCurrency(totalIncome), detail: 'Ventas brutas', icon: TrendingUp, color: 'text-gold', bg: 'bg-gold/10', bar: 'bg-gold', shadow: 'shadow-gold/10' },
    { label: 'Gastos hoy', value: formatCurrency(totalOutflow), detail: 'Salidas del día', icon: TrendingDown, color: 'text-terra', bg: 'bg-terra/10', bar: 'bg-terra', shadow: 'shadow-terra/10' },
    { label: 'Balance Neto', value: formatCurrency(netBalance), detail: 'Utilidad neta', icon: Wallet, color: 'text-sage', bg: 'bg-sage/10', bar: 'bg-sage', shadow: 'shadow-sage/10' },
    { label: 'Alertas Stock', value: lowStockAlerts, detail: 'Productos críticos', icon: AlertTriangle, color: 'text-bark', bg: 'bg-bark/10', bar: 'bg-bark', shadow: 'shadow-bark/10' },
  ];

  return (
    <div className="space-y-6 pb-14">
      {/* Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-4 lg:p-5 rounded-2xl border border-parchment relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md ${metric.shadow}`}
          >
            <div className={`absolute top-0 left-0 bottom-0 w-[4px] ${metric.bar}`} />
            <div className="flex justify-between items-start mb-2 lg:mb-3">
              <div className={cn("p-1.5 lg:p-2 rounded-xl transition-colors", metric.bg, metric.color)}>
                <metric.icon size={18} className="lg:size-[20px]" />
              </div>
              <Activity size={14} className="text-mist opacity-40 sm:block hidden" />
            </div>
            <div className="text-[9px] lg:text-[11px] tracking-widest uppercase font-bold text-dust mb-0.5 lg:mb-1 truncate">{metric.label}</div>
            <div className="flex items-baseline gap-1 lg:gap-2">
              <div className="font-serif text-lg lg:text-2xl font-bold text-espresso truncate">{metric.value}</div>
            </div>
            <div className="text-[9px] lg:text-[11px] mt-1 lg:mt-2 text-dust/60 uppercase tracking-tight truncate">
              {metric.detail}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
        {/* Left Column: Financial Charts (8/12) */}
        <div className="xl:col-span-8 space-y-6">
          {/* Performance View Bento (Combined Activity & Trends) */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white rounded-3xl border border-parchment p-6 shadow-sm"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-espresso rounded-2xl flex items-center justify-center text-gold shadow-lg shadow-espresso/10">
                  <TrendingUp size={24} />
                </div>
                <div>
                  <h3 className="font-serif text-xl text-espresso tracking-tight">Desempeño Financiero</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-dust">Flujo de efectivo</span>
                    <div className="w-1 h-1 rounded-full bg-mist" />
                    <div className="flex items-center gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                      <span className="text-[10px] font-bold text-gold uppercase tracking-widest">En vivo</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <button 
                  onClick={() => generateDailyReport(sales, expenses, cashLogs, getTodayMX().toLocaleDateString('es-MX'))}
                  className="px-4 py-2 bg-espresso text-cream rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 hover:bg-bark transition-all shadow-md shadow-espresso/20"
                >
                  <Printer size={14} />
                  Imprimir Corte de Caja
                </button>

                <div className="flex bg-parchment/50 p-1 rounded-2xl border border-parchment">
                <button 
                  onClick={() => setTimeFilter('today')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    timeFilter === 'today' ? "bg-espresso text-white shadow-md shadow-espresso/20" : "text-dust hover:text-espresso"
                  )}
                >
                  Hoy (Horas)
                </button>
                <button 
                  onClick={() => setTimeFilter('week')}
                  className={cn(
                    "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all duration-300",
                    timeFilter === 'week' ? "bg-espresso text-white shadow-md shadow-espresso/20" : "text-dust hover:text-espresso"
                  )}
                >
                  Semana
                </button>
              </div>
            </div>
          </div>

          <div className="h-[220px] sm:h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={timeFilter === 'today' ? hourlyData : trendData}>
                  <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#C5A059" stopOpacity={0.2}/>
                      <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D27C5A" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#D27C5A" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EAD7" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A89F91', fontSize: 10, fontWeight: 600 }}
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A89F91', fontSize: 10, fontWeight: 600 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    cursor={{ stroke: '#C5A059', strokeWidth: 1 }}
                    contentStyle={{ 
                      backgroundColor: '#fff', 
                      borderRadius: '20px', 
                      border: '1px solid #F1EAD7',
                      boxShadow: '0 10px 25px -5px rgb(60 42 33 / 0.1)',
                      fontSize: '11px',
                      padding: '12px 16px'
                    }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="ventas" 
                    stroke="#C5A059" 
                    strokeWidth={4} 
                    fillOpacity={1} 
                    fill="url(#colorIncome)"
                    name="Ingresos"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#D27C5A" 
                    strokeWidth={2} 
                    strokeDasharray="4 4" 
                    fillOpacity={1} 
                    fill="url(#colorExpense)"
                    name="Egresos"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="mt-8 flex flex-wrap gap-8 px-4 py-4 bg-parchment/20 rounded-2xl border border-parchment/40">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-gold shadow-sm shadow-gold/40" />
                <div>
                  <span className="text-[9px] font-black uppercase text-dust/60 tracking-widest block leading-none mb-1">Total Ingresos</span>
                  <span className="text-sm font-bold text-espresso">{formatCurrency(timeFilter === 'today' ? totalIncome : trendData.reduce((acc, d) => acc + d.ventas, 0))}</span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-terra shadow-sm shadow-terra/40" />
                <div>
                  <span className="text-[9px] font-black uppercase text-dust/60 tracking-widest block leading-none mb-1">Total Egresos</span>
                  <span className="text-sm font-bold text-espresso">{formatCurrency(timeFilter === 'today' ? totalOutflow : trendData.reduce((acc, d) => acc + d.gastos, 0))}</span>
                </div>
              </div>
              <div className="flex items-center gap-3 ml-auto">
                <div className={cn(
                  "w-3 h-3 rounded-full shadow-sm",
                  (timeFilter === 'today' ? netBalance : trendData.reduce((acc, d) => acc + d.ventas - d.gastos, 0)) >= 0 ? "bg-sage bg-gold" : "bg-terra"
                )} />
                <div>
                  <span className="text-[9px] font-black uppercase text-dust/60 tracking-widest block leading-none mb-1">Balance</span>
                  <span className="text-sm font-bold text-espresso">
                    {formatCurrency(timeFilter === 'today' ? netBalance : trendData.reduce((acc, d) => acc + d.ventas - d.gastos, 0))}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Operational Expenses Row - Unified like Category Distribution */}
          <div className="bg-white p-6 rounded-3xl border border-parchment shadow-sm overflow-hidden flex flex-col md:flex-row gap-8">
            {/* Left side: Legend and Summary */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-terra/10 rounded-xl flex items-center justify-center text-terra">
                      <TrendingDown size={18} />
                    </div>
                    <div>
                      <h3 className="font-serif text-lg text-espresso">Egresos hoy</h3>
                    </div>
                  </div>
                  <div className="flex bg-parchment p-1 rounded-xl border border-mist shadow-inner">
                    <button onClick={() => setExpenseChartType('bar')} className={cn("p-1.5 rounded-lg transition-all", expenseChartType === 'bar' ? "bg-white text-espresso shadow-sm" : "text-dust")}><BarChart3 size={14} /></button>
                    <button onClick={() => setExpenseChartType('pie')} className={cn("p-1.5 rounded-lg transition-all", expenseChartType === 'pie' ? "bg-white text-espresso shadow-sm" : "text-dust")}><PieIcon size={14} /></button>
                  </div>
                </div>
                <p className="text-[10px] text-dust uppercase font-bold tracking-widest mb-6">Desglose por categoría</p>

                <div className="space-y-3 mb-6">
                  {expenseChartData.length > 0 ? (
                    expenseChartData.map((cat) => (
                      <div key={cat.name} className="flex items-center justify-between group">
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-2.5 h-2.5 rounded-full" 
                            style={{ backgroundColor: EXPENSE_CATEGORY_STYLES[cat.name]?.hex || '#5c544e' }} 
                          />
                          <span className="text-xs text-dust font-medium group-hover:text-espresso transition-colors">{cat.name}</span>
                        </div>
                        <span className="text-xs font-bold text-espresso">{formatCurrency(cat.amount)}</span>
                      </div>
                    ))
                  ) : (
                    <div className="flex items-center gap-2 text-dust/50 italic py-4">
                      <AlertTriangle size={14} />
                      <span className="text-xs">No hay gastos hoy</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="pt-4 border-t border-parchment flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-dust">Total Egresos</p>
                  <p className="text-xl font-serif font-black text-terra">{formatCurrency(totalOutflow)}</p>
                </div>
                <div className="p-3 bg-espresso rounded-2xl text-cream shadow-lg shadow-espresso/10">
                   <Receipt size={20} />
                </div>
              </div>
            </div>

            {/* Right side: Chart Area */}
            <div className="flex-1 flex items-center justify-center min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                {expenseChartType === 'bar' ? (
                  <BarChart data={expenseChartData} margin={{ left: -15, right: 10, top: 10, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EAD7" />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#8E9299' }} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 9, fill: '#8E9299' }} tickFormatter={(val) => `$${val}`} />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={28}>
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_CATEGORY_STYLES[entry.name]?.hex || '#5c544e'} />
                      ))}
                    </Bar>
                    <Tooltip formatter={(val: number) => [`$${val.toFixed(2)}`, 'Gasto']} cursor={{ fill: 'rgba(92, 84, 78, 0.05)' }} />
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie data={expenseChartData} cx="50%" cy="50%" innerRadius={55} outerRadius={75} paddingAngle={5} dataKey="amount">
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_CATEGORY_STYLES[entry.name]?.hex || '#5c544e'} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(val: number) => [`$${val.toFixed(2)}`, 'Gasto']} />
                  </PieChart>
                )}
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Right Column: Sidebar (4/12) */}
        <div className="xl:col-span-4 space-y-6">
          {/* Active List: Transactions */}
          <div className="bg-white rounded-3xl border border-parchment overflow-hidden shadow-sm flex flex-col h-[380px]">
            <div className="px-6 py-5 border-b border-parchment flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <FileText size={18} className="text-espresso opacity-50" />
                <h3 className="font-serif text-lg text-espresso">Transacciones</h3>
              </div>
              <span className="px-2 py-0.5 bg-parchment rounded text-[10px] font-bold text-dust uppercase">{todaySales.length} hoy</span>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
              <AnimatePresence>
                {todaySales.map((sale, index) => {
                  const product = products.find(p => p.name === sale.productName);
                  const style = getCategoryStyle(sale.category);
                  const Icon = getProductIcon(product?.icon, sale.category);
                  return (
                    <motion.div 
                      key={`${sale.id}-${index}`}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 hover:bg-parchment/30 rounded-2xl group transition-all duration-300 border border-transparent hover:border-parchment"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110", style.bg, style.text)}>
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-ink truncate group-hover:text-espresso transition-colors">{sale.productName}</div>
                          <div className="text-[10px] text-dust uppercase font-medium tracking-tight mt-0.5">{getTimePart(sale.timestamp)}</div>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <div className="font-serif text-sm font-black text-espresso">{formatCurrency(sale.amount)}</div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          </div>

          {/* Top Products Bento */}
          <div className="bg-espresso text-white rounded-3xl p-6 shadow-xl shadow-espresso/15">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 bg-gold/20 rounded-xl flex items-center justify-center text-gold">
                <Trophy size={18} />
              </div>
              <div>
                <h3 className="font-serif text-lg tracking-tight">Más Vendidos</h3>
                <p className="text-[10px] text-cream/40 uppercase tracking-widest leading-none mt-1">Hoy</p>
              </div>
            </div>
            <div className="space-y-5">
              {topProducts.map(([name, qty], index) => (
                <div key={name} className="flex items-center gap-4 group">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black shadow-inner",
                    index === 0 ? "bg-gold text-espresso" : "bg-white/10 text-cream/60"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate group-hover:text-gold transition-colors">{name}</div>
                    <div className="w-full h-1.5 bg-white/5 rounded-full mt-2.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(qty / Number(topProducts[0][1])) * 100}%` }}
                        className={cn("h-full transition-all duration-1000", index === 0 ? "bg-gold" : "bg-gold/40")}
                      />
                    </div>
                  </div>
                  <div className="text-xs font-black text-gold/80">{qty} u.</div>
                </div>
              ))}
              {topProducts.length === 0 && <div className="text-center py-6 opacity-30 italic text-xs">Sin registros</div>}
            </div>
          </div>

          {/* Stock Alerts Bento */}
          <div className="bg-red-50 rounded-3xl border border-red-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2 text-red-600">
                <AlertCircle size={18} />
                <h4 className="text-[11px] font-black uppercase tracking-widest">Stock Crítico</h4>
              </div>
              <div className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">
                {products.filter(p => p.stock < 5).length}
              </div>
            </div>
            <div className="space-y-3">
              {products.filter(p => p.stock < 5).slice(0, 3).map(p => (
                <div key={p.id} className="bg-white p-3 rounded-2xl border border-red-100 shadow-sm flex items-center justify-between group hover:border-red-300 transition-colors">
                  <span className="text-[11px] font-bold text-ink truncate pr-2">{p.name}</span>
                  <span className="px-2 py-1 bg-red-50 text-red-700 rounded-lg text-[10px] font-black">{p.stock}</span>
                </div>
              ))}
              {products.filter(p => p.stock < 5).length === 0 && (
                <div className="flex flex-col items-center justify-center py-4 text-sage opacity-50">
                   <Sparkles size={24} className="mb-2" />
                   <p className="text-[10px] font-bold uppercase tracking-tighter">Todo en orden</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Footer Row: Details & Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white rounded-3xl border border-parchment p-6 shadow-sm overflow-hidden flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Tag size={18} className="text-gold" />
              <h3 className="font-serif text-lg text-espresso">Distribución por Categoría</h3>
            </div>
            <p className="text-[10px] text-dust uppercase tracking-wider mb-6">Análisis de volumen hoy</p>
            <div className="space-y-3">
              {categoryChartData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between group">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryStyle(cat.name).hex }} />
                    <span className="text-xs text-dust font-medium group-hover:text-espresso transition-colors">{cat.name}</span>
                  </div>
                  <span className="text-xs font-bold text-espresso">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center min-h-[160px]">
             <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryChartData} cx="50%" cy="50%" innerRadius={50} outerRadius={70} paddingAngle={4} dataKey="value">
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryStyle(entry.name).hex} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
             </ResponsiveContainer>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl border border-parchment p-6 shadow-sm">
           <div className="flex items-center gap-2 mb-2">
             <CreditCard size={18} className="text-espresso" />
             <h3 className="font-serif text-lg text-espresso">Métodos de Pago</h3>
           </div>
           <p className="text-[10px] text-dust uppercase tracking-wider mb-6">Canales de ingreso hoy</p>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {Object.entries(paymentMethods).sort(([,a],[,b]) => b-a).map(([method, total]) => {
                  const percentage = totalIncome > 0 ? (total / totalIncome) * 100 : 0;
                  return (
                    <div key={method} className="space-y-2">
                      <div className="flex justify-between items-center text-[11px]">
                        <span className="text-dust font-bold">{method}</span>
                        <span className="text-espresso font-black">{formatCurrency(total)}</span>
                      </div>
                      <div className="h-2 w-full bg-parchment rounded-full overflow-hidden shadow-inner border border-mist/20">
                        <motion.div initial={{ width: 0 }} animate={{ width: `${percentage}%` }} className={cn("h-full rounded-full", method.includes('Efectivo') ? 'bg-gold' : method.includes('Tarjeta') ? 'bg-[#5c6bc0]' : 'bg-sage')} />
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="bg-parchment/30 rounded-2xl p-5 border border-parchment flex flex-col justify-center items-center text-center">
                 <DollarSign size={24} className="text-gold mb-2" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-dust mb-1">Caja Total</p>
                 <span className="font-serif text-2xl font-black text-espresso">{formatCurrency(totalIncome)}</span>
                 <p className="text-[9px] text-dust/60 mt-2 italic px-4">Suma de todos los canales de venta del día</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}

