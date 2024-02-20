import "react-native-gesture-handler";
import React, { useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { LoginScreen, HomeScreen, RegistrationScreen } from "./src/screens";
import {  onAuthStateChanged, signOut } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Text } from "react-native";
import { decode, encode } from "base-64";
import { auth, db } from './src/firebase/config'
import LoadScreen from "./src/screens/LoadScreen/LoadScreen";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Added AsyncStorage.clear() to signout 

if (!global.btoa) {
  global.btoa = encode;
}
if (!global.atob) {
  global.atob = decode;
}

const Stack = createStackNavigator();


export default function App() {


  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen 
        name= "Loading" 
        component={LoadScreen} 
        options={{
          headerShown: false,
          }}/>
        <Stack.Screen name="Login" component={LoginScreen}    options={{
          headerShown: false,
          }} />
        <Stack.Screen name="Registration" component={RegistrationScreen} />
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={({ navigation }) => ({ // Destructure props pulling navigation object out for direct access in App.js
            title: "Work List",
            headerRight: () => (
              <TouchableOpacity onPress={() => { signOut(auth), navigation.navigate('Login'), AsyncStorage.clear() }}> 
                <Text style={{ marginRight: 25 }}>Log Out</Text>
              </TouchableOpacity>
            ),
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}


