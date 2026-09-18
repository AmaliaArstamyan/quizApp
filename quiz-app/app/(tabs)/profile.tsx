import { View, Text, StyleSheet, Platform, Alert } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';
import { colors, spacing, typography, radius, shadows } from '../../lib/theme';
import { Screen } from '../../components/Screen';
import { GradientButton } from '../../components/GradientButton';

export default function Profile() {
  const { session } = useAuth();
  const email = session?.user.email ?? '';
  const initial = email.charAt(0).toUpperCase();


const onLogout = async () => {
  if (Platform.OS === 'web') {
    const confirmed = window.confirm('Համոզվա՞ծ եք, որ ուզում եք դուրս գալ');
    if (confirmed) {
      await supabase.auth.signOut();
    }
  } else {
    Alert.alert('Դուրս գալ', 'Համոզվա՞ծ եք', [
      { text: 'Ոչ', style: 'cancel' },
      {
        text: 'Այո',
        style: 'destructive',
        onPress: async () => await supabase.auth.signOut(),
      },
    ]);
  }
};

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Պրոֆիլ</Text>
      </View>

      <View style={styles.avatarWrapper}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6'] as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.avatar}
        >
          <Text style={styles.avatarText}>{initial}</Text>
        </LinearGradient>
        <Text style={styles.email}>{email}</Text>
        <Text style={styles.role}>Օգտատեր</Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0</Text>
          <Text style={styles.statLabel}>Թեստեր</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>0%</Text>
          <Text style={styles.statLabel}>Միջին</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statValue}>🏆</Text>
          <Text style={styles.statLabel}>Մակարդակ</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <GradientButton title="Դուրս գալ" onPress={onLogout} variant="danger" />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: { marginTop: spacing.xl, marginBottom: spacing.xxl },
  title: { ...typography.h1, color: colors.text },
  avatarWrapper: { alignItems: 'center', marginBottom: spacing.xxxl },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.lg,
    ...shadows.lg,
  },
  avatarText: { color: '#fff', fontSize: 40, fontWeight: '700' },
  email: { ...typography.h4, color: colors.text },
  role: { ...typography.small, color: colors.textMuted, marginTop: spacing.xs },
  statsRow: { flexDirection: 'row', gap: spacing.md },
  statCard: {
    flex: 1,
    backgroundColor: colors.card,
    borderRadius: radius.lg,
    padding: spacing.lg,
    alignItems: 'center',
    ...shadows.sm,
  },
  statValue: { ...typography.h3, color: colors.primary },
  statLabel: { ...typography.tiny, color: colors.textMuted, marginTop: spacing.xs },
  footer: { marginTop: 'auto', marginBottom: spacing.xxl },
});