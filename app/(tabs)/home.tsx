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
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';

import { api } from '../../utils/api';
import { getCategoryIcon, getCategoryColor } from '../../utils/categoryHelpers';

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
      router.push({
        pathname: '/(tabs)/courses',
        params: { search: searchQuery.trim() },
      });
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ===== HEADER ===== */}
        <View style={styles.topBar}>
          <View style={styles.centerLogo}>
  <Image
    source={require('../../assets/images/new-morning-logo.png')}
    style={styles.logo}
    contentFit="cover"
  />
  <Text style={styles.logoText}>NewMorning</Text>
</View>

          <TouchableOpacity
            style={styles.profileIcon}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Ionicons
              name="person-circle-outline"
              size={32}
              color="#64748B"
            />
          </TouchableOpacity>
        </View>

        {/* ===== HERO ===== */}
        <LinearGradient
          colors={['#FF6B35', '#FFA94D', '#FFB84D']}
          style={styles.hero}
        >
          <Text style={styles.heroTitle}>Empowering You!</Text>
          <Text style={styles.heroSub}>
            Discover practical skills that transform your career
          </Text>

          <View style={styles.searchBar}>
            <Ionicons name="search" size={20} color="#94A3B8" />
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
                      pathname: '/courses/category/[id]',
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
                  router.push({
                    pathname: '/(tabs)/courses',
                    params: { popular: 'true' },
                  })
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
                      source={{ uri: course.image_url }}
                      style={styles.courseImg}
                      resizeMode="cover"
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
                      {course.categories?.name || 'General'}
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
              style={styles.contactRow}
              onPress={() => Linking.openURL('tel:+919845246017')}
            >
              <Ionicons name="call" size={18} color="#FFF" />
              <Text style={styles.contactText}>
                +91 98452 46017
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.contactRow}
              onPress={() =>
                Linking.openURL('mailto:newmorning0503@gmail.com')
              }
            >
              <Ionicons name="mail" size={18} color="#FFF" />
              <Text style={styles.contactText}>
                newmorning0503@gmail.com
              </Text>
            </TouchableOpacity>

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
  container: { flex: 1, backgroundColor: '#FDF8F3' },

  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    backgroundColor: '#FFF',
    position: 'relative',
  },

  centerLogo: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  profileIcon: {
    position: 'absolute',
    right: 18,
  },

  logo: { width: 42, height: 42 },

  logoText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#FF6B35',
    marginLeft: 10,
  },

  hero: { padding: 22 },

  heroTitle: {
    fontSize: 30,
    fontWeight: '900',
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 10,
  },

  heroSub: {
    fontSize: 15,
    color: '#FFF',
    textAlign: 'center',
    marginBottom: 24,
  },

  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
  },

  searchInput: { flex: 1, marginLeft: 10 },

  searchBtn: {
    backgroundColor: '#FF6B35',
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
  },

  section: { padding: 16 },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },

  catCard: {
    width: (width - 44) / 2,
    backgroundColor: '#FFF',
    borderRadius: 16,
    overflow: 'hidden',
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
    padding: 10,
    textAlign: 'center',
  },

  courseCard: {
    width: 260,
    backgroundColor: '#FFF',
    borderRadius: 16,
    marginRight: 14,
  },

  courseImg: {
    height: 150,
    width: '100%',
  },

  courseImgPlaceholder: {
    backgroundColor: '#FFF5F0',
    justifyContent: 'center',
    alignItems: 'center',
  },

  courseBody: { padding: 14 },

  courseCategory: {
    fontSize: 11,
    color: '#FF6B35',
    fontWeight: '700',
    marginBottom: 5,
  },

  courseTitle: {
    fontSize: 15,
    fontWeight: '700',
  },

  courseFees: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FF6B35',
    marginTop: 6,
  },

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
    color: '#FFF',
    marginBottom: 20,
  },

  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
    gap: 8,
  },

  contactText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },

  exploreBtn: {
    backgroundColor: '#FFF',
    paddingHorizontal: 32,
    paddingVertical: 13,
    borderRadius: 25,
    marginTop: 18,
  },

  exploreBtnText: {
    color: '#FF6B35',
    fontSize: 15,
    fontWeight: '700',
  },
});