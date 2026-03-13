import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { X, Trophy, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { sampleQuestions } from '../data/mock';

const { width } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);

  const quizData = sampleQuestions;
  const question = quizData[currentQuestion];

  const handleSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === question.correct) {
      setScore(score + 1);
    }
  };

  const handleNext = () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setIsFinished(true);
    }
  };

  if (isFinished) {
    return (
      <SafeAreaView style={styles.finishContainer}>
        <View style={styles.bigTrophy}>
          <Trophy size={80} color="#d97706" />
        </View>
        <Text style={styles.finishTitle}>Quiz Finished!</Text>
        <Text style={styles.finishScore}>
          You scored {score} out of {quizData.length} questions correctly.
        </Text>
        <TouchableOpacity 
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const showResult = selectedOption !== null;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <X size={24} color="#64748b" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Daily GK Quiz</Text>
        <View style={styles.counter}>
          <Text style={styles.counterText}>{currentQuestion + 1}/{quizData.length}</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Progress Bar */}
        <View style={styles.progressBg}>
          <View 
            style={[styles.progressFill, { width: `${((currentQuestion + 1) / quizData.length) * 100}%` }]}
          />
        </View>

        {/* Question */}
        <Text style={styles.questionText}>
          {question.question}
        </Text>

        {/* Options */}
        <View style={styles.options}>
          {question.options.map((option, index) => {
            const isSelected = selectedOption === index;
            const isCorrect = index === question.correct;
            
            let cardStyle = styles.optionCard;
            let textStyle = styles.optionText;
            
            if (showResult) {
              if (isCorrect) {
                cardStyle = [styles.optionCard, styles.correctCard];
                textStyle = [styles.optionText, styles.correctText];
              } else if (isSelected) {
                cardStyle = [styles.optionCard, styles.wrongCard];
                textStyle = [styles.optionText, styles.wrongText];
              } else {
                cardStyle = [styles.optionCard, { opacity: 0.5 }];
                textStyle = [styles.optionText, { color: '#94A3B8' }];
              }
            }

            return (
              <TouchableOpacity
                key={index}
                onPress={() => handleSelect(index)}
                disabled={showResult}
                style={cardStyle}
              >
                <Text style={textStyle}>{option}</Text>
                {showResult && isCorrect && <CheckCircle2 size={24} color="#22c55e" />}
                {showResult && isSelected && !isCorrect && <AlertCircle size={24} color="#ef4444" />}
              </TouchableOpacity>
            );
          })}
        </View>
        
        {showResult && (
           <View style={styles.explanation}>
             <Text style={styles.explanationTitle}>Detailed Explanation:</Text>
             <Text style={styles.explanationText}>{question.explanation}</Text>
           </View>
        )}
      </ScrollView>

      {/* Footer */}
      {showResult && (
        <View style={styles.footer}>
          <TouchableOpacity 
            onPress={handleNext}
            style={styles.nextBtn}
          >
            <Text style={styles.nextBtnText}>
              {currentQuestion === quizData.length - 1 ? 'Show Results' : 'Next Question'}
            </Text>
            <ArrowRight size={20} color="white" />
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  finishContainer: { flex: 1, backgroundColor: 'white', alignItems: 'center', justifyContent: 'center', padding: 32 },
  bigTrophy: { backgroundColor: '#FEF3C7', padding: 24, borderRadius: 100, marginBottom: 24 },
  finishTitle: { fontSize: 30, fontWeight: 'bold', color: '#0F172A', marginBottom: 8 },
  finishScore: { fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 32 },
  backBtn: { backgroundColor: '#4F46E5', width: '100%', padding: 20, borderRadius: 24, alignItems: 'center' },
  backBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 24, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  headerTitle: { color: '#0F172A', fontWeight: 'bold', fontSize: 18 },
  counter: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 20 },
  counterText: { color: '#64748B', fontWeight: '600' },
  scroll: { padding: 24 },
  progressBg: { width: '100%', height: 8, backgroundColor: '#E2E8F0', borderRadius: 4, marginBottom: 32, overflow: 'hidden' },
  progressFill: { height: '100%', backgroundColor: '#4F46E5' },
  questionText: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 32 },
  options: { gap: 16 },
  optionCard: { padding: 20, borderRadius: 20, borderWidth: 2, borderColor: '#F1F5F9', backgroundColor: 'white', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  optionText: { fontSize: 18, fontWeight: '600', color: '#334155' },
  correctCard: { backgroundColor: '#F0FDF4', borderColor: '#22C55E' },
  correctText: { color: '#15803D' },
  wrongCard: { backgroundColor: '#FEF2F2', borderColor: '#EF4444' },
  wrongText: { color: '#B91C1C' },
  explanation: { marginTop: 32, backgroundColor: '#EEF2FF', padding: 24, borderRadius: 24, borderWidth: 1, borderColor: '#E0E7FF' },
  explanationTitle: { color: '#3730A3', fontWeight: 'bold', marginBottom: 8, fontSize: 16 },
  explanationText: { color: '#4338CA', lineHeight: 24, fontSize: 15 },
  footer: { padding: 24, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F1F5F9' },
  nextBtn: { backgroundColor: '#4F46E5', padding: 20, borderRadius: 24, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  nextBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18, marginRight: 8 },
});
