import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/authContext';
import { api } from '../../utils/api';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, isAdmin, signOut } = useAuth();
  const [fullName, setFullName] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadProfile();
    else setFullName(null);
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;
    try {
      const profile = await api.getProfile(user.id);
      setFullName(profile?.full_name || null);
    } catch (e) { /* silent */ }
  };

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: async () => {
          await signOut();
        }
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
        </View>

        {user ? (
          /* ── Logged-in State ── */
          <>
            <View style={styles.userCard}>
              <View style={[styles.avatar, isAdmin && styles.avatarAdmin]}>
                <Ionicons name="person" size={36} color={isAdmin ? '#FF6B35' : '#64748B'} />
              </View>
              {fullName ? <Text style={styles.userName}>{fullName}</Text> : null}
              <Text style={styles.userEmail}>{user.email}</Text>
              {isAdmin && (
                <View style={styles.adminBadge}>
                  <Ionicons name="shield-checkmark" size={14} color="#FFF" />
                  <Text style={styles.adminBadgeText}>Administrator</Text>
                </View>
              )}
            </View>

            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/(tabs)/saved')}>
                <View style={styles.menuIcon}>
                  <Ionicons name="bookmark" size={22} color="#FF6B35" />
                </View>
                <Text style={styles.menuText}>Saved Courses</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              {isAdmin && (
                <TouchableOpacity style={styles.menuItem} onPress={() => router.push('/admin' as any)}>
                  <View style={[styles.menuIcon, { backgroundColor: '#F0FDF4' }]}>
                    <Ionicons name="settings" size={22} color="#22C55E" />
                  </View>
                  <Text style={styles.menuText}>Admin Dashboard</Text>
                  <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
                </TouchableOpacity>
              )}

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="help-circle-outline" size={22} color="#FF6B35" />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="information-circle-outline" size={22} color="#FF6B35" />
                </View>
                <Text style={styles.menuText}>About New Morning</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={[styles.menuItem, { borderBottomWidth: 0 }]} onPress={handleSignOut}>
                <View style={[styles.menuIcon, { backgroundColor: '#FEF2F2' }]}>
                  <Ionicons name="log-out-outline" size={22} color="#EF4444" />
                </View>
                <Text style={[styles.menuText, { color: '#EF4444' }]}>Sign Out</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </>
        ) : (
          /* ── Guest State ── */
          <>
            <View style={styles.guestCard}>
              <View style={styles.avatarPlaceholder}>
                <Ionicons name="person-outline" size={48} color="#94A3B8" />
              </View>
              <Text style={styles.guestTitle}>Sign in to save courses</Text>
              <Text style={styles.guestSubtitle}>
                Create an account to bookmark your favourite vocational courses
              </Text>
              <TouchableOpacity style={styles.signInBtn} onPress={() => router.push('/auth/login')}>
                <Text style={styles.signInBtnText}>Sign In / Sign Up</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menu}>
              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="help-circle-outline" size={22} color="#FF6B35" />
                </View>
                <Text style={styles.menuText}>Help & Support</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity style={styles.menuItem}>
                <View style={styles.menuIcon}>
                  <Ionicons name="information-circle-outline" size={22} color="#FF6B35" />
                </View>
                <Text style={styles.menuText}>About New Morning</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.menuItem, { borderBottomWidth: 0 }]}
                onPress={() => router.push('/auth/admin-login')}
              >
                <View style={[styles.menuIcon, { backgroundColor: '#F8FAFC' }]}>
                  <Ionicons name="shield-checkmark-outline" size={22} color="#64748B" />
                </View>
                <Text style={[styles.menuText, { color: '#64748B' }]}>Admin Login</Text>
                <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
              </TouchableOpacity>
            </View>
          </>
        )}

        <Text style={styles.version}>New Morning Foundation v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E293B' },
  userCard: { alignItems: 'center', backgroundColor: '#FFF', margin: 16, borderRadius: 20, padding: 24, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 12, borderWidth: 2, borderColor: '#E2E8F0' },
  avatarAdmin: { borderColor: '#FF6B35', backgroundColor: '#FFF5F0' },
  userName: { fontSize: 18, fontWeight: '800', color: '#1E293B', marginBottom: 4 },
  userEmail: { fontSize: 14, color: '#64748B', marginBottom: 10 },
  adminBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FF6B35', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, gap: 5 },
  adminBadgeText: { color: '#FFF', fontSize: 13, fontWeight: '700' },
  guestCard: { alignItems: 'center', backgroundColor: '#FFF', margin: 16, borderRadius: 20, padding: 28, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 8 },
  avatarPlaceholder: { width: 90, height: 90, borderRadius: 45, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  guestTitle: { fontSize: 20, fontWeight: '800', color: '#1E293B', marginBottom: 8 },
  guestSubtitle: { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 21, marginBottom: 24, maxWidth: 280 },
  signInBtn: { backgroundColor: '#FF6B35', paddingHorizontal: 40, paddingVertical: 14, borderRadius: 25, width: '100%', alignItems: 'center', elevation: 3 },
  signInBtnText: { color: '#FFF', fontSize: 16, fontWeight: '700' },
  menu: { backgroundColor: '#FFF', borderRadius: 16, marginHorizontal: 16, marginTop: 8, elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  menuIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#FFF5F0', justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  menuText: { flex: 1, fontSize: 15, fontWeight: '600', color: '#1E293B' },
  version: { textAlign: 'center', fontSize: 12, color: '#CBD5E1', marginTop: 24, marginBottom: 32 },
});
