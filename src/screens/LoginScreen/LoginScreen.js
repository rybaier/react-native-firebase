// Imports 
import React, { useState } from 'react';
import { Image, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import styles from './styles';
// Import Firebase authentication and Firestore modules
import { db, auth } from '../../firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
// Import Single Sign On (SSO) components
import GoogleSignInButton from '../../components/googleSignIn';
import AppleSignInButton from '../../components/appleSignIn';



// Login screen component
export default function LoginScreen({ navigation }) {
    // State variables for email and password fields
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // Function to navigate to the registration screen
    const onFooterLinkPress = () => {
        navigation.navigate('Registration');
    };

    // Function to handle login button press
    const onLoginPress = () => {
        // Get authentication and Firestore instances

        // Sign in with email and password
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Extract user object from userCredential
                const user = userCredential.user;
                const uid = user.uid;

                // Reference to the user document in Firestore
                const userRef = doc(db, 'users', uid);
                // Get user data from Firestore
                getDoc(userRef)
                    .then((response) => {
                        // Check if user document exists
                        if (!response.exists()) {
                            alert("User does not exist anymore.");
                            return;
                        }
                        // Extract user data from Firestore response
                        const userData = response.data();
                        // Navigate to home screen
                        navigation.navigate('Home');
                    })
                    .catch((error) => {
                        log.error(error.message);
                    });
            })
            .catch((error) => {
                log.error(error.message);
            });
    };

    return (
        <View style={styles.container}>
            <KeyboardAwareScrollView
                style={{ flex: 1, width: '100%' }}
                keyboardShouldPersistTaps="always">
                {/* App logo */}
                <Image
                    style={styles.logo}
                    source={require('../../../assets/icon.png')}
                />
                {/* Email input field */}
                <TextInput
                    style={styles.input}
                    placeholder='E-mail'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEmail(text)}
                    value={email}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                {/* Password input field */}
                <TextInput
                    style={styles.input}
                    placeholderTextColor="#aaaaaa"
                    secureTextEntry
                    placeholder='Password'
                    onChangeText={(text) => setPassword(text)}
                    value={password}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                {/* Login button */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => onLoginPress()}>
                    <Text style={styles.buttonTitle}>Log in</Text>
                </TouchableOpacity>
                {/* Footer link to navigate to the registration screen */}
                <View style={styles.footerView}>
                    <Text style={styles.footerText}>Don't have an account? <Text onPress={onFooterLinkPress} style={styles.footerLink}>Sign up</Text></Text>
                    <GoogleSignInButton navigation={navigation}/>
                    <AppleSignInButton navigation={navigation}/>
                </View>
            </KeyboardAwareScrollView>
        </View>
    );
}

