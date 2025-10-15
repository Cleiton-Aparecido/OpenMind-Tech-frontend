import { ThemedText } from '@/components/ThemedText';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import { Animated, Dimensions, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

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
    completedQuizzes: 47,
    createdContent: 12
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

  const leaderboard = [
    { name: 'Maria Santos', points: 3420, rank: 1, avatar: '👩‍💻' },
    { name: 'Pedro Costa', points: 3150, rank: 2, avatar: '👨‍💼' },
    { name: 'João Silva', points: 2850, rank: 3, avatar: '👨‍🎓' },
    { name: 'Ana Oliveira', points: 2650, rank: 4, avatar: '👩‍🔬' },
    { name: 'Carlos Lima', points: 2420, rank: 5, avatar: '👨‍💻' },
  ];

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
                  <ThemedText style={styles.avatarText}>👨‍🎓</ThemedText>
                </View>
                <View style={styles.profileInfo}>
                  <ThemedText style={styles.userName}>Olá, {userData.name}!</ThemedText>
                  <ThemedText style={styles.userLevel}>Nível {userData.level}</ThemedText>
                </View>
                <TouchableOpacity style={styles.notificationButton}>
                  <Ionicons name="notifications" size={24} color="#667eea" />
                </TouchableOpacity>
              </View>
              
              <View style={styles.statsRow}>
                <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
                  <ThemedText style={styles.statNumber}>{userData.points.toLocaleString()}</ThemedText>
                  <ThemedText style={styles.statLabel}>Pontos</ThemedText>
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
                  <ThemedText style={styles.statNumber}>#{userData.rank}</ThemedText>
                  <ThemedText style={styles.statLabel}>Ranking</ThemedText>
                </Animated.View>
                <Animated.View style={[styles.statCard, { transform: [{ scale: scaleAnim }] }]}>
                  <ThemedText style={styles.statNumber}>{userData.streak}</ThemedText>
                  <ThemedText style={styles.statLabel}>Sequência</ThemedText>
                </Animated.View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Ações Rápidas */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🚀 Ações Rápidas
          </ThemedText>
          <View style={styles.quickActionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity key={index} style={styles.quickActionCard}>
                <View style={styles.quickActionContent}>
                  <View style={[styles.iconContainer, { backgroundColor: action.color }]}>
                    <Ionicons name={action.icon as any} size={isSmallDevice ? 16 : 20} color="white" />
                  </View>
                  <ThemedText style={styles.quickActionTitle}>{action.title}</ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Ranking Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🏆 Top Ranking
          </ThemedText>
          <View style={styles.rankingContainer}>
            {leaderboard.slice(0, 5).map((user, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.rankingItem, 
                  user.rank === userData.rank && styles.currentUserRank
                ]}
              >
                <View style={styles.rankingLeft}>
                  <View style={[styles.rankBadge, { backgroundColor: user.rank <= 3 ? '#FFD700' : '#000000ff' }]}>
                    <ThemedText style={[styles.rankNumber, { color: user.rank <= 3 ? '#333' : '#666' }]}>
                      {user.rank}
                    </ThemedText>
                  </View>
                  <ThemedText style={styles.rankingAvatar}>{user.avatar}</ThemedText>
                  <View style={styles.rankingInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.rankingName}>
                      {user.name}
                    </ThemedText>
                    <ThemedText style={styles.rankingPoints}>
                      {user.points.toLocaleString()} pontos
                    </ThemedText>
                  </View>
                </View>
                {user.rank === userData.rank && (
                  <ThemedText style={styles.youLabel}>Você</ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Categories Section */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            📚 Áreas de Estudo
          </ThemedText>
          <View style={styles.categoriesGrid}>
            {techCategories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <View style={styles.categoryContent}>
                  <View style={[styles.categoryIconContainer, { backgroundColor: category.color }]}>
                    <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                  </View>
                  <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>
                    {category.title}
                  </ThemedText>
                  <ThemedText style={styles.categoryDescription}>
                    {category.description}
                  </ThemedText>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Atividade Recente */}
        <Animated.View style={[styles.section, { opacity: fadeAnim }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            📈 Suas Estatísticas
          </ThemedText>
          <View style={styles.activityContainer}>
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Ionicons name="trophy" size={20} color="#FFD700" />
                <ThemedText type="defaultSemiBold">Quizzes Completados</ThemedText>
              </View>
              <ThemedText style={styles.activityNumber}>{userData.completedQuizzes}</ThemedText>
            </View>
            <View style={styles.activityCard}>
              <View style={styles.activityHeader}>
                <Ionicons name="create" size={20} color="#667eea" />
                <ThemedText type="defaultSemiBold">Conteúdo Criado</ThemedText>
              </View>
              <ThemedText style={styles.activityNumber}>{userData.createdContent}</ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Call to Action */}
        <Animated.View style={[styles.ctaSection, { opacity: fadeAnim }]}>
          <View style={styles.ctaContent}>
            <ThemedText type="defaultSemiBold" style={styles.ctaTitle}>
              🎯 Continue Aprendendo!
            </ThemedText>
            <ThemedText style={styles.ctaDescription}>
              Desafie-se com novos quizzes e suba no ranking
            </ThemedText>
            <TouchableOpacity style={styles.ctaButton}>
              <ThemedText style={styles.ctaButtonText}>Começar Quiz</ThemedText>
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
  avatarText: {
    fontSize: 24,
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
  },
  quickActionCard: {
    width: isSmallDevice ? (width - 48) / 2 : (width - 50) / 2,
    marginBottom: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 12 : 16,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  quickActionContent: {
    padding: isSmallDevice ? 12 : 16,
    alignItems: 'center',
    minHeight: isSmallDevice ? 80 : 90,
    justifyContent: 'center',
  },
  iconContainer: {
    width: isSmallDevice ? 32 : 36,
    height: isSmallDevice ? 32 : 36,
    borderRadius: isSmallDevice ? 16 : 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  quickActionTitle: {
    color: '#333333',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  rankingContainer: {
    backgroundColor: '#ffffff',
  },
  rankingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: isSmallDevice ? 12 : 16,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  currentUserRank: {
    backgroundColor: '#e8f0fe',
    borderColor: '#667eea',
    borderWidth: 2,
    boxShadow: '0px 2px 6px rgba(102, 126, 234, 0.15)',
    elevation: 2,
  },
  rankingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rankBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  rankNumber: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  rankingAvatar: {
    fontSize: 24,
    marginRight: 12,
  },
  rankingInfo: {
    flex: 1,
  },
  rankingName: {
    fontSize: 16,
  },
  rankingPoints: {
    fontSize: 12,
    opacity: 0.7,
    marginTop: 2,
  },
  youLabel: {
    backgroundColor: '#667eea',
    color: 'white',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    fontSize: 12,
    fontWeight: '600',
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: isSmallDevice ? (width - 48) / 2 : (width - 50) / 2,
    marginBottom: isSmallDevice ? 12 : 15,
    borderRadius: isSmallDevice ? 12 : 16,
    overflow: 'hidden',
    elevation: 3,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryContent: {
    padding: isSmallDevice ? 12 : 16,
    alignItems: 'center',
    minHeight: isSmallDevice ? 100 : 110,
    justifyContent: 'center',
  },
  categoryIconContainer: {
    width: isSmallDevice ? 40 : 48,
    height: isSmallDevice ? 40 : 48,
    borderRadius: isSmallDevice ? 20 : 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: isSmallDevice ? 6 : 8,
  },
  categoryIcon: {
    fontSize: isSmallDevice ? 20 : 24,
  },
  categoryTitle: {
    color: '#333333',
    fontSize: isSmallDevice ? 12 : 14,
    fontWeight: '600',
    marginBottom: isSmallDevice ? 3 : 4,
    textAlign: 'center',
  },
  categoryDescription: {
    color: '#666666',
    fontSize: isSmallDevice ? 9 : 11,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 12 : 14,
  },
  activityContainer: {
    flexDirection: isSmallDevice ? 'column' : 'row',
    justifyContent: 'space-between',
  },
  activityCard: {
    flex: isSmallDevice ? 0 : 1,
    backgroundColor: '#f8f9fa',
    padding: isSmallDevice ? 14 : 16,
    borderRadius: 12,
    marginHorizontal: isSmallDevice ? 0 : 6,
    marginBottom: isSmallDevice ? 12 : 0,
    borderWidth: 1,
    borderColor: '#e9ecef',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  activityNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#667eea',
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
