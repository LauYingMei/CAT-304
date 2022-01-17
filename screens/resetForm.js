import React, { useState, useEffect } from 'react';
import {Picker,KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,ScrollView,Button,Dimensions} from 'react-native'
import { useNavigation } from '@react-navigation/core';
import { db, auth, createUserDocument } from '../firebase';
import { borderBottomColor, borderColor } from 'react-native/Libraries/Components/View/ReactNativeStyleAttributes';
import Input from './Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { forgetPw} from '../actions/userAction'

const {width,height} = Dimensions.get('window')


export default class changePw extends React.Component{
 
  constructor(props){
    super(props);
   
    this.state={
      email:"",
      password: "",
      confirmPassword: "",           
      secureTextEntry: true,
      iconName:"eye-off",
      isValid: null,
    }
  }
 

  handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        this.props.navigation.replace("Login")
      })
      .catch(error => alert(error.message))
  }


  onIconPress= () => {
    let iconName = (this.state.secureTextEntry) ? "eye" : "eye-off";

    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
      iconName: iconName
    });
  }
 


  render(){
    const { isValid } = this.state;
   
    return (
     
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
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
          value={this.email}
          onChangeText={email => this.setState({email})}
          style={styles.input}

        />
      </View>
      
      <View style={styles.registerForm}>
      <Icon name="checkbox-marked-circle" color="#13553b" size={18} style={styles.icon}/>
      <TextInput
    placeholder="Confirm Email"
    value={this.state.confirmEmail}
    style={styles.input}
    onChangeText={confirmEmail => this.setState({confirmEmail})}
/>
</View>

      <View style={styles.inputLayout}>
      <Button disabled={(this.state.email !==  this.state.confirmEmail )}  
      onPress={() => {forgetPw(this.state.email)}} 
      title="SUBMIT"/>

<View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={this.handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
    </View>

</View>
     </ScrollView>
     </KeyboardAvoidingView>
    );
  }
} 



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
  content:{
    paddingTop: 20,
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
          fontSize: 21,
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
            backgroundColor: '#38761D',
            width: '100%',
            padding: 15,
            borderRadius: 10,
            alignItems: 'center',
          },

    
      }
      );
      const pickerSelectStyles = StyleSheet.create({
        inputIOS: {
            fontSize: 16,
            paddingTop: 13,
            paddingHorizontal: 10,
            paddingBottom: 12,
            borderWidth: 1,
            borderColor: 'gray',
            borderRadius: 4,
            backgroundColor: 'white',
            color: 'black',
        },
    });
      