import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import {
    Dimensions,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width } = Dimensions.get('window');
const isSmallDevice = width < 375;

// Dados de exemplo para o feed
const feedData = [
  {
    id: '1',
    type: 'Quiz',
    title: 'Quiz Avançado de TypeScript',
    description: 'Teste seus conhecimentos em tipos genéricos, decorators e mais.',
    author: 'Ana Silva',
    tags: ['#TypeScript', '#Frontend', '#Quiz'],
    color: '#E8F5E9',
  },
  {
    id: '2',
    type: 'Exercício',
    title: 'Construindo um Hook customizado',
    description: "Desafio prático: crie um hook 'useLocalStorage'.",
    author: 'Bruno Costa',
    tags: ['#React', '#Hooks', '#Exercício'],
    color: '#FFF3E0',
  },
  {
    id: '3',
    type: 'Tópico',
    title: 'O que é Expo Router?',
    description: '',
    author: 'Admin',
    tags: [],
    color: '#F3E5F5',
  },
];

export default function HomeScreen() {
  const renderFeedItem = ({ item }: { item: typeof feedData[0] }) => (
    <TouchableOpacity style={styles.feedCard} activeOpacity={0.7}>
      <View style={styles.feedHeader}>
        <View style={[styles.typeBadge, { backgroundColor: item.color }]}>
          <Text style={styles.typeText}>{item.type}</Text>
        </View>
        <Text style={styles.authorText}>por {item.author}</Text>
      </View>

      <Text style={styles.feedTitle}>{item.title}</Text>
      
      {item.description ? (
        <Text style={styles.feedDescription}>{item.description}</Text>
      ) : null}

      {item.tags.length > 0 && (
        <View style={styles.tagsContainer}>
          {item.tags.map((tag, index) => (
            <View key={index} style={styles.tag}>
              <Text style={styles.tagText}>{tag}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.logo}>
            <Text style={styles.logoIcon}>🧠</Text>
          </View>
          <Text style={styles.headerTitle}>OpenMind Tech</Text>
        </View>
        <TouchableOpacity style={styles.profileButton}>
          <Ionicons name="person-outline" size={24} color="#333" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Card de Boas-vindas */}
        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Olá, Dev!</Text>
          <Text style={styles.welcomeSubtitle}>Continue seu progresso!</Text>
          
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>12</Text>
              <Text style={styles.statLabel}>Nível</Text>
            </View>
          </View>
        </View>

        {/* Feed Section */}
        <View style={styles.feedSection}>
          <Text style={styles.sectionTitle}>Seu Feed</Text>
          
          {feedData.map((item) => (
            <View key={item.id}>
              {renderFeedItem({ item })}
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e8ed',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logo: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 2,
    borderColor: '#667eea',
  },
  logoIcon: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f9fa',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
  },
  welcomeCard: {
    backgroundColor: '#667eea',
    marginHorizontal: 16,
    marginTop: 16,
    marginBottom: 20,
    padding: 24,
    borderRadius: 16,
    elevation: 4,
    shadowColor: '#667eea',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  welcomeTitle: {
    fontSize: isSmallDevice ? 22 : 24,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: isSmallDevice ? 14 : 15,
    color: '#e6e9ff',
    marginBottom: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statItem: {
    alignItems: 'flex-start',
  },
  statNumber: {
    fontSize: isSmallDevice ? 32 : 36,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#e6e9ff',
  },
  feedSection: {
    paddingHorizontal: 16,
    paddingBottom: 24,
  },
  sectionTitle: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  feedCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#e1e8ed',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#333',
  },
  authorText: {
    fontSize: 12,
    color: '#666',
  },
  feedTitle: {
    fontSize: isSmallDevice ? 16 : 17,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    lineHeight: 22,
  },
  feedDescription: {
    fontSize: isSmallDevice ? 13 : 14,
    color: '#666',
    lineHeight: 20,
    marginBottom: 12,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#f0f8ff',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#667eea',
  },
  tagText: {
    fontSize: 11,
    color: '#667eea',
    fontWeight: '500',
  },
});
