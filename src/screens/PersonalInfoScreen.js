import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity 
} from 'react-native';
import { ArrowLeft, User, Mail, Calendar } from 'lucide-react-native';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { theme } from '../theme';

const PersonalInfoScreen = ({ navigation }) => {
  const user = auth.currentUser;
  const [joinedDate, setJoinedDate] = useState('Recently');

  useEffect(() => {
    const fetchUserData = async () => {
      if (user?.uid) {
        const docRef = doc(db, 'users', user.uid);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.createdAt) {
            // Assume createdAt might be a Firestore Timestamp or Date string
            try {
              const date = data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt);
              setJoinedDate(date.toLocaleDateString());
            } catch (e) {
              console.log(e);
            }
          }
        }
      }
    };
    fetchUserData();
  }, [user]);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Personal Info</Text>
        <View style={{ width: 44 }} />
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          
          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#4F46E515' }]}>
              <User size={24} color="#4F46E5" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Full Name</Text>
              <Text style={styles.value}>{user?.displayName || 'Not Provided'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#EC489915' }]}>
              <Mail size={24} color="#EC4899" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Email Address</Text>
              <Text style={styles.value}>{user?.email || 'Not Provided'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={[styles.iconBox, { backgroundColor: '#10B98115' }]}>
              <Calendar size={24} color="#10B981" />
            </View>
            <View style={styles.infoTextContainer}>
              <Text style={styles.label}>Joined Date</Text>
              <Text style={styles.value}>{joinedDate}</Text>
            </View>
          </View>

        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white' },
  backBtn: { 
    width: 44, 
    height: 44, 
    borderRadius: 12, 
    backgroundColor: 'rgba(255,255,255,0.1)', 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  content: {
    padding: 20,
  },
  card: {
    backgroundColor: theme.colors.secondary,
    borderRadius: 24,
    padding: 20,
    marginTop: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  infoTextContainer: {
    flex: 1,
  },
  label: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    marginVertical: 8,
  }
});

export default PersonalInfoScreen;
