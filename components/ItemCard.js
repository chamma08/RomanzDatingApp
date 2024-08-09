import React, { useState } from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Pressable } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import * as Animatable from "react-native-animatable";
import axios from 'axios'; // Ensure axios is imported
import Profile from './Profile.js';

const ItemCard = ({ item,userId,setProfiles}) => {
  
  return (
    <View style={styles.card}>
      <ImageBackground source={{ uri: item.profilePicture }} style={styles.image}>
        <View style={styles.overlay}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.age}>
            AGE <Text style={styles.ageHighlight}>{item.age}</Text>
          </Text>
          <Text style={styles.description}>{item.description}</Text>
          <Profile item={item}  userId={userId} setProfiles={setProfiles} />
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    width: 352,
    height: "100%",
    borderRadius: 40,
    overflow: 'hidden',
    marginRight: 50,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
    resizeMode: 'cover',
  },
  overlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    padding: 15,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    width: '100%',
  },
  name: {
    fontSize: 40,
    fontWeight: 'bold',
    color: '#ffb400',
    textAlign: 'left',
  },
  age: {
    textAlign: 'left',
    color: 'white',
    fontSize: 36,
    fontWeight: '500',
  },
  ageHighlight: {
    fontSize: 36,
    color: '#ff00b8',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: 'white',
    textAlign: 'left',
    marginTop: 10,
  },
  iconButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default ItemCard;
