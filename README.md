# React Native App and Firebase integration 
I found this tutorial while looking for information about Firebase and React Native
#####
[React Native Firebase Tutorial](https://www.freecodecamp.org/news/react-native-firebase-tutorial/)
#####

- updated working code from namespace SDK to Firebase Modular SDK

- Will implement further options 
    - single sign on 
    - update and delete entity 
    - logout

#### Firestore rules for 
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // User documents
    match /users/{userId} {
      allow read, write: if request.auth != null 
      allow delete: if request.auth != null && request.auth.uid == userId;
		  allow update: if request.auth != null && request.auth.uid == userId;

    }
    // Entity documents
    match /entities/{entityId} {
      allow read: if request.auth != null && request.auth.uid == resource.data.authorID;
      allow write: if request.auth != null && request.auth.uid == request.resource.data.authorID;
    	allow delete: if request.auth != null && request.auth.uid == resource.data.authorID;
    	allow update: if request.auth != null && request.auth.uid == resource.data.authorID;
    }
  }
}

#####
