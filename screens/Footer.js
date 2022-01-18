import React, { useEffect, useState } from 'react'
import { FontAwesome5, MaterialIcons } from '@expo/vector-icons/';
import { StyleSheet, View, TouchableOpacity} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../firebase';

//Display footer
const Footer = ()  => {
  const userID = auth.currentUser?.uid;
  const navigation = useNavigation();
  const [owner, setOwner] = useState(false);
  const [user, setUser] = useState();

  const getRole = () => {
    var document = db.collection("users").doc(userID)
    document.get().then((doc) => {
      if (doc.exists){
        if(doc.data().role == "owner"){
          setOwner(true)
        }
      }
      else{
        console.log("No such user!")
      }   
    })
  }

  const accessControl = () => {
    var docRef = db.collection("users").doc(auth.currentUser?.uid);
    docRef.get().then((doc) => {
    if (doc.exists) {
        console.log("User:", doc.data());
        setUser(doc.data());
        if(doc.data().role=="owner"){
        navigation.navigate('Profile')
        }
        if(doc.data().role=="user"){
        navigation.navigate('userProfile')
        } 
    } 
    else {
        console.log("No such document!");
    }
    }).catch((error) => {
        console.log("Error getting document:", error);
    });
  }
    
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

            {/* Second Icon: If owner, Create Place Form. Else, trip-planning form */}
            {getRole()}
            {owner?  
              <TouchableOpacity>
                <MaterialIcons style={styles.icons} 
                name='note-add' 
                size={31} 
                color='#20b2aa'
                onPress={() => {navigation.navigate('Place', {placeID: ""})}}
                />
              </TouchableOpacity>
              :
              <TouchableOpacity>
                <FontAwesome5 style={styles.icons} 
                name='clipboard-list' 
                size={30} 
                color='#20b2aa'
                //onPress={() => {navigation.navigate('Place', {placeID: ""})}}
                />
              </TouchableOpacity>
            }

             {/* Third Icon: User Profile */}
            <TouchableOpacity>
                <FontAwesome5 style={styles.icons} 
                name='user'
                size={30} 
                color='#20b2aa'
                onPress={() => {
                accessControl()
                }}/>
            </TouchableOpacity>
      </View> 
    );
};

//Style
const styles = StyleSheet.create({
  footer: {
    width: '100%',
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