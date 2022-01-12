import { useNavigation, useRoute, useScrollToTop } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import * as firebase from 'firebase'
import { auth, db } from '../firebase'
import { addNewBookmark, removeBookmark, addNewReview, toDeleteReview, addNewEvent, toDeleteEvent, updateEvent } from '../actions/placeAction'

import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { LogBox } from 'react-native';
import _ from 'lodash';

LogBox.ignoreLogs(['Warning:...']); // ignore specific logs
LogBox.ignoreAllLogs(); // ignore all logs
const _console = _.clone(console);
console.warn = message => {
    if (message.indexOf('Setting a timer') <= -1) {
        _console.warn(message);
    }
};

import {
    Alert,
    FlatList,
    ImageBackground,
    StatusBar,
    SafeAreaView,
    Dimensions,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    KeyboardAvoidingView,
    TextInput,
    ScrollView,
} from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const PlaceDisplay = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const userID = auth.currentUser?.uid;
    const placeID = route.params.placeID;


    const [navTabChosen, setNavTabChosen] = useState(1)
    const [bookmarked, setBookmarked] = useState(false)
    const [review, setReview] = useState('')
    const [addreview, setToAddReview] = useState(false)
    const [starGiven, setStarNum] = useState(5)
    const [editable, setEditable] = useState(true)
    const [iconName, setIconName] = useState('add')
    const [disable, setDisability] = useState(false)
    const [owner, setOwner] = useState(false)
    const [place, setPlace] = useState('')
    const [reviewList, setReviewList] = useState('')
    const [eventList, setEventList] = useState('')
    const [addEvent, setToAddEvent] = useState(false)
    const [eventTitle, setEventTitle] = useState('')
    const [fromDate_String, setFromDate_String] = useState(new Date())
    const [toDate_String, setToDate_String] = useState(new Date())
    const [fromDate, setFromDate] = useState(new Date(0))
    const [toDate, setToDate] = useState(new Date(0))
    const [fromTime, setFromTime] = useState(new Date(0))
    const [toTime, setToTime] = useState(new Date(0))
    const [description, setDescription] = useState('')
    const [showFTime, setShowFTime] = useState(false)
    const [showTTime, setShowTTime] = useState(false)
    const [showFDate, setShowFDate] = useState(false)
    const [showTDate, setShowTDate] = useState(false)
    const [fromTimeIsSet, setFromTimeIsSet] = useState(false)
    const [toTimeIsSet, setToTimeIsSet] = useState(false)
    const [fromDateIsSet, setFromDateIsSet] = useState(false)
    const [toDateIsSet, setToDateIsSet] = useState(false)
    const [eventEditable, setEventEditable] = useState(false)
    const [eventID, setEventID] = useState(false)
    const [userReview, setUserReview] = useState('')


    const fromTimeText = fromTimeIsSet ? fromTime : '-From-';
    const toTimeText = toTimeIsSet ? toTime : '-To-';

    const fromDateText = fromDateIsSet ? fromDate_String : '-From-';
    const toDateText = toDateIsSet ? toDate_String : '-To-';

    const numArray = [1, 2, 3, 4, 5]
    const ref = useRef(0)
    const flatRef = useRef(0)

    useEffect(async () => {
        await getPlace()

    }, [placeID])

    const goTop = () => {
        ref.current.scrollTo({
            y: 0,
            animated: true
        })
    }

    const goTop1 = () => {
        ref.current.scrollTo({
            y: 0,
            animated: false
        })
    }

    const goPrevious = (index) => {
        flatRef.current.scrollToIndex({
            index: index - 1,
            animated: true
        })
    }

    const goLater = (index) => {
        flatRef.current.scrollToIndex({
            index: index + 1,
            animated: true
        })
    }




    const getPlace = async () => {
        await db.collection("Place").doc(placeID)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    if (doc.data().userID == userID)
                        setOwner(true)
                    else
                        setOwner(false)

                    setPlace(doc.data())
                    console.log("Get place information successfully")
                    console.log("userID: ", auth.currentUser?.uid)
                }
                else {
                    console.log("No such document!");
                }
            }), ((error) => {
                console.log("Error getting documentL ", error(message))
            })

        getReview()
        getEvent()
        getUserReview()

    }

    const getUserReview = async () => {
        db.collection("Place").doc(placeID).collection("reviews").doc(userID).get().then((doc) => {
            if (doc.exists) {
                setUserReview(doc.data())
                if (addreview)
                    setToAddReview(false)
                setEditable(false)
                setIconName('trash')
            }


            else
                console.log("not user's review")
        })
    }


    const getReview = async () => {
        await db.collection("Place").doc(placeID).collection("reviews")
            .orderBy("timestamp", "desc")
            .get()
            .then((querySnapshot) => {
                setReviewList('')
                querySnapshot.forEach((doc1) => {
                    setReviewList(reviewList => { return ([...reviewList, doc1.data()]) });
                    console.log("Get review information successfully")
                });
            })
            , ((error) => {
                console.log("Error getting review: ", error(message));
            })
    }

    const getEvent = async () => {
        await db.collection("Place").doc(placeID).collection("events")
            .orderBy("fromDate")
            .get()
            .then((querySnapshot) => {
                setEventList('')
                querySnapshot.forEach((doc) => {
                    setEventList(eventList => { return ([...eventList, doc.data()]) });
                    console.log("Get events information successfully")
                });
            })
            , ((error) => {
                console.log("Error getting events: ", error(message));
            })
    }


    const addBookmark = async () => {
        if (bookmarked) {
            await removeBookmark(placeID)
            setBookmarked(false)
        }
        else {
            console.log("placeID: ", placeID)
            await addNewBookmark(placeID, place.spotName)
            setBookmarked(true)
        }
    }


    // Image card to show the selected image
    const Card = ({ image, index }) => {
        return <ImageBackground
            style={styles.cardImage}
            source={{ uri: image.uri }}>


            {index == 0 ? null : <View style={styles.leftArrowContainer}>
                <TouchableOpacity onPress={() => goPrevious(index)}>
                    <Icon name="chevron-left" size={35} color='black' />
                </TouchableOpacity>
            </View>}


            {index == place.image.length - 1 ? null : <View style={styles.rightArrowContainer}>
                <TouchableOpacity onPress={() => goLater(index)}>
                    <Icon name="chevron-right" size={35} color='black' />
                </TouchableOpacity>
            </View>}
        </ImageBackground>
    }

    const Star = ({ num }) => {
        return <TouchableOpacity key={num} disabled={disable} onPress={() => { setStarNum(num) }}>
            {starGiven >= num ? <Icons name='md-star' size={25} color={'rgba(243, 116, 10, 0.8)'}></Icons> :
                <Icons name='md-star-outline' size={25} color={'rgba(243, 116, 10, 0.8)'}></Icons>}
        </TouchableOpacity>
    }

    const Rating = ({ num, ratingGiven }) => {
        return ratingGiven >= num ? <Icons name='md-star' size={15} color={'rgba(243, 116, 10, 0.8)'}></Icons> :
            <Icons name='md-star-outline' size={15} color={'rgba(243, 116, 10, 0.8)'}></Icons>
    }

    const reviewButtonEvent = async () => {

        if (addreview) {
            if (editable) {

                // current icon is 'tick' (means the review's textiput is available)
                //   but the textinput is empty
                // Event-triggered (where icon pressed): make the review's textinput no available
                //   and reset the icon to 'add'
                if (!review.trim()) {
                    setToAddReview(false)
                    setIconName('add')
                }

                // current icon is 'tick' (means the review's textiput is available)
                //   and the textinput is not empty
                // Event-triggered (where icon pressed): 
                //   add the review to database and get again all the reviews.
                //   Then, set the icon to 'trash', make the review's textinput no available
                //   and no editable
                else {
                    setIconName('trash')
                    setToAddReview(false)
                    setEditable(false)

                    await addNewReview(placeID, review, starGiven, place.rating, place.totalReviewer)
                    await getUserReview()
                    await getReview()
                }
            }
        }
        else {
            // Current icon is 'add' (means no review writen by current user)
            // Event-triggered (where icon pressed): 
            //   make the review's textiput available and set the icon to 'tick' 
            if (editable) {
                goTop()
                setIconName('checkmark-sharp')
                setToAddReview(true)
            }

            // Current icon is 'trash' (means a review was writen by current user)
            // Event-triggered (where icon pressed): track to delete review
            else {
                deleteReview()
            }
        }
    }

    const deleteReview = () => {
        Alert.alert("Delete", "Are You Sure?", [
            {
                text: "Yes",
                onPress: () => (
                    toDeleteReview(placeID, starGiven, place.rating, place.totalReviewer),
                    setIconName('add'),
                    setEditable(true),
                    setDisability(false),
                    setReview(""),
                    getReview(),
                    getUserReview(),
                    setUserReview('')
                )
            },
            {
                text: "no",
                onPress: () => (
                    setIconName('trash'),
                    setEditable(false),
                    setDisability(true)
                )
            },
        ]);
    }

    const viewabilityConfig = () => {
        waitForInteraction: true
        viewAreaCoveragePercentThreshold: 90
    }

    const eventButtonEvent = async () => {

        if (addEvent) {

            if (eventTitle.trim() && description.trimStart() && description.trimEnd()
                && fromDateIsSet && toDateIsSet && fromTimeIsSet && toTimeIsSet) {

                if (eventEditable) {
                    await updateEvent(placeID, eventID, eventTitle, fromDate, toDate, fromTime, toTime, description.trim())
                    setEventEditable(false)
                }
                else {
                    await addNewEvent(placeID, eventTitle, fromDate, toDate, fromTime, toTime, description.trim())
                }

                cleanEventTextInput()
                await getEvent()

            }
            else {
                alert('Please enter all the required fields!')
            }
        }
        else {
            setIconName('checkmark-sharp')
            setToAddEvent(true)
            goTop()
        }
    }

    const cleanEventTextInput = () => {
        setIconName('add')
        setToAddEvent(false)
        setEventTitle('')
        setFromDateIsSet(false)
        setToDateIsSet(false)
        setFromDate_String(new Date())
        setToDate_String(new Date())
        setFromTimeIsSet(false)
        setToTimeIsSet(false)
        setFromTime(new Date(0))
        setToTime(new Date(0))
        setDescription('')
        setEventID('')
    }

    const deleteEvent = (eventID) => {
        Alert.alert("Delete", "Are You Sure?", [
            {
                text: "Yes",
                onPress: () => (
                    toDeleteEvent(placeID, eventID),
                    getEvent()
                )
            },
            {
                text: "no",
            },
        ]);
    }

    const deleteEventContent = () => {
        Alert.alert("No Save", "Are You Sure?", [
            {
                text: "Yes",
                onPress: () => (
                    cleanEventTextInput()
                )
            },
            {
                text: "no",
            },
        ]);
    }

    const editEvent = (item) => {
        setIconName('checkmark-sharp')
        setToAddEvent(true)
        setEventTitle(item.title)
        setFromDateIsSet(true)
        setToDateIsSet(true)
        setFromDate_String(moment.unix(item.fromDate.seconds).format("DD-MMM-YYYY"))
        setToDate_String(moment.unix(item.toDate.seconds).format("DD-MMM-YYYY"))
        setFromDate(item.fromDate)
        setToDate(item.toDate)
        setFromTimeIsSet(true)
        setToTimeIsSet(true)
        setFromTime(item.fromTime)
        setToTime(item.toTime)
        setDescription(item.description)
        setEventID(item.eventID)
        setEventEditable(true)
    }

    const fromDatePickerEvent = (event, selectedDay) => {
        const currentDate = selectedDay || fromDate_String
        setShowFDate(false)
        //setShow(Platform.OS == 'ios')
        setFromDate(currentDate)
        setFromDate_String(moment(currentDate).format("DD-MM-YYYY"))
        setFromDateIsSet(true)
    }

    const toDatePickerEvent = (event, selectedDay) => {
        const currentDate = selectedDay || toDate_String
        //setShow1(Platform.OS == 'ios')
        setShowTDate(false)
        setToDate(currentDate)
        setToDate_String(moment(currentDate).format("DD-MM-YYYY"))
        setToDateIsSet(true)
    }

    // to enable the Time Picker (clock) for fromTime(start of operation time)
    const showDatePicker = () => {
        setShowFDate(true)
    }

    // to enable the Time Picker (clock) for toTime(end of operation time)
    const showDatePicker1 = () => {
        setShowTDate(true)
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
        setShowFTime(false)
        //setShow(Platform.OS == 'ios')
        setFromTime(getTimes(currentTime))
        setFromTimeIsSet(true)
    }

    // Event that hapen when the toTime(end of operation time) is updated
    const toTimePickerEvent = (event, selectedTime) => {
        const currentTime = selectedTime || toTime
        //setShow1(Platform.OS == 'ios')
        setShowTTime(false)
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
        setShowFTime(true)
    }

    // to enable the Time Picker (clock) for toTime(end of operation time)
    const showTimePicker1 = () => {
        setShowTTime(true)
    }

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="position"
        >
            <SafeAreaView>
                <StatusBar translucent backgroundColor="rgba(0,0,0,0)" />
                {/* Display selected images */}
                <View>
                    <FlatList
                        ref={flatRef}
                        horizontal
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={windowWidth}
                        viewabilityConfig={viewabilityConfig}
                        keyExtractor={(item) => item.uri.toString()}
                        data={place.image}

                        renderItem={({ item, index }) => (
                            <Card image={item} index={index}
                                keyExtractor={(item) => item}>
                            </Card>
                        )}
                    />
                </View>

                <View style={styles.detailsContainer}>

                    <View style={styles.iconContainer}>
                        {!owner && <TouchableOpacity onPress={addBookmark}>
                            {bookmarked ?
                                <Icons name="bookmark" size={30} color='rgb(183, 193, 172)' /> :
                                <Icons name="bookmark-outline" size={30} color='#38761D' />}
                        </TouchableOpacity>}
                        {owner && <TouchableOpacity onPress={() => navigation.navigate('Place', { placeID: placeID })}>
                            <Icon name='pencil' size={30} color='#38761D'></Icon>
                        </TouchableOpacity>}
                    </View>

                    <Text style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "bold",
                        fontFamily: "sans-serif-medium",
                        marginLeft: 5,
                        marginBottom: 5,
                        marginRight: 31
                    }}>{place.spotName}</Text>

                    <View style={styles.rowContainer}>
                        <Icons name="location" size={28} color='#38761D' />
                        <Text style={{
                            color: '#38761D', fontWeight: "bold", padding: 4
                        }}>{place.city}, {place.state}</Text>
                    </View>

                    <View style={styles.rowContainer}>
                        <Icons name="star" size={18} color='rgba(243, 116, 10, 0.8)' style={{ paddingLeft: 5 }} />
                        <Text style={{ paddingLeft: 10 }}>{place.rating == 0 ? "no rating" : place.rating}</Text>
                    </View>

                    <View style={styles.navContainer}>
                        <TouchableOpacity onPress={() => { setNavTabChosen(1), goTop1() }}><Text style={navTabChosen == 1 ? styles.colorFocus : styles.colorDefault}>About</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setNavTabChosen(2), goTop1() }}><Text style={navTabChosen == 2 ? styles.colorFocus : styles.colorDefault}>Review</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setNavTabChosen(3), goTop1() }}><Text style={navTabChosen == 3 ? styles.colorFocus : styles.colorDefault}>Event</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setNavTabChosen(4), goTop1() }}><Text style={navTabChosen == 4 ? styles.colorFocus : styles.colorDefault}>Operation</Text></TouchableOpacity>
                    </View>

                    <View style={styles.contentContainer}>
                        <ScrollView ref={ref} showsVerticalScrollIndicator={false} style={{ flexGlow: 1, paddingHorizontal: 20 }} >

                            {navTabChosen == 1 && <Text style={styles.content}>{place.details}</Text>}
                            {navTabChosen == 2 && addreview && !owner &&
                                <View>
                                    <View style={{ justifyContent: 'center', alignItems: 'center' }}>
                                        <View style={styles.rowContainer}>
                                            <Text>Rating: </Text>
                                            <FlatList
                                                horizontal
                                                showsHorizontalScrollIndicator={false}
                                                data={numArray}
                                                keyExtractor={(item) => item.toString()}

                                                renderItem={({ item }) => (

                                                    <Star num={item}
                                                        keyExtractor={(item) => item}>
                                                    </Star>
                                                )}
                                            />
                                        </View>
                                    </View>
                                    <TextInput
                                        placeholder='write your review here...'
                                        editable={editable}
                                        value={review}
                                        onChangeText={text => setReview(text)}
                                        style={styles.input} />
                                </View>
                            }

                            {navTabChosen == 2 &&
                                <View style={{ marginBottom: 10 }}>
                                    {!userReview == "" && <View>
                                        <Text style={styles.subtitle}>Your review</Text>
                                        <View style={styles.userReviewContainer}>
                                            <View style={styles.reviewRowContainer}>
                                                <Icons name='ios-person-circle-outline' size={20}></Icons>
                                                <Text style={styles.reviewerName}>{userReview.author}</Text>

                                                {<FlatList
                                                    horizontal
                                                    showsHorizontalScrollIndicator={false}
                                                    keyExtractor={(item) => item.toString()}
                                                    data={numArray}

                                                    renderItem={(newItem) => (

                                                        <Rating num={newItem.item} ratingGiven={userReview.rating}
                                                            keyExtractor={(newItem) => newItem}>
                                                        </Rating>
                                                    )}
                                                />}
                                            </View>
                                            <Text style={styles.time}>{moment.unix(userReview.timestamp.seconds).format("DD-MMM-YYYY HH:mm")}</Text>
                                            <Text style={styles.content}>{userReview.review}</Text>
                                        </View>
                                    </View>}

                                    {reviewList == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)' }}>-No Review-</Text> :
                                        <View>
                                            <Text style={styles.subtitle}>Other reviews</Text>
                                            {reviewList.map((item, index) =>
                                            (
                                                item.userID == userID ? null : <View style={styles.reviewContainer} key={index}>
                                                    <View style={styles.reviewRowContainer}>
                                                        <Icons name='ios-person-circle-outline' size={20}></Icons>
                                                        <Text style={styles.reviewerName}>{item.author}</Text>

                                                        {<FlatList
                                                            horizontal
                                                            showsHorizontalScrollIndicator={false}
                                                            keyExtractor={(item) => item.toString()}
                                                            data={numArray}

                                                            renderItem={(newItem) => (

                                                                <Rating num={newItem.item} ratingGiven={item.rating}
                                                                    keyExtractor={(newItem) => newItem}>
                                                                </Rating>
                                                            )}
                                                        />}
                                                    </View>
                                                    <Text style={styles.time}>{moment.unix(item.timestamp.seconds).format("DD-MMM-YYYY HH:mm")}</Text>
                                                    <Text style={styles.content}>{item.review}</Text>
                                                </View>))}</View>}
                                </View>
                            }

                            {navTabChosen == 3 && addEvent && owner &&
                                <View>
                                    <View style={styles.formContainer}>
                                        <Text style={styles.subtitleForDateTime}>Event Title
                                            <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                                        </Text>
                                        <TextInput
                                            placeholder="Event Title"
                                            value={eventTitle}
                                            onChangeText={text => setEventTitle(text)}
                                            style={styles.input}
                                        />

                                        {/* Event Day */}
                                        <Text style={styles.subtitleForDateTime}>Event Day
                                            <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                                        </Text>
                                        <View style={styles.dayTimeRowContainer}>

                                            <Text style={styles.content}>From:</Text>
                                            <TouchableOpacity
                                                style={styles.buttonTime}
                                                onPress={showDatePicker}
                                            >
                                                <Text style={styles.buttonText}>{fromDateText}</Text>
                                            </TouchableOpacity>

                                            {showFDate && (
                                                <DateTimePicker
                                                    testID='dateTimePicker'
                                                    value={new Date()}
                                                    mode={'date'}

                                                    display='default'
                                                    onChange={fromDatePickerEvent}
                                                />
                                            )}

                                            <Text style={styles.content}>To:</Text>
                                            <TouchableOpacity
                                                style={styles.buttonTime}
                                                onPress={showDatePicker1}
                                            >
                                                <Text style={styles.buttonText}>{toDateText}</Text>
                                            </TouchableOpacity>

                                            {showTDate && (
                                                <DateTimePicker
                                                    testID='dateTimePicker'
                                                    value={new Date()}
                                                    mode={'date'}
                                                    display='default'
                                                    onChange={toDatePickerEvent}
                                                />
                                            )}
                                        </View>


                                        {/* Event Time */}
                                        <Text style={styles.subtitleForDateTime}>Event Time
                                            <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                                        </Text>

                                        <View style={styles.dayTimeRowContainer}>
                                            <Text style={styles.content}>From:</Text>
                                            <TouchableOpacity
                                                style={styles.buttonTime}
                                                onPress={showTimePicker}
                                            >
                                                <Text style={styles.buttonText}>{fromTimeText}</Text>
                                            </TouchableOpacity>

                                            {showFTime && (
                                                <DateTimePicker
                                                    testID='dateTimePicker'
                                                    value={new Date()}
                                                    mode={'time'}
                                                    is24Hour={true}
                                                    display='default'
                                                    onChange={fromTimePickerEvent}
                                                />
                                            )}

                                            <Text style={styles.content}>To:</Text>
                                            <TouchableOpacity
                                                style={styles.buttonTime}
                                                onPress={showTimePicker1}
                                            >
                                                <Text style={styles.buttonText}>{toTimeText}</Text>
                                            </TouchableOpacity>

                                            {showTTime && (
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
                                        <Text style={styles.subtitleForDateTime}>Event Description
                                            <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                                        </Text>
                                        <TextInput
                                            placeholder='Event Description'
                                            multiline
                                            enablesReturnKeyAutomatically={true}
                                            value={description}
                                            onChangeText={text => setDescription(text)}
                                            style={styles.input} />
                                    </View>
                                    <View style={styles.lineStyle}></View>
                                </View>

                            }

                            {navTabChosen == 3 &&
                                <View style={{ marginBottom: 10 }}>
                                    {eventList == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)' }}>-No Event-</Text> : eventList.map((item, index) =>
                                    (
                                        <View style={styles.reviewContainer} key={index}>

                                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                <Text style={styles.subtitle}>{item.title}</Text>

                                                {owner ? <TouchableOpacity onPress={(() => editEvent(item))}>
                                                    <Icon name='pencil' size={28} color='#38761D'></Icon>
                                                </TouchableOpacity> : null}

                                                {owner ? <TouchableOpacity
                                                    onPress={() => {
                                                        deleteEvent(item.eventID);
                                                    }}
                                                >
                                                    <Icons style={{ right: -15 }} name="close-circle-outline" size={28} color='rgb(210, 24, 0)' />
                                                </TouchableOpacity> : null}
                                            </View>


                                            <Text style={styles.time}>Date: {moment.unix(item.fromDate.seconds).format("DD-MMM-YYYY")} - {moment.unix(item.toDate.seconds).format("DD-MMM-YYYY")}</Text>
                                            <Text style={styles.time}>Time: {item.fromTime} : {item.toTime}</Text>
                                            <Text style={{ fontWeight: 'bold' }}>{"\n"}Description: </Text>
                                            <Text style={styles.content}>{item.description}</Text>
                                        </View>))}
                                </View>}



                            {navTabChosen == 4 && <View style={{ marginBottom: 25 }}>
                                <Text style={{ fontWeight: 'bold', color: 'rgba(11, 61, 42, 1)' }}>Category</Text>
                                <Text style={styles.content}>{place.category}</Text>

                                <Text style={styles.subtitle}>Operating Day</Text>
                                <Text style={styles.content}>{place.fromDayOfWeek == place.toDayOfWeek ? "daily" : place.fromDayOfWeek + " - " + place.toDayOfWeek}</Text>

                                <Text style={styles.subtitle}>Operating Time</Text>
                                <Text style={styles.content}>{place.fromTime} : {place.toTime}</Text>

                                <Text style={styles.subtitle}>Entrance Fee</Text>
                                {place.entranceFee.trim() ? <Text style={styles.content}>{place.entranceFee}</Text> : <Text>free</Text>}

                                <Text style={styles.subtitle}>Address</Text>
                                <View>
                                    <Text>{place.addressLine1},</Text>
                                    {place.addressLine2.trim() ? <Text>{place.addressLine2},</Text> : null}
                                    <Text>{place.postcode} {place.city}, {place.state}.</Text>
                                </View>
                            </View>
                            }
                        </ScrollView>
                    </View>
                    {(navTabChosen == 2 || navTabChosen == 3) &&
                        <View style={styles.goTopContainer}>
                            <TouchableOpacity onPress={goTop}><Icons name={"chevron-up-outline"} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }

                    {navTabChosen == 2 && !owner &&
                        <View style={styles.reviewIconContainer}>
                            <TouchableOpacity onPress={reviewButtonEvent} ><Icons name={iconName} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }

                    {navTabChosen == 3 && owner &&
                        <View style={styles.reviewIconContainer}>
                            <TouchableOpacity onPress={eventButtonEvent} ><Icons name={iconName} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }

                    {navTabChosen == 3 && owner && addEvent &&
                        <View style={styles.cleanEventText}>
                            <TouchableOpacity onPress={deleteEventContent} ><Icons name={"close"} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

export default PlaceDisplay

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "white"
    },

    cardImage: {
        flex: 1,
        height: windowHeight * 0.4,
        width: windowWidth,
    },

    iconContainer: {
        height: 50,
        width: 50,
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 30,
        elevation: 10,
        top: -20,
        right: 10,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },

    detailsContainer: {
        top: -30,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingVertical: 20,
        paddingHorizontal: 20,
        backgroundColor: "white",
        flexGrow: 1
    },

    rowContainer: {
        flexDirection: "row",
        marginVertical: 2,
        alignItems: 'center',
        paddingHorizontal: 5
    },

    navContainer: {
        height: 30,
        width: '100%',
        marginVertical: 10,
        alignContent: 'center',
        alignItems: 'center',
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        backgroundColor: 'rgba(251, 248, 246, 0.8)',
    },

    colorDefault: {
        color: 'rgba(0, 0, 0, 0.4)',
    },

    colorFocus: {
        color: '#38761D',
        fontWeight: 'bold',
    },

    contentContainer: {
        width: windowWidth * 0.9,
        height: windowHeight * 0.38,
        bottom: 10,
        flexGrow: 1,
        marginVertical: 15,
        paddingVertical: 0
    },

    content: {
        textAlign: 'justify',
        alignItems: 'center'

    },

    subtitle: {
        fontWeight: 'bold',
        color: 'rgba(11, 61, 42, 1)',
        marginTop: 15,
        width: "80%"
    },

    reviewIconContainer: {
        height: 50,
        width: 50,
        position: 'absolute',
        backgroundColor: '#38761D',
        borderRadius: 30,
        elevation: 15,
        bottom: 50,
        right: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },

    input: {
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        marginTop: 5,
        marginHorizontal: 5
    },

    reviewContainer: {
        backgroundColor: 'rgba(211,229,207, 0.5)',
        paddingHorizontal: 31,
        paddingVertical: 5,
        paddingBottom: 15,
        borderRadius: 10,
        marginTop: 10,
    },

    userReviewContainer: {
        backgroundColor: 'rgba(224,210,217, 0.5)',
        paddingHorizontal: 31,
        paddingVertical: 5,
        paddingBottom: 15,
        borderRadius: 10,
        marginTop: 10,
    },

    leftArrowContainer: {
        height: 50,
        width: 50,
        position: 'absolute',
        borderRadius: 30,
        left: 0,
        top: windowHeight * 0.17,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: 10,
        backgroundColor: "rgba(224, 210, 217, 0.7)"
    },

    rightArrowContainer: {
        height: 50,
        width: 50,
        position: 'absolute',
        borderRadius: 30,
        right: 0,
        top: windowHeight * 0.17,
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginRight: 10,
        backgroundColor: "rgba(224, 210, 217, 0.7)"
    },

    reviewerName: {
        fontWeight: 'bold',
        color: 'rgba(11, 61, 42, 1)',
        marginTop: 15,
        width: '59%',
        marginLeft: 4
    },

    time: {
        textAlign: 'justify',
        alignItems: 'center',
        fontSize: 11,
        color: "rgba(135, 135, 135, 1)"
    },

    reviewRowContainer: {
        flexDirection: "row",
        marginVertical: 2,
        alignItems: 'flex-end',
        justifyContent: 'space-around'
    },

    dayTimeRowContainer: {
        flexDirection: 'row',
        paddingHorizontal: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingVertical: 1,
    },

    DayPickerStyle: {
        height: 45,
        width: 130,
        marginTop: 0,
        backgroundColor: "rgba(0, 0, 0, 0.4)"
    },

    buttonTime: {
        backgroundColor: 'rgb(183, 193, 172)',
        width: '30%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 1
    },

    buttonText: {
        color: 'white',
        fontWeight: '700',
        fontSize: 12,
        textAlign: 'center'
    },

    subtitleForDateTime: {
        fontWeight: 'bold',
        color: 'rgba(11, 61, 42, 1)',
        marginTop: 10,
        paddingTop: 15
    },

    cleanEventText: {
        height: 50,
        width: 50,
        position: 'absolute',
        backgroundColor: '#C12929',
        borderRadius: 30,
        elevation: 15,
        bottom: 50,
        right: 80,
        alignItems: 'center',
        justifyContent: 'center',
    },

    lineStyle: {
        borderBottomWidth: 0,

        marginTop: 70,
        marginBottom: 2

    },

    formContainer: {
        backgroundColor: "#F8F8F8",
        paddingHorizontal: 5,
        borderRadius: 10,
        paddingBottom: 20
    },

    goTopContainer: {
        height: 50,
        width: 50,
        position: 'absolute',
        backgroundColor: '#38761D',
        borderRadius: 30,
        elevation: 15,
        bottom: 50,
        left: 15,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

