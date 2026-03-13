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
  Filter,
  ExternalLink,
  BookOpen
} from 'lucide-react-native';
import { fetchNotes, NOTES_SOURCES } from '../data/notesService';

const NotesScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);

  const sources = ['All', NOTES_SOURCES.ADDA247, NOTES_SOURCES.UNACADEMY, NOTES_SOURCES.GOOGLE];

  useEffect(() => {
    loadNotes();
  }, [selectedSource]);

  const loadNotes = async () => {
    setLoading(true);
    const data = await fetchNotes(query, selectedSource);
    setNotes(data);
    setLoading(false);
  };

  const handleSearch = () => {
    loadNotes();
  };

  const handleDownload = (item) => {
    Alert.alert(
      "Download Started",
      `The file "${item.title}" from ${item.source} is being downloaded and will be saved to your device.`,
      [{ text: "OK" }]
    );
  };

  const renderNoteItem = ({ item }) => (
    <TouchableOpacity style={styles.noteCard}>
      <View style={styles.noteIconContainer}>
        <FileText size={24} color="#EF4444" />
      </View>
      <View style={styles.noteInfo}>
        <Text style={styles.noteTitle} numberOfLines={2}>{item.title}</Text>
        <View style={styles.noteMeta}>
          <View style={[styles.sourceTag, getSourceStyle(item.source)]}>
            <Text style={styles.sourceTagText}>{item.source}</Text>
          </View>
          <Text style={styles.noteDate}>{item.date}</Text>
          <Text style={styles.noteSize}>{item.size}</Text>
        </View>
      </View>
      <TouchableOpacity style={styles.downloadBtn} onPress={() => handleDownload(item)}>
        <Download size={20} color="#4F46E5" />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  const getSourceStyle = (source) => {
    switch (source) {
      case NOTES_SOURCES.ADDA247: return { backgroundColor: '#FFF7ED', borderColor: '#FED7AA' };
      case NOTES_SOURCES.UNACADEMY: return { backgroundColor: '#ECFDF5', borderColor: '#A7F3D0' };
      case NOTES_SOURCES.GOOGLE: return { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' };
      default: return { backgroundColor: '#F3F4F6', borderColor: '#E5E7EB' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Study Notes Hub</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Search Section */}
      <View style={styles.searchSection}>
        <View style={styles.searchBar}>
          <Search size={20} color="#94A3B8" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search latest PDF notes..."
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
          />
          {query.length > 0 && (
            <TouchableOpacity onPress={handleSearch} style={styles.goBtn}>
              <Text style={styles.goBtnText}>Go</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Source Tabs */}
      <View style={styles.tabsContainer}>
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
          contentContainerStyle={styles.tabsList}
        />
      </View>

      {/* Results */}
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#4F46E5" />
          <Text style={styles.loadingText}>Fetching latest notes...</Text>
        </View>
      ) : notes.length > 0 ? (
        <FlatList
          data={notes}
          keyExtractor={(item) => item.id}
          renderItem={renderNoteItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.centerContainer}>
          <BookOpen size={64} color="#CBD5E1" />
          <Text style={styles.emptyText}>No notes found for "{query}"</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadNotes}>
            <Text style={styles.retryBtnText}>Refresh</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  backBtn: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#1E293B' },
  searchSection: { padding: 20, backgroundColor: 'white' },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: '#F1F5F9', 
    borderRadius: 16, 
    paddingHorizontal: 16,
    height: 56,
  },
  searchInput: { flex: 1, marginLeft: 12, fontSize: 16, color: '#1E293B' },
  goBtn: { backgroundColor: '#4F46E5', paddingHorizontal: 16, paddingVertical: 8, borderRadius: 10 },
  goBtnText: { color: 'white', fontWeight: 'bold' },
  tabsContainer: { backgroundColor: 'white', paddingBottom: 10 },
  tabsList: { paddingHorizontal: 20, gap: 12 },
  tab: { 
    paddingHorizontal: 20, 
    paddingVertical: 10, 
    borderRadius: 25, 
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: 'transparent'
  },
  activeTab: { backgroundColor: '#EEF2FF', borderColor: '#C7D2FE' },
  tabText: { color: '#64748B', fontWeight: '600' },
  activeTabText: { color: '#4F46E5' },
  listContent: { padding: 20, paddingBottom: 100 },
  noteCard: { 
    backgroundColor: 'white', 
    borderRadius: 20, 
    padding: 16, 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  noteIconContainer: { 
    width: 48, 
    height: 48, 
    backgroundColor: '#FEF2F2', 
    borderRadius: 12, 
    alignItems: 'center', 
    justifyContent: 'center' 
  },
  noteInfo: { flex: 1, marginLeft: 16 },
  noteTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 },
  noteMeta: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  sourceTag: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6, borderWidth: 1 },
  sourceTagText: { fontSize: 10, fontWeight: 'bold', color: '#1E293B' },
  noteDate: { fontSize: 11, color: '#94A3B8' },
  noteSize: { fontSize: 11, color: '#94A3B8' },
  downloadBtn: { padding: 10, backgroundColor: '#F1F5F9', borderRadius: 12 },
  centerContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 40 },
  loadingText: { marginTop: 16, color: '#64748B', fontSize: 16 },
  emptyText: { marginTop: 16, color: '#94A3B8', fontSize: 16, textAlign: 'center' },
  retryBtn: { marginTop: 24, paddingHorizontal: 24, paddingVertical: 12, backgroundColor: '#4F46E5', borderRadius: 12 },
  retryBtnText: { color: 'white', fontWeight: 'bold' }
});

export default NotesScreen;
