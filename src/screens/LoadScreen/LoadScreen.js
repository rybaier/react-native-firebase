// FOR CHECKING USER AUTHENTICATION STATE
import {React, useState, useEffect} from "react";
import styles from "./styles";
import { Button, Text, View, ActivityIndicator } from "react-native";
import { auth, db } from "../../firebase/config";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";

export default function LoadScreen ({ navigation }) {
    const [loading, setLoading] = useState(false)
    const [userData, setUserData] = useState(null)
    
    useEffect(() => {
        setLoading(true)
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
                // setUserData(null); // User document doesn't exist
                // navigation.navigate('Login')
              }
            } catch (error) {
              log.error("LoadScreen: Error fetching user data:", error);
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
        <View style={styles.container}>
            { loading ? (
                <View>
                    <Text style={styles.text}>Checking Credentials</Text>
                    <ActivityIndicator size={100} color={'#0fff0f'} />
                </View>
            ) : (
                <View>
                    <Text style={styles.text}>Login Failed Please Sign in Again</Text>
                    <Text style={styles.text}>Developer Screen for quick access to home</Text>
                    <Button title='Login'onPress={()=>navigation.navigate('Login')}/>
                    <Button title='Home'onPress={()=>navigation.navigate('Home')}/>

                </View>
        )}
        </View>
    )
}

