import { useNavigation } from '@react-navigation/core'
import React, {useState, useEffect, useContext} from 'react';
import { db, auth } from '../firebase';
import { clearBookmark } from '../actions/userAction';
import {  Alert, View, StyleSheet,ScrollView, SafeAreaView,Dimensions,BackHandler} from 'react-native';
import {
  Title,
  Text,
  TouchableRipple,
} from 'react-native-paper';
import {deletePlace,removeTripList} from '../actions/placeAction'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as firebase from 'firebase'
const {width,height} = Dimensions.get('window')


const userProfile = () => {
  const navigation = useNavigation()
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [ContactNo, setContact] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [getData, setUserData] = useState(false);
  const userID = auth.currentUser?.uid;
  const [place, setPlace] = useState("");
  const [trip, setTrip] = useState([]);

  const handleEditProfile = () => {
    navigation.navigate("editProfile")
    }
    const handleResetPw = () => {
      navigation.navigate("changePw")
      }

 useEffect(() =>{    
   setAll();
 // control physical back button
 const backAction = () => {
  navigation.replace("HomeScreen")
  return true;
};

const backHandler = BackHandler.addEventListener(
  "hardwareBackPress",
  backAction
);

return () => backHandler.remove();
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
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }
  const deleteAccount=(userID) =>{    
    
    db.collection("users").doc(userID)
        .delete().then(() => {
            console.log("Doc successfully deleted!")
            
        }).catch((error) => {
            console.log("Error removing doc")
        })
        const user = firebase.auth().currentUser;

        user.delete().then(() => {
            Alert.alert("Account is deleted!");
            navigation.navigate("Login")
        }).catch((error) => {
            console.log("Error removing account")
        });
      
}
 
const delPlace=(userID) =>{
  db.collection('Place').where("userID", "==", userID)
  .get()
  .then((querySnapshot) => {
    const place = [];

    querySnapshot.forEach((doc) => {
      place.push({
        ...doc.data(),
        id: doc.id,
      });
      deletePlace(doc.id)
    });
    
    setPlace(place);
    setDel(true);
    console.log("Get places sucessfully.",place);
  })
  
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
    
}
const delTrip =(userID) => {
  
  db.collection("users").doc(userID).collection("TripLists")
  .get()
  .then((querySnapshot) => {
    const trip = [];

    querySnapshot.forEach((doc) => {
      trip.push({
        ...doc.data(),
        id: doc.id,
      });
      removeTripList(doc.id)
    });
   
    console.log("Get places sucessfully.",place);
  })
    .catch((error) => {
      console.log("Error getting documents: ", error);
    });
  
}
// to delete the account
const deleteAcc = async() => {
 
  Alert.alert("Delete", "Are You Sure? **Clear data before delete", [
      
      {
        text: "Clear all data",
        onPress: async() => (
          
           delPlace(userID),
           delTrip(userID),
           clearBookmark(userID)
           
        )
    },
    {
          text: "Yes",
          onPress: async() => (
            deleteAccount(userID)
            
          )
      },
      { text: "No" },
  ]);
  
}
const handleBookmark = () => {
 
      navigation.replace("userBookmark")
  
}
const handleTrip = () => {
 
  navigation.replace("TravelHome")

}
  return (
<SafeAreaView style={styles.container}>
<ScrollView vertical showsVerticalScrollIndicator={true} marginLeft="3%" marginBottom="3%">
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
        
        <TouchableRipple onPress={handleBookmark}>
          <View style={styles.menuItem}>
            <Icon name="bookmark-multiple" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Your Bookmarks</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={handleTrip}>
          <View style={styles.menuItem}>
            <Icon name="sign-direction" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Your Trip Plans</Text>
          </View>
        </TouchableRipple>

        <TouchableRipple onPress={deleteAcc}>
          <View style={styles.menuItem}>
            <Icon name="alert" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Delete account</Text>
          </View>
        </TouchableRipple>
        <TouchableRipple onPress={handleSignOut}>
          <View style={styles.menuItem}>
            <Icon name="logout" color="#FF6347" size={25}/>
            <Text style={styles.menuItemText}>Sign out</Text>
          </View>
        </TouchableRipple>
        
      </View>
</ScrollView>
 
    </SafeAreaView>
  );
};

export default userProfile;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height,
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
    borderBottomWidth: 5,
    borderTopColor: '#dddddd',
    borderTopWidth: 5,
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