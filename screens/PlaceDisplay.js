import { useNavigation, useRoute } from '@react-navigation/native'
import React, { useEffect, useRef, useState } from 'react';
import DateTimePicker from '@react-native-community/datetimepicker'
import moment from 'moment'
import { auth, db } from '../firebase'
import Icons from 'react-native-vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { BackHandler, LogBox } from 'react-native';
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
    addNewBookmark,
    removeBookmark,
    addNewReview,
    toDeleteReview,
    addNewEvent,
    toDeleteEvent,
    updateEvent
} from '../actions/placeAction'

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
    Platform
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
    const [role, setRole] = useState("owner")
    const [place, setPlace] = useState('')
    const [reviewList, setReviewList] = useState('')
    const [eventList, setEventList] = useState('')
    const [addEvent, setToAddEvent] = useState(false)
    const [eventTitle, setEventTitle] = useState('')
    const [fromDate_String, setFromDate_String] = useState(new Date())
    const [toDate_String, setToDate_String] = useState(new Date())
    const [fromDate, setFromDate] = useState(new Date())
    const [toDate, setToDate] = useState(new Date())
    const [fromTime, setFromTime] = useState(new Date())
    const [toTime, setToTime] = useState(new Date())
    const [fromTimeToShow, setFromTimeToShow] = useState(new Date())
    const [toTimeToShow, setToTimeToShow] = useState(new Date())
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
    const [expiredEvent, setExpiredEvent] = useState('')


    const fromTimeText = fromTimeIsSet ? fromTime : '-From-';
    const toTimeText = toTimeIsSet ? toTime : '-To-';

    const fromDateText = fromDateIsSet ? fromDate_String : '-From-';
    const toDateText = toDateIsSet ? toDate_String : '-To-';

    const numArray = [1, 2, 3, 4, 5]
    const ref = useRef(0)
    const flatRef = useRef(0)

    useEffect(() => {
        getPlace()

        // control physical back button
        const backAction = () => {
            navigation.replace("HomeScreen")
            return true;
          };
      
          const backHandler = BackHandler.addEventListener(
            "hardwareBackPress",
            backAction
          );
      
          return () => backHandler.remove();
    }, [])


    // Scroll to top of scrollview (got animated when pressed on naviagation tap)
    const goTop = () => {
        ref.current.scrollTo({
            y: 0,
            animated: true
        })
    }

    // Scroll to top of scrollview (no animated when pressed on naviagation tap)
    const goTop1 = () => {
        ref.current.scrollTo({
            y: 0,
            animated: false
        })
    }

    // Scroll to previous image
    const goPrevious = (index) => {
        flatRef.current.scrollToIndex({
            index: index - 1,
            animated: true
        })
    }

    // Scroll to next image
    const goLater = (index) => {
        flatRef.current.scrollToIndex({
            index: index + 1,
            animated: true
        })
    }

    // get "Place" from firebase
    const getPlace = async () => {
        await db.collection("Place").doc(placeID)
            .onSnapshot((doc) => {
                if (doc.exists) {
                    if (doc.data().userID == userID) {
                        setOwner(true)
                    }

                    else {
                        setOwner(false)
                        getBookmark()
                    }

                    setPlace(doc.data())
                    console.log("Get place information successfully")
                }
                else {
                    Alert.alert("This page is not found.")
                    console.log("No such document!");
                }
            }), ((error) => {
                console.log("Error getting document: ", error(message))
            })

        getReview()
        getEvent()
        getUserReview()
    }

    // to set bookmarked after checking user's bookmark list
    const getBookmark = () => {
        var document = db.collection("users").doc(userID)
        document.get()
            .then((doc) => {
                if (doc.exists)
                    setRole(doc.data().role)
                else
                    console.log("No such user!")
            })

        document.collection("bookmarks").where("placeID", "==", placeID)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    setBookmarked(true)
                })
            })
            .catch((error) => {
                console.log("Error check bookmark: ", error(message));
            })
    }

    // to get user's own review to this place
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

    // to get all reviews from firebase
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

    // to get event list from firebase
    const getEvent = async () => {
        await db.collection("Place").doc(placeID).collection("events")
            .orderBy("fromDate")
            .get()
            .then((querySnapshot) => {
                setEventList('')
                setExpiredEvent('')

                querySnapshot.forEach((doc) => {

                    if (doc.data().toDate.toDate().setHours(0, 0, 0, 0) >= new Date().setHours(0, 0, 0, 0)) {
                        setEventList(eventList => { return ([...eventList, doc.data()]) });
                        console.log("Get events information successfully")
                    }
                    else {
                        setExpiredEvent(expiredEvent => { return ([...expiredEvent, doc.data()]) });
                        console.log("Get expired events information successfully")
                    }
                });
            })
            , ((error) => {
                console.log("Error getting events: ", error(message));
            })
    }

    // to add bookmark or remove bookmark
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

    // to display star(s) given by user (touchable)
    const Star = ({ num }) => {
        return <TouchableOpacity key={num} disabled={disable} onPress={() => { setStarNum(num) }}>
            {starGiven >= num ? <Icons name='md-star' size={25} color={'rgba(243, 116, 10, 0.8)'}></Icons> :
                <Icons name='md-star-outline' size={25} color={'rgba(243, 116, 10, 0.8)'}></Icons>}
        </TouchableOpacity>
    }

    // to display rating given at each review (not touchable)
    const Rating = ({ num, ratingGiven }) => {
        return ratingGiven >= num ? <Icons name='md-star' size={15} color={'rgba(243, 116, 10, 0.8)'}></Icons> :
            <Icons name='md-star-outline' size={15} color={'rgba(243, 116, 10, 0.8)'}></Icons>
    }

    // to run each button event for review section based on condition
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

                    await addNewReview(placeID, review.trim(), starGiven, place.rating, place.totalReviewer)
                    setReview('')
                    getPlace()
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

    // to delete own review
    const deleteReview = async () => {
        Alert.alert("Delete", "Are You Sure?", [
            {
                text: "Yes",
                onPress: async () => (
                    await toDeleteReview(placeID, starGiven, place.rating, place.totalReviewer),
                    setIconName('add'),
                    setEditable(true),
                    setDisability(false),
                    setReview(""),
                    getReview(),
                    getUserReview(),
                    setUserReview(''),
                    getPlace()
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

    // to run each button event for event section based on condition
    const eventButtonEvent = async () => {
        
        if (addEvent) {

            if (eventTitle.trim() && description.trimStart() && description.trimEnd()
                && fromDateIsSet && toDateIsSet && fromTimeIsSet && toTimeIsSet) {

                if (eventEditable) {
                    await updateEvent(placeID, eventID, eventTitle, fromDate, toDate, fromTime, toTime, description.trim())
                    setEventEditable(false)
                }
                else {
                    await addNewEvent(placeID, place.spotName, eventTitle, fromDate, toDate, fromTime, toTime, description.trim())
                }

                cleanEventTextInput()
                await getEvent()

            }
            else {
                Alert.alert('Reminder', 'Please enter all the required fields!')
            }
        }
        else {
            setIconName('checkmark-sharp')
            setToAddEvent(true)
            goTop()
        }
    }

    // to empty all text inputs of event form
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

    // to delete particular event
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

    // to delete all no saved event details (empty all fields)
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

    // to edit particular event
    const editEvent = (item) => {
        setIconName('checkmark-sharp')
        setToAddEvent(true)
        setEventTitle(item.title)
        setFromDateIsSet(true)
        setToDateIsSet(true)
        setFromDate_String(moment.unix(item.fromDate.seconds).format("DD-MM-YYYY"))
        setToDate_String(moment.unix(item.toDate.seconds).format("DD-MM-YYYY"))
        setFromDate(item.fromDate.toDate())
        setToDate(item.toDate.toDate())
        setFromTimeIsSet(true)
        setToTimeIsSet(true)
        setFromTime(item.fromTime)
        setToTime(item.toTime)
        setDescription(item.description)
        setEventID(item.eventID)
        setEventEditable(true)
    }

    // Event that hapen when the fromDate(start of event date) is updated
    const fromDatePickerEvent = (event, selectedDate) => {
        const currentDate = selectedDate || fromDate
        setShowFDate(Platform.OS == 'ios')
        setFromDate(currentDate)
        if (toDate < currentDate) {
            setToDate(currentDate)
            setToDate_String(moment(currentDate).format("DD-MM-YYYY"))
        }
        setFromDate_String(moment(currentDate).format("DD-MM-YYYY"))
        setFromDateIsSet(true)
    }

    // Event that hapen when the toDate(end of event date) is updated
    const toDatePickerEvent = (event, selectedDate) => {
        const currentDate = selectedDate || toDate
        setShowTDate(Platform.OS == 'ios')
        setToDate(currentDate)
        setToDate_String(moment(currentDate).format("DD-MM-YYYY"))
        setToDateIsSet(true)
    }

    // make hours and minutes in two digits format
    function makeTwoDigit(time) {
        if (time / 10 < 1)
            return (`0${time}`)
        else
            return (`${time}`)
    }

    // Event that hapen when the fromTime(start of event time) is updated
    const fromTimePickerEvent = (event, selectedTime) => {
        const currentTime = selectedTime || fromTime
        setShowFTime(Platform.OS == 'ios')
        setFromTimeToShow(currentTime)
        setFromTime(getTimes(currentTime))
        setFromTimeIsSet(true)
    }

    // Event that hapen when the toTime(end of event time) is updated
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

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior="position"
        >
            <SafeAreaView>
                <StatusBar hidden translucent backgroundColor="rgba(0,0,0,0.5)" />

                {/* Display selected images */}
                <View>
                    <FlatList
                        ref={flatRef}
                        horizontal
                        scrollEventThrottle={16}
                        showsHorizontalScrollIndicator={false}
                        snapToInterval={windowWidth}
                        keyExtractor={(item) => item.uri.toString()}
                        data={place.image}

                        renderItem={({ item, index }) => (
                            <Card image={item} index={index}
                                keyExtractor={(item) => item}>
                            </Card>
                        )}
                    />
                    <TouchableOpacity onPress={() => navigation.replace("HomeScreen")} style={styles.goBackStyle}><Icons name="md-arrow-back-outline" size={35} color='#E1E2DA' /></TouchableOpacity>
                </View>

                <View style={styles.detailsContainer}>

                    {/* bookmark button */}
                    {(owner || role == "user") && <View style={styles.iconContainer}>
                        {!owner && role == "user" && <TouchableOpacity onPress={addBookmark}>
                            {bookmarked ?
                                <Icon name="bookmark" size={30} color='rgb(183, 193, 172)' /> :
                                <Icon name="bookmark-plus-outline" size={30} color='#38761D' />}
                        </TouchableOpacity>}

                        {/* edit button */}
                        {owner && <TouchableOpacity onPress={() => navigation.navigate('Place', { placeID: placeID })}>
                            <Icon name='pencil' size={30} color='#38761D'></Icon>
                        </TouchableOpacity>}
                    </View>}

                    {/* spot place name */}
                    <Text style={{
                        color: "black",
                        fontSize: 18,
                        fontWeight: "bold",
                        fontFamily: "sans-serif-medium",
                        marginLeft: 5,
                        marginBottom: 5,
                        width: '85%'
                    }}>{place.spotName}</Text>


                    {/* location (address) */}
                    <View style={styles.rowContainer}>
                        <Icons name="location" size={28} color='#38761D' />
                        <Text style={{
                            color: '#38761D', fontWeight: "bold", padding: 4
                        }}>{place.city}, {place.state}</Text>
                    </View>

                    {/* current rating */}
                    <View style={styles.rowContainer}>
                        <Icons name="star" size={18} color='rgba(243, 116, 10, 0.8)' style={{ paddingLeft: 5 }} />
                        <Text style={{ paddingLeft: 10 }}>{place.rating == 0 ? "no rating" : place.rating}</Text>
                    </View>


                    {/* Navigation tab */}
                    <View style={styles.navContainer}>
                        <TouchableOpacity onPress={() => { setNavTabChosen(1), goTop1() }}><Text style={navTabChosen == 1 ? styles.colorFocus : styles.colorDefault}>About</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setNavTabChosen(2), goTop1() }}><Text style={navTabChosen == 2 ? styles.colorFocus : styles.colorDefault}>Review</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setNavTabChosen(3), goTop1() }}><Text style={navTabChosen == 3 ? styles.colorFocus : styles.colorDefault}>Event</Text></TouchableOpacity>
                        <TouchableOpacity onPress={() => { setNavTabChosen(4), goTop1() }}><Text style={navTabChosen == 4 ? styles.colorFocus : styles.colorDefault}>Operation</Text></TouchableOpacity>
                    </View>



                    <View style={styles.contentContainer}>
                        <ScrollView ref={ref} showsVerticalScrollIndicator={false} style={{ flexGlow: 1, paddingHorizontal: 20 }} >

                            {/* About */}
                            {navTabChosen == 1 && <View><Text style={styles.content}>{place.details}</Text><View style={styles.lineStyle}></View></View>}


                            {/* Review */}
                            {/** Review input fields **/}
                            {/***  rating field  ***/}
                            {navTabChosen == 2 && addreview && !owner && role == "user" &&
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

                                    {/***  review field  ***/}
                                    <TextInput
                                        placeholder='write your review here...'
                                        editable={editable}
                                        multiline
                                        minHeight={windowHeight * 0.07}
                                        maxHeight={windowHeight * 0.15}
                                        value={review}
                                        onChangeText={text => setReview(text)}
                                        style={styles.input} />
                                </View>
                            }

                            {/**  display own review  **/}
                            {navTabChosen == 2 &&
                                <View style={{ marginBottom: 10 }}>
                                    {!userReview == "" && role == "user" && <View>
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

                                    {/**  display all other review(s)  **/}
                                    {reviewList == '' ? <Text style={{ color: 'rgba(0,0,0,0.4)' }}>-No Review-</Text> :
                                        <View>
                                            {reviewList.length == 1 && reviewList[0].userID == userID ? null : <Text style={styles.subtitle}>Other reviews</Text>}
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
                                                </View>))}
                                            <View style={styles.lineStyle}></View>
                                        </View>}
                                </View>
                            }


                            {/* Event */}
                            {/**  Event input fields  **/}
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
                                            {((Platform.OS == "ios" && !showFDate) || (Platform.OS != "ios")) &&
                                                <TouchableOpacity
                                                    style={styles.buttonTime}
                                                    onPress={() => setShowFDate(true)}
                                                >
                                                    <Text style={styles.buttonText}>{fromDateText}</Text>
                                                </TouchableOpacity>}

                                            {showFDate && (
                                                <DateTimePicker
                                                    testID='dateTimePicker'
                                                    value={fromDate}
                                                    mode={'date'}
                                                    minimumDate={new Date()}
                                                    display='default'
                                                    onChange={fromDatePickerEvent}
                                                    style={Platform.OS == "ios" ? styles.dateTimeStyle : null}
                                                />
                                            )}

                                            <Text style={styles.content}>To:</Text>
                                            {((Platform.OS == "ios" && !showTDate) || (Platform.OS != "ios")) &&
                                                <TouchableOpacity
                                                    style={styles.buttonTime}
                                                    onPress={() => setShowTDate(true)}
                                                >
                                                    <Text style={styles.buttonText}>{toDateText}</Text>
                                                </TouchableOpacity>}

                                            {showTDate && (
                                                <DateTimePicker
                                                    testID='dateTimePicker'
                                                    value={toDate}
                                                    mode={'date'}
                                                    display='default'
                                                    minimumDate={fromDate}
                                                    onChange={toDatePickerEvent}
                                                    style={Platform.OS == "ios" ? styles.dateTimeStyle : null}
                                                />
                                            )}
                                        </View>

                                        {/* Event Time */}
                                        <Text style={styles.subtitleForDateTime}>Event Time
                                            <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                                        </Text>

                                        <View style={styles.dayTimeRowContainer}>
                                            <Text style={styles.content}>From:</Text>
                                            {((Platform.OS == "ios" && !showFTime) || (Platform.OS != "ios")) &&
                                                <TouchableOpacity
                                                    style={styles.buttonTime}
                                                    onPress={() => setShowFTime(true)}
                                                >
                                                    <Text style={styles.buttonText}>{fromTimeText}</Text>
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

                                            <Text style={styles.content}>To:</Text>
                                            {((Platform.OS == "ios" && !showTTime) || (Platform.OS != "ios")) &&
                                                <TouchableOpacity
                                                    style={styles.buttonTime}
                                                    onPress={() => setShowTTime(true)}
                                                >
                                                    <Text style={styles.buttonText}>{toTimeText}</Text>
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

                                        {/* Event Description */}
                                        <Text style={styles.subtitleForDateTime}>Event Description
                                            <Text style={{ color: 'rgb(210, 24, 0)' }}> *</Text>
                                        </Text>
                                        <TextInput
                                            placeholder='Event Description'
                                            multiline
                                            maxHeight={windowHeight * 0.3}
                                            enablesReturnKeyAutomatically={true}
                                            value={description}
                                            onChangeText={text => setDescription(text)}
                                            style={styles.input} />
                                    </View>
                                    <View style={styles.lineStyle}></View>
                                </View>

                            }

                            {/**  display all events  **/}
                            {navTabChosen == 3 &&
                                <View style={{ marginBottom: 10 }}>

                                    {/**  display event(s) - not expired  **/}
                                    <View>
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


                                                <Text style={styles.time}>Date: {moment.unix(item.fromDate.seconds).format("DD-MMM-YYYY (ddd)")} - {moment.unix(item.toDate.seconds).format("DD-MMM-YYYY (ddd)")}</Text>
                                                <Text style={styles.time}>Time: {item.fromTime} : {item.toTime}</Text>
                                                <Text style={{ fontWeight: 'bold' }}>{"\n"}Description: </Text>
                                                <Text style={styles.content}>{item.description}</Text>
                                            </View>))}
                                    </View>

                                    {/**  display expired event(s)  **/}
                                    <View>
                                        {!expiredEvent == '' && owner && <View>
                                            <Text style={styles.subtitle}>Expired event(s)</Text>
                                            {expiredEvent.map((item, index) =>
                                            (
                                                <View style={styles.userReviewContainer} key={index}>

                                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                                        <Text style={styles.subtitle}>{item.title}</Text>


                                                        {owner ? <TouchableOpacity
                                                            onPress={() => {
                                                                deleteEvent(item.eventID);
                                                            }}
                                                        >
                                                            <Icons style={{ right: -15 }} name="close-circle-outline" size={28} color='rgb(210, 24, 0)' />
                                                        </TouchableOpacity> : null}
                                                    </View>


                                                    <Text style={styles.time}>Date: {moment.unix(item.fromDate.seconds).format("DD-MMM-YYYY (ddd)")} - {moment.unix(item.toDate.seconds).format("DD-MMM-YYYY (ddd)")}</Text>
                                                    <Text style={styles.time}>Time: {item.fromTime} : {item.toTime}</Text>
                                                    <Text style={{ fontWeight: 'bold' }}>{"\n"}Description: </Text>
                                                    <Text style={styles.content}>{item.description}</Text>
                                                </View>))}
                                        </View>
                                        }
                                    </View>
                                    <View style={styles.lineStyle}></View>
                                </View>}



                            {/* Operation */}
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
                                <View style={styles.lineStyle}></View>
                            </View>
                            }
                        </ScrollView>
                    </View>

                    {/*  Go Top Button  */}
                    {(navTabChosen == 2 || navTabChosen == 3) &&
                        <View style={styles.goTopContainer}>
                            <TouchableOpacity onPress={goTop}><Icons name={"chevron-up-outline"} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }

                    {/**  Review Button  **/}
                    {navTabChosen == 2 && !owner && role == "user" &&
                        <View style={styles.reviewIconContainer}>
                            <TouchableOpacity onPress={reviewButtonEvent} ><Icons name={iconName} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }

                    {/**  Event Button  **/}
                    {navTabChosen == 3 && owner &&
                        <View style={styles.reviewIconContainer}>
                            <TouchableOpacity onPress={eventButtonEvent} ><Icons name={iconName} size={28} color={'white'}></Icons></TouchableOpacity>
                        </View>
                    }

                    {/**  No Save Event Button  **/}
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
        height: windowHeight * 0.6,
        paddingTop: 15,
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
        height: windowHeight * 0.5,
        bottom: windowHeight * 0.04,
        flexGrow: 1,
        marginTop: 15,
        marginBottom: 10,
        paddingBottom: 10,
        paddingTop: 20
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
        bottom: windowHeight * 0.003,
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
        marginHorizontal: 5,
        minHeight: windowHeight * 0.07
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
        width: '55%',
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
        width: '35%',
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
        bottom: windowHeight * 0.003,
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
        bottom: windowHeight * 0.003,
        left: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    goBackStyle: {
        height: 50,
        width: 50,
        position: 'absolute',
        borderRadius: 30,
        top: windowHeight * 0.03,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 10
    },

    dateTimeStyle: {
        position: 'relative',
        backgroundColor: 'rgba(0, 0, 0, 0.03)',
        width: '30%',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 10
    }
})

