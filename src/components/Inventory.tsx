import { useState } from 'react';
import { Product } from '../types';
import { cn } from '../lib/utils';
import { Book, Coffee, Cookie, IceCream, ChevronDown, ChevronUp, Search, Plus, Save } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface InventoryProps {
  products: Product[];
  onUpdateStock: (id: string, adjustment: number, notes?: string) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
}

const CATEGORY_STYLES: Record<string, { icon: any, color: string, bg: string, border: string, text: string }> = {
  'Libros': { icon: Book, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Café': { icon: Coffee, color: 'bg-terra', bg: 'bg-terra/10', border: 'border-terra/20', text: 'text-terra' },
  'Nieve': { icon: IceCream, color: 'bg-gold', bg: 'bg-gold/10', border: 'border-gold/20', text: 'text-gold' },
  'Snacks': { icon: Cookie, color: 'bg-sage', bg: 'bg-sage/10', border: 'border-sage/20', text: 'text-sage' },
  'Accesorios': { icon: Plus, color: 'bg-bark', bg: 'bg-bark/10', border: 'border-bark/20', text: 'text-bark' },
  'Otros': { icon: Save, color: 'bg-dust', bg: 'bg-dust/10', border: 'border-dust/20', text: 'text-dust' },
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

  const categories = [...new Set([...['Libros', 'Café', 'Nieve', 'Snacks'], ...products.map(p => p.category)])];

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
            category === 'Café' ? 'coffee' : 
            category === 'Nieve' ? 'ice-cream' : 
            category === 'Snacks' ? 'cookie' : 'sparkles'
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
    <div id="inventory-container" className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" size={18} />
          <input 
            type="text"
            placeholder="Buscar en inventario..."
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
          onClick={() => setShowAddModal(true)}
          className="px-6 bg-espresso text-cream rounded-xl flex items-center gap-2 text-sm font-medium hover:bg-bark transition-colors shadow-lg shadow-espresso/10"
        >
          <Plus size={18} />
          Nuevo Producto
        </button>
      </div>

      <div className="min-h-[400px]">
        {searchTerm ? (
          <div className="space-y-4">
            <div className="text-[10px] uppercase tracking-widest text-dust font-bold">Resultados de búsqueda</div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {products
                .filter(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
                .sort((a, b) => {
                  const term = searchTerm.toLowerCase();
                  const aName = a.name.toLowerCase();
                  const bName = b.name.toLowerCase();
                  if (aName === term) return -1;
                  if (bName === term) return 1;
                  if (aName.startsWith(term) && !bName.startsWith(term)) return -1;
                  if (!aName.startsWith(term) && bName.startsWith(term)) return 1;
                  return aName.localeCompare(bName);
                })
                .map((product, index) => (
                  <div
                    key={`${product.id}-${index}`}
                    id={`product-search-${product.id}`}
                    className={cn(
                      "w-full p-4 border rounded-xl flex items-center justify-between transition-all",
                      CATEGORY_STYLES[product.category]?.bg || 'bg-white',
                      CATEGORY_STYLES[product.category]?.border || 'border-parchment'
                    )}
                  >
                    <div className="flex items-center gap-3 text-left">
                      <div className={cn(
                        "w-8 h-8 rounded-lg flex items-center justify-center shrink-0",
                        CATEGORY_STYLES[product.category]?.color || 'bg-dust',
                        "text-white"
                      )}>
                        {(() => {
                          const Icon = CATEGORY_STYLES[product.category]?.icon || Coffee;
                          return <Icon size={16} />;
                        })()}
                      </div>
                      <div>
                        <div className="text-xs font-medium text-ink">{product.name}</div>
                        <div className="text-[10px] text-dust uppercase tracking-wider">
                          {product.category} · Stock: {product.stock}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input 
                        type="number"
                        placeholder="Cant."
                        className="w-16 bg-cream border border-mist rounded-lg px-2 py-1 text-xs outline-none focus:border-bark"
                        value={stockUpdates[product.id] || ''}
                        onChange={(e) => handleStockChange(product.id, e.target.value)}
                      />
                      <button 
                        onClick={() => handleSave(product)}
                        className="p-1.5 bg-espresso text-cream rounded-lg hover:bg-bark transition-all"
                      >
                        <Save size={14} />
                      </button>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat) => {
              const style = CATEGORY_STYLES[cat] || CATEGORY_STYLES['Otros'];
              const Icon = style.icon;
              const catProducts = products.filter(p => p.category === cat);
              const isExpanded = expandedCategory === cat;

              return (
                <div key={cat} className="space-y-2">
                  <button
                    onClick={() => toggleCategory(cat)}
                    className={cn(
                      "w-full p-6 rounded-2xl border transition-all flex flex-col items-center gap-3 group",
                      isExpanded 
                        ? "bg-espresso border-espresso text-cream shadow-lg" 
                        : cn("bg-white border-parchment text-espresso hover:border-bark", style.bg.replace('bg-', 'hover:bg-').replace('/10', '/5'))
                    )}
                  >
                    <div className={cn(
                      "w-12 h-12 rounded-xl flex items-center justify-center transition-transform group-hover:scale-110",
                      isExpanded ? "bg-gold/20 text-gold" : cn(style.bg, style.text)
                    )}>
                      <Icon size={28} />
                    </div>
                    <span className="font-serif text-sm font-semibold">{cat}</span>
                    {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} className="opacity-50" />}
                  </button>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden space-y-4 pt-2"
                      >
                        {(() => {
                          return (
                            <div className="space-y-2">
                              {catProducts.map((product, index) => (
                                <div
                                  key={`${product.id}-${index}`}
                                  id={`product-${product.id}`}
                                  className={cn(
                                    "w-full p-4 border rounded-xl flex items-center justify-between transition-all",
                                    style.bg,
                                    style.border
                                  )}
                                >
                                  <div className="text-left">
                                    <div className="text-xs font-medium text-ink">{product.name}</div>
                                    <div className="text-[10px] text-dust uppercase tracking-wider">Actual: {product.stock}</div>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <input 
                                      type="number"
                                      placeholder="Cant."
                                      className="w-16 bg-white/50 border border-mist rounded-lg px-2 py-1 text-xs outline-none focus:border-bark"
                                      value={stockUpdates[product.id] || ''}
                                      onChange={(e) => handleStockChange(product.id, e.target.value)}
                                    />
                                    <button 
                                      onClick={() => handleSave(product)}
                                      className="p-1.5 bg-espresso text-cream rounded-lg hover:bg-bark transition-all"
                                    >
                                      <Save size={14} />
                                    </button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          );
                        })()}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        )}
      </div>

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
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
            >
              <div className="p-6 border-b border-mist">
                <h3 className="font-serif text-lg text-espresso">Nuevo Producto</h3>
                <p className="text-xs text-dust mt-1">Agrega un artículo extra al inventario.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Nombre del Producto</label>
                    <input 
                      type="text"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      className="w-full bg-cream border border-mist rounded-xl py-2 px-4 text-sm outline-none focus:border-bark"
                      placeholder="Ej. Separador Artesanal"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Categoría</label>
                    <div className="relative">
                      <input 
                        list="category-list"
                        value={newProduct.category}
                        onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                        className="w-full bg-cream border border-mist rounded-xl py-2 px-4 text-sm outline-none focus:border-bark"
                        placeholder="Selecciona o escribe una categoría"
                      />
                      <datalist id="category-list">
                        {categories.map(c => <option key={c} value={c} />)}
                      </datalist>
                    </div>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Precio ($)</label>
                    <input 
                      type="number"
                      value={newProduct.price || ''}
                      onChange={(e) => setNewProduct({...newProduct, price: parseFloat(e.target.value)})}
                      className="w-full bg-cream border border-mist rounded-xl py-2 px-4 text-sm outline-none focus:border-bark"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-1.5">Stock Inicial</label>
                    <input 
                      type="number"
                      value={newProduct.stock || ''}
                      onChange={(e) => setNewProduct({...newProduct, stock: parseInt(e.target.value)})}
                      className="w-full bg-cream border border-mist rounded-xl py-2 px-4 text-sm outline-none focus:border-bark"
                    />
                  </div>
                </div>
              </div>
              <div className="p-4 bg-cream flex justify-end gap-3">
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-medium text-dust hover:text-espresso"
                >
                  Cancelar
                </button>
                <button 
                  onClick={handleAddProduct}
                  disabled={!newProduct.name || newProduct.price <= 0}
                  className="px-6 py-2 text-xs font-medium bg-espresso text-cream rounded-lg hover:bg-bark transition-colors disabled:opacity-50"
                >
                  Agregar al Inventario
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
