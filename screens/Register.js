import React, { useState, useEffect } from 'react';
import {Picker,KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,ScrollView,Button,Dimensions} from 'react-native'
import {MaterialCommunityIcons as Icon} from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/core';
import { db, auth } from '../firebase';
import Input from './Input';
import { addNewUser } from '../actions/userAction';
const {width,height} = Dimensions.get('window')


export default class Register extends React.Component{
 
  constructor(props){
    super(props);
    this.inputRefs = {};
    this.state={
      email:"",
      password: "",      
      userName:"",       
      role: "",
      ContactNo:"",
      confirmPassword: "",           
      secureTextEntry: true,
      iconName:"eye-off",
      isValid: null,
    }
  }
  

  onIconPress= () => {
    let iconName = (this.state.secureTextEntry) ? "eye" : "eye-off";

    this.setState({
      secureTextEntry: !this.state.secureTextEntry,
      iconName: iconName
    });
  }
 
handleRegister = () => {
    
  let email = (this.state.email)
  let password =(this.state.password)
  let userName = (this.state.userName)
  let ContactNo = (this.state.ContactNo)
  let role = (this.state.role)
 
  auth
    .createUserWithEmailAndPassword(email, password)
    .then(userCredentials => {
      const user = userCredentials.user;
      console.log('Registered with:', user.email);
      
    })
    .catch(error => alert(error.message))

  addNewUser(auth.currentUser?.email,ContactNo,role,userName);
}

 

  render(){
    const { isValid } = this.state;
    
    return (
     
      <KeyboardAvoidingView
      style={styles.container}
      behavior="padding"
      >
     <ScrollView style={styles.innerContainer}>
     <Text style={styles.title}>
     &nbsp;&nbsp;&nbsp;&nbsp;Welcome!&nbsp; Register Here &nbsp;    
      </Text>
     <View style= {styles.registerForm}>
      <TextInput
          placeholder="Email"
          value={this.email}
          onChangeText={email => this.setState({email})}
          style={styles.input}
        />
      </View>
      <TextInput
          style={styles.registerForm}
          placeholder="User Name"
          value={this.userName}
          onChangeText={userName => this.setState({userName})}
          style={styles.input}
          />
         <TextInput
          style={styles.registerForm}
          placeholder="Contact Number"
          value={this.ContactNo}
          onChangeText={ContactNo => this.setState({ContactNo})}
          style={styles.input}
          keyboardType="phone-pad"
         />
   
   
               <Picker 
               prompt= "Choose a role"
               selectedValue = {this.role} 
               onValueChange = {(role) =>  this.setState({ role })}>
               <Picker.Item label = "-select-" value = "" />
               <Picker.Item label = "user" value = "user" />
               <Picker.Item label = "owner" value = "owner" />
            </Picker>

      <View style= {styles.registerForm}>
      
      <Input {...this.props}
      placeholder="Password"
      value={this.state.password}
      onChangeText={password => this.setState({password})}
      secureTextEntry={this.state.secureTextEntry}
      style={styles.input}
       pattern={[
            '^.{6,}$', // min 6 chars
            '(?=.*\\d)', // number required
            '(?=.*[A-Z])', // uppercase letter
            '(?=.[!@#$%^&])', // special character
          ]}
          onValidation={isValid => this.setState({ isValid })}

      />
     
     <TouchableOpacity onPress={this.onIconPress}>
        <Icon name={this.state.iconName} size={20} 
          style={styles.icon}
        />
      </TouchableOpacity>
      
      </View>

     
      <View style={styles.registerForm}>

      <TextInput

    placeholder="Confirm Password"

    value={this.state.confirmPassword}
    secureTextEntry={this.state.secureTextEntry}

    style={styles.input}

    onChangeText={confirmPassword => this.setState({confirmPassword})}

/>
<TouchableOpacity onPress={this.onIconPress}>
        <Icon name={this.state.iconName} size={20} 
          style={styles.icon}
        />
      </TouchableOpacity>

</View>

      <View>
          <Text style={{ color: isValid && isValid[0] ? 'green' : 'red' }}>
            Rule 1: Min 6 chars
          </Text>
          <Text style={{ color: isValid && isValid[1] ? 'green' : 'red' }}>
            Rule 2: Number required
          </Text>
          <Text style={{ color: isValid && isValid[2] ? 'green' : 'red' }}>
            Rule 3: Uppercase letter
            
          </Text>
          <Text style={{ color: isValid && isValid[3] ? 'green' : 'red' }}>
            Rule 4: Special character such as !@#$%^&
          </Text>
          <Text style={{ color: (this.state.password ==  this.state.confirmPassword ) ? 'green' : 'red' }}>
            Rule 5: Password matched
          </Text>
        </View>


      <View style={styles.inputLayout}>

      <Button disabled={(this.state.password !==  this.state.confirmPassword )||(!isValid)}  
      onPress={() => this.handleRegister()} 
      title="SUBMIT"/>

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
        icon:{
            alignItems:'flex-end',
            paddingTop: 30,
            },
            inputLayout: {

              paddingBottom: 20,
      
          },
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

          pickerStyle: {
            height: height * 0.02,
            width: width * 0.4,
            marginTop: 5,
            backgroundColor: 'rgba(0, 0, 0, 0.03)'
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
      