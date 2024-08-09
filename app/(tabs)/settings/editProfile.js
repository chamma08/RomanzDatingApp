import {
  Alert,
  Image,
  ImageBackground,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import axios, { Axios } from "axios";
import { jwtDecode } from "jwt-decode";
import "core-js/stable/atob";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { Entypo } from "@expo/vector-icons";
import * as FileSystem from 'expo-file-system';
import { storage, ref, uploadBytes, getDownloadURL } from '../../../firebase';


const editProfile = () => {
  const [image, setImage] = useState(null);
  const [selectedImage, setSelectedImage] = useState();
  const [originalImage, setOriginalImage] = useState("");
  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [isNameChanged, setIsNameChanged] = useState(false);
  const [isImageChanged, setIsImageChanged] = useState(false);
  const [isEmailChanged, setIsEmailChanged] = useState(false);
  const [originalName, setOriginalName] = useState("");
  const [originalEmail, setOriginalEmail] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const token = await AsyncStorage.getItem("auth");
      const decodedToken = jwtDecode(token);
      const userId = decodedToken.userId;
      setUserId(userId);
      fetchUserProfile(userId);
    };

    const fetchUserProfile = async (userId) => {
      try {
        const response = await axios.get(
          `http://192.168.8.189:3000/users/${userId}`
        );
        const user = response.data;
        setImage(user?.user.profilePicture);
        setOriginalImage(user?.user.profilePicture);
        setName(user?.user?.name);
        setEmail(user?.user?.email);
        setGender(user?.user?.gender);
        setOriginalName(user?.user?.name);
        setOriginalEmail(user?.user?.email);
        setAge(user?.user?.age);
      } catch (error) {
        console.error("Error fetching user profile:", error);
      }
    };

    fetchUser();
  }, []);

  const updateProfileImage = async () => {
    try {
      // Check if image is selected
      if (!image) {
        alert("No image selected");
        return;
      }
  
      // Create a FormData object
      const formData = new FormData();
      formData.append('profilePicture', {
        uri: image,
        type: 'image/jpeg', // Adjust this according to the actual file type
        name: `${userId}.jpg`, // Adjust this according to the actual file name
      });
  
      // Upload the file to Firebase
      const imageRef = ref(storage, `profilePictures/${userId}.jpg`);
      const response = await fetch(image);
      const blob = await response.blob();
      
      await uploadBytes(imageRef, blob);
      const downloadURL = await getDownloadURL(imageRef);
  
      // Send the URL to your server
      const serverResponse = await axios.put(
        `http://192.168.8.189:3000/users/${userId}/profile-images`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
  
      if (serverResponse.status === 200) {
        setSelectedImage(downloadURL);
        alert("Profile Image updated successfully");
        setIsImageChanged(false);
        setOriginalImage(downloadURL);
      } else {
        alert("Failed to update profile image.");
      }
    } catch (error) {
      console.error("Error updating profile image:", error);
      alert("An error occurred while updating the Profile Image.");
    }
  };
  
  
  

  const handleImageSelection = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert(
        "Permission Denied",
        "You need to enable permission to access the library!"
      );
      return;
    }
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.5, // Reduce quality to compress image
    });
  
    if (!result.canceled && result.assets && result.assets.length > 0) {
      const fileUri = result.assets[0].uri;
      setImage(fileUri);
      setIsImageChanged(true);
    } else {
      console.log("Image selection was cancelled or URI is not available");
    }
  };
  
  

  const updateName = async () => {
    try {
      const response = await axios.put(
        `http://192.168.8.189:3000/users/${userId}/name`,
        {
          name: name,
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Name updated successfully");
        setIsNameChanged(false);
        setOriginalName(name);
      }
    } catch (error) {
      console.log("Error updating the user Name:", error);
      Alert.alert("Error", "An error occurred while updating the Name");
    }
  };

  const updateEmail = async () => {
    try {
      const response = await axios.put(
        `http://192.168.8.189:3000/users/${userId}/email`,
        {
          email: email,
        }
      );

      console.log(response.data);

      if (response.status === 200) {
        Alert.alert("Success", "Email updated successfully");
        setIsEmailChanged(false);
        setOriginalEmail(email);
      }
    } catch (error) {
      console.log("Error updating the User Email:", error);
      Alert.alert("Error", "An error occurred while updating the Email");
    }
  };

  const cancelNameChange = () => {
    setName(originalName);
    setIsNameChanged(false);
    Alert.alert("Cancelled", "Name change has been cancelled");
  };

  const cancelImageChange = () => {
    setImage(originalImage);
    setIsImageChanged(false);
    Alert.alert("Cancelled", "Profile image change has been cancelled");
  };

  const cancelEmailChange = () => {
    setEmail(originalEmail);
    setIsEmailChanged(false);
    Alert.alert("Cancelled", "Email change has been cancelled");
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "#f4f4f4",
        paddingHorizontal: 22,
      }}
    >
      <View style={{}}>
        <ImageBackground
          source={require("../../../assets/topVector.png")}
          style={{
            width: "111%",
            height: 170,
            alignSelf: "center",
            zIndex: -5,
          }}
        >
          <View
            style={{
              justifyContent: "center",
              marginHorizontal: 12,
              flexDirection: "row",
              marginTop: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => router.replace("settings")}
              style={{
                position: "absolute",
                left: 0,
              }}
            >
              <MaterialIcons
                name="keyboard-arrow-left"
                size={50}
                color="black"
              />
            </TouchableOpacity>
            <Text
              style={{
                fontSize: 35,
                fontWeight: "700",
                color: "black",
                textAlign: "center",
              }}
            >
              Edit Profile
            </Text>
          </View>
        </ImageBackground>

        <ScrollView>
          <View
            style={{
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={handleImageSelection}>
              <Image
                source={{ uri: selectedImage || image , cache: 'reload'  }}
                
                style={{
                  width: 200,
                  height: 200,
                  borderRadius: 105,
                  borderWidth: 4,
                  borderColor: "#a3a3a3",
                }}
              />
              
              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 11,
                  zIndex: 9999,
                }}
              >
                <MaterialIcons name="photo-camera" size={32} color="black" />
              </View>
            </TouchableOpacity>
            {isImageChanged && (
              <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
                <TouchableOpacity
                  onPress={updateProfileImage}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                    width: 100,
                    backgroundColor: "#1adf13",
                    borderRadius: 25,
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "black" }}>Save</Text>
                  <Entypo name="check" size={20} color="black" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={cancelImageChange}
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 15,
                    width: 100,
                    backgroundColor: "#ff4d4d",
                    borderRadius: 25,
                    justifyContent: "center",
                    padding: 5,
                  }}
                >
                  <Text style={{ color: "black" }}>Cancel</Text>
                  <Entypo name="cross" size={20} color="black" />
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View>
            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Name</Text>

              <View
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  marginVertical: 6,
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={name}
                  onChangeText={(text) => {
                    setName(text);
                    setIsNameChanged(true); // Set isNameChanged to true when the name is changed
                  }}
                  style={{ fontSize: 18 }}
                />
              </View>
              {isNameChanged && (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={updateName}
                    style={{
                      marginTop: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      width: 100,
                      backgroundColor: "#1adf13",
                      borderRadius: 25,
                      justifyContent: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>Save</Text>
                    <Entypo name="check" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelNameChange}
                    style={{
                      marginTop: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      width: 100,
                      backgroundColor: "#ff4d4d",
                      borderRadius: 25,
                      justifyContent: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>Cancel</Text>
                    <Entypo name="cross" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View>
            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Email</Text>
              <View
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  marginVertical: 6,
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={email}
                  onChangeText={(text) => {
                    setEmail(text);
                    setIsEmailChanged(true);
                  }}
                  style={{ fontSize: 18 }}
                />
              </View>
              {isEmailChanged && (
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <TouchableOpacity
                    onPress={updateEmail}
                    style={{
                      marginTop: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      width: 100,
                      backgroundColor: "#1adf13",
                      borderRadius: 25,
                      justifyContent: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>Save</Text>
                    <Entypo name="check" size={20} color="black" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={cancelEmailChange}
                    style={{
                      marginTop: "auto",
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 15,
                      width: 100,
                      backgroundColor: "#ff4d4d",
                      borderRadius: 25,
                      justifyContent: "center",
                      padding: 5,
                    }}
                  >
                    <Text style={{ color: "black" }}>Cancel</Text>
                    <Entypo name="cross" size={20} color="black" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          </View>
          <View>
            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Age</Text>
              <View
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  marginVertical: 6,
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={age}
                  editable={false}
                  style={{ fontSize: 18, color: "gray" }}
                />
              </View>
            </View>
          </View>
          <View>
            <View style={{ flexDirection: "column", marginBottom: 6 }}>
              <Text style={{ fontSize: 20, fontWeight: "500" }}>Gender</Text>
              <View
                style={{
                  height: 50,
                  width: "100%",
                  backgroundColor: "white",
                  borderRadius: 10,
                  justifyContent: "center",
                  borderWidth: 1,
                  borderColor: "gray",
                  marginVertical: 6,
                  paddingLeft: 8,
                }}
              >
                <TextInput
                  value={gender}
                  editable={false}
                  style={{ fontSize: 18, color: "gray" }}
                />
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default editProfile;

const styles = StyleSheet.create({});
