import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  SafeAreaView, 
  KeyboardAvoidingView, 
  Platform,
  Alert,
  ActivityIndicator
} from 'react-native';
import { Mail, Lock, ArrowRight, GraduationCap } from 'lucide-react-native';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../config/firebase';
import { theme } from '../theme';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email.trim(), password);
      // Success is handled by auth state listener in App.js
    } catch (error) {
      let errorMessage = "An error occurred during sign in.";
      if (error.code === 'auth/invalid-email') {
        errorMessage = "The email address is badly formatted.";
      } else if (
        error.code === 'auth/user-not-found' || 
        error.code === 'auth/wrong-password' || 
        error.code === 'auth/invalid-credential'
      ) {
        errorMessage = "Incorrect email or password.";
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = "Too many failed login attempts. Please try again later.";
      } else {
        errorMessage = error.message;
      }
      Alert.alert("Error", errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.flex}
      >
        <View style={styles.header}>
          <View style={styles.logoBox}>
            <GraduationCap size={40} color="white" />
          </View>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Sign in to continue your learning journey</Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Mail size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email Address"
              placeholderTextColor={theme.colors.textSecondary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Lock size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Password"
              placeholderTextColor={theme.colors.textSecondary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.forgotPass}>
            <Text style={styles.forgotPassText}>Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.loginBtn, loading && styles.disabledBtn]} 
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <ArrowRight size={20} color="white" />
              </>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
              <Text style={styles.signupLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  flex: { flex: 1 },
  header: { 
    padding: 40, 
    alignItems: 'center', 
    marginTop: 60 
  },
  logoBox: { 
    width: 80, 
    height: 80, 
    backgroundColor: theme.colors.accent, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 24,
    elevation: 10,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  title: { 
    fontSize: 32, 
    fontWeight: 'bold', 
    color: 'white', 
    marginBottom: 8 
  },
  subtitle: { 
    fontSize: 16, 
    color: theme.colors.textSecondary, 
    textAlign: 'center' 
  },
  form: { 
    backgroundColor: theme.colors.secondary, 
    flex: 1, 
    borderTopLeftRadius: 50, 
    borderTopRightRadius: 50, 
    padding: 40,
    marginTop: 20
  },
  inputContainer: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.primary, 
    borderRadius: 16, 
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 60,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)'
  },
  inputIcon: { marginRight: 12 },
  input: { flex: 1, color: 'white', fontSize: 16 },
  forgotPass: { alignSelf: 'flex-end', marginBottom: 32 },
  forgotPassText: { color: theme.colors.accent, fontWeight: '600' },
  loginBtn: { 
    backgroundColor: theme.colors.accent, 
    height: 60, 
    borderRadius: 16, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.2,
    shadowRadius: 5,
  },
  disabledBtn: { opacity: 0.7 },
  loginBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold', marginRight: 8 },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: 32 
  },
  footerText: { color: theme.colors.textSecondary, fontSize: 15 },
  signupLink: { color: theme.colors.accent, fontWeight: 'bold', fontSize: 15 },
});

export default LoginScreen;
