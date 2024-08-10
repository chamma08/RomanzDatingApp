import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  TextInput,
  Button,
  FlatList,
  Alert,
  SafeAreaView,
} from "react-native";
import React, { useState, useEffect, useRef, useMemo } from "react";
import { Entypo, AntDesign } from "@expo/vector-icons";
import axios from "axios";
import "core-js/stable/atob";
import { jwtDecode } from "jwt-decode";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import Slider from "../../../components/Slider";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet from "@gorhom/bottom-sheet";
import LottieView from "lottie-react-native";

const index = () => {
  const [option, setOption] = useState("AD");
  const [description, setDescription] = useState("");
  const [userId, setUserId] = useState("");
  const [selectedTurnOns, setSelectedTurnOns] = useState([]);
  const [lookingOptions, setLookingOptions] = useState([]);
  const [imageUrl, setImageUrl] = useState("");
  const [images, setImages] = useState([]);
  const [profileImage, setProfileImage] = useState("");
  const [name, setName] = useState("");
  const [gender, setGender] = useState("");

  const bottomSheetRef = useRef(null);
  const snapPoints = useMemo(() => ["15%", "50%", "90%"], []);

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
  const data = [
    {
      id: "0",
      name: "Casual",
      description: "Let's keep it easy and see where it goes",
    },
    {
      id: "1",
      name: "Long Term",
      description: "How about a one life stand",
    },
    {
      id: "2",
      name: "Virtual",
      description: "Let's have some virtual fun",
    },
    {
      id: "3",
      name: "Open for Anything",
      description: "Let's Vibe and see where it goes",
    },
  ];
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
      setName(user?.user?.name);
      setProfileImage(user?.user?.profilePicture);
      setDescription(user?.user?.description);
      setSelectedTurnOns(user.user?.turnOns);
      setLookingOptions(user?.user.lookingFor);
      setGender(user?.user?.gender);
    } catch (error) {
      console.log("Error fetching user description", error);
    }
  };
  useEffect(() => {
    if (userId) {
      fetchUserDescription();
    }
  }, [userId]);
  const updateUserDescription = async () => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/description`,
        {
          description: description,
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Description updated successfully");
      }
    } catch (error) {
      console.log("Error updating the user Description");
    }
  };
  const handleToggleTurnOn = (turnOn) => {
    if (selectedTurnOns.includes(turnOn)) {
      removeTurnOn(turnOn);
    } else {
      addTurnOn(turnOn);
    }
  };
  const handleOption = (lookingFor) => {
    if (lookingOptions.includes(lookingFor)) {
      removeLookingFor(lookingFor);
    } else {
      addLookingFor(lookingFor);
    }
  };
  const addLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/looking-for`,
        {
          lookingFor: lookingFor,
        }
      );

      console.log(response.data);

      if (response.status == 200) {
        setLookingOptions([...lookingOptions, lookingFor]);
      }
    } catch (error) {
      console.log("Error addding looking for", error);
    }
  };
  const removeLookingFor = async (lookingFor) => {
    try {
      const response = await axios.put(
        `https://romanz-dating-app.vercel.app/users/${userId}/looking-for/remove`,
        {
          lookingFor: lookingFor,
        }
      );

      console.log(response.data); // Log the response for confirmation

      // Handle success or update your app state accordingly
      if (response.status === 200) {
        setLookingOptions(lookingOptions.filter((item) => item !== lookingFor));
      }
    } catch (error) {
      console.error("Error removing looking for:", error);
      // Handle error scenarios
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
  /*  const renderImageCarousel = ({ item }) => (
    <View
      style={{ width: "100%", justifyContent: "center", alignItems: "center" }}
    >
      <Image
        style={{
          width: "85%",
          resizeMode: "cover",
          height: 290,
          borderRadius: 10,
          transform: [{ rotate: "-5deg" }],
        }}
        source={{ uri: item }}
      />
      <Text
        style={{ position: "absolute", top: 10, right: 10, color: "black" }}
      >
        {activeSlide + 1}/{images.length}
      </Text>
    </View>
  ); */
  /* const handleAddImage = async () =>{
      try{
        const response = await axios.post(`http://192.168.8.189:3000/users/${userId}/profile-images`,{
            imageUrl:imageUrl
        });

        console.log(response);
        if (response.status === 200) {
          Alert.alert("Success", "Image uploaded successfully. Please refresh the page to see the changes");
        }
        setImageUrl("");
      } catch(error){
          console.log("error",error)
      }
  }
  const getRandomImage = () => {
      const randomIndex = Math.floor(Math.random() * images.length);
      return images[randomIndex]
  }
  const randomImage = getRandomImage(); */

  const goEdit = () => {
    router.replace("/(tabs)/settings/editProfile");
  };

  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaView
        className="flex-1 flex space-y-5"
        edges={["top"]}
        style={{
          backgroundColor: "#fafff2",
        }}
      >
        <View className="flex-row justify-between items-center mx-5 mb-5">
          <View className="space-y-2">
            <Text className="text-2xl font-semibold text-slate-900 ">
              RomanzU
            </Text>
          </View>
          <View>
            <View>
              <Pressable
                onPress={goEdit}
                style={{
                  padding: 8,
                  marginTop: 10,
                }}
              >
                <Image
                  style={{
                    width: 45,
                    height: 45,
                    borderRadius: 30,
                    resizeMode: "cover",
                  }}
                  source={{
                    uri:
                      profileImage ||
                      "https://media.istockphoto.com/id/1451587807/vector/user-profile-icon-vector-avatar-or-person-icon-profile-picture-portrait-symbol-vector.jpg?s=612x612&w=0&k=20&c=yDJ4ITX1cHMh25Lt1vI1zBn2cAKKAlByHBvPJ8gEiIg=",
                  }}
                />
              </Pressable>
            </View>
          </View>
        </View>

        <View style={{ marginBottom: 20 }}>
          <Slider />
        </View>

        <View
          style={{
            padding: 10,
          }}
        >
          <Text
            style={{
              textAlign: "center",
              color: "#fba000",
              fontSize: 25,
              fontWeight: "bold",
            }}
          >
            Discover Love{" "}
            <Text
              style={{
                fontSize: 26,
                color: "#ff0063",
                fontWeight: "bold",
              }}
            >
              Craft your Romance
            </Text>
          </Text>

          <LottieView
            source={require("../../../assets/animations/love.json")}
            style={{
              height: 180,
              width: 350,
              alignSelf: "center",
              justifyContent: "center",
            }}
            autoPlay
            loop={true}
            speed={0.7}
          />
        </View>

        <BottomSheet
          ref={bottomSheetRef}
          index={1}
          snapPoints={snapPoints}
          enablePanDownToClose={false}
          style={{
            shadowOpacity: 0.5,
            shadowRadius: 10,
            elevation: 20,
          }}
          backgroundStyle={{
            backgroundColor: "white",
            borderTopLeftRadius: 40,
            borderTopRightRadius: 40,
          }}
        >
          <ScrollView style={{}}>
            <View
              style={{
                marginTop: 10,
                marginHorizontal: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 25,
                justifyContent: "center",
              }}
            >
              <Pressable onPress={() => setOption("AD")}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: option == "AD" ? "black" : "gray",
                    backgroundColor: option == "AD" ? "#e9e9e9" : "white",
                    padding: 10,
                    borderRadius: 20,
                  }}
                >
                  Description
                </Text>
              </Pressable>
              <Pressable onPress={() => setOption("Turn-ons")}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: option == "Turn-ons" ? "black" : "gray",
                    backgroundColor: option == "Turn-ons" ? "#e9e9e9" : "white",
                    padding: 10,
                    borderRadius: 20,
                  }}
                >
                  Turn-ons
                </Text>
              </Pressable>
              <Pressable onPress={() => setOption("Looking For")}>
                <Text
                  style={{
                    fontSize: 16,
                    fontWeight: "500",
                    color: option == "Looking For" ? "black" : "gray",
                    backgroundColor:
                      option == "Looking For" ? "#e9e9e9" : "white",
                    padding: 10,
                    borderRadius: 20,
                  }}
                >
                  Looking For
                </Text>
              </Pressable>
            </View>
            <View style={{ marginHorizontal: 14, marginVertical: 15 }}>
              {option == "AD" && (
                <View
                  style={{
                    borderColor: "#db2b64",
                    borderWidth: 2,
                    padding: 10,
                    borderRadius: 10,
                    height: 250,
                  }}
                >
                  <TextInput
                    value={description}
                    multiline
                    onChangeText={(text) => setDescription(text)}
                    style={{
                      fontSize: description ? 17 : 17,
                    }}
                    placeholder="Write Your Romantic Bio here"
                    //   placeholderTextColor={"black"}
                  />
                  <Pressable
                    onPress={updateUserDescription}
                    style={{
                      marginTop: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      backgroundColor: "#ff9200",
                      borderRadius: 5,
                      justifyContent: "center",
                      padding: 10,
                    }}
                  >
                    <Text
                      style={{
                        color: "white",
                        textAlign: "center",
                        fontSize: 15,
                        fontWeight: "500",
                      }}
                    >
                      Publish in feed
                    </Text>
                    <Entypo name="check" size={24} color="white" />
                  </Pressable>
                </View>
              )}
            </View>

            <View style={{ marginHorizontal: 14 }}>
              {option == "Turn-ons" && (
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
                          <AntDesign
                            name="checkcircle"
                            size={18}
                            color="#17B169"
                          />
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
              )}
            </View>

            <View style={{ marginHorizontal: 14 }}>
              {option == "Looking For" && (
                <>
                  <View>
                    <FlatList
                      columnWrapperStyle={{ justifyContent: "space-between" }}
                      numColumns={2}
                      data={data}
                      renderItem={({ item }) => (
                        <Pressable
                          onPress={() => handleOption(item?.name)}
                          style={{
                            backgroundColor: lookingOptions.includes(item?.name)
                              ? "#ff8100"
                              : "white",
                            padding: 16,
                            justifyContent: "center",
                            alignItems: "center",
                            width: 150,
                            margin: 10,
                            borderRadius: 5,
                            borderColor: "#ff8100",
                            borderWidth: 2,
                          }}
                        >
                          <Text
                            style={{
                              textAlign: "center",
                              fontWeight: "500",
                              fontSize: 13,
                              color: lookingOptions.includes(item?.name)
                                ? "white"
                                : "black",
                            }}
                          >
                            {item?.name}
                          </Text>
                          <Text
                            style={{
                              color: lookingOptions.includes(item?.name)
                                ? "white"
                                : "gray",
                              textAlign: "center",
                              width: 140,
                              marginTop: 10,
                              fontSize: 13,
                            }}
                          >
                            {item?.description}
                          </Text>
                        </Pressable>
                      )}
                    />
                  </View>
                </>
              )}
            </View>
          </ScrollView>
        </BottomSheet>
      </SafeAreaView>
    </GestureHandlerRootView>
  );
};

export default index;

const styles = StyleSheet.create({});
