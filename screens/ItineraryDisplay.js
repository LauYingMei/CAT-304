import React from "react";
import moment from "moment";
moment.locale("en");
import { format } from "date-fns";
import { useNavigation } from '@react-navigation/native'
import { StatusBar } from 'expo-status-bar';
import { ScrollView } from 'react-native-gesture-handler';
import Icons from 'react-native-vector-icons/AntDesign';
import Icons2 from 'react-native-vector-icons/Ionicons';
import Icons3 from 'react-native-vector-icons/Octicons';
import Icons4 from 'react-native-vector-icons/Feather';
import {Overlay} from 'react-native-elements';
import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";
import DateTimePicker from '@react-native-community/datetimepicker';
import { db,auth } from '../firebase'
import {
  KeyboardAvoidingView,
  TextInput, 
  Modal,
  Animated, 
  FlatList,
  Dimensions,
  TouchableOpacity, 
  Image, StyleSheet, 
  View, 
  Text,
  route, 
  ImageBackground,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { useCallback, useRef, 
  useState,
  useEffect 
} from 'react';
import {
  removeTripList
} from '../actions/placeAction'

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const ItineraryDisplay = ({ route,navigation }) => {
 
    let trip  = route.params.item;
    const userID = auth.currentUser?.uid;
    const [data,setData] = useState([])
    const [placeList, setPlaceList] = useState([])
    const [placeDataList, setPlaceDataList] = useState([])
    const [visible, setVisible] = useState(false);

    useEffect(() => { 
      FetchPlace()
    }, [placeList.length || userID])

     //Fetch places
  const FetchPlace= async () => {
    await db.collection("users").doc(userID).collection("TripLists").doc(trip.id).collection("TripPlace").orderBy("placeNum", "asc")
     .get().then((querySnapshot) => {
      const places = [];

      querySnapshot.forEach((doc) => {
        places.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setPlaceList(places);
    })
      .catch((error) => {
        console.log("Error getting places: ", error);
      });
      FetchPlacesData()
   };

     //Fetch places data
  const FetchPlacesData= async () => {
    const placesNames = []
    for(let i=0; i<placeList.length;i++){
        placesNames[i] = placeList[i].placeName
    }
    placesNames.length>0?
    await db.collection('Place').where("spotName", 'in', placesNames)
    .get().then((querySnapshot) => {
      const places = [];

      querySnapshot.forEach((doc) => {
        places.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setPlaceDataList(places);
    })
      .catch((error) => {
        console.log("Error getting places data: ", error);
      }):null
      placeDataList.length>0?getItineraryData():null
  };

  const getItineraryData = () => {

    let output = []
    class itineraryData{
        id = ""
        label= ""
        img = ""
        fromDay = ""
        toDay = ""
        fromTime = ""
        toTime = ""
        driving_time =""
    }

    for (let i=0;i<placeList.length;i++){
        const object = new itineraryData()
        object.key = "Item-"+placeList[i].placeNum
        object.id = placeList[i].id
        object.label = placeDataList[i].spotName
        object.img = placeDataList[i].image[0]
        object.fromDay = placeDataList[i].fromDayOfWeek
        object.toDay = placeDataList[i].toDayOfWeek
        object.fromTime = placeDataList[i].fromTime
        object.toTime = placeDataList[i].toTime
        object.driving_time = placeList[i].driveTime
        output[i] = object
      }
      setData(output) 
}

  const renderItem = ({ item, drag, isActive }) => {

    return (
        <TouchableOpacity
          onPress={() => navigation.navigate('PlaceDisplay', { placeID: item.id })}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? "red" : 'rgb(200, 247, 197)' }]}
        >
          <View style={{ flexDirection:'column'}}>   
              {/* the place row*/}
              <View style={[styles.placeInfo,{ flexDirection: 'row', flex:1}]}>
                <Image source = {item.img} style= {{width: 0.2*WIDTH, height:0.2*WIDTH, borderRadius:10,left:10,top:10}}/>
                {/* the details*/}
                <View style={{ flexDirection: 'column',top:10, left:20, height:0.2*WIDTH, width: WIDTH/1.8}}>
                  {/* Place name*/}
                  <View style={{ flexDirection: 'row'}}>
                    <Icons2 name="location-sharp" size={WIDTH*0.05} color='red' style={{top:5}}/>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={styles.text}>{item.label}</Text>
                  </View> 
                  {/* Operating day and time*/}
                  <View style={{ flexDirection: 'row'}}>
                    <Icons2 name="time" size={WIDTH*0.05} color='#38761D' style={{top:5}}/>
                    <View style={{ flexDirection: 'column'}}>
                      {/* Operating Day */}
                      <View style={{ flexDirection: 'row'}}>
                        <Text style ={{fontWeight:'bold'}}> Operating Day   : </Text>
                        <Text>{item.fromDay == item.toDay?" Daily":item.fromDay+" - "+item.toDay}</Text>
                      </View>

                     {/* Operating Time */}
                      <View style={{ flexDirection: 'row'}}>
                        <Text style ={{fontWeight:'bold'}}> Operating Time : </Text>
                        <Text>{item.fromTime} - {item.toTime}</Text>
                      </View>
                    </View>
                  </View>

                </View>
              </View> 
              
     
              {/* the driving row*/}
              {!(item.driving_time === 0)
                ?(
                    <View style={{ flexDirection: 'column',height:60,left:20}}>
                      <Text style={{fontWeight:'bold',left:10}}>l</Text>
                      <View style={{ flexDirection: 'row'}}>
                        <Icons name="car" size={WIDTH*0.07} color='rgb(0,0,0)'/>
                        <Text style={{fontWeight:'bold',left:10}}>{item.driving_time<60
                            ?(item.driving_time.toFixed(0) + " minutes")
                            :Math.floor(item.driving_time/60)+" hours " + (item.driving_time % 60).toFixed(0) + " minutes"
                          }</Text>
                      </View>
                      <Text style={{fontWeight:'bold',left:10}}>l</Text>
                    </View>
                  )
                :(<View style={{ flexDirection: 'column',height:60,left:20}}/>)
              }
            </View>
      </TouchableOpacity>
    );
  };

  const toggleOverlay = () => {
      setVisible(!visible);
  };

  const toggleOverlay2 = () => {
    removeTripList(trip.id)
    navigation.navigate("HomeScreen")
  };


  const deleteTrip =() => {
    return (
      <View style={{ justifyContent:'center',alignItems:'center'}}>
        <Text style = {{fontWeight:'bold', fontSize:WIDTH/20}}>Are you sure to delete this itinerary?</Text>
        <View style={{height:50}}></View>
      </View>
    )
  }

  const renderRoute =() => {

    return(
      <View>
        <FlatList
          data={data}
          keyExtractor={(item) => "_" + `${item.id}`}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop:0.12*HEIGHT,
            paddingBottom: 0.1*HEIGHT,
            alignItems:'center',
            justifyContent:'center',
          }}
        />
      
        {/*header*/}
        <View style={{position:'absolute', alignSelf:'flex-end'}}>
          <ImageBackground source = {trip.tripPhoto} style= {{width: WIDTH, height:0.1*HEIGHT}}>
          <View style = {styles.overlay}>
            <View style={{flexDirection: 'row', flex:1}}>
              <View style={{flexDirection: 'row', flex:1}}>
                {/* return icon*/}
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                  <Icons name="arrowleft" size={WIDTH*0.08} color='white' style={{top:HEIGHT*0.025}}/>
                </TouchableOpacity>
                {/* Trip Details*/}
                <View style={{ flexDirection: 'column',top:10, left:20, height:0.2*WIDTH}}>
                  <View style={{ flexDirection: 'row'}}>
                    <Text style={{fontWeight:'bold', fontSize:HEIGHT*0.018, color:'white'}}>{trip.tripStartDate}</Text>
                    <Text style={{fontSize:HEIGHT*0.018}}>{"  "}</Text>
                    <Icons3 name="dash" size={HEIGHT*0.027} color='white'/>
                    <Text style={{fontSize:HEIGHT*0.018}}>{"  "}</Text>
                    <Text style={{fontWeight:'bold', fontSize:HEIGHT*0.018, color:'white'}}>{trip.tripEndDate}</Text>
                  </View>
                  <View style={{width: WIDTH*0.7}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{fontWeight:'bold', fontSize:HEIGHT*0.035 ,color:'white'}}>{trip.tripName}</Text>
                  </View>
                </View>
              </View>

            </View>
          </View>
        </ImageBackground>
        <View style={{flex:1,flexDirection: 'row',justifyContent: 'space-between',backgroundColor:'#F5F5F5', height:0.12*WIDTH}}>
          <Text style={{left:20, fontWeight:'bold', fontSize:HEIGHT*0.023, color:'#38761D', height:0.2*WIDTH,marginTop:6}}>Itinerary</Text>
          <TouchableOpacity onPress={toggleOverlay} style={{right:20}}>
            {/* return icon*/}
            <Icons name="delete" size={WIDTH*0.08} color='red' style={{top:3}}/>
          </TouchableOpacity>
          {/* Pop up screen for edit trip details*/}
          <Overlay isVisible={visible}>
              {deleteTrip()}
              <View style={{flexDirection:'row', justifyContent:'flex-end'}}>
                <TouchableOpacity onPress={toggleOverlay}>
                  <Text style={{fontSize:WIDTH*0.045,color:'blue',alignSelf:"flex-end"}}> Cancel </Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleOverlay2}>
                  <Text style={{fontSize:WIDTH*0.045,color:'blue',alignSelf:"flex-end"}}>    Confirm </Text>
                </TouchableOpacity>
                </View>
          </Overlay>
        </View>
      </View>
    </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.container}>
      {renderRoute()}
    </SafeAreaView>
  );// end of return 

}// end of class
    

const styles = StyleSheet.create({
  container: {
    top:25,
    flex:1,
    backgroundColor: 'rgb(200, 247, 197)',
  },
  rowItem: {
    top:0.05*HEIGHT,
    height: HEIGHT/5,
    width: WIDTH*0.9,
    margin:2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  modal:{
    height: HEIGHT/20,
    width: WIDTH*0.35,
    borderRadius:10,
    borderWidth:3,
    borderColor: '#38761D',
    backgroundColor:'white',
    elevation: 6,
    position:'relative',
  },
  placeInfo:{
    height: HEIGHT/5,
    width: WIDTH*0.911,
    borderRadius:10,
    borderWidth:3,
    borderColor: '#38761D',
    backgroundColor:'white',
    elevation: 6,
    position:'relative',
  },
  text: {
    color: "black",
    fontSize: 17,
    fontWeight: "bold",
    textAlign: "left",
    margin:5
  },
  overlay:{
    width: WIDTH,
    height:0.1*HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.4)',
    left:0
},

});

export {ItineraryDisplay};