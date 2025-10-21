import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isLargeDevice = width >= 414;
export default function HomeScreen() {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // Dados do usuário (mockado)
  const userData = {
    name: 'João Silva',
    points: 2850,
    rank: 3,
    level: 'Expert',
    streak: 15,
  };

  const techCategories = [
    { icon: '💻', title: 'Programação', description: 'Algoritmos, Estruturas de Dados', color: '#667eea' },
    { icon: '🌐', title: 'Desenvolvimento Web', description: 'HTML, CSS, JavaScript, React', color: '#f093fb' },
    { icon: '📱', title: 'Mobile', description: 'React Native, Flutter, Swift', color: '#4facfe' },
    { icon: '📊', title: 'Data Science', description: 'Python, R, Machine Learning', color: '#43e97b' },
    { icon: '☁️', title: 'Cloud Computing', description: 'AWS, Azure, GCP', color: '#fa709a' },
    { icon: '🔒', title: 'Cibersegurança', description: 'Ethical Hacking, Redes', color: '#ff9a9e' },
  ];

  const quickActions = [
    { icon: 'add-circle', title: 'Criar Quiz', color: '#667eea', route: '/quiz/create' },
    { icon: 'book', title: 'Exercícios', color: '#f093fb', route: '/exercises' },
    { icon: 'bulb', title: 'Charadas', color: '#4facfe', route: '/riddles' },
    { icon: 'library', title: 'Tópicos', color: '#43e97b', route: '/topics' },
  ];

// O componente exporta APENAS o navegador, SEM o <NavigationContainer>
export default function AuthStack() {
  return (
    <View style={styles.container}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header com Profile do Usuário */}
        <Animated.View style={[styles.animatedContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          <View style={styles.headerWhite}>
            <View style={[styles.headerContent, { backgroundColor: 'transparent' }]}>
              <View style={styles.profileSection}>
                <View style={styles.avatarContainer}>
                  <Ionicons name="person" size={28} color="#667eea" />
                </View>
                <View style={styles.profileInfo}>
                  <Text style={styles.userName}>Olá, {userData.name}!</Text>
                  <Text style={styles.userLevel}>Nível {userData.level}</Text>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                  <Ionicons name="notifications" size={24} color="#667eea" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.statsRow}>
                <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
                  <Text style={styles.statNumber}>{userData.points.toLocaleString()}</Text>
                  <Text style={styles.statLabel}>Pontos</Text>
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
                  <Text style={styles.statNumber}>#{userData.rank}</Text>
                  <Text style={styles.statLabel}>Ranking</Text>
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
                  <Text style={styles.statNumber}>{userData.streak}</Text>
                  <Text style={styles.statLabel}>Sequência</Text>
                </Animated.View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Ações Rápidas */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>🚀 Ações Rápidas</Text>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <View style={styles.quickActionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon as any} size={isSmallDevice ? 16 : 20} color="white" />
                  </View>
                  <Text style={styles.quickActionTitle}>{action.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>📚 Áreas de Estudo</Text>
          <View style={styles.categoriesGrid}>
            {techCategories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={styles.categoryContent}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                    <Text style={styles.categoryIcon}>{category.icon}</Text>
                  </View>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Call to Action */}
        <Animated.View style={[styles.ctaSection, { opacity: fadeAnim }]}>
          <View style={styles.ctaContent}>
            <Text style={styles.ctaTitle}>Continue Aprendendo!</Text>
            <Text style={styles.ctaDescription}>
              Desafie-se com novos quizzes e suba no ranking
            </Text>
            <TouchableOpacity style={styles.ctaButton}>
              <Text style={styles.ctaButtonText}>Começar Quiz</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollView: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  animatedContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  headerWhite: {
    backgroundColor: '#ffffff',
    paddingTop: isSmallDevice ? 50 : 60,
    paddingBottom: isSmallDevice ? 20 : 30,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
  },
  headerGradient: {
    paddingTop: isSmallDevice ? 50 : 60,
    paddingBottom: isSmallDevice ? 20 : 30,
    paddingHorizontal: isSmallDevice ? 16 : 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  profileInfo: {
    flex: 1,
  },
  userName: {
    color: '#333333',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userLevel: {
    color: '#666666',
    fontSize: 14,
  },
  notificationButton: {
    padding: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
  statCard: {
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingVertical: isSmallDevice ? 8 : 12,
    paddingHorizontal: isSmallDevice ? 8 : 16,
    borderRadius: 12,
    minWidth: isSmallDevice ? 65 : 80,
    flex: 1,
    marginHorizontal: isSmallDevice ? 2 : 4,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  statNumber: {
    color: '#667eea',
    fontSize: isSmallDevice ? 16 : 20,
    fontWeight: 'bold',
  },
  statLabel: {
    color: '#000000ff',
    fontSize: isSmallDevice ? 10 : 12,
    marginTop: 4,
  },
  section: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: isSmallDevice ? 20 : 25,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    marginBottom: isSmallDevice ? 12 : 16,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 8 : 10,
  },
  quickActionCard: {
    width: '48%',
    marginBottom: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 12 : 16,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  quickActionContent: {
    padding: isSmallDevice ? 16 : 20,
    alignItems: 'center',
    minHeight: isSmallDevice ? 100 : 110,
    justifyContent: 'center',
  },
  iconContainer: {
    width: isSmallDevice ? 40 : 48,
    height: isSmallDevice ? 40 : 48,
    borderRadius: isSmallDevice ? 20 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallDevice ? 8 : 10,
  },
  quickActionTitle: {
    color: '#333333',
    fontSize: isSmallDevice ? 13 : 15,
    fontWeight: '600',
    textAlign: 'center',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: isSmallDevice ? 8 : 10,
  },
  categoryCard: {
    width: isSmallDevice ? '48%' : '48%',
    marginBottom: isSmallDevice ? 8 : 10,
    borderRadius: isSmallDevice ? 12 : 16,
    overflow: 'hidden',
    elevation: 3,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryContent: {
    padding: isSmallDevice ? 16 : 20,
    alignItems: 'center',
    minHeight: isSmallDevice ? 120 : 140,
    justifyContent: 'center',
  },
  categoryIconContainer: {
    width: isSmallDevice ? 50 : 60,
    height: isSmallDevice ? 50 : 60,
    borderRadius: isSmallDevice ? 25 : 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallDevice ? 10 : 12,
  },
  categoryIcon: {
    fontSize: isSmallDevice ? 28 : 32,
  },
  categoryTitle: {
    color: '#333333',
    fontSize: isSmallDevice ? 13 : 15,
    fontWeight: '700',
    marginBottom: isSmallDevice ? 6 : 8,
    textAlign: 'center',
  },
  categoryDescription: {
    color: '#666666',
    fontSize: isSmallDevice ? 10 : 12,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 14 : 16,
  },
  ctaSection: {
    marginHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  ctaContent: {
    padding: isSmallDevice ? 16 : 24,
    alignItems: 'center',
  },
  ctaTitle: {
    color: '#333333',
    fontSize: isSmallDevice ? 16 : 18,
    fontWeight: '600',
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    color: '#666666',
    fontSize: isSmallDevice ? 13 : 14,
    textAlign: 'center',
    marginBottom: isSmallDevice ? 16 : 20,
    lineHeight: isSmallDevice ? 18 : 20,
  },
  ctaButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: isSmallDevice ? 20 : 24,
    paddingVertical: isSmallDevice ? 10 : 12,
    borderRadius: 24,
    minWidth: isSmallDevice ? 120 : 140,
  },
  ctaButtonText: {
    color: 'white',
    fontSize: isSmallDevice ? 14 : 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
