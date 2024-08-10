import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { useRouter } from "expo-router";

const select = () => {
  const router = useRouter();
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  const updateUserGender = async () => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/gender`,
        {
          gender: option,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        router.replace("(authenticate)/type");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 12 }}>
      <Image
        source={require("../../assets/r.png")}
        style={{ width: 400, height: 300, alignSelf: "center" }}
      />
      <Pressable
        onPress={() => setOption("male")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 5,
          borderColor: option == "male" ? "#D0D0D0" : "transparent",
          borderWidth: option == "male" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a Man</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/man.png?alt=media&token=310e5c76-027f-4e50-946f-eb3aa7cccdf2",
          }}
        />
      </Pressable>

      <Pressable
        onPress={() => setOption("female")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 5,
          borderColor: option == "female" ? "#D0D0D0" : "transparent",
          borderWidth: option == "female" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am a Woman</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/girl.png?alt=media&token=19ef2d11-4bed-4e53-8225-0b8f24bdc8b3",
          }}
        />
      </Pressable>

      <Pressable
        onPress={() => setOption("nonbinary")}
        style={{
          backgroundColor: "#F0F0F0",
          padding: 12,
          justifyContent: "space-between",
          flexDirection: "row",
          alignItems: "center",
          marginTop: 25,
          borderRadius: 5,
          borderColor: option == "nonbinary" ? "#D0D0D0" : "transparent",
          borderWidth: option == "nonbinary" ? 1 : 0,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500" }}>I am Non-Binary</Text>
        <Image
          style={{ width: 50, height: 50 }}
          source={{
            uri: "https://firebasestorage.googleapis.com/v0/b/quickbuy-assign.appspot.com/o/warning.png?alt=media&token=8e681fdb-b80c-4f67-8558-1dd68d2a2d53",
          }}
        />
      </Pressable>

      {option && (
        <Pressable
          onPress={updateUserGender}
          style={{
            marginTop: 55,
            backgroundColor: "#ff9200",
            padding: 12,
            borderRadius: 4,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            Next
          </Text>
        </Pressable>
      )}
    </ScrollView>
  );
};

export default select;

const styles = StyleSheet.create({});
