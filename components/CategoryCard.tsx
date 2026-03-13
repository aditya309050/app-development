import { View, Text, TouchableOpacity } from 'react-native';
import { cn } from '../lib/utils';
import { LucideIcon } from 'lucide-react-native';

interface CategoryCardProps {
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'blue' | 'green' | 'amber' | 'slate';
  onPress?: () => void;
}

export function CategoryCard({ 
  title, 
  subtitle, 
  icon: Icon, 
  variant = 'blue',
  onPress 
}: CategoryCardProps) {
  const variants = {
    blue: {
      bg: 'bg-blue-50',
      border: 'border-blue-100',
      iconBg: 'bg-blue-100',
      iconColor: '#3b82f6',
      title: 'text-blue-900',
      subtitle: 'text-blue-600'
    },
    green: {
      bg: 'bg-green-50',
      border: 'border-green-100',
      iconBg: 'bg-green-100',
      iconColor: '#10b981',
      title: 'text-green-900',
      subtitle: 'text-green-600'
    },
    amber: {
      bg: 'bg-amber-50',
      border: 'border-amber-100',
      iconBg: 'bg-amber-100',
      iconColor: '#d97706',
      title: 'text-amber-900',
      subtitle: 'text-amber-600'
    },
    slate: {
      bg: 'bg-slate-50',
      border: 'border-slate-200',
      iconBg: 'bg-slate-200',
      iconColor: '#475569',
      title: 'text-slate-900',
      subtitle: 'text-slate-600'
    }
  };

  const v = variants[variant];

  return (
    <TouchableOpacity 
      onPress={onPress}
      className={cn(
        "p-5 rounded-[28px] border flex-row items-center",
        v.bg,
        v.border
      )}
    >
      <View className={cn("p-3 rounded-2xl mr-4", v.iconBg)}>
        <Icon size={24} color={v.iconColor} />
      </View>
      <View className="flex-1">
        <Text className={cn("font-bold text-lg", v.title)}>{title}</Text>
        {subtitle && (
          <Text className={cn("text-sm", v.subtitle)}>{subtitle}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}
