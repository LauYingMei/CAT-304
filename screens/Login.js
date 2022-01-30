import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,Image,ScrollView } from 'react-native'
import { auth } from '../firebase'
import Icon from 'react-native-vector-icons/FontAwesome5'
import { Dimensions } from 'react-native';


const Login = () => {

    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()
    const [hidePass, setHidePass] = useState(true)

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
        navigation.replace('HomeScreen')
        }
      })
      
      return unsubscribe
    }, [])
    

    const handleSignUp = () => {
      navigation.replace("Register")
      }
    
      const handleLogin = () => {
        auth
          .signInWithEmailAndPassword(email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Logged in with:', user.email);
          })
          .catch(error => alert(error.message))
      }  
        
      const handlePasswordChange = () => {
        navigation.navigate("resetForm");
      }
    
    return (
      
      <ScrollView showsVerticalScrollIndicator={false} >
      <KeyboardAvoidingView
      style={styles.container}>
 
      <View>
      <Image 
    source={require('./../assets/image/Logo.png')}
    style={{height:height*0.4,
            width:width}}
    resizeMode="contain"
      
      
      />
      </View>
     
      <View style={styles.inputContainer}>
       
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={text => setEmail(text)}
          style={styles.input}
        />
      
      
       <TextInput
          placeholder="Password"
          value={password}
          onChangeText={text => setPassword(text)}
          style={styles.input}
          secureTextEntry={hidePass ? true : false}
        /> 
        <Icon
          name={hidePass ? 'eye-slash' : 'eye'}
          size={15}
          color="grey"
          onPress={() => setHidePass(!hidePass)}
          style={styles.icon}
        />
      </View>
     

      
      <View style={styles.buttonContainer}>
     
        <TouchableOpacity
          onPress={handleLogin}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handlePasswordChange}
          style={styles.reset}
        >
          <Text style={styles.buttonOutlineText}>Forgot password?</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          onPress={handleSignUp}
          style={[styles.button, styles.buttonOutline]}
        >
          <Text style={styles.buttonOutlineText}>Register</Text>
        </TouchableOpacity>
        
      </View>
    
    </KeyboardAvoidingView></ScrollView>
        
      )
    }
    
    export default Login
    const {width,height} = Dimensions.get('window')

    const styles = StyleSheet.create({
        container: {
          flex: 1,
          padding: 50,
          alignItems: 'center',
          backgroundColor:'#d4ffb8',
          height: height*1.05,
        },
      
        inputContainer: {
          width: width*0.8,
          height: height*0.15,
        },
        input: {
          backgroundColor: 'white',
          paddingHorizontal: 15,
          paddingVertical: 10,
          borderRadius: 10,
          marginTop: 5,
        },
        icon:{
           paddingLeft:width*0.75,
           alignItems:'flex-end',
           },
          
           reset:{
             alignItems: 'center',
             padding: 10,
           },

        logoImg:{
            
            
        },
        buttonContainer: {
          width: width*0.6,
          justifyContent: 'center',
          alignItems: 'center',
          paddingTop:height*.05,
          marginTop: 20,
        },
        button: {
          backgroundColor: '#38761D',
          width: '100%',
          padding: 15,
          borderRadius: 10,
          alignItems: 'center',
         
        },
       
        buttonOutline: {
          backgroundColor: 'white',
          marginTop: 5,
          borderColor: '#38761D',
          borderWidth: 2,
        },
        buttonText: {
          color: 'white',
          fontWeight: '700',
          fontSize: 16,
        },
        buttonOutlineText: {
          color: '#38761D',
          fontWeight: '700',
          fontSize: 16,
        },
       
      })