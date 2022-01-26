import React, { useState, useEffect } from 'react'
import { db,auth } from '../firebase'
import Icons from 'react-native-vector-icons/AntDesign';
import {
  FlatList, 
  ImageBackground,
  SafeAreaView, 

  StyleSheet, 
  Text, 
  View, 
  TouchableOpacity, 
  Dimensions
} from 'react-native';

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const TravelHome  = ({ navigation }) => {

  const [prevtripList, setprevTripList] = useState([])
  const [posttripList, setpostTripList] = useState([])

  useEffect(() => {
    fetchTripList()
  }, [])

  function renderTripList(list) {
    const renderItem = ({ item }) => (
      <View style={{width: WIDTH*0.8,height:HEIGHT/4,margin:5, top:30}}>
        <TouchableOpacity
          onPress={() => navigation.navigate("ItineraryDisplay", {item})}
        >
          {/* Image */}
              <ImageBackground
                  source={item.tripPhoto}
                  resizeMode="cover"
                  style={{
                      width: WIDTH*0.8,
                      height: HEIGHT/4,
                      borderRadius: 30,
                  }}
              >
                <View style = {styles.overlay}>
                    <View style={{alignItems:'center',justifyContent:'center',top:HEIGHT/12}}>
                        <Text style={{ fontSize:18, color: "white",fontWeight:"bold"}}>
                            {/*new Date(item.tripStartDate.seconds * 1000 + item.tripStartDate.nanoseconds/1000000).toLocaleDateString()} - {new Date(item.tripEndDate.seconds * 1000 + item.tripEndDate.nanoseconds/1000000).toLocaleDateString()*/}
                            {item.tripStartDate} - {item.tripEndDate}
                        </Text>
                    </View>
                </View>
                <View
                  style={{
                      position: 'absolute',
                      bottom: 0,
                      height: HEIGHT*0.05,
                      width: WIDTH*0.8,
                      backgroundColor: 'white',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: 0.9,
                  }}
              >
                  <Text style={{ fontSize:18}}>{item.tripName}</Text>
              </View>
            </ImageBackground>
  
      </TouchableOpacity>
      </View>
  )
            
  return (
      <View style={{height:HEIGHT/3}}>
        <FlatList
          horizontal
          data={list}
          keyExtractor={item => `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingBottom: 10
          }}
        />
      </View>
  )
}

  //Fetch data for events
  const fetchTripList = async () => {
    const today = new Date()
    
    await db.collection("users").doc(auth.currentUser?.uid).collection("TripLists").orderBy("tripStartDate", "desc").get().then((querySnapshot) => {
      const prevTripList = [];
      const postTripList = [];

      querySnapshot.forEach((doc) => {
      
      const showDate = new Date(doc.data().tripStartDate)

      showDate<today
      ?prevTripList.push({
          ...doc.data(),
          id: doc.id,
        })
      :postTripList.push({
        ...doc.data(),
        id: doc.id,
      })
      });
      setprevTripList(prevTripList);
      setpostTripList(postTripList);
    })
      .catch((error) => {
        console.log("Error getting events: ", error);
      });
  };

  return (

    <SafeAreaView style={styles.container}>
      <View style={{top:20}}> 
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          {/* return icon*/}
          <Icons name="arrowleft" size={WIDTH*0.08} color='rgb(0,0,0)' />
        </TouchableOpacity>
        <Text style={{fontWeight:'bold', fontSize:WIDTH/17,left:10,top:10}}> Auto Itinerary Planner</Text>

        <Text style={{fontSize:WIDTH/20,left:10,top:20}}>  Upcoming Trips: </Text>
        {posttripList == '' 
            ?<Text style={{ top:20, left:20, color: 'rgba(0,0,0,0.4)', fontSize: 20, marginLeft: '3%' }}>No Trip</Text>
            :renderTripList(posttripList)
        }
        <Text style={{fontSize:WIDTH/20,left:10,top:20}}>  Previous Trips: </Text>
        {prevtripList == '' 
            ?<Text style={{ top:20, left:20, color: 'rgba(0,0,0,0.4)', fontSize: 20, marginLeft: '3%' }}>No Trip</Text>
            :renderTripList(prevtripList)
        }
        </View>
        {/*plus icon*/} 
        <TouchableOpacity style={{position:'absolute',bottom:HEIGHT*0.01,right:HEIGHT*0.01, alignSelf:'flex-end'}}
            onPress={()=>navigation.navigate("PlacesConfirmation")}>
            <View>{/* */}
                <Icons name="pluscircle" size={WIDTH*0.15} color='#38761D' />
            </View>
        </TouchableOpacity>
    </SafeAreaView>

  );
};

//Style
const styles = StyleSheet.create({
    container: {
        //top:25,
        flex:1,
        backgroundColor: 'rgb(200, 247, 197)'
    },
    overlay:{
        width: WIDTH*0.8,
        height: HEIGHT/4,
        backgroundColor: 'rgba(0,0,0,0.4)'
    }
});

export {TravelHome};