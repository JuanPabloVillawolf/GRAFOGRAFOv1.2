import { useState, useEffect, useMemo, useRef } from 'react';
import { Product, Sale, PendingAccount, Category } from '../types';
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
  Clock,
  RefreshCw
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CartItem {
  product: Product;
  quantity: number;
}

interface SalesPOSProps {
  products: Product[];
  onAddSale: (product: Product, quantity: number, paymentMethod: string, totalAmount?: number, customerName?: string, overrideUsername?: string, note?: string) => Promise<void>;
  sales: Sale[];
  users: any[];
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
      isMobile && "rounded-t-[2.5rem] lg:rounded-b-[2.5rem]"
    )}>
      <div className="p-5 lg:p-6 border-b border-mist bg-cream/10 shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-bark/10 rounded-2xl flex items-center justify-center text-bark">
              <ShoppingCart size={20} />
            </div>
            <div>
              <h3 className="font-serif text-lg text-espresso leading-none">Mi Carrito</h3>
              <p className="text-[10px] text-dust font-bold uppercase tracking-widest mt-1">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} Productos
              </p>
            </div>
          </div>
          {isMobile && onCloseMobile && (
            <button 
              onClick={onCloseMobile}
              className="w-10 h-10 flex items-center justify-center bg-parchment/30 text-dust hover:text-espresso rounded-xl transition-colors"
            >
              <X size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 lg:p-6 space-y-4 min-h-[200px] scrollbar-thin scrollbar-thumb-parchment">
        {cart.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-dust py-12 opacity-40">
            <div className="w-20 h-20 bg-parchment/20 rounded-full flex items-center justify-center mb-4">
              <ShoppingBag size={40} strokeWidth={1} />
            </div>
            <p className="font-serif italic text-base">El carrito está vacío</p>
            <p className="text-[10px] uppercase tracking-widest mt-1 font-bold">Selecciona productos para comenzar</p>
          </div>
        ) : (
          <div className="space-y-4">
            <AnimatePresence initial={false}>
              {cart.map((item) => (
                <motion.div
                  key={item.product.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="bg-white border border-mist/40 rounded-[1.5rem] overflow-hidden shadow-sm hover:shadow-md transition-all group"
                >
                  {/* Product Header */}
                  <div className="bg-cream/10 p-3 flex justify-between items-start border-b border-mist/20">
                    <div className="flex-1 min-w-0 pr-4">
                      <div className="text-xs font-bold text-espresso leading-tight truncate">{item.product.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[9px] text-dust font-bold uppercase tracking-wider">{item.product.category}</span>
                        <span className="text-[9px] text-bark font-bold whitespace-nowrap">{formatCurrency(item.product.price)} / ud</span>
                      </div>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.product.id)}
                      className="w-8 h-8 flex items-center justify-center text-red-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                  
                  {/* Product Controls & Totals */}
                  <div className="p-3 flex items-center justify-between gap-4">
                    {/* Quantity Selector */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[9px] font-bold text-dust uppercase tracking-widest px-1">Cantidad</span>
                      <div className="flex items-center gap-2 bg-parchment/20 p-1 rounded-xl border border-mist/30">
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, -1)}
                          className="w-8 h-8 flex items-center justify-center bg-white text-dust hover:text-espresso rounded-lg shadow-sm active:scale-90 transition-all border border-mist/20"
                        >
                          <Minus size={12} strokeWidth={3} />
                        </button>
                        <span className="text-sm font-bold text-espresso min-w-[2rem] text-center">{item.quantity}</span>
                        <button 
                          onClick={() => updateCartQuantity(item.product.id, 1)}
                          className="w-8 h-8 flex items-center justify-center bg-bark text-white rounded-lg shadow-sm active:scale-90 transition-all shadow-bark/20"
                        >
                          <Plus size={12} strokeWidth={3} />
                        </button>
                      </div>
                    </div>

                    {/* Subtotal Display */}
                    <div className="text-right flex flex-col items-end">
                      <span className="text-[9px] font-bold text-dust uppercase tracking-widest">Subtotal</span>
                      <span className="font-serif text-lg font-bold text-espresso">
                        {formatCurrency(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <div className="p-5 lg:p-6 bg-parchment/20 border-t border-mist space-y-5 shrink-0 rounded-b-[2rem]">
        <div className="flex justify-between items-center">
          <div className="flex flex-col">
            <span className="text-[10px] text-dust font-bold uppercase tracking-[0.2em] mb-1">Total a Pagar</span>
            <span className="text-3xl font-bold text-espresso leading-none">{formatCurrency(cartTotal)}</span>
          </div>
          <div className="w-12 h-12 bg-bark/10 rounded-full flex items-center justify-center text-bark border border-bark/20">
            <Receipt size={24} />
          </div>
        </div>

        <div className="space-y-3">
          {!hideCheckout && (
            activePendingAccount ? (
              <button 
                onClick={() => onUpdatePendingAccount?.(cart)}
                disabled={cart.length === 0}
                className="w-full py-4 bg-bark text-white rounded-2xl text-sm font-bold hover:bg-espresso transition-all shadow-xl shadow-bark/20 flex items-center justify-center gap-3 active:scale-[0.98]"
              >
                <RefreshCw size={18} className={cn(cart.length > 0 && "animate-spin-slow")} />
                Actualizar Cuenta
              </button>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center gap-3 group">
                  <div className="h-px flex-1 bg-mist/50"></div>
                  <span className="text-[10px] font-bold text-dust uppercase tracking-[0.3em]">Checkout</span>
                  <div className="h-px flex-1 bg-mist/50"></div>
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <button 
                    onClick={() => quickCheckout?.('Efectivo')}
                    disabled={cart.length === 0}
                    className="h-20 bg-espresso text-cream rounded-[1.5rem] flex flex-col items-center justify-center gap-2 hover:bg-bark transition-all disabled:opacity-50 shadow-lg shadow-espresso/20 group active:scale-[0.98]"
                  >
                    <div className="p-1.5 bg-white/10 rounded-lg group-hover:scale-110 transition-transform">
                      <Wallet size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Efectivo</span>
                  </button>
                  <button 
                    onClick={() => quickCheckout?.('Tarjeta')}
                    disabled={cart.length === 0}
                    className="h-20 bg-gold text-espresso rounded-[1.5rem] flex flex-col items-center justify-center gap-2 hover:bg-bark hover:text-white transition-all disabled:opacity-50 shadow-lg shadow-gold/20 group active:scale-[0.98]"
                  >
                    <div className="p-1.5 bg-espresso/5 rounded-lg group-hover:scale-110 transition-transform">
                      <CreditCard size={20} />
                    </div>
                    <span className="text-[10px] font-bold uppercase tracking-widest">Tarjeta</span>
                  </button>
                  <button 
                    onClick={() => quickCheckout?.('Transferencia')}
                    disabled={cart.length === 0}
                    className="h-14 bg-white border border-mist/40 text-espresso rounded-2xl flex items-center justify-center gap-2 hover:bg-cream transition-all disabled:opacity-50 group active:scale-[0.98] shadow-sm"
                  >
                    <Landmark size={16} className="text-dust" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-dust">Transfer</span>
                  </button>
                  <button 
                    onClick={() => quickCheckout?.('Pendiente')}
                    disabled={cart.length === 0}
                    className="h-14 bg-white border border-mist/40 text-espresso rounded-2xl flex items-center justify-center gap-2 hover:bg-cream transition-all disabled:opacity-50 group active:scale-[0.98] shadow-sm"
                  >
                    <Clock size={16} className="text-bark" />
                    <span className="text-[9px] font-bold uppercase tracking-widest text-bark">A Cuenta</span>
                  </button>
                </div>

                <div className="pt-2">
                  <button 
                    onClick={() => quickCheckout?.('Gratis')}
                    disabled={cart.length === 0}
                    className="w-full py-3 bg-parchment/20 border border-parchment text-dust rounded-xl flex items-center justify-center gap-3 hover:bg-white transition-all text-[9px] font-bold uppercase tracking-[0.2em] active:scale-[0.98]"
                  >
                    <Gift size={14} className="text-terra" />
                    Gesto de Cortesía
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

const getCategoryStyle = (cat: string | undefined) => {
  const normalized = String(cat || 'Otros').trim().toLowerCase();
  const key = Object.keys(CATEGORY_STYLES).find(k => k.toLowerCase() === normalized);
  return CATEGORY_STYLES[key || 'Otros'];
};

const getProductIcon = (iconName: string | undefined, category: string) => {
  if (iconName) {
    const normalized = String(iconName).trim().toLowerCase();
    if (ICON_MAP[normalized]) return ICON_MAP[normalized];
  }
  return getCategoryStyle(category).icon;
};

export function SalesPOS({ 
  products, 
  onAddSale, 
  sales, 
  users,
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);

  const filteredProducts = useMemo(() => {
    if (!searchTerm) return [];
    const term = searchTerm.toLowerCase();
    return products
      .filter(p => p.name && p.name.toLowerCase().includes(term))
      .sort((a, b) => {
        const aName = a.name.toLowerCase();
        const bName = b.name.toLowerCase();
        
        // Exact match
        if (aName === term) return -1;
        if (bName === term) return 1;
        
        // Starts with
        if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
        if (!aName.startsWith(term) && bName.startsWith(term)) return 1;
        
        return aName.localeCompare(bName);
      });
  }, [products, searchTerm]);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [customItem, setCustomItem] = useState<{ name: string, price: number, category: Category }>({ name: '', price: 0, category: 'Otros' });
  const [showMobileCart, setShowMobileCart] = useState(false);
  
  const [showUserSelection, setShowUserSelection] = useState(false);
  const [currentSalesPayments, setCurrentSalesPayments] = useState<{method: string, amount: number}[]>([]);
  const [pendingCheckoutMethod, setPendingCheckoutMethod] = useState<string | null>(null);
  const [paymentAmountInput, setPaymentAmountInput] = useState<string>('');
  const [selectedAccountId, setSelectedAccountId] = useState<string | null>(null);
  const [posNote, setPosNote] = useState('');

  const [isProcessing, setIsProcessing] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const cartTotal = useMemo(() => {
    return posCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [posCart]);

  const remainingPaymentBalance = useMemo(() => {
    const paid = currentSalesPayments.reduce((sum, p) => sum + p.amount, 0);
    return Math.max(0, cartTotal - paid);
  }, [currentSalesPayments, cartTotal]);

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
    
    // Clear search to "exit" search mode after selecting
    if (searchTerm) {
      setSearchTerm('');
      setShowSuggestions(false);
    }
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

    if (method === 'Pendiente') {
      // We no longer block here, we'll ask in the modal
      setPendingCheckoutMethod('Pendiente');
      setShowUserSelection(true);
      return;
    }

    if (method === 'Gratis') {
      setCurrentSalesPayments([{ method: 'Gratis', amount: cartTotal }]);
      setShowUserSelection(true);
      return;
    }

    // Default: Add the selected method with the remaining balance
    const amount = remainingPaymentBalance > 0 ? remainingPaymentBalance : cartTotal;
    setCurrentSalesPayments([{ method, amount }]);
    setPaymentAmountInput(amount.toString());
    setShowUserSelection(true);
  };

  const addPaymentMethod = (method: string) => {
    if (remainingPaymentBalance <= 0) return;
    const newPayments = [...currentSalesPayments, { method, amount: remainingPaymentBalance }];
    setCurrentSalesPayments(newPayments);
    setPaymentAmountInput(remainingPaymentBalance.toString());
  };

  const removePaymentMethod = (index: number) => {
    const newPayments = [...currentSalesPayments];
    newPayments.splice(index, 1);
    setCurrentSalesPayments(newPayments);
    if (newPayments.length > 0) {
      setPaymentAmountInput(newPayments[newPayments.length-1].amount.toString());
    }
  };

  const updatePaymentAmount = (index: number, val: string) => {
    const amount = parseFloat(val) || 0;
    const newPayments = [...currentSalesPayments];
    newPayments[index].amount = amount;
    setCurrentSalesPayments(newPayments);
    setPaymentAmountInput(val);
  };

  const finalizeCheckout = async (selectedUsername: string) => {
    if (posCart.length === 0 || isProcessing) return;
    setIsProcessing(true);

    try {
      if (pendingCheckoutMethod === 'Pendiente') {
        let finalCustomerName = (posNote?.trim() || posCustomerName?.trim() || '').trim();
        
        if (!selectedAccountId && !finalCustomerName) {
          alert('Por favor, ingresa un nombre o referencia para la cuenta pendiente en el campo de "Nombre del Cliente".');
          setIsProcessing(false);
          return;
        }

        if (selectedAccountId) {
          const acc = pendingAccounts.find(a => a.id === selectedAccountId);
          if (acc) finalCustomerName = acc.customerName;
        }

        for (const item of posCart) {
          await onAddSale(item.product, item.quantity, 'Pendiente', undefined, finalCustomerName, selectedUsername, posNote);
        }
      } else {
        const totalPaid = currentSalesPayments.reduce((sum, p) => sum + p.amount, 0);
        if (Math.abs(totalPaid - cartTotal) > 0.01 && currentSalesPayments[0]?.method !== 'Gratis') {
          alert('El monto total pagado debe coincidir con el total del carrito.');
          setIsProcessing(false);
          return;
        }

        // Record each item split by each payment method
        for (const item of posCart) {
          const itemTotal = item.product.price * item.quantity;
          
          for (let pIdx = 0; pIdx < currentSalesPayments.length; pIdx++) {
            const payment = currentSalesPayments[pIdx];
            // Calculate the portion of this item's price covered by this payment
            // If 'Gratis', amount is always 0
            const portion = payment.method === 'Gratis' ? 0 : (payment.amount / cartTotal) * itemTotal;
            
            // Inventory is deducted only for the FIRST row of this item in this sale
            const qtyToRecord = pIdx === 0 ? item.quantity : 0;
            
            await onAddSale(
              item.product, 
              qtyToRecord, 
              payment.method, 
              portion, 
              posCustomerName?.trim() || '', 
              selectedUsername,
              posNote
            );
          }
        }
      }

      setPosCart([]);
      setPosCustomerName('');
      setPosNote('');
      setShowUserSelection(false);
      setPendingCheckoutMethod(null);
      setCurrentSalesPayments([]);
      setSelectedAccountId(null);
    } catch (error) {
      console.error('Checkout error:', error);
      alert('Error al procesar la venta. Por favor intenta de nuevo.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCustomSale = () => {
    if (!customItem.name || customItem.price <= 0) return;
    
    const tempProduct: Product = {
      id: 'custom-' + Date.now(),
      name: customItem.name,
      category: customItem.category || 'Otros',
      price: customItem.price,
      stock: 999,
      icon: 'sparkles'
    };
    
    setPosCart(prev => [...prev, { product: tempProduct, quantity: 1 }]);
    setShowCustomModal(false);
    setCustomItem({ name: '', price: 0, category: 'Otros' });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev < Math.min(filteredProducts.length, 8) - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveSuggestionIndex(prev => (prev > 0 ? prev - 1 : prev));
    } else if (e.key === 'Enter') {
      if (activeSuggestionIndex >= 0 && filteredProducts[activeSuggestionIndex]) {
        e.preventDefault();
        handleAddToCart(filteredProducts[activeSuggestionIndex]);
        setSearchTerm('');
        setShowSuggestions(false);
        setActiveSuggestionIndex(-1);
      }
    } else if (e.key === 'Escape') {
      setShowSuggestions(false);
    }
  };

  return (
    <div className="max-w-none mx-auto space-y-6 px-2 lg:px-4 pb-32 lg:pb-8">
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
            <div className="relative flex-1" ref={searchRef}>
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" size={18} />
              <input 
                type="text"
                placeholder="Buscar producto..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowSuggestions(true);
                  setActiveSuggestionIndex(-1);
                }}
                onFocus={() => setShowSuggestions(true)}
                onKeyDown={handleKeyDown}
                className={cn(
                  "w-full bg-white border border-mist rounded-xl py-3 pl-12 pr-10 text-sm outline-none focus:border-bark transition-all relative",
                  showSuggestions && searchTerm && "shadow-xl ring-2 ring-bark/5"
                )}
              />
              {searchTerm && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setShowSuggestions(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-dust hover:text-espresso"
                >
                  <X size={16} />
                </button>
              )}

              {/* Autocomplete Suggestions */}
              <AnimatePresence>
                {showSuggestions && searchTerm && filteredProducts.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.98 }}
                    className="absolute z-10 left-0 right-0 top-full mt-2 bg-white border border-mist rounded-2xl shadow-2xl overflow-hidden max-h-80 overflow-y-auto"
                    onMouseLeave={() => setActiveSuggestionIndex(-1)}
                  >
                    <div className="px-3 py-2 bg-cream/30 text-[10px] font-bold text-dust uppercase tracking-wider border-b border-mist/30">
                      Sugerencias de productos
                    </div>
                    {filteredProducts.slice(0, 8).map((product, idx) => (
                      <button
                        key={`${product.id}-${idx}`}
                        onMouseEnter={() => setActiveSuggestionIndex(idx)}
                        onClick={() => {
                          handleAddToCart(product);
                          setSearchTerm('');
                          setShowSuggestions(false);
                          setActiveSuggestionIndex(-1);
                        }}
                        className={cn(
                          "w-full px-4 py-3 flex items-center justify-between text-left transition-colors group",
                          activeSuggestionIndex === idx ? "bg-bark text-white" : "hover:bg-cream text-espresso"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-lg flex items-center justify-center shadow-sm shrink-0",
                            activeSuggestionIndex === idx ? "bg-white/20 text-white" : getCategoryStyle(product.category).color + " " + getCategoryStyle(product.category).text
                          )}>
                            {(() => {
                              const Icon = getProductIcon(product.icon, product.category);
                              return <Icon size={14} />;
                            })()}
                          </div>
                          <div>
                            <div className={cn(
                              "text-xs font-bold leading-tight",
                              activeSuggestionIndex === idx ? "text-white" : "text-espresso"
                            )}>{product.name}</div>
                            <div className={cn(
                              "text-[10px] uppercase tracking-wider font-medium mt-0.5",
                              activeSuggestionIndex === idx ? "text-white/60" : "text-dust"
                            )}>{product.category}</div>
                          </div>
                        </div>
                        <div className={cn(
                          "text-xs font-bold px-2 py-1 rounded-lg border",
                          activeSuggestionIndex === idx 
                            ? "bg-white/20 border-white/30 text-white" 
                            : "bg-white/60 border-mist/20 text-bark"
                        )}>
                          {formatCurrency(product.price)}
                        </div>
                      </button>
                    ))}
                    <div className="px-4 py-2 bg-parchment/10 text-[9px] text-center text-dust italic border-t border-mist/20">
                      Presiona Enter para agregar al carrito
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
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
            {searchTerm && !showSuggestions ? (
              <div className="space-y-4">
                <div className="text-[10px] uppercase tracking-widest text-dust font-bold">Resultados de búsqueda</div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {filteredProducts.map((product, index) => (
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
                  {filteredProducts.length === 0 && (
                    <div className="col-span-2 py-20 text-center text-dust italic text-sm">
                      No se encontraron productos que coincidan con "{searchTerm}"
                    </div>
                  )}
                </div>
              </div>
            ) : !searchTerm ? (
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
            ) : (
              <div className="h-full flex flex-col items-center justify-center py-20 opacity-20 pointer-events-none grayscale">
                <Search size={64} strokeWidth={1} className="text-dust mb-4" />
                <p className="font-serif text-xl italic text-dust">Buscando en el catálogo...</p>
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
                <div className="relative">
                  <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Categoría</label>
                  <div className="relative">
                    <select 
                      value={customItem.category}
                      onChange={(e) => setCustomItem({ ...customItem, category: e.target.value as Category })}
                      className="w-full bg-cream border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-bark appearance-none cursor-pointer"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                      {!categories.includes('Otros') && <option value="Otros">Otros</option>}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-dust pointer-events-none" size={16} />
                  </div>
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

      {/* Checkout Modal (User Selection + Multi Payment) */}
      <AnimatePresence>
        {showUserSelection && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden border border-parchment flex flex-col md:flex-row"
            >
              {/* Payment Info Section */}
              <div className="flex-1 border-b md:border-b-0 md:border-r border-mist flex flex-col">
                <div className="p-5 border-b border-mist bg-parchment/10">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="p-2 bg-espresso text-cream rounded-xl">
                      <CreditCard size={20} />
                    </div>
                    <h3 className="font-serif text-xl text-espresso">{isProcessing ? 'Procesando...' : 'Finalizar Venta'}</h3>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <div className="text-[10px] font-bold text-dust uppercase tracking-widest">Total a Pagar</div>
                      <div className="text-2xl font-bold text-espresso">{formatCurrency(cartTotal)}</div>
                    </div>
                    {remainingPaymentBalance > 0 && (
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Pendiente</div>
                        <div className="text-lg font-bold text-red-500">{formatCurrency(remainingPaymentBalance)}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[300px] md:max-h-none">
                  {pendingCheckoutMethod === 'Pendiente' ? (
                    <div className="space-y-4">
                      <div className="bg-gold/10 border border-gold/20 p-4 rounded-2xl flex items-center gap-3">
                        <Clock className="text-espresso shrink-0" size={24} />
                        <div>
                          <div className="font-bold text-espresso text-sm">Cuenta Pendiente</div>
                          <p className="text-[10px] text-espresso/60 leading-tight">Escribe el nombre del cliente en la **Nota** de abajo para abrir una cuenta o selecciona una existente.</p>
                        </div>
                      </div>

                      {pendingAccounts.length > 0 && (
                        <div className="space-y-2">
                          <div className="text-[10px] font-bold text-dust uppercase tracking-widest">Cuentas Abiertas</div>
                          <div className="grid grid-cols-1 gap-2 max-h-[160px] overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-mist/30">
                            {pendingAccounts.map(acc => (
                              <button
                                key={acc.id}
                                onClick={() => {
                                  setSelectedAccountId(acc.id);
                                  // No limpiamos la nota porque puede servir como detalle adicional
                                }}
                                className={cn(
                                  "flex items-center justify-between p-3 rounded-xl border transition-all text-left",
                                  selectedAccountId === acc.id 
                                    ? "bg-gold/10 border-gold shadow-sm" 
                                    : "bg-white border-mist/30 hover:border-gold/50"
                                )}
                              >
                                <div className="flex items-center gap-3">
                                  <div className="w-8 h-8 rounded-full bg-parchment flex items-center justify-center text-espresso">
                                    <Users size={14} />
                                  </div>
                                  <div>
                                    <div className="text-xs font-bold text-espresso truncate max-w-[120px]">{acc.customerName}</div>
                                    <div className="text-[9px] text-dust font-medium italic">
                                      Saldo anterior: {formatCurrency(acc.items.reduce((s, i) => s + i.price * i.quantity, 0) - (acc.payments?.reduce((s, p) => s + p.amount, 0) || 0))}
                                    </div>
                                  </div>
                                </div>
                                {selectedAccountId === acc.id && <div className="w-2 h-2 rounded-full bg-gold animate-pulse" />}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-[10px] font-bold text-dust uppercase tracking-widest mb-2">Métodos de Pago</div>
                      <div className="space-y-2">
                        {currentSalesPayments.map((p, idx) => {
                          const paymentKey = `${p.method}-${idx}-${p.amount}`;
                          return (
                            <div key={paymentKey} className="flex items-center gap-2 bg-cream/40 p-2 rounded-xl border border-mist/30">
                              <div className="flex-1">
                                <div className="text-[10px] font-bold text-dust ml-1 mb-1">{p.method}</div>
                                <div className="relative">
                                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs font-bold text-dust">$</span>
                                  <input 
                                    type="number"
                                    value={p.amount}
                                    onChange={(e) => updatePaymentAmount(idx, e.target.value)}
                                    className="w-full bg-white border border-mist rounded-lg py-1.5 pl-6 pr-3 text-sm font-bold text-espresso outline-none focus:border-gold"
                                  />
                                </div>
                              </div>
                              <button 
                                onClick={() => removePaymentMethod(idx)}
                                className="p-2 text-red-300 hover:text-red-500 transition-colors mt-4"
                              >
                                <X size={16} />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {remainingPaymentBalance > 0 && (
                        <div className="pt-2 border-t border-mist/50">
                          <div className="text-[10px] font-bold text-dust uppercase tracking-widest mb-3">Agregar otro método</div>
                          <div className="grid grid-cols-3 gap-2">
                            {['Efectivo', 'Tarjeta', 'Transferencia'].map(m => (
                              <button
                                key={m}
                                onClick={() => addPaymentMethod(m)}
                                className="py-2 px-1 bg-white border border-mist/50 rounded-xl text-[10px] font-bold text-dust hover:border-gold hover:text-espresso transition-all flex flex-col items-center gap-1"
                              >
                                {m === 'Efectivo' && <Wallet size={14} />}
                                {m === 'Tarjeta' && <CreditCard size={14} />}
                                {m === 'Transferencia' && <Landmark size={14} />}
                                {m}
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="space-y-3 pt-4 border-t border-mist/50">
                    <div className="text-[10px] font-bold text-dust uppercase tracking-widest px-1">
                      {pendingCheckoutMethod === 'Pendiente' && !selectedAccountId ? 'Nombre del Cliente / Referencia' : 'Nota de Venta (opcional)'}
                    </div>
                    <textarea 
                      value={posNote}
                      onChange={(e) => {
                        setPosNote(e.target.value);
                        if (pendingCheckoutMethod === 'Pendiente' && !selectedAccountId) {
                          setPosCustomerName(e.target.value);
                        }
                      }}
                      placeholder={pendingCheckoutMethod === 'Pendiente' && !selectedAccountId ? "Escribe el nombre del cliente aquí..." : "Agrega información adicional aquí..."}
                      className="w-full bg-cream/50 border border-mist/50 rounded-2xl py-3 px-4 text-xs outline-none focus:border-gold focus:ring-2 focus:ring-gold/10 min-h-[80px] resize-none transition-all"
                    />
                  </div>
                </div>
              </div>

              {/* User Selection Section */}
              <div className="flex-1 bg-parchment/10 flex flex-col">
                <div className="p-5 border-b border-mist">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-bark/10 text-bark rounded-xl">
                      <Users size={20} />
                    </div>
                    <h3 className="font-serif text-lg text-espresso">Selecciona Usuario</h3>
                  </div>
                  <p className="text-[10px] text-dust mt-1 uppercase tracking-wider">Atendido por:</p>
                </div>

                <div className="flex-1 p-4 md:p-5 overflow-y-auto max-h-[300px] md:max-h-none space-y-2 scrollbar-thin scrollbar-thumb-parchment">
                  {users.map((user) => (
                    <button
                      key={user.username}
                      disabled={isProcessing || (pendingCheckoutMethod !== 'Pendiente' && remainingPaymentBalance > 0.01)}
                      onClick={() => finalizeCheckout(user.username)}
                      className={cn(
                        "w-full flex items-center justify-between p-3 rounded-2xl border transition-all group shadow-sm hover:shadow-md",
                        (isProcessing || (remainingPaymentBalance > 0.01 && pendingCheckoutMethod !== 'Pendiente'))
                          ? "bg-cream/20 border-mist/20 opacity-40 cursor-not-allowed"
                          : "bg-white border-mist/30 hover:border-gold hover:bg-gold/5"
                      )}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-bark/10 flex items-center justify-center text-bark group-hover:bg-gold/20 group-hover:text-espresso transition-colors">
                          {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <User size={16} />}
                        </div>
                        <div className="text-left">
                          <div className="font-bold text-xs text-espresso">{user.name}</div>
                          <div className="text-[9px] text-dust uppercase tracking-wider font-medium">{user.role}</div>
                        </div>
                      </div>
                      <Plus size={14} className="text-dust group-hover:text-espresso" />
                    </button>
                  ))}
                  {users.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                      <p className="text-[10px] text-dust italic">No hay usuarios registrados</p>
                    </div>
                  )}
                </div>

                <div className="p-5 bg-white border-t border-mist flex flex-col gap-2">
                  {remainingPaymentBalance > 0.01 && pendingCheckoutMethod !== 'Pendiente' && (
                    <div className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest animate-pulse">
                      Cubre el total para finalizar
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setShowUserSelection(false);
                      setPendingCheckoutMethod(null);
                      setCurrentSalesPayments([]);
                    }}
                    className="w-full py-2.5 text-[10px] font-bold text-dust hover:text-espresso border border-mist/30 rounded-xl uppercase tracking-widest transition-colors"
                  >
                    Regresar al carrito
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
