import React, { useState, useEffect } from 'react';
import {BackHandler,KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,ScrollView,Button,Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/core'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { forgetPw} from '../actions/userAction'

const {width,height} = Dimensions.get('window')

  const resetForm = () => {
    const navigation = useNavigation()
    
    const [email, setEmail] = useState("");
    const [confirmEmail, setconfirmEmail] = useState(-"");
  
  
  const goBack = () => {
    navigation.navigate("Login")
}
useEffect(() =>{    
  
 // control physical back button
 const backAction = () => {
   navigation.replace("Login")
   return true;
};

const backHandler = BackHandler.addEventListener(
   "hardwareBackPress",
   backAction
);

return () => backHandler.remove();

}, []
)

    return (
     
      <KeyboardAvoidingView
      style={styles.container}
      
      >
     <ScrollView style={styles.innerContainer}>
     <View style={styles.content}>
     <Text style={styles.title}>
    Reset Your Password Here  
      </Text>
     </View>
      <View style= {styles.registerForm}>
     <Icon name="email" color="#13553b" size={18} style={styles.icon}/>
      <TextInput 
         placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}

        />
      </View>
      
      <View style={styles.registerForm}>
      <Icon name="checkbox-marked-circle" color="#13553b" size={18} style={styles.icon}/>
      <TextInput
    placeholder="Confirm Email"
    value={confirmEmail}
    style={styles.input}
    onChangeText={ text => setconfirmEmail(text)}
/>
</View>

      <View style={styles.inputLayout}>
      <Button disabled={(email !==  confirmEmail )||(!email.trim())||(!confirmEmail.trim())}  
      onPress={() => {forgetPw(email)}} 
      title="SUBMIT"
      color='#38761D'
      />

<View style={styles.content}>
      
      <TouchableOpacity
        onPress={goBack}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back to Login Screen</Text>
      </TouchableOpacity>
    </View>

</View>
     </ScrollView>
     </KeyboardAvoidingView>
    );
    }
    export default resetForm



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
    borderRadius: 20,
  },
  content:{
    paddingTop: height*.1,
    paddingBottom: 20,
    alignItems: 'center',
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
          paddingTop: 10,
          color:"#10523a",
          fontWeight: "bold",
          marginVertical: 4,
          fontSize: 28,
      },
        
          icon:{paddingTop: 30,},
      
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
          buttonText: {
            color: 'black',
            fontWeight: '700',
            fontSize: 16,
          },
    
      }
      );
     
      