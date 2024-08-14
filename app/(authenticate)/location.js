import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Dimensions,
  SafeAreaView,
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  RefreshControl,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {jwtDecode} from 'jwt-decode';
import axios from 'axios';
import { useRouter } from 'expo-router';

const { width, height } = Dimensions.get('window');

const LocationScreen = () => {
  const router = useRouter();
  const [option, setOption] = useState(""); // Location input
  const [userId, setUserId] = useState("");
  const [refreshing, setRefreshing] = useState(false); // Refresh state

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  const updateUserLocation = async () => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/location`,
        { location: option }
      );
      if (response.status === 200) {
        Alert.alert("Success", "Your location has been updated");
        router.replace("(authenticate)/type");
      }
    } catch (error) {
      console.error("Error updating location:", error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    // Perform any actions you want to do on refresh (e.g., re-fetch data)
    await fetchUser();
    setRefreshing(false);
  };

  return (
    <SafeAreaView style={{ backgroundColor: '#1b1d1b', flex: 1 }}>
      <Image
        style={styles.background}
        source={{
          uri: 'https://firebasestorage.googleapis.com/v0/b/mern-blog-19722.appspot.com/o/bg.jpg?alt=media&token=b6bcd40e-94c7-472e-9131-efe8060e2e26',
        }}
        resizeMode="cover"
      />
      <View style={[styles.background, styles.overflow]} />
      <ScrollView
        contentContainerStyle={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <View style={styles.content}>
          <Text style={styles.title}>What is your Location?</Text>
          <View style={styles.inputWrapper}>
            <Ionicons style={styles.icon} name="home" size={24} color="#6a6a6a" />
            <TextInput
              value={option}
              onChangeText={setOption}
              placeholder="Enter your location"
              placeholderTextColor={"#c8c8c8"}
              keyboardType="default"
              maxLength={100}
              style={styles.input}
            />
          </View>
          <View style={styles.footer}>
            <TouchableOpacity onPress={updateUserLocation}>
              <View style={styles.btn}>
                <Text style={styles.btnText}>Next</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default LocationScreen;

const styles = StyleSheet.create({
  background: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: width,
    height: height,
  },
  overflow: {
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  scrollView: {
    flexGrow: 1,
  },
  content: {
    marginTop: 'auto',
    alignItems: 'stretch',
    paddingHorizontal: 14,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 12,
    paddingRight: 40,
  },
  footer: {
    paddingVertical: 16,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'transparent',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#6a6a6a',
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: 'white',
    flex: 1,
    marginVertical: 10,
    fontSize: 17,
    paddingHorizontal: 8,
  },
  btn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 80,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderWidth: 1,
    backgroundColor: '#ff0063',
    borderColor: '#ff0063',
    
  },
  btnText: {
    fontSize: 17,
    lineHeight: 24,
    fontWeight: '600',
    color: '#fff',
  },
});
