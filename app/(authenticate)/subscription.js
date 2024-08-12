import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

const subscription = () => {
  const router = useRouter();
  const [option, setOption] = useState("free");
  const [userId, setUserId] = useState("");
  const [value, setValue] = React.useState(0);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const updateUserSubscription = async () => {
    try {
      const response = await axios.put(
        `http://192.168.8.189:3000/users/${userId}/subscription`,
        {
          subscription: option,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        router.replace("(tabs)/profile");
      }
    } catch (error) {
      console.log("error", error);
      Alert.alert("Error", "An error occurred. Please try again.");
    }
  };

  const items = [
    {
      id: "0",
      label: "FREE",
      price: 0,
      badge: "Basic Access",
      description: "Connect with matches and send limited messages",
    },
    {
      id: "1",
      label: "PLUS",
      price: 10,
      badge: "Recommended",
      description: "Send unlimited messages and see who liked you",
    },
    {
      id: "2",
      label: "PREMIUM",
      price: 30,
      badge: "Best Value",
      description:
        "Enjoy all features including priority matches and profile boosts",
    },
  ];
  return (
    <ImageBackground 
      source={{uri: "https://firebasestorage.googleapis.com/v0/b/mern-blog-19722.appspot.com/o/bg1.jpg?alt=media&token=baf261fe-33d5-40fb-94bc-fc3c8987f36a"}}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      {/* Adding an overlay */}
      <View style={styles.overlay}>
        <View style={styles.container}>
          <Text style={styles.title}>Pick your plan</Text>
          {items.map(({ label, price, badge, description }, index) => {
            const isActive = value === index;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  setValue(index);
                  setOption(label.toLowerCase());
                }}
              >
                <View style={[styles.radio, isActive && styles.radioActive]}>
                  <Text style={styles.radioLabel}>{label}</Text>
                  <Text style={styles.radioPrice}>
                    ${price}
                    /month
                  </Text>
                  <View style={styles.radioBadge}>
                    <Text style={styles.radioBadgeText}>{badge}</Text>
                  </View>
                  <Text style={styles.radioDescription}>{description}</Text>
                  <View
                    style={[
                      styles.radioInput,
                      isActive && styles.radioInputActive,
                    ]}
                  />
                </View>
              </TouchableOpacity>
            );
          })}

          <Pressable
            onPress={updateUserSubscription}
            style={styles.nextButton}
          >
            <Text style={styles.nextButtonText}>Next</Text>
          </Pressable>
        </View>
      </View>
    </ImageBackground>
  );
};

export default subscription;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for better contrast
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
    textAlign: 'center', // Center the title
  },
  /** Radio */
  radio: {
    position: "relative",
    backgroundColor: "#fff",
    marginBottom: 12,
    marginTop: 16,
    padding: 16,
    borderRadius: 8,
    alignItems: "flex-start",
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  radioActive: {
    borderColor: "#0069fe",
  },
  radioLabel: {
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1.2,
    color: "#b3b3b3",
    textTransform: "uppercase",
    marginBottom: 8,
  },
  radioPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#2f2f2f",
    marginBottom: 12,
  },
  radioBadge: {
    backgroundColor: "#dce9fe",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginBottom: 12,
  },
  radioBadgeText: {
    fontSize: 15,
    fontWeight: "500",
    color: "#0069fe",
  },
  radioDescription: {
    fontSize: 15,
    fontWeight: "500",
    color: "#848a96",
  },
  radioInput: {
    position: "absolute",
    top: 16,
    right: 16,
    width: 24,
    height: 24,
    borderRadius: 9999,
    borderWidth: 2,
    borderColor: "#b0b0b0",
  },
  radioInputActive: {
    borderWidth: 7,
    borderColor: "#0069fe",
  },
  nextButton: {
    marginTop: 35,
    marginBottom: 30,
    backgroundColor: "#ff9200",
    padding: 12,
    borderRadius: 4,
    width: 200,
    justifyContent: "center",
    alignSelf: "center",
    alignItems: "center",
  },
  nextButtonText: {
    textAlign: "center",
    color: "white",
    fontWeight: "600",
  },
});