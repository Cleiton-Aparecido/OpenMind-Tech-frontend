import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Dimensions, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');

  const techCategories = [
    { icon: '💻', title: 'Desenvolvimento', description: 'Frontend, Backend, Mobile' },
    { icon: '📊', title: 'Data Science', description: 'IA, Machine Learning, Analytics' },
    { icon: '☁️', title: 'Cloud & DevOps', description: 'AWS, Azure, Docker, Kubernetes' },
    { icon: '🔒', title: 'Cybersecurity', description: 'Segurança da Informação' },
    { icon: '🎨', title: 'UI/UX Design', description: 'Design de Interfaces' },
    { icon: '📱', title: 'Mobile Dev', description: 'iOS, Android, React Native' },
  ];

  const recentMembers = [
    { name: 'Ana Silva', role: 'Full Stack Developer', tech: 'React, Node.js' },
    { name: 'Carlos Santos', role: 'Data Scientist', tech: 'Python, TensorFlow' },
    { name: 'Maria Costa', role: 'UX Designer', tech: 'Figma, Adobe XD' },
    { name: 'João Oliveira', role: 'DevOps Engineer', tech: 'AWS, Docker' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <LinearGradient
          colors={['#667eea', '#764ba2']}
          style={styles.headerGradient}
        >
          <ThemedView style={[styles.headerContent, { backgroundColor: 'transparent' }]}>
            <ThemedText type="title" style={styles.welcomeTitle}>
              OpenMind Tech
            </ThemedText>
            <ThemedText style={styles.welcomeSubtitle}>
              Conecte-se com profissionais de tecnologia
            </ThemedText>
            <ThemedText style={styles.welcomeDescription}>
              Descubra talentos, compartilhe conhecimento e construa sua rede profissional
            </ThemedText>
          </ThemedView>
        </LinearGradient>

        {/* Stats Section */}
        <ThemedView style={styles.statsContainer}>
          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              1.2K+
            </ThemedText>
            <ThemedText style={styles.statLabel}>Desenvolvedores</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              500+
            </ThemedText>
            <ThemedText style={styles.statLabel}>Empresas</ThemedText>
          </ThemedView>
          <ThemedView style={styles.statItem}>
            <ThemedText type="title" style={[styles.statNumber, { color: tintColor }]}>
              150+
            </ThemedText>
            <ThemedText style={styles.statLabel}>Eventos</ThemedText>
          </ThemedView>
        </ThemedView>

        {/* Categories Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Áreas de Tecnologia
          </ThemedText>
          <ThemedView style={styles.categoriesGrid}>
            {techCategories.map((category, index) => (
              <TouchableOpacity key={index} style={styles.categoryCard}>
                <ThemedView style={[styles.categoryContent, { backgroundColor }]}>
                  <ThemedText style={styles.categoryIcon}>{category.icon}</ThemedText>
                  <ThemedText type="defaultSemiBold" style={styles.categoryTitle}>
                    {category.title}
                  </ThemedText>
                  <ThemedText style={styles.categoryDescription}>
                    {category.description}
                  </ThemedText>
                </ThemedView>
              </TouchableOpacity>
            ))}
          </ThemedView>
        </ThemedView>

        {/* Recent Members Section */}
        <ThemedView style={styles.section}>
          <ThemedText type="defaultSemiBold" style={styles.sectionTitle}>
            Novos Membros
          </ThemedText>
          {recentMembers.map((member, index) => (
            <TouchableOpacity key={index} style={styles.memberCard}>
              <ThemedView style={[styles.memberContent, { backgroundColor }]}>
                <ThemedView style={styles.memberAvatar}>
                  <ThemedText style={styles.memberInitial}>
                    {member.name.charAt(0)}
                  </ThemedText>
                </ThemedView>
                <ThemedView style={styles.memberInfo}>
                  <ThemedText type="defaultSemiBold">{member.name}</ThemedText>
                  <ThemedText style={styles.memberRole}>{member.role}</ThemedText>
                  <ThemedText style={[styles.memberTech, { color: tintColor }]}>
                    {member.tech}
                  </ThemedText>
                </ThemedView>
                <TouchableOpacity style={[styles.connectButton, { backgroundColor: tintColor }]}>
                  <ThemedText style={styles.connectButtonText}>Conectar</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>

        {/* Call to Action */}
        <ThemedView style={styles.ctaSection}>
          <LinearGradient
            colors={['#FF6B6B', '#FF8E53']}
            style={styles.ctaGradient}
          >
            <ThemedText type="defaultSemiBold" style={styles.ctaTitle}>
              Pronto para expandir sua rede?
            </ThemedText>
            <ThemedText style={styles.ctaDescription}>
              Junte-se à maior comunidade de profissionais de TI do Brasil
            </ThemedText>
            <TouchableOpacity style={styles.ctaButton}>
              <ThemedText style={styles.ctaButtonText}>Começar Agora</ThemedText>
            </TouchableOpacity>
          </LinearGradient>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerGradient: {
    paddingTop: 60,
    paddingBottom: 40,
    paddingHorizontal: 20,
  },
  headerContent: {
    alignItems: 'center',
  },
  welcomeTitle: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'center',
  },
  welcomeSubtitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    textAlign: 'center',
  },
  welcomeDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 30,
    marginHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.7,
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 20,
    marginBottom: 16,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryCard: {
    width: (width - 50) / 2,
    marginBottom: 15,
  },
  categoryContent: {
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryTitle: {
    fontSize: 14,
    marginBottom: 4,
    textAlign: 'center',
  },
  categoryDescription: {
    fontSize: 12,
    opacity: 0.7,
    textAlign: 'center',
  },
  memberCard: {
    marginBottom: 12,
  },
  memberContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  memberAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  memberInitial: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  memberInfo: {
    flex: 1,
  },
  memberRole: {
    fontSize: 14,
    opacity: 0.7,
    marginTop: 2,
  },
  memberTech: {
    fontSize: 12,
    marginTop: 4,
  },
  connectButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  connectButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  ctaSection: {
    marginHorizontal: 20,
    marginBottom: 30,
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    padding: 24,
    alignItems: 'center',
  },
  ctaTitle: {
    color: 'white',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  ctaDescription: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 20,
    lineHeight: 20,
  },
  ctaButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  ctaButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});
