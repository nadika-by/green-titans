import { useEffect, useRef } from 'react';
import { Animated, Text, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { Screen } from '../../src/components/ui';
import { STATIONS } from '../../src/data/stations';
import { useI18n } from '../../src/i18n';
import { theme as c } from '../../src/theme';

// Simplified / stylized outline of Kazakhstan for presentation purposes —
// not a precise geographic projection. Swap for real boundary data later if needed.
const KZ_OUTLINE =
  'M 12,30 L 20,18 L 32,14 L 45,10 L 58,8 L 70,12 L 82,14 L 90,22 L 94,32 ' +
  'L 92,42 L 96,50 L 90,60 L 84,66 L 78,78 L 70,88 L 60,92 L 50,90 L 42,84 ' +
  'L 34,80 L 26,74 L 18,66 L 14,56 L 10,46 L 8,38 Z';

export default function Network() {
  const { t } = useI18n();
  const liveStations = STATIONS.filter((s) => s.launched);

  return (
    <Screen>
      <Text style={{ color: c.text, fontSize: 24, fontWeight: '800', marginTop: 12, marginBottom: 4 }}>{t('network')}</Text>
      <Text style={{ color: c.muted, marginBottom: 18 }}>
        {t('stationsLive', { n: liveStations.length, total: STATIONS.length })}
      </Text>

      <View style={{ aspectRatio: 1, backgroundColor: c.surface, borderRadius: c.radius, borderWidth: 1, borderColor: c.border, padding: 10 }}>
        <Svg viewBox="0 0 100 100" width="100%" height="100%" style={{ position: 'absolute', left: 10, top: 10, right: 10, bottom: 10 }}>
          <Path d={KZ_OUTLINE} fill={c.bg} stroke={c.border} strokeWidth={1.2} />
        </Svg>

        {liveStations.map((s) => (
          <AnimatedPin key={s.id} x={s.x} y={s.y} name={s.name} />
        ))}
      </View>
    </Screen>
  );
}

// Pins fade + scale in once on mount. Since liveStations comes straight from
// the data file, a city "opening" just means its entry flips to launched:true
// and it will animate in the next time this screen renders.
function AnimatedPin({ x, y, name }: { x: number; y: number; name: string }) {
  const anim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(anim, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  }, []);

  return (
    <Animated.View
      style={{
        position: 'absolute',
        left: `${x}%`, top: `${y}%`,
        transform: [{ translateX: -10 }, { translateY: -10 }, { scale: anim }],
        alignItems: 'center',
      }}
    >
      <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: c.primary, borderWidth: 2, borderColor: c.surface }} />
      <Text style={{ color: c.text, fontSize: 10, fontWeight: '700', marginTop: 2 }}>{name}</Text>
    </Animated.View>
  );
}
