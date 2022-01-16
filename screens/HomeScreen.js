import React, {useState, useEffect} from 'react'
import { FontAwesome5 } from '@expo/vector-icons/';
import { FlatList, Image, SafeAreaView, ScrollView, KeyboardAvoidingView,StyleSheet, Text, View, TouchableOpacity, Dimensions} from 'react-native';
import { db } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import moment from 'moment'
import Rating from '../screens/Rating';
import Header from '../screens/Header';
import Footer from '../screens/Footer';
import PlaceDisplay from '../screens/PlaceDisplay';
import SearchBar from './SearchBar';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const HomeScreen = () => {
  
  const [place, setPlaces] = useState([]);
  const [eventList, setEventList] = useState([])
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

  //Display events with details
  const Event = ({eventList}) => {

    return (
      <TouchableOpacity 
      style={styles.reviewContainer}
      onPress={() => navigation.navigate('PlaceDisplay',{placeID: eventList.placeID})}
      >
        <Text style={styles.subtitle}>{eventList.title}</Text>
        <Text style={styles.time}>Date: {moment.unix(eventList.fromDate.seconds).format("DD-MMM-YYYY (ddd)")} - {moment.unix(eventList.toDate.seconds).format("DD-MMM-YYYY (ddd)")}</Text>
        <Text style={styles.time}>Time: {eventList.fromTime} - {eventList.toTime}</Text>
        <Text style={styles.time}>Location: {eventList.spotName}</Text>
        <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{"\n"}Description: </Text>
        <Text style={styles.content}>{eventList.description}</Text>
      </TouchableOpacity>
    );
  };

  //Fetch data for places 
  const FetchPlace = () => {
    db.collection('Place').orderBy('rating', "desc").limit(10).get().then((querySnapshot) => {
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
  
  //Fetch data for events
  const FetchEvent = () =>{
    setEventList('')
    db.collection('Place').get().then((querySnapshot) => {
      querySnapshot.forEach((doc1) => {
        db.collection('Place').doc(doc1.id).collection("events").orderBy("fromDate", "desc").get().then((querySnapshot) => {

          querySnapshot.forEach((doc) => {
    
              if (doc.data().toDate.toDate().setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                setEventList(eventList => { return ([...eventList, doc.data()])});
                console.log("Get events information successfully: ", doc.data()["title"])
              }
          });
        })
        .catch((error) => {
            console.log("Error getting documents: ", error);
        });
      });       
    })
  }

  return(
    <KeyboardAvoidingView>
      <SafeAreaView backgroundColor='white' height='100%' width='100%'>
        
        {Header()}

        {/*Search Bar*/}
        <View flexDirection='row' justifyContent='space-evenly' marginTop='3%' marginRight='3%'>
          {SearchBar()}
          <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
            <FontAwesome5 
              style={styles.icons} 
              name='filter' 
              size={30} 
              color='lightgrey' 
            />
          </TouchableOpacity>
        </View>
        
        {/*Content*/}
        <ScrollView vertical showsVerticalScrollIndicator={true} marginLeft="3%"  marginBottom="3%">
          
          {/* Get event from database*/}
          {useEffect(() => {FetchEvent()},[])}

          {/*Display Events (not expired)*/}
          <Text style={styles.title}>Events</Text>
          {eventList == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 20, marginLeft: '3%' }}>No Event</Text> : 
            <FlatList 
            horizontal 
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id}
            data = {eventList}
            renderItem = {({item}) => <Event eventList = {item} />}
            />   
          }

          {/* Get place from database*/}
          {useEffect(() => {FetchPlace()},[])}

          {/*Display Popular Places*/}
          <Text style={styles.title}>Popular Places</Text> 
          <FlatList 
            vertical
            keyExtractor={item => item.id}
            data = {place}
            renderItem = {({item}) => <Card place = {item} />}
            style={styles.container}
            numColumns={(2)}
            columnWrapperStyle={{flex: 1}}      
            />     
        </ScrollView> 

        {Footer()}

      </SafeAreaView>   
    </KeyboardAvoidingView>  
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
    fontSize: 30,
  },
  reviewContainer: {
    backgroundColor: 'rgba(211,229,207, 0.5)',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 10,
    marginTop: "3%",
    marginBottom: "7%",
    width: windowWidth*0.83,
    height: 'auto',
    marginLeft: 5,
  },
  content: {
    textAlign: 'justify',
    alignItems: 'center',
    fontSize: 15,

  },
  subtitle: {
      fontWeight: 'bold',
      color: 'rgba(11, 61, 42, 1)',
      marginTop: 15,
      width: "80%",
      fontSize: 20,
  },
  time: {
    textAlign: 'justify',
    alignItems: 'center',
    fontSize: 15,
    color: "rgba(135, 135, 135, 1)",
    fontWeight: 'bold',
  },

});

export default HomeScreen;