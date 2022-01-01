import React, { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/FontAwesome';
import Icons from 'react-native-vector-icons/AntDesign';
import * as MalaysiaPostcodes from 'malaysia-postcodes';
import { Picker } from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker'
import { addNewPlace, getPlaceInfo } from '../actions/placeAction'

import { useNavigation } from '@react-navigation/core'
import moment from 'moment'

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
    Switch
} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').width;


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
    const [isCharged, setCharged] = useState(false)
    const [addressLine1, setAddressLine1] = useState('')
    const [addressLine2, setAddressLine2] = useState('')
    const [city, setCity] = useState('')
    const [postcode, setPostcode] = useState('')
    const [state, setState] = useState('')
    const [details, setDetails] = useState('')
    const [event, setEvent] = useState('')
    //const navigation = useNavigation()
    const [imageUri, setImageUri] = useState('')
    const [fromTimeIsSet, setFromTimeIsSet] = useState(false)
    const [toTimeIsSet, setToTimeIsSet] = useState(false)

    const category = ['Farm', 'Park', 'Mountain', 'Other']
    const dayOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

    const fromTimeText = fromTimeIsSet ? fromTime : '-From-';
    const toTimeText = toTimeIsSet ? toTime : '-To-';

    // To check whether all the required fields are filled in.
    // Add the place details into firestore if all the required fields are filled.
    const checkTextInput = async () => {
        if (!spotName.trim() || !selectedCategory.trim() || !fromDayOfWeek.trim() || !toDayOfWeek.length >= 1 || !fromTimeIsSet || !toTimeIsSet ||
            !addressLine1.trim() || !city.trim() || !postcode.trim() || !state.trim() || !details.trim() || !imageUri.length >= 1) {
            alert('Please enter all the required fields!')
        } else {
            const data = {
                spotName: spotName,
                category: selectedCategory,
                fromDayOfWeek: fromDayOfWeek,
                toDayOfWeek: toDayOfWeek,
                fromTime: fromTime,
                toTime: toTime,
                entranceFee: entranceFee,
                addressLine1: addressLine1,
                addressLine2: addressLine2,
                city: city,
                postcode: postcode,
                state: state,
                details: details,
                event: event,
                image: imageUri,
            }
            console.log(data)

            // add place details into firestore
            addNewPlace(data)
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
            setImageUri(imageUri => { return ([...imageUri, result]) });
        }
    };

    // to delete a selected image 
    const deletePhoto = (photo) => {
        Alert.alert("Delete", "Are You Sure?", [
            {
                text: "Yes",
                onPress: () => (
                    setImageUri(imageUri.filter((item) => item.uri != photo.uri).map((photo) => (photo)))
                )
            },
            { text: "no" },
        ]);
    }

    // Image card to show the selected image
    const Card = ({ image }) => {
        return <ImageBackground
            style={styles.cardImage}
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
                        style={{paddingTop:15}}
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
                        placeholder="Address Line 2"
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
                            onfo
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
                    <TextInput
                        multiline
                        placeholder="Event"
                        value={event}
                        onChangeText={text => setEvent(text)}
                        style={styles.input}
                    />

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


                    {/* Display selected images */}
                    <View >
                        <FlatList
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            data={imageUri}

                            renderItem={({ item, index }) => (
                                <Card image={item}
                                    keyExtractor={(item) => item.uri}>
                                </Card>
                            )}
                        />
                    </View>
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
        marginBottom: 30
    },

    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
    },

    pickerStyle: {
        height: windowHeight * 0.05,
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
        borderRadius: 20,
        marginBottom: 30,
    }
});
