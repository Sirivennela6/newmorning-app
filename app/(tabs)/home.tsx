import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';

import { api } from '../../utils/api';
import { getCategoryIcon, getCategoryColor } from '../../utils/categoryHelpers';
import { Logo } from '../../components/Logo';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<any[]>([]);
  const [popularCourses, setPopularCourses] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [cats, courses] = await Promise.all([
        api.getCategories(),
        api.getCourses(),
      ]);
      setCategories(cats.slice(0, 6));
      setPopularCourses(courses.slice(0, 5));
    } catch (e) {
      console.error(e);
    }
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      router.push('/(tabs)/courses');
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ===== HEADER ===== */}
        <View style={styles.topBar}>
          <Logo size="large" showText />

          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons
              name="person-circle-outline"
              size={34}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* ===== HERO ===== */}
        <LinearGradient
          colors={['#FF6B35', '#FFA94D', '#FFB84D']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>Empowering You!</Text>
          <Text style={styles.heroSub}>
            Discover practical skills that transform your career
          </Text>

          <View style={styles.searchBar}>
            <Ionicons
              name="search"
              size={20}
              color="#94A3B8"
              style={{ marginRight: 10 }}
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search courses..."
              placeholderTextColor="#94A3B8"
              value={searchQuery}
              onChangeText={setSearchQuery}
              onSubmitEditing={handleSearch}
              returnKeyType="search"
            />
            <TouchableOpacity
              style={styles.searchBtn}
              onPress={handleSearch}
            >
              <Ionicons name="arrow-forward" size={18} color="#FFF" />
            </TouchableOpacity>
          </View>
        </LinearGradient>

        {/* ===== CATEGORIES ===== */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Choose Your Path</Text>
            <TouchableOpacity
              onPress={() => router.push('/(tabs)/courses')}
            >
              <Text style={styles.seeAll}>See All →</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.grid}>
            {categories.map((cat) => {
              const color =
                cat.color || getCategoryColor(cat.name);
              const icon =
                (cat.icon ||
                  getCategoryIcon(cat.name)) as any;

              return (
                <TouchableOpacity
                  key={cat.id}
                  style={styles.catCard}
                  onPress={() =>
                    router.push({
                      pathname:
                        '/courses/category/[id]',
                      params: {
                        id: cat.id,
                        name: cat.name,
                      },
                    })
                  }
                >
                  <LinearGradient
                    colors={[color, color + 'CC']}
                    style={styles.catGradient}
                  >
                    <View style={styles.catIcon}>
                      <Ionicons
                        name={icon}
                        size={30}
                        color="#FFF"
                      />
                    </View>
                  </LinearGradient>

                  <Text
                    style={styles.catName}
                    numberOfLines={2}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ===== POPULAR COURSES ===== */}
        {popularCourses.length > 0 && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>
                Popular Courses
              </Text>
              <TouchableOpacity
                onPress={() =>
                  router.push('/(tabs)/courses')
                }
              >
                <Text style={styles.seeAll}>
                  View all →
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
            >
              {popularCourses.map((course) => (
                <TouchableOpacity
                  key={course.id}
                  style={styles.courseCard}
                  onPress={() =>
                    router.push(`/course/${course.id}`)
                  }
                >
                  {course.image_url ? (
                    <Image
                      source={course.image_url}
                      style={styles.courseImg}
                      contentFit="cover"
                      transition={200}
                    />
                  ) : (
                    <View
                      style={[
                        styles.courseImg,
                        styles.courseImgPlaceholder,
                      ]}
                    >
                      <Ionicons
                        name="school"
                        size={44}
                        color="#FF6B35"
                      />
                    </View>
                  )}

                  <View style={styles.courseBody}>
                    <Text style={styles.courseCategory}>
                      {course.categories?.name ||
                        'General'}
                    </Text>

                    <Text
                      style={styles.courseTitle}
                      numberOfLines={2}
                    >
                      {course.name}
                    </Text>

                    {course.fees && (
                      <Text style={styles.courseFees}>
                        {course.fees}
                      </Text>
                    )}
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* ===== CTA ===== */}
        <View style={styles.section}>
          <LinearGradient
            colors={['#FF6B35', '#FFA94D']}
            style={styles.ctaCard}
          >
            <Text style={styles.ctaTitle}>
              Ready to Start?
            </Text>
            <Text style={styles.ctaSub}>
              Contact New Morning Foundation
            </Text>

            <TouchableOpacity
              style={styles.exploreBtn}
              onPress={() =>
                router.push('/(tabs)/courses')
              }
            >
              <Text style={styles.exploreBtnText}>
                Explore All Courses
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF8F3',
  },

  /* ===== HEADER ===== */
  topBar: {
    paddingTop: 24,
    paddingBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    position: 'relative',
  },

  profileIcon: {
    position: 'absolute',
    right: 16,
    top: 26,
  },

  /* ===== HERO ===== */
  hero: {
    padding: 22,
    paddingTop: 30,
    paddingBottom: 28,
  },

  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },

  heroSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.95)',
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 16,
    lineHeight: 22,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    elevation: 6,
  },

  searchInput: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
  },

  searchBtn: {
    backgroundColor: '#FF6B35',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* ===== SECTION ===== */
  section: {
    padding: 16,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1E293B',
  },

  seeAll: {
    fontSize: 14,
    color: '#FF6B35',
    fontWeight: '600',
  },

  /* ===== CATEGORY GRID ===== */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },

  catCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
  },

  catGradient: {
    height: 110,
    justifyContent: 'center',
    alignItems: 'center',
  },

  catIcon: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  catName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    padding: 10,
    textAlign: 'center',
  },

  /* ===== COURSE CARDS ===== */
  courseCard: {
    width: 260,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 14,
    elevation: 3,
  },

  courseImg: {
    height: 150,
    width: '100%',
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
  },

  courseImgPlaceholder: {
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  courseBody: {
    padding: 14,
  },

  courseCategory: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '700',
    textTransform: 'uppercase',
    marginBottom: 5,
  },

  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    lineHeight: 21,
  },

  courseFees: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B35',
    marginTop: 6,
  },

  /* ===== CTA ===== */
  ctaCard: {
    borderRadius: 20,
    padding: 28,
    alignItems: 'center',
  },

  ctaTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FFF',
    marginBottom: 6,
  },

  ctaSub: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 20,
  },

  exploreBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 25,
  },

  exploreBtnText: {
    color: '#FF6B35',
    fontSize: 15,
    fontWeight: '700',
  },
});