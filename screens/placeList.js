import React, {useState, useEffect} from 'react'
import { BackHandler,Image, SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions} from 'react-native';
import { db,auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import Rating from '../screens/Rating';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const placeList = () => {
  
  const [place, setPlaces] = useState([]);
  const userID = auth.currentUser?.uid;
  const navigation = useNavigation()

  //Display place image with name
  const Card = ({place}) => {

    return (
      <TouchableOpacity 
        style={styles.card}
        onPress={() => navigation.navigate('PlaceDisplay',{placeID: place.id})}
        
      >
        <Image style = {styles.image} source = {{uri: place.image[0].uri}}></Image>  
        <Text style={{fontWeight: '500', fontSize: 20, padding:'5%'}}>{place.spotName}</Text>
        {Rating(place.rating)}
        
    </TouchableOpacity>
    );
  };

  const FetchPlace = () => {
    var document=db.collection('Place').where("userID", "==", userID)
    document.orderBy('rating', "desc")
    document.limit(10)
    document.get()
    .then((querySnapshot) => {
      const place = [];

          querySnapshot.forEach((doc) => {
            console.log(doc.id, " => ", doc.data()["spotName"]);
            place.push({
              ...doc.data(),
              id: doc.id,
            });
        });
        setPlaces(place);
    })
    .catch((error) => {
        console.log("Error getting documents: ", error);
    });
  };
  
 // to go back to previous page
 const goBack = () => {
    navigation.replace("Profile")   
}

  return(
    
      <SafeAreaView backgroundColor='#c8f7c5' height='100%' width='100%'>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.1)" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
        <Icon name="chevron-left" size={30} color='white' style={styles.icons}/>
        </TouchableOpacity>
        <Text style={styles.title}>
             My Agrotourism Spot
         </Text>
        
         
      </View>  
        {/*Content*/}
        <ScrollView vertical showsVerticalScrollIndicator={true} marginLeft="3%"  marginBottom="3%">  
      
          {/* Get place from database*/}
          {useEffect(() => {
              FetchPlace()
        
            // control physical back button
            const backAction = () => {
            navigation.replace("Profile")
            return true;
            };

            const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction);

            return () => backHandler.remove();
   
          },[])}
  
          {/*Display Owner Places*/}
          {place == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 20, marginLeft: '3%' }}>**No Place Posted**</Text> :
          <>       
        <View style={{width: "100%", flexDirection: "row", flexWrap: "wrap"}}>
          {place.map((item, index) => (<Card key={index} place={item} />))}
        </View>
          </>
         
          }     
        </ScrollView> 
        <TouchableOpacity
          style={styles.buttonSubmit}
          onPress={()=>navigation.replace('HomeScreen')}
          >
            <Icon name="home" size={30} color='#10533f'/>
           </TouchableOpacity>
      </SafeAreaView>   
   
  );
};

//Style
const styles = StyleSheet.create({
  card:{
    marginTop: 5,
    marginRight: 10,
    padding: 5,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: '#f0f8ff',
    width: windowWidth*0.45,
    elevation: 10,
  },
  icons:{
    marginBottom: '20%',
    marginTop: '90%',
  },
  image:{
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 15,
    alignSelf: 'center',
  },
  title:{
    marginTop:'3%',
    marginLeft:'3%',
    fontWeight: 'bold', 
    fontSize: 24,
    color:'white',
    
  },
  header: {
    marginBottom: 10,
    marginTop: 30,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    textAlign:"center",
    backgroundColor:"#10533f",
},
buttonSubmit: {
  backgroundColor: '#9cd741',
  width: '20%',
  padding: 10,
  borderRadius: 10,
  alignItems: 'center',
  bottom:windowHeight*0.01,
  right:windowHeight*0.01, 
  alignSelf:'flex-end'
},

});

export default placeList;