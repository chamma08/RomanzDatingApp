import { Dimensions, PanResponder, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useRef } from "react";
import Onboarding from "react-native-onboarding-swiper";
import LottieView from "lottie-react-native";
import { router, useNavigation } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { Redirect } from "expo-router";

const { width, height } = Dimensions.get("window");

const index = () => {
  const animation = useRef(null);
  const navigation = useNavigation();

  const handleDone = () => {
    router.replace("/(authenticate)/login");
  };

  const doneButton = () => (
    <Pressable onPress={handleDone} style={styles.doneButton}>
      <Ionicons name="chevron-forward-circle" size={hp("6%")} color="#ff0000" />
    </Pressable>
  );

  const skipButton = ({ ...props }) => (
    <Pressable {...props} style={styles.skipButton}>
      <Text style={styles.buttonText}>Skip</Text>
    </Pressable>
  );

  const nextButton = ({ ...props }) => (
    <Pressable {...props} style={styles.nextButton}>
      <Text style={styles.buttonText}>Next</Text>
    </Pressable>
  );

  const panResponder = PanResponder.create({
    onMoveShouldSetPanResponder: () => false,  // Disable swipe gestures
  });

  return (
    <View style={styles.container} {...panResponder.panHandlers}>
      <Onboarding
        onDone={handleDone}
        onSkip={handleDone}
        DoneButtonComponent={doneButton}
        SkipButtonComponent={skipButton}
        NextButtonComponent={nextButton}
        containerStyles={{ paddingHorizontal: 1 }}
        pages={[
          {
            backgroundColor: "#fff",
            image: (
              <View>
                <LottieView
                  autoPlay
                  ref={animation}
                  style={styles.lottieView1}
                  source={require("../assets/animations/an1.json")}
                />
              </View>
            ),
            title: (
              <View>
                <Text style={styles.titleText}>WELCOME TO</Text>
                <Text style={styles.subTitleText}>RomanzU</Text>
              </View>
            ),
            subtitle: "RomanzU - online video chat with random persons",
            subTitleStyles: styles.subTitleStyles,
          },
          {
            backgroundColor: "#c6efff",
            image: (
              <LottieView
                autoPlay
                ref={animation}
                style={styles.lottieView2}
                source={require("../assets/animations/an2.json")}
              />
            ),
            title: "Start the live video chat with your partners right now",
            subtitle: "",
            titleStyles: styles.pageTitle2,
          },
          {
            backgroundColor: "#e0bce2",
            image: (
              <View>
                <LottieView
                  autoPlay
                  ref={animation}
                  style={styles.lottieView3}
                  source={require("../assets/animations/an3.json")}
                />
              </View>
            ),
            title: "Thousands of beautiful strangers are waiting for you!",
            subtitle: "",
            titleStyles: styles.pageTitle3,
          },
        ]}
      />
    </View>
  );
};

export default index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    marginLeft: wp("5%"),
  },
  doneButton: {
    borderRadius: wp("10%"),
    marginLeft: "auto",
    marginRight: "auto",
    padding: wp("1.5%"),
  },
  skipButton: {
    marginLeft: wp("10%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("5%"),
    backgroundColor: "#ff9200",
    borderRadius: wp("8%"),
  },
  nextButton: {
    marginRight: wp("10%"),
    paddingVertical: hp("0.5%"),
    paddingHorizontal: wp("5%"),
    backgroundColor: "#ff9200",
    borderRadius: wp("8%"),
  },
  buttonText: {
    color: "#fff",
    fontSize: wp("4%"),
  },
  lottieView1: {
    width: wp("70%"),
    height: hp("40%"),
    backgroundColor: "#fff",
  },
  titleText: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "black",
    textAlign: "center",
  },
  subTitleText: {
    fontSize: wp("8%"),
    fontWeight: "bold",
    color: "#ff9200",
    textAlign: "center",
  },
  subTitleStyles: {
    fontSize: wp("4%"),
    color: "black",
    marginTop: hp("2%"),
    fontWeight: "500",
    marginBottom: hp("10%"),
    fontStyle: "italic",
    textAlign: "center",
  },
  lottieView2: {
    width: wp("80%"),
    height: hp("50%"),
    marginTop: hp("1%"),
    alignSelf: "center",
  },
  pageTitle2: {
    fontSize: wp("6%"),
    fontWeight: "500",
    textAlign: "center",
    marginTop: hp("1%"),
  },
  lottieView3: {
    width: wp("70%"),
    height: hp("45%"),
    marginTop: hp("5%"),
    alignSelf: "center",
  },
  pageTitle3: {
    fontSize: wp("6%"),
    fontWeight: "500",
    textAlign: "center",
    marginTop: hp("3%"),
    marginRight: wp("8%"),
  },
});
