import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Image } from 'expo-image';

import { api } from '../../../utils/api';

export default function CategoryCoursesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const categoryId = params.id as string;
  const categoryName = params.name as string;

  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCourses();
  }, [categoryId]);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const data = await api.getCourses(categoryId);
      setCourses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const renderCourse = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() => router.push(`/course/${item.id}`)}
    >
      {item.image_url ? (
        <Image
  source={{ uri: item.image_url }}
  style={styles.courseImage}
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"
/>
      ) : (
        <View style={[styles.cardImage, styles.imagePlaceholder]}>
          <Ionicons name="school" size={28} color="#FF6B35" />
        </View>
      )}

      <View style={styles.cardBody}>
        {item.sub_category && (
          <Text style={styles.subCat}>{item.sub_category}</Text>
        )}

        <Text style={styles.cardTitle} numberOfLines={2}>
          {item.name}
        </Text>

        <View style={styles.metaRow}>
          {item.duration && (
            <View style={styles.metaChip}>
              <Ionicons name="time-outline" size={12} color="#64748B" />
              <Text style={styles.metaText}>{item.duration}</Text>
            </View>
          )}

          {item.eligibility && (
            <View style={styles.metaChip}>
              <Ionicons name="school-outline" size={12} color="#64748B" />
              <Text style={styles.metaText}>{item.eligibility}</Text>
            </View>
          )}
        </View>

        {item.fees && (
          <Text style={styles.feesText}>{item.fees}</Text>
        )}
      </View>

      <Ionicons
        name="chevron-forward"
        size={18}
        color="#CBD5E1"
        style={styles.chevron}
      />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* ===== HEADER ===== */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#1E293B" />
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          {categoryName || 'Courses'}
        </Text>

        <View style={{ width: 24 }} />
      </View>

      {/* ===== CONTENT ===== */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <>
          <View style={styles.resultsBanner}>
            <Text style={styles.resultsText}>
              {courses.length}{' '}
              {courses.length === 1 ? 'course' : 'courses'} available
            </Text>
          </View>

          <FlatList
            data={courses}
            renderItem={renderCourse}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
            refreshing={loading}
            onRefresh={loadCourses}
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <Ionicons
                  name="search-outline"
                  size={60}
                  color="#CBD5E1"
                />
                <Text style={styles.emptyTitle}>No courses yet</Text>
                <Text style={styles.emptySubtitle}>
                  Check back later for new courses in this category
                </Text>
              </View>
            }
          />
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8F3',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ===== HEADER ===== */

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    elevation: 2,
  },

  headerTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },

  /* ===== RESULTS ===== */

  resultsBanner: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#FFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  resultsText: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },

  list: {
    padding: 16,
    paddingBottom: 28,
  },

  /* ===== CARD ===== */

  card: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    borderRadius: 14,
    marginBottom: 12,
    overflow: 'hidden',
    elevation: 2,
    alignItems: 'center',
  },

  cardImage: {
    width: 90,
    height: 95,
  },

  imagePlaceholder: {
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  cardBody: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
  },

  subCat: {
    fontSize: 10,
    color: '#FF6B35',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 4,
  },

  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 6,
  },

  metaRow: {
    flexDirection: 'row',
    gap: 6,
    marginBottom: 4,
  },

  metaChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },

  metaText: {
    fontSize: 11,
    color: '#64748B',
  },

  feesText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B35',
    marginTop: 2,
  },

  chevron: {
    marginRight: 12,
  },

  /* ===== EMPTY ===== */

  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 30,
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 14,
  },

  emptySubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 6,
    textAlign: 'center',
  },
});