import React from 'react';
import { appleAuth, AppleAuthRequestOperation, 
    AppleAuthCredentialState, AppleAuthError, AppleButton } from '@invertase/react-native-apple-authentication';

import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';

const AppleSignInButton = ({ navigation }) => {
  const onAppleButtonPress = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });

      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, nonce } = appleAuthRequestResponse;
      const appleCredential = OAuthProvider.credential(identityToken, nonce);

      // Sign the user in with the credential
      await signInWithCredential(auth, appleCredential);
        
      // Get current user
        const currentUser = auth.currentUser;
         // Check if user document already exists in Firestore
         const userRef = doc(db, 'users', currentUser.uid);
         const docSnapshot = await getDoc(userRef);
         if (!docSnapshot.exists()) {
           // Create a user document in Firestore
           await setDoc(userRef, {
             email: currentUser.email,
             fullName: currentUser.displayName || 'Anonymous',
             id: currentUser.uid,
           });
         }
        // Navigate to the Home screen
        //   navigation.navigate('Home');
        } catch (error) {
        console.error('Apple sign-in error:', error);
        }
    };

  return (
    <AppleButton
      buttonStyle={AppleButton.Style.BLACK}
      buttonType={AppleButton.Type.SIGN_IN}
      style={{
        width: 160, 
        height: 45, 
        margin: 10,
      }}
      onPress={() => onAppleButtonPress()}
    />
  );
};

export default AppleSignInButton;
