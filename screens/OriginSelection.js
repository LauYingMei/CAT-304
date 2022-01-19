import React,{ useState }  from "react";
import { 
  route, 
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
  ImageBackground 
} from "react-native";
import moment from "moment";
import Icons from 'react-native-vector-icons/AntDesign';
import BookmarkedPlace from "../screens/BookmarkedPlace";
import { LogBox } from 'react-native';
moment.locale("en");

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);
import { useNavigation } from '@react-navigation/core'

const HEIGHT = Dimensions.get("screen").height;
const WIDTH = Dimensions.get("screen").width;

const OriginSelection = ({ route, navigation }) => {

  let selectedPlaceList = route.params.chosenPlacesList;
  let tripStartDate = route.params.tripStart;
  let tripEndDate = route.params.tripEnd;
  let TripName = route.params.tripname;

  const [selectedPlace, setSelectedPlace] = useState(selectedPlaceList)
  const [origin, setOrigin] = React.useState([])

  const select_origin = (placePressed) => {
    if(origin.includes(placePressed)){
      return setOrigin([])
    }
    if(!origin.length){
      setOrigin([...origin,placePressed]);
    }
  };

  const getSelected = (placePressed) =>origin.includes(placePressed);

  function selectOrigin (){
    const renderSelectedPlaces = ({item}) => 
    (
      <BookmarkedPlace
        selected={ getSelected(item)}
        onPress={() => select_origin(item)} 
        item={item} 
      />              
    )          
        
    return (
      <FlatList
        key={'_'}
        data={selectedPlace}
        keyExtractor={item => "_" + `${item.id}`}
        renderItem={renderSelectedPlaces}
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

  return (
    <SafeAreaView style={styles.container}>
      <View style={{marginBottom:10}}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          {/* return icon*/}
          <Icons name="arrowleft" size={WIDTH*0.08} color='rgb(0,0,0)' style={{top: 0.05*HEIGHT}}/>
        </TouchableOpacity>
        <Text style={styles.header}>   Select 1 origin: </Text>
        </View>
          {selectOrigin()}

          {/*right circle icon*/} 
          <TouchableOpacity
            style={styles.rightCircle}
            onPress = {()=>navigation.navigate("BestRoute",{originSelected: origin, placesList: selectedPlace, startDate:tripStartDate, endDate:tripEndDate,tripname:TripName})}
          >
            {origin.length
            ?<Icons name="checkcircle" size={WIDTH*0.15} color='#38761D' />
            :null}
          </TouchableOpacity>
        </SafeAreaView>
    )// end of return 
  
    
}// end of class
    

const styles = StyleSheet.create({
  container: {
    top:25,
    flex:1,
    backgroundColor: 'rgb(200, 247, 197)',
  },
  header: {
    fontSize:HEIGHT/40,
    fontWeight:'bold', 
    left:WIDTH/15, 
    top:HEIGHT/80
  },
  rightCircle:{
    position:'absolute',
    bottom:35,
    right:20, 
    alignSelf:'flex-end'
  },
});


export {OriginSelection};

