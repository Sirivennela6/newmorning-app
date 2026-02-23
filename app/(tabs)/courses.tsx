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
import { api } from '../../utils/api';
import { getCategoryIcon, getCategoryColor } from '../../utils/categoryHelpers';
import { Image } from 'expo-image'; 

export default function CoursesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const searchQuery = params.search as string | undefined;
  const showPopular = params.popular === 'true';

  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (searchQuery) {
      loadSearchCourses();
    } else if (showPopular) {
      loadPopularCourses();
    } else {
      loadCategories();
    }
  }, [searchQuery, showPopular]);

  const loadCategories = async () => {
    try {
      setLoading(true);
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadPopularCourses = async () => {
    try {
      setLoading(true);
      const allCourses = await api.getCourses();

      // SAME logic as home screen (top 5)
      const popular = allCourses.slice(0, 5);

      setCourses(popular);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const loadSearchCourses = async () => {
    try {
      setLoading(true);

      const allCategories = await api.getCategories();
      const allCourses = await api.getCourses();

      const query = searchQuery?.toLowerCase() || '';

      // 1️⃣ Check if search matches category
      const matchedCategory = allCategories.find((cat: any) =>
        cat.name.toLowerCase().includes(query)
      );

      let filteredCourses = [];

      if (matchedCategory) {
        // 2️⃣ If category match → show all courses in that category
        filteredCourses = allCourses.filter(
          (course: any) => course.category_id === matchedCategory.id
        );
      } else {
        // 3️⃣ Otherwise search in course name & subcategory
        filteredCourses = allCourses.filter(
          (course: any) =>
            course.name?.toLowerCase().includes(query) ||
            course.sub_category?.toLowerCase().includes(query)
        );
      }

      setCourses(filteredCourses);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  /* ===== RENDER CATEGORY ===== */
  const renderCategory = ({ item }: any) => {
    const icon = getCategoryIcon(item.name);
    const color = getCategoryColor(item.name);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() =>
          router.push({
            pathname: '/courses/category/[id]',
            params: { id: item.id, name: item.name },
          })
        }
      >
        <Ionicons name={icon as any} size={28} color={color} />
        <Text style={styles.title}>{item.name}</Text>
      </TouchableOpacity>
    );
  };

  /* ===== RENDER COURSE ===== */
  // make sure this is imported

const renderCourse = ({ item }: any) => (
  <TouchableOpacity
    style={styles.courseCard}
    onPress={() => router.push(`/course/${item.id}`)}
  >
    {item.image_url ? (
      <Image
       source={{ uri: item.image_url }}
        style={styles.courseImage}
        contentFit="cover"
        transition={200}
        cachePolicy="memory-disk"
      />
    ) : (
      <View style={[styles.courseImage, styles.placeholder]}>
        <Ionicons name="school" size={28} color="#FF6B35" />
      </View>
    )}

    <View style={styles.courseBody}>
      <Text style={styles.courseTitle} numberOfLines={2}>
        {item.name}
      </Text>

      {item.fees && (
        <Text style={styles.courseFees}>{item.fees}</Text>
      )}
    </View>
  </TouchableOpacity>
);
  const isCourseMode = searchQuery || showPopular;

  return (
    <SafeAreaView style={styles.container}>
     <View style={styles.header}>
  {(searchQuery || showPopular) && (
    <TouchableOpacity
      style={styles.backBtn}
      onPress={() => router.back()}
    >
      <Ionicons name="arrow-back" size={24} color="#1E293B" />
    </TouchableOpacity>
  )}

  <Text style={styles.headerTitle}>
    {searchQuery
      ? `Results for "${searchQuery}"`
      : showPopular
      ? 'Popular Courses'
      : 'Categories'}
  </Text>

  {(searchQuery || showPopular) && (
    <View style={{ width: 24 }} />
  )}
</View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
        </View>
      ) : (
        <FlatList
          data={isCourseMode ? courses : categories}
          renderItem={isCourseMode ? renderCourse : renderCategory}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ padding: 16 }}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="search-outline" size={60} color="#CBD5E1" />
              <Text style={styles.emptyText}>No results found</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },

  backBtn: {
  position: 'absolute',
  left: 16,
},

header: {
  paddingVertical: 16,
  backgroundColor: '#FFF',
  alignItems: 'center',
  justifyContent: 'center',
  borderBottomWidth: 1,
  borderBottomColor: '#F1F5F9',
},
  header: {
    padding: 16,
    backgroundColor: '#FFF',
    alignItems: 'center',
    justifyContent:'center',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#1E293B',
  },

  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  card: {
    backgroundColor: '#FFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },

  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },

  emptyContainer: {
    alignItems: 'center',
    marginTop: 40,
  },

  emptyText: {
    marginTop: 10,
    fontSize: 15,
    color: '#64748B',
  },
  courseCard: {
  backgroundColor: '#FFF',
  borderRadius: 14,
  marginBottom: 14,
  overflow: 'hidden',
},

courseImage: {
  height: 140,
  width: '100%',
},

placeholder: {
  backgroundColor: '#FFF5F0',
  justifyContent: 'center',
  alignItems: 'center',
},

courseBody: {
  padding: 14,
},

courseTitle: {
  fontSize: 15,
  fontWeight: '700',
  color: '#1E293B',
},

courseFees: {
  fontSize: 13,
  fontWeight: '700',
  color: '#FF6B35',
  marginTop: 6,
},
});