import { useState } from 'react';
import { Product } from '../types';
import { cn } from '../lib/utils';
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
  ChevronLeft, 
  Search, 
  Plus, 
  Save,
  BookOpen,
  CupSoda,
  ShoppingBag,
  Beer,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (id: string, adjustment: number, notes?: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const CATEGORY_STYLES: Record<string, { icon: any, color: string, bg: string, border: string, text: string }> = {
  'Libros': { icon: Library, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Librería': { icon: Library, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Books': { icon: Library, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Café': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/10', border: 'border-espresso/20', text: 'text-espresso' },
  'Cafetería': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/10', border: 'border-espresso/20', text: 'text-espresso' },
  'Coffee': { icon: Coffee, color: 'bg-espresso', bg: 'bg-espresso/10', border: 'border-espresso/20', text: 'text-espresso' },
  'Bebidas': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Drinks': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Soda': { icon: CupSoda, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Nieve': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/10', border: 'border-sage/20', text: 'text-sage' },
  'Helados': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/10', border: 'border-sage/20', text: 'text-sage' },
  'Ice Cream': { icon: IceCream, color: 'bg-sage', bg: 'bg-sage/10', border: 'border-sage/20', text: 'text-sage' },
  'Snacks': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Cookies': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Postres': { icon: Cookie, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Alimentos': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Comida': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Food': { icon: Utensils, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Vinos': { icon: Wine, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Wine': { icon: Wine, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Otros': { icon: Sparkles, color: 'bg-dust', bg: 'bg-dust/10', border: 'border-dust/20', text: 'text-dust' },
  'Other': { icon: Sparkles, color: 'bg-dust', bg: 'bg-dust/10', border: 'border-dust/20', text: 'text-dust' },
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

const getProductIcon = (iconName: string | undefined, category: string) => {
  if (iconName) {
    const normalized = iconName.trim().toLowerCase();
    if (ICON_MAP[normalized]) return ICON_MAP[normalized];
  }
  return getCategoryStyle(category).icon;
};

const getCategoryStyle = (cat: string) => {
  const normalized = cat.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  const key = Object.keys(CATEGORY_STYLES).find(k => 
    k.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "") === normalized
  );
  return CATEGORY_STYLES[key || 'Otros'];
};

export function Inventory({ products, onUpdateStock, onAddProduct }: InventoryProps) {
  const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
  const [selectedSubCategory, setSelectedSubCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [stockUpdates, setStockUpdates] = useState<Record<string, string>>({});
  const [adjustmentNotes, setAdjustmentNotes] = useState<Record<string, string>>({});
  const [showAddModal, setShowAddModal] = useState(false);
  const [confirmingAdjustment, setConfirmingAdjustment] = useState<{product: Product, adjustment: number} | null>(null);
  const [currentNote, setCurrentNote] = useState('');
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: 'Libros',
    price: 0,
    stock: 0,
    icon: 'book'
  });

  const categories = [...new Set(products.map(p => p.category))];

  const toggleCategory = (cat: string) => {
    if (expandedCategory === cat) {
      setExpandedCategory(null);
      setSelectedSubCategory(null);
    } else {
      setExpandedCategory(cat);
      setSelectedSubCategory(null);
    }
  };

  const handleStockChange = (id: string, value: string) => {
    setStockUpdates({ ...stockUpdates, [id]: value });
  };

  const handleSave = (product: Product) => {
    const updateValue = stockUpdates[product.id];
    if (updateValue === undefined || updateValue === '') return;
    
    const adjustment = parseInt(updateValue) || 0;
    if (adjustment === 0) return;

    setConfirmingAdjustment({ product, adjustment });
    setCurrentNote('');
  };

  const confirmAdjustment = () => {
    if (!confirmingAdjustment) return;
    
    onUpdateStock(confirmingAdjustment.product.id, confirmingAdjustment.adjustment, currentNote || 'Ajuste manual');
    setStockUpdates({ ...stockUpdates, [confirmingAdjustment.product.id]: '' });
    setConfirmingAdjustment(null);
    setCurrentNote('');
  };

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.category || newProduct.price <= 0) return;
    
    const category = newProduct.category.trim();
    
    onAddProduct({
      ...newProduct,
      category: category as any,
      icon: category === 'Libros' ? 'book' : 
            (category === 'Café' || category === 'Bebidas') ? 'coffee' : 
            category === 'Nieve' ? 'ice-cream' : 
            (category === 'Snacks' || category === 'Alimentos') ? 'cookie' : 
            category === 'Vinos' ? 'wine' : 'sparkles'
    });
    setShowAddModal(false);
    setNewProduct({
      name: '',
      category: 'Libros',
      price: 0,
      stock: 0,
      icon: 'book'
    });
  };

  return (
    <div id="inventory-container" className="max-w-none mx-auto space-y-6 px-2 lg:px-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Main Area: Categories and Products */}
        <div className="lg:col-span-3 space-y-6">
          {/* Header Card */}
          <div className="bg-white rounded-[2rem] border border-parchment p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-bark/10 rounded-2xl flex items-center justify-center text-bark">
                <BookOpen size={24} />
              </div>
              <div>
                <h3 className="font-serif text-xl text-espresso">Inventario</h3>
                <p className="text-xs text-dust">Gestiona tus productos y existencias</p>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" size={16} />
              <input 
                type="text"
                placeholder="Buscar artículo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-cream border border-parchment rounded-xl py-2 pl-10 pr-4 text-xs outline-none focus:border-gold transition-all"
              />
            </div>
          </div>

          <div className="min-h-[500px]">
            {searchTerm ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                  <h4 className="text-[10px] font-bold text-dust uppercase tracking-[0.2em]">Resultados de búsqueda</h4>
                  <button onClick={() => setSearchTerm('')} className="text-[10px] font-bold text-gold uppercase hover:underline">Limpiar</button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {products
                    .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((product, index) => {
                      const style = getCategoryStyle(product.category);
                      const Icon = getProductIcon(product.icon, product.category);
                      const isCritical = product.stock <= 5;
                      return (
                        <div key={`${product.id}-${index}`} className={cn(
                          "bg-white border p-3 rounded-2xl flex items-center justify-between group transition-all hover:shadow-lg gap-3",
                          isCritical ? "border-red-200 bg-red-50/30" : "border-parchment"
                        )}>
                          <div className="flex items-center gap-2 min-w-0 flex-1">
                            <div className={cn(
                              "w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 shrink-0 shadow-sm",
                              isCritical ? "bg-red-500 text-white" : cn(style.color, "text-white")
                            )}>
                              <Icon size={20} />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-bold text-espresso truncate">{product.name}</div>
                              <div className="text-[10px] font-bold text-dust uppercase tracking-wider flex items-center gap-1.5 truncate">
                                <span className="opacity-50">{product.category}</span>
                                <span className={cn(
                                  "px-1.5 py-0.5 rounded border",
                                  isCritical ? "bg-red-100 text-red-600 border-red-200" : "bg-parchment/50 text-dust border-parchment"
                                )}>
                                  {product.stock} un.
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              className="w-14 bg-cream border border-parchment rounded-lg py-1.5 px-2 text-xs font-bold text-center"
                              placeholder="±"
                              value={stockUpdates[product.id] || ''}
                              onChange={(e) => handleStockChange(product.id, e.target.value)}
                            />
                            <button 
                              onClick={() => handleSave(product)}
                              className="p-2 bg-espresso text-cream rounded-lg hover:bg-bark transition-colors"
                            >
                              <Save size={14} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                {categories.map((cat) => {
                  const style = getCategoryStyle(cat);
                  const firstProduct = products.find(p => p.category === cat);
                  const Icon = firstProduct 
                    ? getProductIcon(firstProduct.icon, firstProduct.category)
                    : style.icon;
                  const catProducts = products.filter(p => p.category === cat);
                  const criticalCount = catProducts.filter(p => p.stock <= 5).length;

                  return (
                    <button
                      key={cat}
                      onClick={() => setExpandedCategory(cat)}
                      className={cn(
                        "w-full aspect-square p-4 rounded-[2rem] border transition-all flex flex-col items-center justify-center gap-4 group bg-white border-parchment text-espresso hover:border-gold shadow-sm hover:shadow-xl hover:-translate-y-1",
                        style.bg.replace('bg-', 'hover:bg-').replace('/10', '/20')
                      )}
                    >
                      <div className="relative">
                        <div className={cn(
                          "w-16 h-16 sm:w-20 rounded-[1.5rem] flex items-center justify-center transition-all group-hover:scale-110 group-hover:rotate-3 shadow-sm",
                          style.color, "text-white"
                        )}>
                          <Icon size={32} className="sm:size-10" />
                        </div>
                        {criticalCount > 0 && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-lg animate-bounce">
                            {criticalCount}
                          </div>
                        )}
                      </div>
                      <div className="text-center space-y-1">
                        <span className="font-serif text-sm sm:text-base font-bold tracking-tight block truncate w-full px-1">{cat}</span>
                        <span className="text-[10px] text-dust font-bold uppercase tracking-widest hidden sm:block">
                          {catProducts.length} items
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Area: Stats and Quick Actions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quick Add Button */}
          <button 
            onClick={() => setShowAddModal(true)}
            className="w-full p-6 bg-espresso text-cream rounded-[2.5rem] flex flex-col items-center gap-3 hover:bg-bark transition-all shadow-xl shadow-espresso/20 group"
          >
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center group-hover:rotate-12 transition-transform">
              <Plus size={28} />
            </div>
            <span className="font-serif text-lg font-bold">Registrar nuevo producto</span>
            <span className="text-[10px] opacity-70 uppercase tracking-widest font-bold">Agregar artículo al catálogo</span>
          </button>

          {/* Stats Card */}
          <div className="bg-white rounded-[2.5rem] border border-parchment overflow-hidden shadow-sm flex flex-col h-[500px]">
            <div className="p-8 border-b border-parchment bg-cream/50">
              <h4 className="font-serif text-lg text-espresso flex items-center gap-2">
                <Sparkles size={18} className="text-gold" />
                Resumen de Almacén
              </h4>
              <p className="text-xs text-dust mt-1">Estado de tus existencias actuales</p>
            </div>
            
            <div className="flex-1 p-8 space-y-8 overflow-auto">
              {/* Critical Stocks List */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Alerta Crítica</span>
                  <span className="px-2 py-0.5 bg-red-100 text-red-600 rounded text-[10px] font-bold">
                    {products.filter(p => p.stock <= 5).length} items
                  </span>
                </div>
                <div className="space-y-3">
                  {products.filter(p => p.stock <= 5).slice(0, 4).map(p => (
                    <div key={p.id} className="flex items-center justify-between group">
                      <div className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                        <span className="text-xs font-bold text-espresso group-hover:text-red-500 transition-colors">{p.name}</span>
                      </div>
                      <span className="font-mono text-xs font-bold text-red-500">{p.stock}</span>
                    </div>
                  ))}
                  {products.filter(p => p.stock <= 5).length > 4 && (
                    <div className="text-[10px] text-dust italic text-center pt-2">...y {products.filter(p => p.stock <= 5).length - 4} más</div>
                  )}
                </div>
              </div>

              {/* General Health */}
              <div className="pt-8 border-t border-parchment space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between items-end">
                    <span className="text-[10px] font-bold text-dust uppercase tracking-widest">Salud del Inventario</span>
                    <span className="text-xs font-bold text-sage">
                      {Math.round((products.filter(p => p.stock > 5).length / products.length) * 100)}%
                    </span>
                  </div>
                  <div className="h-2 bg-parchment rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sage transition-all duration-1000" 
                      style={{ width: `${(products.filter(p => p.stock > 5).length / products.length) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-cream rounded-2xl border border-parchment/50">
                    <span className="text-[10px] font-bold text-dust uppercase tracking-widest block mb-1">Total Items</span>
                    <span className="text-2xl font-serif font-bold text-espresso">{products.length}</span>
                  </div>
                  <div className="p-4 bg-cream rounded-2xl border border-parchment/50">
                    <span className="text-[10px] font-bold text-dust uppercase tracking-widest block mb-1">Categorías</span>
                    <span className="text-2xl font-serif font-bold text-espresso">{categories.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Category Products Modal */}
      <AnimatePresence>
        {expandedCategory && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setExpandedCategory(null)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] md:rounded-[3rem] shadow-2xl w-full max-w-5xl overflow-hidden h-full max-h-[92vh] md:max-h-[85vh] flex flex-col cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-6 md:px-10 py-5 md:py-8 border-b border-parchment flex items-center justify-between bg-cream/50">
                <div className="flex items-center gap-4 md:gap-6">
                  <div className={cn(
                    "w-12 h-12 md:w-16 md:h-16 rounded-2xl md:rounded-[1.5rem] flex items-center justify-center shadow-lg",
                    getCategoryStyle(expandedCategory).color,
                    "text-white"
                  )}>
                    {(() => {
                      const firstP = products.find(p => p.category === expandedCategory);
                      const Icon = firstP ? getProductIcon(firstP.icon, firstP.category) : getCategoryStyle(expandedCategory).icon;
                      return <Icon size={24} className="md:size-[32px]" />;
                    })()}
                  </div>
                  <div>
                    <h3 className="font-serif text-lg md:text-2xl text-espresso tracking-tight leading-tight">{expandedCategory}</h3>
                    <p className="text-[9px] md:text-xs text-dust font-bold uppercase tracking-widest">
                      {products.filter(p => p.category === expandedCategory).length} artículos
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4 md:p-10 bg-cream/5">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                  {products
                    .filter(p => p.category === expandedCategory)
                    .map((product, index) => {
                      const style = getCategoryStyle(product.category);
                      const Icon = getProductIcon(product.icon, product.category);
                      const isCritical = product.stock <= 5;
                      return (
                        <div key={`${product.id}-${index}`} className={cn(
                           "bg-white border p-3 md:p-6 rounded-2xl md:rounded-[2.5rem] flex items-center justify-between group transition-all hover:shadow-xl gap-3",
                           isCritical ? "border-red-200 bg-red-50/50" : "border-parchment"
                        )}>
                          <div className="flex items-center gap-3 md:gap-5 min-w-0 flex-1">
                            <div className={cn(
                               "w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 transition-all group-hover:scale-110",
                               isCritical ? "bg-red-500 text-white shadow-lg" : cn(style.color, "text-white shadow-md")
                            )}>
                              <Icon size={20} className="md:size-7" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-xs md:text-base font-bold text-espresso truncate">{product.name}</div>
                              <div className={cn(
                                "text-[9px] md:text-[11px] font-bold uppercase tracking-[0.1em] truncate px-2 py-0.5 rounded border w-fit mt-1",
                                isCritical ? "bg-red-100 text-red-600 border-red-200" : "bg-cream/80 text-dust border-mist/30"
                              )}>
                                {isCritical ? '⚠️ Stock' : 'Stock'}: {product.stock} un.
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 md:gap-3 shrink-0">
                            <div className="flex flex-col items-center">
                              <span className="text-[8px] md:text-[9px] font-bold text-dust uppercase tracking-widest mb-1">Ajuste</span>
                              <input 
                                type="number"
                                className="w-12 md:w-16 bg-cream border border-parchment rounded-lg md:rounded-xl py-1.5 md:py-2.5 px-1 md:px-2 text-xs font-bold text-center focus:border-gold transition-all"
                                placeholder="±"
                                value={stockUpdates[product.id] || ''}
                                onChange={(e) => handleStockChange(product.id, e.target.value)}
                              />
                            </div>
                            <button 
                              onClick={() => handleSave(product)}
                              className={cn(
                                "p-2 md:p-3 rounded-lg md:rounded-2xl transition-all self-end",
                                stockUpdates[product.id] ? "bg-gold text-espresso shadow-lg hover:scale-105" : "bg-parchment/50 text-dust opacity-50"
                              )}
                            >
                              <Save size={16} className="md:size-[20px]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
              
              <div className="px-6 md:px-10 py-5 md:py-6 bg-cream/30 border-t border-parchment flex justify-center shrink-0">
                <button 
                  onClick={() => setExpandedCategory(null)}
                  className="w-full md:w-auto px-12 py-3 bg-espresso text-cream rounded-xl md:rounded-2xl font-bold text-xs uppercase tracking-widest hover:bg-bark transition-all shadow-xl shadow-espresso/20"
                >
                  Cerrar Categoría
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Confirmation Modal for Stock Adjustment */}
      <AnimatePresence>
        {confirmingAdjustment && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-mist">
                <h3 className="font-serif text-lg text-espresso">Confirmar Ajuste</h3>
                <p className="text-xs text-dust mt-1">
                  Vas a {confirmingAdjustment.adjustment > 0 ? 'sumar' : 'restar'} {Math.abs(confirmingAdjustment.adjustment)} unidades a <strong>{confirmingAdjustment.product.name}</strong>.
                </p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Notas del ajuste (Opcional)</label>
                  <textarea 
                    value={currentNote}
                    onChange={(e) => setCurrentNote(e.target.value)}
                    className="w-full bg-cream border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-bark min-h-[100px] resize-none"
                    placeholder="Ej. Recepción de proveedor, Producto dañado, etc."
                  />
                </div>
              </div>
              <div className="p-4 bg-cream flex justify-end gap-3">
                <button 
                  onClick={() => setConfirmingAdjustment(null)}
                  className="px-4 py-2 text-xs font-medium text-dust hover:text-espresso"
                >
                  Cancelar
                </button>
                <button 
                  onClick={confirmAdjustment}
                  className="px-6 py-2 text-xs font-medium bg-espresso text-cream rounded-lg hover:bg-bark transition-colors"
                >
                  Confirmar Ajuste
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Add Product Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div 
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm cursor-pointer"
            onClick={() => setShowAddModal(false)}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-[2rem] shadow-2xl w-full max-w-2xl overflow-hidden border border-parchment cursor-default"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-8 py-6 border-b border-parchment flex items-center justify-between bg-cream/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-espresso rounded-2xl flex items-center justify-center text-cream shadow-lg">
                    <Plus size={24} />
                  </div>
                  <div>
                    <h3 className="font-serif text-xl text-espresso">Alta de Nuevo Producto</h3>
                    <p className="text-xs text-dust">Ingresa los detalles para el catálogo de inventario.</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-widest mb-2 ml-1">Nombre Completo del Artículo</label>
                    <input 
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-white border border-parchment rounded-xl py-3 px-4 text-sm outline-none focus:border-gold transition-all shadow-sm"
                      placeholder="Ej. Café Americano Tostado"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-widest mb-2 ml-1">Categoría</label>
                    <div className="relative">
                      <input 
                        list="category-list"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full bg-white border border-parchment rounded-xl py-3 px-4 text-sm outline-none focus:border-gold transition-all shadow-sm"
                        placeholder="Elegir categoría..."
                      />
                      <datalist id="category-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-widest mb-2 ml-1">Precio Unitario ($)</label>
                    <input 
                      type="number"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-white border border-parchment rounded-xl py-3 px-4 text-sm font-bold outline-none focus:border-gold transition-all shadow-sm"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-widest mb-2 ml-1">Stock de Apertura</label>
                    <input 
                      type="number"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                      className="w-full bg-white border border-parchment rounded-xl py-3 px-4 text-sm outline-none focus:border-gold transition-all shadow-sm"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-widest mb-2 ml-1">Identificador de Icono</label>
                    <div className="relative">
                      <input 
                        list="icon-list"
                        value={newProduct.icon}
                        onChange={(e) => setNewProduct({...newProduct, icon: e.target.value})}
                        className="w-full bg-white border border-parchment rounded-xl py-3 px-4 text-sm outline-none focus:border-gold transition-all shadow-sm"
                        placeholder="coffee, book, food..."
                      />
                      <datalist id="icon-list">
                        {Object.keys(ICON_MAP).map(icon => <option key={icon} value={icon} />)}
                      </datalist>
                    </div>
                  </div>
                </div>
              </div>

              <div className="px-8 py-6 bg-cream/30 border-t border-parchment flex justify-end gap-4">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-6 py-3 text-xs font-bold text-dust uppercase tracking-widest hover:text-espresso transition-colors"
                >
                  Descartar
                </button>
                <button 
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || newProduct.price <= 0}
                  className="px-10 py-3 bg-espresso text-cream rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-bark transition-all shadow-lg shadow-espresso/20 disabled:opacity-30"
                >
                  Registrar Producto
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
