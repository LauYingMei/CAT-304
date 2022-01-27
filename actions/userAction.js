import { auth, db } from '../firebase'
import * as firebase from 'firebase'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'


// update user information
export async function updateUser(user, userID) {

    var currentUser = db.collection("users").doc(userID);
    await currentUser.update({
        email : user.email,
        userName : user.userName,
        ContactNo : user.ContactNo,
        role : user.role,
    })
        .then(function () {
            console.log('User is updated by user ', auth.currentUser?.uid)
            Alert.alert("User is updated!");

        }).catch(error => {
            alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })
}

// add new user
export async function addNewUser(email,ContactNo, role, userName) {

    
    var doc = db.collection("users").doc(auth.currentUser?.uid);
    await doc.set({
        email: email,
        userName: userName,
        ContactNo: ContactNo,
        role: role,
    })
        .then(function () {
            console.log('Event is added by: ', auth.currentUser?.uid)
            Alert.alert("You are Registered!");

        }).catch(error => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log(error.message)
        })
    }
    function clearCollection(path) {
        const ref = firestore.collection(path)
        ref.onSnapshot((snapshot) => {
          snapshot.docs.forEach((doc) => {
            ref.doc(doc.id).delete()
          })
        })
      }

// delete user account
export async function deleteAccount(userID) {
   // path= db.collection("Place").where("userID", "==", userID).collection("reviews")
   // clearCollection(path)
    await db.collection("Place").where("userID", "==", userID)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        //setPlaceID(doc.data().placeID)
        doc.ref.delete();
        console.log("All Places successfully deleted!")
        });
        })
        .catch((error) => {
            console.log("Error removing all places")
        });
    
/*
        await db.collection("Place").doc(placeID)
        .collection("reviews").doc(userID)
        .delete().then(() => {
            console.log("Review successfully deleted!")
           // Alert.alert("Review Removed!");
        }).catch((error) => {
           // Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing review: ", error(message))
            return
        })

        await db.collection("Place").doc(placeID)
        .collection("events").doc(userID)
        .delete().then(() => {
            console.log("Events successfully deleted!")
           // Alert.alert("Review Removed!");
        }).catch((error) => {
           // Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing event: ", error(message))
            return
        })
        */
        await db.collection("Event").where("userID", "==", userID)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        doc.ref.delete();
        console.log("All events successfully deleted!")
        });
        
        })
        .catch((error) => {
            console.log("Error removing all events")
        });
    await db.collection("users").doc(userID)
        .delete().then(() => {
            console.log("Doc successfully deleted!")
            
        }).catch((error) => {
            console.log("Error removing doc")
        })
        const user = firebase.auth().currentUser;

        user.delete().then(() => {
            Alert.alert("Account is deleted!");
        }).catch((error) => {
            console.log("Error removing account")
        });
        
}

export async function reauthenticate(currentPassword){
  const user = firebase.auth().currentUser;

  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email, currentPassword);
  
  user.reauthenticateWithCredential(credential).then(() => {
    console.log("You are reauthenticated")
  }).catch((error) => {
    console.log("Error updating password: ", error.message)
  });
    return user.reauthenticateWithCredential(credential);
  }

//reset password
export async function resetPw(currentPassword,newPassword) {
    reauthenticate(currentPassword).then(() => {
        const user = firebase.auth().currentUser;

        user.updatePassword(newPassword).then(() => {
            Alert.alert("Password is updated!");
            
        }).catch((error) => {
            console.log("Error updating password: ", error.message)
        });
    });
}


//forget password
export async function forgetPw(email) {
    var auth = firebase.auth();
    var emailAddress = email;
    auth.sendPasswordResetEmail(emailAddress)
    .then(function() {  
        Alert.alert("Please check your email");
    })
    .catch(
        error => alert(error.message)
    );
}
// delete particular bookmark
export async function DeleteBookmark(userID, bookmarkID) {
    await db.collection("users").doc(userID)
        .collection("bookmarks").doc(bookmarkID)
        .delete().then(() => {
            console.log("Bookmark successfully deleted!")
            Alert.alert("Bookmark Removed!");
        }).catch((error) => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing bookmark: ", error(message))
        })

}


// delete all bookmark
export async function clearBookmark(userID) {
    await db.collection("users").doc(userID)
        .collection("bookmarks")
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        doc.ref.delete();
        });
        console.log("All Bookmark successfully deleted!")
            Alert.alert("All Bookmark Removed!");
        })
        .catch((error) => {
            Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing all bookmarks: ", error(message))
        });
    };

// delete all places and events
/*
export async function clearPlaces(userID) {
    await db.collection("places").where("userID", "==", userID)
        .get()
        .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        doc.ref.delete();
        });
        console.log("All Places successfully deleted!")
           // Alert.alert("All Places Removed!");
        })
        .catch((error) => {
          //  Alert.alert("Something went wrong. Please try later! ");
            console.log("Error removing all places: ", error(message))
        });
    };*/
