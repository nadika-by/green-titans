import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme as c } from '../../src/theme';
import { useI18n } from '../../src/i18n';

export default function AppTabs() {
  const { t } = useI18n();
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: c.primary,
        tabBarInactiveTintColor: c.muted,
        tabBarStyle: { backgroundColor: c.surface, borderTopColor: c.border, height: 84, paddingTop: 8 },
        tabBarLabelStyle: { fontSize: 11, fontWeight: '600' },
      }}
    >
      <Tabs.Screen name="index" options={{ title: t('network'), tabBarIcon: ({ color, size }) => <Ionicons name="git-network-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="points" options={{ title: t('map'), tabBarIcon: ({ color, size }) => <Ionicons name="map-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="wallet" options={{ title: t('wallet'), tabBarIcon: ({ color, size }) => <Ionicons name="wallet-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="partners" options={{ title: t('partners'), tabBarIcon: ({ color, size }) => <Ionicons name="storefront-outline" size={size} color={color} /> }} />
      <Tabs.Screen name="settings" options={{ title: t('settings'), tabBarIcon: ({ color, size }) => <Ionicons name="settings-outline" size={size} color={color} /> }} />
    </Tabs>
  );
}
