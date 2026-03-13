import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import TabNavigator from './src/navigation/TabNavigator';
import { theme } from './src/theme';

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={theme.colors.primary} />
      <TabNavigator />
    </NavigationContainer>
  );
}
