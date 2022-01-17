import { useNavigation} from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import {Picker,KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,ScrollView,Button,Dimensions} from 'react-native'
import { auth,db} from '../firebase'
import { updateUser } from '../actions/userAction'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'

const {width,height} = Dimensions.get('window')

const editProfile = () => {
  const navigation = useNavigation();
  const [user, setUser] = useState();
  const [userName, setUserName] = useState("");
  const [ContactNo, setContact] = useState("");
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [getData, setUserData] = useState(false);
  const userID = auth.currentUser?.uid;
 
 

  useEffect(async () => {
       
    await setAll();
  
 }, [getData]
 )
 

  const setAll =async () => {
    var docRef = db.collection("users").doc(userID);
   console.log(auth.currentUser?.uid);
   await docRef.get().then((doc) => {
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
           // doc.data() will be undefined in this case
           console.log("No such document!");
       }
   }).catch((error) => {
       console.log("Error getting document:", error);
   });
   }
  const goBack = () => {
   
        navigation.replace("Profile")
      
  }
  const data = {
    userName: userName,
    role: role,
    ContactNo: ContactNo,
    email: email,
  }

  
  
  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      >
     <ScrollView style={styles.innerContainer}>
     <View style={styles.content}>
     <Text style={styles.title}>
     Edit Your Profile Here  
      </Text>
     </View>
    

     <View style= {styles.registerForm}>
     <Icon name="email" color="#13553b" size={25} style={styles.icon}/>
      <TextInput 
          placeholder="Email"
          value={email}
          onChangeText={text =>setEmail(text)}
          style={styles.input}
          editable={false}

        />
      </View>
      <View style= {styles.registerForm}>
     <Icon name="account-details" color="#13553b" size={25} style={styles.icon}/>
      <TextInput
          placeholder="User Name"
          value={userName}
          onChangeText={text =>setUserName(text)}
          style={styles.input}
          maxLength={15} 
          />
         </View> 
         <View style= {styles.registerForm}>
        <Icon name="phone" color="#13553b" size={25} style={styles.icon}/> 
         <TextInput
          placeholder="Contact Number"
          value={ContactNo}
          onChangeText={text =>setContact(text)}
          style={styles.input}
          keyboardType="phone-pad"
         />
        </View> 
        
        <View style={styles.infoBoxWrapper}>
        <View style={[styles.infoBox, {
            borderRightColor: '#dddddd',
            borderRightWidth: 1
          }]}>
           <Icon name="account-box" color="#13553b" size={25} style={styles.iconRole}/> 
        </View>
        <View style={styles.info}>
        <Picker 
               prompt= "Choose a role"
               selectedValue = {role} 
               onValueChange = {(selectedRole) =>  setRole(selectedRole)}>
               <Picker.Item label = "-select-" value = "" />
               <Picker.Item label = "user" value = "user" />
               <Picker.Item label = "owner" value = "owner" />
            </Picker>
        </View>
        
      </View>
              

      <View style={styles.inputLayout}>

      <Button   
      onPress={()=>updateUser(data,userID)} 
      title="SUBMIT"
      color='#38761D'
      />

</View>
 <View style={styles.content}>
      
      <TouchableOpacity
        onPress={goBack}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back to Profile Screen</Text>
      </TouchableOpacity>
    </View>
     </ScrollView>
     </KeyboardAvoidingView>
    );
  }




export default editProfile

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 50,
    alignItems: 'center',
    backgroundColor:'#d4ffb8',
  },
  innerContainer:{
    width: width * 0.9,
    height: '90%',
    padding: 25,
    paddingTop: 0,
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 20
  },
        registerForm: {
          borderBottomWidth: .5, 
          flexDirection:"row",
          
        },
        input: {
          flex:1,
          width: width*0.8,
          height: height*0.05,
          color:"#fff",
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 5,

        },
        title: {
         
          color:"#10523a",
          fontWeight: "bold",
          marginVertical: 4,
          fontSize: 21,
      },
   
        icon:{paddingTop: 30,},
        iconRole:{paddingTop: 15,},
        inputLayout: {paddingTop: 30,},
          input: {
            height: 48,
            width: '80%',
            padding: 8,
            margin: 16,
            borderColor: 'gray',
            borderWidth: StyleSheet.hairlineWidth,
            borderRadius: 8,
          },

          button: {
            backgroundColor: '#9cd548',
            width: '60%',
            padding: 15,
            margin: 16,
            borderRadius: 10,
            alignItems: 'center',
          },

        content:{
          paddingTop: height*.1,
          alignItems: 'center',
        },
        infoBoxWrapper: {
          flexDirection: 'row',
        },
        infoBox: {
          width: '10%',
        },
        info: {
          width: '90%',
          borderRightColor: '#dddddd',
          borderRightWidth: 1
        },
        buttonText: {
          color: 'black',
          fontWeight: '700',
          fontSize: 16,
        },
      }
      );
  


      