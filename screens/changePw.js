import React, { useNavigation } from 'react';
import {Picker,KeyboardAvoidingView,StyleSheet, Text,TextInput, View,TouchableOpacity,ScrollView,Button,Dimensions} from 'react-native'
import Input from './Input';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { resetPw} from '../actions/userAction'
import { auth, db } from '../firebase'
import * as firebase from 'firebase'
const {width,height} = Dimensions.get('window')


export default class changePw extends React.Component{
 
  constructor(props){
    super(props);
   
    this.state={
      email:"",
      password: "",
      confirmPassword: "",   
      currentPassword:"", 
      secureTextEntry: true,
      iconName:"eye-off",
      isValid: null,
    }
  }
 

  goBack = () => {
   
    this.props.navigation.replace("Profile")
  
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
     <View style={styles.registerForm}>
      <Icon name="checkbox-marked-circle" color="#13553b" size={18} style={styles.icon}/>
      <TextInput

    placeholder="Old Password"

    value={this.state.currentPassword}
    secureTextEntry={this.state.secureTextEntry}

    style={styles.input}

    onChangeText={currentPassword => this.setState({currentPassword})}

/>
<TouchableOpacity onPress={this.onIconPress}>
        <Icon name={this.state.iconName} size={20} 
          style={styles.icon}
        />
      </TouchableOpacity>

</View>
     
      <View style= {styles.registerForm}>
      <Icon name="key" color="#13553b" size={18} style={styles.icon}/>
      <Input {...this.props}
      placeholder=" New Password"
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
      <Icon name="checkbox-marked-circle" color="#13553b" size={18} style={styles.icon}/>
      <TextInput

    placeholder="Confirm New Password"

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

      <View style={styles.condition}>
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

      <Button disabled={(this.state.password !==  this.state.confirmPassword )||(!isValid)||(!this.state.password.trim())||(!this.state.confirmPassword.trim())}  
      onPress={() => {resetPw(this.state.currentPassword,this.state.password)}} 
      title="SUBMIT"
      color='#38761D'
      />

<View style={styles.content}>
      
      <TouchableOpacity
        onPress={this.goBack}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Back to Profile Screen</Text>
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
  condition:{
    paddingTop:20,
    paddingBottom: 20,
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
    
      }
      );
    

      