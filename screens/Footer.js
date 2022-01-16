import React from 'react'
import { FontAwesome5 } from '@expo/vector-icons/';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native'

//Display footer
const Footer = ()  => {
    const navigation = useNavigation();

    return (
        <View style={styles.footer}>
            {/* First Icon: HomeScreen */}
            <TouchableOpacity>
            <FontAwesome5 style={styles.icons} 
                name='home' 
                size={30} 
                color='#20b2aa'
                onPress={() => {
                navigation.navigate('HomeScreen')
                }}/>
            </TouchableOpacity>

             {/* Second Icon: Create Place Form */}
            <TouchableOpacity>
                <FontAwesome5 style={styles.icons} 
                name='clipboard-list' 
                size={30} 
                color='#20b2aa'
                onPress={() => {
                navigation.navigate('Place', {placeID: ""})
                }}/>
            </TouchableOpacity>

             {/* Third Icon: User Profile */}
            <TouchableOpacity>
                <FontAwesome5 style={styles.icons} 
                name='user'
                size={30} 
                color='#20b2aa'
                onPress={() => {
                navigation.navigate('Login')
                }}/>
            </TouchableOpacity>
      </View> 
    );
};

//Style
const styles = StyleSheet.create({
    footer: {
      width: '100%',
      //position: 'relative',
      bottom: 0,
      flexDirection:'row',
      justifyContent: 'space-evenly',
      backgroundColor: 'white',
    },
    icons:{
      marginBottom: '20%',
      marginTop: '20%',
      color: '#20b2aa',
    },
  });
  

export default Footer;