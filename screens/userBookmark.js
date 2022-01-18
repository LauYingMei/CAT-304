import React, {useState, useEffect} from 'react'
import { Alert, BackHandler,FlatList, SafeAreaView, ScrollView, StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions} from 'react-native';
import { db,auth } from '../firebase'
import { useNavigation } from '@react-navigation/native'
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { DeleteBookmark,clearBookmark} from '../actions/userAction';
import RoundIconBtn from './RoundIconBtn';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const userBookmark = () => {
  
  const [bookmark, setBookmark] = useState([]);
  const userID = auth.currentUser?.uid;
  const navigation = useNavigation()

//Display events with details
const Bookmark = ({ bookmark }) => {

  return (
    <TouchableOpacity
      style={styles.OuterContainer}
      onPress={() => navigation.navigate('PlaceDisplay', { placeID: bookmark.placeID })}
      onLongPress={()=>{DeleteBookmarkAction(bookmark)}}
    >
      <Text style={styles.subtitle}>{bookmark.placeName}</Text>
    </TouchableOpacity>
  );
};
    //Fetch data for bookmark
    const FetchBookmark= async () => {
      await db.collection("users").doc(userID).collection("bookmarks")
      
      .get().then((querySnapshot) => {
        const bookmark = [];
  
        querySnapshot.forEach((doc) => {
          console.log(doc.id, " => ", doc.data()["placeName"]);
          bookmark.push({
            ...doc.data(),
            id: doc.id,
          });
        });
        setBookmark(bookmark);
      })
        .catch((error) => {
          console.log("Error getting events: ", error);
        });
    };
 // to go back to previous page
 const goBack = () => {
  navigation.replace("userProfile")   
}
 // to delete particular bookmark
 const DeleteBookmarkAction = (bookmark) => {
  Alert.alert("Delete Bookmark", "Are You Sure?", [
      {
          text: "Yes",
          onPress: () => (
              DeleteBookmark(userID, bookmark.placeID),
              FetchBookmark()
          )
      },
      {
          text: "no",
      },
  ]);
}
 // to clear bookmark
 const ClearBookmarkAction = (userID) => {
  Alert.alert("Clear All Bookmark", "Are You Sure?", [
      {
          text: "Yes",
          onPress: () => (
              clearBookmark(userID),
              FetchBookmark()
          )
      },
      {
          text: "no",
      },
  ]);
}
return (
   <SafeAreaView backgroundColor='#a2e0dc' height='100%' width='100%'>
      <StatusBar translucent backgroundColor="rgba(0,0,0,0.1)" />
      <View style={styles.header}>
        <TouchableOpacity onPress={goBack}>
        <Icon name="chevron-left" size={30} color='white' style={styles.icons}/>
        </TouchableOpacity>
        <Text style={styles.title}>
             My Bookmarked Places
         </Text>
        
         <TouchableOpacity
          style={styles.buttonSubmit}
          onPress={()=>navigation.navigate('HomeScreen')}
          >
            <Icon name="home" size={30} color='#10533f'/>
           </TouchableOpacity>
      </View>  
      <Text style={styles.note}>
          #Press to link to the place
      </Text>
      <Text style={styles.note}>
      #Press longer to delete the bookmark
      </Text>
      <RoundIconBtn
        onPress={() => {ClearBookmarkAction(userID)}}
        antIconName='delete'
        style={styles.delBtn}
      />
    {/*Content*/}
    <ScrollView vertical showsVerticalScrollIndicator={true} marginLeft="10%" marginBottom="3%">
    
      {/* Get bookmarks from database*/}
      {useEffect(() => { FetchBookmark()
        const backAction = () => {
            navigation.replace("userProfile")
            return true;
            };

            const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction);

            return () => backHandler.remove();
             }, [])}

      {/*Display bookmarked places*/}  
      {bookmark == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)', fontSize: 20, marginLeft: '3%' }}>**No Bookmark**</Text> :
        <FlatList
          vertical
          showsVerticalScrollIndicator={false}
          keyExtractor={item => item.id.toString()}
          data={bookmark}
          renderItem={({ item }) => <Bookmark bookmark={item} />}
        />
    }
    
    </ScrollView>
  </SafeAreaView>

);
}
//Style
const styles = StyleSheet.create({
    OuterContainer: {
    backgroundColor: '#76905f',
    paddingHorizontal: 10,
    paddingBottom: 5,
    borderRadius: 10,
    marginTop: windowHeight*.05,
    marginBottom: windowHeight*.02,
    width: windowWidth * 0.83,
    marginRight: 10,
  },
  
  subtitle: {
    fontWeight: 'bold',
    color: 'rgba(11, 61, 42, 1)',
    marginTop: 15,
    width: "80%",
    fontSize: 20,
    textAlign: 'center',
    marginBottom: '3%',
  },
  title:{
    marginTop:'3%',
    marginLeft:'3%',
    fontWeight: 'bold', 
    fontSize: 25,
    color:'white',
  },

  header: {
    marginBottom: windowHeight*.05,
    marginTop: 30,
    paddingLeft:0,
    padding: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    alignContent: 'center',
    backgroundColor:"#10533f",
    width:windowWidth,
},
buttonSubmit: {
    backgroundColor: '#9cd741',
    width: '20%',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
},
icons:{
  marginBottom: '20%',
  marginTop: '90%',
},
note:{
    marginLeft:windowWidth*.02,
    fontWeight: 'bold', 
    fontSize: 20,
    color:'red',
},
delBtn: {
  position: 'absolute',
  right: windowWidth*.03,
  top: windowHeight*.18,
},
});

export default userBookmark;