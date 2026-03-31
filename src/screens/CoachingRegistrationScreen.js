import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator
} from 'react-native';
import { ArrowLeft, Upload, Building, Mail, Phone, FileText, CheckCircle } from 'lucide-react-native';
import { theme } from '../theme';

const InputField = ({ icon: Icon, placeholder, value, onChangeText, fieldType, multiline = false }) => (
  <View style={[styles.inputContainer, multiline && styles.inputContainerMultiline]}>
    <Icon size={20} color={theme.colors.textSecondary} style={styles.inputIcon} />
    <TextInput
      style={[styles.input, multiline && styles.inputMultiline]}
      placeholder={placeholder}
      placeholderTextColor={theme.colors.textSecondary}
      value={value}
      onChangeText={onChangeText}
      keyboardType={fieldType === 'email' ? 'email-address' : fieldType === 'phone' ? 'phone-pad' : 'default'}
      multiline={multiline}
      numberOfLines={multiline ? 4 : 1}
    />
  </View>
);

const CoachingRegistrationScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    instituteName: '',
    email: '',
    phone: '',
    description: '',
  });
  const [loading, setLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  const handleRegister = () => {
    if (!formData.instituteName || !formData.email || !formData.phone) {
      Alert.alert('Error', 'Please fill in all required fields.');
      return;
    }

    setLoading(true);
    // Simulate API call for registration
    setTimeout(() => {
      setLoading(false);
      setIsRegistered(true);
      Alert.alert('Success', 'Your coaching institute has been registered successfully!');
    }, 1500);
  };

  const handleUploadContent = () => {
    Alert.alert('Upload Content', 'This feature will open a file picker to upload documents and videos in the future.');
  };



  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Coaching Partner</Text>
        <View style={{ width: 44 }} />
      </View>

      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {!isRegistered ? (
          <>
            <View style={styles.brandingSection}>
              <View style={styles.iconCircle}>
                <Building size={40} color={theme.colors.accent} />
              </View>
              <Text style={styles.title}>Register Your Institute</Text>
              <Text style={styles.subtitle}>Join our platform and reach thousands of students by providing your premium content.</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.sectionLabel}>Institute Details</Text>
              <InputField
                icon={Building}
                placeholder="Institute Name *"
                value={formData.instituteName}
                onChangeText={(text) => setFormData({ ...formData, instituteName: text })}
              />
              <InputField
                icon={Mail}
                placeholder="Contact Email *"
                fieldType="email"
                value={formData.email}
                onChangeText={(text) => setFormData({ ...formData, email: text })}
              />
              <InputField
                icon={Phone}
                placeholder="Contact Phone *"
                fieldType="phone"
                value={formData.phone}
                onChangeText={(text) => setFormData({ ...formData, phone: text })}
              />
              <InputField
                icon={FileText}
                placeholder="Short Description (Optional)"
                multiline={true}
                value={formData.description}
                onChangeText={(text) => setFormData({ ...formData, description: text })}
              />

              <TouchableOpacity 
                style={styles.submitBtn} 
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="white" />
                ) : (
                  <Text style={styles.submitBtnText}>Submit Registration</Text>
                )}
              </TouchableOpacity>
            </View>
          </>
        ) : (
          <View style={styles.dashboardSection}>
            <View style={styles.iconCircleSuccess}>
              <CheckCircle size={48} color="#10B981" />
            </View>
            <Text style={styles.title}>Welcome, {formData.instituteName}!</Text>
            <Text style={styles.subtitle}>Your institute profile is active. You can now upload study materials and video lectures for students.</Text>
            
            <View style={styles.statsCard}>
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Total Uploads</Text>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <Text style={styles.statValue}>0</Text>
                <Text style={styles.statLabel}>Student Views</Text>
              </View>
            </View>

            <TouchableOpacity style={styles.uploadBtn} onPress={handleUploadContent}>
              <Upload size={24} color="white" />
              <Text style={styles.uploadBtnText}>Upload New Content</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: theme.colors.primary,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  brandingSection: {
    alignItems: 'center',
    marginBottom: 40,
    marginTop: 20,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconCircleSuccess: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 10,
  },
  formSection: {
    backgroundColor: theme.colors.surface,
    padding: 24,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.secondary,
    borderRadius: 16,
    marginBottom: 16,
    paddingHorizontal: 16,
    height: 56,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  inputContainerMultiline: {
    height: 120,
    alignItems: 'flex-start',
    paddingTop: 16,
  },
  inputIcon: {
    marginRight: 12,
  },
  input: {
    flex: 1,
    color: 'white',
    fontSize: 15,
  },
  inputMultiline: {
    height: 100,
    textAlignVertical: 'top',
  },
  submitBtn: {
    backgroundColor: theme.colors.accent,
    borderRadius: 16,
    height: 56,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  submitBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  dashboardSection: {
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    padding: 30,
    borderRadius: 30,
    marginTop: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.secondary,
    borderRadius: 20,
    padding: 20,
    width: '100%',
    marginTop: 30,
    marginBottom: 30,
    justifyContent: 'space-evenly',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    fontWeight: '500',
  },
  statDivider: {
    width: 1,
    height: '100%',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  uploadBtn: {
    flexDirection: 'row',
    backgroundColor: theme.colors.accent,
    borderRadius: 16,
    height: 60,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: theme.colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  uploadBtnText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 12,
  },
});

export default CoachingRegistrationScreen;
