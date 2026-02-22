import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TextInput, TouchableOpacity,
  KeyboardAvoidingView, Platform, Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../utils/authContext';
import { Logo } from '../../components/Logo';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, signUp } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (isSignUp && !fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return;
    }
    if (!email.trim() || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        await signUp(email.trim(), password, fullName.trim());
        Alert.alert(
          'Account Created!',
          'Please check your email to verify your account, then sign in.',
          [{ text: 'OK', onPress: () => setIsSignUp(false) }]
        );
      } else {
        await signIn(email.trim(), password);
        router.back();
      }
    } catch (e: any) {
      Alert.alert(isSignUp ? 'Sign Up Failed' : 'Sign In Failed', e.message || 'Please try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <LinearGradient colors={['#FF6B35', '#FFA94D']} style={styles.header}>
            <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={24} color="#FFF" />
            </TouchableOpacity>
            <Logo size="large" showText={true} light={true} />
            <Text style={styles.headerSub}>
              {isSignUp ? 'Create your account' : 'Sign in to save courses'}
            </Text>
          </LinearGradient>

          <View style={styles.form}>
            <Text style={styles.title}>{isSignUp ? 'Create Account' : 'Welcome Back!'}</Text>
            <Text style={styles.subtitle}>
              {isSignUp
                ? 'Sign up to bookmark and track your favourite courses'
                : 'Sign in to access your saved courses'}
            </Text>

            {isSignUp && (
              <View style={styles.inputWrap}>
                <Ionicons name="person-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Full Name"
                  placeholderTextColor="#94A3B8"
                  value={fullName}
                  onChangeText={setFullName}
                  autoCapitalize="words"
                />
              </View>
            )}

            <View style={styles.inputWrap}>
              <Ionicons name="mail-outline" size={20} color="#94A3B8" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                placeholder="Email"
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
              style={[styles.submitBtn, loading && { opacity: 0.6 }]}
              onPress={handleSubmit}
              disabled={loading}
            >
              {loading
                ? <ActivityIndicator color="#FFF" />
                : <Text style={styles.submitBtnText}>{isSignUp ? 'Create Account' : 'Sign In'}</Text>
              }
            </TouchableOpacity>

            <TouchableOpacity style={styles.toggleWrap} onPress={() => {
              setIsSignUp(v => !v);
              setFullName('');
              setPassword('');
            }}>
              <Text style={styles.toggleText}>
                {isSignUp ? 'Already have an account? ' : "Don't have an account? "}
                <Text style={styles.toggleLink}>{isSignUp ? 'Sign In' : 'Sign Up'}</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FDF8F3' },
  header: { padding: 40, paddingTop: 56, alignItems: 'center' },
  backBtn: { position: 'absolute', left: 16, top: 56 },
  headerSub: { fontSize: 15, color: 'rgba(255,255,255,0.9)', marginTop: 12 },
  form: { backgroundColor: '#FDF8F3', borderTopLeftRadius: 32, borderTopRightRadius: 32, marginTop: -24, padding: 24 },
  title: { fontSize: 22, fontWeight: '800', color: '#1E293B', marginBottom: 6, marginTop: 8 },
  subtitle: { fontSize: 14, color: '#64748B', marginBottom: 28, lineHeight: 20 },
  inputWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 14, paddingHorizontal: 16, marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0' },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, height: 54, fontSize: 15, color: '#1E293B' },
  submitBtn: { backgroundColor: '#FF6B35', borderRadius: 14, height: 54, justifyContent: 'center', alignItems: 'center', marginTop: 6, elevation: 4 },
  submitBtnText: { color: '#FFF', fontSize: 17, fontWeight: '700' },
  toggleWrap: { marginTop: 22, alignItems: 'center' },
  toggleText: { fontSize: 14, color: '#64748B' },
  toggleLink: { color: '#FF6B35', fontWeight: '700' },
});
