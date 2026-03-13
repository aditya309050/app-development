import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { Book, FileText, BarChart2 } from 'lucide-react-native';

const PlaceholderScreen = ({ name, icon: Icon }) => (
  <View style={styles.container}>
    <Icon color={theme.colors.accent} size={64} style={{ marginBottom: 20 }} />
    <Text style={styles.text}>{name} Module</Text>
    <Text style={styles.subtext}>We are preparing high-quality content for you. Stay tuned!</Text>
  </View>
);

export const NotesScreen = () => <PlaceholderScreen name="Study Notes" icon={Book} />;
export const PYQScreen = () => <PlaceholderScreen name="Previous Papers" icon={FileText} />;
export const RankingScreen = () => <PlaceholderScreen name="Global Ranking" icon={BarChart2} />;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    color: theme.colors.white,
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtext: {
    color: theme.colors.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 10,
    paddingHorizontal: 40,
  },
});
