import React, { useEffect, useState } from 'react'
import { Button, FlatList, Keyboard, Text, TextInput, TouchableOpacity, View, Scrollview, Alert, ActivityIndicator} from 'react-native'
import styles from './styles';
import Collapsible from 'react-native-collapsible'
import {getDocs, collection, addDoc, query, where, orderBy, 
    onSnapshot, serverTimestamp, deleteDoc, doc, updateDoc } from 'firebase/firestore';
import {auth, db } from '../../firebase/config'
import { OAuthProvider, signInWithPopup } from "firebase/auth";
import {auth as rnAuth} from '@react-native-firebase/auth'
import log from '../../components/logging_config'

// Initialize Firestore
// const db = getFirestore();

export default function HomeScreen( {extraData, navigation}) {
//    log.debug('AUTH', auth.currentUser)
    //log.debug('AUTH', auth.currentUser.uid) // accessing userID directly from auth negating passing by props
    //log.debug('PROPS', extraData.id) // Makes sure userID is coming through props
    const [entityText, setEntityText] = useState(''); // State to hold the text for the new entity
    const [entities, setEntities] = useState([]); // State to hold the entities fetched from Firestore
    const [isCollapsed, setIsCollapsed] = useState(true) // State to hold Collapsible status
    const [updateText, setUpdateText] = useState('') // State to hold Updated text for entity
    const [updateItem, setUpdateItem] = useState(null)  // State to hold current item for updating
    const [loading, setLoading] = useState(false) // State to hold loading status
    // Reference to the 'entities' collection in Firestore
    const entityRef = collection(db, 'entities');
    const userID = auth.currentUser ? auth.currentUser.uid : null // Checks auth contains user information 

    
    useEffect(() => {
        
        // Set up a query to fetch entities for the current user, ordered by 'createdAt' in descending order
        const q = query(entityRef, where("authorID", "==", userID), orderBy('createdAt', 'desc'));
        // Uncomment line below and comment out line above for testing of non matching userID 
        // const q = query(entityRef, where("authorID", "==", 'g4f6RssNGVWg1zRYbe5k0hsKRYm2'), orderBy('createdAt', 'desc'));

        // Listen for real-time updates to the query
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const newEntities = [];
            querySnapshot.forEach((doc) => {
                // For each document in the query result, extract data and add it to the newEntities array
                const entity = doc.data();
                entity.id = doc.id; // Add the document ID to the entity object
                newEntities.push(entity);
            });
            // Update the entities state with the newEntities array
            setEntities(newEntities);
        }, (error) => {
            log.error(error);
        });

        // Cleanup function to unsubscribe from the snapshot listener when the component unmounts
        return () => unsubscribe();
    }, [userID, auth]);

    // Function to handle adding a new entity
    const onAddButtonPress = () => {
        if (entityText && entityText.length > 0) {
            // Create a server-side timestamp for the 'createdAt' field
            const timestamp = serverTimestamp();
            // Data for the new entity
            const data = {
                text: entityText,
                authorID: userID,
                createdAt: timestamp,
            };
            // Add the new entity to the 'entities' collection in Firestore
            addDoc(entityRef, data)
                .then(() => {
                    // Clear the input field and dismiss the keyboard after adding the entity
                    setEntityText('');
                    Keyboard.dismiss();
                })
                .catch((error) => {
                    alert(error);
                });
        }
    };

    const deleteItem = (item) => {
       log.debug('DELETEITEM',item)
        const docRef = doc(db, "entities", item.id)
        deleteDoc(docRef).then(()=>{
           log.info("Document has been deleted")
        }).catch(error =>log.error('DELETE ERROR', error))
    }


    const updateItemOnPress = (item) => {
        log.debug('UPDATEITEM',item)
        if (updateItem && updateText.trim() !== "") { // Check if updateItem is not null and updateText is not empty
            const data = {
                text: updateText
            };
            const docRef = doc(db, "entities", updateItem.id);
            updateDoc(docRef, data)
                .then(() => {
                    log.info("Document has been updated");
                    setIsCollapsed(true);
                    setUpdateItem(null);
                    setUpdateText(''); // Clear the updateText state
                })
                .catch((error) => {
                    log.error("Error updating document: ", error);
                });
        }
    };

    const deleteAppleAccount = async () => {
        try {
            // Check if the user is signed in with Apple
            const credentialState = await appleAuth.getCredentialStateForUser();
    
            if (credentialState === appleAuth.State.AUTHORIZED) {
                // Revoke the Apple OAuth access token.
                await appleAuth.revokeAuthorization();
                
            } else {
                // The user is not signed in with Apple or the credential state could not be determined.
            }
        } catch (error) {
            log.error('Error deleting Apple account:', error);
        }
    };
    
    const onDeleteAccountPress = (userID) => {
        Alert.alert('Are you sure you want to delete your account?', 'This action cannot be undone.', 
        [
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'Delete',
                onPress: async () => {
                    setLoading(true);
                    try {
                        log.debug('USERID', userID)
                           // Delete documents where the user is the author
                           const authorDocsSnapshot = await getDocs(query(entityRef, where('authorID', '==', userID), orderBy('createdAt', 'desc')));
                           const deleteAuthorPromises = authorDocsSnapshot.docs.map((doc) => {
                               return deleteDoc(doc.ref);
                           });
                           await Promise.all(deleteAuthorPromises);
   
                           log.info('User documents where the user is the author have been deleted');
   
                        // Delete user document
                        const userRef = doc(db, "users", userID)
                        deleteDoc(userRef).then(()=>{
                        log.info('USER Firestore Document has been deleted')
                            navigation.navigate('Login')
                        }).catch((error) => {
                            log.error(error)
                        })    
                        // DELETE THE USER ACCOUNT IN FIREBASE AUTHENTICATION
                        const user = auth.currentUser
                        if (user) {
                            const providers = await user.getIdTokenResult().then((idTokenResult) => {
                                return idTokenResult.signInProvider;
                            });

                            if (providers && providers.includes('apple.com')) {
                                await deleteAppleAccount();
                            }

                            user.delete();
                            log.info('User Account has Been Deleted');
                        }

    
                    } catch (error) {
                        log.error('Error deleting user:', error);
                    }
                    setLoading(false);
                }
            }    
        ])
        
    };
        

    // Function to render each entity item in the FlatList
   
    const renderEntity = ({ item, index }) => {
        return (
            <View>
                <View style={styles.entityContainer}>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteItem(item)}>
                        <Text style={styles.buttonText}>Delete</Text>
                    </TouchableOpacity>
                    
                    <Text style={styles.entityText}>
                        {index + 1}. {item.text}
                    </Text>
                    <TouchableOpacity style={styles.deleteButton} onPress={() => { 
                        setIsCollapsed(false), setUpdateItem(item),
                        log.debug('UPDATE',updateItem)
                        }}>
                        <Text style={styles.buttonText}>Update</Text>
                    </TouchableOpacity>
                </View> 
                <View style={styles.entityContainer2}> 
                    <Collapsible collapsed={isCollapsed || updateItem !== item}>
                        <TextInput
                            style={styles.input}
                            placeholder={item.text}
                            placeholderTextColor="#aaaaaa"
                            onChangeText={(text) => setUpdateText(text)}
                            value={updateText}
                            underlineColorAndroid="transparent"
                            autoCapitalize="none"
                        /> 
                    </Collapsible>
                    {updateItem === item && (
                        <TouchableOpacity style={styles.button} onPress={updateItemOnPress}>
                            <Text style={styles.buttonText}>Update</Text>
                        </TouchableOpacity>
                    )}
                    </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
        
            <View style={styles.formContainer}>
                <ActivityIndicator animating={loading} size={"large"}/>
                <TextInput
                    style={styles.input}
                    placeholder='Add new entity'
                    placeholderTextColor="#aaaaaa"
                    onChangeText={(text) => setEntityText(text)}
                    value={entityText}
                    underlineColorAndroid="transparent"
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={onAddButtonPress}>
                    <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
            </View>
            { entities && (
                <View style={styles.listContainer}>
                    <FlatList
                        data={entities}
                        renderItem={renderEntity}
                        keyExtractor={(item) => item.id}
                        removeClippedSubviews={true}
                    />
                </View>
            )}
                  <TouchableOpacity style={styles.button} onPress={()=> onDeleteAccountPress(userID)}>
                    <Text style={styles.buttonText}>Delete Account</Text>
                </TouchableOpacity>
        </View>
    )
}

