import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
import Main from './screens/Main';
import HomeScreen from './screens/HomeScreen';
import Place from './screens/Place';
import PlaceDisplay from './screens/PlaceDisplay';
import Filter from './screens/Filter';
import Register from './screens/Register';
import Profile from './screens/Profile';
import editProfile from './screens/editProfile';
import changePw from './screens/changePw';
import resetForm from './screens/resetForm';
import userProfile from './screens/userProfile';
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Group screenOptions={{ headerShown: false}}>
        <Stack.Screen  name="Login" component={Login} />
        <Stack.Screen   name="Register" component={Register}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="userProfile" component={userProfile}/>
        <Stack.Screen name="changePw" component={changePw}/>
        <Stack.Screen name="editProfile" component={editProfile}/>
        <Stack.Screen name="resetForm" component={resetForm}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}  />
        <Stack.Screen name="Filter" component={Filter} />
        <Stack.Screen name="Place" component={Place} />
        <Stack.Screen name="PlaceDisplay" component={PlaceDisplay}  />
        </Stack.Group>

        <Stack.Screen name="Main" component={Main} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
