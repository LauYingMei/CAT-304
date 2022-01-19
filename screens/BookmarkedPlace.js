import React from 'react';
import Icons from 'react-native-vector-icons/AntDesign';
import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { useNavigation } from '@react-navigation/native'

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const BookmarkedPlace = ({ item, selected, onPress}) => {
    const navigation = useNavigation()
    return (
    <TouchableOpacity
        style = {styles.container}
        onPress = {onPress} 
    >
        <View
            style = {{ alignItems: 'center', marginBottom:0, marginTop:0, width: WIDTH / 2 - 10, margin:0}} 
        >
            {/* Place Image*/}
            <ImageBackground
                source = {item.isEvent?require('../assets/image/events.jpg'):{uri: item.image[0].uri}}
                resizeMode = "cover"
                style = {styles.bgImage}
            />

            {/* Place Info Icon */}
            <TouchableOpacity 
                style = {styles.placeInfoIcon}
                /* link to place info page */
                onPress = {() => navigation.navigate('PlaceDisplay', { placeID: item.id })}
            >
                <View style = {{opacity:0.5}}>
                    <Icons name = "infocirlce" size = {WIDTH*0.07} color = 'white' />
                </View>
            </TouchableOpacity>

            {/* Place Name*/}
            <View style = {styles.placeName}>
                <View style={{width:WIDTH/2-40}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style = {{fontSize:18}}>{item.spotName}</Text>
                </View>
            </View>

        </View>

            {selected &&  <View style = {styles.overlay}/>}

    </TouchableOpacity>

  );
};

const styles = StyleSheet.create({
    container: {
        borderRadius: 10,
        margin:5,
        overflow: "hidden"
    },
    bgImage: {
        width: "100%",
        height: HEIGHT/5,
        borderRadius: 10
    },
    placeInfoIcon: {
        position:'absolute', 
        zIndex:1, 
        right:5, 
        top:5
    },
    placeName: {
        position: 'absolute',
        bottom: 0,
        height: 50,
        width: "100%",
        backgroundColor: 'white',
        alignItems: 'center',
        justifyContent: 'center',
        opacity: 0.9,
    },
    overlay: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        backgroundColor: 'rgba(0,0,0,0.4)',
        top:0,
        left:0
  }
});

export default BookmarkedPlace;