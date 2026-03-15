import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, SafeAreaView, StyleSheet, Dimensions } from 'react-native';
import { BookOpen, FileText, Trophy, User, ChevronRight, LogOut, Search, Zap } from 'lucide-react-native';
import { auth, db } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { doc, onSnapshot, collection, query, orderBy } from 'firebase/firestore';

const { width } = Dimensions.get('window');

const Dashboard = ({ navigation }) => {
  const [totalPoints, setTotalPoints] = useState(0);
  const [currentRank, setCurrentRank] = useState(1);

  useEffect(() => {
    let unsubscribeUser = () => {};
    let unsubscribeRank = () => {};
    
    if (auth.currentUser) {
      unsubscribeUser = onSnapshot(doc(db, "users", auth.currentUser.uid), (docHit) => {
        if (docHit.exists()) {
          setTotalPoints(docHit.data().totalScore || 0);
        }
      });

      const q = query(collection(db, "users"), orderBy("totalScore", "desc"));
      unsubscribeRank = onSnapshot(q, (snapshot) => {
        let rank = 1;
        let found = false;
        snapshot.forEach((docHit) => {
          if (!found) {
            if (docHit.id === auth.currentUser.uid) {
              found = true;
            } else {
              rank++;
            }
          }
        });
        setCurrentRank(rank);
      });
    }
    return () => {
      unsubscribeUser();
      unsubscribeRank();
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Premium Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View style={styles.userInfo}>
              <TouchableOpacity 
                style={styles.avatar}
                onPress={() => navigation.navigate('Profile')}
              >
                {auth.currentUser?.displayName ? (
                  <Text style={styles.avatarText}>
                    {auth.currentUser.displayName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)}
                  </Text>
                ) : (
                  <User size={24} color="white" />
                )}
              </TouchableOpacity>
              <View>
                <Text style={styles.userTag}>Welcome back,</Text>
                <Text style={styles.userName}>{auth.currentUser?.displayName?.split(' ')[0] || 'Scholar'} 👋</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.notifBtn} onPress={() => signOut(auth)}>
              <LogOut size={22} color="white" />
            </TouchableOpacity>
          </View>
          
          <View style={styles.progressCard}>
            <View style={styles.trophyIcon}>
              <Trophy size={20} color="white" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.progressLabel}>Daily Challenge</Text>
              <Text style={styles.progressValue}>Current Rank: #{currentRank}</Text>
            </View>
            <View style={styles.divider} />
            <View style={{ alignItems: 'center' }}>
              <Text style={styles.pointsValue}>{totalPoints}</Text>
              <Text style={styles.pointsLabel}>Points</Text>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          <TouchableOpacity style={styles.searchBar}>
            <Search size={20} color="#94A3B8" />
            <Text style={styles.searchPlaceholder}>What are you studying today?</Text>
          </TouchableOpacity>

          <Text style={styles.sectionTitle}>Study Hub</Text>
          <View style={styles.actionRow}>
            <TouchableOpacity 
              onPress={() => navigation.navigate('Notes')}
              style={styles.actionCard}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#EEF2FF' }]}>
                <BookOpen size={28} color="#4F46E5" />
              </View>
              <Text style={styles.actionText}>Notes</Text>
              <Text style={styles.actionSubtext}>Adda24, Google, Unacademy</Text>
              <View style={styles.newBadge}><Text style={styles.newText}>LATEST</Text></View>
            </TouchableOpacity>

            <TouchableOpacity 
              onPress={() => navigation.navigate('PYQ')}
              style={styles.actionCard}
            >
              <View style={[styles.actionIconBox, { backgroundColor: '#ECFDF5' }]}>
                <FileText size={28} color="#10B981" />
              </View>
              <Text style={styles.actionText}>PYQs</Text>
              <Text style={styles.actionSubtext}>Top Solved Papers</Text>
              <View style={styles.newBadge}><Text style={styles.newText}>LATEST</Text></View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity 
            onPress={() => navigation.navigate('Quiz')}
            style={styles.quizCard}
          >
            <View style={{ flex: 1, paddingRight: 16 }}>
              <View style={styles.liveBadge}>
                <Text style={styles.liveText}>LIVE NOW</Text>
              </View>
              <Text style={styles.quizTitle}>Daily Challenge</Text>
              <Text style={styles.quizMeta}>20 Questions • 10 Mins</Text>
              <View style={styles.startBtn}>
                <Text style={styles.startBtnText}>Start Challenge</Text>
                <Zap size={16} color="white" fill="white" />
              </View>
            </View>
            <View style={styles.quizTrophy}>
              <Trophy size={48} color="#F59E0B" />
            </View>
          </TouchableOpacity>

          <View style={styles.categories}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Target Exams</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            {[
              { name: 'SSC CGL / CHSL', color: '#4F46E5', tag: 'High Competition' },
              { name: 'Railway RRB NTPC', color: '#10B981', tag: 'Active' },
              { name: 'State Police Exams', color: '#F59E0B', tag: 'New Update' }
            ].map((exam) => (
              <TouchableOpacity key={exam.name} style={styles.examCard}>
                <View style={styles.examInfo}>
                  <View style={[styles.examIndicator, { backgroundColor: exam.color }]} />
                  <View>
                    <Text style={styles.examName}>{exam.name}</Text>
                    <Text style={styles.examTag}>{exam.tag}</Text>
                  </View>
                </View>
                <ChevronRight size={20} color="#CBD5E1" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: '#4F46E5', 
    padding: 32, 
    paddingTop: 64, 
    borderBottomLeftRadius: 48, 
    borderBottomRightRadius: 48,
    elevation: 20,
    shadowColor: '#4F46E5',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
  },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 },
  userInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { 
    width: 52, height: 52, backgroundColor: 'rgba(255,255,255,0.2)', 
    borderRadius: 18, alignItems: 'center', justifyContent: 'center', 
    marginRight: 16, borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)',
    elevation: 5, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5
  },
  avatarText: { color: 'white', fontSize: 18, fontWeight: '800', letterSpacing: 1 },
  userTag: { color: 'rgba(255,255,255,0.8)', fontSize: 11, fontWeight: '600', marginBottom: 2 },
  userName: { color: 'white', fontSize: 24, fontWeight: 'bold' },
  notifBtn: { backgroundColor: 'rgba(255,255,255,0.1)', padding: 12, borderRadius: 16, borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)' },
  progressCard: { 
    backgroundColor: 'rgba(255,255,255,0.1)', padding: 20, borderRadius: 32, 
    borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)', flexDirection: 'row', alignItems: 'center' 
  },
  trophyIcon: { backgroundColor: '#FBBF24', padding: 12, borderRadius: 16, marginRight: 16 },
  progressLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, fontWeight: '600' },
  progressValue: { color: 'white', fontSize: 16, fontWeight: 'bold' },
  divider: { height: 40, width: 1, backgroundColor: 'rgba(255,255,255,0.2)', marginHorizontal: 16 },
  pointsValue: { color: '#FBBF24', fontSize: 18, fontWeight: 'bold' },
  pointsLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 10, fontWeight: '700', textTransform: 'uppercase' },
  content: { padding: 24, marginTop: -16 },
  searchBar: { 
    backgroundColor: 'white', padding: 16, borderRadius: 24, 
    flexDirection: 'row', alignItems: 'center', borderWidth: 1, 
    borderColor: '#F1F5F9', elevation: 2, shadowColor: '#000', shadowOpacity: 0.05 
  },
  searchPlaceholder: { color: '#94A3B8', marginLeft: 12, fontWeight: '500' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B', marginBottom: 16 },
  actionRow: { flexDirection: 'row', gap: 16, marginBottom: 32 },
  actionCard: { 
    flex: 1, backgroundColor: 'white', padding: 24, borderRadius: 36, 
    alignItems: 'center', borderWidth: 1, borderColor: '#F1F5F9',
    elevation: 2, shadowColor: '#000', shadowOpacity: 0.05
  },
  actionIconBox: { padding: 16, borderRadius: 16, marginBottom: 16 },
  actionText: { fontWeight: 'bold', color: '#1E293B', fontSize: 16 },
  actionSubtext: { color: '#94A3B8', fontSize: 10, marginTop: 4 },
  quizCard: { 
    backgroundColor: '#0F172A', padding: 24, borderRadius: 40, 
    flexDirection: 'row', alignItems: 'center', elevation: 10,
    shadowColor: '#000', shadowOpacity: 0.2
  },
  liveBadge: { 
    backgroundColor: 'rgba(245,158,11,0.2)', paddingHorizontal: 12, 
    paddingVertical: 4, borderRadius: 20, alignSelf: 'flex-start', 
    marginBottom: 12, borderWidth: 1, borderColor: 'rgba(245,158,11,0.3)' 
  },
  liveText: { color: '#F59E0B', fontSize: 10, fontWeight: '800', letterSpacing: 1 },
  quizTitle: { color: 'white', fontSize: 20, fontWeight: 'bold', marginBottom: 4 },
  quizMeta: { color: '#94A3B8', fontSize: 14, marginBottom: 16 },
  startBtn: { 
    backgroundColor: '#4F46E5', paddingVertical: 12, paddingHorizontal: 24, 
    borderRadius: 16, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center' 
  },
  startBtnText: { color: 'white', fontWeight: 'bold', fontSize: 14, marginRight: 8 },
  quizTrophy: { backgroundColor: '#1E293B', padding: 24, borderRadius: 32, borderWidth: 1, borderColor: '#334155' },
  categories: { marginTop: 32, marginBottom: 40 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  seeAll: { color: '#4F46E5', fontWeight: '700', fontSize: 14 },
  examCard: { 
    backgroundColor: 'white', padding: 20, borderRadius: 28, 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    marginBottom: 12, borderWidth: 1, borderColor: '#F8FAFC' 
  },
  examInfo: { flexDirection: 'row', alignItems: 'center' },
  examIndicator: { width: 6, height: 40, borderRadius: 3, marginRight: 16 },
  examName: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },
  examTag: { color: '#94A3B8', fontSize: 10, fontWeight: '600', textTransform: 'uppercase', marginTop: 2 },
  newBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#4F46E5', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 },
  newText: { color: 'white', fontSize: 8, fontWeight: 'bold' },
});

export default Dashboard;
