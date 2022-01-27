import React, {useState, useEffect}  from 'react'
import { Dimensions, Image,StyleSheet, View, Text, TouchableOpacity, FlatList, BackHandler} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { MaterialCommunityIcons} from '@expo/vector-icons/';
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase';
import Rating from '../screens/Rating';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
  
//Display filter
const Filter = ()  => {
    const category = ['All','Farm', 'Park', 'Forest', 'Mountain', 'Other']
    const rating = ['All',1,2,3,4,5]
    const state = ['All', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Wp Kuala Lumpur', 'Wp Labuan', 'Wp Putrajaya']
    const [categoryTabChosen, setCategoryTabChosen] = useState('All')
    const [ratingTabChosen, setRatingTabChosen] = useState('All')
    const [stateTabChosen, setStateTabChosen] = useState('All')
    const [place, setPlaces] = useState([]); 
    const [showFilterModal, setShowFilterModal] = useState(false)
    const [dataExist, setDataExist] = useState(false)
    const [filterCount, setFilterCount] = useState(0)
    const navigation = useNavigation();

    useEffect(() => {
        FetchData()

        // control physical back button
        const backAction = () => {
            navigation.navigate("HomeScreen")
            return true;
        };

        const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
        );

        return () => backHandler.remove();
    }, [])

    //Fetch data after filter is applied
    const FetchData = () => {
        setDataExist(false); 

        //Category, Rating and State are chosen
        if(categoryTabChosen != "All" && ratingTabChosen != "All" && stateTabChosen != "All"){
            setFilterCount(3);
            var docRef = db.collection('Place').where("category", "==", categoryTabChosen).where("state", "==", stateTabChosen);
        }

        //Category and Rating are chosen
        else if(categoryTabChosen != "All" && ratingTabChosen != "All"){
            setFilterCount(2);
            var docRef = db.collection('Place').where("category", "==",categoryTabChosen);
        }

        //Category and State are chosen
        else if(categoryTabChosen != "All" && ratingTabChosen != "All"){
            setFilterCount(2);
            var docRef = db.collection('Place').where("category", "==",categoryTabChosen);
        }

        //Rating and State are chosen
        else if(ratingTabChosen != "All" && stateTabChosen != "All"){
            setFilterCount(2);
            var docRef = db.collection('Place').where("rating", ">=",ratingTabChosen);
        }

        //Only Category is chosen
        else if(categoryTabChosen != "All"){
            setFilterCount(1);
            var docRef = db.collection('Place').where("category", "==", categoryTabChosen);
        }

        //Only Rating is chosen
        else if(ratingTabChosen != "All"){
            setFilterCount(1);
            var docRef = db.collection('Place').where("rating", ">=", ratingTabChosen);
        }

        //Only State is chosen
        else if(stateTabChosen != "All"){
            setFilterCount(1);
            var docRef = db.collection('Place').where("state", "==", stateTabChosen);
        }

        //No filter applied
        else{
            setFilterCount(0);
            var docRef = db.collection('Place').orderBy("rating", "desc");
        }
        
        docRef.get().then((querySnapshot) => {
            const place = [];
            
            if(categoryTabChosen != "All" && ratingTabChosen != "All"){
                querySnapshot.forEach((doc) => {
                    if(doc.data()["rating"] >= ratingTabChosen){
                        console.log(doc.data()["spotName"], " => ", doc.data()["category"], ",", doc.data()["rating"]);
                        place.push({
                        ...doc.data(),
                        id: doc.id,
                        });
                        setDataExist(true);
                    }                  
                });
                setPlaces(place);
            }
            else if(categoryTabChosen != "All" && stateTabChosen != "All"){
                querySnapshot.forEach((doc) => {
                    if(doc.data()["state"] == stateTabChosen){
                        console.log(doc.data()["spotName"], " => ", doc.data()["category"], ",", doc.data()["state"]);
                        place.push({
                        ...doc.data(),
                        id: doc.id,
                        });
                        setDataExist(true);
                    }                  
                });
                setPlaces(place);
            }
            else if(ratingTabChosen != "All" && stateTabChosen != "All"){
                querySnapshot.forEach((doc) => {
                    if(doc.data()["state"] == stateTabChosen){
                        console.log(doc.data()["spotName"], " => ", doc.data()["rating"], ",", doc.data()["state"]);
                        place.push({
                        ...doc.data(),
                        id: doc.id,
                        });
                        setDataExist(true);
                    }                  
                });
                setPlaces(place);
            }
            else if(categoryTabChosen != "All" && ratingTabChosen != "All" && stateTabChosen != "All"){
                querySnapshot.forEach((doc) => {
                    if(doc.data()["rating"] >= ratingTabChosen){
                        console.log(doc.data()["spotName"], " => ", doc.data()["category"], ",", doc.data()["rating"], ",", doc.data()["state"]);
                        place.push({
                        ...doc.data(),
                        id: doc.id,
                        });
                        setDataExist(true);
                    }                  
                });
                setPlaces(place);
            }
            else{
                querySnapshot.forEach((doc) => {
                    console.log(doc.data()["spotName"], " => ", doc.data()["category"], ",", doc.data()["rating"], ",", doc.data()["state"]);
                    place.push({
                        ...doc.data(),
                        id: doc.id,
                    });  
                    setDataExist(true);               
                });
                setPlaces(place);
            }
        })
        .catch((error) => {
            console.log("Error getting category list: ", error);
        });
    }
    
    //Filter category
    const FilterTextCategory = ({category}) => {       
        return (
          <TouchableOpacity 
          style={styles.filterTextContainer}
           onPress={() => { setCategoryTabChosen(category)
           }}>
            <Text 
             style={categoryTabChosen == category ? styles.filterTextFocus : styles.filterTextDefault}
             >
                {category}
            </Text>
         </TouchableOpacity >
        );
    };

    //Filter rating
    const FilterTextRating = ({rating}) => {       
        return (
          <TouchableOpacity 
          style={styles.filterTextContainer}
           onPress={() => { setRatingTabChosen(rating)
           }}>
            <Text 
             style={ratingTabChosen == rating ? styles.filterTextFocus : styles.filterTextDefault}
             >
                {(rating == 5 || rating == "All") ? rating : (rating+"+")}
            </Text>
         </TouchableOpacity >
        );
      };

    //Filter state
    const FilterTextState = ({state}) => {       
        return (
          <TouchableOpacity 
          style={styles.filterTextContainer}
           onPress={() => { setStateTabChosen(state)
           }}>
            <Text 
             style={stateTabChosen == state ? styles.filterTextFocus : styles.filterTextDefault}
             >
                {state}
            </Text>
         </TouchableOpacity >
        );
      };

    //Display place image with name
    const Card = ({place}) => {
        const navigation = useNavigation()
    
        return (
        <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate('PlaceDisplay',{placeID: place.id})}
        >
            <Image style = {styles.cardImage} source = {{uri: place.image[0].uri}}></Image>  
            <Text style={styles.cardText}>{place.spotName}</Text>
            {Rating(place.rating)}
            
        </TouchableOpacity>
        );
    };

    const FilterModal = () => {
        return(
            <View style={styles.FilterModal}>
                {/* Category Filter */}
                <Text style={styles.title}>Category</Text>
                <View style={{width: "97%", flexDirection: "row", flexWrap: "wrap"}}>
                    {category.map((item, index) => (<FilterTextCategory key={index} category = {item}/>))}
                </View>  

                {/* Rating Filter */}
                <Text style={styles.title}>Rating</Text>
                <View style={{width: "97%", flexDirection: "row", flexWrap: "wrap"}}>
                    {rating.map((item, index) => (<FilterTextRating key={index} rating = {item}/>))}
                </View> 
                
                {/* State Filter */}
                <Text style={styles.title}>State</Text>
                <View style={{width: "97%", flexDirection: "row", flexWrap: "wrap"}}>
                    {state.map((item, index) => (<FilterTextState key={index} state = {item}/>))}
                </View> 

                {/*Apply Filter Button */}
                <TouchableOpacity 
                onPress = {() => {FetchData(), setShowFilterModal(false)}} >
                    <Text style = {styles.applyFilterButton}>Apply Filter</Text>  
                </TouchableOpacity>
            </View>
        )
    }
    

    return (
        <SafeAreaView style={{height: windowHeight, width: windowWidth, backgroundColor:'rgb(200,247,197)'}}>
            <View style={{flexDirection: 'row', marginTop: "3%"}}>
                <TouchableOpacity 
                    onPress={() => navigation.goBack()} 
                    style={{marginLeft: "1%"}}
                    >
                    <MaterialCommunityIcons name="arrow-left" size={30} color='black' />
                </TouchableOpacity>

                <Text style={styles.filterTitle}>Filter</Text>
                
                <TouchableOpacity
                    onPress={() => 
                        {showFilterModal?setShowFilterModal(false): setShowFilterModal(true)}}
                >
                    <MaterialCommunityIcons 
                        style={{marginLeft: "75%"}}
                        name='tune' 
                        size={30} 
                        color='#38761D' 
                    />
                </TouchableOpacity>
            </View>

            {showFilterModal===true && FilterModal()}
            
            {/* Display relavent content */}
            <View style = {styles.filterCount}>
            {filterCount == 0 && <Text>No filter applied</Text>}
            {filterCount == 1 && <Text>1 filter is applied</Text>}
            {filterCount == 2 && <Text>2 filters are applied</Text>}
            {filterCount == 3 && <Text>3 filters are applied</Text>}
            </View>

            {/* Display relavent content */}
            {dataExist == false && filterCount != 0?
            <View marginTop="30%" alignItems="center">
                 <Image source={require('./../assets/image/SearchFail.png')} style={styles.image}/>
            </View>:
            <View style={{marginBottom: '25%', marginTop: '3%'}}>
                <FlatList 
                    vertical
                    keyExtractor={item => item.id}
                    data = {place}
                    renderItem = {({item}) => <Card place = {item} />}
                    style={styles.container}
                    numColumns={(2)}
                    columnWrapperStyle={{flex: 1}}      
                    />     
            </View>
            }
        </SafeAreaView>
    );
};

//Style
const styles = StyleSheet.create({
    filterTitle:{
        fontSize: 25, 
        fontWeight: '600', 
        marginLeft: "3%",
    },
    title:{
        marginTop: '3%',
        marginLeft:'1%',
        fontWeight: 'bold', 
        fontSize: 20,
        width: '25%',
    },
    filterTextContainer:{
        padding: 3,
    },
    filterTextDefault:{
        fontSize: 17,
        textAlign: 'center',
        borderRadius: 10,
        backgroundColor: 'white',
        padding: 5,
    },
    filterTextFocus:{
        fontSize: 17,
        borderWidth: 3,
        textAlign: 'center',
        borderRadius: 10,
        borderColor: 'green',
        backgroundColor: 'white',
        padding: 5,
    },
    card:{
        marginTop: "2%",
        marginLeft: "3%",
        marginBottom: "2%",
        padding: 5,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: 'white',
        width: windowWidth*0.45,
        elevation: 10,
      },
      cardText:{
        fontWeight: '500', 
        fontSize: 17, 
        padding:'5%', 
        marginBottom: '3%',
        textAlign: 'center',
        textTransform: 'capitalize',
      },
      cardImage:{
        width: '100%',
        height: undefined,
        aspectRatio: 1.5,
        borderRadius: 15,
        alignSelf: 'center',
      },
      applyFilterButton:{
        fontSize: 17,
        borderWidth: 3,
        textAlign: 'center',
        borderColor: 'green',
        backgroundColor: '#38761D',
        width: '30%',
        padding: 5,
        color: 'white',
        fontWeight: 'bold',
        marginLeft: "65%",
        marginBottom: '2%',
        marginTop: '4%',
        borderRadius: 10,
      },
      FilterModal:{
        marginTop: '3%',
        width: "93%",
        marginLeft: "3%",
        backgroundColor: '#f5f5f5',
        borderRadius: 20,
        paddingLeft: 10,
        paddingTop: 5,
        paddingBottom: 10,
      },
      filterCount: {
        backgroundColor: '#fff0f5',
        marginLeft: '3%',
        marginRight: '4%',
        marginTop: '3%',
        padding: 5,
        borderRadius: 10,
      },
      image: {
          height: "70%",
          width: "60%",
          resizeMode: 'stretch'
      }
});
  

export default Filter;