import { auth, db } from '../firebase'
import * as firebase from 'firebase'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'


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
        details: place.details,
        image: place.image,
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(function () {
            console.log('Place is updated by user with ID: ', auth.currentUser?.uid)
            Alert.alert("Place is updated!");

        }).catch(error => {
            alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })
}

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
            alert(error.message);
            console.log("Save bookmark unsuccesslly")
        })
}

export async function removeBookmark(ID) {
    var doc = await db.collection("users").doc(auth.currentUser?.uid)
    doc.collection("bookmarks").doc(ID).delete()
        .then(() => {
            console.log('Bookmark is deleted by: ', auth.currentUser?.uid)
            Alert.alert("Bookmark removed!");

        }).catch(error => {
            alert(error.message);
            console.log("Remove bookmark unsuccesslly")
        })
}


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
        author: user.firstName.concat(" ", user.lastName),
        userID: auth.currentUser?.uid,
        review: review,
        rating: starGiven,
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    })
        .then(function () {
            console.log('Review is added by: ', auth.currentUser?.uid)
            Alert.alert("Review Saved!");

        }).catch(error => {
            alert(error.message);
            console.log("Add review unsuccesslly")
            return
        })

    // update rating and totalReviewer
    var newRating = Math.round((totalReviewer * rating + starGiven) / (totalReviewer + 1) * 100) / 100
    if(newRating>5){
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

export async function toDeleteReview(placeID, starGiven, rating, totalReviewer) {
    await db.collection("Place").doc(placeID)
        .collection("reviews").doc(auth.currentUser?.uid)
        .delete().then(() => {
            console.log("Review successfully deleted!")
            Alert.alert("Review Removed!");
        }).catch((error) => {
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
        if(newRating>5){
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

export async function addNewEvent(placeID, title, fromDate, toDate, fromTime, toTime, description) {

    // add event by creating a subcollection
    var doc = db.collection("Place").doc(placeID).collection("events").doc();
    await doc.set({
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
            alert(error.message);
            console.log("Add event unsuccesslly")
        })
}

export async function toDeleteEvent(placeID, eventID) {
    await db.collection("Place").doc(placeID)
        .collection("events").doc(eventID)
        .delete().then(() => {
            console.log("Event successfully deleted!")
            Alert.alert("Event Removed!");
        }).catch((error) => {
            console.log("Error removing event: ", error(message))
        })
}

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
            alert(error.message);
            console.log("Update event unsuccesslly")
        })
}
