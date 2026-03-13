import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { auth, db } from './src/config/firebase';

import TabNavigator from './src/navigation/TabNavigator';
import AuthNavigator from './src/navigation/AuthNavigator';
import TargetSelectionScreen from './src/screens/TargetSelectionScreen';
import { theme } from './src/theme';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [onboardingComplete, setOnboardingComplete] = useState(false);

  useEffect(() => {
    let unsubscribeDoc = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (authenticatedUser) => {
      // Clean up previous doc listener if any
      if (unsubscribeDoc) unsubscribeDoc();

      if (authenticatedUser) {
        setUser(authenticatedUser);
        
        const userDocRef = doc(db, "users", authenticatedUser.uid);
        
        // Listen to user document
        unsubscribeDoc = onSnapshot(userDocRef, 
          (docSnap) => {
            if (docSnap.exists()) {
              setOnboardingComplete(docSnap.data().onboardingComplete || false);
            } else {
              // Doc might not exist yet if signup setDoc is slow
              setOnboardingComplete(false);
            }
            setLoading(false);
          },
          (error) => {
            console.error("Firestore loading error:", error);
            // Even on error, we should stop the global loading spinner
            setLoading(false);
          }
        );
      } else {
        setUser(null);
        setOnboardingComplete(false);
        setLoading(false);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) unsubscribeDoc();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, backgroundColor: theme.colors.primary, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color={theme.colors.accent} />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="light" backgroundColor={theme.colors.primary} />
      {user ? (
        onboardingComplete ? (
          <TabNavigator />
        ) : (
          <TargetSelectionScreen />
        )
      ) : (
        <AuthNavigator />
      )}
    </NavigationContainer>
  );
}
