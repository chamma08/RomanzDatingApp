import { SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";

const index = ({ navigation }) => {
  const navigateToEditProfile = () => {
    router.replace("/(tabs)/settings/editProfile");
  };

  const navigateToSecurity = () => {
    navigation.navigate("Security");
  };

  const navigateToNotificati = () => {
    navigation.navigate("Notifications");
  };

  const navigateToPrivacy = () => {
    navigation.navigate("Privacy");
  };

  const navigateToSubscription = () => {
    console.log("Subscription");
  }

  const navigateToSupport = () => {
    console.log("Support");
  }

  const navigateToTermsAndPolicies = () => {
    console.log("Terms and Policies");
  }

  const navigateToFreeSpace = () => {
    console.log("Free up space");
  }

  const navigateToDateSaver = () => {
    console.log("Date Saver");
  }

  const navigateToReportProblem = () => {
    console.log("Report a problem");
  } 

  const addAccount = () => {
    console.log("Add Account");
  }

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("auth");
      router.replace("/login");
    } catch (error) {
      console.error("Error clearing auth token:", error);
    }
  };

  const accountItems = [
    {
      icon: "person-outline",
      text: "Edit Profile",
      action: navigateToEditProfile,
    },
    { icon: "security", text: "Security", action: navigateToSecurity },
    {
      icon: "notifications-none",
      text: "Notifications",
      action: navigateToNotificati,
    },
    { icon: "lock-outline", text: "Privacy", action: navigateToPrivacy },
  ];

  const supportItems = [
    {icon: "credit-card", text: "My Subscription", action: navigateToSubscription},
    {icon: "help-outline", text: "Help & Support", action: navigateToSupport },
    {icon: "info-outline", text: "Terms and Policies", action: navigateToTermsAndPolicies },
    ];

    const cacheAndCellularItems = [
      {icon: "delete-outline", text: "Free up space", action: navigateToFreeSpace }, 
      {icon: "save-alt", text: "Date Saver", action: navigateToDateSaver }
      ];

      const actionsItems = [
      {icon: "outlined-flag", text: "Report a problem", action: navigateToReportProblem}, 
      /* {icon: "people-outline", text: "Add Account", action: addAccount}, */
       {icon: "logout", text: "Log out", action: logout} 
      ];

  const renderAccountItems = ({ icon, text, action }) => {
    return (
      <TouchableOpacity
        onPress={action}
        style={{
          flexDirection: "row",
          paddingLeft: 12,
          alignItems: "center",
          paddingVertical: 12,
        }}
      >
        <MaterialIcons name={icon} size={24} color="black" />
        <Text style={{ fontSize: 18, marginLeft: 32 }}>{text}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: "white",
      }}
    >
      <View
        style={{
          justifyContent: "center",
          marginHorizontal: 12,
          flexDirection: "row",
          marginTop: 10,
        }}
      >
        <TouchableOpacity
          style={{
            position: "absolute",
            left: 0,
          }}
        >
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 25,
            fontWeight: "bold",
            color: "black",
          }}
        >
          Settings
        </Text>
      </View>

      <ScrollView style={{ marginHorizontal: 12 }}>
        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}
          >
            Account
          </Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: "#f4f4f4",
            }}
          >
            {accountItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderAccountItems(item)}
              </React.Fragment>
            ))}
          </View>
        </View>


        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}
          >
            Support & Help
          </Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: "#f4f4f4",
            }}
          >
            {supportItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderAccountItems(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}
          >
            Cache & Cellular Data
          </Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: "#f4f4f4",
            }}
          >
            {cacheAndCellularItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderAccountItems(item)}
              </React.Fragment>
            ))}
          </View>
        </View>

        <View style={{ marginBottom: 12 }}>
          <Text
            style={{ fontSize: 18, fontWeight: "bold", marginVertical: 10 }}
          >
            Actions
          </Text>
          <View
            style={{
              borderRadius: 12,
              backgroundColor: "#f4f4f4",
            }}
          >
            {actionsItems.map((item, index) => (
              <React.Fragment key={index}>
                {renderAccountItems(item)}
              </React.Fragment>
            ))}
          </View>
        </View>


      </ScrollView>
    </SafeAreaView>
  );
};

export default index;

const styles = StyleSheet.create({});
