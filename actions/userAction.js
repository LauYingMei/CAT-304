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

// add new event
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
// delete user account
export async function deleteAccount(userID) {
    await db.collection("users").doc(userID)
        .delete().then(() => {
            console.log("Doc successfully deleted!")
            
        }).catch((error) => {
            console.log("Error removing doc: ", error(message))
        })
        const user = firebase.auth().currentUser;

        user.delete().then(() => {
            Alert.alert("Account is deleted!");
        }).catch((error) => {
            console.log("Error removing account: ", error(message))
        });

}
/*const reauthenticate = (currentPassword) => {
    var user = firebase.auth().currentUser;
    var cred = firebase.auth.EmailAuthProvider.credential(
        user.email, currentPassword);
    return user.reauthenticateWithCredential(cred);
  }*/

export async function reauthenticate(){
  const user = firebase.auth().currentUser;

  // TODO(you): prompt the user to re-provide their sign-in credentials
  const credential = firebase.auth.EmailAuthProvider.credential(
    user.email, currentPassword);
  
  user.reauthenticateWithCredential(credential).then(() => {
    console.log("You are reauthenticated")
  }).catch((error) => {
    console.log("Error updating password: ", error.message)
  });
}
//reset password
export async function resetPw(currentPassword,newPassword) {
   
        const user = firebase.auth().currentUser;

        user.updatePassword(newPassword).then(() => {
            Alert.alert("Password is updated!");
            reauthenticate(currentPassword)
        }).catch((error) => {
            console.log("Error updating password: ", error.message)
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
    .catch(function(error) {
        //Alert.alert("Please re-enter your valid email");
        console.log("Error updating password")
    });
}
/*
export async function forgetPw(email,password) {
    
var user = firebase.auth().currentUser;
var credentials = firebase.auth.EmailAuthProvider.credential(
  email,
  password,
);
user.reauthenticateWithCredential(credentials);
}*/