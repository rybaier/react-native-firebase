import React from "react"
import { log } from "../components/logging_config"
import { Text, TouchableOpacity, View } from "react-native"
import { signOut, OAuthProvider, signInWithPopup, revokeAccessToken } from "firebase/auth"
import { auth } from "../firebase/config"
import Ionicons from '@expo/vector-icons/Ionicons'
import { GoogleSignin } from '@react-native-google-signin/google-signin'
import AsyncStorage from "@react-native-async-storage/async-storage"; 



export const LogoutButton = ({ navigation }) => {
    const doLogout = () => {
        
        signOut(auth)
        GoogleSignin.revokeAccess()
        AsyncStorage.clear() 
        navigation.navigate('Login')
    }
    return (
     <TouchableOpacity onPress={doLogout} style={{marginRight: 20}}>
        <Text style={{fontSize: 16}}>Log out</Text>
     </TouchableOpacity>
        )
}