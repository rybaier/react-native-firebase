import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, HomeScreen, RegistrationScreen } from "./src/screens";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native";
import { decode, encode } from "base-64";
import { auth, db } from './src/firebase/config'
import LoadScreen from "./src/screens/LoadScreen/LoadScreen";

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();
// const auth = getAuth(); // create Auth globally for access throughout use effect function
// const db = getFirestore(); // create db globally for access throughout use effect function

// const navigationRef = createNavigationContainerRef()
// const navigate = (names, params) => {
//   if(navigationRef.isReady()){
//     navigationRef.navigate(names, params)
//   }
// }

const LoggedIn = () => {
  <Stack.Navigator>
    <Stack.Screen name="Login"  />
    <Stack.Screen name="Registration" component={RegistrationScreen} />
    <Stack.Screen
      name="Home"
      component={HomeScreen}
      options={({ navigation }) => ({ // Destructure props pulling navigation object out for direct access in App.js
        title: "Work List",
        headerRight: () => (
          <TouchableOpacity onPress={() => { signOut(auth), navigation.navigate('Login') }}>
            <Text style={{ marginRight: 25 }}>Log Out</Text>
          </TouchableOpacity>
        ),
      })}
    />
 
  </Stack.Navigator>;
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    console.log("CURRENTUSER", user);
    const usersRef = collection(db, "users");

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const userDoc = doc(db, "users", user.uid);
          const docSnapshot = await getDoc(userDoc);
          if (docSnapshot.exists()) {
            const userData = docSnapshot.data();
            setUser(userData);
          } else {
            setUser(null); // User document doesn't exist
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false);
        }
      } else {
        setUser(null); // No authenticated user
        setLoading(false);
      }
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name= "Loading" component={LoadScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({ // Destructure props pulling navigation object out for direct access in App.js
            title: "Work List",
            headerRight: () => (
              <TouchableOpacity onPress={() => { signOut(auth), navigation.navigate('Login') }}>
                <Text style={{ marginRight: 25 }}>Log Out</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Namespace SDK
// useEffect(() => {
//   const usersRef = firebase.firestore().collection('users');
//   firebase.auth().onAuthStateChanged(user => {
//     if (user) {
//       usersRef
//         .doc(user.uid)
//         .get()
//         .then((document) => {
//           const userData = document.data()
//           setLoading(false)
//           setUser(userData)
//         })
//         .catch((error) => {
//           setLoading(false)
//         });
//     } else {
//       setLoading(false)
//     }
//   });
// }, []);
