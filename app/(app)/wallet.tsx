import { useState } from 'react';
import { Text, View } from 'react-native';
import { Button, Field, Screen } from '../../src/components/ui';
import { useWallet, Transaction } from '../../src/wallet/WalletContext';
import { useI18n } from '../../src/i18n';
import { theme as c } from '../../src/theme';

export default function Wallet() {
  const { t } = useI18n();
  const { balance, transactions, transfer } = useWallet();
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setMsg(null);
    const amt = Number(amount);
    if (!recipient.trim() || !amt || amt <= 0) return;
    setBusy(true);
    const ok = await transfer(recipient.trim().toUpperCase(), amt);
    setBusy(false);
    if (ok) { setMsg(t('transferSuccess')); setRecipient(''); setAmount(''); }
    else setMsg(t('insufficientBalance'));
  };

  return (
    <Screen>
      <Text style={{ color: c.muted, marginTop: 12, fontSize: 13, fontWeight: '600' }}>{t('balance')}</Text>
      <Text style={{ color: c.text, fontSize: 40, fontWeight: '800', marginBottom: 24 }}>
        {balance.toLocaleString()} <Text style={{ fontSize: 18, color: c.muted }}>{t('tokens')}</Text>
      </Text>

      <View style={{ backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 16, marginBottom: 24 }}>
        <Text style={{ color: c.text, fontWeight: '700', marginBottom: 12 }}>{t('sendTokens')}</Text>
        <Field label={t('recipientId')} value={recipient} onChangeText={setRecipient} autoCapitalize="characters" placeholder="GT-00000000" />
        <Field label={t('amount')} value={amount} onChangeText={(v) => setAmount(v.replace(/\D/g, ''))} keyboardType="number-pad" placeholder="0" />
        {msg && <Text style={{ color: msg === t('transferSuccess') ? c.primary : c.danger, marginBottom: 10 }}>{msg}</Text>}
        <Button title={t('send')} onPress={submit} loading={busy} />
      </View>

      <Text style={{ color: c.text, fontWeight: '700', marginBottom: 10 }}>{t('recentActivity')}</Text>
      {transactions.length === 0 && <Text style={{ color: c.muted }}>{t('noActivity')}</Text>}
      {transactions.map((tx) => <TxRow key={tx.id} tx={tx} />)}
    </Screen>
  );
}

function TxRow({ tx }: { tx: Transaction }) {
  const positive = tx.type === 'earn' || tx.type === 'transfer_in';
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: c.border }}>
      <View>
        <Text style={{ color: c.text, fontWeight: '600' }}>{tx.note}</Text>
        <Text style={{ color: c.muted, fontSize: 12, marginTop: 2 }}>{new Date(tx.date).toLocaleDateString()}</Text>
      </View>
      <Text style={{ color: positive ? c.primary : c.text, fontWeight: '700' }}>
        {positive ? '+' : '−'}{tx.amount.toLocaleString()}
      </Text>
    </View>
  );
}
