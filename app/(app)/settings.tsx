import { Text, View } from 'react-native';
import { Button, LangSwitch, Screen } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthContext';
import { useI18n } from '../../src/i18n';
import { theme as c } from '../../src/theme';

export default function Settings() {
  const { t } = useI18n();
  const { user, signOut } = useAuth();
  if (!user) return null;

  return (
    <Screen>
      <Text style={{ color: c.text, fontSize: 24, fontWeight: '800', marginTop: 0, marginBottom: 0 }}>{t('settings')}</Text>

      <Text style={{ color: c.muted, fontWeight: '600', fontSize: 13, marginBottom: 8 }}>{t('language')}</Text>
      <LangSwitch />

      <Text style={{ color: c.muted, fontWeight: '600', fontSize: 13, marginTop: 26, marginBottom: 10 }}>{t('account')}</Text>
      <View style={{ backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 16 }}>
        <Row label={t('systemIdLabel')} value={user.systemId} />
        <Row label={t('accountTypeLabel')} value={t(user.type as any)} />
        <Row label={t('fullName')} value={user.name} last />
      </View>

      <View style={{ height: 26 }} />
      <Button title={t('logout')} variant="outline" onPress={signOut} />

      <Text style={{ color: c.muted, fontSize: 12, textAlign: 'center', marginTop: 30 }}>Green Titans · {t('version')} 0.1.0</Text>
    </Screen>
  );
}

function Row({ label, value, last }: { label: string; value: string; last?: boolean }) {
  return (
    <View style={{ paddingVertical: 10, borderBottomWidth: last ? 0 : 1, borderBottomColor: c.border }}>
      <Text style={{ color: c.muted, fontSize: 12 }}>{label}</Text>
      <Text style={{ color: c.text, fontWeight: '600', fontSize: 15, marginTop: 2 }}>{value}</Text>
    </View>
  );
}
