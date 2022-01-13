import React, { useState, useEffect } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/AntDesign';
import * as MalaysiaPostcodes from 'malaysia-postcodes';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { addNewPlace, updatePlace } from '../actions/placeAction'
import { auth, db, storage } from '../firebase'
import { v4 as uuid4 } from 'uuid'
import * as firebase from 'firebase';
import 'react-native-get-random-values'
import { useNavigation, useRoute } from '@react-navigation/native'

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
    StatusBar
} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;


const Place = () => {
    const [spotName, setSpotName] = useState('')
    const [selectedCategory, setSelectedCategory] = useState('')
    const [fromDayOfWeek, setFromDayOfWeek] = useState('')
    const [toDayOfWeek, setToDayOfWeek] = useState('')
    const [fromTime, setFromTime] = useState(new Date(0))
    const [toTime, setToTime] = useState(new Date(0))
    const [show, setShow] = useState(false)
    const [show1, setShow1] = useState(false)
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

    const category = ['Farm', 'Park', 'Forest', 'Mountain', 'Other']
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const fromTimeText = fromTimeIsSet ? fromTime : '-From-';
    const toTimeText = toTimeIsSet ? toTime : '-To-';

    const navigation = useNavigation()
    const route = useRoute();
    const userID = auth.currentUser?.uid;
    var placeID = route.params.placeID;

    useEffect(async () => {
        if (placeID.trim())
            await getPlace()

    }, [placeID])

    // to get place information from firebase
    const getPlace = async () => {
        await db.collection("Place").doc(placeID)
            .onSnapshot((doc) => {
                if (doc.exists) {

                    if ((doc.data().userID != userID))
                        navigation.replace("PlaceDisplay",
                            { placeID: placeID })

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
                    setDetails(doc.data().details)
                    setImage(doc.data().image)

                    setFromTimeIsSet(true)
                    setToTimeIsSet(true)

                    console.log("Get place info rmation successfully place: ", placeID)

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
    const checkTextInput = async () => {
        if (!spotName.trim() || !selectedCategory.trim() || !fromDayOfWeek.trim() || !toDayOfWeek.length >= 1 || !fromTimeIsSet || !toTimeIsSet ||
            !addressLine1.trim() || !city.trim() || !postcode.trim() || !state.trim() || !details.trimStart() || !details.trimEnd() || !image.length >= 1) {
            alert('Please enter all the required fields!')
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
                details: details.trim(),
                image: image
            }

            if (!placeID.trim())
                placeID = await addNewPlace(data)

            else
                updatePlace(data, placeID)

            navigation.replace("PlaceDisplay",
                { placeID: placeID })
        }
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
        setShow(false)
        setShow(Platform.OS == 'ios')
        setFromTime(getTimes(currentTime))
        setFromTimeIsSet(true)
    }

    // Event that hapen when the toTime(end of operation time) is updated
    const toTimePickerEvent = (event, selectedTime) => {
        const currentTime = selectedTime || toTime
        setShow1(Platform.OS == 'ios')
        setShow1(false)
        setToTime(getTimes(currentTime))
        setToTimeIsSet(true)
    }

    // to get time in HH:mm format
    function getTimes(time) {
        const hours = makeTwoDigit(time.getHours())
        const minutes = makeTwoDigit(time.getMinutes())
        return (hours + ':' + minutes)
    }

    // to enable the Time Picker (clock) for fromTime(start of operation time)
    const showTimePicker = () => {
        setShow(true)
    }

    // to enable the Time Picker (clock) for toTime(end of operation time)
    const showTimePicker1 = () => {
        setShow1(true)
    }

    // toggleSwitch for entrance fee
    const toggleSwitch = () => setCharged(previousState => !previousState);

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
                    Alert.alert(error.message)
                })
        }
    };

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
                // Handle successful uploads on complete
                // For instance, get the download URL: https://firebasestorage.googleapis.com/...
                ref.snapshot.ref.getDownloadURL().then((downloadURL) => {
                    console.log('File available at', downloadURL);
                    // setImageName(imageName => { return ([...imageName, uuid]) });
                    // setImageUri(imageUri => { return ([...imageUri, uri]) });
                    setImage(image => { return ([...image, { imageName: uuid, uri: downloadURL }]) });
                    console.log(image)
                });
            }
        );
    }


    // to delete a selected image 
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

    const toDelete = (photo) => {

        var imageIndex;
        image.map((image, index) => {
            if (photo.uri == image.uri) {
                imageIndex = index;
            }
        })
        setImage(image.filter((item) => item != photo).map((image) => (image)))

        const name = image[imageIndex].imageName;
        var ref = storage.ref().child("Places/images/" + name);

        ref.delete().then(() => {
            console.log("delete " + name + " image successfully")
        })
            .catch((error) => {
                console.log("delete image " + name + " fail with error: " + error)
            })
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
            <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                <View style={styles.header}>

                    <Text style={styles.title}>
                        My Agrotourism Spot
                    </Text>

                    <TouchableOpacity
                        style={styles.buttonSubmit}
                        onPress={checkTextInput}
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

                    <Picker
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
                    </Picker>


                    {/* Operation Day */}
                    <Text style={styles.subtitle}>Operation Day
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>
                    <View style={styles.addressContainer}>

                        <Picker
                            prompt={"From"}
                            selectedValue={fromDayOfWeek}
                            style={styles.DayPickerStyle}
                            onValueChange={(itemValue) => setFromDayOfWeek(itemValue)}>

                            <Picker.Item label="-From-" enabled={false} style={{ color: 'rgba(0,0,0, 0.4)' }} />
                            {dayOfWeek.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index} style={{ color: 'rgba(0,0,0,1)' }} />
                                )
                            })
                            }
                        </Picker>

                        <Picker
                            prompt={"To"}
                            selectedValue={toDayOfWeek}
                            style={styles.DayPickerStyle}
                            onValueChange={(itemValue) => setToDayOfWeek(itemValue)}>

                            <Picker.Item label="-To-" enabled={false} style={{ color: 'rgba(0,0,0, 0.4)' }} />
                            {dayOfWeek.map((item, index) => {
                                return (
                                    <Picker.Item label={item} value={item} key={index} style={{ color: 'rgba(0,0,0,1)' }} />
                                )
                            })
                            }
                        </Picker>
                    </View>


                    {/* Operation Time */}
                    <Text style={styles.subtitle}>Operation Time
                        <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                    </Text>

                    <View style={styles.addressContainer}>
                        <Text style={styles.subtitle}>From:</Text>
                        <TouchableOpacity
                            style={styles.buttonTime}
                            onPress={showTimePicker}
                        >
                            <Text style={styles.buttonText}>{fromTimeText}</Text>
                        </TouchableOpacity>

                        {show && (
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={new Date()}
                                mode={'time'}
                                is24Hour={true}
                                display='default'
                                onChange={fromTimePickerEvent}
                            />
                        )}

                        <Text style={styles.subtitle}>To:</Text>
                        <TouchableOpacity
                            style={styles.buttonTime}
                            onPress={showTimePicker1}
                        >
                            <Text style={styles.buttonText}>{toTimeText}</Text>
                        </TouchableOpacity>

                        {show1 && (
                            <DateTimePicker
                                testID='dateTimePicker'
                                value={new Date()}
                                mode={'time'}
                                is24Hour={true}
                                display='default'
                                onChange={toTimePickerEvent}
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
                            style={{ paddingTop: 15 }}
                        />
                    </View>

                    {isCharged && <TextInput
                        multiline
                        placeholder="Fee(RM) + details"
                        value={entranceFee}
                        onChangeText={text => setEntranceFee(text)}
                        style={styles.input}
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
                            style={styles.input}
                        />

                        <Picker
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
                        </Picker>
                    </View>


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
                        style={styles.input}
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
        marginVertical: 15,
        padding: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },

    title: {
        paddingTop: 10,
        fontWeight: "bold",
        marginVertical: 4,
        fontSize: 20
    },

    subtitle: {
        marginTop: 10,
        paddingTop: 10
    },

    remark: {
        color: 'rgb(210, 24, 0)',
        fontSize: 10,
        textAlign: 'center',
        marginBottom: 50
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
    },

    pickerStyle: {
        height: windowHeight * 0.02,
        width: windowWidth * 0.4,
        marginTop: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
    },

    DayPickerStyle: {
        height: 45,
        width: 130,
        marginTop: 5,
        backgroundColor: 'rgba(0, 0, 0, 0.03)'
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

    buttonSubmit: {
        backgroundColor: '#38761D',
        width: '20%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },

    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
    },

    buttonTime: {
        backgroundColor: 'rgb(183, 193, 172)',
        width: '30%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    },

    photoPreviewContainer: {
        marginTop: 12,
        flexDirection: 'row',
        width: 200,
        height: 200
    },

    cardImage: {
        height: 3 / 8 * windowWidth,
        width: windowWidth / 2,
        marginRight: 20,
        borderRadius: 7,
        marginBottom: 0,
        marginTop: 50,
        overflow: "hidden"
    }
});
