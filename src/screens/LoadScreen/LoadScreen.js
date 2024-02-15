import {React, useState, useEffect} from "react";
import styles from "./styles";
import { Text, View } from "react-native";
import { auth } from "../../firebase/config";

export default function LoadScreen ({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [user, setUser] = useState(null)
    
    const checkForUser = () => {
       try {
        setUser(auth.currentUser)
       } catch (error) {
        
       }
    }
    useEffect(  () => {
        console.log('LOADCHECK', auth.currentUser)
        setLoading(true)
        checkForUser()
   
        setLoading(false)
    }, [auth.currentUser])
    return(
        <View>
            <Text> Checking for User </Text>
        </View>
    )
}

