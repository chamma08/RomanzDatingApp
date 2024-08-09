import { StyleSheet, Text, View, FlatList } from 'react-native'
import React from 'react'
import Carousel, {ParallaxImage} from 'react-native-snap-carousel'
import "core-js/stable/atob";
import { sliderImages } from '../constants';
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';

const Slider = () => {
    const ItemCard = ({ item, index }, parallaxProps) => {
        return(
            <View style={{width: wp(100) - 70, height: hp(30)}}>
                <ParallaxImage
                    source={item}
                    containerStyle={{flex: 1, borderRadius: 30}}
                    style={{resizeMode: 'contain'}}
                    parallaxFactor={0.9}
                    {...parallaxProps}
                />
            </View>
        )
    }
  return (
    <Carousel
      data={sliderImages}
      loop={true}
      autoplay={true}
      renderItem={ItemCard}
      hasParallaxImages={true}
      sliderWidth={wp(100)}
      firstItem={1}
      autoplayInterval={5000}
      itemWidth={wp(100) - 70}
      slideStyle={{ display: "flex", alignItems: "center" }}
    />
  )
}

export default Slider

const styles = StyleSheet.create({})