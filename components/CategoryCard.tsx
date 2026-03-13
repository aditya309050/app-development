import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LucideIcon } from 'lucide-react-native';

interface CategoryCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'amber' | 'slate';
  onPress?: () => void;
}

const variants = {
  blue: {
    bg: '#eff6ff',
    border: '#dbeafe',
    iconBg: '#dbeafe',
    iconColor: '#3b82f6',
    title: '#1e3a8a',
    subtitle: '#2563eb'
  },
  green: {
    bg: '#f0fdf4',
    border: '#dcfce7',
    iconBg: '#dcfce7',
    iconColor: '#10b981',
    title: '#064e3b',
    subtitle: '#16a34a'
  },
  amber: {
    bg: '#fffbeb',
    border: '#fef3c7',
    iconBg: '#fef3c7',
    iconColor: '#d97706',
    title: '#78350f',
    subtitle: '#b45309'
  },
  slate: {
    bg: '#f8fafc',
    border: '#e2e8f0',
    iconBg: '#e2e8f0',
    iconColor: '#475569',
    title: '#0f172a',
    subtitle: '#475569'
  }
};

export function CategoryCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  variant = 'blue',
  onPress 
}: CategoryCardProps) {
  const v = variants[variant];

  return (
    <TouchableOpacity 
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: v.bg, borderColor: v.border }
      ]}
    >
      <View style={[styles.iconContainer, { backgroundColor: v.iconBg }]}>
        <Icon size={24} color={v.iconColor} />
      </View>
      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: v.title }]}>{title}</Text>
        {subtitle && (
          <Text style={[styles.subtitle, { color: v.subtitle }]}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 20,
    borderRadius: 28,
    borderWidth: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  iconContainer: {
    padding: 12,
    borderRadius: 16,
    marginRight: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
  },
  subtitle: {
    fontSize: 14,
    marginTop: 2,
  },
});
