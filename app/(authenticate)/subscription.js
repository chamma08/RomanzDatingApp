import {
  Alert,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
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
        `https://romanz-dating-app.vercel.app/users/${userId}/subscription`,
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
      color: "#0069fe",
    },
    {
      id: "1",
      label: "PLUS",
      price: 10,
      badge: "Recommended",
      description: "Send unlimited messages and see who liked you",
      color: "silver",
    },
    {
      id: "2",
      label: "PREMIUM",
      price: 30,
      badge: "Best Value",
      description:
        "Enjoy all features including priority matches and profile boosts",
      color: "#ffce00",
    },
  ];

  const getRadioActiveStyle = (index) => {
    if (value === index) {
      return {
        borderColor: items[index].color,
        backgroundColor: "white",
        borderWidth: 2,
      };
    }
    return {};
  };

  const getRadioBadgeStyle = (index) => {
    if (value === index) {
      return {
        bbackgroundColor: items[index].color,
        paddingVertical: 6,
        borderRadius: 6,
        marginBottom: 12,
      };
    }
    return styles.radioBadge;
  };

  const getRadioBadgeTextStyle = (index) => {
    if (value === index) {
      return {
        fontSize: 15,
        fontWeight: "500",
        color: "white",
        backgroundColor: items[index].color,
        paddingVertical: 6,
        paddingHorizontal: 12,
        borderRadius: 6,
      };
    }
    return styles.radioBadgeText;
  };

  return (
    <ImageBackground
      source={{
        uri: "https://firebasestorage.googleapis.com/v0/b/mern-blog-19722.appspot.com/o/bg1.jpg?alt=media&token=baf261fe-33d5-40fb-94bc-fc3c8987f36a",
      }}
      resizeMode="cover"
      style={{ flex: 1 }}
    >
      <View style={styles.overlay}>
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
            <Text style={styles.title}>Pick your plan</Text>
            <View style={styles.underline} />
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
                  <View
                    style={[
                      styles.radio,
                      styles.radioInactive,
                      isActive && styles.radioActive,
                      getRadioActiveStyle(index),
                    ]}
                  >
                    <Text style={styles.radioLabel}>{label}</Text>
                    <Text style={styles.radioPrice}>${price}/month</Text>
                    <View style={getRadioBadgeStyle(index)}>
                      <Text style={getRadioBadgeTextStyle(index)}>{badge}</Text>
                    </View>
                    <Text style={styles.radioDescription}>{description}</Text>
                    <View
                      style={[
                        styles.radioInput,
                        isActive && {
                          backgroundColor: items[index].color,
                          borderColor: items[index].color,
                        },
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
        </ScrollView>
      </View>
    </ImageBackground>
  );
};

export default subscription;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: "center", // Center content vertically
    paddingBottom: 50, // Add some padding to the bottom for small screens
  },
  container: {
    padding: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
    textAlign: "center",
  },
  underline: {
    height: 8,
    backgroundColor: "#e300ff",
    marginBottom: 24,
    width: "40%",
    alignSelf: "center",
    borderRadius: 5,
  },
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
  radioInactive: {
    backgroundColor: "#fff",
    borderColor: "transparent",
  },
  radioActive: {
    backgroundColor: "white", // Same background as inactive
    borderColor: "#0069fe", // Active border color
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
    backgroundColor: "#ff0063",
    padding: 12,
    borderRadius: 70,
    width: 150,
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
