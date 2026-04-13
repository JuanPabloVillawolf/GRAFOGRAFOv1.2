import { useState } from 'react';
import { PendingAccount } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Users, Clock, ChevronRight, Trash2, CreditCard, Edit2, Plus, Minus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PendingAccountsProps {
  accounts: PendingAccount[];
  onSelectAccount: (account: PendingAccount) => void;
  onDeleteAccount: (accountId: string) => void;
  onPayAccount: (account: PendingAccount, payments: { method: string, amount: number }[]) => void;
  onUpdateAccount: (account: PendingAccount) => void;
}

export function PendingAccounts({ accounts, onSelectAccount, onDeleteAccount, onPayAccount, onUpdateAccount }: PendingAccountsProps) {
  const [payingAccountId, setPayingAccountId] = useState<string | null>(null);
  const [editingAccountId, setEditingAccountId] = useState<string | null>(null);
  const [currentPayments, setCurrentPayments] = useState<{ method: string, amount: number }[]>([]);
  const [paymentAmount, setPaymentAmount] = useState<string>('');

  const paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia', 'Gratis', 'Otro'];

  const handleUpdateItemQuantity = (account: PendingAccount, itemIndex: number, delta: number) => {
    const newItems = [...account.items];
    const newQuantity = Math.max(0, newItems[itemIndex].quantity + delta);
    
    if (newQuantity === 0) {
      newItems.splice(itemIndex, 1);
    } else {
      newItems[itemIndex] = { ...newItems[itemIndex], quantity: newQuantity };
    }

    if (newItems.length === 0) {
      onDeleteAccount(account.id);
    } else {
      onUpdateAccount({
        ...account,
        items: newItems,
        updatedAt: new Date().toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    }
  };

  const handleRemoveItem = (account: PendingAccount, itemIndex: number) => {
    const newItems = [...account.items];
    newItems.splice(itemIndex, 1);

    if (newItems.length === 0) {
      onDeleteAccount(account.id);
    } else {
      onUpdateAccount({
        ...account,
        items: newItems,
        updatedAt: new Date().toLocaleString('es-MX', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    }
  };

  const handleStartPay = (account: PendingAccount) => {
    setPayingAccountId(account.id);
    setCurrentPayments([]);
    const total = account.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const alreadyPaid = account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    setPaymentAmount((total - alreadyPaid).toString());
  };

  const addPayment = (account: PendingAccount, method: string) => {
    const amount = parseFloat(paymentAmount);
    if (isNaN(amount) || amount <= 0) return;

    const total = account.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const alreadyPaid = account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const currentSessionPaid = currentPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = total - alreadyPaid - currentSessionPaid;

    const actualAmount = Math.min(amount, remaining);
    if (actualAmount <= 0) return;

    setCurrentPayments([...currentPayments, { method, amount: actualAmount }]);
    const newRemaining = remaining - actualAmount;
    setPaymentAmount(newRemaining > 0 ? newRemaining.toString() : '');
  };

  const removePayment = (index: number, account: PendingAccount) => {
    const newPayments = [...currentPayments];
    newPayments.splice(index, 1);
    setCurrentPayments(newPayments);

    const total = account.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const alreadyPaid = account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const currentSessionPaid = newPayments.reduce((sum, p) => sum + p.amount, 0);
    setPaymentAmount((total - alreadyPaid - currentSessionPaid).toString());
  };

  const handleConfirmPay = (account: PendingAccount) => {
    if (currentPayments.length === 0) return;
    onPayAccount(account, currentPayments);
    setPayingAccountId(null);
    setCurrentPayments([]);
    setPaymentAmount('');
  };
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-serif text-xl text-espresso">Cuentas Abiertas</h2>
          <p className="text-xs text-dust">Gestiona las cuentas pendientes de pago.</p>
        </div>
        <div className="bg-espresso/10 px-3 py-1 rounded-full text-[10px] font-bold text-espresso uppercase tracking-wider">
          {accounts.length} Activas
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence mode="popLayout">
          {accounts.map((account) => (
            <motion.div
              key={account.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-parchment rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-parchment rounded-full flex items-center justify-center text-bark">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-espresso">{account.customerName}</h3>
                      <div className="flex items-center gap-2 text-[10px] text-dust">
                        <Clock size={12} />
                        <span>Actualizada: {account.updatedAt}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={() => editingAccountId === account.id ? setEditingAccountId(null) : setEditingAccountId(account.id)}
                      className={cn(
                        "p-2 rounded-full transition-colors",
                        editingAccountId === account.id ? "bg-espresso text-cream" : "text-dust hover:text-espresso hover:bg-parchment"
                      )}
                      title="Editar productos"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button 
                      onClick={() => onDeleteAccount(account.id)}
                      className="p-2 text-dust hover:text-red-500 transition-colors"
                      title="Eliminar cuenta"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>

                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-dust uppercase tracking-wider">Productos ({account.items.reduce((sum, item) => sum + item.quantity, 0)})</div>
                  <div className="max-h-32 overflow-y-auto space-y-2 pr-2">
                    {account.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center text-[11px] text-ink group/item">
                        <div className="flex items-center gap-2">
                          {editingAccountId === account.id && (
                            <div className="flex items-center gap-1 bg-parchment rounded-lg p-0.5">
                              <button 
                                onClick={() => handleUpdateItemQuantity(account, idx, -1)}
                                className="p-0.5 hover:bg-white rounded text-dust"
                              >
                                <Minus size={10} />
                              </button>
                              <span className="w-4 text-center font-bold">{item.quantity}</span>
                              <button 
                                onClick={() => handleUpdateItemQuantity(account, idx, 1)}
                                className="p-0.5 hover:bg-white rounded text-dust"
                              >
                                <Plus size={10} />
                              </button>
                            </div>
                          )}
                          {!editingAccountId || editingAccountId !== account.id ? (
                            <span>{item.quantity}x {item.productName}</span>
                          ) : (
                            <span className="font-medium">{item.productName}</span>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-dust">{formatCurrency(item.price * item.quantity)}</span>
                          {editingAccountId === account.id && (
                            <button 
                              onClick={() => handleRemoveItem(account, idx)}
                              className="text-red-400 hover:text-red-600 p-1"
                            >
                              <X size={12} />
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-parchment flex flex-col gap-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-dust uppercase tracking-wider">
                        {account.payments && account.payments.length > 0 ? 'Saldo Pendiente' : 'Total Acumulado'}
                      </div>
                      <div className="text-lg font-bold text-bark">
                        {formatCurrency(
                          account.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - 
                          (account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0)
                        )}
                      </div>
                      {account.payments && account.payments.length > 0 && (
                        <div className="text-[9px] text-dust italic">
                          Total original: {formatCurrency(account.items.reduce((sum, item) => sum + item.price * item.quantity, 0))}
                        </div>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => onSelectAccount(account)}
                        className="flex items-center gap-2 px-3 py-2 bg-parchment text-espresso rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-mist transition-colors"
                      >
                        <ChevronRight size={14} />
                        Editar
                      </button>
                      <button
                        onClick={() => payingAccountId === account.id ? setPayingAccountId(null) : handleStartPay(account)}
                        className="flex items-center gap-2 px-4 py-2 bg-espresso text-cream rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-bark transition-colors shadow-sm"
                      >
                        <CreditCard size={14} />
                        Cobrar Cuenta
                      </button>
                    </div>
                  </div>

                  <AnimatePresence>
                    {payingAccountId === account.id && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden"
                      >
                        <div className="pt-3 border-t border-dashed border-parchment space-y-4">
                          {/* Payments List */}
                          {currentPayments.length > 0 && (
                            <div className="space-y-1.5">
                              <p className="text-[10px] font-bold text-dust uppercase tracking-wider">Pagos en esta sesión:</p>
                              {currentPayments.map((p, idx) => (
                                <div key={idx} className="flex justify-between items-center bg-parchment/30 px-3 py-1.5 rounded-lg text-xs">
                                  <span className="font-medium text-espresso">{p.method}</span>
                                  <div className="flex items-center gap-3">
                                    <span className="font-bold">{formatCurrency(p.amount)}</span>
                                    <button onClick={() => removePayment(idx, account)} className="text-dust hover:text-red-500">×</button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Payment Input */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-end">
                              <label className="text-[10px] font-bold text-dust uppercase tracking-wider">Cantidad a abonar</label>
                              <span className="text-[10px] text-bark font-bold">
                                Restante: {formatCurrency(
                                  account.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - 
                                  (account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) -
                                  currentPayments.reduce((sum, p) => sum + p.amount, 0)
                                )}
                              </span>
                            </div>
                            <input 
                              type="number"
                              value={paymentAmount}
                              onChange={(e) => setPaymentAmount(e.target.value)}
                              className="w-full bg-cream border border-mist rounded-xl py-2 px-3 text-sm outline-none focus:border-bark"
                              placeholder="0.00"
                            />
                            <div className="grid grid-cols-3 gap-2">
                              {paymentMethods.map((method) => (
                                <button
                                  key={method}
                                  onClick={() => addPayment(account, method)}
                                  className="py-2 rounded-lg border border-mist text-[9px] font-bold uppercase tracking-wider hover:bg-parchment transition-colors"
                                >
                                  {method}
                                </button>
                              ))}
                            </div>
                          </div>

                          <button
                            onClick={() => handleConfirmPay(account)}
                            disabled={currentPayments.length === 0}
                            className="w-full py-2.5 bg-espresso text-cream rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-bark transition-colors disabled:opacity-50"
                          >
                            Finalizar Pago {currentPayments.reduce((sum, p) => sum + p.amount, 0) > 0 && `(${formatCurrency(currentPayments.reduce((sum, p) => sum + p.amount, 0))})`}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {accounts.length === 0 && (
          <div className="col-span-full py-20 bg-white/50 border-2 border-dashed border-parchment rounded-3xl flex flex-col items-center justify-center text-dust space-y-3">
            <Users size={48} strokeWidth={1} />
            <p className="text-sm italic">No hay cuentas abiertas en este momento.</p>
            <p className="text-[10px] uppercase tracking-widest">Agrega productos a una cuenta desde el punto de venta</p>
          </div>
        )}
      </div>
    </div>
  );
}
