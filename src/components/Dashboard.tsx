import React from 'react';
import { Sale, Product, Expense } from '../types';
import { formatCurrency, cn } from '../lib/utils';
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
  DollarSign
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
  'Libros': { icon: Library, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark', hex: '#634832' },
  'Books': { icon: Library, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark', hex: '#634832' },
  'Librería': { icon: Library, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark', hex: '#634832' },
  'Café': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/15', border: 'border-espresso/20', text: 'text-espresso', hex: '#3C2A21' },
  'Coffee': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/15', border: 'border-espresso/20', text: 'text-espresso', hex: '#3C2A21' },
  'Bebidas': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Drinks': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Nieve': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage', hex: '#87986A' },
  'Ice Cream': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage', hex: '#87986A' },
  'Helados': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage', hex: '#87986A' },
  'Snacks': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark', hex: '#634832' },
  'Cookies': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark', hex: '#634832' },
  'Alimentos': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Food': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Accesorios': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'Regalos': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'Gifts': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'Bazar': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'Eventos': { icon: Ticket, color: 'bg-gold', bg: 'bg-gold/15', border: 'border-gold/20', text: 'text-gold', hex: '#C5A059' },
  'Events': { icon: Ticket, color: 'bg-gold', bg: 'bg-gold/15', border: 'border-gold/20', text: 'text-gold', hex: '#C5A059' },
  'Vinos': { icon: Wine, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Wine': { icon: Wine, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Otros': { icon: Sparkles, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'Other': { icon: Sparkles, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'General': { icon: Receipt, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust', hex: '#A89F91' },
  'Servicios': { icon: Zap, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Comida': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra', hex: '#D27C5A' },
  'Papelería': { icon: PenTool, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage', hex: '#87986A' },
  'Mantenimiento': { icon: Wrench, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark', hex: '#634832' },
};

const EXPENSE_CATEGORY_STYLES: Record<string, { icon: any, hex: string }> = {
  'General': { icon: Receipt, hex: '#A89F91' },
  'Insumos': { icon: Library, hex: '#634832' },
  'Mantenimiento': { icon: Wrench, hex: '#D27C5A' },
  'Servicios': { icon: Zap, hex: '#3C2A21' },
  'Papelería': { icon: PenTool, hex: '#87986A' },
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
  
  const lowStockAlerts = products.filter(p => p.stock < 5).length;

  const normalizeMethod = (method: string) => {
    const m = method.toLowerCase();
    if (m.includes('efectivo')) return 'Efectivo';
    if (m.includes('tarjeta')) return 'Tarjeta';
    if (m.includes('transferencia')) return 'Transferencia';
    if (m.includes('pendiente')) return 'Pendiente';
    if (m.includes('gratis')) return 'Gratis';
    return method.charAt(0).toUpperCase() + method.slice(1);
  };

  // Payment methods breakdown
  const paymentMethods = todaySales.reduce((acc, sale) => {
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

  const paymentChartData = Object.entries(paymentMethods).map(([name, value]) => ({ name, value }));

  // Hourly data for today
  const hourlyData = [...Array(24)].map((_, i) => {
    const hour = i.toString().padStart(2, '0') + ':00';
    const hourSales = todaySales.filter(s => {
      const timePart = getTimePart(s.timestamp);
      const sHour = timePart.split(':')[0].trim();
      return parseInt(sHour) === i;
    });

    return {
      name: hour,
      monto: hourSales.reduce((acc, s) => acc + s.amount, 0),
    };
  }).filter((h, i) => {
    // Only show hours between 8 AM and 10 PM to keep it clean, or if there's data
    const hourNum = parseInt(h.name.split(':')[0]);
    return (hourNum >= 8 && hourNum <= 22) || h.monto > 0;
  });

  // Last 7 days trend
  const trendData = [...Array(7)].map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dayStr = d.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit' });
    
    const daySales = sales.filter(s => {
      const sDate = parseESDate(s.timestamp);
      return sDate.getDate() === d.getDate() && 
             sDate.getMonth() === d.getMonth() && 
             sDate.getFullYear() === d.getFullYear();
    });
    
    const dayExpenses = expenses.filter(e => {
      const eDate = parseESDate(e.timestamp);
      return eDate.getDate() === d.getDate() && 
             eDate.getMonth() === d.getMonth() && 
             eDate.getFullYear() === d.getFullYear();
    });

    return {
      name: dayStr,
      ventas: daySales.reduce((acc, s) => acc + s.amount, 0),
      gastos: dayExpenses.reduce((acc, e) => acc + e.amount, 0),
    };
  });

  // Top products
  const productSales = todaySales.reduce((acc, sale) => {
    acc[sale.productName] = (acc[sale.productName] || 0) + sale.quantity;
    return acc;
  }, {} as Record<string, number>);

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3);

  // Category chart data
  const categoryChartData = [...new Set([...products.map(p => p.category), ...todaySales.map(s => s.category)])]
    .map(cat => {
      const catSales = todaySales.filter(s => s.category === cat).reduce((acc, s) => acc + s.amount, 0);
      return { name: cat, value: catSales };
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value);

  // Expense charts data
  const expenseCategories = ['General', 'Insumos', 'Mantenimiento', 'Servicios', 'Papelería', 'Limpieza', 'Publicidad'];
  const expenseChartData = expenseCategories.map(cat => ({
    name: cat,
    amount: todayExpenses.filter(e => e.category === cat).reduce((sum, e) => sum + e.amount, 0)
  })).filter(d => d.amount > 0);

  const [expenseChartType, setExpenseChartType] = React.useState<'bar' | 'pie'>('bar');

  const metrics = [
    { label: 'Ingresos hoy', value: formatCurrency(totalIncome), detail: 'Ventas brutas', icon: TrendingUp, color: 'text-gold', bg: 'bg-gold/10', bar: 'bg-gold', shadow: 'shadow-gold/10' },
    { label: 'Gastos hoy', value: formatCurrency(totalOutflow), detail: 'Salidas del día', icon: TrendingDown, color: 'text-terra', bg: 'bg-terra/10', bar: 'bg-terra', shadow: 'shadow-terra/10' },
    { label: 'Balance Neto', value: formatCurrency(netBalance), detail: 'Utilidad neta', icon: Wallet, color: 'text-sage', bg: 'bg-sage/10', bar: 'bg-sage', shadow: 'shadow-sage/10' },
    { label: 'Alertas Stock', value: lowStockAlerts, detail: 'Productos críticos', icon: AlertTriangle, color: 'text-bark', bg: 'bg-bark/10', bar: 'bg-bark', shadow: 'shadow-bark/10' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric, i) => (
          <motion.div
            key={metric.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`bg-white p-6 rounded-2xl border border-parchment relative overflow-hidden group hover:-translate-y-1 transition-all duration-300 shadow-sm hover:shadow-md ${metric.shadow}`}
          >
            <div className={`absolute top-0 left-0 bottom-0 w-[4px] ${metric.bar}`} />
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-2 rounded-xl transition-colors", metric.bg, metric.color)}>
                <metric.icon size={24} />
              </div>
              <Activity size={16} className="text-mist opacity-40" />
            </div>
            <div className="text-[11px] tracking-widest uppercase font-bold text-dust mb-1">{metric.label}</div>
            <div className="flex items-baseline gap-2">
              <div className="font-serif text-3xl font-bold text-espresso">{metric.value}</div>
            </div>
            <div className="text-[12px] mt-2 flex items-center gap-1.5 text-dust uppercase tracking-tight">
              <span>{metric.detail}</span>
              <ChevronRight size={12} className="opacity-40" />
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          {/* Daily Hourly Chart */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-parchment p-6 shadow-sm h-full"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="font-serif text-xl text-espresso">Actividad de Hoy</h3>
                <p className="text-xs text-dust">Ventas por hora (Día actual)</p>
              </div>
              <div className="px-3 py-1 bg-gold/10 text-gold rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gold animate-pulse" />
                En vivo
              </div>
            </div>
            <div className="h-[250px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={hourlyData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1EAD7" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A89F91', fontSize: 10 }}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#A89F91', fontSize: 10 }}
                    tickFormatter={(val) => `$${val}`}
                  />
                  <Tooltip 
                    cursor={{ fill: '#F1EAD7', opacity: 0.4 }}
                    contentStyle={{ 
                      backgroundColor: '#3C2A21', 
                      borderRadius: '12px', 
                      border: 'none',
                      color: '#F9F7F2',
                      fontSize: '11px'
                    }}
                  />
                  <Bar dataKey="monto" fill="#C5A059" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </motion.div>
        </div>

        <div>
          {/* Last Transactions */}
          <div className="bg-white rounded-3xl border border-parchment overflow-hidden shadow-sm h-full max-h-[400px] flex flex-col">
            <div className="px-6 py-5 border-b border-parchment flex items-center justify-between shrink-0">
              <h3 className="font-serif text-lg text-espresso">Actividad</h3>
              <div className="flex h-6 w-6 items-center justify-center rounded-full bg-espresso text-[10px] text-white">
                {todaySales.length}
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto overflow-x-hidden flex-1 scrollbar-hide">
              <AnimatePresence>
                {todaySales.slice(0, 10).map((sale, index) => {
                  const product = products.find(p => p.name === sale.productName);
                  const style = getCategoryStyle(sale.category);
                  const Icon = getProductIcon(product?.icon, sale.category);
                  return (
                    <motion.div 
                      key={`${sale.id}-${index}`}
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center justify-between p-3 hover:bg-parchment/30 rounded-2xl group transition-colors border border-transparent hover:border-parchment"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center shrink-0 shadow-sm", style.bg, style.text)}>
                          <Icon size={18} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-ink truncate">{sale.productName}</div>
                          <div className="text-[10px] text-dust uppercase tracking-wider flex items-center gap-1">
                            <span>{getTimePart(sale.timestamp)}</span>
                          </div>
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
        </div>
      </div>

      {/* Row 2: Operational Costs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-parchment shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-terra/10 rounded-lg flex items-center justify-center text-terra">
                {expenseChartType === 'bar' ? <BarChart3 size={18} /> : <PieIcon size={18} />}
              </div>
              <h3 className="font-serif text-lg text-ink">Egresos por Categoría</h3>
            </div>

            <div className="flex bg-parchment p-1 rounded-xl border border-mist shadow-inner">
              <button 
                onClick={() => setExpenseChartType('bar')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  expenseChartType === 'bar' ? "bg-white text-espresso shadow-sm" : "text-dust hover:text-bark"
                )}
              >
                <BarChart3 size={16} />
              </button>
              <button 
                onClick={() => setExpenseChartType('pie')}
                className={cn(
                  "p-2 rounded-lg transition-all",
                  expenseChartType === 'pie' ? "bg-white text-espresso shadow-sm" : "text-dust hover:text-bark"
                )}
              >
                <PieIcon size={16} />
              </button>
            </div>
          </div>
          
          <div className="h-[250px] w-full">
            {expenseChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                {expenseChartType === 'bar' ? (
                  <BarChart data={expenseChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#8E9299' }} 
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fontSize: 10, fill: '#8E9299' }}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Gasto']}
                    />
                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} barSize={40}>
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_CATEGORY_STYLES[entry.name]?.hex || '#5c544e'} />
                      ))}
                    </Bar>
                  </BarChart>
                ) : (
                  <PieChart>
                    <Pie
                      data={expenseChartData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="amount"
                    >
                      {expenseChartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={EXPENSE_CATEGORY_STYLES[entry.name]?.hex || '#5c544e'} />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', fontSize: '11px' }}
                      formatter={(value: number) => [`$${value.toFixed(2)}`, 'Gasto']}
                    />
                  </PieChart>
                )}
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-dust gap-2 bg-parchment/10 rounded-2xl">
                <AlertCircle size={24} strokeWidth={1.5} />
                <p className="text-[10px] italic uppercase tracking-widest font-bold">Sin gastos registrados hoy</p>
              </div>
            )}
          </div>
        </div>

        <div className="bg-espresso text-cream p-7 rounded-3xl shadow-xl shadow-espresso/20 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-6">
              <h4 className="font-serif text-xl">Resumen de Hoy</h4>
              <Receipt size={20} className="text-terra" />
            </div>
            
            <div className="space-y-4">
              {expenseCategories.map(cat => {
                const amount = expenseChartData.find(d => d.name === cat)?.amount || 0;
                if (amount === 0) return null;
                const percentage = totalOutflow > 0 ? ((amount / totalOutflow) * 100).toFixed(0) : 0;

                return (
                  <div key={cat} className="flex items-center justify-between group">
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border border-cream/10" 
                        style={{ backgroundColor: `${EXPENSE_CATEGORY_STYLES[cat]?.hex || '#5c544e'}20`, color: EXPENSE_CATEGORY_STYLES[cat]?.hex || '#5c544e' }}
                      >
                        {(() => {
                           const Style = EXPENSE_CATEGORY_STYLES[cat] || EXPENSE_CATEGORY_STYLES['General'];
                           return <Style.icon size={14} />;
                        })()}
                      </div>
                      <span className="text-xs opacity-70 group-hover:opacity-100 transition-opacity">{cat}</span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs font-bold font-mono">-${amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}</p>
                      <p className="text-[9px] opacity-40 italic">{percentage}%</p>
                    </div>
                  </div>
                );
              })}
              {expenseChartData.length === 0 && (
                <div className="text-center py-6 border border-dashed border-cream/10 rounded-2xl">
                  <p className="text-[10px] opacity-40 italic uppercase tracking-widest">Sin egresos</p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-cream/10">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-widest opacity-40 mb-1">Total Salidas</p>
                <div className="text-3xl font-bold font-serif text-terra tracking-tight">
                  -${totalOutflow.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                </div>
              </div>
              <div className="w-12 h-12 bg-terra/10 rounded-2xl flex items-center justify-center text-terra border border-terra/20">
                <TrendingDown size={24} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Row 3: Detail Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Category Chart (Pie) */}
        <div className="bg-white rounded-3xl border border-parchment p-6 shadow-sm overflow-hidden flex flex-col h-full">
           <div className="flex items-center gap-2 mb-1">
             <PieIcon size={18} className="text-gold" />
             <h3 className="font-serif text-lg text-espresso">Ventas por Categoría</h3>
           </div>
           <p className="text-[10px] text-dust uppercase tracking-wider mb-4">Análisis de volumen hoy</p>
           <div className="relative flex-1 min-h-[220px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getCategoryStyle(entry.name).hex} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-dust font-bold uppercase">Total</span>
                <span className="text-lg font-serif font-bold text-espresso">{categoryChartData.length}</span>
              </div>
           </div>
           <div className="mt-4 space-y-2.5">
              {categoryChartData.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-[11px]">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getCategoryStyle(cat.name).hex }} />
                    <span className="text-dust font-medium">{cat.name}</span>
                  </div>
                  <span className="font-bold text-espresso">{formatCurrency(cat.value)}</span>
                </div>
              ))}
           </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white rounded-3xl border border-parchment p-6 shadow-sm flex flex-col h-full">
           <div className="flex items-center gap-2 mb-1">
             <CreditCard size={18} className="text-espresso" />
             <h3 className="font-serif text-lg text-espresso">Métodos de Pago</h3>
           </div>
           <p className="text-[10px] text-dust uppercase tracking-wider mb-6">Canales de ingreso hoy</p>
           <div className="space-y-6 flex-1">
              {Object.entries(paymentMethods).sort(([, a], [, b]) => b - a).map(([method, total]) => {
                const percentage = totalIncome > 0 ? (total / totalIncome) * 100 : 0;
                return (
                  <div key={method} className="space-y-2">
                    <div className="flex justify-between items-center text-xs">
                      <span className="text-dust font-bold tracking-tight">{method}</span>
                      <span className="text-espresso font-black">{formatCurrency(total)}</span>
                    </div>
                    <div className="h-2 w-full bg-parchment rounded-full overflow-hidden shadow-inner">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        className={cn(
                          "h-full rounded-full transition-all duration-1000",
                          method.includes('Efectivo') ? 'bg-gold' : 
                          method.includes('Tarjeta') ? 'bg-[#5c6bc0]' : 
                          method.includes('Transferencia') ? 'bg-sage' : 'bg-dust'
                        )}
                      />
                    </div>
                  </div>
                );
              })}
           </div>
           <div className="mt-6 pt-5 border-t border-parchment flex items-center justify-between">
             <div className="flex items-center gap-2 text-gold">
               <ArrowDownCircle size={14} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Total Líquido</span>
             </div>
             <span className="font-serif text-xl font-bold text-espresso">{formatCurrency(totalIncome)}</span>
           </div>
        </div>

        {/* Inventory & Alerts */}
        <div className="space-y-6 flex flex-col h-full">
          {/* Top Sellers (Integrated Compact) */}
          <div className="bg-espresso rounded-3xl p-6 text-white shadow-xl shadow-espresso/20 flex-1">
            <div className="flex items-center gap-3 mb-6">
              <Trophy size={18} className="text-gold" />
              <h3 className="font-serif text-lg">Top Productos</h3>
            </div>
            <div className="space-y-5">
              {topProducts.map(([name, qty], index) => (
                <div key={name} className="flex items-center gap-4 group">
                  <div className={cn(
                    "w-8 h-8 rounded-xl flex items-center justify-center text-[10px] font-bold shrink-0",
                    index === 0 ? "bg-gold text-espresso" : "bg-white/10 text-white"
                  )}>
                    {index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate group-hover:text-gold transition-colors">{name}</div>
                    <div className="w-full h-1 bg-white/5 rounded-full mt-2 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${(qty / Number(topProducts[0][1])) * 100}%` }}
                        className="h-full bg-gold/40"
                      />
                    </div>
                  </div>
                  <div className="text-[10px] font-black text-gold/80">{qty} u</div>
                </div>
              ))}
              {topProducts.length === 0 && (
                <div className="text-center py-10 opacity-30 italic text-xs">Sin registros aún</div>
              )}
            </div>
          </div>

          {/* Stock Alerts */}
          <div className="bg-red-50 rounded-3xl p-6 border border-red-100 shadow-sm">
             <div className="flex items-center gap-2 mb-4 text-red-600">
               <AlertTriangle size={18} />
               <span className="text-[10px] font-bold uppercase tracking-widest">Alertas Críticas</span>
             </div>
             <div className="space-y-2">
                {products.filter(p => p.stock < 5).slice(0, 4).map((p, index) => (
                  <div key={`${p.id}-${index}`} className="flex justify-between items-center text-xs p-3 bg-white rounded-xl border border-red-50 shadow-sm">
                    <span className="text-ink font-bold truncate pr-2 tracking-tight">{p.name}</span>
                    <span className="px-2.5 py-0.5 bg-red-100 text-red-600 rounded-lg font-black text-[10px]">{p.stock < 1 ? 'AGOTADO' : p.stock}</span>
                  </div>
                ))}
                {products.filter(p => p.stock < 5).length === 0 && (
                  <div className="text-center py-6 text-sage text-[10px] font-bold uppercase tracking-widest bg-sage/5 rounded-2xl border border-dashed border-sage/20">
                    Stock Bajo Control ✓
                  </div>
                )}
             </div>
          </div>
        </div>
      </div>

      {/* Row 4: Historical Context */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.99 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] border border-parchment p-8 shadow-sm"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
          <div>
            <h3 className="font-serif text-2xl text-espresso tracking-tight mb-1">Tendencia Semanal</h3>
            <p className="text-[11px] text-dust uppercase tracking-widest font-medium">Comparativa de flujo de caja (7 días)</p>
          </div>
          <div className="flex bg-parchment/50 p-1 rounded-2xl border border-parchment">
            <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl shadow-sm border border-parchment">
              <div className="w-2.5 h-2.5 rounded-full bg-gold" />
              <span className="text-[11px] font-bold uppercase text-bark">Ingresos</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl">
              <div className="w-2.5 h-2.5 rounded-full bg-terra" />
              <span className="text-[11px] font-bold uppercase text-dust">Egresos</span>
            </div>
          </div>
        </div>
        <div className="h-[350px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#C5A059" stopOpacity={0.25}/>
                  <stop offset="95%" stopColor="#C5A059" stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#D27C5A" stopOpacity={0.15}/>
                  <stop offset="95%" stopColor="#D27C5A" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="5 5" vertical={false} stroke="#E6E2D6" />
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A89F91', fontSize: 11, fontWeight: 500 }}
                dy={15}
              />
              <YAxis 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#A89F91', fontSize: 11, fontWeight: 500 }}
                tickFormatter={(val) => `$${val}`}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  borderRadius: '20px', 
                  border: '1px solid #E6E2D6',
                  boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                  padding: '12px 16px'
                }}
                cursor={{ stroke: '#C5A059', strokeWidth: 1.5, strokeDasharray: '4 4' }}
              />
              <Area type="monotone" dataKey="ventas" stroke="#C5A059" strokeWidth={4} fillOpacity={1} fill="url(#colorSales)" />
              <Area type="monotone" dataKey="gastos" stroke="#D27C5A" strokeWidth={2.5} strokeDasharray="6 6" fillOpacity={1} fill="url(#colorExpenses)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}

