import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  SafeAreaView, 
  FlatList,
  ActivityIndicator,
  Alert
} from 'react-native';
import { Target, ChevronRight, CheckCircle2 } from 'lucide-react-native';
import { auth, db } from '../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { theme } from '../theme';

const EXAM_TARGETS = [
  { id: 'ssc', name: 'SSC CGL / CHSL', color: '#4F46E5', iconColor: '#818CF8' },
  { id: 'railway', name: 'Railway RRB NTPC', color: '#10B981', iconColor: '#34D399' },
  { id: 'police', name: 'State Police Exams', color: '#F59E0B', iconColor: '#FBBF24' },
  { id: 'banking', name: 'Banking Exams (IBPS/SBI)', color: '#EF4444', iconColor: '#F87171' },
  { id: 'upsc', name: 'UPSC / State PSC', color: '#8B5CF6', iconColor: '#A78BFA' },
];

const TargetSelectionScreen = ({ navigation }) => {
  const [selectedTarget, setSelectedTarget] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!selectedTarget) {
      Alert.alert("Selection Required", "Please select your target exam to proceed.");
      return;
    }

    setLoading(true);
    try {
      const user = auth.currentUser;
      if (user) {
        await setDoc(doc(db, "users", user.uid), {
          targetExam: selectedTarget.name,
          onboardingComplete: true
        }, { merge: true });
        // App.js listener will pick up the change and navigate to Home
      }
    } catch (error) {
      Alert.alert("Error", "Could not save your preference. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedTarget?.id === item.id;
    return (
      <TouchableOpacity 
        style={[
          styles.card, 
          isSelected && { borderColor: item.color, backgroundColor: 'rgba(255,255,255,0.05)' }
        ]}
        onPress={() => setSelectedTarget(item)}
      >
        <View style={[styles.iconBox, { backgroundColor: item.color + '20' }]}>
          <Target size={24} color={item.iconColor} />
        </View>
        <Text style={[styles.cardTitle, isSelected && { color: 'white' }]}>{item.name}</Text>
        {isSelected ? (
          <CheckCircle2 size={24} color={item.iconColor} />
        ) : (
          <ChevronRight size={20} color={theme.colors.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>What's your Target?</Text>
        <Text style={styles.subtitle}>We'll personalize your preparation material based on your choice.</Text>
      </View>

      <FlatList
        data={EXAM_TARGETS}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <TouchableOpacity 
          style={[styles.continueBtn, !selectedTarget && styles.disabledBtn]}
          onPress={handleComplete}
          disabled={loading || !selectedTarget}
        >
          {loading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.continueBtnText}>Start Learning</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { padding: 40 },
  title: { fontSize: 32, fontWeight: 'bold', color: 'white', marginBottom: 12 },
  subtitle: { fontSize: 16, color: theme.colors.textSecondary, lineHeight: 24 },
  list: { paddingHorizontal: 20, paddingBottom: 120 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.secondary, 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 16,
    borderWidth: 2,
    borderColor: 'transparent'
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  cardTitle: { flex: 1, fontSize: 18, color: theme.colors.textSecondary, fontWeight: '600' },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0, 
    right: 0, 
    padding: 30, 
    backgroundColor: theme.colors.primary,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.05)'
  },
  continueBtn: { 
    backgroundColor: theme.colors.accent, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 10,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  disabledBtn: { backgroundColor: '#475569', opacity: 0.5 },
  continueBtnText: { color: 'white', fontSize: 18, fontWeight: 'bold' }
});

export default TargetSelectionScreen;
