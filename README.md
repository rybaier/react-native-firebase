# React Native App and Firebase integration 
I found this tutorial while looking for information about Firebase and React Native. I have been updating it to the Firebase Modular Web SDK syntax 
#####
[React Native Firebase Tutorial](https://www.freecodecamp.org/news/react-native-firebase-tutorial/)
#####

- updated working code from namespace SDK to Firebase Modular SDK
- Added SSO for google on android and ios
- added SSO for apple on ios 
- added logout

- Will implement further options as time goes on 
    - update and delete entity 

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

### notes on ios builds for Firebase Configuration 
#### If using firebase/firestore for IOS firebase configuration
- in Podfile use_modular_headers! must be inserted directly below target {App Name} do fore the Google utilities and FirebaseInternalCore to work properly
```
target 'reactnativefirebase' do
  use_modular_headers!
  use_expo_modules!
  config = use_native_modules!

 ```

#### If using react-native-firebase for IOS firebase configuration 
- in Podfile do not use_modular_headers. Comment all use_frameworks! 
- add use_frameworks! :linkage => static
```
target 'reactnativefirebase' do
  use_expo_modules!
  config = use_native_modules!

  use_frameworks! :linkage => :static 

  ```
#### notes on ios success build
- Warnings to address that didn't show in Android
  -  WARN  Sending `onAnimatedValueUpdate` with no listeners registered.
- Top App Bar differences 
  - Show's direct path back to Login on Homescreen without logging out

#### Apple Sign In notes
- In Apple Developer Account verify 
  - Key is configured with team and bundle identifier
  - Development Device is registered with it's UUID
  - Identifier has Sign in with Apple checked and is configured
  - Configure a sign in with Apple for Email Communication
  - A Certificate Signing Request is configured and saved 
  - Provisioning Profile has the App ID, Certificate and Device selected. with the Sign In With Apple capability Enabled
  - A service Id is created and Apple Sign in is configured with call back URL from Firebase Authentication method. Service ID should also be linked to the App Id 
  - for Apple Sign in on android - ensure that Apple Service Id is entered into the Oauth Services ID in the firebase authentication apple sign in method 
  - The Info.plist has following added to it 
  - FOR AUTHORIZING APP SSO capability
  ``` 
     <key>ASAuthorizationAppleIDProvider</key>
      <dict>
          <key>ASAuthorizationScope</key>
          <array>
              <string>email</string>
              <string>fullName</string>
          </array>
          <key>ASAuthorizationScopeFullName</key>
          <string></string>
          <key>ASAuthorizationScopeEmail</key>
          <string></string>
      </dict>
  ```
- your app's bundle id with the Apple team Id at start 
- your app's service id is added 
- Each CFBundleURLSchemes can only contain 1 url in the array
``` 
	  <key>CFBundleURLSchemes</key>
			  <array>
				  <string>TEAMID.com.company.domain</string>
			  </array>
          <key>CFBundleURLSchemes</key>
          <array>
            <string>com.company.signinwithapple</string>
          </array>
```
