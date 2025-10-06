import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isShortDevice = height < 700;

type RootStackParamList = {
  Login: undefined;
  ForgotPassword: undefined;
  Register: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "Login"
>;

type Props = {
  navigation: LoginScreenNavigationProp;
};

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const logoScale = useRef(new Animated.Value(0.5)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <KeyboardAvoidingView 
      style={styles.container} 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={styles.whiteBackground}>
        <Animated.View style={[styles.logoContainer, { opacity: fadeAnim, transform: [{ scale: logoScale }] }]}>
          <View style={styles.logoBackground}>
            <Text style={styles.logoText}>🧠</Text>
          </View>
          <Text style={styles.appTitle}>OpenMind Tech</Text>
          <Text style={styles.appSubtitle}>Expand your knowledge</Text>
        </Animated.View>

        <Animated.View style={[
          styles.formContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.welcomeText}>Bem-vindo de volta!</Text>
          <Text style={styles.loginSubtext}>Entre para continuar aprendendo</Text>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor="#999"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#667eea" style={styles.inputIcon} />
            <TextInput
              style={[styles.input, { paddingRight: 50 }]}
              placeholder="Senha"
              placeholderTextColor="#999"
              value={senha}
              onChangeText={setSenha}
              secureTextEntry={!isPasswordVisible}
            />
            <TouchableOpacity
              style={styles.eyeIcon}
              onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            >
              <Ionicons 
                name={isPasswordVisible ? "eye-off-outline" : "eye-outline"} 
                size={20} 
                color="#999" 
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity style={styles.loginButton} activeOpacity={0.8}>
            <View style={styles.buttonContent}>
              <Text style={styles.buttonText}>Entrar</Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.linkButton}
            onPress={() => navigation.navigate("ForgotPassword")}
          >
            <Text style={styles.linkText}>Esqueci minha senha</Text>
          </TouchableOpacity>

          <View style={styles.signupContainer}>
            <Text style={styles.signupText}>Não tem uma conta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate("Register")}>
              <Text style={styles.signupLink}>Cadastre-se</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </KeyboardAvoidingView>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     // flex: 1,
//     // justifyContent: "center",
//     // paddingLeft: 20,
//     // paddingRight: 20,
//     backgroundColor: "#fff",
//   },
//   menu: {},
//   title: {
//     fontSize: 28,
//     fontWeight: "bold",
//     marginBottom: 20,
//     textAlign: "center",
//   },
//   logo: {
//     height: 400,
//     alignSelf: "center",
//     marginBottom: 0,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     padding: 12,
//     borderRadius: 8,
//     marginBottom: 12,
//   },
//   button: {
//     backgroundColor: "#007bff",
//     padding: 15,
//     borderRadius: 8,
//     marginBottom: 10,
//   },
//   buttonText: { color: "#fff", textAlign: "center", fontWeight: "bold" },
//   link: { color: "#007bff", textAlign: "center", marginTop: 10 },
// });

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteBackground: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  logoContainer: {
    alignItems: 'center',
    paddingTop: isShortDevice ? 60 : (isSmallDevice ? 70 : 80),
    paddingBottom: isShortDevice ? 30 : (isSmallDevice ? 35 : 40),
    backgroundColor: 'transparent',
  },
  logoBackground: {
    width: isSmallDevice ? 70 : 80,
    height: isSmallDevice ? 70 : 80,
    borderRadius: isSmallDevice ? 35 : 40,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallDevice ? 16 : 20,
    borderWidth: 3,
    borderColor: '#667eea',
    boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.2)',
    elevation: 6,
  },
  logoText: {
    fontSize: 40,
  },
  appTitle: {
    fontSize: isSmallDevice ? 28 : 32,
    fontWeight: 'bold',
    color: '#1a1a1a',
    marginBottom: isSmallDevice ? 6 : 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
  },
  formContainer: {
    backgroundColor: '#ffffff',
    borderRadius: isSmallDevice ? 20 : 24,
    padding: isSmallDevice ? 24 : 30,
    marginTop: isSmallDevice ? 16 : 20,
    elevation: 8,
    boxShadow: '0px 6px 20px rgba(0, 0, 0, 0.1)',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  welcomeText: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: '700',
    color: '#1a1a1a',
    textAlign: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
    letterSpacing: -0.3,
  },
  loginSubtext: {
    fontSize: isSmallDevice ? 15 : 16,
    color: '#666666',
    textAlign: 'center',
    marginBottom: isSmallDevice ? 24 : 30,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: isSmallDevice ? 10 : 12,
    paddingHorizontal: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 14 : 16,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    paddingVertical: 16,
    fontSize: 16,
    color: '#1a1a1a',
    fontWeight: '500',
  },
  eyeIcon: {
    padding: 8,
  },
  loginButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    elevation: 4,
    boxShadow: '0px 3px 8px rgba(102, 126, 234, 0.3)',
  },
  buttonContent: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  linkButton: {
    marginTop: 20,
    alignItems: 'center',
  },
  linkText: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '500',
  },
  signupContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#e9ecef',
  },
  signupText: {
    color: '#666',
    fontSize: 16,
  },
  signupLink: {
    color: '#667eea',
    fontSize: 16,
    fontWeight: '600',
  },
});
