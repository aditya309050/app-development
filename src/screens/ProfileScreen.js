import React from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Alert
} from 'react-native';
import { 
  User, 
  Mail, 
  Target, 
  Settings, 
  Shield, 
  ChevronRight, 
  LogOut, 
  ArrowLeft,
  Award
} from 'lucide-react-native';
import { auth } from '../config/firebase';
import { signOut } from 'firebase/auth';
import { theme } from '../theme';

const ProfileScreen = ({ navigation }) => {
  const user = auth.currentUser;

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to exit?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => signOut(auth), style: "destructive" }
      ]
    );
  };

  const ProfileItem = ({ icon: Icon, title, subtitle, onPress, color = theme.colors.textSecondary }) => (
    <TouchableOpacity style={styles.item} onPress={onPress}>
      <View style={[styles.itemIcon, { backgroundColor: color + '15' }]}>
        <Icon size={22} color={color} />
      </View>
      <View style={styles.itemText}>
        <Text style={styles.itemTitle}>{title}</Text>
        {subtitle && <Text style={styles.itemSubtitle}>{subtitle}</Text>}
      </View>
      <ChevronRight size={20} color={theme.colors.textSecondary} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topSection}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {user?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2) || 'S'}
              </Text>
            </View>
            <TouchableOpacity style={styles.editBtn}>
              <Settings size={16} color="white" />
            </TouchableOpacity>
          </View>
          <Text style={styles.userName}>{user?.displayName || 'Scholar'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statBox}>
              <Text style={styles.statValue}>12</Text>
              <Text style={styles.statLabel}>Day Streak</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={styles.statValue}>850</Text>
              <Text style={styles.statLabel}>Points</Text>
            </View>
            <View style={statDivider} />
            <View style={styles.statBox}>
              <Award size={20} color={theme.colors.gold} />
              <Text style={styles.statLabel}>Silver Rank</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account Settings</Text>
          <ProfileItem 
            icon={User} 
            title="Personal Information" 
            subtitle="Manage your name and data"
            color="#4F46E5"
          />
          <ProfileItem 
            icon={Target} 
            title="My Target Goal" 
            subtitle="Change your target exam focus"
            color="#10B981"
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Privacy & Security</Text>
          <ProfileItem 
            icon={Shield} 
            title="Security Settings" 
            subtitle="Password and account safety"
            color="#F59E0B"
          />
          <ProfileItem 
            icon={Mail} 
            title="Email Notifications" 
            subtitle="Configure what you receive"
            color="#EC4899"
          />
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <LogOut size={22} color="#EF4444" />
          <Text style={styles.logoutText}>Log Out Account</Text>
        </TouchableOpacity>
        
        <Text style={styles.versionText}>Version 1.0.0 (Latest)</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const statDivider = { width: 1, height: 30, backgroundColor: 'rgba(255,255,255,0.1)' };

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.primary },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    padding: 20,
    backgroundColor: theme.colors.primary
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
  topSection: { 
    alignItems: 'center', 
    padding: 30,
    backgroundColor: theme.colors.secondary,
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
  },
  avatarContainer: { position: 'relative', marginBottom: 20 },
  avatar: { 
    width: 100, 
    height: 100, 
    backgroundColor: theme.colors.accent, 
    borderRadius: 35, 
    justifyContent: 'center', 
    alignItems: 'center',
    elevation: 20,
    shadowColor: theme.colors.accent,
    shadowOpacity: 0.4,
    shadowRadius: 15,
  },
  avatarText: { color: 'white', fontSize: 36, fontWeight: 'bold' },
  editBtn: { 
    position: 'absolute', 
    bottom: -5, 
    right: -5, 
    backgroundColor: '#334155', 
    padding: 10, 
    borderRadius: 15,
    borderWidth: 3,
    borderColor: theme.colors.secondary
  },
  userName: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  userEmail: { fontSize: 14, color: theme.colors.textSecondary, marginBottom: 30 },
  statsRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.05)', 
    borderRadius: 24, 
    paddingVertical: 20,
    width: '100%',
    justifyContent: 'space-around'
  },
  statBox: { alignItems: 'center' },
  statValue: { fontSize: 20, fontWeight: 'bold', color: 'white', marginBottom: 4 },
  statLabel: { fontSize: 11, color: theme.colors.textSecondary, fontWeight: '600' },
  section: { padding: 30, paddingBottom: 0 },
  sectionTitle: { fontSize: 14, fontWeight: 'bold', color: theme.colors.textSecondary, marginBottom: 20, textTransform: 'uppercase', letterSpacing: 1 },
  item: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: theme.colors.secondary, 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12 
  },
  itemIcon: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  itemText: { flex: 1 },
  itemTitle: { fontSize: 16, fontWeight: '600', color: 'white', marginBottom: 2 },
  itemSubtitle: { fontSize: 12, color: theme.colors.textSecondary },
  logoutBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: 20, 
    marginTop: 40,
    marginHorizontal: 30,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.2)'
  },
  logoutText: { color: '#EF4444', fontWeight: 'bold', fontSize: 16, marginLeft: 12 },
  versionText: { textAlign: 'center', color: theme.colors.textSecondary, fontSize: 12, marginTop: 30, marginBottom: 50 },
});

export default ProfileScreen;
