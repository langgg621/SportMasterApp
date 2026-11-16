import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';

export default function LoginScreen({ navigation }: { navigation: any }) {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      alert('Пожалуйста, заполните все поля');
      return;
    }
    setLoading(true);
    try {
      // GỌI API LOGIN TẠI ĐÂY (thông qua Hook useAuth)
      await login(email, password);
      
      // Đăng nhập thành công, quay lại màn Profile
      navigation.goBack();
    } catch (error: any) {
      // Báo lỗi tiếng Nga từ Backend (VD: Неверный email или пароль)
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Вход</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>Введите Email и пароль</Text>
          <Text style={styles.subtitle}>Мы используем Email для входа в аккаунт</Text>

          <View style={styles.inputBox}>
            <Ionicons name="mail-outline" size={20} color="#888" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address" 
              autoCapitalize="none" 
            />
          </View>

          <View style={styles.inputBox}>
            <Ionicons name="lock-closed-outline" size={20} color="#888" style={styles.icon} />
            <TextInput 
              style={styles.input} 
              placeholder="Пароль" 
              value={password} 
              onChangeText={setPassword} 
              secureTextEntry={!showPassword} 
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#888" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.btn} onPress={handleLogin} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnText}>Войти</Text>}
          </TouchableOpacity>

          {/* Nếu có màn Đăng ký, bạn có thể mở comment dòng dưới */}
          {/* <TouchableOpacity style={{ marginTop: 20 }} onPress={() => navigation.navigate('RegisterScreen')}>
            <Text style={{ color: '#005bff', textAlign: 'center' }}>Зарегистрироваться</Text>
          </TouchableOpacity> */}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { paddingHorizontal: 24, marginTop: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#111', marginBottom: 8 },
  subtitle: { fontSize: 16, color: '#666', marginBottom: 30 },
  inputBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#f6f6f8', borderRadius: 12, paddingHorizontal: 16, height: 56, marginBottom: 16 },
  icon: { marginRight: 10 },
  input: { flex: 1, fontSize: 16, color: '#111' },
  btn: { backgroundColor: '#005bff', height: 56, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginTop: 10 },
  btnText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});