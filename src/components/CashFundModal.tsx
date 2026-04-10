import { useState } from 'react';
import { motion } from 'motion/react';
import { Wallet, ArrowRight, Info } from 'lucide-react';

interface CashFundModalProps {
  onConfirm: (amount: number) => Promise<void>;
  isLoading: boolean;
}

export function CashFundModal({ onConfirm, isLoading }: CashFundModalProps) {
  const [amount, setAmount] = useState<string>('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const numAmount = parseFloat(amount);
    if (!isNaN(numAmount) && numAmount >= 0) {
      onConfirm(numAmount);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-espresso/60 backdrop-blur-md flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-parchment overflow-hidden"
      >
        <div className="bg-gold p-8 text-espresso text-center space-y-2">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm">
            <Wallet size={32} />
          </div>
          <h2 className="font-serif text-2xl">Apertura de Caja</h2>
          <p className="text-xs text-espresso/60 uppercase tracking-widest font-bold">Fondo Inicial de Efectivo</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          <div className="bg-parchment/30 p-4 rounded-2xl border border-mist flex gap-3 items-start">
            <Info size={18} className="text-gold shrink-0 mt-0.5" />
            <p className="text-[11px] text-dust leading-relaxed">
              Ingresa la cantidad de efectivo con la que inicias el turno. Este monto se utilizará para calcular el balance final al cierre del día.
            </p>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">Monto en Efectivo ($)</label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-espresso font-bold">$</span>
              <input 
                type="number"
                step="0.01"
                required
                autoFocus
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full bg-parchment/30 border border-mist rounded-xl py-4 pl-8 pr-4 text-xl font-bold text-espresso outline-none focus:border-gold transition-colors"
                placeholder="0.00"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || !amount}
            className="w-full bg-espresso text-cream rounded-xl py-4 font-bold text-sm uppercase tracking-widest hover:bg-bark transition-all shadow-lg shadow-espresso/20 flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-cream border-t-transparent rounded-full animate-spin" />
            ) : (
              <>
                Confirmar Apertura
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
