import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { colors, spacing, typography, radius, shadows } from '../../lib/theme';
import { Screen } from '../../components/Screen';
import { useAuth } from '../../lib/auth-context';

const CARD_GRADIENTS = [
  ['#6366F1', '#8B5CF6'], // Indigo → Violet
  ['#EC4899', '#F43F5E'], // Pink → Rose
  ['#10B981', '#14B8A6'], // Emerald → Teal
  ['#F59E0B', '#F97316'], // Amber → Orange
  ['#3B82F6', '#06B6D4'], // Blue → Cyan
  ['#8B5CF6', '#D946EF'], // Violet → Fuchsia
];

export default function Categories() {
  const [cats, setCats] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { session } = useAuth();

  useEffect(() => {
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }: { data: any[] | null }) => {
        setCats(data ?? []);
        setLoading(false);
      });
  }, []);

  const userName = session?.user.email?.split('@')[0] ?? 'Օգտատեր';

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
        data={cats}
        keyExtractor={(i) => i.id}
        numColumns={2}
        columnWrapperStyle={styles.columnWrapper}
        contentContainerStyle={styles.list}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.greeting}>Բարև, {userName} 👋</Text>
            <Text style={styles.title}>Ընտրեք ոլորտը</Text>
            <Text style={styles.subtitle}>
              {cats.length} ոլորտ · {cats.length * 3}+ թեստեր
            </Text>
          </View>
        }
        renderItem={({ item, index }) => {
          const gradient = CARD_GRADIENTS[index % CARD_GRADIENTS.length];
          return (
            <Pressable
              style={({ pressed }) => [
                styles.cardWrapper,
                pressed && { opacity: 0.9, transform: [{ scale: 0.97 }] },
              ]}
              onPress={() => router.push(`/category/${item.slug}`)}
            >
              <LinearGradient
                colors={gradient as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.card}
              >
                <Text style={styles.cardIcon}>{item.icon ?? '📚'}</Text>
                <Text style={styles.cardTitle} numberOfLines={2}>
                  {item.name}
                </Text>
                <View style={styles.cardBadge}>
                  <Text style={styles.cardBadgeText}>Սկսել →</Text>
                </View>
              </LinearGradient>
            </Pressable>
          );
        }}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  list: { padding: spacing.xl, paddingBottom: spacing.xxxl },
  columnWrapper: { gap: spacing.md, marginBottom: spacing.md },
  header: { marginBottom: spacing.xxl, marginTop: spacing.md },
  greeting: { ...typography.body, color: colors.textMuted, marginBottom: spacing.xs },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm },
  subtitle: { ...typography.small, color: colors.textLight },

  cardWrapper: { flex: 1 },
  card: {
    aspectRatio: 0.95,
    borderRadius: radius.xl,
    padding: spacing.lg,
    justifyContent: 'space-between',
    ...shadows.md,
  },
  cardIcon: { fontSize: 40 },
  cardTitle: {
    ...typography.h4,
    color: '#fff',
    fontSize: 18,
  },
  cardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
    borderRadius: radius.full,
  },
  cardBadgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
});