import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  TextInput, 
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Alert
} from 'react-native';
import { 
  Search, 
  FileText, 
  Download, 
  ArrowLeft, 
  History
} from 'lucide-react-native';
import { fetchNotes, NOTES_SOURCES } from '../data/notesService';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';

const PYQScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [papers, setPapers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [targetExam, setTargetExam] = useState('SSC CGL / CHSL');

  const sources = ['All', NOTES_SOURCES.ADDA247, NOTES_SOURCES.UNACADEMY, NOTES_SOURCES.GOOGLE];

  useEffect(() => {
    fetchUserTarget();
  }, []);

  useEffect(() => {
    loadPapers();
  }, [selectedSource, targetExam]);

  const fetchUserTarget = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().targetExam) {
          setTargetExam(userDoc.data().targetExam);
        }
      }
    } catch (error) {
      console.error("Error fetching target:", error);
    }
  };

  const loadPapers = async () => {
    setLoading(true);
    const data = await fetchNotes(query, selectedSource, 'pyqs', targetExam);
    setPapers(data);
    setLoading(false);
  };

  const handleSearch = () => {
    loadPapers();
  };

  const handleDownload = (item) => {
    Alert.alert(
      "Download Started",
      `The solved paper "${item.title}" from ${item.source} is being downloaded.`,
      [{ text: "OK" }]
    );
  };

  const renderPaperItem = ({ item }) => (
    <TouchableOpacity style={styles.card}>
      <View style={styles.iconContainer}>
        <History size={24} color="#10B981" />
      </View>
      <View style={styles.info}>
        <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
        <View style={styles.meta}>
          <View style={[styles.sourceBadge, { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' }]}>
            <Text style={styles.sourceText}>{item.source}</Text>
          </View>
          <Text style={styles.date}>{item.date}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.actionBtn} onPress={() => handleDownload(item)}>
        <Download size={20} color="#10B981" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={{ alignItems: 'center', flex: 1 }}>
          <Text style={styles.headerTitle}>Solved PYQs</Text>
          <Text style={styles.headerSubTitle}>{targetExam}</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <View style={styles.searchBox}>
        <View style={styles.searchBar}>
          <Search size={20} color="#94A3B8" />
          <TextInput
            style={styles.input}
            placeholder="Search Solved Papers..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <FlatList
          data={sources}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={[
                styles.tab, 
                selectedSource === item && styles.activeTab
              ]}
              onPress={() => setSelectedSource(item)}
            >
              <Text style={[
                styles.tabText, 
                selectedSource === item && styles.activeTabText
              ]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.tabsPadding}
        />
      </View>

      {loading ? (
        <View style={styles.loader}>
          <ActivityIndicator size="large" color="#10B981" />
        </View>
      ) : (
        <FlatList
          data={papers}
          keyExtractor={(item) => item.id}
          renderItem={renderPaperItem}
          contentContainerStyle={styles.listPadding}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, backgroundColor: 'white' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  headerSubTitle: { fontSize: 11, color: '#10B981', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
  searchBox: { padding: 20, backgroundColor: 'white' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 16, paddingHorizontal: 16, height: 50 },
  input: { flex: 1, marginLeft: 12, fontSize: 16 },
  tabsWrapper: { backgroundColor: 'white', paddingBottom: 12 },
  tabsPadding: { paddingHorizontal: 20, gap: 10 },
  tab: { paddingHorizontal: 18, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9' },
  activeTab: { backgroundColor: '#D1FAE5' },
  tabText: { color: '#64748B', fontWeight: '600' },
  activeTabText: { color: '#059669' },
  listPadding: { padding: 20 },
  card: { backgroundColor: 'white', borderRadius: 18, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, elevation: 1 },
  iconContainer: { width: 44, height: 44, backgroundColor: '#ECFDF5', borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
  info: { flex: 1, marginLeft: 12 },
  title: { fontSize: 15, fontWeight: 'bold', color: '#1E293B' },
  meta: { flexDirection: 'row', alignItems: 'center', marginTop: 6, gap: 8 },
  sourceBadge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, borderWidth: 1 },
  sourceText: { fontSize: 10, fontWeight: 'bold', color: '#065F46' },
  date: { fontSize: 11, color: '#94A3B8' },
  actionBtn: { padding: 10 },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center' }
});

export default PYQScreen;
