import React, {useState, useEffect}  from 'react'
import { Dimensions, Image,StyleSheet, View, Text, TouchableOpacity, FlatList} from 'react-native';
import { useNavigation } from '@react-navigation/native'
import { SafeAreaView } from 'react-native-safe-area-context';
import { db } from '../firebase';
import Header from '../screens/Header';
import Footer from '../screens/Footer';
import Rating from '../screens/Rating';

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;
  
//Display filter
const Filter = ()  => {
    const category = ['All','Farm', 'Park', 'Forest', 'Mountain', 'Other']
    const rating = ['All',1,2,3,4,5]
    //const state = ['All', 'Johor', 'Kedah', 'Kelantan', 'Melaka', 'Negeri Sembilan', 'Pahang', 'Penang', 'Perak', 'Perlis', 'Sabah', 'Sarawak', 'Selangor', 'Terengganu', 'Wp Kuala Lumpur', 'Wp Labuan', 'Wp Putrajaya']
    const [categoryTabChosen, setCategoryTabChosen] = useState('All')
    const [ratingTabChosen, setRatingTabChosen] = useState('All')
    const [place, setPlaces] = useState([]); 

    //Fetch data after filter is applied
    const FetchData = () => {
        if(categoryTabChosen == "All" && ratingTabChosen == "All"){
            var docRef = db.collection('Place').orderBy("rating", "desc");
        }
        else if(ratingTabChosen == "All"){
            var docRef = db.collection('Place').where("category", "==", categoryTabChosen);
        }
        else if(categoryTabChosen == "All"){
            var docRef = db.collection('Place').where("rating", ">=", ratingTabChosen);
        }
        else if(categoryTabChosen != "All" && ratingTabChosen != "All"){
            var docRef = db.collection('Place').where("category", "==",categoryTabChosen);
        }
        
        docRef.get().then((querySnapshot) => {
            const place = [];
            
            if(categoryTabChosen != "All" && ratingTabChosen != "All"){
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data()["spotName"], " => ", doc.data()["category"]);
                    if(doc.data()["rating"] >= ratingTabChosen){
                        place.push({
                        ...doc.data(),
                        id: doc.id,
                        });
                    }                  
                });
                setPlaces(place);
            }
            else{
                querySnapshot.forEach((doc) => {
                    console.log(doc.id, " => ", doc.data()["spotName"], " => ", doc.data()["category"]);
                        place.push({
                            ...doc.data(),
                            id: doc.id,
                        });                 
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
           //alert("categoryTabChosen: "+ categoryTabChosen + "category: "+ category )
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

    //Display place image with name
    const Card = ({place}) => {
        const navigation = useNavigation()
    
        return (
        <TouchableOpacity style={styles.card}
        onPress={() => navigation.navigate('PlaceDisplay',{placeID: place.id})}
        >
            <Image style = {styles.image} source = {{uri: place.image[0].uri}}></Image>  
            <Text style={{fontWeight: '500', fontSize: 20, padding:'5%'}}>{place.spotName}</Text>
            {Rating(place.rating)}
            
        </TouchableOpacity>
        );
    };
    

    return (
        <SafeAreaView style={{height: windowHeight, backgroundColor:'white'}}>
            {Header()}

            {/* Category Filter */}
            <View style = {styles.filterContainer}>
                <Text style={styles.title}>Category</Text>
                <FlatList 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.index}
                    data = {category}
                    renderItem = {({item}) => <FilterTextCategory category = {item} />}
                    />  
            </View>

             {/* Rating Filter */}
            <View style = {styles.filterContainer}>
                <Text style={styles.title}>Rating</Text>
                <FlatList 
                    horizontal 
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={item => item.index}
                    data = {rating}
                    renderItem = {({item}) => <FilterTextRating rating = {item} />}
                    />  
            </View>

            {/*Apply Filter Button */}
            <TouchableOpacity 
            onPress = {() => { {FetchData()}}} >
                <Text style = {styles.applyFilterButton}>Apply Filter</Text>  
            </TouchableOpacity>

             {/*Fetch all data for initial state */}
            {useEffect(() => {FetchData()},[])}
            
             {/* Display relavent content */}
            <View style={{height: '57%', marginTop: '3%'}}>
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

            {Footer()}
        </SafeAreaView>
    );
};

//Style
const styles = StyleSheet.create({
    filterContainer:{
        backgroundColor: 'white',
        flexDirection: 'row',
        height: '6%',
        alignItems: 'center'
    },
    title:{
        marginLeft:'1%',
        fontWeight: 'bold', 
        fontSize: 20,
        width: '25%',
    },
    filterTextContainer:{
        width: windowWidth*0.25,
        padding: 3,
    },
    filterTextDefault:{
        fontSize: 17,
        borderWidth: 1,
        textAlign: 'center',
        borderRadius: 10,
        borderColor: 'black',
    },
    filterTextFocus:{
        fontSize: 17,
        borderWidth: 3,
        textAlign: 'center',
        borderRadius: 10,
        borderColor: 'green',
    },
    card:{
        marginTop: 5,
        marginRight: 10,
        padding: 5,
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#f0f8ff',
        width: windowWidth*0.48,
        elevation: 10,
      },
      image:{
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
        padding: 10,
        color: 'white',
        fontWeight: 'bold',
      }
});
  

export default Filter;