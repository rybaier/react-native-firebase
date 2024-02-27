import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import {  FacebookAuthProvider, signInWithCredential } from 'firebase/auth';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
// BEFORE I CAN TEST I NEED TO SET UP FACEBOOK LOGIN PERMISSIONS BY REQUESTIING 
//  ADVANCED ACCESS PERMISSIONS. FOR THE APP ON FACEBOOK DEVELOPER 
// THE APP THEN WILL GO THROUGH A REVIEW PROCESS
// ADVANCED ACCESS WILL ONLY BE GRANTED TO DEVELOPER ACCOUNTS ATTACHED WITH BUSINESS VERIFICATION
// THIS NEEDS TO BE DISCUSSED IF INTEGRATING FACEBOOK 

const FacebookSignInButton = ({ navigation }) => {
  const onFacebookButtonPress = async () => {
    try {
      // Attempt login with permissions
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      
      if (result.isCancelled) {
        throw new Error('User cancelled the login process');
      }

      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw new Error('Something went wrong obtaining access token');
      }

      // Create a Firebase credential with the AccessToken
      const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

      // Sign-in the user with the credential
      await signInWithCredential(auth, facebookCredential);

      const uid = auth.currentUser.uid
      // Check if user document already exists in Firestore
      const userRef = doc(db, 'users', uid)
      const docSnapshot = await getDoc(userRef);
        if (!docSnapshot.exists) {
        // Create a user document in Firestore
            await setDoc(userRef, {
                email: auth.currentUser.email,
                fullName: auth.currentUser.displayName || 'Anonymous',
                id: uid,
            });
        }

      // Navigate to the Home screen
      navigation.navigate('Home');
    } catch (error) {
      console.error('Facebook sign-in error:', error);
    }
  };

  return (
    <TouchableOpacity style={styles.facebookButton} onPress={onFacebookButtonPress}>
      <Text style={styles.facebookButtonText}>Sign in with Facebook</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  facebookButton: {
    backgroundColor: '#4267B2',
    padding: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  facebookButtonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default FacebookSignInButton;
