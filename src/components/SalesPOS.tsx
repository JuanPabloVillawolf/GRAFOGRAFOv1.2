import { useState, useEffect, useMemo } from 'react';
import { Product, Sale, PendingAccount } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { 
  Library, 
  Coffee, 
  GlassWater, 
  IceCream, 
  Cookie, 
  Utensils, 
  Gift, 
  Ticket, 
  Wine, 
  Sparkles,
  ChevronDown, 
  ChevronUp, 
  Search, 
  ShoppingCart, 
  Receipt, 
  Plus, 
  Minus, 
  Trash2, 
  User, 
  X,
  BookOpen,
  CupSoda,
  ShoppingBag,
  Beer,
  Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface SalesPOSProps {
  products: Product[];
  onAddSale: (product: Product, quantity: number, paymentMethod: string, totalAmount?: number, customerName?: string) => void;
  sales: Sale[];
  pendingAccounts: PendingAccount[];
  activePendingAccount?: PendingAccount | null;
  onCancelPending?: () => void;
}

const CATEGORY_STYLES: Record<string, { icon: any, color: string, bg: string, border: string, text: string }> = {
  'Libros': { icon: Library, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark' },
  'Books': { icon: Library, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark' },
  'Librería': { icon: Library, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark' },
  'Café': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/15', border: 'border-espresso/20', text: 'text-espresso' },
  'Coffee': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/15', border: 'border-espresso/20', text: 'text-espresso' },
  'Bebidas': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra' },
  'Drinks': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra' },
  'Nieve': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage' },
  'Ice Cream': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage' },
  'Helados': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/15', border: 'border-sage/20', text: 'text-sage' },
  'Snacks': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark' },
  'Cookies': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/15', border: 'border-bark/20', text: 'text-bark' },
  'Alimentos': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra' },
  'Food': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra' },
  'Accesorios': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust' },
  'Regalos': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust' },
  'Gifts': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust' },
  'Bazar': { icon: ShoppingBag, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust' },
  'Eventos': { icon: Ticket, color: 'bg-gold', bg: 'bg-gold/15', border: 'border-gold/20', text: 'text-gold' },
  'Events': { icon: Ticket, color: 'bg-gold', bg: 'bg-gold/15', border: 'border-gold/20', text: 'text-gold' },
  'Vinos': { icon: Wine, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra' },
  'Wine': { icon: Wine, color: 'bg-terra', bg: 'bg-terra/15', border: 'border-terra/20', text: 'text-terra' },
  'Otros': { icon: Sparkles, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust' },
  'Other': { icon: Sparkles, color: 'bg-dust', bg: 'bg-dust/15', border: 'border-dust/20', text: 'text-dust' },
};

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

export function SalesPOS({ products, onAddSale, sales, pendingAccounts, activePendingAccount, onCancelPending }: SalesPOSProps) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', price: 0 });
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [payments, setPayments] = useState<{ method: string, amount: number }[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<string>('');
  const [customerName, setCustomerName] = useState('');
  const [isQuickMenuEnabled, setIsQuickMenuEnabled] = useState(true);
  const [showMobileCart, setShowMobileCart] = useState(false);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cart]);

  const topProductsList = useMemo(() => {
    // Only consider sales from the last 30 days for "trending" or overall for "frequent"
    // Let's do overall frequency since the prompt says "most frequent"
    const frequencyMap: Record<string, number> = {};
    sales.forEach(sale => {
      frequencyMap[sale.productName] = (frequencyMap[sale.productName] || 0) + sale.quantity;
    });

    return products
      .filter(p => frequencyMap[p.name] > 0 && p.stock > 0)
      .sort((a, b) => (frequencyMap[b.name] || 0) - (frequencyMap[a.name] || 0))
      .slice(0, 4);
  }, [sales, products]);

  useEffect(() => {
    if (activePendingAccount) {
      setCustomerName(activePendingAccount.customerName);
    } else if (!showPaymentModal) {
      setCustomerName('');
    }
  }, [activePendingAccount, showPaymentModal]);

  const categories = [...new Set(products.map(p => p.category))];

  const toggleCategory = (cat: string) => {
    setSelectedCategoryName(cat);
    setShowCategoryModal(true);
  };

  const handleAddToCart = (product: Product) => {
    if (activePendingAccount) {
      // Direct add to pending account if one is active
      onAddSale(product, 1, 'Pendiente', product.price, activePendingAccount.customerName);
      return;
    }

    setCart(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) {
          alert('No hay suficiente stock disponible.');
          return prev;
        }
        return prev.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + 1 } 
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });
  };

  const updateCartQuantity = (productId: string, delta: number) => {
    setCart(prev => {
      return prev.map(item => {
        if (item.product.id === productId) {
          const newQty = Math.max(0, item.quantity + delta);
          if (newQty > item.product.stock) {
            alert('No hay suficiente stock disponible.');
            return item;
          }
          return { ...item, quantity: newQty };
        }
        return item;
      }).filter(item => item.quantity > 0);
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleCheckout = () => {
    if (cart.length === 0) return;
    setPayments([]);
    setPaymentAmount(cartTotal.toString());
    setCustomerName(activePendingAccount?.customerName || '');
    setShowPaymentModal(true);
  };

  const parseAmount = (val: string): number => {
    if (!val) return 0;
    // Remove everything EXCEPT digits, dots and minus sign
    const clean = val.toString().replace(/[^0-9.-]/g, '');
    const parsed = parseFloat(clean);
    return isNaN(parsed) ? 0 : parsed;
  };

  const addPayment = (method: string) => {
    const amount = parseAmount(paymentAmount);
    if (amount <= 0) return;

    const newPayments = [...payments, { method, amount }];
    setPayments(newPayments);
    
    // Update payment amount for next part
    const totalPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = cartTotal - totalPaid;
    setPaymentAmount(remaining > 0 ? remaining.toFixed(2) : '');
  };

  const removePayment = (index: number) => {
    const newPayments = [...payments];
    const removed = newPayments.splice(index, 1)[0];
    setPayments(newPayments);
    
    const totalToPay = cartTotal;
    const currentPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
    setPaymentAmount((totalToPay - currentPaid).toString());
  };

  const confirmSale = () => {
    if (cart.length === 0) return;
    
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
    
    // Check if it's a pending payment
    const isPending = payments.some(p => p.method === 'Pendiente');
    
    if (isPending) {
      if (!customerName.trim()) {
        alert('Por favor, ingresa un nombre de referencia para la cuenta pendiente.');
        return;
      }
      
      // Process each item in cart for pending
      cart.forEach(item => {
        onAddSale(item.product, item.quantity, 'Pendiente', undefined, customerName.trim());
      });

      setShowPaymentModal(false);
      setCart([]);
      setPayments([]);
      setCustomerName('');
      return;
    }

    if (totalPaid < cartTotal) return;

    const paymentDescription = payments
      .map(p => `${p.method}: ${formatCurrency(p.amount)}`)
      .join(' + ');

    const paidAmount = payments
      .filter(p => p.method !== 'Gratis')
      .reduce((sum, p) => sum + p.amount, 0);

    // Process each item in cart as a sale
    // We distribute the total paid proportionally or just record each item
    // For simplicity, we record each item with the combined payment description
    cart.forEach(item => {
      onAddSale(item.product, item.quantity, paymentDescription, (item.product.price * item.quantity / cartTotal) * paidAmount);
    });

    setShowPaymentModal(false);
    setCart([]);
    setPayments([]);
  };

  const handleCustomSale = () => {
    if (!customItem.name || customItem.price <= 0) return;
    
    const tempProduct: Product = {
      id: 'custom-' + Date.now(),
      name: customItem.name,
      category: 'Otros',
      price: customItem.price,
      stock: 999,
      icon: 'sparkles'
    };
    
    setCart(prev => [...prev, { product: tempProduct, quantity: 1 }]);
    setShowCustomModal(false);
    setCustomItem({ name: '', price: 0 });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Active Pending Account Banner */}
      <AnimatePresence>
        {activePendingAccount && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-gold/20 border border-gold/30 rounded-2xl p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gold/30 rounded-full flex items-center justify-center text-espresso">
                <User size={20} />
              </div>
              <div>
                <div className="text-[10px] font-bold text-espresso/60 uppercase tracking-widest">Editando Cuenta de:</div>
                <div className="font-serif text-lg text-espresso">{activePendingAccount.customerName}</div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <div className="text-[10px] font-bold text-espresso/60 uppercase tracking-widest">Total Acumulado</div>
                <div className="font-bold text-espresso">
                  {formatCurrency(activePendingAccount.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                </div>
              </div>
              <button 
                onClick={onCancelPending}
                className="p-2 hover:bg-gold/30 rounded-full text-espresso transition-colors"
                title="Cancelar edición"
              >
                <X size={20} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart and Products Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" size={18} />
              <input 
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border border-mist rounded-xl py-3 pl-12 pr-10 text-sm outline-none focus:border-bark transition-colors"
              />
              {searchTerm && (
                <button 
                  onClick={() => setSearchTerm('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dust hover:text-espresso"
                >
                  ×
                </button>
              )}
            </div>
            <button 
              onClick={() => setShowCustomModal(true)}
              className="px-4 bg-espresso text-cream rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-bark transition-colors shadow-lg shadow-espresso/10"
              title="Agregar producto extra"
            >
              <Plus size={20} />
            </button>
            <label className="flex items-center gap-2 px-3 py-2 bg-white border border-mist rounded-xl cursor-pointer hover:border-parchment transition-colors group">
              <div className="relative flex items-center justify-center">
                <input 
                  type="checkbox" 
                  checked={isQuickMenuEnabled}
                  onChange={() => setIsQuickMenuEnabled(!isQuickMenuEnabled)}
                  className="peer appearance-none w-5 h-5 border-2 border-mist rounded-md checked:bg-gold checked:border-gold transition-all cursor-pointer"
                />
                <Sparkles 
                  size={10} 
                  className={cn(
                    "absolute transition-opacity pointer-events-none",
                    isQuickMenuEnabled ? "text-espresso opacity-100" : "text-dust opacity-0"
                  )} 
                />
              </div>
              <span className="text-[10px] font-bold text-dust uppercase tracking-widest group-hover:text-espresso whitespace-nowrap">
                Frecuentes
              </span>
            </label>
          </div>

          {/* Quick Menu */}
          {isQuickMenuEnabled && topProductsList.length > 0 && !searchTerm && (
            <div className="space-y-3 pb-2">
              <div className="flex items-center gap-2 px-1">
                <div className="w-5 h-5 bg-gold/20 rounded flex items-center justify-center">
                  <Sparkles size={12} className="text-gold" />
                </div>
                <h4 className="text-[10px] font-bold text-dust uppercase tracking-widest">Lo más vendido</h4>
              </div>
              <div className="grid grid-cols-2 gap-3 pb-2">
                {topProductsList.map((product) => {
                  const style = getCategoryStyle(product.category);
                  const Icon = getProductIcon(product.icon, product.category);
                  return (
                    <motion.button
                      key={`quick-${product.id}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => handleAddToCart(product)}
                      className="flex items-center gap-3 p-3 bg-white border border-parchment rounded-xl hover:border-gold transition-all shadow-sm text-left group"
                    >
                      <div className={cn("w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-transform group-hover:scale-110", style.bg, style.text)}>
                        <Icon size={20} />
                      </div>
                      <div className="min-w-0 pr-1">
                        <p className="text-[11px] font-bold text-espresso truncate leading-tight mb-0.5">{product.name}</p>
                        <p className="text-[10px] text-bark font-bold">{formatCurrency(product.price)}</p>
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          <div className="min-h-[400px]">
            {searchTerm ? (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-dust font-bold">Resultados de búsqueda</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {products
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .sort((a, b) => {
                      const term = searchTerm.toLowerCase();
                      const aName = a.name.toLowerCase();
                      const bName = b.name.toLowerCase();
                      
                      // Exact match
                      if (aName === term) return -1;
                      if (bName === term) return 1;
                      
                      // Starts with
                      if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
                      if (!aName.startsWith(term) && bName.startsWith(term)) return 1;
                      
                      return aName.localeCompare(bName);
                    })
                    .map((product, index) => (
                      <button
                        key={`${product.id}-${index}`}
                        id={`pos-search-${product.id}`}
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0}
                        className={cn(
                          "p-4 border rounded-xl flex items-center justify-between transition-all group disabled:opacity-50 text-left",
                          getCategoryStyle(product.category).bg,
                          getCategoryStyle(product.category).border,
                          "hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                            getCategoryStyle(product.category).color,
                            "text-white"
                          )}>
                            {(() => {
                              const Icon = getProductIcon(product.icon, product.category);
                              return <Icon size={16} />;
                            })()}
                          </div>
                          <div>
                            <div className="text-xs font-medium text-ink">{product.name}</div>
                            <div className="text-[10px] text-dust uppercase tracking-wider">
                              {product.category}
                            </div>
                          </div>
                        </div>
                        <div className="font-serif text-sm font-semibold text-espresso group-hover:text-bark">
                          {formatCurrency(product.price)}
                        </div>
                      </button>
                    ))
                  }
                  {products.filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
                    <div className="col-span-2 py-20 text-center text-dust italic text-sm">
                      No se encontraron productos que coincidan con "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {categories.map((cat) => {
                  const style = getCategoryStyle(cat);
                  // Find the first product in this category to use its icon
                  const firstProduct = products.find(p => p.category === cat);
                  const Icon = firstProduct 
                    ? getProductIcon(firstProduct.icon, firstProduct.category)
                    : style.icon;

                  return (
                    <div key={cat} className="space-y-2">
                      <button
                        onClick={() => toggleCategory(cat)}
                        className={cn(
                          "w-full p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group bg-white border-parchment text-espresso hover:border-bark shadow-sm hover:shadow-md",
                          style.bg.replace('bg-', 'hover:bg-').replace('/15', '/20')
                        )}
                      >
                        <div className={cn(
                          "w-14 h-14 rounded-2xl flex items-center justify-center transition-all group-hover:scale-110",
                          style.bg, style.text,
                          "shadow-inner"
                        )}>
                          <Icon size={32} />
                        </div>
                        <span className="font-serif text-sm font-semibold tracking-wide">{cat}</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Shopping Cart Sidebar */}
        <div className={cn(
          "bg-white border border-parchment rounded-2xl flex flex-col h-fit lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)] shadow-xl shadow-espresso/5 transition-all duration-300",
          "fixed inset-x-4 bottom-4 z-40 lg:static lg:inset-auto lg:z-auto",
          showMobileCart ? "translate-y-0" : "translate-y-[calc(100%+20px)] lg:translate-y-0"
        )}>
          <div className="p-4 lg:p-5 border-b border-mist flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingCart size={20} className="text-bark" />
              <h3 className="font-serif text-lg text-espresso">Carrito</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-gold/20 text-espresso text-[10px] font-bold px-2 py-1 rounded-full">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
              <button 
                onClick={() => setShowMobileCart(false)}
                className="lg:hidden p-1 text-dust hover:text-espresso"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-3 min-h-[150px] max-h-[40vh] lg:max-h-none">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-dust py-10 opacity-50">
                <ShoppingCart size={40} strokeWidth={1} />
                <p className="text-xs mt-2 italic">Carrito vacío</p>
              </div>
            ) : (
              <AnimatePresence initial={false}>
                {cart.map((item) => (
                  <motion.div
                    key={item.product.id}
                    layout
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-cream/50 border border-mist rounded-xl p-3 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div className="text-xs font-medium text-espresso line-clamp-1">{item.product.name}</div>
                      <button 
                        onClick={() => removeFromCart(item.product.id)}
                        className="text-dust hover:text-red-500 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 bg-white border border-mist rounded-lg p-1">
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="p-1 hover:bg-parchment rounded transition-colors text-dust"
                        >
                          <Minus size={12} />
                        </button>
                        <span className="text-xs font-bold w-6 text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="p-1 hover:bg-parchment rounded transition-colors text-dust"
                        >
                          <Plus size={12} />
                        </button>
                      </div>
                      <div className="text-xs font-bold text-bark">
                        {formatCurrency(item.product.price * item.quantity)}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            )}
          </div>

          <div className="p-5 bg-parchment/30 border-t border-mist space-y-4 rounded-b-2xl">
            <div className="flex justify-between items-center">
              <span className="text-xs text-dust font-medium uppercase tracking-wider">Total</span>
              <span className="text-xl font-bold text-espresso">{formatCurrency(cartTotal)}</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={cart.length === 0}
              className="w-full py-3 bg-espresso text-cream rounded-xl text-sm font-bold hover:bg-bark transition-all shadow-lg shadow-espresso/20 disabled:opacity-50 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <Receipt size={18} />
              Cobrar Ahora
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Cart Toggle */}
      <AnimatePresence>
        {cart.length > 0 && !showMobileCart && (
          <motion.button
            initial={{ scale: 0, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0, y: 20 }}
            onClick={() => setShowMobileCart(true)}
            className="lg:hidden fixed bottom-6 right-6 z-40 bg-espresso text-cream p-4 rounded-full shadow-2xl flex items-center gap-2"
          >
            <div className="relative">
              <ShoppingCart size={24} />
              <span className="absolute -top-2 -right-2 bg-gold text-espresso text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-espresso">
                {cart.reduce((sum, item) => sum + item.quantity, 0)}
              </span>
            </div>
            <span className="font-bold text-sm pr-2">{formatCurrency(cartTotal)}</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Custom Item Modal */}
      <AnimatePresence>
        {showCustomModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowCustomModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-mist">
                <h3 className="font-serif text-lg text-espresso">Producto Extra</h3>
                <p className="text-xs text-dust mt-1">Agrega un concepto que no está en el inventario.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Concepto / Nombre</label>
                  <input 
                    type="text"
                    value={customItem.name}
                    onChange={(e) => setCustomItem({...customItem, name: e.target.value})}
                    className="w-full bg-cream border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-bark"
                    placeholder="Ej. Donación, Taller, etc."
                  />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Precio ($)</label>
                  <input 
                    type="number"
                    value={customItem.price || ''}
                    onChange={(e) => setCustomItem({...customItem, price: parseFloat(e.target.value)})}
                    className="w-full bg-cream border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-bark"
                    placeholder="0.00"
                  />
                </div>
              </div>
              <div className="p-4 bg-cream flex justify-end gap-3">
                <button 
                  onClick={() => setShowCustomModal(false)}
                  className="px-4 py-2 text-xs font-medium text-dust hover:text-espresso"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleCustomSale}
                  disabled={!customItem.name || customItem.price <= 0}
                  className="px-6 py-2 text-[10px] font-bold uppercase tracking-wider bg-espresso text-cream rounded-lg hover:bg-bark transition-colors disabled:opacity-50"
                >
                  Continuar al Pago
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Payment Method Modal */}
      <AnimatePresence>
        {showPaymentModal && cart.length > 0 && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm cursor-pointer"
            onClick={() => {
              setShowPaymentModal(false);
              setPayments([]);
            }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6 border-b border-mist text-center">
                <div className="text-[10px] font-bold text-dust uppercase tracking-widest mb-1">Confirmar Venta</div>
                <h3 className="font-serif text-xl text-espresso">Resumen de Compra</h3>
                <div className="text-2xl font-bold text-bark mt-2">{formatCurrency(cartTotal)}</div>
              </div>

              <div className="p-6 space-y-6 max-h-[60vh] overflow-y-auto">
                {/* Cart Items Summary */}
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-dust uppercase tracking-wider">Productos:</div>
                  <div className="space-y-1">
                    {cart.map((item, idx) => (
                      <div key={idx} className="flex justify-between text-xs text-espresso">
                        <span>{item.quantity}x {item.product.name}</span>
                        <span className="font-medium">{formatCurrency(item.product.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Current Payments List */}
                {payments.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-dust uppercase tracking-wider">Pagos Registrados:</div>
                    <div className="space-y-1">
                      {payments.map((p, idx) => (
                        <div key={idx} className="flex items-center justify-between bg-cream px-3 py-2 rounded-lg text-xs">
                          <span className="font-medium text-espresso">{p.method}</span>
                          <div className="flex items-center gap-3">
                            <span className="font-bold text-bark">{formatCurrency(p.amount)}</span>
                            <button 
                              onClick={() => removePayment(idx)}
                              className="text-red-400 hover:text-red-600"
                            >
                              ×
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Remaining Balance */}
                <div className="flex justify-between items-center py-2 border-t border-dashed border-mist">
                  <span className="text-xs text-dust">Restante:</span>
                  <span className="text-lg font-bold text-espresso">
                    {formatCurrency(cartTotal - payments.reduce((sum, p) => sum + p.amount, 0))}
                  </span>
                </div>

                {/* Customer Name for Pending */}
                {payments.some(p => p.method === 'Pendiente') && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="space-y-2 pt-2 border-t border-mist relative"
                  >
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-wider">Nombre de Referencia (Cuenta Abierta)</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dust" />
                      <input 
                        type="text"
                        value={customerName}
                        onChange={(e) => setCustomerName(e.target.value)}
                        className="w-full bg-gold/5 border border-gold/30 rounded-xl py-2 pl-9 pr-4 text-sm outline-none focus:border-gold"
                        placeholder="Ej. Mesa 5, Juan Pérez..."
                      />
                    </div>

                    {/* Suggestions */}
                    {customerName.trim().length > 0 && !activePendingAccount && (
                      <div className="absolute z-20 left-0 right-0 top-full mt-1 bg-white border border-mist rounded-xl shadow-lg max-h-32 overflow-y-auto">
                        {pendingAccounts
                          .filter(acc => {
                            const normalizedInput = customerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            const normalizedAcc = acc.customerName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return normalizedAcc.includes(normalizedInput);
                          })
                          .map(acc => {
                            const isExactMatch = acc.customerName.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === 
                                               customerName.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
                            return (
                              <button
                                key={acc.id}
                                type="button"
                                onClick={() => setCustomerName(acc.customerName)}
                                className={cn(
                                  "w-full text-left px-4 py-2 text-xs hover:bg-parchment border-b border-mist last:border-0 flex justify-between items-center transition-colors",
                                  isExactMatch && "bg-gold/10"
                                )}
                              >
                                <div className="flex flex-col">
                                  <span className="font-medium text-espresso">{acc.customerName}</span>
                                  {isExactMatch && <span className="text-[8px] text-gold font-bold uppercase">Coincidencia Exacta</span>}
                                </div>
                                <span className="text-[9px] text-dust uppercase">Cuenta Existente</span>
                              </button>
                            );
                          })
                        }
                      </div>
                    )}
                  </motion.div>
                )}

                {/* Amount Input */}
                {cartTotal - payments.reduce((sum, p) => sum + p.amount, 0) > 0 && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Cantidad a pagar</label>
                      <input 
                        type="number"
                        value={paymentAmount}
                        onChange={(e) => setPaymentAmount(e.target.value)}
                        className="w-full bg-cream border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-bark"
                        placeholder="0.00"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      {(['Efectivo', 'Tarjeta', 'Transferencia', 'Pendiente', 'Gratis', 'Otro'] as const).map((method) => (
                        <button
                          key={method}
                          onClick={() => addPayment(method)}
                          className={cn(
                            "py-2.5 rounded-xl text-[10px] font-bold uppercase tracking-wider transition-all border",
                            method === 'Pendiente' 
                              ? "bg-gold/20 border-gold/30 text-espresso hover:bg-gold/40"
                              : "bg-white border-mist text-espresso hover:border-bark hover:bg-parchment"
                          )}
                        >
                          {method}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-cream flex flex-col gap-3">
                <button 
                  onClick={confirmSale}
                  disabled={payments.reduce((sum, p) => sum + p.amount, 0) < cartTotal}
                  className="w-full py-3 bg-espresso text-cream rounded-xl text-sm font-bold hover:bg-bark transition-colors disabled:opacity-50"
                >
                  Finalizar Venta
                </button>
                <button 
                  onClick={() => {
                    setShowPaymentModal(false);
                    setPayments([]);
                  }}
                  className="text-xs font-medium text-dust hover:text-espresso text-center"
                >
                  Cancelar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Category Products Modal */}
      <AnimatePresence>
        {showCategoryModal && selectedCategoryName && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowCategoryModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl overflow-hidden max-h-[85vh] flex flex-col cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className={cn(
                "p-6 flex items-center justify-between border-b shrink-0",
                getCategoryStyle(selectedCategoryName).bg,
                getCategoryStyle(selectedCategoryName).border
              )}>
                <div className="flex items-center gap-4">
                  <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center",
                    getCategoryStyle(selectedCategoryName).color,
                    "text-white"
                  )}>
                    {(() => {
                      const Icon = getCategoryStyle(selectedCategoryName).icon;
                      return <Icon size={24} />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-espresso">{selectedCategoryName}</h3>
                    <p className="text-xs text-dust">Productos disponibles en esta categoría</p>
                  </div>
                </div>
                <button 
                  onClick={() => setShowCategoryModal(false)}
                  className="p-2 hover:bg-black/5 rounded-full transition-colors text-dust hover:text-espresso"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {products
                    .filter(p => p.category === selectedCategoryName)
                    .sort((a, b) => a.name.localeCompare(b.name))
                    .map((product, index) => (
                      <button
                        key={`${product.id}-${index}`}
                        id={`pos-modal-product-${product.id}`}
                        onClick={() => {
                          handleAddToCart(product);
                        }}
                        disabled={product.stock <= 0}
                        className={cn(
                          "p-4 border rounded-2xl flex items-center justify-between transition-all group disabled:opacity-50 text-left",
                          getCategoryStyle(product.category).bg,
                          getCategoryStyle(product.category).border,
                          "hover:shadow-md hover:bg-white"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                            getCategoryStyle(product.category).color,
                            "text-white"
                          )}>
                            {(() => {
                              const Icon = getProductIcon(product.icon, product.category);
                              return <Icon size={20} />;
                            })()}
                          </div>
                          <div>
                            <div className="text-xs font-bold text-ink">{product.name}</div>
                            <div className="text-[10px] text-dust font-medium">Stock: {product.stock}</div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="font-serif text-sm font-bold text-espresso group-hover:text-bark">
                            {formatCurrency(product.price)}
                          </div>
                        </div>
                      </button>
                    ))
                  }
                </div>
                {products.filter(p => p.category === selectedCategoryName).length === 0 && (
                  <div className="text-center py-20 text-dust italic text-sm">
                    No hay productos en esta categoría.
                  </div>
                )}
              </div>

              <div className="p-4 bg-cream border-t border-parchment flex justify-between items-center shrink-0">
                <div className="text-xs text-dust">
                  {products.filter(p => p.category === selectedCategoryName).length} Productos
                </div>
                <button 
                  onClick={() => setShowCategoryModal(false)}
                  className="px-8 py-2.5 bg-espresso text-cream rounded-xl font-bold text-xs hover:bg-bark transition-colors shadow-lg shadow-espresso/20"
                >
                  Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
