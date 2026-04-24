import { useState } from 'react';
import { PendingAccount } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Users, Clock, ChevronRight, Trash2, CreditCard, Edit2, Plus, Minus, X, ChevronDown } from 'lucide-react';
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
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
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
        updatedAt: new Date().toLocaleString('es-MX', { hour12: false, hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
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
        updatedAt: new Date().toLocaleString('es-MX', { hour12: false, hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' })
      });
    }
  };

  const handleStartPay = (account: PendingAccount) => {
    setPayingAccountId(account.id);
    setCurrentPayments([]);
  };

  const addPayment = (account: PendingAccount, method: string) => {
    const total = account.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const alreadyPaid = account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const currentSessionPaid = currentPayments.reduce((sum, p) => sum + p.amount, 0);
    const remaining = total - alreadyPaid - currentSessionPaid;

    if (remaining <= 0) return;

    setCurrentPayments([...currentPayments, { method, amount: remaining }]);
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
              className="bg-white border border-parchment rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              <div className="p-5 flex-1 space-y-4">
                <div className="flex justify-between items-start">
                  <button 
                    onClick={() => setExpandedAccountId(expandedAccountId === account.id ? null : account.id)}
                    className="flex items-center gap-3 text-left group"
                  >
                    <div className="w-10 h-10 bg-parchment rounded-full flex items-center justify-center text-bark group-hover:bg-gold/20 group-hover:text-gold transition-colors">
                      <Users size={20} />
                    </div>
                    <div>
                      <h3 className="font-serif text-base text-espresso flex items-center gap-2">
                        {account.customerName}
                        <motion.div
                          animate={{ rotate: expandedAccountId === account.id ? 180 : 0 }}
                          className="text-dust"
                        >
                          <ChevronDown size={14} />
                        </motion.div>
                      </h3>
                      <div className="flex items-center gap-2 text-[10px] text-dust">
                        <Clock size={12} />
                        <span>Actualizada: {account.updatedAt}</span>
                      </div>
                    </div>
                  </button>
                </div>

                <AnimatePresence>
                  {expandedAccountId === account.id && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="space-y-4 pt-2 overflow-hidden border-t border-parchment/50"
                    >
                      {/* Products Detail */}
                      <div className="space-y-2">
                        <div className="text-[10px] font-bold text-dust uppercase tracking-wider flex justify-between">
                          <span>Detalle de Consumo</span>
                          <span>{account.items.reduce((sum, item) => sum + item.quantity, 0)} Items</span>
                        </div>
                        <div className="space-y-2 pr-2">
                          {account.items.map((item, idx) => (
                            <div key={idx} className="flex justify-between items-center text-[11px] text-ink py-2 border-b border-parchment/30 last:border-0 gap-2">
                              <div className="flex items-center gap-2 flex-1 min-w-0">
                                {editingAccountId === account.id && (
                                  <div className="flex items-center bg-parchment rounded-lg p-0.5 shrink-0 shadow-inner">
                                    <button 
                                      onClick={() => handleUpdateItemQuantity(account, idx, -1)}
                                      className="p-1 hover:bg-white rounded text-dust transition-colors shadow-sm"
                                    >
                                      <Minus size={10} />
                                    </button>
                                    <span className="min-w-[24px] text-center font-bold text-espresso">{item.quantity}</span>
                                    <button 
                                      onClick={() => handleUpdateItemQuantity(account, idx, 1)}
                                      className="p-1 hover:bg-white rounded text-dust transition-colors shadow-sm"
                                    >
                                      <Plus size={10} />
                                    </button>
                                  </div>
                                )}
                                <span className="font-medium truncate">{item.productName}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-bark bg-bark/5 px-2 py-0.5 rounded-md border border-bark/10 whitespace-nowrap">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
                                {editingAccountId === account.id && (
                                  <button 
                                    onClick={() => handleRemoveItem(account, idx)}
                                    className="text-red-400 hover:text-red-600 p-1.5 hover:bg-red-50 rounded-full transition-colors"
                                  >
                                    <X size={14} />
                                  </button>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Previous Payments Detail */}
                      {account.payments && account.payments.length > 0 && (
                        <div className="space-y-2 pt-2">
                          <div className="text-[10px] font-bold text-dust uppercase tracking-wider">Historial de Pagos</div>
                          <div className="space-y-1.5">
                            {account.payments.map((p, idx) => (
                              <div key={idx} className="flex justify-between items-center bg-cream/50 px-3 py-2 rounded-lg text-xs">
                                <div className="flex flex-col">
                                  <span className="font-medium text-espresso">{p.method}</span>
                                  <span className="text-[9px] text-dust italic">{p.timestamp}</span>
                                </div>
                                <span className="font-bold text-green-600">-{formatCurrency(p.amount)}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {!expandedAccountId || expandedAccountId !== account.id ? (
                  <div className="space-y-2">
                    <div className="text-[10px] font-bold text-dust uppercase tracking-wider">Resumen ({account.items.length} productos)</div>
                    <p className="text-[11px] text-dust italic truncate">
                      {account.items.map(i => `${i.quantity}x ${i.productName}`).join(', ')}
                    </p>
                  </div>
                ) : null}

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

                          {/* Payment Area */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-end border-b border-parchment pb-2">
                              <label className="text-[10px] font-bold text-dust uppercase tracking-wider">Metodo de Pago</label>
                              <span className="text-[10px] text-bark font-bold">
                                Total a liquidar: {formatCurrency(
                                  account.items.reduce((sum, item) => sum + item.price * item.quantity, 0) - 
                                  (account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0) -
                                  currentPayments.reduce((sum, p) => sum + p.amount, 0)
                                )}
                              </span>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-2 pt-2">
                              {paymentMethods.map((method) => (
                                <button
                                  key={method}
                                  onClick={() => addPayment(account, method)}
                                  className="py-3 px-4 bg-white border border-mist rounded-xl flex items-center justify-center gap-2 hover:bg-parchment transition-all group overflow-hidden relative shadow-sm"
                                >
                                  <div className="absolute inset-0 bg-gold/5 translate-y-full group-hover:translate-y-0 transition-transform" />
                                  <span className="relative text-[10px] font-bold uppercase tracking-widest text-espresso">{method}</span>
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
