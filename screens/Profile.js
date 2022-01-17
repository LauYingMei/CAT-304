import { useNavigation } from '@react-navigation/core'
import React, {useState, useEffect, useContext} from 'react';
import { db, auth } from '../firebase';
import { deleteAccount } from '../actions/userAction';
import {  Alert, View, StyleSheet, SafeAreaView,Dimensions} from 'react-native';
import {
  Title,
  Caption,
  Text,
  TouchableRipple,
} from 'react-native-paper';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
const {width,height} = Dimensions.get('window')
//import editForm from './editForm';
//https://github.com/itzpradip/Food-Finder-React-Native-App/blob/master/screens/ProfileScreen.js

const Profile = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [ContactNo, setContact] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [getData, setUserData] = useState(false);
  const userID = auth.currentUser?.uid;
  
  const handleEditProfile = () => {
    navigation.replace("editProfile")
    }
    const handleResetPw = () => {
      navigation.replace("changePw")
      }
 useEffect(() =>{    
   setAll();
 
}, [getData]
)
const setAll = () => {
   var docRef = db.collection("users").doc(userID);
  console.log(auth.currentUser?.uid);
  docRef.get().then((doc) => {
      if (doc.exists) {
         console.log("Document data:", doc.data());
         setUser(doc.data());
         setUserData(true);
    
         if(user){
          setUserName(user.userName);
          setRole(user.role);
          setContact(user.ContactNo);
          setEmail(user.email);
         }
  
      } else {

          console.log("No such document!");
      }
  }).catch((error) => {
      console.log("Error getting document:", error);
  });
  }

// to delete the account
const deleteAcc = () => {
  Alert.alert("Delete", "Are You Sure?", [
      {
          text: "Yes",
          onPress: () => (
              deleteAccount(userID)
          )
      },
      { text: "No" },
  ]);
}
  return (
<SafeAreaView style={styles.container}>
 <View style={styles.userInfoSection}>
        <View style={{flexDirection: 'row', marginTop: 15}}>
         
          <View style={{marginLeft: 20}}>
            <Title style={[styles.title, {
              marginTop:height*.1,
              marginBottom: 10,
            }]}>{userName}</Title>
          </View>
        </View>
      </View>

      <View style={styles.userInfoSection}>
        <View style={styles.row}>
          <Icon name="account-box" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20, fontSize:20}}>{role}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="phone" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20, fontSize:20}}>{ContactNo}</Text>
        </View>
        <View style={styles.row}>
          <Icon name="email" color="#777777" size={20}/>
          <Text style={{color:"#777777", marginLeft: 20, fontSize:20}}>{email}</Text>
        </View>
      </View>

      <View style={styles.menuWrapper}>
      <TouchableRipple onPress={handleEditProfile}>
          <View style={styles.menuItem}>
            <Icon name="account-edit" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Edit Profile</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={handleResetPw}>
          <View style={styles.menuItem}>
            <Icon name="key-outline" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Reset Password</Text>
          </View>
        </TouchableRipple>
        
        <TouchableRipple onPress={() => {}}>
          <View style={styles.menuItem}>
            <Icon name="history" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Your Posts</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={deleteAcc}>
          <View style={styles.menuItem}>
            <Icon name="alert" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Delete account</Text>
          </View>
        </TouchableRipple>
       
        
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  userInfoSection: {
    paddingHorizontal: 30,
    marginBottom: 25,
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
  },
 
  row: {
    flexDirection: 'row',
    marginBottom: 10,
  },
 
  infoBox: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  menuWrapper: {
    marginTop: 10,
    borderBottomColor: '#dddddd',
    borderBottomWidth: 1,
    borderTopColor: '#dddddd',
    borderTopWidth: 1,
  },
  menuItem: {
    flexDirection: 'row',
    paddingVertical: 15,
    paddingHorizontal: 30,
   
  },
  menuItemText: {
    color: '#777777',
    marginLeft: 20,
    fontWeight: '600',
    fontSize: 20,
    lineHeight: 26,
  },
});