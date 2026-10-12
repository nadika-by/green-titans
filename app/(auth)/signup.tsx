import { useState } from 'react';
import { Text, View } from 'react-native';
import { Link } from 'expo-router';
import { Button, Choice, Field, LangSwitch, Screen } from '../../src/components/ui';
import { AccountType, useAuth } from '../../src/auth/AuthContext';
import { TKey, useI18n } from '../../src/i18n';
import { isValidIinBin } from '../../src/validation';
import { theme as c } from '../../src/theme';

const TYPES: AccountType[] = ['individual', 'government', 'business', 'ngo'];

export default function Signup() {
  const { t } = useI18n();
  const { signUpStandard, signUpTemporary } = useAuth();

  const [step, setStep] = useState<1 | 2>(1);
  const [type, setType] = useState<AccountType>('individual');
  const [method, setMethod] = useState<'standard' | 'temporary'>('standard');
  const [identifier, setIdentifier] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Partial<Record<'id' | 'name' | 'pw' | 'form', string>>>({});
  const [busy, setBusy] = useState(false);

  const isPerson = type === 'individual';
  const idLabel = t(isPerson ? 'iin' : 'bin');
  const temporaryAllowed = isPerson; // temporary mode is for individuals only

  const pickType = (v: AccountType) => {
    setType(v);
    if (v !== 'individual') setMethod('standard');
  };

  const submit = async () => {
    const e: typeof errors = {};
    if (!name.trim()) e.name = t('errName');
    if (method === 'standard') {
      if (!isValidIinBin(identifier)) e.id = t('errId', { label: idLabel });
      if (password.length < 8) e.pw = t('errPassword');
    }
    setErrors(e);
    if (Object.keys(e).length) return;

    setBusy(true);
    const res = method === 'standard'
      ? await signUpStandard({ type, identifier, name: name.trim(), password })
      : await signUpTemporary({ name: name.trim() });
    setBusy(false);
    if (!res.ok) setErrors({ form: t(res.error as TKey) });
    // on success the auth gate redirects to the app
  };

  return (
    <Screen>
      <LangSwitch />
      <Text style={{ color: c.text, fontSize: 26, fontWeight: '800', marginTop: 20, marginBottom: 20 }}>{t('signup')}</Text>

      {step === 1 && (
        <>
          <Text style={{ color: c.muted, fontWeight: '600', marginBottom: 10 }}>{t('accountType')}</Text>
          {TYPES.map((v) => <Choice key={v} title={t(v)} selected={type === v} onPress={() => pickType(v)} />)}

          {temporaryAllowed && (
            <>
              <Text style={{ color: c.muted, fontWeight: '600', marginTop: 14, marginBottom: 10 }}>{t('regMethod')}</Text>
              <Choice title={t('methodStandard')} hint={t('methodStandardHint')} selected={method === 'standard'} onPress={() => setMethod('standard')} />
              <Choice title={t('methodTemp')} hint={t('methodTempHint')} selected={method === 'temporary'} onPress={() => setMethod('temporary')} />
            </>
          )}
          <View style={{ height: 8 }} />
          <Button title={t('next')} onPress={() => setStep(2)} />
        </>
      )}

      {step === 2 && (
        <>
          <Field label={t(isPerson ? 'fullName' : 'orgName')} value={name} onChangeText={setName}
            autoCapitalize="words" error={errors.name} />
          {method === 'standard' && (
            <>
              <Field label={idLabel} value={identifier} onChangeText={(v) => setIdentifier(v.replace(/\D/g, '').slice(0, 12))}
                keyboardType="number-pad" placeholder="000000000000" error={errors.id} />
              <Field label={t('password')} value={password} onChangeText={setPassword} secureTextEntry error={errors.pw} />
            </>
          )}
          {errors.form && <Text style={{ color: c.danger, marginBottom: 12 }}>{errors.form}</Text>}

          <Button
            title={busy && method === 'standard' ? t('verifying') : method === 'temporary' ? t('scanFingerprint') : t('createAccount')}
            onPress={submit} loading={busy}
          />
          <Button title={t('back')} variant="outline" onPress={() => setStep(1)} disabled={busy} />
        </>
      )}

      <View style={{ flexDirection: 'row', justifyContent: 'center', gap: 6, marginTop: 24 }}>
        <Text style={{ color: c.muted }}>{t('haveAccount')}</Text>
        <Link href="/login" style={{ color: c.primary, fontWeight: '700' }}>{t('login')}</Link>
      </View>
    </Screen>
  );
}
