import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Link } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { colors, spacing, typography, radius } from '../../lib/theme';
import { GradientButton } from '../../components/GradientButton';
import { Input } from '../../components/Input';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);

  const onSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Սխալ', 'Լրացրեք բոլոր դաշտերը');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Սխալ', 'Գաղտնաբառը առնվազն 6 նիշ');
      return;
    }
    if (password !== confirm) {
      Alert.alert('Սխալ', 'Գաղտնաբառերը չեն համընկնում');
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
    });
    setLoading(false);
    if (error) Alert.alert('Սխալ', error.message);
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">
        <View style={styles.hero}>
          <LinearGradient
            colors={['#6366F1', '#8B5CF6', '#A855F7'] as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.heroGradient}
          >
            <Text style={styles.emoji}>✨</Text>
          </LinearGradient>
          <Text style={styles.title}>Ստեղծեք հաշիվ</Text>
          <Text style={styles.subtitle}>Միացեք հազարավոր օգտատերերի</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            placeholder="your@email.com"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Գաղտնաբառ"
            placeholder="••••••••"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoCapitalize="none"
          />

          <Input
            label="Կրկնեք գաղտնաբառը"
            placeholder="••••••••"
            value={confirm}
            onChangeText={setConfirm}
            secureTextEntry
            autoCapitalize="none"
          />

          <GradientButton title="Գրանցվել" onPress={onSubmit} loading={loading} />

          <Link href="/(auth)/login" asChild>
            <Pressable style={styles.linkWrapper}>
              <Text style={styles.linkMuted}>Արդեն հաշիվ ունե՞ք։</Text>
              <Text style={styles.link}> Մուտք</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: colors.background },
  scroll: { flexGrow: 1, padding: spacing.xxl, justifyContent: 'center' },
  hero: { alignItems: 'center', marginBottom: spacing.xxxl },
  heroGradient: {
    width: 88,
    height: 88,
    borderRadius: radius.xxl,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  emoji: { fontSize: 44 },
  title: { ...typography.h1, color: colors.text, marginBottom: spacing.sm, textAlign: 'center' },
  subtitle: { ...typography.body, color: colors.textMuted, textAlign: 'center' },
  form: { marginTop: spacing.md },
  linkWrapper: { flexDirection: 'row', justifyContent: 'center', marginTop: spacing.xxl },
  linkMuted: { color: colors.textMuted, ...typography.body },
  link: { color: colors.primary, ...typography.bodyBold },
});