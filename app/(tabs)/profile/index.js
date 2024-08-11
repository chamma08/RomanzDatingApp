import {
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import Profile from "../../../components/Profile";
import { router } from "expo-router";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ItemCard from "../../../components/ItemCard";
import Carousel from "react-native-snap-carousel";
import { widthPercentageToDP as wp } from 'react-native-responsive-screen';

const index = () => {
  const [userId, setUserId] = useState("");
  const [user, setUser] = useState();
  const [profiles, setProfiles] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);
  const fetchUserDescription = async () => {
    try {
      const response = await axios.get(
        `https://romanz-dating-app.vercel.app/users/${userId}`
      );
      console.log(response);
      const user = response.data;
      setUser(user?.user);
    } catch (error) {
      console.log("Error fetching user description", error);
    }
  };

  const fetchProfiles = async () => {
    try {
      const response = await axios.get("https://romanz-dating-app.vercel.app/profiles", {
        params: {
          userId: userId,
          gender: user?.gender,
          turnOns: user?.turnOns,
          lookingFor: user?.lookingFor,
          age: user?.age,
        },
      });

      setProfiles(response.data.profiles);
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserDescription();
    }
  }, [userId]);
  useEffect(() => {
    if (userId && user) {
      fetchProfiles();
    }
  }, [userId, user]);
  console.log("profiles", profiles);

  const renderItem = ({ item }) => (
    <ItemCard item={item} userId={userId} setProfiles={setProfiles} />
  );

  return (
    <View style={{ flex: 1 }}>
      <View className="px-4 justify-center text-center">
      <Carousel
        data={profiles}
        loop={true}
        autoplay={false}
        renderItem={renderItem}
        hasParallaxImages={true}
        sliderWidth={wp(105)}
        firstItem={1}
        autoplayInterval={5000}
        itemWidth={wp(100) - 60}
        slideStyle={{ display: "flex", alignItems: "center",marginTop: 20,marginBottom: 20 }}
      />
      </View>
    </View>
  );
};

export default index;

const styles = StyleSheet.create({});
