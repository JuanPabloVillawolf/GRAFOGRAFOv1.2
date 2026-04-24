import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Receipt, 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  DollarSign, 
  FileText, 
  AlertCircle,
  Zap,
  Utensils,
  PenTool,
  Wrench,
  Sparkles,
  User
} from 'lucide-react';
import { Expense } from '../types';
import { cn } from '../lib/utils';

interface ExpensesProps {
  expenses: Expense[];
  onAddExpense: (expense: Omit<Expense, 'id' | 'timestamp' | 'username'>) => Promise<void>;
  isLoading: boolean;
}

export function Expenses({ expenses, onAddExpense, isLoading }: ExpensesProps) {
  const [showAddModal, setShowAddModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    category: 'General',
    notes: ''
  });

  const categories = ['General', 'Servicios', 'Comida', 'Papelería', 'Mantenimiento', 'Otros'];

  // Colors aligned with Grafógrafo aesthetic
  const CATEGORY_COLORS: Record<string, string> = {
    'General': '#5c544e', // Espresso/Bark
    'Servicios': '#8c4b2f', // Terra
    'Comida': '#a68b5c', // Gold
    'Papelería': '#8c9c84', // Sage
    'Mantenimiento': '#adaba6', // Dust
    'Otros': '#403d39' // Ink
  };

  const CATEGORY_ICONS: Record<string, any> = {
    'General': Receipt,
    'Servicios': Zap,
    'Comida': Utensils,
    'Papelería': PenTool,
    'Mantenimiento': Wrench,
    'Otros': Sparkles
  };
  const todayStr = new Date().toLocaleDateString('es-MX');

  const filteredExpenses = useMemo(() => {
    return expenses.filter(e => 
      e.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.notes.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [expenses, searchTerm]);

  const groups = useMemo(() => {
    const grouped: Record<string, Expense[]> = {};
    
    filteredExpenses.forEach(expense => {
      // Handle "DD/MM/YYYY, HH:MM:SS" or "DD/MM/YYYY HH:MM:SS"
      const date = expense.timestamp.split(' ')[0].replace(',', '');
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(expense);
    });
    
    return Object.entries(grouped).sort((a, b) => {
      const partsA = a[0].split('/');
      const partsB = b[0].split('/');
      const dateA = new Date(parseInt(partsA[2]), parseInt(partsA[1]) - 1, parseInt(partsA[0]));
      const dateB = new Date(parseInt(partsB[2]), parseInt(partsB[1]) - 1, parseInt(partsB[0]));
      return dateB.getTime() - dateA.getTime();
    });
  }, [filteredExpenses]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Clean string from currency symbols and thousands separators before parsing
    const cleanAmount = newExpense.amount.replace(/[^0-9.-]/g, '');
    const amount = parseFloat(cleanAmount);
    if (isNaN(amount) || amount <= 0) return;

    await onAddExpense({
      description: newExpense.description,
      amount,
      category: newExpense.category,
      notes: newExpense.notes
    });

    setNewExpense({
      description: '',
      amount: '',
      category: 'General',
      notes: ''
    });
    setShowAddModal(false);
  };

  return (
    <div className="space-y-8">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100">
            <Receipt className="text-red-500" size={24} />
          </div>
          <div>
            <h2 className="font-serif text-2xl text-espresso">Gestión de Gastos</h2>
            <p className="text-xs text-dust">Control de egresos y gastos operativos diarios</p>
          </div>
        </div>

        <button 
          onClick={() => setShowAddModal(true)}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-espresso text-cream rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-bark transition-all shadow-lg shadow-espresso/10"
        >
          <Plus size={18} />
          Registrar Gasto
        </button>
      </div>

      {/* Search & Filters */}
      <div className="bg-white p-4 rounded-2xl border border-mist shadow-sm flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" size={18} />
          <input 
            type="text"
            placeholder="Buscar por concepto, categoría o notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-parchment/30 border border-mist rounded-xl py-2.5 pl-12 pr-4 text-sm outline-none focus:border-bark transition-colors"
          />
        </div>
        <div className="flex items-center gap-3 px-4 py-2 bg-red-50 rounded-xl border border-red-100">
          <span className="text-[10px] font-bold text-red-400 uppercase tracking-wider">Total Gastos:</span>
          <span className="text-sm font-bold text-red-600">
            ${expenses.reduce((sum, e) => sum + e.amount, 0).toLocaleString('es-MX', { minimumFractionDigits: 2 })}
          </span>
        </div>
      </div>

      {/* Expenses History Container */}

      {/* Day Navigation Controls (Top) - REMOVED from here to move to bottom like others */}

      {/* Expenses History Container */}
      <div className="bg-white rounded-3xl border border-mist shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Container Header */}
        <div className="bg-parchment/50 px-6 py-4 border-b border-mist flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h3 className="font-serif text-base text-espresso flex items-center gap-2">
              <Receipt size={18} />
              Historial de Gastos
            </h3>
          </div>
          {searchTerm ? (
            <span className="text-[10px] uppercase tracking-widest text-dust font-bold">
              Mostrando {groups.reduce((acc, g) => acc + g[1].length, 0)} resultados de búsqueda
            </span>
          ) : (
             <span className="text-[10px] uppercase tracking-widest text-dust font-bold">
              {groups[0]?.[1]?.length || 0} movimientos
            </span>
          )}
        </div>

        {/* Grouped Content */}
        <div className="flex-1 overflow-auto">
          {groups.length > 0 ? (
            <div className="divide-y divide-mist">
              {groups.map(([date, dateExpenses]) => {
                const dateTotal = dateExpenses.reduce((sum, e) => sum + e.amount, 0);
                const isToday = date === todayStr;
                
                return (
                  <div key={date} className="relative">
                    {/* Sticky Daily Header within the scroll container */}
                    <div className="sticky top-0 z-10 bg-cream/80 backdrop-blur-sm px-6 py-2 border-b border-mist flex items-center justify-between">
                      <span className="text-[10px] font-bold text-bark uppercase tracking-[0.2em]">
                        {isToday ? 'HOY' : date} • {dateTotal.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                      </span>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <tbody className="divide-y divide-mist/50">
                          {dateExpenses.map((expense) => (
                            <motion.tr 
                              layout
                              key={expense.id}
                              className="hover:bg-parchment/30 transition-colors group"
                            >
                              <td className="px-6 py-4 w-28 shrink-0">
                                <span className="text-[10px] font-bold text-dust uppercase tracking-widest">
                                  {expense.timestamp.split(' ')[1]}
                                </span>
                              </td>
                              <td className="px-6 py-4">
                                <div className="space-y-1">
                                  <p className="text-sm font-bold text-espresso">{expense.description}</p>
                                  {expense.notes && (
                                    <p className="text-[10px] text-dust italic flex items-center gap-1">
                                      <FileText size={10} />
                                      {expense.notes}
                                    </p>
                                  )}
                                </div>
                              </td>
                              <td className="px-6 py-4">
                                {(() => {
                                  const Icon = CATEGORY_ICONS[expense.category] || Tag;
                                  return (
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-parchment border border-mist text-[10px] font-bold text-dust uppercase">
                                      <Icon size={10} />
                                      {expense.category}
                                    </span>
                                  );
                                })()}
                              </td>
                              <td className="px-6 py-4">
                                <div className="flex items-center gap-1.5 text-dust">
                                  <User size={12} />
                                  <span className="text-[10px] font-medium">{expense.username}</span>
                                </div>
                              </td>
                              <td className="px-6 py-4 text-right">
                                <span className="text-sm font-bold text-red-600">
                                  -${expense.amount.toLocaleString('es-MX', { minimumFractionDigits: 2 })}
                                </span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="h-full min-h-[300px] flex flex-col items-center justify-center text-dust p-12">
              <AlertCircle size={32} strokeWidth={1.5} />
              <p className="text-sm mt-2">No se encontraron registros de gastos.</p>
            </div>
          )}
        </div>

      </div>

      {/* Add Expense Modal */}
      <AnimatePresence>
        {showAddModal && (
          <div className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-parchment"
            >
              <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-50 rounded-xl flex items-center justify-center border border-red-100">
                    <Receipt className="text-red-500" size={20} />
                  </div>
                  <h2 className="font-serif text-xl text-espresso">Nuevo Gasto</h2>
                </div>
                <button 
                  onClick={() => setShowAddModal(false)}
                  className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-parchment text-dust transition-colors"
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Concepto / Descripción</label>
                  <input 
                    type="text"
                    required
                    autoFocus
                    value={newExpense.description}
                    onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                    className="w-full bg-parchment/30 border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-red-400 transition-colors"
                    placeholder="Ej. Pago de luz, Compra de café..."
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Monto ($)</label>
                    <div className="relative">
                      <DollarSign size={14} className="absolute left-4 top-1/2 -translate-y-1/2 text-dust" />
                      <input 
                        type="number"
                        step="0.01"
                        required
                        value={newExpense.amount}
                        onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                        className="w-full bg-parchment/30 border border-mist rounded-xl py-3 pl-10 pr-4 text-sm outline-none focus:border-red-400 transition-colors"
                        placeholder="0.00"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Categoría</label>
                    <select 
                      value={newExpense.category}
                      onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                      className="w-full bg-parchment/30 border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-red-400 transition-colors appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Notas Adicionales (Opcional)</label>
                  <textarea 
                    value={newExpense.notes}
                    onChange={(e) => setNewExpense({...newExpense, notes: e.target.value})}
                    className="w-full bg-parchment/30 border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-red-400 transition-colors h-24 resize-none"
                    placeholder="Detalles extras del gasto..."
                  />
                </div>

                <div className="pt-4 flex gap-3">
                  <button 
                    type="button"
                    onClick={() => setShowAddModal(false)}
                    className="flex-1 py-3.5 text-xs font-bold uppercase tracking-widest text-dust hover:text-espresso transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    type="submit"
                    disabled={isLoading}
                    className="flex-[2] bg-espresso text-cream rounded-xl py-3.5 font-bold text-sm uppercase tracking-widest hover:bg-bark transition-all shadow-lg shadow-espresso/20 flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    {isLoading ? (
                      <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <Receipt size={18} />
                        Guardar Gasto
                      </>
                    )}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
