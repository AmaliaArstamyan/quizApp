import { useEffect, useState } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { colors, spacing, typography, radius, shadows } from '../../lib/theme';
import { Screen } from '../../components/Screen';
import { GradientButton } from '../../components/GradientButton';

export default function Result() {
  const params = useLocalSearchParams<{ id: string; resultId: string }>();
  const id = params.id?.replace(/-result$/, '') ?? '';
  const resultId = params.resultId;

  const [result, setResult] = useState<any>(null);
  const [test, setTest] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: r } = await supabase
        .from('results')
        .select('*')
        .eq('id', resultId)
        .single();
      const { data: t } = await supabase
        .from('tests')
        .select('*')
        .eq('id', id)
        .single();
      setResult(r);
      setTest(t);
      setLoading(false);
    })();
  }, [id, resultId]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  if (!result || !test) {
    return (
      <Screen>
        <View style={styles.center}>
          <Text style={styles.errorText}>Չհաջողվեց բեռնել արդյունքը</Text>
          <GradientButton
            title="Վերադառնալ"
            onPress={() => router.replace('/(tabs)')}
          />
        </View>
      </Screen>
    );
  }

  const percent = Math.round((result.score / result.total) * 100);
  const emoji = percent >= 80 ? '🏆' : percent >= 50 ? '👍' : '📚';
  const message =
    percent >= 80
      ? 'Գերազանց արդյունք'
      : percent >= 50
      ? 'Լավ արդյունք'
      : 'Պետք է ավելի շատ սովորել';

  return (
    <Screen>
      <View style={styles.container}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6', '#A855F7']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroCard}
        >
          <Text style={styles.emoji}>{emoji}</Text>
          <Text style={styles.percent}>{percent}%</Text>
          <Text style={styles.message}>{message}</Text>
          <Text style={styles.testTitle}>{test.title}</Text>
        </LinearGradient>

        <View style={styles.statsCard}>
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Ճիշտ պատասխաններ</Text>
            <Text style={styles.statValue}>
              {result.score} / {result.total}
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Տոկոս</Text>
            <Text style={[styles.statValue, { color: colors.primary }]}>
              {percent}%
            </Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statRow}>
            <Text style={styles.statLabel}>Ամսաթիվ</Text>
            <Text style={styles.statValue}>
              {new Date(result.created_at).toLocaleDateString('hy-AM', {
                day: 'numeric',
                month: 'long',
              })}
            </Text>
          </View>
        </View>

        <View style={styles.actions}>
          <GradientButton
            title="Կրկին փորձել"
            onPress={() => router.replace(`/test/${id}`)}
          />
          <Pressable
            style={styles.ghostBtn}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.ghostBtnText}>Վերադառնալ գլխավոր</Text>
          </Pressable>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.lg,
  },
  errorText: { ...typography.h4, color: colors.textMuted },
  container: { flex: 1, paddingTop: spacing.xl },
  heroCard: {
    borderRadius: radius.xxl,
    padding: spacing.xxxl,
    alignItems: 'center',
    marginBottom: spacing.xxl,
    ...shadows.lg,
  },
  emoji: { fontSize: 72, marginBottom: spacing.md },
  percent: {
    fontSize: 56,
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -1,
  },
  message: {
    ...typography.body,
    color: 'rgba(255,255,255,0.9)',
    marginTop: spacing.sm,
  },
  testTitle: {
    ...typography.h4,
    color: '#fff',
    marginTop: spacing.lg,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    marginBottom: spacing.xxl,
    ...shadows.sm,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statLabel: { ...typography.body, color: colors.textMuted },
  statValue: { ...typography.bodyBold, color: colors.text },
  divider: { height: 1, backgroundColor: colors.borderLight },
  actions: { gap: spacing.md, marginTop: 'auto', paddingBottom: spacing.xxl },
  ghostBtn: {
    paddingVertical: spacing.lg,
    borderRadius: radius.lg,
    borderWidth: 1.5,
    borderColor: colors.border,
    alignItems: 'center',
  },
  ghostBtnText: { ...typography.bodyBold, color: colors.textMuted },
});