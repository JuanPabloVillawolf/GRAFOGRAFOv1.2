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
  Users,
  X,
  BookOpen,
  CupSoda,
  ShoppingBag,
  Beer,
  Settings,
  CreditCard,
  Wallet,
  Landmark,
  UserPlus,
  Clock
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
  onUpdatePendingAccount?: (items: CartItem[]) => void;
  posCart: CartItem[];
  setPosCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  posCustomerName: string;
  setPosCustomerName: (name: string) => void;
}

function CartView({ 
  cart, 
  removeFromCart, 
  updateCartQuantity, 
  cartTotal, 
  activePendingAccount, 
  onUpdatePendingAccount,
  isMobile = false,
  onCloseMobile,
  customerName,
  setCustomerName,
  quickCheckout,
  hideCheckout = false
}: {
  cart: CartItem[],
  removeFromCart: (id: string) => void,
  updateCartQuantity: (id: string, delta: number) => void,
  cartTotal: number,
  activePendingAccount?: PendingAccount | null,
  onUpdatePendingAccount?: (items: CartItem[]) => void,
  isMobile?: boolean,
  onCloseMobile?: () => void,
  customerName?: string,
  setCustomerName?: (val: string) => void,
  quickCheckout?: (method: string) => void,
  hideCheckout?: boolean
}) {
  return (
    <div className={cn(
      "bg-white flex flex-col h-full shadow-xl shadow-espresso/5 transition-all duration-300",
      !isMobile && "border border-mist/40 rounded-[2rem] lg:sticky lg:top-24 lg:max-h-[calc(100vh-120px)]",
      isMobile && "rounded-b-[1.5rem]"
    )}>
      <div className="p-4 lg:p-5 border-b border-mist bg-cream/20 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShoppingCart size={20} className="text-bark" />
            <h3 className="font-serif text-lg text-espresso">Carrito</h3>
          </div>
          <div className="flex items-center gap-2">
            <span className="bg-gold/20 text-espresso text-[10px] font-bold px-2 py-1 rounded-full whitespace-nowrap">
              {cart.reduce((sum, item) => sum + item.quantity, 0)} {cart.length === 1 ? 'item' : 'items'}
            </span>
            {isMobile && onCloseMobile && (
              <button 
                onClick={onCloseMobile}
                className="p-1 text-dust hover:text-espresso transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
        </div>

        {/* Reference / Customer Name - Always visible for quick access */}
        <div className="relative group">
          <UserPlus size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-dust group-focus-within:text-gold transition-colors" />
          <input 
            type="text"
            value={customerName || ''}
            onChange={(e) => setCustomerName?.(e.target.value)}
            className="w-full bg-white border border-mist rounded-xl py-2 pl-9 pr-4 text-xs outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 transition-all"
            placeholder="Nombre o Mesa (Ref. opcional)"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 lg:p-4 space-y-2 min-h-[150px] max-h-[50vh] lg:max-h-none scrollbar-thin scrollbar-thumb-parchment">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-dust py-10 opacity-50">
            <ShoppingCart size={40} strokeWidth={1} />
            <p className="text-xs mt-2 italic">Carrito vacío</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  className="bg-cream/20 border border-mist/30 rounded-2xl p-3 hover:border-mist transition-all group relative overflow-hidden"
                >
                  <div className="flex justify-between items-start gap-2 mb-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-espresso leading-tight pr-4">{item.product.name}</div>
                      <div className="text-[10px] text-dust font-medium mt-0.5">{formatCurrency(item.product.price)} c/u</div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-red-300 hover:text-red-500 transition-colors shrink-0 p-1"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    {/* Quantity Controls */}
                    <div className="flex items-center gap-3 bg-white px-2 py-1.5 rounded-xl border border-mist/50 shadow-sm">
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, -1)}
                        className="w-6 h-6 flex items-center justify-center text-dust hover:text-espresso hover:bg-cream rounded-lg transition-colors"
                      >
                        <Minus size={12} strokeWidth={3} />
                      </button>
                      <span className="text-xs font-bold text-espresso min-w-[1.2rem] text-center">{item.quantity}</span>
                      <button 
                        onClick={() => updateCartQuantity(item.product.id, 1)}
                        className="w-6 h-6 flex items-center justify-center text-dust hover:text-espresso hover:bg-cream rounded-lg transition-colors"
                      >
                        <Plus size={12} strokeWidth={3} />
                      </button>
                    </div>

                    {/* Subtotal */}
                    <div className="font-serif text-sm font-bold text-bark bg-white/50 px-3 py-1.5 rounded-xl border border-parchment">
                      {formatCurrency(item.product.price * item.quantity)}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="p-4 bg-parchment/30 border-t border-mist space-y-4 rounded-b-2xl">
        <div className="flex justify-between items-end">
          <div className="flex flex-col">
            <span className="text-[9px] text-dust font-bold uppercase tracking-widest leading-none">Total</span>
            <span className="text-2xl font-bold text-espresso leading-none">{formatCurrency(cartTotal)}</span>
          </div>
        </div>
        <div className="flex flex-col gap-3">
          {!hideCheckout && (
            activePendingAccount ? (
              <button 
                onClick={() => onUpdatePendingAccount?.(cart)}
                disabled={cart.length === 0}
                className="w-full py-4 bg-gold text-espresso rounded-2xl text-sm font-bold hover:bg-bark hover:text-white transition-all shadow-xl shadow-gold/10 flex items-center justify-center gap-2"
              >
                <Clock size={18} />
                Actualizar Cuenta Pendiente
              </button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-between px-1">
                  <div className="text-[10px] font-bold text-dust uppercase tracking-[0.2em]">Forma de Pago</div>
                </div>
                
                <div className="grid grid-cols-2 gap-2.5">
                  <button 
                    onClick={() => quickCheckout?.('Efectivo')}
                    disabled={cart.length === 0}
                    className="h-16 bg-espresso text-cream rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-bark transition-all disabled:opacity-50 shadow-lg shadow-espresso/10 group"
                  >
                    <Wallet size={18} className="group-active:scale-90 transition-transform" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Efectivo</span>
                  </button>
                  <button 
                    onClick={() => quickCheckout?.('Tarjeta')}
                    disabled={cart.length === 0}
                    className="h-16 bg-gold text-espresso rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-bark hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-gold/10 group"
                  >
                    <CreditCard size={18} className="group-active:scale-90 transition-transform" />
                    <span className="text-[9px] font-bold uppercase tracking-wider">Tarjeta</span>
                  </button>
                  <button 
                    onClick={() => quickCheckout?.('Transferencia')}
                    disabled={cart.length === 0}
                    className="h-14 bg-cream border border-mist/50 text-espresso rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-mist transition-all disabled:opacity-50 group"
                  >
                    <Landmark size={14} className="text-dust group-active:scale-90 transition-transform" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-dust">Transfer</span>
                  </button>
                  <button 
                    onClick={() => quickCheckout?.('Pendiente')}
                    disabled={cart.length === 0}
                    className="h-14 bg-cream border border-mist/50 text-espresso rounded-2xl flex flex-col items-center justify-center gap-1 hover:bg-mist transition-all disabled:opacity-50 group"
                  >
                    <Clock size={14} className="text-bark group-active:scale-90 transition-transform" />
                    <span className="text-[8px] font-bold uppercase tracking-widest text-bark">Pendiente</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 opacity-80">
                  <button 
                    onClick={() => quickCheckout?.('Gratis')}
                    disabled={cart.length === 0}
                    className="py-2.5 bg-parchment/30 border border-parchment text-dust rounded-xl flex items-center justify-center gap-2 hover:bg-parchment transition-all text-[8px] font-bold uppercase tracking-widest"
                  >
                    <Gift size={12} />
                    Cortesía
                  </button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}

const CATEGORY_STYLES: Record<string, { icon: any, color: string, bg: string, border: string, text: string }> = {
  'Libros': { icon: Library, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust' },
  'Books': { icon: Library, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust' },
  'Librería': { icon: Library, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust' },
  'Café': { icon: Coffee, color: 'bg-dust/10', bg: 'bg-espresso/5', border: 'border-espresso/10', text: 'text-dust' },
  'Coffee': { icon: Coffee, color: 'bg-dust/10', bg: 'bg-espresso/5', border: 'border-espresso/10', text: 'text-dust' },
  'Bebidas': { icon: CupSoda, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust' },
  'Drinks': { icon: CupSoda, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust' },
  'Nieve': { icon: IceCream, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust' },
  'Ice Cream': { icon: IceCream, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust' },
  'Helados': { icon: IceCream, color: 'bg-dust/10', bg: 'bg-sage/5', border: 'border-sage/10', text: 'text-dust' },
  'Snacks': { icon: Cookie, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust' },
  'Cookies': { icon: Cookie, color: 'bg-dust/10', bg: 'bg-bark/5', border: 'border-bark/10', text: 'text-dust' },
  'Alimentos': { icon: Utensils, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust' },
  'Food': { icon: Utensils, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust' },
  'Accesorios': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust' },
  'Regalos': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust' },
  'Gifts': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust' },
  'Bazar': { icon: ShoppingBag, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust' },
  'Eventos': { icon: Ticket, color: 'bg-dust/10', bg: 'bg-gold/5', border: 'border-gold/10', text: 'text-dust' },
  'Events': { icon: Ticket, color: 'bg-dust/10', bg: 'bg-gold/5', border: 'border-gold/10', text: 'text-dust' },
  'Vinos': { icon: Wine, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust' },
  'Wine': { icon: Wine, color: 'bg-dust/10', bg: 'bg-terra/5', border: 'border-terra/10', text: 'text-dust' },
  'Otros': { icon: Sparkles, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust' },
  'Other': { icon: Sparkles, color: 'bg-dust/10', bg: 'bg-dust/5', border: 'border-dust/10', text: 'text-dust' },
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

export function SalesPOS({ 
  products, 
  onAddSale, 
  sales, 
  pendingAccounts, 
  activePendingAccount, 
  onCancelPending,
  onUpdatePendingAccount,
  posCart,
  setPosCart,
  posCustomerName,
  setPosCustomerName
}: SalesPOSProps) {
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategoryName, setSelectedCategoryName] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customItem, setCustomItem] = useState({ name: '', price: 0 });
  const [showMobileCart, setShowMobileCart] = useState(false);

  const cartTotal = useMemo(() => {
    return posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [posCart]);

  useEffect(() => {
    if (activePendingAccount) {
      setPosCustomerName(activePendingAccount.customerName);
      
      // Load account items into cart
      const accountCart = activePendingAccount.items.map(item => {
        const product = products.find(p => p.id === item.productId);
        // Fallback for custom or deleted products
        const finalProduct = product || {
          id: item.productId,
          name: item.productName,
          category: item.category,
          price: item.price,
          stock: 999,
          icon: 'sparkles'
        } as Product;
        return { product: finalProduct, quantity: item.quantity };
      });
      setPosCart(accountCart);
    }
    // Note: We removed the clear-on-exit logic for persistence
  }, [activePendingAccount, products]);

  const categories = [...new Set(products.map(p => p.category))].sort((a, b) => a.localeCompare(b));

  const toggleCategory = (cat: string) => {
    setSelectedCategoryName(cat);
    setShowCategoryModal(true);
  };

  const handleAddToCart = (product: Product) => {
    setPosCart(prev => {
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
    setPosCart(prev => {
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
    setPosCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const handleQuickCheckout = (method: string) => {
    if (posCart.length === 0) return;

    if (method === 'Pendiente' && !posCustomerName.trim()) {
      alert('Por favor, ingresa un nombre o mesa para la cuenta pendiente.');
      return;
    }
    
    // Process each item in cart as a sale
    posCart.forEach(item => {
      const amount = method === 'Gratis' ? 0 : (method === 'Pendiente' ? undefined : item.product.price * item.quantity);
      onAddSale(item.product, item.quantity, method, amount, posCustomerName.trim());
    });

    setPosCart([]);
    setPosCustomerName('');
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
    
    setPosCart(prev => [...prev, { product: tempProduct, quantity: 1 }]);
    setShowCustomModal(false);
    setCustomItem({ name: '', price: 0 });
  };

  return (
    <div className="max-w-none mx-auto space-y-6 px-2 lg:px-4">
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
        <div className="grid grid-cols-1 lg:grid-cols-6 gap-6">
          <div className="lg:col-span-4 space-y-6">
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
          </div>


          <div className="min-h-[400px]">
            {searchTerm ? (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-dust font-bold">Resultados de búsqueda</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
                          "p-3 sm:p-4 border rounded-xl flex items-center justify-between transition-all group disabled:opacity-50 text-left gap-3",
                          getCategoryStyle(product.category).bg,
                          getCategoryStyle(product.category).border,
                          "hover:shadow-md"
                        )}
                      >
                        <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shrink-0 shadow-sm",
                            getCategoryStyle(product.category).color,
                            getCategoryStyle(product.category).text
                          )}>
                            {(() => {
                              const Icon = getProductIcon(product.icon, product.category);
                              return <Icon size={16} />;
                            })()}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-xs font-bold text-ink truncate">{product.name}</div>
                            <div className="text-[9px] md:text-[10px] text-dust uppercase tracking-wider font-bold">
                              {product.category}
                            </div>
                          </div>
                        </div>
                        <div className="font-serif text-xs sm:text-sm font-bold text-espresso group-hover:text-bark whitespace-nowrap bg-white/60 px-2 py-1 rounded-lg border border-mist/20 shadow-sm">
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
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categories.map((cat) => {
                  const style = getCategoryStyle(cat);
                  // Find the first product in this category to use its icon
                  const firstProduct = products.find(p => p.category === cat);
                  const Icon = firstProduct 
                    ? getProductIcon(firstProduct.icon, firstProduct.category)
                    : style.icon;

                  return (
                    <button
                      key={cat}
                      onClick={() => toggleCategory(cat)}
                      className={cn(
                        "w-full aspect-square p-4 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 group bg-white border-parchment text-espresso hover:border-gold shadow-sm hover:shadow-xl hover:-translate-y-1",
                        style.bg.replace('bg-', 'hover:bg-').replace('/10', '/20')
                      )}
                    >
                      <div className={cn(
                        "w-16 h-16 sm:w-20 sm:h-20 rounded-[1.5rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                        style.color, style.text
                      )}>
                        <Icon size={36} className="sm:size-10" />
                      </div>
                      <div className="text-center space-y-1">
                        <span className="font-serif text-sm sm:text-base font-bold tracking-tight block">{cat}</span>
                        <span className="text-[10px] text-dust font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                          {products.filter(p => p.category === cat).length} items
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Shopping Cart Sidebar */}
        <div className={cn(
          "w-full lg:col-span-2",
          "fixed inset-x-4 bottom-4 z-40 lg:static lg:inset-auto lg:z-auto",
          showMobileCart ? "translate-y-0" : "translate-y-[calc(100%+20px)] lg:translate-y-0"
        )}>
          <CartView 
            cart={posCart}
            removeFromCart={removeFromCart}
            updateCartQuantity={updateCartQuantity}
            cartTotal={cartTotal}
            activePendingAccount={activePendingAccount}
            onUpdatePendingAccount={onUpdatePendingAccount}
            isMobile={!window.matchMedia('(min-width: 1024px)').matches}
            onCloseMobile={() => setShowMobileCart(false)}
            customerName={posCustomerName}
            setCustomerName={setPosCustomerName}
            quickCheckout={handleQuickCheckout}
          />
        </div>
      </div>

      {/* Mobile Cart Toggle */}
      <AnimatePresence>
        {posCart.length > 0 && !showMobileCart && (
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
                {posCart.reduce((sum, item) => sum + item.quantity, 0)}
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
              className="bg-white rounded-2xl md:rounded-[2.5rem] shadow-2xl w-full max-w-5xl overflow-hidden h-full max-h-[85vh] md:max-h-[80vh] flex flex-col cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
                <div className="flex-1 flex flex-col min-w-0 border-r border-parchment/50">
                  <div className={cn(
                    "p-4 md:p-5 flex items-center justify-between border-b shrink-0",
                    getCategoryStyle(selectedCategoryName).bg,
                    getCategoryStyle(selectedCategoryName).border
                  )}>
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className={cn(
                        "w-10 h-10 md:w-12 md:h-12 rounded-[1rem] md:rounded-2xl flex items-center justify-center shadow-md",
                        getCategoryStyle(selectedCategoryName).color,
                        getCategoryStyle(selectedCategoryName).text
                      )}>
                        {(() => {
                          const Icon = getCategoryStyle(selectedCategoryName).icon;
                          return <Icon size={20} className="md:size-[24px]" />;
                        })()}
                      </div>
                      <div>
                        <h4 className="font-serif text-base md:text-xl text-espresso">{selectedCategoryName}</h4>
                        <p className="text-[10px] md:text-xs text-dust font-bold uppercase tracking-widest opacity-60">Catálogo de Productos</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setShowCategoryModal(false)}
                      className="md:hidden p-2 text-dust hover:text-espresso"
                    >
                      <X size={20} />
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 md:p-6 bg-cream/10">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
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
                              "p-3 md:p-4 border rounded-xl md:rounded-2xl flex items-center justify-between transition-all group disabled:opacity-50 text-left bg-white shadow-sm hover:shadow-md",
                              getCategoryStyle(product.category).border,
                              "hover:border-gold"
                            )}
                          >
                            <div className="flex items-center gap-2 md:gap-3 flex-1 min-w-0">
                              <div className={cn(
                                "w-8 h-8 md:w-10 md:h-10 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 shadow-inner",
                                getCategoryStyle(product.category).color,
                                getCategoryStyle(product.category).text
                              )}>
                                {(() => {
                                  const Icon = getProductIcon(product.icon, product.category);
                                  return <Icon size={16} className="md:size-[20px]" />;
                                })()}
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="text-xs font-bold text-ink truncate">{product.name}</div>
                                <div className="text-[9px] md:text-[10px] text-dust font-bold uppercase tracking-wider">Stock: {product.stock}</div>
                              </div>
                            </div>
                            <div className="text-right shrink-0 ml-3">
                              <div className="font-serif text-sm md:text-base font-bold text-espresso group-hover:text-bark transition-colors bg-cream/50 px-2 py-1 rounded-lg">
                                {formatCurrency(product.price)}
                              </div>
                            </div>
                          </button>
                        ))
                      }
                    </div>
                  </div>

                  <div className="p-4 bg-cream border-t border-parchment flex justify-between items-center shrink-0">
                    <div className="text-[9px] md:text-[10px] text-dust font-bold uppercase tracking-widest bg-white/50 px-3 py-1 rounded-full border border-mist/20">
                      {products.filter(p => p.category === selectedCategoryName).length} Opciones
                    </div>
                    <button 
                      onClick={() => setShowCategoryModal(false)}
                      className="px-6 md:px-8 py-2 md:py-2.5 bg-espresso text-cream rounded-xl font-bold text-[10px] uppercase tracking-widest hover:bg-bark transition-all shadow-md"
                    >
                      Cerrar Vista
                    </button>
                  </div>
                </div>

                {/* Integrated Cart inside Modal */}
                <div className="flex flex-col w-full md:w-[360px] shrink-0 bg-parchment/10 border-t md:border-t-0 md:border-l border-parchment overflow-hidden h-64 md:h-full">
                  <div className="w-full h-full p-2 md:p-4">
                    <CartView 
                      cart={posCart}
                      removeFromCart={removeFromCart}
                      updateCartQuantity={updateCartQuantity}
                      cartTotal={cartTotal}
                      activePendingAccount={activePendingAccount}
                      onUpdatePendingAccount={onUpdatePendingAccount}
                      isMobile={true}
                      onCloseMobile={() => setShowMobileCart(false)}
                      customerName={posCustomerName}
                      setCustomerName={setPosCustomerName}
                      quickCheckout={handleQuickCheckout}
                      hideCheckout={true}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
