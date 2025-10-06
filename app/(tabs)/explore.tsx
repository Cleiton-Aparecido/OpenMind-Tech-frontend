import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;

export default function CreateScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const contentTypes = [
    {
      icon: 'help-circle',
      title: 'Quiz Interativo',
      description: 'Crie quizzes com múltipla escolha',
      color: '#667eea',
      gradient: ['#667eea', '#764ba2'],
    },
    {
      icon: 'code-slash',
      title: 'Exercício Prático',
      description: 'Desafios de programação',
      color: '#f093fb',
      gradient: ['#f093fb', '#f5576c'],
    },
    {
      icon: 'bulb',
      title: 'Charada Tech',
      description: 'Enigmas e quebra-cabeças',
      color: '#4facfe',
      gradient: ['#4facfe', '#00f2fe'],
    },
    {
      icon: 'book',
      title: 'Tópico Educativo',
      description: 'Artigos e explicações',
      color: '#43e97b',
      gradient: ['#43e97b', '#38f9d7'],
    },
  ];

  const handleCreateContent = (type: string) => {
    Alert.alert(
      'Criar Conteúdo',
      `Você selecionou: ${type}`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Continuar', onPress: () => console.log(`Creating ${type}`) }
      ]
    );
  };

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerWhite}>
            <View style={styles.headerContent}>
              <ThemedText style={styles.headerTitle}>Criar Conteúdo</ThemedText>
              <ThemedText style={styles.headerSubtitle}>
                Compartilhe seu conhecimento com a comunidade
              </ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Content Types Grid */}
        <Animated.View style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🎯 Escolha o tipo de conteúdo
          </ThemedText>
          
          <View style={styles.contentGrid}>
            {contentTypes.map((item, index) => (
              <Animated.View
                key={index}
                style={[
                  styles.contentCard,
                  { 
                    opacity: fadeAnim,
                    transform: [{ 
                      translateY: slideAnim.interpolate({
                        inputRange: [0, 30],
                        outputRange: [0, 30 + (index * 10)],
                      })
                    }]
                  }
                ]}
              >
                <TouchableOpacity
                  style={styles.cardTouchable}
                  onPress={() => handleCreateContent(item.title)}
                  activeOpacity={0.8}
                >
                  <View style={styles.cardContent}>
                    <View style={[styles.cardIcon, { backgroundColor: item.color }]}>
                      <Ionicons name={item.icon as any} size={isSmallDevice ? 28 : 32} color="white" />
                    </View>
                    <ThemedText style={styles.cardTitle}>{item.title}</ThemedText>
                    <ThemedText style={styles.cardDescription}>
                      {item.description}
                    </ThemedText>
                    <View style={styles.cardArrow}>
                      <Ionicons name="arrow-forward" size={20} color={item.color} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            📊 Suas Estatísticas
          </ThemedText>
          <View style={styles.statsGrid}>
            <View style={[styles.statCard, { backgroundColor }]}>
              <ThemedText style={[styles.statNumber, { color: tintColor }]}>12</ThemedText>
              <ThemedText style={styles.statLabel}>Conteúdos Criados</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor }]}>
              <ThemedText style={[styles.statNumber, { color: '#f093fb' }]}>1.2k</ThemedText>
              <ThemedText style={styles.statLabel}>Visualizações</ThemedText>
            </View>
            <View style={[styles.statCard, { backgroundColor }]}>
              <ThemedText style={[styles.statNumber, { color: '#43e97b' }]}>89%</ThemedText>
              <ThemedText style={styles.statLabel}>Taxa de Acerto</ThemedText>
            </View>
          </View>
        </Animated.View>

        {/* Recent Activity */}
        <Animated.View style={[styles.recentSection, { opacity: fadeAnim }]}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            🕒 Atividade Recente
          </ThemedText>
          <View style={[styles.activityCard, { backgroundColor }]}>
            <View style={styles.activityHeader}>
              <Ionicons name="trophy" size={24} color="#FFD700" />
              <View style={styles.activityInfo}>
                <ThemedText type="defaultSemiBold">Quiz de JavaScript aprovado!</ThemedText>
                <ThemedText style={styles.activityTime}>2 horas atrás</ThemedText>
              </View>
            </View>
          </View>
          <View style={[styles.activityCard, { backgroundColor }]}>
            <View style={styles.activityHeader}>
              <Ionicons name="create" size={24} color="#667eea" />
              <View style={styles.activityInfo}>
                <ThemedText type="defaultSemiBold">Exercício de React publicado</ThemedText>
                <ThemedText style={styles.activityTime}>1 dia atrás</ThemedText>
              </View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    marginBottom: 20,
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
  headerTitle: {
    color: '#1a1a1a',
    fontSize: isSmallDevice ? 24 : 28,
    fontWeight: '700',
    marginBottom: isSmallDevice ? 6 : 8,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    color: '#666666',
    fontSize: isSmallDevice ? 15 : 16,
    textAlign: 'center',
  },
  contentContainer: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: isSmallDevice ? 20 : 30,
    backgroundColor: '#ffffff',
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    marginBottom: isSmallDevice ? 12 : 16,
    fontWeight: '700',
    color: '#1a1a1a',
    letterSpacing: -0.5,
  },
  contentGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  contentCard: {
    width: isSmallDevice ? (width - 40) / 2 : (width - 50) / 2,
    marginBottom: isSmallDevice ? 12 : 16,
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    boxShadow: '0px 3px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  cardContent: {
    padding: isSmallDevice ? 16 : 20,
    minHeight: isSmallDevice ? 140 : 160,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  cardIcon: {
    width: isSmallDevice ? 48 : 56,
    height: isSmallDevice ? 48 : 56,
    borderRadius: isSmallDevice ? 24 : 28,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    color: '#1a1a1a',
    fontSize: isSmallDevice ? 15 : 16,
    fontWeight: '700',
    marginBottom: isSmallDevice ? 6 : 8,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  cardDescription: {
    color: '#666666',
    fontSize: isSmallDevice ? 11 : 12,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 15 : 16,
  },
  cardArrow: {
    alignItems: 'center',
    marginTop: 12,
  },
  statsSection: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: isSmallDevice ? 20 : 30,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    padding: isSmallDevice ? 12 : 16,
    marginHorizontal: isSmallDevice ? 2 : 4,
    borderRadius: 12,
    elevation: 2,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
  },
  statNumber: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: 'bold',
    marginBottom: isSmallDevice ? 3 : 4,
  },
  statLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  recentSection: {
    paddingHorizontal: isSmallDevice ? 16 : 20,
    marginBottom: isSmallDevice ? 20 : 30,
  },
  activityCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    elevation: 2,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#e9ecef',
    boxShadow: '0px 1px 3px rgba(0, 0, 0, 0.05)',
  },
  activityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activityInfo: {
    marginLeft: 12,
    flex: 1,
  },
  activityTime: {
    fontSize: 12,
    opacity: 0.6,
    marginTop: 2,
  },
});
