import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  ActivityIndicator, Linking, Image, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { api } from '../../utils/api';
import { useAuth } from '../../utils/authContext';
import { Logo } from '../../components/Logo';

export default function CourseDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => { loadCourse(); }, [id]);
  useEffect(() => { if (user && id) checkSaved(); }, [user, id]);

  const loadCourse = async () => {
    try {
      const data = await api.getCourseById(id as string);
      setCourse(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const checkSaved = async () => {
    if (!user) return;
    const s = await api.isCourseSaved(user.id, id as string);
    setSaved(s);
  };

  const toggleSave = async () => {
    if (!user) { router.push('/auth/login'); return; }
    setSaving(true);
    try {
      if (saved) {
        await api.unsaveCourse(user.id, id as string);
        setSaved(false);
      } else {
        await api.saveCourse(user.id, id as string);
        setSaved(true);
      }
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Logo size="small" showText={false} />
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FF6B35" /></View>
    </SafeAreaView>
  );

  if (!course) return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Logo size="small" showText={false} />
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.errorContainer}>
        <Ionicons name="alert-circle" size={64} color="#CBD5E1" />
        <Text style={styles.errorText}>Course not found</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );

  // Resolved category name from join or text field
  const categoryName = course.categories?.name || course.category || 'General';

  // Detail rows — only show if value exists
  const details = [
    { icon: 'list-outline', label: 'Sub Category', value: course.sub_category },
    { icon: 'business-outline', label: 'Provider', value: course.provider },
    { icon: 'location-outline', label: 'Location', value: course.location },
    { icon: 'document-text-outline', label: 'Entrance Exam', value: course.entrance_exam },
  ].filter(d => d.value);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={28} color="#1E293B" />
        </TouchableOpacity>
        <Logo size="small" showText={false} />
        <TouchableOpacity onPress={toggleSave} disabled={saving}>
          <Ionicons
            name={saved ? 'bookmark' : 'bookmark-outline'}
            size={28}
            color="#FF6B35"
          />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Course Image */}
        {course.image_url ? (
          <Image
  source={{ uri: item.image_url }}
  style={styles.courseImage}
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"
/>
        ) : (
          <View style={styles.courseImagePlaceholder}>
            <Ionicons name="school" size={80} color="#FF6B35" />
          </View>
        )}

        <View style={styles.infoContainer}>
          {/* Category + Title */}
          <Text style={styles.category}>{categoryName}</Text>
          <Text style={styles.title}>{course.name}</Text>

          {/* Quick Info Cards */}
          <View style={styles.quickInfo}>
            <View style={styles.infoCard}>
              <Ionicons name="time-outline" size={22} color="#FF6B35" />
              <Text style={styles.infoLabel}>Duration</Text>
              <Text style={styles.infoValue}>{course.duration || 'N/A'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="school-outline" size={22} color="#FF6B35" />
              <Text style={styles.infoLabel}>Eligibility</Text>
              <Text style={styles.infoValue}>{course.eligibility || 'N/A'}</Text>
            </View>
            <View style={styles.infoCard}>
              <Ionicons name="cash-outline" size={22} color="#FF6B35" />
              <Text style={styles.infoLabel}>Fees</Text>
              {/* fees is a text column in Supabase */}
              <Text style={styles.infoValue}>{course.fees || 'Free'}</Text>
            </View>
          </View>

          {/* Detail Rows */}
          {details.map(({ icon, label, value }) => (
            <View key={label} style={styles.detailRow}>
              <Ionicons name={icon as any} size={20} color="#64748B" />
              <View style={styles.detailContent}>
                <Text style={styles.detailLabel}>{label}</Text>
                <Text style={styles.detailValue}>{value}</Text>
              </View>
            </View>
          ))}

          {/* CTA Button */}
          <TouchableOpacity
            style={styles.moreInfoButton}
            onPress={() => {
              const link = course.course_link;
              if (link) Linking.openURL(link);
              else Linking.openURL('tel:+919876543210');
            }}
          >
            <Text style={styles.moreInfoButtonText}>More Info / Apply</Text>
            <Ionicons name="arrow-forward" size={20} color="#FFF" />
          </TouchableOpacity>

          {/* Contact Row */}
          <View style={styles.contactRow}>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('tel:+919876543210')}>
              <Ionicons name="call-outline" size={20} color="#FF6B35" />
              <Text style={styles.contactBtnText}>Call</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.contactBtn} onPress={() => Linking.openURL('mailto:info@newmorning.org')}>
              <Ionicons name="mail-outline" size={20} color="#FF6B35" />
              <Text style={styles.contactBtnText}>Email</Text>
            </TouchableOpacity>
          </View>

          {/* Save prompt for guests */}
          {!user && (
            <TouchableOpacity style={styles.savePrompt} onPress={() => router.push('/auth/login')}>
              <Ionicons name="bookmark-outline" size={18} color="#FF6B35" />
              <Text style={styles.savePromptText}>Sign in to save this course</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  errorText: { fontSize: 18, fontWeight: '600', color: '#64748B', marginTop: 20, marginBottom: 32 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  courseImage: { width: '100%', height: 240 },
  courseImagePlaceholder: { height: 240, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
  infoContainer: { padding: 20 },
  category: { fontSize: 13, color: '#FF6B35', fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 },
  title: { fontSize: 24, fontWeight: '800', color: '#1E293B', marginBottom: 20, lineHeight: 32 },
  quickInfo: { flexDirection: 'row', gap: 10, marginBottom: 24 },
  infoCard: { flex: 1, backgroundColor: '#FFF', borderRadius: 14, padding: 14, alignItems: 'center', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  infoLabel: { fontSize: 11, color: '#94A3B8', marginTop: 6, marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  infoValue: { fontSize: 13, fontWeight: '700', color: '#1E293B', textAlign: 'center' },
  detailRow: { flexDirection: 'row', alignItems: 'flex-start', paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  detailContent: { flex: 1, marginLeft: 14 },
  detailLabel: { fontSize: 12, color: '#94A3B8', marginBottom: 3, textTransform: 'uppercase', letterSpacing: 0.3 },
  detailValue: { fontSize: 15, fontWeight: '600', color: '#1E293B' },
  moreInfoButton: { flexDirection: 'row', backgroundColor: '#FF6B35', borderRadius: 16, padding: 18, alignItems: 'center', justifyContent: 'center', gap: 10, marginTop: 24, elevation: 4 },
  moreInfoButtonText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  contactRow: { flexDirection: 'row', gap: 12, marginTop: 14 },
  contactBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 14, gap: 8, borderWidth: 1.5, borderColor: '#FF6B35' },
  contactBtnText: { color: '#FF6B35', fontSize: 14, fontWeight: '700' },
  savePrompt: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 16, gap: 8, padding: 14, backgroundColor: '#FFF5F0', borderRadius: 12 },
  savePromptText: { color: '#FF6B35', fontSize: 14, fontWeight: '600' },
  backButton: { backgroundColor: '#FF6B35', paddingHorizontal: 32, paddingVertical: 14, borderRadius: 25 },
  backButtonText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
});
