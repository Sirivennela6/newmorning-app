import React, { useState, useCallback } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { useAuth } from '../../utils/authContext';
import { api } from '../../utils/api';
import { Logo } from '../../components/Logo';

export default function SavedScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [savedCourses, setSavedCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useFocusEffect(useCallback(() => {
    if (user) loadSaved();
    else setSavedCourses([]);
  }, [user]));

  const loadSaved = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = await api.getSavedCourses(user.id);
      // data is [{id, user_id, course_id, courses: {...}}]
      setSavedCourses(data.map((s: any) => s.courses).filter(Boolean));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const unsave = async (courseId: string) => {
    if (!user) return;
    try {
      await api.unsaveCourse(user.id, courseId);
      setSavedCourses(prev => prev.filter(c => c.id !== courseId));
    } catch (e) { console.error(e); }
  };

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.header}>
          <Logo size="small"/>
          <Text style={styles.headerTitle}>Saved</Text>
        </View>
        <View style={styles.centreContainer}>
          <Ionicons name="bookmark-outline" size={80} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No Saved Courses</Text>
          <Text style={styles.emptyText}>Sign in to bookmark your favourite courses</Text>
          <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/auth/login')}>
            <Text style={styles.actionBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved</Text>
      </View>

      {loading ? (
        <View style={styles.centreContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={savedCourses}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          onRefresh={loadSaved}
          refreshing={loading}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.card}
              onPress={() => router.push(`/course/${item.id}`)}
            >
              {item.image_url ? (
                <Image
            source={item.image_url}
            style={styles.cardImage}
            contentFit="cover"
            transition={200}
/>
              ) : (
                <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
                  <Ionicons name="school" size={30} color="#FF6B35" />
                </View>
              )}
              <View style={styles.cardBody}>
                <Text style={styles.cardCategory}>
                  {item.categories?.name || item.category || 'General'}
                </Text>
                <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
                <View style={styles.cardMeta}>
                  {item.duration ? (
                    <View style={styles.metaChip}>
                      <Ionicons name="time-outline" size={12} color="#64748B" />
                      <Text style={styles.metaText}>{item.duration}</Text>
                    </View>
                  ) : null}
                  {/* fees is text in schema */}
                  {item.fees ? (
                    <Text style={styles.feesText}>{item.fees}</Text>
                  ) : null}
                </View>
              </View>
              <TouchableOpacity style={styles.unsaveBtn} onPress={() => unsave(item.id)}>
                <Ionicons name="bookmark" size={22} color="#FF6B35" />
              </TouchableOpacity>
            </TouchableOpacity>
          )}
          ListEmptyComponent={
            <View style={styles.centreContainer}>
              <Ionicons name="bookmark-outline" size={80} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>Nothing saved yet</Text>
              <Text style={styles.emptyText}>Browse courses and tap the bookmark icon</Text>
              <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(tabs)/courses')}>
                <Text style={styles.actionBtnText}>Browse Courses</Text>
              </TouchableOpacity>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },
header: {
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFF',
  borderBottomWidth: 1,
  borderBottomColor: '#F1F5F9',
},  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  list: { padding: 16, paddingBottom: 32 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 14, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6 },
  cardImage: { width: 100, height: 100 },
  cardImagePlaceholder: { backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
  cardBody: { flex: 1, padding: 12, justifyContent: 'center' },
  cardCategory: { fontSize: 11, color: '#FF6B35', fontWeight: '700', textTransform: 'uppercase', marginBottom: 4, letterSpacing: 0.3 },
  cardTitle: { fontSize: 14, fontWeight: '700', color: '#1E293B', lineHeight: 20, marginBottom: 6 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  metaChip: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 12, color: '#64748B' },
  feesText: { fontSize: 12, fontWeight: '700', color: '#FF6B35' },
  unsaveBtn: { padding: 12, justifyContent: 'flex-start', paddingTop: 14 },
  centreContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40, marginTop: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 28, lineHeight: 22 },
  actionBtn: { backgroundColor: '#FF6B35', paddingHorizontal: 36, paddingVertical: 14, borderRadius: 25, elevation: 3 },
  actionBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
