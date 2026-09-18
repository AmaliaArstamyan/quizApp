import { useEffect, useState } from 'react';
import { View, Text, Pressable, ScrollView, StyleSheet, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/auth-context';

export default function TestScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { session } = useAuth();
  const router = useRouter();

  const [test, setTest] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: t } = await supabase.from('tests').select('*').eq('id', id).single();
      const { data: q } = await supabase.from('questions').select('*')
        .eq('test_id', id).order('position');
      setTest(t);
      setQuestions(q ?? []);
      setAnswers(new Array(q?.length ?? 0).fill(-1));
      setTimeLeft(t?.time_limit ?? 600);
    })();
  }, [id]);

  useEffect(() => {
    if (!test || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft(p => p - 1), 1000);
    return () => clearInterval(timer);
  }, [test, timeLeft]);

  useEffect(() => {
    if (test && timeLeft === 0 && !submitting) submit();
  }, [timeLeft]);

  const submit = async () => {
    if (submitting) return;
    setSubmitting(true);
    let score = 0;
    questions.forEach((q, i) => { if (answers[i] === q.correct_index) score += q.points; });
    const total = questions.reduce((a, q) => a + q.points, 0);

    const { data, error } = await supabase.from('results').insert({
      user_id: session!.user.id,
      test_id: test.id,
      score, total, answers,
    }).select().single();

    if (error) { Alert.alert('Սխալ', error.message); setSubmitting(false); return; }
    router.replace(`/test/${test.id}-result?resultId=${data.id}`);
  };

  if (!test || questions.length === 0) return <Text style={{ padding: 40 }}>Բեռնում...</Text>;

  const q = questions[current];
  const progress = ((current + 1) / questions.length) * 100;

  return (
    <ScrollView style={s.container} contentContainerStyle={{ padding: 20 }}>
      <View style={s.topBar}>
        <Text style={s.timer}>
          ⏱ {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}
        </Text>
        <Text style={s.counter}>{current + 1}/{questions.length}</Text>
      </View>

      <View style={s.progressBg}>
        <View style={[s.progressFill, { width: `${progress}%` }]} />
      </View>

      <Text style={s.question}>{q.text}</Text>

      {(q.options as string[]).map((opt, i) => {
        const selected = answers[current] === i;
        return (
          <Pressable
            key={i}
            onPress={() => {
              const next = [...answers];
              next[current] = i;
              setAnswers(next);
            }}
            style={[s.option, selected && s.optionSelected]}
          >
            <Text style={[s.optionText, selected && s.optionTextSelected]}>{opt}</Text>
          </Pressable>
        );
      })}

      <View style={s.nav}>
        <Pressable
          style={[s.navBtn, current === 0 && s.navBtnDisabled]}
          disabled={current === 0}
          onPress={() => setCurrent(c => c - 1)}
        >
          <Text style={s.navText}>← Հետ</Text>
        </Pressable>

        {current < questions.length - 1 ? (
          <Pressable style={s.navBtnPrimary} onPress={() => setCurrent(c => c + 1)}>
            <Text style={s.navTextPrimary}>Հաջորդ →</Text>
          </Pressable>
        ) : (
          <Pressable style={s.navBtnPrimary} onPress={submit} disabled={submitting}>
            <Text style={s.navTextPrimary}>{submitting ? '...' : 'Ավարտել'}</Text>
          </Pressable>
        )}
      </View>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 40, marginBottom: 12 },
  timer: { fontSize: 18, fontWeight: '600', color: '#EF4444' },
  counter: { fontSize: 16, color: '#6B7280' },
  progressBg: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4F46E5' },
  question: { fontSize: 22, fontWeight: '600', marginVertical: 24, lineHeight: 30 },
  option: { padding: 16, borderRadius: 12, backgroundColor: '#F3F4F6', marginBottom: 10, borderWidth: 2, borderColor: 'transparent' },
  optionSelected: { backgroundColor: '#EEF2FF', borderColor: '#4F46E5' },
  optionText: { fontSize: 16 },
  optionTextSelected: { color: '#4F46E5', fontWeight: '600' },
  nav: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 24, gap: 12 },
  navBtn: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#F3F4F6' },
  navBtnDisabled: { opacity: 0.4 },
  navBtnPrimary: { flex: 1, padding: 16, borderRadius: 12, backgroundColor: '#4F46E5' },
  navText: { textAlign: 'center', fontWeight: '600', color: '#374151' },
  navTextPrimary: { textAlign: 'center', fontWeight: '600', color: '#fff' },
});