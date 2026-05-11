import { useState, useMemo } from 'react';
import { PendingAccount } from '../types';
import { formatCurrency, cn } from '../lib/utils';
import { Users, Clock, ChevronRight, X, CreditCard, Plus, Minus, ChevronDown, Wallet, Landmark, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface PendingAccountsProps {
  accounts: PendingAccount[];
  users: any[];
  onDeleteAccount: (accountId: string) => void;
  onPayAccount: (account: PendingAccount, payments: { method: string, amount: number }[], overrideUsername?: string) => void;
}

export function PendingAccounts({ accounts, users, onDeleteAccount, onPayAccount }: PendingAccountsProps) {
  const [expandedAccountId, setExpandedAccountId] = useState<string | null>(null);
  const [currentPayments, setCurrentPayments] = useState<{ method: string, amount: number }[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const [showUserSelection, setShowUserSelection] = useState(false);
  const [pendingPaymentAccount, setPendingPaymentAccount] = useState<PendingAccount | null>(null);

  const paymentMethods = ['Efectivo', 'Tarjeta', 'Transferencia', 'Gratis'];

  const accountTotal = useMemo(() => {
    if (!pendingPaymentAccount) return 0;
    return pendingPaymentAccount.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [pendingPaymentAccount]);

  const previousPaymentsTotal = useMemo(() => {
    if (!pendingPaymentAccount) return 0;
    return pendingPaymentAccount.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
  }, [pendingPaymentAccount]);

  const remainingBalance = useMemo(() => {
    const sessionTotal = currentPayments.reduce((sum, p) => sum + p.amount, 0);
    return Math.max(0, accountTotal - previousPaymentsTotal - sessionTotal);
  }, [accountTotal, previousPaymentsTotal, currentPayments]);

  const handleStartPay = (account: PendingAccount) => {
    setPendingPaymentAccount(account);
    const total = account.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    const paid = account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
    const remaining = Math.max(0, total - paid);
    
    // We start with NO payment method selected as requested by user
    setCurrentPayments([]);
    
    setShowUserSelection(true);
  };

  const addPayment = (method: string) => {
    if (remainingBalance <= 0) return;
    setCurrentPayments([...currentPayments, { method, amount: remainingBalance }]);
  };

  const removePayment = (index: number) => {
    const newPayments = [...currentPayments];
    newPayments.splice(index, 1);
    setCurrentPayments(newPayments);
  };

  const updatePaymentAmount = (index: number, val: string) => {
    const amount = parseFloat(val) || 0;
    const newPayments = [...currentPayments];
    newPayments[index].amount = amount;
    setCurrentPayments(newPayments);
  };

  const finalizePayment = async (selectedUsername: string) => {
    if (!pendingPaymentAccount || currentPayments.length === 0 || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await onPayAccount(pendingPaymentAccount, currentPayments, selectedUsername);
      setCurrentPayments([]);
      setShowUserSelection(false);
      setPendingPaymentAccount(null);
    } catch (error) {
      console.error(error);
      alert('Error al procesar el pago.');
    } finally {
      setIsProcessing(false);
    }
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
                                <span className="font-medium truncate">{item.productName}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="font-bold text-bark bg-bark/5 px-2 py-0.5 rounded-md border border-bark/10 whitespace-nowrap">
                                  {formatCurrency(item.price * item.quantity)}
                                </span>
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
                        onClick={() => handleStartPay(account)}
                        className="flex items-center gap-2 px-4 py-2 bg-espresso text-cream rounded-xl text-[10px] font-bold uppercase tracking-wider hover:bg-bark transition-colors shadow-sm"
                      >
                        <CreditCard size={14} />
                        Cobrar Cuenta
                      </button>
                    </div>
                  </div>
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
                    <h3 className="font-serif text-xl text-espresso">{isProcessing ? 'Procesando...' : 'Cobrar Cuenta'}</h3>
                  </div>
                  <div className="flex justify-between items-end mt-4">
                    <div>
                      <div className="text-[10px] font-bold text-dust uppercase tracking-widest">Saldo Pendiente</div>
                      <div className="text-2xl font-bold text-espresso">{formatCurrency(accountTotal - previousPaymentsTotal)}</div>
                    </div>
                    {remainingBalance > 0 && (
                      <div className="text-right">
                        <div className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Por Cobrar</div>
                        <div className="text-lg font-bold text-red-500">{formatCurrency(remainingBalance)}</div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex-1 p-5 overflow-y-auto space-y-4 max-h-[300px] md:max-h-none">
                  <div className="space-y-4">
                    <div className="text-[10px] font-bold text-dust uppercase tracking-widest mb-2">Pagos de esta sesión</div>
                    <div className="space-y-2">
                      {currentPayments.map((p, idx) => (
                        <div key={idx} className="flex items-center gap-2 bg-cream/40 p-2 rounded-xl border border-mist/30">
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
                            onClick={() => removePayment(idx)}
                            className="p-2 text-red-300 hover:text-red-500 transition-colors mt-4"
                          >
                            <X size={16} />
                          </button>
                        </div>
                      ))}
                    </div>

                    {remainingBalance > 0 && (
                      <div className="pt-2 border-t border-mist/50">
                        <div className="text-[10px] font-bold text-gold uppercase tracking-widest mb-3">
                          {currentPayments.length === 0 ? 'Selecciona Método de Pago' : 'Dividir con otro método'}
                        </div>
                        <div className="grid grid-cols-3 gap-2">
                          {['Efectivo', 'Tarjeta', 'Transferencia'].map(m => (
                            <button
                              key={m}
                              onClick={() => addPayment(m)}
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
                  {users.map((user) => {
                    const currentPaid = currentPayments.reduce((sum, p) => sum + p.amount, 0);
                    const canFinalize = currentPaid > 0.01;

                    return (
                      <button
                        key={user.username}
                        disabled={isProcessing || !canFinalize}
                        onClick={() => finalizePayment(user.username)}
                        className={cn(
                          "w-full flex items-center justify-between p-3 rounded-2xl border transition-all group shadow-sm hover:shadow-md",
                          (isProcessing || !canFinalize)
                            ? "bg-cream/20 border-mist/20 opacity-40 cursor-not-allowed"
                            : "bg-white border-mist/30 hover:border-gold hover:bg-gold/5"
                        )}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bark/10 flex items-center justify-center text-bark group-hover:bg-gold/20 group-hover:text-espresso transition-colors">
                            {isProcessing ? <RefreshCw size={14} className="animate-spin" /> : <Users size={16} />}
                          </div>
                          <div className="text-left">
                            <div className="font-bold text-xs text-espresso">{user.name}</div>
                            <div className="text-[9px] text-dust uppercase tracking-wider font-medium">{user.role}</div>
                          </div>
                        </div>
                        <ChevronRight size={14} className="text-dust group-hover:text-espresso" />
                      </button>
                    );
                  })}
                  {users.length === 0 && (
                    <div className="text-center py-10 opacity-50">
                      <p className="text-[10px] text-dust italic">No hay usuarios registrados</p>
                    </div>
                  )}
                </div>

                <div className="p-5 bg-white border-t border-mist flex flex-col gap-2">
                  {!isProcessing && currentPayments.reduce((sum, p) => sum + p.amount, 0) <= 0.01 && (
                    <div className="text-[10px] font-bold text-red-500 text-center uppercase tracking-widest animate-pulse">
                      Ingresa un monto para cobrar
                    </div>
                  )}
                  <button 
                    onClick={() => {
                      setShowUserSelection(false);
                      setPendingPaymentAccount(null);
                      setCurrentPayments([]);
                    }}
                    className="w-full py-2.5 text-[10px] font-bold text-dust hover:text-espresso border border-mist/30 rounded-xl uppercase tracking-widest transition-colors"
                  >
                    Regresar
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
