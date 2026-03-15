import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, SafeAreaView, StyleSheet, Dimensions, ActivityIndicator } from 'react-native';
import { X, Trophy, ArrowRight, CheckCircle2, AlertCircle } from 'lucide-react-native';
import { examSpecificQuestions } from '../data/mock';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

// Deterministic PRNG
function pseudoRandom(seed) {
  let value = 0;
  for(let i=0; i<seed.length; i++) {
    value = (value * 31 + seed.charCodeAt(i)) % 2147483647;
  }
  if (value <= 0) value = 1;
  return function() {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  }
}

// Generate an exact set of 20 questions based on date and attempt number!
function getDeterministicQuiz(questions, dateString, attemptNumber) {
  const seedString = `${dateString}_attempt_${attemptNumber}`;
  const random = pseudoRandom(seedString);
  let shuffled = [...questions];
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = Math.floor(random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled.slice(0, 20); // Pick up to 20 deterministic questions
}

const { width } = Dimensions.get('window');

export default function QuizScreen({ navigation }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [correctAnswers, setCorrectAnswers] = useState(0);
  const [wrongAnswers, setWrongAnswers] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isFinished, setIsFinished] = useState(false);
  const [quizData, setQuizData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startTime, setStartTime] = useState(null);
  const [endTime, setEndTime] = useState(null);
  const [quizAttempts, setQuizAttempts] = useState(0);
  const [limitReached, setLimitReached] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  useEffect(() => {
    const fetchTarget = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            const data = userDoc.data();
            
            // Checking Daily Limits
            const todayString = new Date().toISOString().split('T')[0];
            const dailyAttempts = data.lastQuizDate === todayString ? (data.dailyQuizAttempts || 0) : 0;
            
            if (dailyAttempts >= 3) {
              setLimitReached(true);
            } else {
              setQuizAttempts(dailyAttempts);
            }
            setTotalScore(data.totalScore || 0);

            let target = 'SSC CGL / CHSL';
            if (data.targetExam) {
              target = data.targetExam;
            }
            const baseQuestions = examSpecificQuestions[target] || examSpecificQuestions['Default'];
            
            // This guarantees the same subset of questions for everyone taking Attempt N today!
            const finalQuestions = getDeterministicQuiz(baseQuestions, todayString, dailyAttempts);
            setQuizData(finalQuestions);
          } else {
            const todayString = new Date().toISOString().split('T')[0];
            const baseQuestions = examSpecificQuestions['SSC CGL / CHSL'];
            setQuizData(getDeterministicQuiz(baseQuestions, todayString, 0));
          }
        }
      } catch (error) {
        console.error("Error fetching target:", error);
        setQuizData(examSpecificQuestions['SSC CGL / CHSL']); // fallback
      } finally {
        setLoading(false);
        setStartTime(Date.now());
      }
    };
    fetchTarget();
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      </SafeAreaView>
    );
  }

  if (limitReached) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 }}>
          <AlertCircle size={64} color="#EF4444" style={{ marginBottom: 24 }} />
          <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 12, textAlign: 'center' }}>
            Daily Limit Reached
          </Text>
          <Text style={{ fontSize: 16, color: '#64748B', textAlign: 'center', marginBottom: 32 }}>
            You can only attempt the Daily Challenge 3 times a day. Please come back tomorrow for new challenges!
          </Text>
          <TouchableOpacity 
            onPress={() => navigation.goBack()}
            style={styles.backBtn}
          >
            <Text style={styles.backBtnText}>Got it, Back to Home</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const question = quizData[currentQuestion];

  const handleSelect = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === question.correct) {
      setCorrectAnswers(correctAnswers + 1);
    } else {
      setWrongAnswers(wrongAnswers + 1);
    }
  };

  const handleNext = async () => {
    if (currentQuestion < quizData.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedOption(null);
    } else {
      setEndTime(Date.now());
      setIsFinished(true);

      try {
        const user = auth.currentUser;
        if (user) {
          // Negative marking logic
          const finalMarks = correctAnswers - (wrongAnswers * 0.5);
          const pointsToAdd = Math.max(0, finalMarks); // Can't be negative overall to add
          const todayString = new Date().toISOString().split('T')[0];
          
          await setDoc(doc(db, "users", user.uid), {
            totalScore: totalScore + pointsToAdd,
            dailyQuizAttempts: quizAttempts + 1,
            lastQuizDate: todayString
          }, { merge: true });
        }
      } catch (error) {
        console.error("Error updating score:", error);
      }
    }
  };

  if (isFinished) {
    const timeTakenSeconds = Math.floor((endTime - startTime) / 1000);
    const minutes = Math.floor(timeTakenSeconds / 60);
    const seconds = timeTakenSeconds % 60;
    
    // final marks logic
    const marks = correctAnswers - (wrongAnswers * 0.5);
    
    let feedbackMessage = "Good job! Keep it up!";
    let trophyColor = "#3B82F6"; // blue
    if (timeTakenSeconds <= 180) { // 3 minutes
      feedbackMessage = "Excellent! You have amazing speed and accuracy!";
      trophyColor = "#d97706"; // gold
    } else if (timeTakenSeconds >= 600) { // 10 minutes
      feedbackMessage = "You need to work on your speed. Keep practicing!";
      trophyColor = "#EF4444"; // red
    }

    return (
      <SafeAreaView style={styles.finishContainer}>
        <View style={styles.bigTrophy}>
          <Trophy size={80} color={trophyColor} />
        </View>
        <Text style={styles.finishTitle}>Quiz Finished!</Text>
        <Text style={styles.finishScore}>
          Correct: {correctAnswers} | Wrong: {wrongAnswers}
        </Text>
        <Text style={{ fontSize: 22, color: '#4F46E5', fontWeight: 'bold', marginBottom: 12 }}>
          Total Marks: {marks > 0 ? marks : 0} / {quizData.length}
        </Text>
        <Text style={{ fontSize: 16, color: '#334155', fontWeight: 'bold', marginBottom: 12 }}>
          Time taken: {minutes}m {seconds}s
        </Text>
        <Text style={{ fontSize: 15, color: '#64748B', textAlign: 'center', marginBottom: 32, paddingHorizontal: 20 }}>
          {feedbackMessage}
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
        <Text style={styles.headerTitle}>Daily Challenge</Text>
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
          {currentQuestion + 1}. {question.question}
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
