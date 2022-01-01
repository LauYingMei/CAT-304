import { auth, db } from '../firebase'
import * as firebase from 'firebase'
import { Alert } from 'react-native'

export function addNewPlace(place) {
    db.collection("Place").add({
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
        event: place.event,
        image: place.image,
        rating: '',
        review: '',
        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
    })
        .then(function () {
            console.log('Place is created by user with ID: ', auth.currentUser?.uid)
            Alert.alert("Place is created successfully!");
        }).catch(error => alert(error.message))
}
