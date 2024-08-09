import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  Pressable,
  TextInput,
  KeyboardAvoidingView,
  Alert,
  ScrollView,
  Platform,
  Dimensions,
} from "react-native";
import React, { useState } from "react";
import { MaterialIcons, Ionicons, AntDesign, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleAgeChange = (text) => {
    const numericText = text.replace(/[^0-9]/g, '');
    if (numericText.length >= 2 && parseInt(numericText) < 18) {
      Alert.alert("Invalid Age", "Your age must be at least 18 years old");
      return;
    }
    setAge(numericText);
  };

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleRegister = () => {
    if (!name) {
      Alert.alert("Invalid Name", "Name cannot be empty");
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert("Invalid Email", "Please enter a valid email address");
      return;
    }

    if (password.length < 6) {
      Alert.alert("Invalid Password", "Password should be at least 6 characters long");
      return;
    }

    const user = { name, email, password, age };

    axios.post("http://192.168.8.189:3000/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert("Registration Successful", "You have been registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setAge("");
        router.replace("/login");
      })
      .catch((error) => {
        Alert.alert("Registration Error", "An error occurred while registering");
        console.log("Registration failed", error);
      });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <LinearGradient
        colors={['#FF635C', '#FF3974']}
        style={styles.gradient}
      >
        <View style={styles.logoContainer}>
          <Image
            style={styles.logo}
            source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/Romanzu%20Logo.png?alt=media&token=ef5a5884-c55b-4596-908f-8ab0254ce8fc' }}
          />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Text style={styles.title}>Register to your Account</Text>

          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/love.png?alt=media&token=4762e476-0ff6-45a9-998c-900b6fc3d8d9' }}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons style={styles.icon} name="person-sharp" size={24} color="white" />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Enter your name"
                placeholderTextColor={"white"}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons style={styles.icon} name="finger-print" size={24} color="white" />
              <TextInput
                value={age}
                onChangeText={handleAgeChange}
                placeholder="Enter your age"
                placeholderTextColor={"white"}
                keyboardType="numeric"
                maxLength={2}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcons style={styles.icon} name="email" size={24} color="white" />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                placeholderTextColor={"white"}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <AntDesign style={styles.icon} name="lock1" size={24} color="white" />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={true}
                placeholder="Enter your password"
                style={styles.input}
                placeholderTextColor="white"
              />
            </View>

            <Pressable onPress={handleRegister} style={styles.registerButton}>
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>

            <Pressable onPress={() => router.replace("/login")} style={styles.loginLink}>
              <Text style={styles.loginText}>
                Already have an account?{" "}
                <Text style={styles.loginLinkText}>Login</Text>
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    alignItems: 'center',
  },
  gradient: {
    height: height * 0.2,
    width: '100%',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
  },
  logoContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.2,
    resizeMode: 'contain',
    borderRadius: 50,
  },
  container: {
    flex: 1,
    width: '100%',
  },
  scrollView: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 25,
    color: 'black',
    fontStyle: 'italic',
  },
  imageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  image: {
    width: 100,
    height: 100,
    resizeMode: 'cover',
  },
  inputContainer: {
    width: '100%',
    marginTop: 20,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#db2b64',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
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
  registerButton: {
    width: '80%',
    backgroundColor: '#ff9200',
    borderRadius: 6,
    alignSelf: 'center',
    padding: 10,
    marginTop: 20,
  },
  registerButtonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 12,
  },
  loginText: {
    textAlign: 'center',
    color: 'black',
    fontSize: 16,
  },
  loginLinkText: {
    fontSize: 16,
    color: '#FF69B4',
    fontWeight: 'bold',
  },
});

export default Register;
