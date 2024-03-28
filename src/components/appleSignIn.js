//  IMPORTS
import React from 'react';
import { appleAuth, AppleButton } from '@invertase/react-native-apple-authentication';
import { OAuthProvider, signInWithCredential } from 'firebase/auth';
import { auth, db } from '../firebase/config';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import log from './logging_config'

const AppleSignInButton = ({ navigation }) => {
  const provider = new OAuthProvider('apple.com');
 
  const onAppleButtonPress = async () => {
    try {
      // Start the sign-in request
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.EMAIL, appleAuth.Scope.FULL_NAME],
      });
      log.debug('APPLE RESPONSE', appleAuthRequestResponse)
      // Ensure Apple returned a user identityToken
      if (!appleAuthRequestResponse.identityToken) {
        throw new Error('Apple Sign-In failed - no identity token returned');
      }

      // Create a Firebase credential from the response
      const { identityToken, user, nonce } = appleAuthRequestResponse;
      log.debug('IDENTITY TOKEN', identityToken)
      log.debug('NONCE', nonce)
      const appleCredential = provider.credential({idToken: identityToken, rawNonce: nonce});

      log.debug('APPLE CREDENTIAL', appleCredential)
      // Sign the user in with the credential
      // log.debug(provider.credential(identityToken))
        await signInWithCredential(auth, appleCredential);
      // Get current user
        const currentUser = auth.currentUser;
        log.debug('USER', auth.currentUser)
         // Check if user document already exists in Firestore
         const userRef = doc(db, 'users',currentUser.uid);
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
          navigation.navigate('Home');
        } catch (error) {
       log.error('Apple sign-in error:', error);
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
