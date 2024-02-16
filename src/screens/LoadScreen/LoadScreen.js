import {React, useState, useEffect} from "react";
import styles from "./styles";
import { Button, Text, View } from "react-native";
import { auth, db } from "../../firebase/config";
import {  onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";

export default function LoadScreen ({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState(null)
    
    useEffect(() => {
        const usersRef = collection(db, "users");
    
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const userDoc = doc(db, "users", user.uid);
              const docSnapshot = await getDoc(userDoc);
              if (docSnapshot.exists()) {
                const userData = docSnapshot.data();
                setUserData(userData);
                navigation.navigate('Home')
              } else {
                setUserData(null); // User document doesn't exist
                navigation.navigate('Login')
              }
            } catch (error) {
              console.error("Error fetching user data:", error);
            } finally {
              setLoading(false);
            }
          } else {
            setUserData(null); // No authenticated user
            setLoading(false);
            navigation.navigate('Login')
          }
        });
    
        // Cleanup subscription on unmount
        return () => unsubscribe();
      }, []);
    
    return(
        <View>
            <Text> Checking for User </Text>
            <Button title='HomeScreen'onPress={()=>navigation.navigate('Home')}> Home </Button>
        </View>
    )
}

