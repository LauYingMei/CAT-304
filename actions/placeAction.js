import { auth, db, storage } from '../firebase'
import * as firebase from 'firebase'
import { Alert, ActivityIndicator, Dimensions, Modal } from 'react-native'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

// add new place
export async function addNewPlace(place) {

    var newPlace = db.collection("Place").doc();
    await newPlace.set({
        userID: auth.currentUser?.uid,
        spotName: place.spotName,
        category: place.category,
        fromDayOfWeek: place.fromDayOfWeek,
        toDayOfWeek: place.toDayOfWeek,
        fromTime: place.fromTime,
        toTime: place.toTime,
        entranceFee: place.entranceFee,
        addressLine1: place.addressLine1,
        addressLine2: place.addressLine2,
        city: place.city,
        postcode: place.postcode,
        state: place.state,
        latitude: place.latitude,
        longitude: place.longitude,
        details: place.details,
        image: place.image,
        rating: 0,
        totalReviewer: 0,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(function () {
            console.log('Place is created by user with ID: ', auth.currentUser?.uid)
            Alert.alert("Place is created successfully!");

        }).catch(error => {
            alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })

    return newPlace.id
}

// update place information
export async function updatePlace(place, placeID) {

    var currentPlace = db.collection("Place").doc(placeID);
    await currentPlace.update({
        spotName: place.spotName,
        category: place.category,
        fromDayOfWeek: place.fromDayOfWeek,
        toDayOfWeek: place.toDayOfWeek,
        fromTime: place.fromTime,
        toTime: place.toTime,
        entranceFee: place.entranceFee,
        addressLine1: place.addressLine1,
        addressLine2: place.addressLine2,
        city: place.city,
        postcode: place.postcode,
        state: place.state,
        latitude: place.latitude,
        longitude: place.longitude,
        details: place.details,
        image: place.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(function () {
            console.log('Place is updated by user with ID: ', auth.currentUser?.uid)
            Alert.alert("Place is updated!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })
}

// delete place
export async function deletePlace(placeID) {
    var doc = await db.collection("Place").doc(placeID)

    // delete event in subcollection of "Place"
    var internalEvent = doc.collection("events")
    internalEvent.get().then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
            internalEvent.doc(doc1.id).delete().then(() => {
                console.log('Event of', placeID, ' from internal is deleted by: ', auth.currentUser?.uid);
            }).catch((error) => {
                console.log("Error removing external event: ", error(message))
            })
        })
    })

    // delete event in collection "Event"
    var externalEvent = db.collection("Event")
    externalEvent.where("placeID", "==", placeID).get().then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
            externalEvent.doc(doc1.id).delete().then(() => {
                console.log('Event of', placeID, ' from external is deleted by: ', auth.currentUser?.uid);
            }).catch((error) => {
                console.log("Error removing external event: ", error(message))
            })
        })
    })

    // delete review in subcollection of "Place"
    var reviews = doc.collection("reviews")
    reviews.get().then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
            reviews.doc(doc1.id).delete().then(() => {
                console.log('Review of', placeID, ' is deleted by: ', auth.currentUser?.uid);
            }).catch((error) => {
                console.log("Error removing reviews: ", error(message))
            })
        })
    })


    // delete all bookmarks of this place ID in subcollection of "users"
    const usersRef = db.collection("users")
    usersRef.get().then((querySnapshot) => {
        querySnapshot.forEach((doc1) => {
            var user = usersRef.doc(doc1.id).collection("bookmarks").doc(placeID)
                user.get().then((doc2) => {
                    if (doc2.exists) {
                        user.delete().then(() => {
                            console.log(placeID, " deleted from bookmarks of ", doc1.userName);
                        })
                    }
                })
                .catch((error) => {
                    console.log("Error getting user's bookmarks: ", error);
                });
        })
    })


       // delete image in storage
       await doc.get().then((doc) => { 
            doc.data().image.map((image) => {
                var name = image.imageName;
                var ref = storage.ref().child("Places/images/" + name);
    
                ref.delete().then(() => {
                    console.log("delete " + name + " image successfully")
                })
                    .catch((error) => {
                        console.log("delete image " + name + " fail with error: " + error)
                    })   
            })
        })
        

    // delete place
    doc.delete()
        .then(() => {
            console.log('Place', placeID, ' is deleted by: ', auth.currentUser?.uid)
            Alert.alert("Place removed!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Remove place", placeID, "unsuccesslly")
            console.log(error)
        })
}

export async function updateImage(image, placeID) {

    var currentPlace = db.collection("Place").doc(placeID);
    await currentPlace.update({
        image: image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(function () {
            console.log('Image is updated by: ', auth.currentUser?.uid)
            Alert.alert("Image is updated!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })
}

// add new bookmark
export async function addNewBookmark(ID, name) {
    var doc = await db.collection("users").doc(auth.currentUser?.uid)
    doc.collection("bookmarks").doc(ID).set({
        placeID: ID,
        placeName: name,
        time: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            console.log('Bookmark is added by: ', auth.currentUser?.uid)
            Alert.alert("Bookmark added!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Save bookmark unsuccesslly")
        })
}

// remove bookmark
export async function removeBookmark(ID) {
    var doc = await db.collection("users").doc(auth.currentUser?.uid)
    doc.collection("bookmarks").doc(ID).delete()
        .then(() => {
            console.log('Bookmark is deleted by: ', auth.currentUser?.uid)
            Alert.alert("Bookmark removed!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Remove bookmark unsuccesslly")
        })
}

// add new review
export async function addNewReview(placeID, review, starGiven, rating, totalReviewer) {
    var user;

    // get user's name
    await db.collection("users").doc(auth.currentUser?.uid)
        .get()
        .then((doc) => {
            if (doc.exists) {
                console.log("Get user successfully")
                user = doc.data()
            }
            else {
                console.log("No such document!");
                return
            }
        })
        .catch((error) => {
            console.log("Error getting document ", error(message))
            return
        })

    // set review by creating a subcollection
    var doc = db.collection("Place").doc(placeID)
    await doc.collection("reviews").doc(auth.currentUser?.uid).set({
        author: user.userName,
        userID: auth.currentUser?.uid,
        review: review,
        rating: starGiven,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            console.log('Review is added by: ', auth.currentUser?.uid)
            Alert.alert("Review Saved!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log(error.message)
            return
        })

    // update rating and totalReviewer
    var newRating = Math.round((totalReviewer * rating + starGiven) / (totalReviewer + 1) * 100) / 100
    if (newRating > 5) {
        newRating = 5
    }
    await db.collection("Place").doc(placeID)
        .update({
            rating: newRating,
            totalReviewer: firebase.firestore.FieldValue.increment(1)
        })
        .then(() => {
            console.log("update rating successfully! ")
        })
        .catch((error) => {
            console.log("Error getting document ", error(message))
        })
}

// delete review
export async function toDeleteReview(placeID, starGiven, rating, totalReviewer) {
    await db.collection("Place").doc(placeID)
        .collection("reviews").doc(auth.currentUser?.uid)
        .delete().then(() => {
            console.log("Review successfully deleted!")
            Alert.alert("Review Removed!");
        }).catch((error) => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing review: ", error(message))
            return
        })

    //update rating and totalReviewer
    var newRating, newTotalReviewer
    if (totalReviewer <= 1) {
        newRating = 0
        newTotalReviewer = 0
    } else {
        newRating = Math.round((totalReviewer * rating - starGiven) / (totalReviewer - 1) * 100) / 100
        if (newRating > 5) {
            newRating = 5
        }
        newTotalReviewer = totalReviewer - 1
    }

    await db.collection("Place").doc(placeID)
        .update({
            rating: newRating,
            totalReviewer: newTotalReviewer
        })
        .then(() => {
            console.log("update rating successfully! ")
        })
        .catch((error) => {
            console.log("Error getting document ", error(message))
        })
}

// add new event
export async function addNewEvent(placeID, spotName, title, fromDate, toDate, fromTime, toTime, description) {

    // add event by creating a subcollection
    var doc = db.collection("Place").doc(placeID).collection("events").doc();
    await doc.set({
        placeID: placeID,
        spotName: spotName,
        eventID: doc.id,
        title: title,
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            console.log('Event is added by: ', auth.currentUser?.uid)
            Alert.alert("Event Saved!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })


    // store to another collection called "Event"
    var doc2 = db.collection("Event").doc(doc.id);
    await doc2.set({
        placeID: placeID,
        spotName: spotName,
        eventID: doc.id,
        title: title,
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        userID: auth.currentUser?.uid
    })
        .then(function () {
            console.log('Event is added by: ', auth.currentUser?.uid)

        }).catch(error => {
            console.log(error.message)
        })
}

// delete event
export async function toDeleteEvent(placeID, eventID) {
    await db.collection("Place").doc(placeID)
        .collection("events").doc(eventID)
        .delete().then(() => {
            console.log("Event successfully deleted!")
            Alert.alert("Event Removed!");
        }).catch((error) => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing event: ", error(message))
        })

    await db.collection("Event").doc(eventID)
        .delete().then(() => {
            console.log("Event successfully deleted from external collection!")
        }).catch((error) => {
            console.log("Error removing event: ", error(message))
        })
}

// update event
export async function updateEvent(placeID, eventID, title, fromDate, toDate, fromTime, toTime, description) {

    // add event by creating a subcollection
    var doc = db.collection("Place").doc(placeID).collection("events").doc(eventID);
    await doc.update({
        eventID: doc.id,
        title: title,
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            console.log('Event is updated by: ', auth.currentUser?.uid)
            Alert.alert("Event Updated!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })


    var doc2 = db.collection("Event").doc(eventID);
    await doc2.update({
        eventID: doc.id,
        title: title,
        fromDate: fromDate,
        toDate: toDate,
        fromTime: fromTime,
        toTime: toTime,
        description: description,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            console.log('Event is updated by: ', auth.currentUser?.uid)

        }).catch(error => {
            console.log(error.message)
        })
}

// add new trip list
export async function addNewTripList(data, tripName, StartDate, EndDate) {

    var doc2 = db.collection("users").doc(auth.currentUser?.uid).collection("TripLists").doc()
    await doc2.set
        ({
            tripName: tripName,
            tripPhoto: data[0].img,
            tripStartDate: StartDate,
            tripEndDate: EndDate,
            time: firebase.firestore.FieldValue.serverTimestamp(),
        }).then(function () {
            //console.log('Trip is added by: ', auth.currentUser?.uid)
            Alert.alert("Trip saved!");
        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Save trip unsuccessfully")
        })

    var doc3 = db.collection("users").doc(auth.currentUser?.uid).collection("TripLists").doc(doc2.id).collection("TripPlace")
    for (let i = data.length - 1; i >= 0; i--) {
        (data[i].driving_time ? null : data[i].driving_time = 0)
        await doc3.doc().set
            ({
                placeNum: data[i].key.charAt((data[i].key).length - 1),
                placeId: data[i].id,
                placeName: data[i].label,
                driveTime: data[i].driving_time,
                time: firebase.firestore.FieldValue.serverTimestamp()
            })
    }
}

// remove TripList
export async function removeTripList(tripID) {

    var doc = await db.collection("users").doc(auth.currentUser?.uid).collection("TripLists").doc(tripID)
    doc.delete()
        .then(() => {
            console.log('Trip', tripID, 'is deleted by: ', auth.currentUser?.uid)
            Alert.alert("Trip removed!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Remove trip unsuccesslly")
        })
}