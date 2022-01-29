import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './screens/Login';
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
import userBookmark from './screens/userBookmark';
import placeList from './screens/placeList';
import {TravelHome} from './screens/TravelHome';
import {ItineraryDisplay} from './screens/ItineraryDisplay';
import {PlacesConfirmation} from './screens/PlacesConfirmation';
import {OriginSelection} from "./screens/OriginSelection";
import {BestRoute} from './screens/BestRoute';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        
        <Stack.Group screenOptions={{ headerShown: false}}>
        <Stack.Screen name="Login" component={Login} />
        <Stack.Screen name="Register" component={Register}/>
        <Stack.Screen name="Profile" component={Profile}/>
        <Stack.Screen name="userProfile" component={userProfile}/>
        <Stack.Screen name="changePw" component={changePw}/>
        <Stack.Screen name="editProfile" component={editProfile}/>
        <Stack.Screen name="resetForm" component={resetForm}/>
        <Stack.Screen name="userBookmark" component={userBookmark}/>
        <Stack.Screen name="placeList" component={placeList}/>
        <Stack.Screen name="HomeScreen" component={HomeScreen}  />
        <Stack.Screen name="Filter" component={Filter} />
        <Stack.Screen name="Place" component={Place} />
        <Stack.Screen name="PlaceDisplay" component={PlaceDisplay}  />
        <Stack.Screen name="TravelHome" component={TravelHome} />
        <Stack.Screen name="ItineraryDisplay" component={ItineraryDisplay} />
        <Stack.Screen name="PlacesConfirmation" component={PlacesConfirmation} />
        <Stack.Screen name="OriginSelection" component={OriginSelection} />
        <Stack.Screen name="BestRoute" component={BestRoute} />
        </Stack.Group>

        
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
