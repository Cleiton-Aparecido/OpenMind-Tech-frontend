import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';
import React from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function ExploreScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const tintColor = useThemeColor({}, 'tint');
  const textColor = useThemeColor({}, 'text');

  const professionals = [
    {
      name: 'Lucas Ferreira',
      role: 'Senior React Developer',
      company: 'Tech Innovations',
      skills: ['React', 'TypeScript', 'Next.js'],
      experience: '5 anos',
      location: 'São Paulo, SP'
    },
    {
      name: 'Fernanda Lima',
      role: 'Data Scientist',
      company: 'AI Solutions',
      skills: ['Python', 'Machine Learning', 'TensorFlow'],
      experience: '4 anos',
      location: 'Rio de Janeiro, RJ'
    },
    {
      name: 'Pedro Santos',
      role: 'DevOps Engineer',
      company: 'Cloud Systems',
      skills: ['AWS', 'Docker', 'Kubernetes'],
      experience: '6 anos',
      location: 'Belo Horizonte, MG'
    },
    {
      name: 'Juliana Costa',
      role: 'UX/UI Designer',
      company: 'Design Studio',
      skills: ['Figma', 'Adobe XD', 'Prototyping'],
      experience: '3 anos',
      location: 'Curitiba, PR'
    },
    {
      name: 'Rafael Oliveira',
      role: 'Mobile Developer',
      company: 'App Factory',
      skills: ['React Native', 'Flutter', 'Swift'],
      experience: '4 anos',
      location: 'Brasília, DF'
    },
    {
      name: 'Amanda Silva',
      role: 'Cybersecurity Analyst',
      company: 'SecureTech',
      skills: ['Penetration Testing', 'CISSP', 'Firewall'],
      experience: '5 anos',
      location: 'Porto Alegre, RS'
    }
  ];

  const skillColors = [
    '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FECA57', '#FF9FF3'
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <ThemedView style={styles.header}>
          <ThemedText type="title" style={styles.headerTitle}>
            Explorar Profissionais
          </ThemedText>
          <ThemedText style={styles.headerSubtitle}>
            Descubra talentos incríveis em tecnologia
          </ThemedText>
        </ThemedView>

        {/* Search Bar */}
        <ThemedView style={styles.searchSection}>
          <ThemedView style={[styles.searchContainer, { backgroundColor }]}>
            <TextInput
              style={[styles.searchInput, { color: textColor }]}
              placeholder="Buscar por skills, cargo ou localização..."
              placeholderTextColor={useThemeColor({}, 'icon')}
            />
            <TouchableOpacity style={[styles.searchButton, { backgroundColor: tintColor }]}>
              <ThemedText style={styles.searchButtonText}>🔍</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        </ThemedView>

        {/* Filter Tags */}
        <ThemedView style={styles.filterSection}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {['Todos', 'Desenvolvimento', 'Data Science', 'Design', 'DevOps', 'Mobile'].map((filter, index) => (
              <TouchableOpacity 
                key={index} 
                style={[
                  styles.filterTag, 
                  { backgroundColor: index === 0 ? tintColor : 'transparent', borderColor: tintColor }
                ]}
              >
                <ThemedText style={[
                  styles.filterTagText, 
                  { color: index === 0 ? 'white' : tintColor }
                ]}>
                  {filter}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </ThemedView>

        {/* Professionals List */}
        <ThemedView style={styles.professionalsSection}>
          {professionals.map((professional, index) => (
            <TouchableOpacity key={index} style={styles.professionalCard}>
              <ThemedView style={[styles.cardContent, { backgroundColor }]}>
                {/* Avatar and Basic Info */}
                <ThemedView style={styles.cardHeader}>
                  <ThemedView style={[styles.avatar, { backgroundColor: skillColors[index % skillColors.length] }]}>
                    <ThemedText style={styles.avatarText}>
                      {professional.name.split(' ').map(n => n[0]).join('')}
                    </ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.basicInfo}>
                    <ThemedText type="defaultSemiBold" style={styles.professionalName}>
                      {professional.name}
                    </ThemedText>
                    <ThemedText style={styles.professionalRole}>
                      {professional.role}
                    </ThemedText>
                    <ThemedText style={[styles.company, { color: tintColor }]}>
                      {professional.company}
                    </ThemedText>
                  </ThemedView>
                  <TouchableOpacity style={[styles.connectBtn, { backgroundColor: tintColor }]}>
                    <ThemedText style={styles.connectBtnText}>Conectar</ThemedText>
                  </TouchableOpacity>
                </ThemedView>

                {/* Skills */}
                <ThemedView style={styles.skillsContainer}>
                  {professional.skills.map((skill, skillIndex) => (
                    <ThemedView 
                      key={skillIndex} 
                      style={[styles.skillTag, { backgroundColor: `${skillColors[skillIndex % skillColors.length]}20` }]}
                    >
                      <ThemedText style={[styles.skillText, { color: skillColors[skillIndex % skillColors.length] }]}>
                        {skill}
                      </ThemedText>
                    </ThemedView>
                  ))}
                </ThemedView>

                {/* Additional Info */}
                <ThemedView style={styles.additionalInfo}>
                  <ThemedView style={styles.infoItem}>
                    <ThemedText style={styles.infoLabel}>📍 {professional.location}</ThemedText>
                  </ThemedView>
                  <ThemedView style={styles.infoItem}>
                    <ThemedText style={styles.infoLabel}>💼 {professional.experience}</ThemedText>
                  </ThemedView>
                </ThemedView>
              </ThemedView>
            </TouchableOpacity>
          ))}
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  searchSection: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  searchInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
  },
  searchButton: {
    padding: 12,
    borderRadius: 12,
    margin: 4,
  },
  searchButtonText: {
    fontSize: 16,
  },
  filterSection: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  filterTag: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    borderWidth: 1,
  },
  filterTagText: {
    fontSize: 14,
    fontWeight: '500',
  },
  professionalsSection: {
    paddingHorizontal: 20,
  },
  professionalCard: {
    marginBottom: 16,
  },
  cardContent: {
    padding: 16,
    borderRadius: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  basicInfo: {
    flex: 1,
  },
  professionalName: {
    fontSize: 16,
    marginBottom: 4,
  },
  professionalRole: {
    fontSize: 14,
    opacity: 0.7,
    marginBottom: 2,
  },
  company: {
    fontSize: 13,
    fontWeight: '500',
  },
  connectBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  connectBtnText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  skillTag: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 8,
    marginBottom: 4,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '500',
  },
  additionalInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoItem: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 12,
    opacity: 0.7,
  },
});
