import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/AntDesign';
import Iconss from 'react-native-vector-icons/Ionicons';
import * as MalaysiaPostcodes from 'malaysia-postcodes';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { addNewPlace, updatePlace, deletePlace } from '../actions/placeAction'
import { auth, db, storage } from '../firebase'
import { v4 as uuid4 } from 'uuid'
import * as firebase from 'firebase';
import 'react-native-get-random-values'
import { useNavigation, useRoute } from '@react-navigation/native'
import * as Location from 'expo-location';

import {
    Alert,
    FlatList,
    ImageBackground,
    SafeAreaView,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    TextInput,
    ScrollView,
    Switch,
    Platform,
    StatusBar,
    ActionSheetIOS,
    Linking
} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Place = () => {
    const [spotName, setSpotName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [fromDayOfWeek, setFromDayOfWeek] = useState('')
    const [toDayOfWeek, setToDayOfWeek] = useState('')
    const [fromTime, setFromTime] = useState(new Date())
    const [fromTimeToShow, setFromTimeToShow] = useState(new Date())
    const [toTime, setToTime] = useState(new Date())
    const [toTimeToShow, setToTimeToShow] = useState(new Date())
    const [showFTime, setShowFTime] = useState(false)
    const [showTTime, setShowTTime] = useState(false)
    const [entranceFee, setEntranceFee] = useState('')
    const [isCharged, setCharged] = useState(true)
    const [addressLine1, setAddressLine1] = useState('')
    const [addressLine2, setAddressLine2] = useState('')
    const [city, setCity] = useState('')
    const [postcode, setPostcode] = useState('')
    const [state, setState] = useState('')
    const [details, setDetails] = useState('')
    const [image, setImage] = useState('')
    const [fromTimeIsSet, setFromTimeIsSet] = useState(false)
    const [toTimeIsSet, setToTimeIsSet] = useState(false)
    const [progress, setProgress] = useState(100)
    const [locationPermised, setLocationPermission] = useState(false)
    const [latitude, setLatitude] = useState('')
    const [longitude, setLongitude] = useState('')
    const [editable, setEditable] = useState(false)

    const category = ['Farm', 'Park', 'Forest', 'Mountain', 'Other']
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const fromTimeText = fromTimeIsSet ? fromTime : '-From-';
    const toTimeText = toTimeIsSet ? toTime : '-To-';

    const navigation = useNavigation()
    const route = useRoute();
    const userID = auth.currentUser?.uid;
    var placeID = route.params.placeID;

    useEffect(() => {
        if (placeID.trim())
            getPlace()
    }, [placeID])


    // to get location permission in Android
    const getLocationPermission = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();
            if (status == "granted") {
                // get user's coordinate (latitude and longitude)
                setLocationPermission(true)
                const coordinate = await Location.getCurrentPositionAsync({})
                
                setLatitude(JSON.stringify(coordinate.coords.latitude))
                setLongitude(JSON.stringify(coordinate.coords.longitude))
                console.log('(', latitude, ',', longitude,')')
            }
            else {
                Alert.alert("Location Permission denied", "To continue, please provide the required permission from settings.", [
                    {
                        text: "Settings",
                        onPress: async () => (
                            Platform.OS=='ios'?Linking.openURL('app-settings:'):Linking.openSettings()
                        
                        )
                    },
                    {
                        text: "cancel",
                    },
                ]);
                return
            }

        } catch (err) {
            console.warn(err);
        }
    }

    const editLatLong = () => {
        Alert.alert("Modify Coordinate", "This may affect the accuracy of your spot's coordinate. Are You Sure?", [
            {
                text: "Yes",
                onPress: async () => (
                    setEditable(true)
                )
            },
            {
                text: "no",
            },
        ]);
    }


    // to get place information from firebase
    const getPlace = async () => {
        await db.collection("Place").doc(placeID)
            .get()
            .then((doc) => {
                if (doc.exists) {
                    if ((doc.data().userID != userID)) {
                        Alert.alert("You have not the permission to edit it!")
                        navigation.replace("HomeScreen")
                    }

                    setSpotName(doc.data().spotName)
                    setSelectedCategory(doc.data().category)
                    setFromDayOfWeek(doc.data().fromDayOfWeek)
                    setToDayOfWeek(doc.data().toDayOfWeek)
                    setFromTime(doc.data().fromTime)
                    setToTime(doc.data().toTime)
                    setEntranceFee(doc.data().entranceFee)
                    setAddressLine1(doc.data().addressLine1)
                    setAddressLine2(doc.data().addressLine2)
                    setCity(doc.data().city)
                    setPostcode(doc.data().postcode)
                    setState(doc.data().state)
                    setLatitude(doc.data().latitude)
                    setLongitude(doc.data().longitude)
                    setDetails(doc.data().details)
                    setImage(doc.data().image)
                    setFromTimeIsSet(true)
                    setToTimeIsSet(true)
                    setLocationPermission(true)
                    
                    console.log("Get place information successfully place: ", placeID)
                }
                else {
                    console.log("No such document!");
                }
            }), ((error) => {
                console.log("Error getting documentL ", error(message))
            })
    }

    // To check whether all the required fields are filled in.
    // Add the place details into firestore if all the required fields are filled.
    // Update the place information if the place is existing.
    const submitAction = async () => {
        if (!spotName.trim() || !selectedCategory.trim() || !fromDayOfWeek.trim() || !toDayOfWeek.length >= 1 || !fromTimeIsSet || !toTimeIsSet ||
            !addressLine1.trim() || !city.trim() || !postcode.trim() || !state.trim() || !details.trimStart() || !details.trimEnd() || !image.length >= 1) {
            Alert.alert('Reminder', 'Please enter all the required fields!')

        }
        else if (!locationPermised) {
            Alert.alert("Reminder", "Please share your location to get the accurate coordinate of your spot.")
        }
        else if (!latitude.trim() || !longitude.trim()) {
            Alert.alert('You cannot empty the latitude and longitude fields!')
        } else {
            const data = {
                spotName: spotName,
                category: selectedCategory,
                fromDayOfWeek: fromDayOfWeek,
                toDayOfWeek: toDayOfWeek,
                fromTime: fromTime,
                toTime: toTime,
                entranceFee: entranceFee.trim(),
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postcode: postcode,
                state: state,
                latitude: latitude,
                longitude: longitude,
                details: details.trim(),
                image: image
            }

            if (!placeID.trim()){
                placeID = await addNewPlace(data)
            }
                
            else
                await updatePlace(data, placeID)

            navigation.replace("PlaceDisplay",
                { placeID: placeID })
        }
    }

    // to permanent delete all the information of a place
    const deleteAction = () => {
        Alert.alert("Permanent Delete", "Are You Sure?", [
            {
                text: "Yes",
                onPress:() => (
                   deletePlace(placeID),
                   navigation.replace("HomeScreen")
                )
            },
            { text: "no" },
        ]);
    }


    // to enable category selection (ios only)
    const toSelectCategory = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: category,
                title: "Category",

                userInterfaceStyle: 'dark'
            },
            buttonIndex => {

                category.map((item, index) => {
                    if (buttonIndex == index)
                        setSelectedCategory(item);
                }
                )
            }
        );

    // to enable day of week selection (ios only)
    const toSelectDayOfWeek = (type) =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: dayOfWeek,
                title: "From",

                userInterfaceStyle: 'dark'
            },
            buttonIndex => {
                dayOfWeek.map((item, index) => {
                    if (buttonIndex == index && type == "from")
                        setFromDayOfWeek(item);

                    else if (buttonIndex == index && type == "to")
                        setToDayOfWeek(item);
                }
                )
            }

        );

    // to enable state selection (ios only)
    const toSelectState = () =>
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: MalaysiaPostcodes.getStates(),
                title: "State",

                userInterfaceStyle: 'dark'
            },
            buttonIndex => {

                MalaysiaPostcodes.getStates().map((item, index) => {
                    if (buttonIndex == index)
                        setState(item);
                }
                )
            }
        );

    // to go back to previous page
    const goBack = () => {
        Alert.alert("No Save", "Are You Sure?", [
            {
                text: "Yes",
                onPress: () => (
                    navigation.goBack()
                )
            },
            {
                text: "no",
            },
        ]);
    }

    // make hours and minutes in two digits format
    function makeTwoDigit(time) {
        if (time / 10 < 1)
            return (`0${time}`)
        else
            return (`${time}`)
    }

    // Event that hapen when the fromTime(start of operation time) is updated
    const fromTimePickerEvent = (event, selectedTime) => {
        const currentTime = selectedTime || fromTime
        setShowFTime(Platform.OS == 'ios')
        setFromTimeToShow(currentTime)
        setFromTime(getTimes(currentTime))
        setFromTimeIsSet(true)

    }

    // Event that hapen when the toTime(end of operation time) is updated
    const toTimePickerEvent = (event, selectedTime) => {
        const currentTime = selectedTime || toTime
        setShowTTime(Platform.OS == 'ios')
        setToTimeToShow(currentTime)
        setToTime(getTimes(currentTime))
        setToTimeIsSet(true)
    }

    // to get time in HH:mm format
    function getTimes(time) {
        const hours = makeTwoDigit(time.getHours())
        const minutes = makeTwoDigit(time.getMinutes())
        return (hours + ':' + minutes)
    }

    // toggleSwitch for entrance fee
    const toggleSwitch = () => {setCharged(previousState => !previousState), setEntranceFee('')};

    // Event to to pick an image from image library (image gallery)
    const handleChoosePhoto = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            allowsEditing: true,
            aspect: [4, 3],
        });
        if (!result.cancelled) {
            uploadImage(result.uri)
                .then(() => { console.log("Image Uploaded Successfully") })
                .catch((error) => {
                    Alert.alert("Failed to upload image! Please try again.")
                })
        }
    };

    // to upload image
    const uploadImage = async (uri) => {
        const response = await fetch(uri);
        const blob = await response.blob();

        var uuid = uuid4();
        const fileName = uuid;
        var ref = storage.ref().child("Places/images/" + uuid).put(blob);

        ref.on('state_changed',
            (snapshot) => {
                // Observe state change events such as progress, pause, and resume
                // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
                var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                setProgress(progress)
                switch (snapshot.state) {
                    case firebase.storage.TaskState.PAUSED: // or 'paused'
                        console.log('Upload is paused');
                        break;
                    case firebase.storage.TaskState.RUNNING: // or 'running'
                        console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.log("image upload unsuccessful: ", error.toString())
            },
            () => {
                // Handle successful uploads on complete.
                ref.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    setImage(image => { return ([...image, { imageName: uuid, uri: downloadURL }]) });
                    console.log(image)
                });
            }
        );
    }


    // to delete a selected image (asking)
    const deletePhoto = (photo) => {
        Alert.alert("Delete", "Are You Sure?", [
            {
                text: "Yes",
                onPress: () => (
                    toDelete(photo)
                )
            },
            { text: "no" },
        ]);
    }

    // to delete a selected image (action)
    const toDelete = (photo) => {

        var imageIndex;
        image.map((image, index) => {
            if (photo.uri == image.uri) {
                imageIndex = index;
            }
        })
        setImage(image.filter((item) => item != photo).map((image) => (image)))

        const name = image[imageIndex].imageName;

        if (!placeID.trim()) {
            var ref = storage.ref().child("Places/images/" + name);

            ref.delete().then(() => {
                console.log("delete " + name + " image successfully")
            })
                .catch((error) => {
                    console.log("delete image " + name + " fail with error: " + error)
                })
        }
    }

    // Image card to show the selected image
    const Card = ({ image }) => {
        return <ImageBackground
            style={styles.cardImage}
            keyExtractor={(image) => image.imageName.toString()}
            source={{ uri: image.uri }}>
            <TouchableOpacity
                onPress={() => {
                    deletePhoto(image);
                }}
            >
                <Icons name="closesquare" size={28} color='rgb(210, 24, 0)' />
            </TouchableOpacity>
        </ImageBackground>
    }


    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="padding: 15"
        >
            <SafeAreaView>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0.1)" />
                <View style={styles.header}>
                    <TouchableOpacity onPress={goBack}><Icon name="chevron-left" size={20} color='#38761D' /></TouchableOpacity>
                    <Text style={styles.title}>
                        My Agro Spot
                    </Text>

                    {placeID!="" && <TouchableOpacity
                        style={styles.buttonSubmit}
                        onPress={deleteAction}
                    >
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>}

                    <TouchableOpacity
                        style={styles.buttonSubmit}
                        onPress={submitAction}
                    >
                        <Text style={styles.buttonText}>Submit</Text>
                    </TouchableOpacity>
                </View>

                <ScrollView style={styles.formContainer}>


                    {/* Spot Name */}
                    <Text style={styles.subtitle}>Spot Name
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>
                    <TextInput
                        placeholder="Spot Name"
                        value={spotName}
                        onChangeText={text => setSpotName(text)}
                        style={styles.input}
                    />


                    {/* Category */}
                    <Text style={styles.subtitle}>Category
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>

                    {Platform.OS == 'ios' && <View>
                        <TouchableOpacity onPress={toSelectCategory}><View style={styles.inputSelection}><Text style={selectedCategory ? styles.inputText : styles.inputTextBlur}>{selectedCategory ? selectedCategory : "-category-"}</Text></View></TouchableOpacity>
                    </View>}

                    {Platform.OS != 'ios' && <Picker
                        prompt={"Category"}
                        selectedValue={selectedCategory}
                        style={styles.pickerStyle}
                        onValueChange={(itemValue) => setSelectedCategory(itemValue)}>

                        <Picker.Item label="-select-" enabled={false} style={{ color: 'rgba(0,0,0, 0.4)' }} />
                        {category.map((item, index) => {
                            return (
                                <Picker.Item label={item} value={item} key={index} style={{ color: 'rgba(0,0,0,1)' }} />
                            )
                        })
                        }
                    </Picker>}

                    {/* Operation Day */}
                    <Text style={styles.subtitle}>Operation Day
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>
                    <View style={styles.addressContainer}>
                        {Platform.OS == 'ios' &&
                            <TouchableOpacity onPress={() => { toSelectDayOfWeek("from") }}><View style={styles.dateContainer}><Text style={fromDayOfWeek ? styles.inputText : styles.inputTextBlur}>{fromDayOfWeek ? fromDayOfWeek : "-From-"}</Text></View></TouchableOpacity>
                        }
                        {Platform.OS != 'ios' && <Picker
                            prompt={"From"}
                            selectedValue={fromDayOfWeek}
                            style={styles.dayPickerStyle}
                            onValueChange={(itemValue) => setFromDayOfWeek(itemValue)}>

                            <Picker.Item label="-From-" enabled={false} style={{ color: 'rgba(0,0,0, 0.4)' }} />
                            {dayOfWeek.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index} style={{ color: 'rgba(0,0,0,1)' }} />
                                )
                            })
                            }
                        </Picker>}

                        {Platform.OS == 'ios' &&
                            <TouchableOpacity onPress={() => { toSelectDayOfWeek("to") }}><View style={styles.dateContainer}><Text style={toDayOfWeek ? styles.inputText : styles.inputTextBlur}>{toDayOfWeek ? toDayOfWeek : "-To-"}</Text></View></TouchableOpacity>
                        }
                        {Platform.OS != 'ios' && <Picker
                            prompt={"To"}
                            selectedValue={toDayOfWeek}
                            style={styles.dayPickerStyle}
                            onValueChange={(itemValue) => setToDayOfWeek(itemValue)}>

                            <Picker.Item label="-To-" enabled={false} style={{ color: 'rgba(0,0,0, 0.4)' }} />
                            {dayOfWeek.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index} style={{ color: 'rgba(0,0,0,1)' }} />
                                )
                            })
                            }
                        </Picker>}
                    </View>


                    {/* Operation Time */}
                    <Text style={styles.subtitle}>Operation Time
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>

                    <View style={styles.addressContainer}>
                        <Text style={styles.subtitle}>From:</Text>
                        {((Platform.OS == "ios" && !showFTime) || (Platform.OS != "ios")) &&
                            <TouchableOpacity
                                style={styles.buttonTime}
                                onPress={() => setShowFTime(true)}
                            >
                                <Text style={fromTime ? styles.inputText : styles.inputTextBlur}>{fromTimeText}</Text>
                            </TouchableOpacity>}

                        {showFTime && (
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={fromTimeToShow}
                                mode={'time'}
                                is24Hour={true}
                                display='default'
                                onChange={fromTimePickerEvent}
                                style={Platform.OS == "ios" ? styles.dateTimeStyle : null}
                            />
                        )}

                        <Text style={styles.subtitle}>To:</Text>
                        {((Platform.OS == "ios" && !showTTime) || (Platform.OS != "ios")) &&
                            <TouchableOpacity
                                style={styles.buttonTime}
                                onPress={() => setShowTTime(true)}
                            >
                                <Text style={toTime ? styles.inputText : styles.inputTextBlur}>{toTimeText}</Text>
                            </TouchableOpacity>}

                        {showTTime && (
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={toTimeToShow}
                                mode={'time'}
                                is24Hour={true}
                                display='default'
                                onChange={toTimePickerEvent}
                                style={Platform.OS == "ios" ? styles.dateTimeStyle : null}
                            />
                        )}
                    </View>


                    {/* Entrance Fee */}
                    <View style={styles.feeContainer}>
                        <Text style={styles.subtitle}>Entrance Fee</Text>
                        <Switch trackColor={{ false: "#767577", true: "#38761D" }}
                            thumbColor={isCharged ? "rgb(196, 236, 213)" : "#f4f3f4"}
                            ios_backgroundColor="#3e3e3e"
                            onValueChange={toggleSwitch}
                            value={isCharged}
                            style={{ marginTop: 10, transform: [{ scaleX: windowWidth * 0.002 }, { scaleY: windowWidth * 0.002 }] }}
                        />
                    </View>

                    {isCharged && <TextInput
                        multiline
                        placeholder="Fee(RM) + details"
                        value={entranceFee}
                        onChangeText={text => setEntranceFee(text)}
                        style={styles.feeInput}
                    />}

                    {/* Address */}
                    <Text style={styles.subtitle}>Address
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>

                    <TextInput
                        placeholder="Address Line 1"
                        value={addressLine1}
                        onChangeText={text => setAddressLine1(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="Address Line 2 (optional)"
                        value={addressLine2}
                        onChangeText={text => setAddressLine2(text)}
                        style={styles.input}
                    />
                    <TextInput
                        placeholder="City"
                        value={city}
                        onChangeText={text => setCity(text)}
                        style={styles.input}
                    />
                    <View style={styles.addressContainer}>
                        <TextInput
                            keyboardType='numeric'
                            maxLength={5}
                            placeholder="Postcode"
                            value={postcode}
                            onChangeText={text => setPostcode(text)}
                            style={styles.postcodeInput}
                        />

                        {Platform.OS == 'ios' && <View>
                            <TouchableOpacity onPress={toSelectState}><View style={styles.dateContainer}><Text style={state ? styles.inputText : styles.inputTextBlur}>{state ? state : "-state-"}</Text></View></TouchableOpacity>
                        </View>}

                        {Platform.OS != 'ios' && <Picker
                            prompt={"State"}
                            selectedValue={state}
                            style={styles.pickerStyle}
                            onValueChange={(itemValue) => setState(itemValue)}>

                            <Picker.Item label="-state-" enabled={false} style={{ color: 'rgba(0,0,0, 0.4)' }} />
                            {MalaysiaPostcodes.getStates().map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index} style={{ color: 'rgba(0,0,0,1)' }} />
                                )
                            })
                            }
                        </Picker>}
                    </View>
                    <TouchableOpacity
                        onPress={() => { getLocationPermission(), setEditable(false) }}
                        style={styles.buttonLocation}
                    >
                        <Iconss name="ios-location" size={28} color='white' />
                        <Text style={styles.buttonText}>Share Location</Text>
                    </TouchableOpacity>

                    <Text style={styles.remarkLocation}>* Please share your location to get the accurate coordinate for your agrotourism spot</Text>

                    {locationPermised && !editable && <View>
                        {!latitude.trim() && !longitude.trim() ? <Text style={styles.coordinateContainer}>searching...</Text> : <View style={styles.coordinateContainer}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                <Text> Your spot's coordinate is </Text>
                                <TouchableOpacity>
                                    <Icon name='pencil' onPress={() => { editLatLong() }} size={20} color='#38761D'></Icon>
                                </TouchableOpacity>
                            </View>
                            <Text>( {latitude}, {longitude} )</Text>
                        </View>}
                    </View>}

                    {locationPermised && editable && <View><View style={styles.latitudeContainer}>
                        <Text style={styles.subtitle}>Latitude    </Text>
                        <TextInput
                            keyboardType='numeric'
                            placeholder="Latitude"
                            value={latitude}
                            onChangeText={text => setLatitude(text)}
                            style={styles.postcodeInput}
                        /></View>

                        <View style={styles.latitudeContainer}>
                            <Text style={styles.subtitle}>Longitude</Text>
                            <TextInput
                                keyboardType='numeric'
                                placeholder="Longitude"
                                value={longitude}
                                onChangeText={text => setLongitude(text)}
                                style={styles.postcodeInput}
                            /></View>
                    </View>}

                    {/* Details  */}
                    <Text style={styles.subtitle}>Details
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>
                    <TextInput
                        multiline
                        placeholder="Details"
                        enablesReturnKeyAutomatically={true}
                        value={details}
                        onChangeText={text => setDetails(text)}
                        style={styles.detailsInput}
                    />


                    {/* Event */}
                    <Text style={styles.subtitle}>Event</Text>
                    <Text style={{ color: "#F19434", textAlign: 'justify', paddingHorizontal: 20 }}>   Does any event will be carried out recently? {"\n\t\t"}
                        If you wish to add event, you can choose "event" tab to add it after pressing "submit" button.</Text>

                    {/* Display selected images */}
                    <View>
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            keyExtractor={(item) => item.uri.toString()}
                            data={image}

                            renderItem={({ item, index }) => (
                                <Card image={item}
                                    keyExtractor={(item) => item.uri}>
                                </Card>
                            )}
                        />
                    </View>

                    {progress != 100 && <Text style={styles.uploading}>uploading...</Text>}

                    {/* Upload image */}
                    <TouchableOpacity
                        onPress={() => {
                            handleChoosePhoto();
                        }}
                        style={styles.button}
                    >
                        <Icon name="camera" size={28} color='white' />
                        <Text style={styles.buttonText}>Upload Photo</Text>
                    </TouchableOpacity>

                    <Text style={styles.remark}>* Please upload at least 1 photo</Text>

                </ScrollView>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default Place

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgb(200, 247, 197)',
        alignItems: 'center',
        justifyContent: 'center',
    },

    formContainer: {
        width: windowWidth * 0.9,
        height: '90%',
        padding: 25,
        paddingTop: 0,
        paddingBottom: 10,
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 20
    },

    header: {
        marginBottom: 10,
        marginTop: 30,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        alignContent: 'center'
    },

    title: {
        fontWeight: "bold",
        marginVertical: 4,
        fontSize: 20,
        width: "50%"
    },

    subtitle: {
        marginTop: 10,
        paddingTop: 10,
        fontSize: 14,
        paddingRight: 5
    },

    remark: {
        color: 'rgb(210, 24, 0)',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 50
    },

    remarkLocation: {
        color: 'rgb(210, 24, 0)',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 20
    },

    uploading: {
        color: '#38761D',
        fontSize: 10,
        textAlign: 'center',
        marginTop: 50
    },

    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        height: windowHeight * 0.07,
        width: '100%'
    },

    postcodeInput: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        height: windowHeight * 0.0725,
        width: '40%'
    },

    inputText: {
        fontSize: 14,
        color: "black"
    },

    inputTextBlur: {
        fontSize: 14,
        color: 'rgba(135, 135, 135, 0.5)'
    },

    feeInput: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        minHeight: windowHeight * 0.07,
        maxHeight: windowHeight * 0.1,
        width: '100%'
    },

    detailsInput: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        minHeight: windowHeight * 0.07,
        maxHeight: windowHeight * 0.4,
        width: '100%'
    },

    pickerStyle: {
        height: windowHeight * 0.06,
        width: windowWidth * 0.4,
        marginTop: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },

    dayPickerStyle: {
        height: 45,
        width: 130,
        marginTop: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        borderRadius: 10
    },

    addressContainer: {
        flexDirection: 'row',
        paddingHorizontal: 1,
        justifyContent: 'space-around',
    },

    feeContainer: {
        flexDirection: 'row',
        paddingHorizontal: 1,
        justifyContent: 'flex-start',
        alignContent: 'center'
    },

    button: {
        backgroundColor: '#38761D',
        width: '40%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 40,
        marginHorizontal: '30%'
    },

    buttonLocation: {
        backgroundColor: '#38761D',
        width: '40%',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 15,
        marginHorizontal: '30%'
    },

    buttonSubmit: {
        backgroundColor: '#38761D',
        width: '20%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },

    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
        textAlign:'center'
    },

    buttonTime: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        width: '30%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },

    cardImage: {
        height: 3 / 8 * windowWidth,
        width: windowWidth / 2,
        marginRight: 20,
        borderRadius: 7,
        marginBottom: 0,
        marginTop: 50,
        overflow: "hidden"
    },

    dateContainer: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        height: windowHeight * 0.06,
        width: windowWidth * 0.35,
        alignItems: 'center',
        justifyContent: 'center'
    },

    inputSelection: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        height: windowHeight * 0.06,
        width: '45%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    dateTimeStyle: {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        width: '30%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },

    coordinateContainer: {
        backgroundColor: "rgba(238, 233, 241, 0.5)",
        width: "90%",
        padding: 10,
        borderRadius: 15,
        justifyContent: 'center',
        alignContent: 'center',
        alignSelf: 'center'
    },

    latitudeContainer: {
        flexDirection: 'row',
        height: windowHeight * 0.0725,
        marginBottom: 10
    }
});
