import { useState, useEffect, useRef } from 'react';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { SalesPOS } from './components/SalesPOS';
import { Inventory } from './components/Inventory';
import { SalesHistory } from './components/SalesHistory';
import { InventoryHistory } from './components/InventoryHistory';
import { PendingAccounts } from './components/PendingAccounts';
import { Login } from './components/Login';
import { CashFundModal } from './components/CashFundModal';
import { Expenses } from './components/Expenses';
import { Sale, Product, Event, InventoryMovement, PendingAccount, Expense, CashLog } from './types';
import { Settings, RefreshCw, Menu } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn, formatCurrency, getTodayMX } from './lib/utils';

const generateId = () => {
  try {
    return crypto.randomUUID();
  } catch (e) {
    return Math.random().toString(36).substring(2, 11) + Date.now().toString(36);
  }
};

export default function App() {
  const [activeView, setActiveView] = useState('dashboard');
  const [sales, setSales] = useState<Sale[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [cashLogs, setCashLogs] = useState<CashLog[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [pendingAccounts, setPendingAccounts] = useState<PendingAccount[]>([]);
  const [activePendingAccount, setActivePendingAccount] = useState<PendingAccount | null>(null);
  const [posCart, setPosCart] = useState<any[]>([]);
  const [posCustomerName, setPosCustomerName] = useState('');

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Keep active account in sync with the list
  useEffect(() => {
    if (activePendingAccount) {
      const latest = pendingAccounts.find(a => a.id === activePendingAccount.id);
      if (latest && JSON.stringify(latest) !== JSON.stringify(activePendingAccount)) {
        setActivePendingAccount(latest);
      }
    }
  }, [pendingAccounts]);
  const [googleTokens, setGoogleTokens] = useState<any>(null);
  const [templateId, setTemplateId] = useState<string>(localStorage.getItem('google_template_id') || '');
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [hasCashFund, setHasCashFund] = useState<boolean>(false);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncTime, setLastSyncTime] = useState<Date | null>(null);
  const [pollerGuardUntil, setPollerGuardUntil] = useState<number>(0);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [isAuthChecking, setIsAuthChecking] = useState(true);
  
  const lastSyncedAccountsRef = useRef<string>('');
  const isSyncInProgressRef = useRef<boolean>(false);
  const operationLockRef = useRef<boolean>(false);

  const syncPendingAccounts = async (accountsToSync?: PendingAccount[]) => {
    // CRITICAL: Only sync if data has been successfully loaded from the sheet first
    // to avoid overwriting the sheet with an empty local state on startup
    if (!googleTokens || !templateId || isAuthChecking || !isDataLoaded) return;
    
    // Check lock
    if (isSyncInProgressRef.current) return;
    
    isSyncInProgressRef.current = true;
    setIsSyncing(true);
    try {
      // Get latest state if not provided
      const accounts = accountsToSync || [...pendingAccounts];
      const accountsJson = JSON.stringify(accounts);
      
      // Skip if same as last sync (only if automatic/polling)
      if (!accountsToSync && accountsJson === lastSyncedAccountsRef.current) return;
      
      const response = await fetch('/api/sheets/pending-accounts/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: googleTokens, 
          spreadsheetId: templateId, 
          accounts 
        }),
      });
      
      if (response.ok) {
        setLastSyncTime(new Date());
        lastSyncedAccountsRef.current = accountsJson;
      } else {
        const result = await response.json();
        console.error('Error al sincronizar:', result.error || response.statusText);
      }
    } catch (error) {
      console.error('Error de red al sincronizar:', error);
    } finally {
      setIsSyncing(false);
      isSyncInProgressRef.current = false;
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('pos_user');
    if (savedUser) {
      setCurrentUser(JSON.parse(savedUser));
      // Check if cash fund was already set for today
      const lastFundDate = localStorage.getItem('last_cash_fund_date');
      const now = new Date();
      const today = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}/${now.getFullYear()}`;
      if (lastFundDate === today) {
        setHasCashFund(true);
      }
    }
    setIsAuthChecking(false);
  }, []);

  const handleCashFundConfirm = async (amount: number) => {
    if (!googleTokens || !templateId || !currentUser) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/sheets/cash-fund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tokens: googleTokens,
          spreadsheetId: templateId,
          amount,
          username: currentUser.username
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setHasCashFund(true);
        const tjDate = getTodayMX();
        const todayStr = `${String(tjDate.getDate()).padStart(2, '0')}/${String(tjDate.getMonth() + 1).padStart(2, '0')}/${tjDate.getFullYear()}`;
        localStorage.setItem('last_cash_fund_date', todayStr);
      } else {
        alert('Error al registrar fondo de caja: ' + data.error);
      }
    } catch (error) {
      alert('Error de red al registrar fondo de caja.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (username: string, password: string) => {
    if (!googleTokens || !templateId) {
      setLoginError('Configura la conexión con Google Sheets primero en Configuración.');
      setShowSettings(true);
      return;
    }

    setIsLoading(true);
    setLoginError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: googleTokens, 
          spreadsheetId: templateId, 
          username, 
          password 
        }),
      });
      
      const data = await response.json();
      if (data.success) {
        setCurrentUser(data.user);
        localStorage.setItem('pos_user', JSON.stringify(data.user));
        fetchData(googleTokens, templateId); // Fetch data immediately to check for cash fund
      } else {
        setLoginError(data.error || 'Error de autenticación');
      }
    } catch (error) {
      setLoginError('Error de red al intentar iniciar sesión.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem('pos_user');
  };

  const handleGoogleAuth = async () => {
    try {
      const response = await fetch('/api/auth/google/url');
      const { url } = await response.json();
      window.open(url, 'google_auth', 'width=600,height=700');
    } catch (error) {
      console.error('Error getting Google Auth URL:', error);
    }
  };

  const fetchData = async (tokensToUse?: any, idToUse?: string, silent: boolean = false) => {
    const tokens = tokensToUse || googleTokens;
    const spreadsheetId = idToUse || templateId;

    if (!tokens || !spreadsheetId) return;
    
    // Poller protection: If we recently updated the sheet, ignore incoming polls for a bit
    if (silent && Date.now() < pollerGuardUntil) return;

    if (!silent) setIsLoading(true);
    try {
      const response = await fetch('/api/sheets/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tokens, spreadsheetId }),
      });
      const data = await response.json();
      if (data.error) {
        if (!silent) {
          console.error('Server error fetching data:', data.error);
          alert('Error al conectar con la hoja: ' + data.error);
        }
        return;
      }
      if (data.inventory) setProducts(data.inventory);
      if (data.sales) setSales(data.sales);
      if (data.movements) setMovements(data.movements);
      if (data.expenses) setExpenses(data.expenses);
      if (data.users) setUsers(data.users);
      if (data.pendingAccounts) {
        // Compare with what we know we've synced to avoid overwriting local changes
        // that are still in flight or debounced.
        const currentAccountsJson = JSON.stringify(pendingAccounts);
        const incomingAccountsJson = JSON.stringify(data.pendingAccounts);
        
        // Only update if we don't have an active account being edited in POS
        // AND if local state matches our last known sync (meaning no pending local changes)
        // OR if the incoming data is actually different from our last sync
        const hasNoPendingLocalChanges = currentAccountsJson === lastSyncedAccountsRef.current;
        
        if (!activePendingAccount && (hasNoPendingLocalChanges || incomingAccountsJson !== lastSyncedAccountsRef.current)) {
          // If we have a poller guard, we strictly check if incoming data is actually newer 
          // (but standard flow for now)
          setPendingAccounts(data.pendingAccounts);
          lastSyncedAccountsRef.current = incomingAccountsJson;
        }
      }
      if (data.cashLogs) {
        setCashLogs(data.cashLogs);
        // Check if there's a "Fondo Inicial" for today in the server data
        const tjDate = new Date().toLocaleString('es-MX', { 
          timeZone: 'America/Tijuana',
          day: '2-digit', 
          month: '2-digit', 
          year: 'numeric' 
        });
        const todayStr = tjDate.split(',')[0]; // "DD/MM/YYYY"
        
        const hasTodayFund = data.cashLogs.some((log: CashLog) => {
          if (log.type !== "Fondo Inicial") return false;
          // Match formats like "13/04/2026" or "13/4/2026"
          return log.timestamp.includes(todayStr);
        });

        if (hasTodayFund) {
          setHasCashFund(true);
          localStorage.setItem('last_cash_fund_date', todayStr);
        }
      }
      setIsDataLoaded(true);
    } catch (error) {
      if (!silent) {
        console.error('Network error fetching data:', error);
        alert('Error de red al intentar conectar con Google Sheets.');
      }
    } finally {
      if (!silent) setIsLoading(false);
    }
  };

  useEffect(() => {
    const savedTokens = localStorage.getItem('google_tokens');
    const urlParams = new URLSearchParams(window.location.search);
    const urlSheetId = urlParams.get('sheetId');
    
    // Priority: URL param > localStorage
    const currentId = urlSheetId || localStorage.getItem('google_template_id') || '';
    if (currentId) {
      const cleanId = extractId(currentId);
      setTemplateId(cleanId);
      localStorage.setItem('google_template_id', cleanId);
    }

    if (savedTokens) {
      const tokens = JSON.parse(savedTokens);
      setGoogleTokens(tokens);
      if (currentId) fetchData(tokens, extractId(currentId));
    }

    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === 'GOOGLE_AUTH_SUCCESS') {
        const tokens = event.data.tokens;
        setGoogleTokens(tokens);
        localStorage.setItem('google_tokens', JSON.stringify(tokens));
        if (templateId) fetchData(tokens, templateId);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      syncPendingAccounts();
    }, 2000); // Debounce for stability

    return () => clearTimeout(timer);
  }, [pendingAccounts, isDataLoaded, googleTokens, templateId]);

  // Polling for background updates
  useEffect(() => {
    if (!googleTokens || !templateId || !currentUser) return;

    const interval = setInterval(() => {
      // Only poll if the user is not actively interacting with a modal or checkout
      // to avoid UI jumps, but generally safe for silent updates
      fetchData(googleTokens, templateId, true);
    }, 30000); // Poll every 30 seconds (increased from 15s to save quota)

    return () => clearInterval(interval);
  }, [googleTokens, templateId, currentUser, activePendingAccount]);

  const handleAddSale = async (
    product: Product, 
    quantity: number = 1, 
    paymentMethod: string = 'Efectivo', 
    totalAmount?: number, 
    providedCustomerName?: string, 
    overrideUsername?: string, 
    note?: string,
    paymentMethod2?: string,
    amount2?: number,
    paymentMethod3?: string,
    amount3?: number
  ) => {
    // Just wrap in a batch of 1
    return handleAddSalesBatch([{ 
      product, 
      quantity, 
      paymentMethod, 
      totalAmount, 
      customerName: providedCustomerName, 
      username: overrideUsername, 
      note,
      paymentMethod2,
      amount2,
      paymentMethod3,
      amount3
    }]);
  };

  const handleAddSalesBatch = async (items: { 
    product: Product, 
    quantity: number, 
    paymentMethod: string, 
    totalAmount?: number, 
    customerName?: string, 
    username?: string, 
    note?: string,
    paymentMethod2?: string,
    amount2?: number,
    paymentMethod3?: string,
    amount3?: number
  }[]) => {
    if (!googleTokens || !templateId || !currentUser) {
      if (!currentUser) alert('Debes iniciar sesión para realizar transacciones.');
      else {
        alert('Por favor, configura la conexión con Google Sheets primero.');
        setShowSettings(true);
      }
      return;
    }

    if (operationLockRef.current) return;
    operationLockRef.current = true;

    try {
      const now = new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
      const batchSales: Sale[] = [];
      let accountsToSync: PendingAccount[] = [];
      let pendingUpdateNeeded = false;

      // Prepare data
      for (const item of items) {
        const { product, quantity, paymentMethod, totalAmount, customerName, username, note, paymentMethod2, amount2, paymentMethod3, amount3 } = item;
        const transactionUsername = username || currentUser.username;

        if (paymentMethod === 'Pendiente') {
          pendingUpdateNeeded = true;
          const finalName = (customerName || activePendingAccount?.customerName || '').trim();
          if (!finalName) continue;
          
          const normalizedFinalName = finalName.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
          
          // Local update logic (we still use the state-based updater but collect results)
          // For batches, this is tricky. We'll simplify: process Pendiente separately if mixed (rarely happens in this UI)
          // or just assume if it's Pendiente, it's a single item or a set for one account.
          
          await new Promise<void>(resolve => {
            setPendingAccounts(prev => {
              const existingAccount = activePendingAccount 
                ? prev.find(a => a.id === activePendingAccount.id)
                : prev.find(a => a.customerName.trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() === normalizedFinalName);

              let newPrev: PendingAccount[];
              if (existingAccount) {
                const existingItemIndex = existingAccount.items.findIndex(i => i.productId === product.id);
                let newItems = [...existingAccount.items];
                if (existingItemIndex > -1) {
                  newItems[existingItemIndex] = { ...newItems[existingItemIndex], quantity: newItems[existingItemIndex].quantity + quantity };
                } else {
                  newItems.push({ productId: product.id, productName: product.name, price: product.price, quantity, category: product.category });
                }
                const updated = { ...existingAccount, customerName: finalName, updatedAt: now, items: newItems };
                newPrev = prev.map(a => a.id === updated.id ? updated : a);
              } else {
                const newAcc: PendingAccount = {
                  id: generateId(),
                  customerName: finalName,
                  status: 'Abierta',
                  createdAt: now,
                  updatedAt: now,
                  items: [{ productId: product.id, productName: product.name, price: product.price, quantity, category: product.category }]
                };
                newPrev = [newAcc, ...prev];
              }
              accountsToSync = newPrev;
              resolve();
              return newPrev;
            });
          });
          
          setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: p.stock - quantity } : p));
        } else {
          const amount = totalAmount !== undefined ? totalAmount : (paymentMethod === 'Gratis' ? 0 : product.price * quantity);
          const newSale: Sale = {
            id: generateId(),
            timestamp: now,
            productName: product.name,
            category: product.category,
            amount,
            quantity,
            paymentMethod,
            paymentMethod2,
            amount2,
            paymentMethod3,
            amount3,
            username: transactionUsername,
            note: note || ""
          };
          batchSales.push(newSale);
          
          if (quantity !== 0) {
            setProducts(prev => prev.map(p => p.id === product.id ? { ...p, stock: p.stock - quantity } : p));
            setMovements(prev => [{
              timestamp: now,
              productId: product.id,
              productName: product.name,
              type: "Salida (Venta)",
              quantity: -quantity,
              stockResult: product.stock - quantity, // Note: this might be slightly off in batch if multiple items same product
              notes: `Venta ID: ${newSale.id}`,
              username: transactionUsername
            }, ...prev]);
          }
        }
      }

      // Sync Pendiente if needed
      if (pendingUpdateNeeded) {
        await syncPendingAccounts(accountsToSync);
        setActivePendingAccount(null);
        setActiveView('cuentas');
      }

      // Sync Sales Batch if needed
      if (batchSales.length > 0) {
        setSales(prev => [...batchSales, ...prev]);
        const response = await fetch('/api/sheets/sales/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tokens: googleTokens, 
            spreadsheetId: templateId, 
            sales: batchSales
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`HTTP error ${response.status}: ${errorText}`);
        }

        const result = await response.json();
        if (!result.success) {
          fetchData();
          alert('Error al guardar ventas: ' + result.error);
        } else if (activePendingAccount) {
          setPendingAccounts(prev => {
            const updated = prev.filter(a => a.id !== activePendingAccount.id);
            syncPendingAccounts(updated);
            return updated;
          });
          setActivePendingAccount(null);
        }
      }
    } catch (error) {
      console.error('Batch sale error:', error);
      fetchData();
    } finally {
      operationLockRef.current = false;
    }
  };

  const handleUpdatePendingAccountItems = async (items: { product: Product, quantity: number }[]) => {
    if (!googleTokens || !templateId || !currentUser || !activePendingAccount) return;

    const now = new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
    
    // Calculate stock changes
    // We need to compare old items vs new items to know the delta
    const oldItems = activePendingAccount.items;
    
    setPendingAccounts(prev => {
      const updatedAccount: PendingAccount = {
        ...activePendingAccount,
        updatedAt: now,
        items: items.map(item => ({
          productId: item.product.id,
          productName: item.product.name,
          price: item.product.price,
          quantity: item.quantity,
          category: item.product.category
        }))
      };
      const updatedAccounts = prev.map(a => a.id === updatedAccount.id ? updatedAccount : a);
      // Eagerly sync
      lastSyncedAccountsRef.current = JSON.stringify(updatedAccounts);
      syncPendingAccounts(updatedAccounts);
      return updatedAccounts;
    });

    // We should ideally update stock here too, but for simplicity in this turn 
    // and given current architecture, we'll let the next sync handle the reconciliation 
    // or assume the user manages stock separately (as per current app behavior).
    // Actually, let's at least update local stock for immediate feedback
    setProducts(prev => {
      const newProducts = prev.map(p => {
        const oldItem = oldItems.find(item => item.productId === p.id);
        const newItem = items.find(item => item.product.id === p.id);
        
        let newStock = p.stock;
        if (oldItem) newStock += oldItem.quantity;
        if (newItem) newStock -= newItem.quantity;
        
        return { ...p, stock: newStock };
      });
      return newProducts;
    });

    setActivePendingAccount(null);
    setActiveView('cuentas');
  };

  const handlePayPendingAccount = async (account: PendingAccount, sessionPayments: { method: string, amount: number }[], overrideUsername?: string) => {
    if (!googleTokens || !templateId || !currentUser) return;
    if (operationLockRef.current) return;
    operationLockRef.current = true;

    try {
      const transactionUsername = overrideUsername || currentUser.username;
      const now = new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana', hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric' });
      const totalAccount = account.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      const previousPaid = account.payments?.reduce((sum, p) => sum + p.amount, 0) || 0;
      const sessionTotal = sessionPayments.reduce((sum, p) => sum + p.amount, 0);
      const isFullyPaid = (previousPaid + sessionTotal) >= totalAccount - 0.01;

      if (isFullyPaid) {
        setPollerGuardUntil(Date.now() + 10000);

        let updatedAccounts: PendingAccount[] = [];
        await new Promise<void>((resolve) => {
          setPendingAccounts(prev => {
            updatedAccounts = prev.filter(a => a.id !== account.id);
            resolve();
            return updatedAccounts;
          });
        });
        
        lastSyncedAccountsRef.current = JSON.stringify(updatedAccounts);
        await syncPendingAccounts(updatedAccounts);

        if (activePendingAccount?.id === account.id) {
          setActivePendingAccount(null);
        }

        const rawPayments = [
          ...(account.payments || []).map(p => ({ method: p.method, amount: p.amount })),
          ...sessionPayments
        ];

        // Group payments by method to optimize the 3 available slots
        const groupedPaymentsMap = rawPayments.reduce((acc, p) => {
          const m = p.method || "Efectivo";
          acc[m] = (acc[m] || 0) + p.amount;
          return acc;
        }, {} as Record<string, number>);

        const allPayments = Object.entries(groupedPaymentsMap)
          .map(([method, amount]) => ({ method, amount }))
          .sort((a, b) => b.amount - a.amount); // High amount first
        
        const actualTotalPaid = allPayments.reduce((sum, p) => sum + p.amount, 0);
        const batchSales: Sale[] = [];

        account.items.forEach(item => {
          const itemTotal = item.price * item.quantity;
          
          const sale: Sale = {
            id: generateId(),
            timestamp: now,
            productName: item.productName,
            category: item.category,
            amount: 0,
            quantity: item.quantity,
            paymentMethod: "",
            username: transactionUsername,
            note: `Liquidación cuenta: ${account.customerName}`
          };

          // Distribute payments (up to 3)
          if (allPayments[0]) {
            sale.paymentMethod = allPayments[0].method;
            sale.amount = (allPayments[0].amount / actualTotalPaid) * itemTotal;
          }
          if (allPayments[1]) {
            sale.paymentMethod2 = allPayments[1].method;
            sale.amount2 = (allPayments[1].amount / actualTotalPaid) * itemTotal;
          }
          if (allPayments[2]) {
            sale.paymentMethod3 = allPayments[2].method;
            sale.amount3 = (allPayments[2].amount / actualTotalPaid) * itemTotal;
          }

          // If there are more than 3 methods, distribute the rest of the total into the 3rd slot 
          // to ensure the row's total matches the item total
          if (allPayments.length > 3) {
             const remainingProportion = allPayments.slice(3).reduce((acc, p) => acc + p.amount, 0) / actualTotalPaid;
             sale.amount3 = (sale.amount3 || 0) + (remainingProportion * itemTotal);
          }

          batchSales.push(sale);
        });

        setSales(prev => [...batchSales, ...prev]);

        const batchRes = await fetch('/api/sheets/sales/batch', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            tokens: googleTokens, 
            spreadsheetId: templateId, 
            sales: batchSales
          }),
        });
        
        if (!batchRes.ok) console.error("Error al registrar ventas por lote");

      } else {
        const updatedAccount: PendingAccount = {
          ...account,
          updatedAt: now,
          payments: [
            ...(account.payments || []),
            ...sessionPayments.map(p => ({ ...p, timestamp: now }))
          ]
        };

        let updatedAccounts: PendingAccount[] = [];
        await new Promise<void>((resolve) => {
          setPendingAccounts(prev => {
            updatedAccounts = prev.map(a => a.id === account.id ? updatedAccount : a);
            resolve();
            return updatedAccounts;
          });
        });
        
        lastSyncedAccountsRef.current = JSON.stringify(updatedAccounts);
        await syncPendingAccounts(updatedAccounts);

        if (activePendingAccount?.id === account.id) {
          setActivePendingAccount(updatedAccount);
        }
      }
    } catch (error) {
      console.error('Error paying account:', error);
      fetchData();
    } finally {
      operationLockRef.current = false;
    }
  };

  const handleDeletePendingAccount = (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta cuenta?')) return;
    const updated = pendingAccounts.filter(a => a.id !== id);
    setPendingAccounts(updated);
    lastSyncedAccountsRef.current = JSON.stringify(updated);
    syncPendingAccounts(updated);
  };

  const handleUpdatePendingAccount = (updatedAcc: PendingAccount) => {
    setPendingAccounts(prev => {
      const updated = prev.map(a => a.id === updatedAcc.id ? updatedAcc : a);
      lastSyncedAccountsRef.current = JSON.stringify(updated);
      syncPendingAccounts(updated);
      return updated;
    });
  };

  const getAutoIcon = (category: string): string => {
    const cat = category.toLowerCase();
    if (cat.includes('libro') || cat.includes('book') || cat.includes('librería')) return 'library';
    if (cat.includes('café') || cat.includes('coffee') || cat.includes('chai') || cat.includes('té') || cat.includes('te')) return 'coffee';
    if (cat.includes('soda') || cat.includes('refresco')) return 'soda';
    if (cat.includes('bebida') || cat.includes('drink')) return 'drink';
    if (cat.includes('nieve') || cat.includes('ice') || cat.includes('helado')) return 'ice-cream';
    if (cat.includes('snack') || cat.includes('cookie') || cat.includes('panadería')) return 'cookie';
    if (cat.includes('alimento') || cat.includes('food') || cat.includes('utensils')) return 'food';
    if (cat.includes('evento') || cat.includes('ticket')) return 'ticket';
    if (cat.includes('vino') || cat.includes('wine')) return 'wine';
    if (cat.includes('regalo') || cat.includes('gift') || cat.includes('accesorio') || cat.includes('bazar')) return 'gift';
    return 'sparkles';
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    if (!googleTokens || !templateId || !currentUser) return;

    const newProduct: Product = {
      ...product,
      id: generateId(),
      icon: product.icon || getAutoIcon(product.category)
    };

    // Optimistic update
    setProducts(prev => [...prev, newProduct]);

    const newMovement: InventoryMovement = {
      timestamp: new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana' }),
      productId: newProduct.id,
      productName: newProduct.name,
      type: "Alta de Producto",
      quantity: newProduct.stock,
      stockResult: newProduct.stock,
      notes: "Registro inicial",
      username: currentUser.username
    };
    setMovements(prev => [newMovement, ...prev]);

    try {
      await fetch('/api/sheets/inventory/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: googleTokens, 
          spreadsheetId: templateId, 
          product: newProduct,
          username: currentUser.username 
        }),
      });
    } catch (error) {
      fetchData();
    }
  };

  const handleUpdateStock = async (productId: string, adjustment: number, notes: string = 'Ajuste manual desde inventario') => {
    if (!googleTokens || !templateId || !currentUser) return;

    // Optimistic update
    setProducts(prev => prev.map(p => p.id === productId ? { ...p, stock: p.stock + adjustment } : p));

    const product = products.find(p => p.id === productId);
    let iconToSync = "";
    
    if (product) {
      iconToSync = product.icon || getAutoIcon(product.category);
      const newMovement: InventoryMovement = {
        timestamp: new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana' }),
        productId,
        productName: product.name,
        type: adjustment > 0 ? "Entrada" : "Ajuste/Salida",
        quantity: adjustment,
        stockResult: product.stock + adjustment,
        notes: notes,
        username: currentUser.username
      };
      setMovements(prev => [newMovement, ...prev]);
    }

    try {
      await fetch('/api/sheets/inventory/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: googleTokens, 
          spreadsheetId: templateId, 
          productId, 
          adjustment, 
          notes,
          icon: iconToSync,
          username: currentUser.username 
        }),
      });
    } catch (error) {
      fetchData();
    }
  };

  const handleAddExpense = async (expenseData: Omit<Expense, 'id' | 'timestamp' | 'username'>) => {
    if (!googleTokens || !templateId || !currentUser) return;

    const newExpense: Expense = {
      ...expenseData,
      id: generateId(),
      timestamp: new Date().toLocaleString('es-MX', { hour12: false, timeZone: 'America/Tijuana' }),
      username: currentUser.username
    };

    // Optimistic update
    setExpenses(prev => [newExpense, ...prev]);

    try {
      const response = await fetch('/api/sheets/expense', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: googleTokens, 
          spreadsheetId: templateId, 
          expense: newExpense 
        }),
      });
      const result = await response.json();
      if (!result.success) {
        fetchData();
        alert('Error al guardar el gasto: ' + result.error);
      }
    } catch (error) {
      console.error('Expense error:', error);
      fetchData();
    }
  };

  const extractId = (input: string) => {
    if (!input) return '';
    const match = input.match(/\/d\/([a-zA-Z0-9-_]+)/);
    const id = match ? match[1] : input.trim();
    console.log('Extracted Spreadsheet ID:', id);
    return id;
  };

  const saveTemplateId = (id: string) => {
    const cleanId = extractId(id);
    setTemplateId(cleanId);
    localStorage.setItem('google_template_id', cleanId);
    setShowSettings(false);
    if (googleTokens) fetchData(googleTokens, cleanId);
  };

  const [isTesting, setIsTesting] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string } | null>(null);

  const testConnection = async () => {
    if (!templateId) return;
    setIsTesting(true);
    setTestResult(null);
    try {
      const response = await fetch('/api/export-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          tokens: googleTokens, 
          updates: [], // Empty updates just to test connection
          spreadsheetId: extractId(templateId),
          title: 'Test Connection' 
        }),
      });
      const result = await response.json();
      if (result.success) {
        setTestResult({ success: true, message: '¡Conexión exitosa!' });
      } else {
        setTestResult({ success: false, message: result.error });
      }
    } catch (error) {
      setTestResult({ success: false, message: 'Error de red al conectar.' });
    } finally {
      setIsTesting(false);
    }
  };

  if (isAuthChecking) return null;

  if (!currentUser) {
    return (
      <>
        <Login onLogin={handleLogin} isLoading={isLoading} error={loginError} />
        {showSettings && (
          <div className="fixed inset-0 z-50 bg-espresso/40 backdrop-blur-sm flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-parchment"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-xl text-espresso">Configuración de Google Sheets</h2>
                <button onClick={() => setShowSettings(false)} className="text-dust hover:text-espresso">×</button>
              </div>
              <p className="text-xs text-dust mb-6">Para validar usuarios, primero debes conectar tu hoja de cálculo.</p>
              <div className="space-y-4">
                <button 
                  onClick={handleGoogleAuth}
                  className="w-full py-3 bg-white border border-mist rounded-xl text-sm font-medium hover:bg-parchment transition-colors flex items-center justify-center gap-3"
                >
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  {googleTokens ? '✓ Conectado a Google' : 'Conectar con Google'}
                </button>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-dust uppercase tracking-wider ml-1">ID de la Hoja de Cálculo</label>
                  <input 
                    type="text"
                    value={templateId}
                    onChange={(e) => setTemplateId(e.target.value)}
                    onBlur={(e) => {
                      const cleanId = extractId(e.target.value);
                      setTemplateId(cleanId);
                      localStorage.setItem('google_template_id', cleanId);
                    }}
                    className="w-full bg-parchment/30 border border-mist rounded-xl py-3 px-4 text-sm outline-none focus:border-bark"
                    placeholder="Pega el ID o URL de tu Google Sheet"
                  />
                </div>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="w-full py-3 bg-espresso text-cream rounded-xl text-sm font-bold uppercase tracking-widest hover:bg-bark transition-colors"
                >
                  Guardar y Cerrar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </>
    );
  }

  if (!hasCashFund) {
    // If we are still loading data, don't show the modal yet
    if (!isDataLoaded || isLoading) return null;
    return <CashFundModal onConfirm={handleCashFundConfirm} isLoading={isLoading} />;
  }

  return (
    <div className="flex min-h-screen bg-cream overflow-x-hidden">
      <Sidebar 
        activeView={activeView} 
        setActiveView={(view) => {
          setActiveView(view);
          setIsSidebarOpen(false);
        }} 
        currentUser={currentUser}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />
      
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsSidebarOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>
      
      <main className="flex-1 min-w-0 flex flex-col h-screen overflow-hidden">
        <header className="bg-cream px-4 lg:px-8 py-4 lg:py-5 flex items-center justify-between border-b border-mist sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 -ml-2 text-espresso hover:bg-mist/20 rounded-lg transition-colors"
            >
              <Menu size={24} />
            </button>
            <div>
              <h1 className="font-serif text-lg lg:text-2xl text-espresso truncate max-w-[200px] lg:max-w-none">
                {activeView === 'dashboard' ? 'Pero primero un cafe ... ☕' : 
                 activeView === 'ventas' ? 'Registro de Ventas' : 
                 activeView === 'gastos' ? 'Control de Gastos' : 
                 activeView === 'registros' ? 'Registros de Ventas' : 
                 activeView === 'registros_inventario' ? 'Registros de Inventario' : 
                 activeView === 'cuentas' ? 'Cuentas Abiertas' : 'Inventario'}
              </h1>
              <p className="hidden sm:block text-[10px] lg:text-xs text-dust mt-0.5 lg:mt-1">Resumen operativo del día · Tijuana, B.C.</p>
            </div>
          </div>
          
          <div className="flex items-center gap-1 lg:gap-3">
            <div className="flex items-center gap-2">
              {isSyncing && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-parchment rounded-full animate-pulse">
                  <div className="w-1.5 h-1.5 bg-bark rounded-full" />
                  <span className="text-[9px] font-bold text-bark uppercase tracking-wider">Guardando...</span>
                </div>
              )}
              {!isSyncing && lastSyncTime && (
                <span className="hidden md:inline text-[9px] text-dust font-medium">
                  Sincronizado: {lastSyncTime.toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit' })}
                </span>
              )}
              <button 
                onClick={() => fetchData()}
                disabled={isLoading || !googleTokens || !templateId}
                className="p-2 text-dust hover:text-espresso transition-colors disabled:opacity-30"
                title="Sincronizar con Google Sheets"
              >
                <RefreshCw size={18} className={cn(isLoading && "animate-spin")} />
              </button>
            </div>
            {currentUser?.username === 'admin' && (
              <button 
                onClick={() => setShowSettings(true)}
                className="p-2 text-dust hover:text-espresso transition-colors"
                title="Configuración de Plantilla"
              >
                <Settings size={18} />
              </button>
            )}
            <button 
              onClick={handleLogout}
              className="px-3 lg:px-4 py-1.5 lg:py-2 text-[10px] lg:text-xs font-medium border border-red-200 text-red-600 rounded-lg hover:bg-red-50 transition-colors"
            >
              <span className="hidden sm:inline">Cerrar Sesión</span>
              <span className="sm:hidden">Salir</span>
            </button>
          </div>
        </header>

        <div className="flex-1 overflow-auto p-4 lg:p-8 relative">
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-cream/50 backdrop-blur-[2px] flex items-center justify-center">
              <div className="flex flex-col items-center gap-3">
                <div className="w-8 h-8 border-4 border-espresso border-t-transparent rounded-full animate-spin" />
                <p className="text-xs font-serif text-espresso animate-pulse">Sincronizando con Google Sheets...</p>
              </div>
            </div>
          )}
          {activeView === 'dashboard' && (
            <Dashboard 
              sales={sales} 
              products={products} 
              expenses={expenses} 
              cashLogs={cashLogs}
            />
          )}
          {activeView === 'gastos' && (
            <Expenses 
              expenses={expenses} 
              onAddExpense={handleAddExpense} 
              isLoading={isLoading} 
            />
          )}
          {activeView === 'ventas' && (
            <SalesPOS 
              products={products} 
              onAddSalesBatch={handleAddSalesBatch}
              sales={sales} 
              users={users}
              pendingAccounts={pendingAccounts.filter(a => a.status === 'Abierta')}
              activePendingAccount={activePendingAccount}
              onCancelPending={() => setActivePendingAccount(null)}
              onUpdatePendingAccount={handleUpdatePendingAccountItems}
              posCart={posCart}
              setPosCart={setPosCart}
              posCustomerName={posCustomerName}
              setPosCustomerName={setPosCustomerName}
            />
          )}
          {activeView === 'cuentas' && (
            <PendingAccounts 
              accounts={pendingAccounts.filter(a => a.status === 'Abierta')} 
              users={users}
              onDeleteAccount={handleDeletePendingAccount}
              onPayAccount={handlePayPendingAccount}
            />
          )}
          {activeView === 'registros' && (
            <SalesHistory 
              sales={sales} 
              expenses={expenses} 
              cashLogs={cashLogs} 
            />
          )}
          {activeView === 'registros_inventario' && <InventoryHistory movements={movements} />}
          {activeView === 'inventario' && (
            <Inventory 
              products={products} 
              onUpdateStock={handleUpdateStock} 
              onAddProduct={handleAddProduct}
            />
          )}
        </div>

        {/* Settings Modal */}
        <AnimatePresence>
          {showSettings && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm">
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden"
              >
                <div className="p-6 border-b border-mist">
                  <div className="flex items-center gap-2 mb-1">
                    <Settings className="text-bark" size={20} />
                    <h3 className="font-serif text-lg text-espresso">Conexión de Datos</h3>
                  </div>
                  <p className="text-[11px] text-dust leading-relaxed">
                    Personaliza el origen de tus datos vinculando una copia propia de Google Sheets para pruebas o respaldo.
                  </p>
                </div>
                <div className="p-6 space-y-5">
                  <div>
                    <label className="block text-[10px] font-bold text-dust uppercase tracking-wider mb-2 flex items-center justify-between">
                      <span>ID / URL de la Hoja de Cálculo</span>
                      <span className="text-[9px] font-normal text-bark cursor-help" title="Puedes pegar la URL completa de tu navegador">¿Dónde encuentro esto?</span>
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <input 
                          type="text"
                          placeholder="Pega la URL o el ID aquí..."
                          value={templateId}
                          onChange={(e) => {
                            setTemplateId(e.target.value);
                            setTestResult(null);
                          }}
                          className="w-full bg-cream border border-mist rounded-xl py-3 px-4 pr-10 text-sm outline-none focus:border-bark transition-all shadow-inner"
                        />
                        {templateId && (
                          <button 
                            onClick={() => {
                              setTemplateId('');
                              setTestResult(null);
                            }}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-dust hover:text-espresso"
                          >
                            ×
                          </button>
                        )}
                      </div>
                      <button 
                        onClick={testConnection}
                        disabled={!templateId || isTesting || !googleTokens}
                        className="px-4 bg-white border border-mist rounded-xl text-[10px] font-bold uppercase tracking-wider text-espresso hover:bg-parchment transition-all hover:shadow-sm disabled:opacity-50"
                      >
                        {isTesting ? '...' : 'Probar'}
                      </button>
                    </div>
                    {testResult && (
                      <p className={cn(
                        "text-[10px] mt-2 font-medium flex items-center gap-1.5",
                        testResult.success ? "text-green-600" : "text-red-500"
                      )}>
                        <span className={cn("w-1.5 h-1.5 rounded-full", testResult.success ? "bg-green-500" : "bg-red-500")} />
                        {testResult.message}
                      </p>
                    )}
                    <div className="mt-4 p-3 bg-parchment/30 rounded-xl border border-mist/20">
                      <p className="text-[10px] text-espresso font-medium mb-1">💡 Consejos para trabajar con copias:</p>
                      <ul className="text-[9px] text-dust space-y-1 ml-2 list-disc">
                        <li>Haz una copia en tu Google Drive (**Archivo &gt; Hacer una copia**)</li>
                        <li>Pega la URL de esa copia arriba para no afectar la base original.</li>
                        <li>Asegúrate de que la hoja tenga las mismas pestañas (Inventario, Ventas, etc).</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-cream flex justify-end gap-3">
                  <button 
                    onClick={() => setShowSettings(false)}
                    className="px-4 py-2 text-xs font-medium text-dust hover:text-espresso transition-colors"
                  >
                    Cancelar
                  </button>
                  <button 
                    onClick={() => saveTemplateId(templateId)}
                    className="px-6 py-2 text-xs font-medium bg-espresso text-cream rounded-lg hover:bg-bark transition-colors"
                  >
                    Guardar Configuración
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
