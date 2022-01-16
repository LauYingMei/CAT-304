import { useNavigation } from '@react-navigation/native'
import React, { useEffect, useState } from 'react'
import { KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,Image } from 'react-native'
import { auth } from '../firebase'
import { Ionicons } from '@expo/vector-icons'

const Login = () => {

    
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const navigation = useNavigation()

    useEffect(() => {
      const unsubscribe = auth.onAuthStateChanged(user => {
        if (user) {
        //navigation.replace("Main")
          //navigation.replace("Place",
          //{placeID: ""})
          //navigation.navigate('PlaceDisplay',
          //{placeID: "GBM7fvuiZg5DcQKqzyfb"})
          navigation.navigate('HomeScreen')
        }
      })
  
      return unsubscribe
    }, [])

    const handleSignUp = () => {
        auth
          .createUserWithEmailAndPassword(email, password)
          .then(userCredentials => {
            const user = userCredentials.user;
            console.log('Registered with:', user.email);
          })
          .catch(error => alert(error.message))
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

    return (
        <KeyboardAvoidingView
          style={styles.container}
          behavior="padding"
        >
    
        <Image height={300} width= {400} source={require('./../assets/image/Logo.png')} style={styles.logoImg}/>

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
              secureTextEntry
            />
            <Ionicons name="eye-outline" size={32} color="grey" />
          </View>
    
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={handleLogin}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Login</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSignUp}
              style={[styles.button, styles.buttonOutline]}
            >
              <Text style={styles.buttonOutlineText}>Register</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      )
    }
    
    export default Login
    
    const styles = StyleSheet.create({
      container: {
        
        flex: 1,
        padding: 50,
        alignItems: 'center',
        backgroundColor:'#d4ffb8',
      },
      inputContainer: {
        width: '80%'
      },
      input: {
        backgroundColor: 'white',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
      },
      logoImg:{
        height:300,
        width:400,

      },
      buttonContainer: {
        width: '60%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
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