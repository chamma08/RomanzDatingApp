import React, { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Index = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(null); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('auth'); 
        if (token) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
  }, []);

  if (isLoggedIn === null) {
    return null; // Or a loading indicator
  }

  return isLoggedIn ? (
    <Redirect href="/(tabs)/profile" />
  ) : (
    <Redirect href="/(authenticate)/start" />
  );
};

export default Index;
