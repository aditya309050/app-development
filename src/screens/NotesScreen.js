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
  Alert,
  ScrollView
} from 'react-native';
import { 
  Search, 
  FileText, 
  Download, 
  ArrowLeft, 
  BookOpen,
  ChevronRight,
  Library,
  Layers,
  Tag
} from 'lucide-react-native';
import { fetchNotes, NOTES_SOURCES, getLibraryStructure, fetchChapterNotes } from '../data/notesService';
import { auth, db } from '../config/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { theme } from '../theme';

const NotesScreen = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState('All');
  const [loading, setLoading] = useState(true);
  const [targetExam, setTargetExam] = useState('SSC CGL / CHSL');
  
  // Navigation State
  const [viewMode, setViewMode] = useState('subjects'); // subjects -> chapters -> notes
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [selectedChapter, setSelectedChapter] = useState(null);
  const [notesList, setNotesList] = useState([]);

  const sources = ['All', NOTES_SOURCES.ADDA247, NOTES_SOURCES.UNACADEMY, NOTES_SOURCES.GOOGLE];

  useEffect(() => {
    fetchUserTarget();
  }, []);

  const fetchUserTarget = async () => {
    try {
      const user = auth.currentUser;
      if (user) {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && userDoc.data().targetExam) {
          setTargetExam(userDoc.data().targetExam);
        }
      }
      setLoading(false);
    } catch (error) {
      console.error("Error fetching target:", error);
      setLoading(false);
    }
  };

  const handleSubjectPress = (subject) => {
    setSelectedSubject(subject);
    setViewMode('chapters');
  };

  const handleChapterPress = async (chapter) => {
    setSelectedChapter(chapter);
    setLoading(true);
    const notes = await fetchChapterNotes(chapter.id, selectedSource);
    setNotesList(notes);
    setViewMode('notes');
    setLoading(false);
  };

  const handleBack = () => {
    if (viewMode === 'notes') {
      setViewMode('chapters');
      setSelectedChapter(null);
    } else if (viewMode === 'chapters') {
      setViewMode('subjects');
      setSelectedSubject(null);
    } else {
      navigation.goBack();
    }
  };

  const handleDownload = (item) => {
    Alert.alert("Download Started", `"${item.title}" is being saved from ${item.source}.`);
  };

  const renderSubjectCard = ({ item }) => (
    <TouchableOpacity style={styles.subjectCard} onPress={() => handleSubjectPress(item)}>
      <View style={[styles.subjectIcon, { backgroundColor: '#EEF2FF' }]}>
        <Library size={32} color="#4F46E5" />
      </View>
      <Text style={styles.subjectTitle}>{item.subject}</Text>
      <Text style={styles.subjectCount}>{item.chapters.length} Chapters</Text>
      <ChevronRight size={20} color="#CBD5E1" style={styles.cardArrow} />
    </TouchableOpacity>
  );

  const renderChapterItem = ({ item }) => (
    <TouchableOpacity style={styles.chapterItem} onPress={() => handleChapterPress(item)}>
      <View style={styles.chapterInfo}>
        <Text style={styles.chapterTitle}>{item.title}</Text>
        <View style={styles.topicRow}>
          {item.topics.map((t, idx) => (
            <View key={idx} style={styles.topicTag}>
              <Tag size={10} color="#64748B" style={{marginRight: 4}} />
              <Text style={styles.topicText}>{t}</Text>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.chapterMeta}>
        <Text style={styles.notesBadge}>{item.notesCount} Files</Text>
        <ChevronRight size={18} color="#94A3B8" />
      </View>
    </TouchableOpacity>
  );

  const renderNoteCard = ({ item }) => (
    <TouchableOpacity style={styles.noteCard} onPress={() => handleDownload(item)}>
      <View style={styles.noteIconBox}>
        <FileText size={24} color="#EF4444" />
      </View>
      <View style={styles.noteInfo}>
        <Text style={styles.noteTitle}>{item.title}</Text>
        <View style={styles.noteMeta}>
          <Text style={styles.sourceText}>{item.source}</Text>
          <View style={styles.dot} />
          <Text style={styles.sizeText}>{item.size}</Text>
        </View>
      </View>
      <Download size={20} color="#4F46E5" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dynamic Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBack} style={styles.headerBtn}>
          <ArrowLeft size={24} color="#1E293B" />
        </TouchableOpacity>
        <View style={styles.headerText}>
          <Text style={styles.headerTitle}>
            {viewMode === 'subjects' ? 'Study Library' : (selectedSubject?.subject)}
          </Text>
          <Text style={styles.headerSubtitle}>{targetExam}</Text>
        </View>
        <View style={{ width: 44 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#4F46E5" />
        </View>
      ) : (
        <>
          {viewMode === 'subjects' && (
            <FlatList
              data={getLibraryStructure(targetExam)}
              renderItem={renderSubjectCard}
              keyExtractor={item => item.subject}
              contentContainerStyle={styles.listPadding}
              ListHeaderComponent={() => (
                <View style={styles.welcomeBox}>
                  <Text style={styles.welcomeTitle}>Chapter Wise Notes</Text>
                  <Text style={styles.welcomeDesc}>Select a subject to browse high-quality syllabus-based notes.</Text>
                </View>
              )}
            />
          )}

          {viewMode === 'chapters' && (
            <FlatList
              data={selectedSubject?.chapters}
              renderItem={renderChapterItem}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
            />
          )}

          {viewMode === 'notes' && (
            <FlatList
              data={notesList}
              renderItem={renderNoteCard}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.listPadding}
              ListHeaderComponent={() => (
                <View style={styles.chapterHeader}>
                  <Text style={styles.chapterName}>{selectedChapter?.title}</Text>
                  <Text style={styles.chapterSources}>Sourced from Adda247, Unacademy & Google</Text>
                </View>
              )}
            />
          )}
        </>
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
    padding: 20, 
    backgroundColor: 'white',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05
  },
  headerBtn: { padding: 8, backgroundColor: '#F1F5F9', borderRadius: 12 },
  headerText: { alignItems: 'center' },
  headerTitle: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  headerSubtitle: { fontSize: 11, color: '#4F46E5', fontWeight: '700', textTransform: 'uppercase', marginTop: 2 },
  listPadding: { padding: 20 },
  welcomeBox: { marginBottom: 24 },
  welcomeTitle: { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  welcomeDesc: { fontSize: 14, color: '#64748B', lineHeight: 20 },
  subjectCard: { 
    backgroundColor: 'white', 
    padding: 20, 
    borderRadius: 24, 
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    elevation: 2
  },
  subjectIcon: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  subjectTitle: { flex: 1, fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  subjectCount: { fontSize: 12, color: '#94A3B8', position: 'absolute', bottom: 20, left: 100 },
  cardArrow: { marginLeft: 10 },
  chapterItem: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  chapterInfo: { flex: 1 },
  chapterTitle: { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  topicRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  topicTag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFC', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6, borderWidth: 1, borderColor: '#F1F5F9' },
  topicText: { fontSize: 10, color: '#64748B', fontWeight: '600' },
  chapterMeta: { alignItems: 'flex-end', marginLeft: 12 },
  notesBadge: { fontSize: 10, color: '#4F46E5', fontWeight: 'bold', marginBottom: 4 },
  noteCard: { 
    backgroundColor: 'white', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9'
  },
  noteIconBox: { width: 44, height: 44, backgroundColor: '#FEF2F2', borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  noteInfo: { flex: 1 },
  noteTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  noteMeta: { flexDirection: 'row', alignItems: 'center' },
  sourceText: { fontSize: 11, color: '#4F46E5', fontWeight: '700' },
  dot: { width: 3, height: 3, borderRadius: 2, backgroundColor: '#CBD5E1', marginHorizontal: 8 },
  sizeText: { fontSize: 11, color: '#94A3B8' },
  chapterHeader: { marginBottom: 24, alignItems: 'center' },
  chapterName: { fontSize: 22, fontWeight: 'bold', color: '#1E293B', marginBottom: 4 },
  chapterSources: { fontSize: 12, color: '#94A3B8' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' }
});

export default NotesScreen;
