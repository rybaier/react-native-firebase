# React Native App and Firebase integration 
I found this tutorial while looking for information about Firebase and React Native
#####
[React Native Firebase Tutorial](https://www.freecodecamp.org/news/react-native-firebase-tutorial/)
#####

- updated working code from namespace SDK to Firebase Modular SDK

- Will implement further options 
    - single sign on - Discovered this is going to require me to build the app and run native code modules. 
    - update and delete entity 
    - logout

#### Firestore rules for 
```
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
```
#####

#### notes on ios build fails 
- react-native-firebase/firestore package interferes with ios build use firebase/firestore 
- in Podfile use_modular_headers! must be inserted directly below target {App Name} do fore the Google utilities and FirebaseInternalCore to work properly
```
target 'reactnativefirebase' do
  use_modular_headers!
  use_expo_modules!
  config = use_native_modules!
  ```
#### notes on ios success build
- Warnings to address that didn't show in Android
  -  WARN  Sending `onAnimatedValueUpdate` with no listeners registered.
- Top App Bar differences 
  - Show's direct path back to Login on Homescreen without logging out
