import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Brand, Button, Field, LangSwitch, Screen, Segmented } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthContext';
import { TKey, useI18n } from '../../src/i18n';
import { isValidIinBin } from '../../src/validation';
import { theme as c } from '../../src/theme';

export default function Login() {
  const { t } = useI18n();
  const { signInStandard, signInTemporary } = useAuth();
  const [mode, setMode] = useState<'standard' | 'temporary'>('standard');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [systemId, setSystemId] = useState('');
  const [error, setError] = useState<TKey | null>(null);
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    setError(null);
    setBusy(true);
    const res = mode === 'standard'
      ? (isValidIinBin(identifier) ? await signInStandard(identifier, password) : { ok: false as const, error: 'errCreds' as const })
      : await signInTemporary(systemId);
    setBusy(false);
    if (!res.ok) setError(res.error);
    // on success the auth gate in _layout redirects to the app
  };

  return (
    <Screen>
      <LangSwitch />
      <Brand />
      <Segmented
        value={mode} onChange={(m) => { setMode(m); setError(null); }}
        options={[{ value: 'standard', label: t('standard') }, { value: 'temporary', label: t('temporary') }]}
      />

      {mode === 'standard' ? (
        <>
          <Field label={t('iinBin')} value={identifier} onChangeText={(v) => setIdentifier(v.replace(/\D/g, '').slice(0, 12))}
            keyboardType="number-pad" placeholder="000000000000" />
          <Field label={t('password')} value={password} onChangeText={setPassword} secureTextEntry />
        </>
      ) : (
        <Field label={t('systemId')} value={systemId} onChangeText={setSystemId} autoCapitalize="characters" placeholder="GT-00000000" />
      )}

      {error && <Text style={{ color: c.danger, marginBottom: 12 }}>{t(error)}</Text>}

      <Button
        title={mode === 'standard' ? t('login') : t('scanFingerprint')}
        onPress={submit} loading={busy}
      />
      {mode === 'standard' && (
        <Button title={t('egovLogin')} variant="outline" onPress={() => { /* TODO: eGov Mobile / Digital ID deep link */ }} />
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 }}>
        <Text style={{ color: c.muted }}>{t('noAccount')}</Text>
        <Link href="/signup" style={{ color: c.primary, fontWeight: '700' }}>{t('signup')}</Link>
      </View>
    </Screen>
  );
}
