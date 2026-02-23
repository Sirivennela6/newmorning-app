import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList,
  Alert, TextInput, Modal, ActivityIndicator,
} from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/authContext';
import { api } from '../../utils/api';
import { Logo } from '../../components/Logo';

type Tab = 'categories' | 'courses';

// Default color palette for categories
const COLOR_OPTIONS = [
  '#FF6B35', '#3B82F6', '#22C55E', '#EF4444', '#8B5CF6',
  '#F59E0B', '#EC4899', '#06B6D4', '#84CC16', '#F97316',
];

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAdmin, signOut, loading: authLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<Tab>('categories');
  const [categories, setCategories] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Modals
  const [categoryModal, setCategoryModal] = useState(false);
  const [courseModal, setCourseModal] = useState(false);
  const [editItem, setEditItem] = useState<any>(null);

  // Category form — matches schema: name, color, icon
  const [catForm, setCatForm] = useState({ name: '', color: '#FF6B35', icon: 'school-outline' });

  // Course form — matches exact schema columns
  const [courseForm, setCourseForm] = useState({
    name: '', category_id: '', category: '', sub_category: '',
    duration: '', eligibility: '', fees: '', entrance_exam: '',
    location: '', provider: '', course_link: '', image_url: '',
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !isAdmin) {
        router.replace('/auth/admin-login' as any);
      } else {
        loadData();
      }
    }
  }, [user, isAdmin, authLoading]);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, crs] = await Promise.all([api.getCategories(), api.getCourses()]);
      setCategories(cats);
      setCourses(crs);
    } catch (e: any) {
      Alert.alert('Error loading data', e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Exit admin dashboard?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await signOut();
          router.replace('/(tabs)/home' as any);
        }
      },
    ]);
  };

  // ── Category CRUD ──────────────────────────────────────────────
  const openCatModal = (item?: any) => {
    setEditItem(item || null);
    setCatForm(item
      ? { name: item.name || '', color: item.color || '#FF6B35', icon: item.icon || 'school-outline' }
      : { name: '', color: '#FF6B35', icon: 'school-outline' }
    );
    setCategoryModal(true);
  };

  const saveCategory = async () => {
    if (!catForm.name.trim()) { Alert.alert('Error', 'Category name is required'); return; }
    setSaving(true);
    try {
      if (editItem) {
        await api.updateCategory(editItem.id, catForm);
      } else {
        await api.createCategory(catForm);
      }
      setCategoryModal(false);
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCategory = (item: any) => {
    Alert.alert('Delete Category', `Delete "${item.name}"?\n\nCourses in this category will lose their category link.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try { await api.deleteCategory(item.id); loadData(); }
          catch (e: any) { Alert.alert('Error', e.message); }
        }
      },
    ]);
  };

  // ── Course CRUD ────────────────────────────────────────────────
  const openCourseModal = (item?: any) => {
    setEditItem(item || null);
    if (item) {
      setCourseForm({
        name: item.name || '',
        category_id: item.category_id || '',
        category: item.category || '',
        sub_category: item.sub_category || '',
        duration: item.duration || '',
        eligibility: item.eligibility || '',
        fees: item.fees || '',
        entrance_exam: item.entrance_exam || '',
        location: item.location || '',
        provider: item.provider || '',
        course_link: item.course_link || '',
        image_url: item.image_url || '',
      });
    } else {
      setCourseForm({
        name: '', category_id: '', category: '', sub_category: '',
        duration: '', eligibility: '', fees: '', entrance_exam: '',
        location: '', provider: '', course_link: '', image_url: '',
      });
    }
    setCourseModal(true);
  };

  const saveCourse = async () => {
    if (!courseForm.name.trim()) { Alert.alert('Error', 'Course name is required'); return; }
    if (!courseForm.category_id) { Alert.alert('Error', 'Please select a category'); return; }
    setSaving(true);
    try {
      // Auto-fill category text from selected category name
      const selectedCat = categories.find(c => c.id === courseForm.category_id);
      const payload = {
        ...courseForm,
        category: selectedCat?.name || courseForm.category,
      };
      if (editItem) {
        await api.updateCourse(editItem.id, payload);
      } else {
        await api.createCourse(payload);
      }
      setCourseModal(false);
      loadData();
    } catch (e: any) {
      Alert.alert('Error', e.message);
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = (item: any) => {
    Alert.alert('Delete Course', `Delete "${item.name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try { await api.deleteCourse(item.id); loadData(); }
          catch (e: any) { Alert.alert('Error', e.message); }
        }
      },
    ]);
  };

  if (authLoading || loading) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FF6B35" />
          <Text style={styles.loadingText}>Loading Dashboard...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Header */}
      <View style={styles.header}>
        <Logo size="small" showText={true} />
        <View style={styles.headerRight}>
          <View style={styles.adminBadge}>
            <Ionicons name="shield-checkmark" size={14} color="#FFF" />
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
          <TouchableOpacity onPress={handleSignOut} style={styles.signOutBtn}>
            <Ionicons name="log-out-outline" size={24} color="#EF4444" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Stats */}
      <View style={styles.statsBar}>
        <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('categories')}>
          <Text style={styles.statNumber}>{categories.length}</Text>
          <Text style={styles.statLabel}>Categories</Text>
        </TouchableOpacity>
        <View style={styles.statDivider} />
        <TouchableOpacity style={styles.statItem} onPress={() => setActiveTab('courses')}>
          <Text style={styles.statNumber}>{courses.length}</Text>
          <Text style={styles.statLabel}>Courses</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {(['categories', 'courses'] as Tab[]).map(tab => (
          <TouchableOpacity key={tab} style={[styles.tab, activeTab === tab && styles.activeTab]} onPress={() => setActiveTab(tab)}>
            <Ionicons name={tab === 'categories' ? 'albums' : 'school'} size={18} color={activeTab === tab ? '#FF6B35' : '#94A3B8'} />
            <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Category List */}
      {activeTab === 'categories' ? (
        <FlatList
          data={categories}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <TouchableOpacity style={styles.addBtn} onPress={() => openCatModal()}>
              <Ionicons name="add-circle" size={22} color="#FFF" />
              <Text style={styles.addBtnText}>Add Category</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={[styles.catColorDot, { backgroundColor: item.color || '#FF6B35' }]}>
                <Ionicons name={(item.icon || 'school-outline') as any} size={22} color="#FFF" />
              </View>
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle}>{item.name}</Text>
                <Text style={styles.cardMeta}>{item.color || 'No color set'}</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openCatModal(item)} style={styles.editBtn}>
                  <Ionicons name="pencil" size={17} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCategory(item)} style={styles.deleteBtn}>
                  <Ionicons name="trash" size={17} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No categories yet. Add one!</Text>}
        />
      ) : (
        <FlatList
          data={courses}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          ListHeaderComponent={
            <TouchableOpacity style={styles.addBtn} onPress={() => openCourseModal()}>
              <Ionicons name="add-circle" size={22} color="#FFF" />
              <Text style={styles.addBtnText}>Add Course</Text>
            </TouchableOpacity>
          }
          renderItem={({ item }) => (
            <View style={styles.card}>
              {item.image_url ? (
                <Image source={{ uri: item.image_url }} style={styles.courseThumb} />
              ) : (
                <View style={[styles.courseThumb, styles.courseThumbPlaceholder]}>
                  <Ionicons name="school" size={22} color="#FF6B35" />
                </View>
              )}
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={1}>{item.name}</Text>
                <Text style={styles.cardMeta}>{item.category || item.categories?.name || 'No category'}</Text>
                {item.fees ? <Text style={styles.cardFee}>{item.fees}</Text> : null}
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity onPress={() => openCourseModal(item)} style={styles.editBtn}>
                  <Ionicons name="pencil" size={17} color="#3B82F6" />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => deleteCourse(item)} style={styles.deleteBtn}>
                  <Ionicons name="trash" size={17} color="#EF4444" />
                </TouchableOpacity>
              </View>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No courses yet. Add one!</Text>}
        />
      )}

      {/* ── Category Modal ── */}
      <Modal visible={categoryModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FDF8F3' }} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editItem ? 'Edit Category' : 'New Category'}</Text>
            <TouchableOpacity onPress={() => setCategoryModal(false)}>
              <Ionicons name="close" size={28} color="#1E293B" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">
            <Text style={styles.fieldLabel}>Category Name *</Text>
            <TextInput style={styles.textInput} value={catForm.name}
              onChangeText={v => setCatForm(f => ({ ...f, name: v }))} placeholder="e.g. Technology" />

            <Text style={styles.fieldLabel}>Icon Name (Ionicons)</Text>
            <TextInput style={styles.textInput} value={catForm.icon}
              onChangeText={v => setCatForm(f => ({ ...f, icon: v }))}
              placeholder="e.g. laptop-outline, medical-outline, leaf-outline" />
            <Text style={styles.fieldHint}>Find icons at: ionicons.com</Text>

            <Text style={styles.fieldLabel}>Color</Text>
            <View style={styles.colorGrid}>
              {COLOR_OPTIONS.map(color => (
                <TouchableOpacity key={color} style={[styles.colorSwatch, { backgroundColor: color },
                  catForm.color === color && styles.colorSwatchActive]}
                  onPress={() => setCatForm(f => ({ ...f, color }))}>
                  {catForm.color === color && <Ionicons name="checkmark" size={18} color="#FFF" />}
                </TouchableOpacity>
              ))}
            </View>
            <TextInput style={[styles.textInput, { marginTop: 8 }]} value={catForm.color}
              onChangeText={v => setCatForm(f => ({ ...f, color: v }))} placeholder="#FF6B35" />

            {/* Preview */}
            <View style={styles.previewRow}>
              <View style={[styles.previewIcon, { backgroundColor: catForm.color }]}>
                <Ionicons name={(catForm.icon || 'school-outline') as any} size={28} color="#FFF" />
              </View>
              <Text style={styles.previewLabel}>{catForm.name || 'Preview'}</Text>
            </View>
          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={saveCategory} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>{editItem ? 'Save Changes' : 'Create Category'}</Text>}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>

      {/* ── Course Modal ── */}
      <Modal visible={courseModal} animationType="slide" presentationStyle="pageSheet">
        <SafeAreaView style={{ flex: 1, backgroundColor: '#FDF8F3' }} edges={['top']}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>{editItem ? 'Edit Course' : 'New Course'}</Text>
            <TouchableOpacity onPress={() => setCourseModal(false)}>
              <Ionicons name="close" size={28} color="#1E293B" />
            </TouchableOpacity>
          </View>
          <ScrollView style={styles.modalBody} keyboardShouldPersistTaps="handled">

            <Text style={styles.fieldLabel}>Course Name *</Text>
            <TextInput style={styles.textInput} value={courseForm.name}
              onChangeText={v => setCourseForm(f => ({ ...f, name: v }))} placeholder="e.g. Web Development Bootcamp" />

            <Text style={styles.fieldLabel}>Category *</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 16 }}>
              {categories.map(cat => (
                <TouchableOpacity key={cat.id}
                  style={[styles.catChip, courseForm.category_id === cat.id && { backgroundColor: cat.color || '#FF6B35', borderColor: cat.color || '#FF6B35' }]}
                  onPress={() => setCourseForm(f => ({ ...f, category_id: cat.id, category: cat.name }))}>
                  <Text style={[styles.catChipText, courseForm.category_id === cat.id && { color: '#FFF' }]}>{cat.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <Text style={styles.fieldLabel}>Sub Category</Text>
            <TextInput style={styles.textInput} value={courseForm.sub_category}
              onChangeText={v => setCourseForm(f => ({ ...f, sub_category: v }))} placeholder="e.g. Frontend Development" />

            <Text style={styles.fieldLabel}>Duration</Text>
            <TextInput style={styles.textInput} value={courseForm.duration}
              onChangeText={v => setCourseForm(f => ({ ...f, duration: v }))} placeholder="e.g. 3 months, 1 year" />

            <Text style={styles.fieldLabel}>Eligibility</Text>
            <TextInput style={styles.textInput} value={courseForm.eligibility}
              onChangeText={v => setCourseForm(f => ({ ...f, eligibility: v }))} placeholder="e.g. 10th Pass, Graduate" />

            <Text style={styles.fieldLabel}>Fees</Text>
            <TextInput style={styles.textInput} value={courseForm.fees}
              onChangeText={v => setCourseForm(f => ({ ...f, fees: v }))} placeholder="e.g. ₹5000, Free, Contact us" />

            <Text style={styles.fieldLabel}>Entrance Exam</Text>
            <TextInput style={styles.textInput} value={courseForm.entrance_exam}
              onChangeText={v => setCourseForm(f => ({ ...f, entrance_exam: v }))} placeholder="e.g. None, NEET, JEE" />

            <Text style={styles.fieldLabel}>Location</Text>
            <TextInput style={styles.textInput} value={courseForm.location}
              onChangeText={v => setCourseForm(f => ({ ...f, location: v }))} placeholder="e.g. Bangalore, Online" />

            <Text style={styles.fieldLabel}>Provider / Institute</Text>
            <TextInput style={styles.textInput} value={courseForm.provider}
              onChangeText={v => setCourseForm(f => ({ ...f, provider: v }))} placeholder="e.g. New Morning Foundation" />

            <Text style={styles.fieldLabel}>Course Link</Text>
            <TextInput style={styles.textInput} value={courseForm.course_link}
              onChangeText={v => setCourseForm(f => ({ ...f, course_link: v }))} placeholder="https://..." keyboardType="url" autoCapitalize="none" />

            <Text style={styles.fieldLabel}>Image URL</Text>
            <TextInput style={styles.textInput} value={courseForm.image_url}
              onChangeText={v => setCourseForm(f => ({ ...f, image_url: v }))} placeholder="https://..." keyboardType="url" autoCapitalize="none" />
            {courseForm.image_url ? (
              <Image source={{ uri: courseForm.image_url }} style={styles.imagePreview} resizeMode="cover" />
            ) : null}

          </ScrollView>
          <View style={styles.modalFooter}>
            <TouchableOpacity style={[styles.saveBtn, saving && { opacity: 0.6 }]} onPress={saveCourse} disabled={saving}>
              {saving ? <ActivityIndicator color="#FFF" /> : <Text style={styles.saveBtnText}>{editItem ? 'Save Changes' : 'Create Course'}</Text>}
            </TouchableOpacity>
          </View>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 16, color: '#64748B', fontSize: 16 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B35', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12, gap: 4 },
  adminBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  signOutBtn: { padding: 4 },
  statsBar: { flexDirection: 'row', backgroundColor: '#FFF', margin: 16, borderRadius: 16, padding: 20, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 36, fontWeight: '900', color: '#FF6B35' },
  statLabel: { fontSize: 13, color: '#64748B', fontWeight: '600', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E2E8F0', marginVertical: 4 },
  tabs: { flexDirection: 'row', marginHorizontal: 16, backgroundColor: '#F1F5F9', borderRadius: 12, padding: 4, marginBottom: 8 },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: 10, borderRadius: 10, gap: 6 },
  activeTab: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 4 },
  tabText: { fontSize: 14, fontWeight: '600', color: '#94A3B8' },
  activeTabText: { color: '#FF6B35' },
  list: { padding: 16 },
  addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B35', borderRadius: 14, padding: 15, marginBottom: 16, justifyContent: 'center', gap: 8, elevation: 4 },
  addBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 14, marginBottom: 12, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06, shadowRadius: 6 },
  catColorDot: { width: 52, height: 52, borderRadius: 26, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  courseThumb: { width: 56, height: 56, borderRadius: 12, marginRight: 14 },
  courseThumbPlaceholder: { backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center' },
  cardInfo: { flex: 1 },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', marginBottom: 3 },
  cardMeta: { fontSize: 13, color: '#64748B' },
  cardFee: { fontSize: 13, color: '#FF6B35', fontWeight: '600', marginTop: 2 },
  cardActions: { flexDirection: 'row', gap: 8 },
  editBtn: { backgroundColor: '#EFF6FF', padding: 8, borderRadius: 8 },
  deleteBtn: { backgroundColor: '#FEF2F2', padding: 8, borderRadius: 8 },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 16, marginTop: 48, lineHeight: 24 },
  // Modal
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  modalTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  modalBody: { flex: 1, padding: 20 },
  fieldLabel: { fontSize: 14, fontWeight: '600', color: '#475569', marginBottom: 6, marginTop: 8 },
  fieldHint: { fontSize: 12, color: '#94A3B8', marginBottom: 8, marginTop: -4 },
  textInput: { backgroundColor: '#FFF', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: '#E2E8F0', fontSize: 15, color: '#1E293B', marginBottom: 4 },
  colorGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
  colorSwatch: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center' },
  colorSwatchActive: { borderWidth: 3, borderColor: '#1E293B' },
  previewRow: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, padding: 16, marginTop: 16, borderWidth: 1, borderColor: '#E2E8F0', gap: 14 },
  previewIcon: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center' },
  previewLabel: { fontSize: 17, fontWeight: '700', color: '#1E293B', flex: 1 },
  catChip: { paddingHorizontal: 14, paddingVertical: 9, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8, borderWidth: 1.5, borderColor: '#E2E8F0' },
  catChipText: { fontSize: 13, fontWeight: '600', color: '#64748B' },
  imagePreview: { width: '100%', height: 160, borderRadius: 12, marginTop: 8, marginBottom: 8 },
  modalFooter: { padding: 20, borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  saveBtn: { backgroundColor: '#FF6B35', borderRadius: 16, height: 56, justifyContent: 'center', alignItems: 'center', elevation: 4 },
  saveBtnText: { color: '#FFF', fontSize: 18, fontWeight: '700' },
});
