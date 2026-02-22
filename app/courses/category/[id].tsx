import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity,
  ActivityIndicator, Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../../utils/api';
import { Logo } from '../../../components/Logo';

export default function CategoryCoursesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.id as string;
  const categoryName = params.name as string;

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCourses(); }, [categoryId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses(categoryId);
      setCourses(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const renderCourse = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.card} onPress={() => router.push(`/course/${item.id}`)}>
      {item.image_url ? (
        <Image source={{ uri: item.image_url }} style={styles.cardImage} resizeMode="cover" />
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <Ionicons name="school" size={32} color="#FF6B35" />
        </View>
      )}
      <View style={styles.cardBody}>
        {item.sub_category ? (
          <Text style={styles.subCat}>{item.sub_category}</Text>
        ) : null}
        <Text style={styles.cardTitle} numberOfLines={2}>{item.name}</Text>
        <View style={styles.chipRow}>
          {item.duration ? (
            <View style={styles.chip}>
              <Ionicons name="time-outline" size={12} color="#64748B" />
              <Text style={styles.chipText}>{item.duration}</Text>
            </View>
          ) : null}
          {item.eligibility ? (
            <View style={styles.chip}>
              <Ionicons name="school-outline" size={12} color="#64748B" />
              <Text style={styles.chipText}>{item.eligibility}</Text>
            </View>
          ) : null}
        </View>
        {/* fees is text column */}
        {item.fees ? <Text style={styles.feesText}>{item.fees}</Text> : null}
      </View>
      <Ionicons name="chevron-forward" size={20} color="#CBD5E1" style={styles.chevron} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
  <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
    <Ionicons name="arrow-back" size={24} color="#1E293B" />
  </TouchableOpacity>

  <Text style={styles.headerTitle} numberOfLines={1}>
    {categoryName || 'Courses'}
  </Text>
</View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <>
          <View style={styles.resultsBanner}>
            <Text style={styles.resultsText}>
              {courses.length} {courses.length === 1 ? 'course' : 'courses'} available
            </Text>
          </View>
          <FlatList
            data={courses}
            renderItem={renderCourse}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            onRefresh={loadCourses}
            refreshing={loading}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons name="search-outline" size={64} color="#CBD5E1" />
                <Text style={styles.emptyTitle}>No courses yet</Text>
                <Text style={styles.emptySubtitle}>Check back later for new courses in this category</Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
header: {
  flexDirection: 'row',
  alignItems: 'center',
  paddingHorizontal: 16,
  paddingVertical: 14,
  backgroundColor: '#FFF',
  borderBottomWidth: 1,
  borderBottomColor: '#F1F5F9',
},  backBtn: { padding: 2 },
headerTitle: {
  flex: 1,
  fontSize: 22,
  fontWeight: '800',
  color: '#1E293B',
  marginLeft: 12,
},  resultsBanner: { paddingHorizontal: 20, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#F1F5F9', backgroundColor: '#FFF' },
  resultsText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  list: { padding: 16, paddingBottom: 32 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 14, overflow: 'hidden', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, alignItems: 'center' },
  cardImage: { width: 100, height: 110 },
  imagePlaceholder: { backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
  cardBody: { flex: 1, padding: 14 },
  subCat: { fontSize: 11, color: '#FF6B35', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3, marginBottom: 4 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', lineHeight: 21, marginBottom: 8 },
  chipRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 4 },
  chip: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#F1F5F9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 },
  chipText: { fontSize: 11, color: '#64748B', fontWeight: '500' },
  feesText: { fontSize: 13, fontWeight: '700', color: '#FF6B35', marginTop: 2 },
  chevron: { marginRight: 12 },
  emptyContainer: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center', lineHeight: 20 },
});
