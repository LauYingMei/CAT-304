import React,{ useState, useEffect } from "react";
import moment from "moment";
import { format } from "date-fns";
import DateTimePicker from '@react-native-community/datetimepicker';
import Icons from 'react-native-vector-icons/AntDesign';
import { db,auth } from '../firebase'

import {
    FlatList,
    TouchableOpacity, 
    Image, 
    StyleSheet, 
    View, 
    Button, 
    Platform,
    Text,
    SafeAreaView, 
    Dimensions, 
    ImageBackground ,
    KeyboardAvoidingView,
    TextInput,
    BackHandler
} from "react-native";
import BookmarkedPlace from "../screens/BookmarkedPlace";
moment.locale("en");
// travel@hotmail.com, pw-Travel*123!
const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const PlacesConfirmation  = ({ navigation }) => {

  const getBookmark = true
  const [bookmark, setBookmark] = useState([]);
  const userID = auth.currentUser?.uid;
  const [selectedPlaces, setSelectedPlaces] = useState([])
  const [place, setPlace] = React.useState([])

  //Fetch data for bookmark
  const FetchBookmarkedPlaces= async () => {
    const bookmarkNames = []
    for(let i=0; i<bookmark.length;i++){
      bookmarkNames[i] = bookmark[i].placeName
    }
    await db.collection('Place').where("spotName", 'in', bookmarkNames)
    .get().then((querySnapshot) => {
      const places = [];

      querySnapshot.forEach((doc) => {
        places.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setPlace(places);
    })
      .catch((error) => {
        console.log("Error getting events: ", error);
      });
    };

   //Fetch places data
   const FetchBookmark= async () => {
    await db.collection("users").doc(userID).collection("bookmarks")
     .get().then((querySnapshot) => {
      const bookmarkList = [];

      querySnapshot.forEach((doc) => {
        bookmarkList.push({
          ...doc.data(),
          id: doc.id,
        });
      });
      setBookmark(bookmarkList);
    })
      .catch((error) => {
        console.log("Error getting events: ", error);
      });

    bookmark.length>0?await FetchBookmarkedPlaces():null
   };

  useEffect(() => { 
    FetchBookmark()

    const backAction = () => {
      navigation.replace("HomeScreen")
      return true;
      };

      const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction);

      return () => backHandler.remove();
  }, [bookmark.length && getBookmark])

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [mode, setMode] = useState('date');
  const [showStart, setShow] = useState(false);
  const [showEnd, setShow2] = useState(false);

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || startDate;
    setShow(Platform.OS === 'ios');
    setStartDate(currentDate);
    currentDate>endDate? setEndDate(currentDate): null;
  };

  const onChangeEndDate = (event, selectedDate2) => {
    const currentDate2 = selectedDate2 || endDate;
    setShow2(Platform.OS === 'ios');
    setEndDate(currentDate2);
  };
  
  const showMode = (currentMode) => {
    setShow(true);
    setMode(currentMode);
  };

  const showMode2 = (currentMode) => {
    setShow2(true);
    setMode(currentMode);
  };

  const showDatepicker = () => {
    showMode('date');
  };

  const showDatepicker2 = () => {
    showMode2('date');
  };

  /*const places = [
    {
      placeId: 1,
      name: "home",
      photo: require('../assets/places/home.jpg'),
      location:{
        latitude: 2.0575,
        longitude: 102.5852
      }
    },
    {
      placeId: 2,
      name: "pahlawan",
      photo: require('../assets/places/pahlawan.jpg'),
      location:{
        latitude: 2.1898,
        longitude: 102.2526
      }
    },
    {
      placeId: 3,
      name: "CS USM",
      photo: require('../assets/places/usmcs.jpg'),
      location:{
        latitude: 5.3547,
        longitude: 100.3015
      }
    },
    {
      placeId: 4,
      name: "Genting FirstWorld",
      photo: require('../assets/places/genting.jpg'),
      location:{
        latitude: 3.4256,
        longitude: 101.7946
      }
    },
    {
      placeId: 5,
      name: "Genting FirstWorld1",
      photo: require('../assets/places/genting.jpg'),
      location:{
        latitude: 3.5256,
        longitude: 101.7946
      }
    },
    {
      placeId: 6,
      name: "Genting FirstWorld2",
      photo: require('../assets/places/genting.jpg'),
      location:{
        latitude: 3.6256,
        longitude: 101.7946
      }
    },
    {
      placeId: 7,
      name: "Genting FirstWorld3",
      photo: require('../assets/places/genting.jpg'),
      location:{
        latitude: 3.7256,
        longitude: 101.7946
      }
    },
    {
      placeId: 8,
      name: "Genting FirstWorld4",
      photo: require('../assets/places/genting.jpg'),
      location:{
        latitude: 3.8256,
        longitude: 101.7946
      }
    },
    {
      placeId: 9,
      name: "Genting FirstWorld5",
      photo: require('../assets/places/genting.jpg'),
      location:{
        latitude: 3.9256,
        longitude: 101.7946
      }
    }
  ]*/

  const selectPlaces = (placePressed) => {
    // to allow deselect
    if(selectedPlaces.includes(placePressed)){
      const newListItem = selectedPlaces.filter(item => item !== placePressed)
      return setSelectedPlaces(newListItem)
    }
    setSelectedPlaces([...selectedPlaces,placePressed]);
  };

  const getSelected = (placePressed) => selectedPlaces.includes(placePressed);
  const[isSelectAll,setSelectAll] = useState(false)

  const handleSelection = () => {
    if(isSelectAll){
      setSelectedPlaces([])
      setSelectAll(false)
    }
    else{
      setSelectedPlaces(place)
      setSelectAll(true)
    }
  }

  const handleProceedNext = () => {
    // CHECK TRIP NAME****
    navigation.navigate("OriginSelection",{chosenPlacesList:selectedPlaces, tripStart:startDate, tripEnd:endDate, tripname:tripName})
  }

  function renderPlaces() {
    
    const renderItem = ({item}) => 
    (
      <BookmarkedPlace
        selected={ getSelected(item)}
        onPress={() => selectPlaces(item)} 
        item={item} 
      />                    
    )          
              
    return (
      <FlatList
            key={'_'}
            data={place}
            keyExtractor={item => "_" + `${item.id}`}
            renderItem={renderItem}
            contentContainerStyle={{
              paddingTop:10,
              paddingHorizontal: 5,
              paddingBottom: 10
            }}
            numColumns={2}
            columnWrapperStyle={{
              justifyContent: 'space-evenly',
            }}
      />
    )
  }
  
  const [tripName, setTripName] = useState("Trip Name");
    
  return (

    <SafeAreaView style={styles.container}>
    
    {/*header */}
    <View style ={styles.headerBar}>
      <TouchableOpacity style={{top: 0.05*HEIGHT}} onPress={()=>navigation.goBack()}>
        {/* return icon*/}
        <Icons name="arrowleft" size={WIDTH*0.08} color='rgb(0,0,0)' />
      </TouchableOpacity>
      <Text style={{fontWeight:'bold',fontSize:WIDTH*0.035, padding:WIDTH*0.03}}>Trip Name</Text>      
      <KeyboardAvoidingView>
        <TextInput placeholder="Trip Name" value={tripName} onChangeText={text => setTripName(text)} 
          style={[styles.modal,{color:'green',padding:WIDTH*0.03,flexDirection:'row',top:10, width: WIDTH*0.6}]}/>
      </KeyboardAvoidingView>
      <View style={{padding:WIDTH*0.05}} />
        
      <View style={{flexDirection: 'row', height:35,marginTop: 30, flexWrap: 'wrap'}}>
        {/* the calendar icon*/}
        <Icons name="calendar" size={WIDTH*0.07} color='rgb(0,0,0)' />
        <Text style={{fontWeight: 'bold'}}> From </Text>
        {/* Date input fields */}
        <TouchableOpacity
          onPress={showDatepicker}
        >
          <View style={[styles.modal,{width:WIDTH/3,flexDirection:'row'}]}>
            {startDate
              ?<Text style={{left:10,top:5,color:'green'}}>{format(startDate,'E, MMM d, yy').toString()}</Text>
              :null
            }
            {showStart && (
              <DateTimePicker
                testID="startDatePicker"
                value={startDate}
                mode={mode}
                display="calendar"
                is24Hour={true}
                onChange={onChangeStartDate}
                minimumDate={new Date()}
                style={{backgroundColor: '#0782F9'}}
              />
            )}
          </View> 
        </TouchableOpacity>
    
        <Text style={{fontWeight: 'bold'}}> To </Text>
        <TouchableOpacity
          onPress={showDatepicker2}
          size={WIDTH*0.46}
        >
          <View style={[styles.modal,{width:WIDTH/3,flexDirection:'row'}]}>
            {endDate
              ?<Text style={{left:10,top:5,color:'green'}}>{format(endDate,'E, MMM d, yy').toString()}</Text>
              :null
            }
            {showEnd && (
              <DateTimePicker
                testID="endDatePicker"
                value={endDate}
                mode={mode}
                is24Hour={true}
                display="calendar"
                onChange={onChangeEndDate}
                minimumDate={startDate}
              />
            )}
          </View>
        </TouchableOpacity>
      </View>
    </View>
      
    <Text style={{fontSize:HEIGHT/35,fontWeight:'bold', left:WIDTH/15, top:HEIGHT/80}}>Bookmark list</Text>
     
    {/*Places*/}
    <View>
    {bookmark.length<0
      ?   <View style={{flexDirection:'column', justifyContent:"center",alignItems:"center", top:HEIGHT*0.07, opacity:0.5}}>
            <Icons name="exclamationcircle" size={WIDTH*0.5} color='#38761D' style={{}}/>
            <Text> </Text>
            <Text style={{width:WIDTH*0.95, textAlign:'center'}}> Oops..There is no bookmarked places/events. </Text>
            <Text style={{width:WIDTH*0.95, textAlign:'center'}}>Please select some places/events prior entering this page.</Text>
          </View>
      :bookmark.length === 1
      ? (<View>
            {alert("Too few place for itinerary planning. Please select more places to visit.")}
            {renderPlaces()} 
        </View>)
      
      :(  <View>
            <View style={{flexDirection:'row',justifyContent:'space-between',top: HEIGHT/80,marginTop:10,marginBottom:10}}>
              <Text style={{fontSize:HEIGHT*0.021, flexBasis:'75%',left:WIDTH/15,color:'#3A3B3C'}}>Select at least 2 places:</Text>
              <Text onPress={()=>{handleSelection()}} style={{fontSize:HEIGHT*0.021,color:'blue',right:1}}>
                {isSelectAll? "Deselect all":"Select all"}
              </Text>
            </View>

            <View>
              {renderPlaces()}
            </View>
          </View>
        )
      }
    </View>
    {/*right circle icon*/} 
    {selectedPlaces.length>1
        ?<TouchableOpacity style={{position:'absolute',bottom:35,right:20, alignSelf:'flex-end'}}
            onPress = {()=>handleProceedNext()}
          >
            <Icons name="rightcircle" size={WIDTH*0.15} color='#38761D' />
          </TouchableOpacity>
        
        :null}
  </SafeAreaView>
    
  )// end of return 
 }// end of class
        
    
const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(200, 247, 197)',
  },
  headerBar:{
    backgroundColor:'#E8E9EB',
    flexDirection: 'row', 
    flexWrap: 'wrap',
    width: WIDTH, 
    height:0.15*HEIGHT
  },
  modal:{
    height: HEIGHT/22,
    width: WIDTH*0.35,
    borderRadius:8,
    borderWidth:3,
    borderColor: '#38761D',
    backgroundColor:'white',
    elevation: 6,
    position:'relative',
    },
 });
    
export {PlacesConfirmation};
    
    