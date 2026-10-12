import { useEffect } from 'react';
import { Slot, useRouter, useSegments } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from '../src/auth/AuthContext';
import { WalletProvider } from '../src/wallet/WalletContext';
import { I18nProvider } from '../src/i18n';
import { theme } from '../src/theme';

function Gate() {
  const { user, ready } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (!ready) return;
    const inAuth = segments[0] === '(auth)';
    if (!user && !inAuth) router.replace('/login');
    else if (user && inAuth) router.replace('/');
  }, [user, ready, segments]);

  return <Slot />;
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <I18nProvider>
        <AuthProvider>
          <WalletProvider>
            <StatusBar style={theme.dark ? 'light' : 'dark'} />
            <Gate />
          </WalletProvider>
        </AuthProvider>
      </I18nProvider>
    </SafeAreaProvider>
  );
}
