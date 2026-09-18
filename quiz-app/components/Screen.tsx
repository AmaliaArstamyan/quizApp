import { View, StyleSheet, SafeAreaView, Platform, StatusBar } from 'react-native';
import { ReactNode } from 'react';
import { colors, spacing } from '../lib/theme';

type Props = {
  children: ReactNode;
  padded?: boolean;
};

export function Screen({ children, padded = true }: Props) {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={[styles.container, padded && styles.padded]}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  container: {
    flex: 1,
  },
  padded: {
    paddingHorizontal: spacing.xl,
  },
});