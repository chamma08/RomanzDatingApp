import {
  StyleSheet,
  Text,
  View,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  TextInput,
  Pressable,
  ImageBackground,
} from "react-native";
import React, { useLayoutEffect, useState, useEffect } from "react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams } from "expo-router";
import { Entypo, Feather } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { io } from "socket.io-client";
import axios from "axios";

const chatRoom = ({receiverId}) => {
  const navigation = useNavigation();
  const [message, setMessage] = useState("");
  const params = useLocalSearchParams();
  const [messages, setMessages] = useState([]);
  const [profile, setProfile] = useState({});
  const [userId, setUserId] = useState(null);
  const [image, setImage] = useState(null);
  const socket = io("http://192.168.8.189:8000");

  
  socket.on("connect", () => {
    console.log("Connected to the Socket.IO server");
  });
  socket.on("receiveMessage", (newMessage) => {
    console.log("new Message", newMessage);

    //update the state to include new message
    setMessages((prevMessages) => [...prevMessages, newMessage]);
  });
  const sendMessage = async (senderId, receiverId) => {
    socket.emit("sendMessage", { senderId, receiverId, message });

    setMessage("");

    // call the fetchMessages() function to see the UI update
    setTimeout(() => {
        fetchMessages();
    },200)
  };
  useEffect(() => {
    console.log("Image URL: ", params?.image);
  }, [params]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://192.168.8.189:3000/users/${userId}`);
        const user = response.data;
        setProfile(user?.user?.profilePicture);
      } catch (error) {
        console.log("Error fetching user profile", error);
      }
    };

    fetchProfile();
  }, [userId]);


  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Ionicons name="arrow-back" size={24} color="black" 
          onPress={() => navigation.goBack()}
          />
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            {/* <Image
              style={{
                width: 30,
                height: 30,
                borderRadius: 15,
                resizeMode: "cover",
              }}
              source={{
                uri: receiverId?.image || "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
              }}
              onError={(e) => console.log("Image Load Error", e.nativeEvent.error)}
            /> */}
            <Text style={{ fontSize: 15, fontWeight: "bold" }}>
              {params?.name}
            </Text>
          </View>
        </View>
      ),
      headerRight: () => (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
          <Ionicons name="videocam-outline" size={24} color="black" />
        </View>
      ),
    });
  }, []);
  const fetchMessages = async () => {
    try {
      const senderId = params?.senderId;
      const receiverId = params?.receiverId;

      const response = await axios.get("http://192.168.8.189:3000/messages", {
        params: { senderId, receiverId },
      });

      setMessages(response.data);
    } catch (error) {
      console.log("Error fetching the messages", error);
    }
  };
  useEffect(() => {
    fetchMessages();
  }, []);
  const formatTime = (time) => {
    const options = { hour: "numeric", minute: "numeric" };
    return new Date(time).toLocaleString("en-US", options);
  };
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        {messages?.map((item, index) => (
          <Pressable
            style={[
              item?.senderId === params?.senderId
                ? {
                    alignSelf: "flex-end",
                    backgroundColor: "#F08080",
                    padding: 8,
                    maxWidth: "60%",
                    borderRadius: 7,
                    margin: 10,
                  }
                : {
                    alignSelf: "flex-start",
                    backgroundColor: "#DB7093",
                    padding: 8,
                    margin: 10,
                    borderRadius: 7,
                    maxWidth: "60%",
                  },
            ]}
          >
            <Text style={{ fontSize: 13, textAlign: "left", color: "white",fontWeight:"500" }}>
              {item?.message}
            </Text>
            <Text style={{fontSize:9,textAlign:"right",color:"#F0F0F0",marginTop:5}}>{formatTime(item?.timestamp)}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 10,
          paddingVertical: 10,
          borderTopWidth: 1,
          borderTopColor: "#dddddd",
          marginBottom: 1,
        }}
      >
        <Entypo
          style={{ marginRight: 7 }}
          name="emoji-happy"
          size={24}
          color="gray"
        />
        <TextInput
          value={message}
          onChangeText={(text) => setMessage(text)}
          style={{
            flex: 1,
            height: 40,
            borderWidth: 1,
            borderColor: "#dddddd",
            borderRadius: 20,
            paddingHorizontal: 10,
          }}
          placeholder="Type your message..."
        />

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            marginHorizontal: 8,
          }}
        >
          <Entypo name="camera" size={24} color="gray" />

          <Feather name="mic" size={24} color="gray" />
        </View>

        <Pressable
          onPress={() => sendMessage(params?.senderId, params?.receiverId)}
          style={{
            backgroundColor: "#007bff",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 20,
          }}
        >
          <Text style={{ textAlign: "center", color: "white" }}>Send</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
};

export default chatRoom

const styles = StyleSheet.create({})