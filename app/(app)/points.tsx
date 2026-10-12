import { useRef, useState, useMemo, useEffect } from 'react';
import {
  Animated, Linking, PanResponder, Pressable, StyleSheet, Text, View,
} from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button } from '../../src/components/ui';
import { useAuth } from '../../src/auth/AuthContext';
import { useRouter } from 'expo-router';
import { useI18n } from '../../src/i18n';
import { theme as c } from '../../src/theme';
import { CollectionPoint, MOCK_POINTS } from '../../src/data/points';

const KAZAKHSTAN: Region = { latitude: 48.0196, longitude: 66.9237, latitudeDelta: 14, longitudeDelta: 14 };
type Filter = 'all' | 'open' | 'closed';

const statusColor = (status: CollectionPoint['status']) =>
  status === 'open' ? c.primary : status === 'break' ? c.accent : c.muted;

const PEEK_HEIGHT = 34; // how much of the sheet stays visible when collapsed

export default function Home() {
  const { t } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [filter, setFilter] = useState<Filter>('all');
  const [selected, setSelected] = useState<CollectionPoint>(MOCK_POINTS[0]);

  const points = useMemo(() => {
    if (filter === 'open') return MOCK_POINTS.filter((p) => p.status !== 'closed');
    if (filter === 'closed') return MOCK_POINTS.filter((p) => p.status === 'closed');
    return MOCK_POINTS;
  }, [filter]);

  const openDirections = () => {
    const url = `https://maps.google.com/?q=${selected.latitude},${selected.longitude}`;
    Linking.openURL(url);
  };

  if (!user) return null;

  return (
    <View style={{ flex: 1, backgroundColor: c.bg }}>
      <MapView style={StyleSheet.absoluteFill} initialRegion={KAZAKHSTAN}>
        {points.map((p) => (
          <Marker
            key={p.id}
            coordinate={{ latitude: p.latitude, longitude: p.longitude }}
            pinColor={statusColor(p.status)}
            onPress={() => setSelected(p)}
          />
        ))}
      </MapView>

      <View style={s.chrome} pointerEvents="box-none">
        <SafeAreaView edges={['top']} style={s.topRow}>
          <View style={s.pill}>
            <Text style={s.pillText} numberOfLines={1}>{user.name}</Text>
          </View>
          <Pressable style={s.iconBtn} onPress={() => router.push('/settings')}>
            <Text style={{ color: c.text, fontWeight: '700', fontSize: 16 }}>⚙</Text>
          </Pressable>
        </SafeAreaView>

        <View style={s.filterRow}>
          <Chip label={t('filterOpen')} on={filter === 'open'} onPress={() => setFilter(filter === 'open' ? 'all' : 'open')} />
          <Chip label={t('filterClosed')} on={filter === 'closed'} onPress={() => setFilter(filter === 'closed' ? 'all' : 'closed')} />
          <Chip label={t('filterAll')} on={filter === 'all'} onPress={() => setFilter('all')} />
        </View>
      </View>

      <SwipeSheet expandKey={selected.id}>
        <Text style={s.name}>{selected.name}</Text>
        <Text style={s.addr}>{selected.address}{selected.landmark ? ` · ${selected.landmark}` : ''}</Text>

        <View style={s.statusRow}>
          <View style={[s.dot, { backgroundColor: statusColor(selected.status) }]} />
          <Text style={[s.statusText, { color: statusColor(selected.status) }]}>
            {t(selected.status === 'open' ? 'statusOpen' : selected.status === 'break' ? 'statusBreak' : 'statusClosed')} · {selected.hours}
          </Text>
        </View>

        <View style={s.tariffBlock}>
          <Text style={s.tariffTitle}>{t('tariffs')}</Text>
          {selected.fractions.map((f, i) => (
            <View key={f.name} style={[s.tariffRow, i > 0 && s.tariffBorder]}>
              <Text style={s.tariffName}>{f.name}</Text>
              <Text style={s.tariffPrice}>{f.price} ₸/{f.unit}</Text>
            </View>
          ))}
        </View>

        <Button title={`${t('getDirections')} →`} onPress={openDirections} />
      </SwipeSheet>
    </View>
  );
}

/**
 * Draggable bottom sheet. Drag the handle (or anywhere in the sheet) down to
 * collapse it and see the full map; drag up to bring it back. Tapping the
 * handle also toggles it, as a reliable fallback if the drag gesture
 * doesn't register on a given device.
 */
function SwipeSheet({ expandKey, children }: { expandKey: string; children: React.ReactNode }) {
  const [sheetHeight, setSheetHeight] = useState(500); // reasonable default before first measure
  const [open, setOpen] = useState(true);
  const translateY = useRef(new Animated.Value(0)).current;
  const collapsedY = Math.max(sheetHeight - PEEK_HEIGHT, 0);

  const animateTo = (toOpen: boolean) => {
    setOpen(toOpen);
    Animated.spring(translateY, { toValue: toOpen ? 0 : collapsedY, useNativeDriver: true, friction: 9, tension: 60 }).start();
  };

  // A newly selected point should always bring the sheet back open.
  useEffect(() => { animateTo(true); }, [expandKey]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_, g) => Math.abs(g.dy) > 8 && Math.abs(g.dy) > Math.abs(g.dx),
      onPanResponderGrant: () => {
        translateY.stopAnimation();
        translateY.setOffset(open ? 0 : collapsedY);
        translateY.setValue(0);
      },
      onPanResponderMove: (_, g) => {
        const clamped = Math.min(Math.max(g.dy, open ? 0 : -collapsedY), open ? collapsedY : 0);
        translateY.setValue(clamped);
      },
      onPanResponderRelease: (_, g) => {
        translateY.flattenOffset();
        const movedDown = g.dy > 50 || g.vy > 0.6;
        const movedUp = g.dy < -50 || g.vy < -0.6;
        if (open && movedDown) animateTo(false);
        else if (!open && movedUp) animateTo(true);
        else animateTo(open); // snap back to where it was
      },
    })
  ).current;

  return (
    <Animated.View
      onLayout={(e) => setSheetHeight(e.nativeEvent.layout.height)}
      style={[s.sheet, { transform: [{ translateY }] }]}
    >
      <View {...panResponder.panHandlers} style={s.dragZone}>
        <Pressable onPress={() => animateTo(!open)} hitSlop={16}>
          <View style={s.handle} />
        </Pressable>
      </View>
      {children}
    </Animated.View>
  );
}

function Chip({ label, on, onPress }: { label: string; on: boolean; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, on && { backgroundColor: c.primary, borderColor: c.primary }]}>
      <Text numberOfLines={1} style={{ color: on ? c.onPrimary : c.muted, fontWeight: '600', fontSize: 13 }}>{label}</Text>
    </Pressable>
  );
}

const s = StyleSheet.create({
  chrome: { ...StyleSheet.absoluteFillObject, zIndex: 10 },
  topRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, paddingTop: 8 },
  pill: { flex: 1, backgroundColor: c.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 10, borderWidth: 1, borderColor: c.border, justifyContent: 'center' },
  pillText: { color: c.text, fontWeight: '700' },
  iconBtn: { width: 40, height: 40, borderRadius: 12, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border, alignItems: 'center', justifyContent: 'center' },
  filterRow: { flexDirection: 'row', gap: 8, paddingHorizontal: 14, marginTop: 10 },
  chip: { flexShrink: 1, paddingHorizontal: 13, paddingVertical: 8, borderRadius: 20, backgroundColor: c.surface, borderWidth: 1, borderColor: c.border },
  sheet: {
    position: 'absolute', left: 0, right: 0, bottom: 0, backgroundColor: c.surface,
    borderTopLeftRadius: 24, borderTopRightRadius: 24, paddingHorizontal: 20, paddingBottom: 34,
    shadowColor: '#000', shadowOpacity: 0.15, shadowRadius: 16, shadowOffset: { width: 0, height: -4 }, elevation: 12,
  },
  dragZone: { paddingTop: 10, paddingBottom: 12, alignItems: 'center' },
  handle: { width: 36, height: 4, borderRadius: 3, backgroundColor: c.border },
  name: { color: c.text, fontWeight: '700', fontSize: 18, marginBottom: 3 },
  addr: { color: c.muted, fontSize: 13, marginBottom: 14, lineHeight: 18 },
  statusRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 16 },
  dot: { width: 8, height: 8, borderRadius: 4 },
  statusText: { fontWeight: '600', fontSize: 13 },
  tariffBlock: { backgroundColor: c.bg, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 14, marginBottom: 14 },
  tariffTitle: { color: c.muted, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  tariffRow: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8 },
  tariffBorder: { borderTopWidth: 1, borderTopColor: c.border },
  tariffName: { color: c.text, fontSize: 14, flexShrink: 1, paddingRight: 10 },
  tariffPrice: { color: c.accent, fontWeight: '600', fontSize: 14 },
});
