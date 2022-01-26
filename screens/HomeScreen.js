import React, { useState, useEffect } from 'react'
import { FontAwesome5 } from '@expo/vector-icons/';
import { Alert, FlatList, Image, SafeAreaView, ScrollView, StyleSheet, Text, View, TouchableOpacity, Dimensions,BackHandler } from 'react-native';
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

  useEffect(() => {
    // control physical back button
    const backAction = () => {
      Alert.alert('Exit','Are you sure want to close this application?', [
        {
            text: "Yes",
            onPress:() => (
                BackHandler.exitApp()
            )
        },
        {
            text: "no",
        },
    ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, [])

  //Display place image with name
  const Card = ({ place }) => {

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('PlaceDisplay', { placeID: place.id })}
      >
        <Image style={styles.cardImage} source={{ uri: place.image[0].uri }}></Image>
        <Text style={styles.cardText}>{place.spotName}</Text>
        {Rating(place.rating)}
      </TouchableOpacity>
    );
  };

  //Display events with details
  const Event = ({ eventList }) => {

    return (
      <View style={styles.eventContainer}>
        <View style={{flexDirection: "row", justifyContent: "space-between"}}>
          <Text style={styles.subtitle}>{eventList.title}</Text>
          <TouchableOpacity
            style={{marginTop: "3%"}}
            onPress={() => navigation.navigate('PlaceDisplay', { placeID: eventList.placeID })}>
            <FontAwesome5 
                name='info-circle'
                size={30} 
                color='#38761D'                
                />
          </TouchableOpacity>
        </View>
        
        <Text style={styles.time}>Date: {moment.unix(eventList.fromDate.seconds).format("DD-MMM-YYYY (ddd)")} - {moment.unix(eventList.toDate.seconds).format("DD-MMM-YYYY (ddd)")}</Text>
        <Text style={styles.time}>Time: {eventList.fromTime} - {eventList.toTime}</Text>
        <Text style={styles.time}>Location: {eventList.spotName}</Text>
      </View>
    );
  };

  //Fetch data for places 
  const FetchPlace = () => {
    db.collection('Place').orderBy('rating', "desc").limit(10).get().then((querySnapshot) => {
      const place = [];

      querySnapshot.forEach((doc) => {
        place.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setPlaces(place);
      console.log("Get places sucessfully.");
    })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  };

  //Fetch data for events
  const FetchEvent = () => {
    db.collection('Event').orderBy("fromDate", "desc").get().then((querySnapshot) => {
      const eventList = [];

      querySnapshot.forEach((doc) => {
        eventList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      console.log("Get events sucessfully.");
      setEventList(eventList);
    })
      .catch((error) => {
        console.log("Error getting events: ", error);
      });
  };

  return (
    <SafeAreaView backgroundColor='rgb(200,247,197)' height='100%' width='100%'>

      {Header()}

      {/*Search Bar*/}
      <View flexDirection='row' justifyContent='space-evenly' backgroundColor="#10533f">
        {SearchBar()}
        <TouchableOpacity onPress={() => navigation.navigate('Filter')}>
          <FontAwesome5
            style={styles.icons}
            name='filter'
            size={30}
            color='white'
          />
        </TouchableOpacity>
      </View>

      {/*Content*/}
      <ScrollView vertical showsVerticalScrollIndicator={true} marginLeft="3%" marginBottom="3%">

        {/* Get event from database*/}
        {useEffect(() => { FetchEvent() }, [])}

        {/*Display Events (not expired)*/}
        <Text style={styles.title}>Events</Text>
        {eventList == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 20, marginLeft: '3%' }}>No Event</Text> :
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={item => item.id.toString()}
            data={eventList}
            renderItem={({ item }) => <Event eventList={item} />}
          />
        }

        {/* Get place from database*/}
        {useEffect(() => { FetchPlace() }, [])}

        {/*Display Popular Places*/}
        <Text style={styles.title}>Popular Places</Text>
        <FlatList
          vertical
          keyExtractor={item => item.id.toString()}
          data={place}
          renderItem={({ item }) => <Card place={item} />}
          numColumns={(2)}
          columnWrapperStyle={{ flex: 1 }}
        />

        {/* Display View Button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Filter')}
          style={styles.button}
        >
          <Text style={styles.buttonText}>View more place</Text>
        </TouchableOpacity>

      </ScrollView>

      {Footer()}

    </SafeAreaView>
  );
};

//Style
const styles = StyleSheet.create({
  card: {
    marginTop: "2%",
    marginRight: "2%",
    marginBottom: "2%",
    padding: 5,
    alignItems: 'center',
    borderRadius: 15,
    backgroundColor: 'white',
    width: windowWidth * 0.45,
    elevation: 10,
  },
  cardText: {
    fontWeight: '500',
    fontSize: 17,
    padding: '5%',
    marginBottom: '3%',
    textAlign: 'center',
    textTransform: 'capitalize',
  },
  cardImage: {
    width: '100%',
    height: undefined,
    aspectRatio: 1.5,
    borderRadius: 15,
    alignSelf: 'center',
  },
  icons: {
    marginBottom: '20%',
    marginTop: '70%',
    marginRight: '3%'
  },
  title: {
    marginTop: '3%',
    marginLeft: '3%',
    fontWeight: 'bold',
    fontSize: 25,
  },
  eventContainer: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 10,
    paddingBottom: 20,
    borderRadius: 10,
    marginTop: "3%",
    marginBottom: "7%",
    width: windowWidth * 0.83,
    marginRight: 10,
  },
  content: {
    textAlign: 'justify',
    alignItems: 'center',
    fontSize: 15,
  },
  subtitle: {
    fontWeight: 'bold',
    color: '#38761D',
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
  button: {
    backgroundColor: '#38761D',
    width: '95%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: "3%",
    marginBottom: "3%",
   
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
});

export default HomeScreen;