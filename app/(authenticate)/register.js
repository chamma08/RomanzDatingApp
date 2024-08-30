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
import { MaterialIcons, Ionicons, AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

const { width, height } = Dimensions.get("window");

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); 
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); 

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

    if (password !== confirmPassword) {
      Alert.alert("Password Mismatch", "Password and confirm password do not match");
      return;
    }

    const user = { name, email, password, age };

    axios.post("https://romanz-dating-app.vercel.app/register", user)
      .then((response) => {
        console.log(response);
        Alert.alert("Registration Successful", "You have been registered successfully");
        setName("");
        setEmail("");
        setPassword("");
        setConfirmPassword("");
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
          <Text style={styles.title}>Register your Account</Text>

          <View style={styles.imageContainer}>
            <Image
              style={styles.image}
              source={{ uri: 'https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/love.png?alt=media&token=4762e476-0ff6-45a9-998c-900b6fc3d8d9' }}
            />
          </View>

          <View style={styles.inputContainer}>
            <View style={styles.inputWrapper}>
              <Ionicons style={styles.icon} name="person-sharp" size={24} color="#6a6a6a" />
              <TextInput
                value={name}
                onChangeText={(text) => setName(text)}
                placeholder="Enter your name"
                placeholderTextColor={"#c8c8c8"}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <Ionicons style={styles.icon} name="finger-print" size={24} color="#6a6a6a" />
              <TextInput
                value={age}
                onChangeText={handleAgeChange}
                placeholder="Enter your age"
                placeholderTextColor={"#c8c8c8"}
                keyboardType="numeric"
                maxLength={2}
                style={styles.input}
              />
            </View>

            <View style={styles.inputWrapper}>
              <MaterialIcons style={styles.icon} name="email" size={24} color="#6a6a6a" />
              <TextInput
                value={email}
                onChangeText={(text) => setEmail(text)}
                placeholder="Enter your email"
                placeholderTextColor={"#c8c8c8"}
                style={styles.input}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputWrapper}>
              <AntDesign style={styles.icon} name="lock1" size={24} color="#6a6a6a" />
              <TextInput
                value={password}
                onChangeText={(text) => setPassword(text)}
                secureTextEntry={!showPassword}
                placeholder="Enter your password"
                style={styles.input}
                placeholderTextColor="#c8c8c8"
              />
              <Pressable onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color="black"
                  style={{
                    marginRight: 10,
                  }}
                />
              </Pressable>
            </View>

            <View style={styles.inputWrapper}>
              <AntDesign style={styles.icon} name="lock" size={24} color="#6a6a6a" />
              <TextInput
                value={confirmPassword}
                onChangeText={(text) => setConfirmPassword(text)}
                secureTextEntry={!showConfirmPassword}
                placeholder="Confirm your password"
                style={styles.input}
                placeholderTextColor="#c8c8c8"
              />
              <Pressable onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Ionicons
                  name={showConfirmPassword ? "eye" : "eye-off"}
                  size={20}
                  color="black"
                  style={{
                    marginRight: 10,
                  }}
                />
              </Pressable>
            </View>

            <LinearGradient
            colors={["#ff0063","#ff8b8b" ]} // Define your gradient colors here
            start={{ x: 0, y: 0 }} // Starting point of the gradient (top-left corner)
            end={{ x: 1, y: 1 }} // Ending point of the gradient (bottom-right corner)
            style={styles.registerButton} // Apply the loginButton style to the gradient
          >
            <Pressable
              onPress={handleRegister}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.registerButtonText}>Register</Text>
            </Pressable>
          </LinearGradient>

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
    backgroundColor: '#eeeeee',
    paddingVertical: 10,
    borderRadius: 20,
    marginBottom: 15,
  },
  icon: {
    marginLeft: 8,
  },
  input: {
    color: 'black',
    flex: 1,
    paddingHorizontal: 10,
  },
  registerButton: {
    width: '100%',
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 20,
    marginTop: 20,
    paddingVertical: 10, // Adjust padding for better touchable area
  },
  registerButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginLink: {
    marginTop: 20,
    marginBottom: 20,
  },
  loginText: {
    color: 'black',
    fontSize: 16,
    alignSelf: 'center',
  },
  loginLinkText: {
    fontWeight: 'bold',
    color: '#FF3974',
  },
});

export default Register;
