import { useEffect, useState } from 'react';
import { View, Text, FlatList, Pressable, StyleSheet } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';

export default function CategoryTests() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const [tests, setTests] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { data: cat } = await supabase.from('categories').select('id').eq('slug', slug).single();
      if (!cat) return;
      const { data } = await supabase.from('tests').select('*').eq('category_id', cat.id);
      setTests(data ?? []);
    })();
  }, [slug]);

  return (
    <View style={s.container}>
      <Text style={s.header}>Թեստեր</Text>
      <FlatList
        data={tests}
        keyExtractor={i => i.id}
        renderItem={({ item }) => (
          <Pressable style={s.card} onPress={() => router.push(`/test/${item.id}`)}>
            <Text style={s.title}>{item.title}</Text>
            <Text style={s.desc}>{item.description}</Text>
            <Text style={s.meta}>⏱ {Math.floor(item.time_limit / 60)} րոպե</Text>
          </Pressable>
        )}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  header: { fontSize: 26, fontWeight: '700', marginTop: 40, marginBottom: 20 },
  card: { padding: 16, backgroundColor: '#F9FAFB', borderRadius: 14, marginBottom: 12 },
  title: { fontSize: 18, fontWeight: '600' },
  desc: { color: '#6B7280', marginTop: 4 },
  meta: { color: '#4F46E5', marginTop: 8, fontSize: 13 },
});