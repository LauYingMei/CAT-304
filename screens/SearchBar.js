import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import SearchableDropdown from 'react-native-searchable-dropdown';

const SearchBar = () => {
  
  const [placeName, setPlaceName] = useState([]); 
  const navigation = useNavigation()

  //Fetch data for the Search Item
  useEffect(() => {
    db.collection('Place').get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data()["spotName"]);
            placeName.push({
              id: doc.id,
              name: doc.data()["spotName"]
            });
        });
        setPlaceName(placeName);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  },[]);

  return (
      <View style={styles.container}>
        <SearchableDropdown
          onTextChange={(text) => console.log(text)} //On text change listner on the searchable input
          onItemSelect={(item) =>navigation.navigate('PlaceDisplay',{placeID: item.id})}
          containerStyle={{ padding: 5}}//suggestion container style

          //inserted text style
          textInputStyle={{
            padding: 12,
            borderWidth: 1,
            borderColor: '#ccc',
            backgroundColor: '#FAF7F6',
            fontSize: 20,
          }}
          
          //single dropdown item style
          itemStyle={{
            padding: 10,
            marginTop: 2,
            backgroundColor: '#FAF9F8',
            borderColor: '#bbb',
            borderWidth: 1,
          }}
          
          //text style of a single dropdown item
          itemTextStyle={{
            color: '#222',
            fontSize: 15,
          }}
          
          //items container style you can pass maxHeight to restrict the items dropdown height
          itemsContainerStyle={{
           maxHeight: '90%',
          }}

          items={placeName}                    //mapping of item array
          defaultIndex={2}                     //default selected item index
          placeholder="Enter Place Name"       //place holder for the search input
          resetValue={false}                   //reset textInput Value with true and false state
          underlineColorAndroid="transparent"  //To remove the underline from the android input
        />
      </View>
  );
};

export default SearchBar;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
    width: '70%',
  },
});
