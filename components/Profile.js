import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  Pressable,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { Entypo } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as Animatable from "react-native-animatable";

const Profile = ({ item, userId,setProfiles }) => {

  const [liked, setLiked] = useState(false);

  const handleLike = async (selectedUserId) => {
    try {
      setLiked(true);
      await axios.post("https://romanz-dating-app.vercel.app/send-like", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });

       setTimeout(() => {
        setProfiles((prevProfiles) =>
          prevProfiles.filter((profile) => profile._id !== selectedUserId)
        );
        setLiked(false);
      }, 200); 
    } catch (error) {
      console.log("error liking", error);
    }
  };

  const handleRemove = async (selectedUserId) => {
    try {
      await axios.post("https://romanz-dating-app.vercel.app/send-remove", {
        currentUserId: userId,
        selectedUserId: selectedUserId,
      });

      setProfiles((prevProfiles) =>
        prevProfiles.filter((profile) => profile._id !== selectedUserId)
      );
    } catch (error) {
      console.log("error removing", error);
    }
  }

  return (
    <View className="flex-1 relative mt-3 ">
      <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20, justifyContent: "center" }}
            >
              {liked ? (
                <Pressable
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                    marginTop: 10,
                    /* backgroundColor: "white", */
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={30} color="red" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleLike(item?._id)}
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ab00ff",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.25,
                    shadowRadius: 3.84,
                    elevation: 5,
                    marginTop: 10,
                  }}
                >
                  <AntDesign name="heart" size={28} color="white" />
                </Pressable>
              )}

              <Pressable
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#0433ff",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  marginTop: 10,
                }}
              >
                <FontAwesome name="star" size={28} color="white" />
              </Pressable>

              <Pressable
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ece200",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  marginTop: 10,
                }}
              >
                <Entypo name="block" size={28} color="white" />
              </Pressable>

              <Pressable
                onPress={() => handleRemove(item?._id)}
                style={{
                  width: 45,
                  height: 45,
                  borderRadius: 25,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#ec0000",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.25,
                  shadowRadius: 3.84,
                  elevation: 5,
                  marginTop: 10,
                }}
              >
                <FontAwesome name="remove" size={28} color="white" />
              </Pressable>
            </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});