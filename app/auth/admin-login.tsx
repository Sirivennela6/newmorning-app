import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/authContext';

export default function AdminLoginScreen() {
  const router = useRouter();
  const { signIn, user, isAdmin, loading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // If already logged in as admin, go straight to dashboard
  useEffect(() => {
    if (!authLoading && user && isAdmin) {
      router.replace('/admin' as any);
    }
  }, [user, isAdmin, authLoading]);

  const handleLogin = async () => {
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    setLoading(true);
    try {
      await signIn(email.trim(), password);
      // isAdmin will be resolved in authContext after login
      // We navigate and let the admin dashboard handle redirect if not admin
      router.replace('/admin' as any);
    } catch (e: any) {
      Alert.alert('Login Failed', e.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={['#1E293B', '#334155']} style={styles.header}>
            <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <View style={styles.iconWrap}>
              <Ionicons name="shield-checkmark" size={56} color="#FF6B35" />
            </View>
            <Text style={styles.headerTitle}>Admin Access</Text>
            <Text style={styles.headerSub}>NewMorning Foundation</Text>
          </LinearGradient>

          <View style={styles.form}>
            <Text style={styles.title}>Administrator Login</Text>
            <Text style={styles.subtitle}>Sign in with your admin account credentials</Text>

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Admin Email"
                placeholderTextColor="#94A3B8"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputWrap}>
              <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Password"
                placeholderTextColor="#94A3B8"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(v => !v)}>
                <Ionicons name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[styles.loginBtn, (loading || authLoading) && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={loading || authLoading}
            >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.loginBtnText}>Access Dashboard</Text>
              )}
            </TouchableOpacity>

            <View style={styles.note}>
              <Ionicons name="information-circle-outline" size={18} color="#F59E0B" />
              <Text style={styles.noteText}>
                Access is restricted to authorised administrators only. Your account must have admin privileges in the system.
              </Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },
  header: { padding: 40, paddingTop: 56, alignItems: 'center' },
  backButton: { position: 'absolute', left: 16, top: 56 },
  iconWrap: { width: 96, height: 96, borderRadius: 48, backgroundColor: 'rgba(255,107,53,0.18)', justifyContent: 'center', alignItems: 'center', marginBottom: 14 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#FFF', marginBottom: 6 },
  headerSub: { fontSize: 15, color: 'rgba(255,255,255,0.75)' },
  form: { backgroundColor: '#FDF8F3', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -24, padding: 24, flex: 1 },
  title: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 6, marginTop: 8 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 28, lineHeight: 20 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 54, fontSize: 15, color: '#1E293B' },
  loginBtn: { backgroundColor: '#1E293B', borderRadius: 14, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 6, elevation: 4 },
  loginBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  note: { flexDirection: 'row', backgroundColor: '#FFFBEB', borderRadius: 12, padding: 14, marginTop: 24, borderWidth: 1, borderColor: '#FDE68A', gap: 10 },
  noteText: { flex: 1, fontSize: 13, color: '#92400E', lineHeight: 19 },
});
