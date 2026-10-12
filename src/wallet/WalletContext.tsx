import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../auth/AuthContext';

export type Transaction = {
  id: string;
  type: 'earn' | 'transfer_out' | 'transfer_in' | 'payment';
  amount: number;
  note: string;
  date: number;
};

const STARTING_BALANCE = 5000; // demo seed, tokens

type Ctx = {
  balance: number;
  transactions: Transaction[];
  ready: boolean;
  pay: (amount: number, note: string) => Promise<boolean>;         // returns false if insufficient funds
  transfer: (toSystemId: string, amount: number) => Promise<boolean>;
};
const WalletContext = createContext<Ctx>(null as unknown as Ctx);

export function WalletProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [balance, setBalance] = useState(0);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ready, setReady] = useState(false);

  const key = user ? `gt_wallet_${user.id}` : null;

  useEffect(() => {
    if (!key) { setBalance(0); setTransactions([]); setReady(false); return; }
    (async () => {
      const raw = await AsyncStorage.getItem(key);
      if (raw) {
        const parsed = JSON.parse(raw);
        setBalance(parsed.balance);
        setTransactions(parsed.transactions);
      } else {
        const seedTx: Transaction = { id: 'seed', type: 'earn', amount: STARTING_BALANCE, note: 'Welcome bonus', date: Date.now() };
        setBalance(STARTING_BALANCE);
        setTransactions([seedTx]);
        await AsyncStorage.setItem(key, JSON.stringify({ balance: STARTING_BALANCE, transactions: [seedTx] }));
      }
      setReady(true);
    })();
  }, [key]);

  const persist = async (nextBalance: number, nextTx: Transaction[]) => {
    setBalance(nextBalance);
    setTransactions(nextTx);
    if (key) await AsyncStorage.setItem(key, JSON.stringify({ balance: nextBalance, transactions: nextTx }));
  };

  const value: Ctx = {
    balance, transactions, ready,
    async pay(amount, note) {
      if (amount > balance) return false;
      const tx: Transaction = { id: String(Date.now()), type: 'payment', amount, note, date: Date.now() };
      await persist(balance - amount, [tx, ...transactions]);
      return true;
    },
    async transfer(toSystemId, amount) {
      if (amount > balance) return false;
      const tx: Transaction = { id: String(Date.now()), type: 'transfer_out', amount, note: `To ${toSystemId}`, date: Date.now() };
      await persist(balance - amount, [tx, ...transactions]);
      return true;
    },
  };
  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}
export const useWallet = () => useContext(WalletContext);
