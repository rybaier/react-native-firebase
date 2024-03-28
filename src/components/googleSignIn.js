import React, {useEffect} from 'react';
import { Button, Text, StyleSheet, TouchableOpacity } from 'react-native';
import auth from '@react-native-firebase/auth';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import { auth as firebaseAuth, db } from '../firebase/config';
import { onAuthStateChanged, signInWithCredential, GoogleAuthProvider } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore'
import log from '../components/logging_config'
import {WEBCLIENTID} from '@env'


// Configure Google Sign-In with the webClientId from the environment variables
// GoogleSignin.configure({
//     webClientId: 'WebClientId use client type 3 from google-servicesjson',
//   });
log.debug('WEBCLIENTID', WEBCLIENTID)
GoogleSignin.configure({
    webClientId: WEBCLIENTID,
  });

// Google Sign-In button component
const GoogleSignInButton = ({ navigation }) => {
 
  const onGoogleButtonPress = async () => {
    try {
      // Get the Google user's ID token
      const { idToken, user } = await GoogleSignin.signIn();

      // Create a Google credential with the ID token
      const googleCredential = GoogleAuthProvider.credential(idToken);

      // Sign in the user with the Google credential
      await signInWithCredential(firebaseAuth, googleCredential);
      const uid = firebaseAuth.currentUser.uid
      // log.debug('Logged in user:', user);
      // log.debug('UID', uid)
     // Check if user document already exists in Firestore
      const userRef = doc(db, 'users', uid)
      const docSnapshot = await getDoc(userRef);
      log.debug('DOC', docSnapshot)
        if (!docSnapshot.exists) {
        // Create a user document in Firestore
            await setDoc(userRef, {
                email: user.email,
                fullName: user.name || 'Anonymous',
                id: uid,
            });
        }
        
      // Update Firebase auth state
   
    //   onAuthStateChanged(auth, user)
      // log.debug('FIREBASE', firebaseAuth.currentUser)
      navigation.navigate('Home')
    } catch (error) {
      log.error('Google sign-in error:', error);
    }
  };

  // Render the Google Sign-In button

  return (
    <TouchableOpacity
        style={styles.googleButton}
        onPress={()=>onGoogleButtonPress()}>
        <Icon name="google" size={24} color="#4285F4" />
        <Text style={styles.googleButtonText}>Sign in with Google</Text>
    </TouchableOpacity>
  );
};

export default GoogleSignInButton;


const styles = new StyleSheet.create({
    googleButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingVertical: 10,
        paddingHorizontal: 12,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#4285F4',
        marginTop: 15,
    },
    googleButtonText: {
        color: '#4285F4',
        fontSize: 16,
        fontWeight: 'bold',
        marginLeft: 10,
    },
})