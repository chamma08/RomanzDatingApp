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
  import { AntDesign } from "@expo/vector-icons";

const type = () => {
    const router = useRouter();
  const [option, setOption] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedTurnOns, setSelectedTurnOns] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
    };

    fetchUser();
  }, []);

  const turnons = [
    {
      id: "0",
      name: "Music",
      description: "Pop Rock-Indie pick our sound track",
    },
    {
      id: "10",
      name: "Kissing",
      description:
        " It's a feeling of closeness, where every touch of lips creates a symphony of emotions.",
    },
    {
      id: "1",
      name: "Fantasies",
      description:
        "Fantasies can be deeply personal, encompassing diverse elements such as romance",
    },
    {
      id: "2",
      name: "Nibbling",
      description:
        "playful form of biting or taking small, gentle bites, typically done with the teeth",
    },
    {
      id: "3",
      name: "Desire",
      description: "powerful emotion or attainment of a particular person.",
    },
  ];

  const handleToggleTurnOn = (turnOn) => {
    if (selectedTurnOns.includes(turnOn)) {
      removeTurnOn(turnOn);
    } else {
      addTurnOn(turnOn);
    }
  };
  const addTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/turn-ons/add`,
        {
          turnOn: turnOn,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setSelectedTurnOns([...selectedTurnOns, turnOn]);
      }
    } catch (error) {
      console.log("Error adding turn on", error);
    }
  };
  const removeTurnOn = async (turnOn) => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/turn-ons/remove`,
        {
          turnOn: turnOn,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setSelectedTurnOns(selectedTurnOns.filter((item) => item !== turnOn));
      }
    } catch (error) {
      console.log("error removing turn on", error);
    }
  };
 
  return (
   

    
    <ScrollView style={{ flex: 1, backgroundColor: "white", padding: 12 }}> 
    <View>
      <Image
        source={require("../../assets/a.png")}
        style={{ width: 350, height: 250, alignSelf: "center" }}
      />
      <View style={{alignItems: 'center'}}>
          <Text
            style={{
              fontSize: 25,
              fontWeight: 'bold',
              marginTop: 30,
              color: 'black',
            }}>
            Select Your Turn Ons
          </Text>
          <View>
            {turnons?.map((item, index) => (
              <Pressable
                onPress={() => handleToggleTurnOn(item?.name)}
                style={{
                  backgroundColor: "#fff1db",
                  padding: 10,
                  marginVertical: 10,
                }}
                key={index}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      textAlign: "center",
                      fontSize: 15,
                      fontWeight: "bold",
                      flex: 1,
                    }}
                  >
                    {item?.name}
                  </Text>
                  {selectedTurnOns.includes(item?.name) && (
                    <AntDesign name="checkcircle" size={18} color="#17B169" />
                  )}
                </View>
                <Text
                  style={{
                    marginTop: 4,
                    fontSize: 15,
                    color: "gray",
                    textAlign: "center",
                  }}
                >
                  {item?.description}
                </Text>
              </Pressable>
            ))}
          </View>
          <Pressable
            onPress={() => router.replace("(tabs)/profile")}
          style={{
            marginTop: 35,
            marginBottom: 30,
            backgroundColor: "#ff9200",
            padding: 12,
            borderRadius: 4,
            width: 200,
          }}
        >
          <Text
            style={{ textAlign: "center", color: "white", fontWeight: "600" }}
          >
            Next
          </Text>
        </Pressable>
        </View>
       </View> 
    </ScrollView>
    
  )
}

export default type

const styles = StyleSheet.create({})