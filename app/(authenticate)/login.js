import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  Image,
  KeyboardAvoidingView,
  TextInput,
  Pressable,
  Alert,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import LottieView from "lottie-react-native";
import { Ionicons } from "@expo/vector-icons";

const { width, height } = Dimensions.get("window");

const login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false); 

  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem("auth");
        if (token) {
          const decodedToken = jwtDecode(token);
          const userId = decodedToken.userId;
          const response = await axios.get(
            `https://romanz-dating-app.vercel.app/users/${userId}`
          );
          const user = response.data;
          if (user.step2) {
            router.replace("/(tabs)/profile");
          } else if (user.step1) {
            router.replace("(authenticate)/subscription");
          } else {
            router.replace("(authenticate)/select");
          }
        }
      } catch (error) {
        console.log("Error checking login status", error);
      }
    };
    checkLoginStatus();
  }, [router]);

  const handleLogin = async () => {
    const user = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        "https://romanz-dating-app.vercel.app/login",
        user
      );
      console.log(response);
      const { token, steps } = response.data;

      await AsyncStorage.setItem("auth", token);

      console.log("User steps:", steps);

      // Check steps and route accordingly
      if (steps.step2) {
        router.replace("/(tabs)/profile");
      } else if (steps.step1) {
        router.replace("(authenticate)/subscription");
      } else {
        router.replace("(authenticate)/select");
      }
    } catch (error) {
      Alert.alert("Login Error", "An error occurred while logging in");
      console.log("Login failed", error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["#FF635C", "#FF3974"]} style={styles.gradient}>
        <View style={styles.imageContainer}>
          <Image
            style={styles.logo}
            source={{
              uri: "https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/Romanzu%20Logo.png?alt=media&token=ef5a5884-c55b-4596-908f-8ab0254ce8fc",
            }}
          />
        </View>
      </LinearGradient>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.lottieViewContainer}>
          <LottieView
            source={require("../../assets/animations/login.json")}
            style={styles.lottieView}
            autoPlay
            loop={true}
            speed={0.7}
          />
        </View>

        <View style={styles.formContainer}>
          <View style={styles.inputContainer}>
            <MaterialIcons name="email" size={24} color="#6a6a6a" />
            <TextInput
              value={email}
              onChangeText={(text) => setEmail(text)}
              placeholder="Enter your email"
              placeholderTextColor="#c8c8c8"
              style={styles.input}
            />
          </View>

          <View style={styles.inputContainer}>
            <AntDesign name="lock1" size={24} color="#6a6a6a" />
            <TextInput
              value={password}
              onChangeText={(text) => setPassword(text)}
              secureTextEntry={!showPassword}
              placeholder="Enter your password"
              placeholderTextColor="#c8c8c8"
              style={styles.input}
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

          <View style={styles.footer}>
            <Text style={styles.footerText}>Keep me logged in</Text>
            <Text style={styles.forgotPassword}>Forgot Password</Text>
          </View>

          <LinearGradient
            colors={["#ff0063","#ff8b8b" ]} // Define your gradient colors here
            start={{ x: 0, y: 0 }} // Starting point of the gradient (top-left corner)
            end={{ x: 1, y: 1 }} // Ending point of the gradient (bottom-right corner)
            style={styles.loginButton} // Apply the loginButton style to the gradient
          >
            <Pressable
              onPress={handleLogin}
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text style={styles.loginButtonText}>Login</Text>
            </Pressable>
          </LinearGradient>

          <Pressable
            onPress={() => router.replace("/register")}
            style={styles.registerLink}
          >
            <Text style={styles.registerText}>
              Don't have an account?{" "}
              <Text style={styles.registerTextBold}>Register</Text>
            </Text>
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
  },
  gradient: {
    height: height * 0.25,
    width: "100%",
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  logo: {
    width: width * 0.9,
    height: height * 0.25,
    resizeMode: "contain",
    borderRadius: 50,
  },
  keyboardAvoidingView: {
    flex: 1,
    width: "100%",
    alignItems: "center",
    padding: 20,
  },
  lottieViewContainer: {
    alignItems: "center",
  },
  lottieView: {
    height: height * 0.2,
    width: width * 0.9,
  },
  formContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: 20,
    height: 800,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ebebeb",
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
    marginVertical: 10,
    width: "95%",
  },
  input: {
    color: "black",
    width: "85%",
    fontSize: 17,
    marginLeft: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "90%",
    marginTop: 12,
  },
  footerText: {
    color: "black",
  },
  forgotPassword: {
    color: "#007FFF",
    fontWeight: "500",
  },
  loginButton: {
    width: "60%",
    borderRadius: 40,
    padding: 10,
    marginTop: 40,
    height: 45,
  },
  loginButtonText: {
    textAlign: "center",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  registerLink: {
    marginTop: 22,
  },
  registerText: {
    textAlign: "center",
    color: "black",
    fontSize: 16,
  },
  registerTextBold: {
    color: "#FF69B4",
    fontWeight: "bold",
  },
});

export default login;
