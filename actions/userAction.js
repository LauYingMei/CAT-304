import { auth, db } from '../firebase'
import * as firebase from 'firebase'
import { Alert } from 'react-native'
import { useNavigation } from '@react-navigation/native'
import React, { useState, useEffect } from 'react'
import {deletePlace} from './placeAction'

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

