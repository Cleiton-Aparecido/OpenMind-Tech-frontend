import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
    Alert,
    Animated,
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;

export default function CreateScreen() {
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
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View style={[styles.header, { opacity: fadeAnim }]}>
          <View style={styles.headerWhite}>
            <View style={styles.headerContent}>
              <Text style={styles.headerTitle}>Criar Conteúdo</Text>
              <Text style={styles.headerSubtitle}>
                Compartilhe seu conhecimento com a comunidade
              </Text>
            </View>
          </View>
        </Animated.View>

        {/* Content Types Grid */}
        <Animated.View style={[
          styles.contentContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <Text style={styles.sectionTitle}>
            🎯 Escolha o tipo de conteúdo
          </Text>
          
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
                      <Ionicons name={item.icon as any} size={isSmallDevice ? 22 : 26} color="white" />
                    </View>
                    <Text style={styles.cardTitle}>{item.title}</Text>
                    <Text style={styles.cardDescription}>
                      {item.description}
                    </Text>
                    <View style={styles.cardArrow}>
                      <Ionicons name="arrow-forward" size={18} color={item.color} />
                    </View>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            ))}
          </View>
        </Animated.View>

        {/* Quick Stats */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <Text style={styles.sectionTitle}>
            📊 Suas Estatísticas
          </Text>
          <View style={styles.statsGrid}>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#667eea' }]}>12</Text>
              <Text style={styles.statLabel}>Conteúdos Criados</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#f093fb' }]}>1.2k</Text>
              <Text style={styles.statLabel}>Visualizações</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={[styles.statNumber, { color: '#43e97b' }]}>89%</Text>
              <Text style={styles.statLabel}>Taxa de Acerto</Text>
            </View>
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
    gap: isSmallDevice ? 10 : 12,
  },
  contentCard: {
    width: '48%',
    marginBottom: isSmallDevice ? 8 : 10,
  },
  cardTouchable: {
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  cardContent: {
    padding: isSmallDevice ? 12 : 16,
    minHeight: isSmallDevice ? 160 : 180,
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
  },
  cardIcon: {
    width: isSmallDevice ? 44 : 52,
    height: isSmallDevice ? 44 : 52,
    borderRadius: isSmallDevice ? 22 : 26,
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    marginBottom: isSmallDevice ? 8 : 10,
  },
  cardTitle: {
    color: '#1a1a1a',
    fontSize: isSmallDevice ? 13 : 15,
    fontWeight: '700',
    marginBottom: isSmallDevice ? 4 : 6,
    textAlign: 'center',
    letterSpacing: -0.3,
  },
  cardDescription: {
    color: '#666666',
    fontSize: isSmallDevice ? 10 : 11,
    textAlign: 'center',
    lineHeight: isSmallDevice ? 14 : 15,
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
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e0e0e0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  statNumber: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: 'bold',
    marginBottom: isSmallDevice ? 3 : 4,
  },
  statLabel: {
    fontSize: isSmallDevice ? 11 : 12,
    color: '#666',
    textAlign: 'center',
  },
});
