import React from 'react';
import {
  ActivityIndicator, KeyboardAvoidingView, Platform, Pressable, ScrollView,
  StyleSheet, Text, TextInput, TextInputProps, View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { theme as c } from '../theme';
import { Lang, useI18n } from '../i18n';

export function Screen({ children }: { children: React.ReactNode }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: c.bg }}>
      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <ScrollView contentContainerStyle={s.scroll} keyboardShouldPersistTaps="handled">{children}</ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export function Button({ title, onPress, variant = 'primary', loading, disabled }: {
  title: string; onPress: () => void; variant?: 'primary' | 'outline'; loading?: boolean; disabled?: boolean;
}) {
  const primary = variant === 'primary';
  return (
    <Pressable
      onPress={onPress} disabled={loading || disabled}
      style={({ pressed }) => [
        s.btn,
        primary ? { backgroundColor: c.primary } : { borderWidth: 1.5, borderColor: c.border, backgroundColor: c.surface },
        (pressed || disabled) && { opacity: 0.7 },
      ]}
    >
      {loading ? <ActivityIndicator color={primary ? c.onPrimary : c.primary} /> :
        <Text style={[s.btnText, { color: primary ? c.onPrimary : c.text }]}>{title}</Text>}
    </Pressable>
  );
}

export function Field({ label, error, ...props }: { label: string; error?: string } & TextInputProps) {
  return (
    <View style={{ marginBottom: 16 }}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={c.muted}
        style={[s.input, error ? { borderColor: c.danger } : null]}
        autoCapitalize="none" autoCorrect={false}
        {...props}
      />
      {!!error && <Text style={s.error}>{error}</Text>}
    </View>
  );
}

export function Segmented<T extends string>({ options, value, onChange }: {
  options: { value: T; label: string }[]; value: T; onChange: (v: T) => void;
}) {
  return (
    <View style={s.seg}>
      {options.map((o) => {
        const on = o.value === value;
        return (
          <Pressable key={o.value} onPress={() => onChange(o.value)}
            style={[s.segItem, on && { backgroundColor: c.primary }]}>
            <Text style={{ color: on ? c.onPrimary : c.muted, fontWeight: '600', fontSize: 14 }}>{o.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export function Choice({ title, hint, selected, onPress }: { title: string; hint?: string; selected: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.choice, selected && { borderColor: c.primary, borderWidth: 2 }]}>
      <View style={[s.radio, selected && { borderColor: c.primary }]}>
        {selected && <View style={s.radioDot} />}
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: c.text, fontWeight: '600', fontSize: 15 }}>{title}</Text>
        {!!hint && <Text style={{ color: c.muted, fontSize: 13, marginTop: 2 }}>{hint}</Text>}
      </View>
    </Pressable>
  );
}

export function LangSwitch() {
  const { lang, setLang } = useI18n();
  const langs: Lang[] = ['en', 'ru', 'kk'];
  return (
    <View style={{ flexDirection: 'row', gap: 6, alignSelf: 'flex-end' }}>
      {langs.map((l) => (
        <Pressable key={l} onPress={() => setLang(l)}
          style={[s.lang, lang === l && { backgroundColor: c.text }]}>
          <Text style={{ color: lang === l ? c.bg : c.muted, fontWeight: '700', fontSize: 12 }}>{l.toUpperCase()}</Text>
        </Pressable>
      ))}
    </View>
  );
}

export function Brand() {
  const { t } = useI18n();
  return (
    <View style={{ marginTop: 28, marginBottom: 28 }}>
      <View style={s.logo}><Text style={{ color: c.onPrimary, fontSize: 22, fontWeight: '800' }}>GT</Text></View>
      <Text style={{ color: c.text, fontSize: 28, fontWeight: '800', marginTop: 16 }}>Green Titans</Text>
      <Text style={{ color: c.muted, fontSize: 15, marginTop: 4 }}>{t('tagline')}</Text>
    </View>
  );
}

const s = StyleSheet.create({
  scroll: { padding: 22, paddingBottom: 40 },
  btn: { height: 54, borderRadius: c.radius, alignItems: 'center', justifyContent: 'center', marginTop: 6 },
  btnText: { fontSize: 16, fontWeight: '700' },
  label: { color: c.muted, fontSize: 13, fontWeight: '600', marginBottom: 6 },
  input: {
    height: 52, borderRadius: c.radius, borderWidth: 1.5, borderColor: c.border,
    backgroundColor: c.surface, paddingHorizontal: 14, fontSize: 16, color: c.text,
  },
  error: { color: c.danger, fontSize: 13, marginTop: 5 },
  seg: { flexDirection: 'row', backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 4, marginBottom: 22 },
  segItem: { flex: 1, height: 40, borderRadius: c.radius - 4, alignItems: 'center', justifyContent: 'center' },
  choice: {
    flexDirection: 'row', alignItems: 'center', gap: 12, padding: 14, borderRadius: c.radius,
    borderWidth: 1, borderColor: c.border, backgroundColor: c.surface, marginBottom: 10,
  },
  radio: { width: 20, height: 20, borderRadius: 10, borderWidth: 2, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  radioDot: { width: 10, height: 10, borderRadius: 5, backgroundColor: c.primary },
  lang: { paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 },
  logo: { width: 52, height: 52, borderRadius: c.radius, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' },
});
