import { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Button, Field, Screen } from '../../src/components/ui';
import { PARTNER_CATEGORIES, PartnerCategory } from '../../src/data/partners';
import { useWallet } from '../../src/wallet/WalletContext';
import { useI18n } from '../../src/i18n';
import { theme as c } from '../../src/theme';

export default function Partners() {
  const { t } = useI18n();
  const [selected, setSelected] = useState<PartnerCategory | null>(null);

  return (
    <Screen>
      <Text style={{ color: c.text, fontSize: 24, fontWeight: '800', marginTop: 12, marginBottom: 18 }}>{t('partners')}</Text>

      {!selected ? (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
          {PARTNER_CATEGORIES.map((cat) => (
            <Pressable key={cat.id} onPress={() => setSelected(cat)}
              style={{ width: '47%', backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 16, gap: 10 }}>
              <View style={{ width: 44, height: 44, borderRadius: 12, backgroundColor: c.bg, alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons name={cat.icon as any} size={22} color={c.primary} />
              </View>
              <Text style={{ color: c.text, fontWeight: '600', fontSize: 14 }}>{t(cat.titleKey)}</Text>
            </Pressable>
          ))}
        </View>
      ) : (
        <PaymentForm category={selected} onBack={() => setSelected(null)} />
      )}
    </Screen>
  );
}

function PaymentForm({ category, onBack }: { category: PartnerCategory; onBack: () => void }) {
  const { t } = useI18n();
  const { pay } = useWallet();
  const [account, setAccount] = useState('');
  const [busy, setBusy] = useState(false);
  const [result, setResult] = useState<{ ok: boolean; receipt?: string } | null>(null);

  // Mock invoice amount: derived from the account number so it's stable per input, no backend yet.
  const tokenCost = account.trim() ? 20 + (account.trim().length * 7) % 180 : 0;

  const submit = async () => {
    setBusy(true);
    const ok = await pay(tokenCost, `${t(category.titleKey)} · ${account}`);
    setBusy(false);
    setResult({ ok, receipt: ok ? 'GT' + Math.floor(100000 + Math.random() * 900000) : undefined });
  };

  if (result) {
    return (
      <View style={{ backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 20, gap: 10 }}>
        <Ionicons name={result.ok ? 'checkmark-circle' : 'close-circle'} size={40} color={result.ok ? c.primary : c.danger} />
        <Text style={{ color: c.text, fontWeight: '700', fontSize: 17 }}>
          {result.ok ? t('paymentSuccess') : t('insufficientBalance')}
        </Text>
        {result.ok && <Text style={{ color: c.muted }}>{t('receiptCode')}: {result.receipt}</Text>}
        <Button title={t('backToPartners')} variant="outline" onPress={onBack} />
      </View>
    );
  }

  return (
    <View style={{ backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 18 }}>
      <Text style={{ color: c.text, fontWeight: '700', fontSize: 16, marginBottom: 14 }}>{t(category.titleKey)}</Text>
      <Field label={t('accountNumber')} value={account} onChangeText={setAccount} />
      {!!account.trim() && (
        <Text style={{ color: c.muted, marginBottom: 12 }}>{t('amountDue')}: <Text style={{ color: c.accent, fontWeight: '700' }}>{tokenCost} {t('tokens')}</Text></Text>
      )}
      <Button title={t('payWithTokens')} onPress={submit} loading={busy} disabled={!account.trim()} />
      <Button title={t('backToPartners')} variant="outline" onPress={onBack} disabled={busy} />
    </View>
  );
}
