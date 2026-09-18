import { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import { colors, spacing, typography, radius, shadows } from '../../lib/theme';
import { Screen } from '../../components/Screen';

export default function History() {
  const { session } = useAuth();
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session) return;
    supabase
      .from('results')
      .select('*, tests(title)')
      .eq('user_id', session.user.id)
      .order('created_at', { ascending: false })
      .then(({ data }: { data: any[] | null }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, [session]);

  if (loading) {
    return (
      <Screen>
        <View style={styles.center}>
          <ActivityIndicator size="large" color={colors.primary} />
        </View>
      </Screen>
    );
  }

  return (
    <Screen padded={false}>
      <FlatList
        data={items}
        keyExtractor={(i) => i.id}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Պատմություն</Text>
            <Text style={styles.subtitle}>
              {items.length === 0
                ? 'Դեռ ոչ մի թեստ չեք անցել'
                : `${items.length} թեստ`}
            </Text>
          </View>
        }
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>📊</Text>
            <Text style={styles.emptyText}>Սկսեք թեստ անցնել</Text>
            <Text style={styles.emptySubtext}>
              Ձեր արդյունքները կհայտնվեն այստեղ
            </Text>
          </View>
        }
        renderItem={({ item }) => {
          const percent = Math.round((item.score / item.total) * 100);
          const isGood = percent >= 70;
          return (
            <View style={styles.card}>
              <View style={styles.cardLeft}>
                <Text style={styles.cardTitle}>{item.tests?.title ?? 'Թեստ'}</Text>
                <Text style={styles.cardDate}>
                  {new Date(item.created_at).toLocaleDateString('hy-AM', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
              </View>
              <View
                style={[
                  styles.scoreBadge,
                  { backgroundColor: isGood ? colors.successBg : colors.warningBg },
                ]}
              >
                <Text
                  style={[
                    styles.scoreText,
                    { color: isGood ? colors.success : colors.warning },
                  ]}
                >
                  {percent}%
                </Text>
              </View>
            </View>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  header: { marginTop: spacing.xl, marginBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.body, color: colors.textMuted },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: spacing.lg,
    borderRadius: radius.lg,
    marginBottom: spacing.md,
    ...shadows.sm,
  },
  cardLeft: { flex: 1 },
  cardTitle: { ...typography.h4, color: colors.text },
  cardDate: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
  scoreBadge: {
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.md,
  },
  scoreText: { ...typography.bodyBold, fontSize: 15 },
  empty: { alignItems: 'center', paddingVertical: spacing.xxxl * 2 },
  emptyEmoji: { fontSize: 64, marginBottom: spacing.lg },
  emptyText: { ...typography.h3, color: colors.text, marginBottom: spacing.sm },
  emptySubtext: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
});