import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
    Animated,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';

const { width, height } = Dimensions.get('window');
const isSmallDevice = width < 375;
const isMediumDevice = width >= 375 && width < 414;
const isTablet = width >= 768;

interface QuizQuestion {
  id: number;   
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  category: string;
}

const sampleQuiz: QuizQuestion[] = [
  {
    id: 1,
    question: 'Qual é o hook usado para gerenciar estado em componentes funcionais do React?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correctAnswer: 1,
    explanation: 'useState é o hook fundamental para adicionar estado local a componentes funcionais.',
    category: 'React'
  },
  {
    id: 2,
    question: 'Qual dessas estruturas de dados tem complexidade O(1) para inserção e remoção?',
    options: ['Array', 'Linked List', 'Stack', 'Binary Tree'],
    correctAnswer: 2,
    explanation: 'Stack (pilha) tem complexidade O(1) para push e pop quando implementada corretamente.',
    category: 'Estruturas de Dados'
  },
  {
    id: 3,
    question: 'Qual é a principal diferença entre SQL e NoSQL?',
    options: [
      'SQL é mais rápido',
      'NoSQL não suporta transações',
      'SQL usa esquema fixo, NoSQL é flexível',
      'NoSQL é sempre melhor para big data'
    ],
    correctAnswer: 2,
    explanation: 'A principal diferença é que SQL usa esquema estruturado e fixo, enquanto NoSQL oferece flexibilidade de esquema.',
    category: 'Banco de Dados'
  }
];

export default function QuizScreen() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);
  
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    startQuestionAnimation();
  }, [currentQuestionIndex]);

  const startQuestionAnimation = () => {
    fadeAnim.setValue(0);
    slideAnim.setValue(50);
    
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Animar barra de progresso
    Animated.timing(progressAnim, {
      toValue: (currentQuestionIndex + 1) / sampleQuiz.length,
      duration: 300,
      useNativeDriver: false,
    }).start();
  };

  const handleAnswerSelect = (answerIndex: number) => {
    if (selectedAnswer !== null) return;
    
    setSelectedAnswer(answerIndex);
    setShowExplanation(true);
    
    if (answerIndex === sampleQuiz[currentQuestionIndex].correctAnswer) {
      setScore(score + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < sampleQuiz.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      setQuizCompleted(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setScore(0);
    setQuizCompleted(false);
  };

  const currentQuestion = sampleQuiz[currentQuestionIndex];
  const progress = progressAnim;

  if (quizCompleted) {
    return (
      <View style={styles.container}>
        <View style={styles.whiteBackground}>
          <View style={styles.completedContainer}>
            <View style={styles.scoreCircle}>
              <Text style={styles.scoreText}>{score}/{sampleQuiz.length}</Text>
            </View>
            <Text style={styles.completedTitle}>Quiz Concluído!</Text>
            <Text style={styles.completedSubtitle}>
              Você acertou {score} de {sampleQuiz.length} questões
            </Text>
            <Text style={styles.completedPercentage}>
              {Math.round((score / sampleQuiz.length) * 100)}%
            </Text>
            
            <TouchableOpacity style={styles.restartButton} onPress={restartQuiz}>
              <Text style={styles.restartButtonText}>Tentar Novamente</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.whiteBackground}>
        {/* Header com progresso */}
        <View style={styles.header}>
          <View style={styles.progressContainer}>
            <View style={styles.progressBackground}>
              <Animated.View 
                style={[
                  styles.progressBar,
                  { width: progress.interpolate({
                    inputRange: [0, 1],
                    outputRange: ['0%', '100%'],
                    extrapolate: 'clamp',
                  }) }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
              {currentQuestionIndex + 1} de {sampleQuiz.length}
            </Text>
          </View>
        </View>

        {/* Conteúdo da questão */}
        <Animated.View style={[
          styles.questionContainer,
          { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }
        ]}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{currentQuestion.category}</Text>
          </View>
          
          <Text style={styles.questionText}>{currentQuestion.question}</Text>
          
          <View style={styles.optionsContainer}>
            {currentQuestion.options.map((option, index) => {
              let optionStyle = styles.optionButton;
              let textStyle = styles.optionText;
              
              if (selectedAnswer !== null) {
                if (index === currentQuestion.correctAnswer) {
                  optionStyle = { ...styles.optionButton, ...styles.correctOption };
                  textStyle = { ...styles.optionText, color: '#2E7D2E' };
                } else if (index === selectedAnswer && index !== currentQuestion.correctAnswer) {
                  optionStyle = { ...styles.optionButton, ...styles.wrongOption };
                  textStyle = { ...styles.optionText, color: '#C62828' };
                } else {
                  optionStyle = { ...styles.optionButton, ...styles.disabledOption };
                  textStyle = { ...styles.optionText, color: '#888' };
                }
              }
              
              return (
                <TouchableOpacity
                  key={index}
                  style={optionStyle}
                  onPress={() => handleAnswerSelect(index)}
                  disabled={selectedAnswer !== null}
                >
                  <View style={styles.optionContent}>
                    <View style={styles.optionIndicator}>
                      <Text style={styles.optionLetter}>
                        {String.fromCharCode(65 + index)}
                      </Text>
                    </View>
                    <Text style={textStyle}>{option}</Text>
                    {selectedAnswer !== null && index === currentQuestion.correctAnswer && (
                      <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
                    )}
                    {selectedAnswer === index && index !== currentQuestion.correctAnswer && (
                      <Ionicons name="close-circle" size={24} color="#F44336" />
                    )}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
          
          {showExplanation && (
            <Animated.View style={[styles.explanationContainer, { opacity: fadeAnim }]}>
              <View style={styles.explanationHeader}>
                <Ionicons name="information-circle" size={24} color="#667eea" />
                <Text style={styles.explanationTitle}>Explicação</Text>
              </View>
              <Text style={styles.explanationText}>{currentQuestion.explanation}</Text>
              
              <TouchableOpacity style={styles.nextButton} onPress={handleNextQuestion}>
                <Text style={styles.nextButtonText}>
                  {currentQuestionIndex < sampleQuiz.length - 1 ? 'Próxima Questão' : 'Finalizar Quiz'}
                </Text>
                <Ionicons name="arrow-forward" size={20} color="white" />
              </TouchableOpacity>
            </Animated.View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  whiteBackground: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    paddingTop: isSmallDevice ? 50 : 60,
    paddingHorizontal: isSmallDevice ? 16 : 20,
    paddingBottom: isSmallDevice ? 16 : 20,
    backgroundColor: '#ffffff',
  },
  progressContainer: {
    alignItems: 'center',
  },
  progressBackground: {
    width: '100%',
    height: 8,
    backgroundColor: '#e9ecef',
    borderRadius: 4,
    marginBottom: 10,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#667eea',
    borderRadius: 4,
  },
  progressText: {
    color: '#333333',
    fontSize: 16,
    fontWeight: '600',
  },
  questionContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    marginHorizontal: isSmallDevice ? 16 : 20,
    borderRadius: isSmallDevice ? 16 : 20,
    padding: isSmallDevice ? 20 : 24,
    marginBottom: isSmallDevice ? 16 : 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 5,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  categoryBadge: {
    backgroundColor: '#667eea',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 20,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  questionText: {
    fontSize: isSmallDevice ? 18 : 20,
    fontWeight: '700',
    color: '#1a1a1a',
    lineHeight: isSmallDevice ? 26 : 28,
    marginBottom: isSmallDevice ? 24 : 30,
    letterSpacing: -0.3,
  },
  optionsContainer: {
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#f8f9fa',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 14 : 16,
    marginBottom: isSmallDevice ? 10 : 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIndicator: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#667eea',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionLetter: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  optionText: {
    flex: 1,
    fontSize: isSmallDevice ? 15 : 16,
    color: '#1a1a1a',
    lineHeight: isSmallDevice ? 20 : 22,
    fontWeight: '500',
  },
  correctOption: {
    backgroundColor: '#E8F5E8',
    borderColor: '#4CAF50',
  },
  wrongOption: {
    backgroundColor: '#FFEBEE',
    borderColor: '#F44336',
  },
  disabledOption: {
    backgroundColor: '#f0f0f0',
    opacity: 0.7,
  },
  explanationContainer: {
    backgroundColor: '#f8f9fa',
    borderRadius: isSmallDevice ? 10 : 12,
    padding: isSmallDevice ? 16 : 20,
    marginTop: isSmallDevice ? 8 : 10,
  },
  explanationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  explanationTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#667eea',
    marginLeft: 8,
  },
  explanationText: {
    fontSize: 14,
    color: '#333333',
    lineHeight: 20,
    marginBottom: 20,
    fontWeight: '400',
  },
  nextButton: {
    backgroundColor: '#667eea',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  nextButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 8,
  },
  completedContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: isSmallDevice ? 24 : 40,
    backgroundColor: '#ffffff',
  },
  scoreCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 30,
    borderWidth: 4,
    borderColor: '#667eea',
    boxShadow: '0px 4px 12px rgba(102, 126, 234, 0.2)',
    elevation: 6,
  },
  scoreText: {
    color: '#667eea',
    fontSize: 32,
    fontWeight: 'bold',
  },
  completedTitle: {
    color: '#1a1a1a',
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
  },
  completedSubtitle: {
    color: '#666666',
    fontSize: 18,
    marginBottom: 8,
    textAlign: 'center',
  },
  completedPercentage: {
    color: '#667eea',
    fontSize: 48,
    fontWeight: 'bold',
    marginBottom: 40,
  },
  restartButton: {
    backgroundColor: '#667eea',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 24,
    boxShadow: '0px 3px 8px rgba(102, 126, 234, 0.3)',
    elevation: 4,
  },
  restartButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});