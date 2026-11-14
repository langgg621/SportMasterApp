import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function RegisterScreen({ navigation }: { navigation: any }) {
  const { register } = useAuth();
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      alert('Пожалуйста, заполните обязательные поля');
      return;
    }
    setLoading(true);
    try {
      await register({ fullName, email, password, phone, sex: 1 });
      // Đăng ký thành công, tự động đăng nhập và chuyển về màn hình chính
      navigation.replace('MainTabs');
    } catch (error: any) {
      alert(error.message); // Báo lỗi tiếng Nga từ Backend (VD: Этот email уже зарегистрирован)
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color="#111" />
            </TouchableOpacity>
            <Text style={styles.title}>Регистрация</Text>
            <View style={{ width: 24 }} />
          </View>

          <Text style={styles.subtitle}>Создайте аккаунт, чтобы получать бонусы и скидки</Text>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.inputBox}>
              <Ionicons name="person-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Имя и Фамилия *" placeholderTextColor="#888" value={fullName} onChangeText={setFullName} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="call-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Телефон" placeholderTextColor="#888" keyboardType="phone-pad" value={phone} onChangeText={setPhone} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="mail-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Email *" placeholderTextColor="#888" keyboardType="email-address" autoCapitalize="none" value={email} onChangeText={setEmail} />
            </View>

            <View style={styles.inputBox}>
              <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.inputIcon} />
              <TextInput style={styles.input} placeholder="Пароль *" placeholderTextColor="#888" secureTextEntry value={password} onChangeText={setPassword} />
            </View>

            <TouchableOpacity style={styles.registerBtn} onPress={handleRegister} disabled={loading}>
              {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.registerBtnText}>Создать аккаунт</Text>}
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Уже есть аккаунт? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
              <Text style={styles.footerLink}>Войти</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  content: { flexGrow: 1, paddingHorizontal: 24, paddingBottom: 30 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 20, marginBottom: 20 },
  backBtn: { padding: 4 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111' },
  subtitle: { fontSize: 15, color: '#666', textAlign: 'center', marginBottom: 30 },
  form: { gap: 14 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, height: 56 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111' },
  registerBtn: { backgroundColor: '#005bff', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  registerBtnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 'auto', paddingTop: 30 },
  footerText: { fontSize: 15, color: '#666' },
  footerLink: { fontSize: 15, color: '#005bff', fontWeight: 'bold' },
});