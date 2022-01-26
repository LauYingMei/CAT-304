import React from "react";
import moment from "moment";
moment.locale("en");
import { format } from "date-fns";
import Icons from 'react-native-vector-icons/AntDesign';
import Icons2 from 'react-native-vector-icons/Ionicons';
import Icons3 from 'react-native-vector-icons/Octicons';
import Icons4 from 'react-native-vector-icons/Feather';
import {Overlay} from 'react-native-elements';
import DraggableFlatList, {ScaleDecorator,} from "react-native-draggable-flatlist";
import DateTimePicker from '@react-native-community/datetimepicker';
import {
  KeyboardAvoidingView,
  TextInput, 
  Dimensions,
  TouchableOpacity, 
  Image, 
  StyleSheet, 
  View, 
  Text, 
  ImageBackground,
  SafeAreaView,
  ActivityIndicator
} from "react-native";
import { 
  useState,
  useEffect 
} from 'react';
import {addNewTripList} from '../actions/placeAction'

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const BestRoute  = ({ route,navigation }) => {
  const[isAPIset,setAPI] = useState(true);
  const[APIran,setAPIran] = useState(false);

  let placeList  = route.params.placesList;
  let Origin  = route.params.originSelected;
  let startDate = route.params.startDate;
  let endDate = route.params.endDate;
  let name = route.params.tripname;

  const [StartDate, setStartDate] = useState(startDate);
  const [EndDate, setEndDate] = useState(endDate);
  const [startDateString, setStartDateString] = useState(format(startDate,'E, MMM d, yy').toString());
  const [endDateString, setEndDateString] = useState(format(endDate,'E, MMM d, yy').toString());
  const [mode, setMode] = useState('date');
  const [showStart, setShow] = useState(false);
  const [showEnd, setShow2] = useState(false);
  const [tripName, setTripName] = useState(name);

  const BingDistanceMatrix = require('bing-distance-matrix');
  const bdm = new BingDistanceMatrix('Am4eKlUy6mAMyVtprUZMG5igH2qjblwcTL6Zx_Q0MOv8yOmDWikgbf5rON931F0F');
  const destinationList = []  
  for(let i=0; i<placeList.length;i++){
    destinationList.push(
      { latitude:parseFloat(placeList[i].latitude),
        longitude:parseFloat(placeList[i].longitude)
      }
    )
  }
  const origin = [
    {
      latitude:parseFloat(Origin[0].latitude),
      longitude:parseFloat(Origin[0].longitude)
    }
  ]
  const options = 
  {
    origins: origin,
    destinations: destinationList,
    travelMode: 'driving',
    timeUnit: 'minute',
    distanceUnit: 'km'
  };

  let durationMatrix = []
  let path = []
  let pathIndex = []
  const[data, setData] = useState([]);

    useEffect(()=>{
      getFastestPath()
    },[])

  let NUM_ITEMS = 0

  const setDraggedData = (modifiedData) =>{
    setData(modifiedData)
  }

  const initialData = () => {
    NUM_ITEMS = path.length
    let output = []
    class Object{
      key = ""
      id = ""
      label= ""
      img = ""
      fromDay = ""
      toDay = ""
      fromTime = ""
      toTime = ""
      driving_time =""
    }

    for (let i=0;i<NUM_ITEMS;i++){
      const object = new Object()
      object.key = "item-"+`${i}`
      object.id = path[i].id
      object.label = path[i].spotName
      object.img = path[i].image[0]
      object.fromDay = path[i].fromDayOfWeek
      object.toDay = path[i].toDayOfWeek
      object.fromTime = path[i].fromTime
      object.toTime = path[i].toTime
      object.driving_time = durationMatrix[pathIndex[i]][pathIndex[i+1]]
      output[i] = object
    }
    return output
  };

  function getFastestPath (){
    bdm.getDistanceMatrix(options)
      .then(data => {   
        pathIndex = bdm.computeFastestRoute()
        path = new Array(pathIndex.length)
        for (let l = 0; l<pathIndex.length; l++){
          path[l] = placeList[pathIndex[l]]
        }
        durationMatrix = bdm.getDurationMatrix()
        setData(initialData)
        setAPIran(true)
    })
      .catch(error => {
        console.log('api fetch fault')
        console.log(error)})
    };

  
  // to add bookmark or remove bookmark
  const addTripList = async () => {
    await addNewTripList(data,tripName,startDateString,endDateString)
    class Item{
      tripName = ""
      tripPhoto = ""
      tripStartDate = ""
      tripEndDate = ""
    }

    const item = new Item()
    item.tripName = tripName
    item.tripPhoto = data[0].img
    item.tripStartDate = startDateString
    item.tripEndDate = endDateString
    navigation.navigate("HomeScreen")
  }

  const renderItem = ({ item, drag, isActive }) => {

    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          onPress={() => navigation.navigate('PlaceDisplay', { placeID: item.id })}
          disabled={isActive}
          style={[
            styles.rowItem,
            { backgroundColor: isActive ? "red" : 'rgb(200, 247, 197)' }]}
        >
          <View style={{ flexDirection:'column'}}>   
              {/* the place row*/}
              <View style={[styles.placeInfo,{ flexDirection: 'row', flex:1}]}>
                <Image source = {item.img} style= {{width:HEIGHT/10.5, height:HEIGHT/10.5, borderRadius:10,left:10,top:10}}/>
                {/* the details*/}
                <View style={{ flexDirection: 'column',top:10, left:15, height:0.2*WIDTH, width: WIDTH/1.8}}>
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
                        <Text style ={{fontWeight:'bold'}}> Operating Day  : </Text>
                        <Text>{item.fromDay == item.toDay?" Daily":item.fromDay+" - "+item.toDay}</Text>
                      </View>

                     {/* Operating Time */}
                      <View style={{ flexDirection: 'row'}}>
                        <Text style ={{fontWeight:'bold'}}> Operating Time: </Text>
                        <Text>{item.fromTime} - {item.toTime}</Text>
                      </View>
                    </View>
                  </View>

                </View>
              </View> 
              
     
              {/* the driving row*/}
              {!(item.key.charAt((item.key).length - 1) == String(destinationList.length-1))
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
    </ScaleDecorator>
    );
  };

  const onChangeStartDate = (event, selectedDate) => {
    const currentDate = selectedDate || StartDate;
    setShow(Platform.OS === 'ios');
    setStartDate(currentDate);
  };

  const onChangeEndDate = (event, selectedDate2) => {
    const currentDate2 = selectedDate2 || EndDate;
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
 
  // edit trip duration/ trip name
  const editTripDetails = () => {
      return (
          <View style={{ justifyContent:'center',alignItems:'center'}}>

              {/* row calendar and name */}
              <View style={{flexDirection:'column'}}>
                  <Text style={styles.popUpFieldTitle}>Trip Duration</Text>

                  {/* date boxes in row*/}
                  <View style={{flexDirection:'row',top:10}}>

                      {/* from box */}
                      <View style={{flexDirection:'row'}}>
                          <Text> From  </Text>
                          <TouchableOpacity onPress={showDatepicker}>
                              <View style={[styles.modal,{flexDirection:'row'}]}>
                                  {StartDate
                                      ?<Text style={styles.popUpFieldInput}>{format(StartDate,'E, MMM d, yy').toString()}</Text>
                                      :null}
                                  {showStart && (
                                      <DateTimePicker testID="startDatePicker" 
                                                  value={StartDate} 
                                                  mode={mode} 
                                                  display="calendar" 
                                                  is24Hour={true} 
                                                  onChange={onChangeStartDate} 
                                                  minimumDate={new Date()} 
                                                  style={{backgroundColor: '#0782F9'}}
                                      />)
                                  }
                              </View>
                          </TouchableOpacity>
                      </View>
            
                      {/* to+box */}
                      <View style={{flexDirection:'row'}}>
                          <Text>  To  </Text>
                          <TouchableOpacity onPress={showDatepicker2}>
                              <View style={[styles.modal,{flexDirection:'row'}]}>
                                  {EndDate
                                      ?<Text style={styles.popUpFieldInput}>{format(EndDate,'E, MMM d, yy').toString()}</Text>
                                      :null}
                                  {showEnd && (
                                      <DateTimePicker testID="endDatePicker" 
                                              value={EndDate} 
                                              mode={mode} 
                                              display="calendar" 
                                              is24Hour={true} 
                                              onChange={onChangeEndDate} 
                                              minimumDate={StartDate} 
                                              style={{backgroundColor: '#0782F9'}}
                                      />
                                  )}
                              </View>
                          </TouchableOpacity>
                      </View>

                  </View>

                  <View style={{padding:WIDTH*0.06}}/>
                  <Text style={styles.popUpFieldTitle}>Trip Name</Text>
                  <KeyboardAvoidingView>
                      <TextInput placeholder="TripName" 
                              value={tripName} 
                              onChangeText={text => setTripName(text)} 
                              style={[styles.modal,{padding:WIDTH*0.03,flexDirection:'row',top:10, width: WIDTH*0.9}]}/>
                  </KeyboardAvoidingView>
                  <View style={{padding:WIDTH*0.05}}/>   
              </View>
          </View>
      );
  };

  const [visible, setVisible] = useState(false);

  const toggleOverlay = () => {
      setVisible(!visible);
  };

  const toggleOverlay2 = () => {
      (StartDate>EndDate)
          ?alert("Trip ending date cannot be smaller than the trip starting date.")
          :(
              setVisible(!visible),
              setStartDateString(format(StartDate,'E, MMM d, yy').toString()),
              setEndDateString(format(EndDate,'E, MMM d, yy').toString())
          )
  };

  const renderRoute =() => {

    return(
      <View>
        {/**onDragEnd={({ data }) => setData(data)} */}
        <DraggableFlatList
          data={data}
          onDragEnd={({ data }) => setDraggedData(data)}
          keyExtractor={(item) => "_" + item.key}
          renderItem={renderItem}
          contentContainerStyle={{
            paddingTop:0.19*HEIGHT,
            paddingBottom: 0.1*HEIGHT,
            alignItems:'center',
            justifyContent:'center',
          }}
        />
      
        {/*header*/}
        <View style={{position:'absolute', alignSelf:'flex-end'}}>
          <ImageBackground source = {data[0].img} style= {{width: WIDTH, height:0.15*HEIGHT}}>
          <View style = {styles.overlay}>
            <View style={{flexDirection: 'row', flex:1}}>
              <View style={{flexDirection: 'row', flex:1}}>
                {/* return icon*/}
                <TouchableOpacity onPress={()=>navigation.goBack()}>
                  <Icons name="arrowleft" size={WIDTH*0.08} color='white' style={{top:HEIGHT*0.055}}/>
                </TouchableOpacity>
                {/* Trip Details*/}
                <View style={{ flexDirection: 'column',top:HEIGHT*0.045, left:20, height:0.2*WIDTH}}>
                  <View style={{ flexDirection: 'row'}}>
                    <Text style={{fontWeight:'bold', fontSize:HEIGHT*0.018, color:'white'}}>{startDateString}</Text>
                    <Text style={{fontSize:HEIGHT*0.018}}>{"  "}</Text>
                    <Icons3 name="dash" size={HEIGHT*0.027} color='white'/>
                    <Text style={{fontSize:HEIGHT*0.018}}>{"  "}</Text>
                    <Text style={{fontWeight:'bold', fontSize:HEIGHT*0.018, color:'white'}}>{endDateString}</Text>
                  </View>
                  <View style={{width: WIDTH*0.7}}>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={{fontWeight:'bold', fontSize:HEIGHT*0.035 ,color:'white'}}>{tripName}</Text>
                  </View>
                </View>
              </View>
              {/* Options*/}
              <TouchableOpacity style={{right:WIDTH*0.05,top:HEIGHT*0.055}} onPress={toggleOverlay}>
                <Icons4 name="edit" size={WIDTH*0.07} color='white'/>
              </TouchableOpacity>

              {/* Pop up screen for edit trip details*/}
              <Overlay isVisible={visible}>
                {editTripDetails()}
                <TouchableOpacity onPress={toggleOverlay2}>
                  <Text style={{fontSize:WIDTH*0.045,color:'blue',alignSelf:"flex-end"}}> Done </Text>
                </TouchableOpacity>
              </Overlay>

            </View>
          </View>
        </ImageBackground>
        <View style={{flex:1,flexDirection: 'row', flexWrap: 'wrap',justifyContent: 'space-between',backgroundColor:'#F5F5F5', height:0.12*WIDTH}}>
          {/*<TouchableOpacity onPress={()=> console.log(bdm.getDistanceMatrix())}>
              <View style={{ left:17, width: WIDTH*0.2, height: WIDTH*0.08, borderRadius:10,top:6,backgroundColor: "#E3242B",elevation:5}}>
                <Text style={{fontSize:HEIGHT*0.023,fontWeight:'bold',color:'white',left:10}}>RESET</Text>
              </View>
          </TouchableOpacity>*/}

          <Text style={{fontWeight:'bold', fontSize:HEIGHT*0.023, color:'#38761D', height:0.2*WIDTH,marginTop:6}}>    Itinerary</Text>
          
          <TouchableOpacity onPress={addTripList}>
              <View style={{ right:10,width: WIDTH*0.2, height: WIDTH*0.08, borderRadius:10,top:6,backgroundColor: "green",elevation:5}}>
                <Text style={{fontSize:HEIGHT*0.023,fontWeight:'bold',color:'white',left:14}}>SAVE</Text>
              </View>
          </TouchableOpacity>

        </View>

      </View>
    </View>
    )
  }
  
  return (
    <SafeAreaView style={styles.container}>
        {APIran?renderRoute():<ActivityIndicator size={WIDTH/5} color="#0000ff" style={{alignItems:'center',justifyContent: "center", top: HEIGHT/3}}/>}
    </SafeAreaView>
  );// end of return 

}// end of class
    

const styles = StyleSheet.create({
  container: {
    flex:1,
    backgroundColor: 'rgb(200, 247, 197)',
  },
  rowItem: {
    top:0.05*HEIGHT,
    height: HEIGHT/4.8,
    width: WIDTH*0.9,
    margin:2,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  modal:{
    height: 0.055*HEIGHT,
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
  popUpFieldTitle:{
    fontWeight:'bold',
    fontSize:WIDTH*0.05, 
    padding:WIDTH*0.03,
    backgroundColor:'rgb(200, 247, 197)'
  },
  popUpFieldInput: {
    fontWeight:'bold',
    left:3,
    top:3
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
    height:0.15*HEIGHT,
    backgroundColor: 'rgba(0,0,0,0.4)',
    left:0
},

});

export {BestRoute};