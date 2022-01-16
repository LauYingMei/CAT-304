import { auth, db } from '../firebase'
import * as firebase from 'firebase'
import { Alert } from 'react-native'

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
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
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
