import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { api } from '../../utils/api';
import { getCategoryIcon, getCategoryColor } from '../../utils/categoryHelpers';

export default function CoursesScreen() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { loadCategories(); }, []);

  const loadCategories = async () => {
    try {
      const data = await api.getCategories();
      setCategories(data);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const renderCategory = ({ item }: { item: any }) => {
    const iconName = getCategoryIcon(item.name);
    const color = getCategoryColor(item.name);
    return (
      <TouchableOpacity style={styles.categoryCard}
        onPress={() => router.push({ pathname: '/courses/category/[id]', params: { id: item.id, name: item.name } })}>
        <View style={[styles.iconContainer, { backgroundColor: `${color}15` }]}>
          <Ionicons name={iconName as any} size={32} color={color} />
        </View>
        <View style={styles.catInfo}>
          <Text style={styles.categoryName} numberOfLines={2}>{item.name}</Text>
          {item.description ? <Text style={styles.catDesc} numberOfLines={1}>{item.description}</Text> : null}
        </View>
        <Ionicons name="chevron-forward" size={20} color="#CBD5E1" />
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
  <View style={styles.header}>
    <Text style={styles.headerTitle}>Categories</Text>
  </View>

      {loading ? (
        <View style={styles.loadingContainer}><ActivityIndicator size="large" color="#FF6B35" /></View>
      ) : (
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name="albums-outline" size={64} color="#CBD5E1" />
              <Text style={styles.emptyTitle}>No categories yet</Text>
              <Text style={styles.emptySubtitle}>Categories will appear once added by admin</Text>
            </View>
          }
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
 header: {
  paddingVertical: 16,
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: '#FFF',
  borderBottomWidth: 1,
  borderBottomColor: '#F1F5F9',
  shadowColor: '#000',
  shadowOpacity: 0.03,
  shadowRadius: 4,
  elevation: 2,
},
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B' },
  list: { padding: 16 },
  categoryCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 16, padding: 16, marginBottom: 12, elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8 },
  iconContainer: { width: 60, height: 60, borderRadius: 30, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  catInfo: { flex: 1 },
  categoryName: { fontSize: 16, fontWeight: '700', color: '#1E293B', marginBottom: 2 },
  catDesc: { fontSize: 13, color: '#64748B' },
  emptyContainer: { alignItems: 'center', paddingVertical: 64, paddingHorizontal: 32 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#64748B', marginTop: 8, textAlign: 'center' },
});
