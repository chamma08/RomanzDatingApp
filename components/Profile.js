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

  return (
    <View className="flex-1 relative">
      <View
              style={{ flexDirection: "row", alignItems: "center", gap: 20 }}
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
                  }}
                >
                  <Animatable.View
                    animation="swing"
                    easing={"ease-in-out-circ"}
                    iterationCount={1}
                  >
                    <AntDesign name="heart" size={37} color="red" />
                  </Animatable.View>
                </Pressable>
              ) : (
                <Pressable
                  onPress={() => handleLike(item?._id)}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <AntDesign name="hearto" size={37} color="#FF033E" />
                </Pressable>
              )}
            </View>
    </View>
  );
};

export default Profile;

const styles = StyleSheet.create({});