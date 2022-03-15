// const {initializeApp} = require('firebase/app')

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: `${process.env.FIREBASE_PROJECT_ID}.firebaseapp.com`,
//     projectId: `${process.env.FIREBASE_PROJECT_ID}`,
//     storageBucket: `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
//     messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID,
//     measurementId: process.env.FIREBASE_MEASUREMENT_ID
// };

// initializeApp(firebaseConfig);

// var provider = new firebase.auth.FacebookAuthProvider();
// provider.addScope('email');
// firebase.auth().signInWithRedirect(provider);
// firebase.auth().getRedirectResult().then(function(result) {
//     if (result.credential) {
//     // This gives you a Facebook Access Token. You can use it to access
//     // the Facebook API.
//     var token = result.credential.accessToken;
//     // ...
//     }
//     // The signed-in user info.
//     var user = result.user;
//     }).catch(function(error) {
//     // Handle Errors here.
//     var errorCode = error.code;
//     var errorMessage = error.message;
//     // The email of the user's account used.
//     var email = error.email;
//     // The firebase.auth.AuthCredential type that was used.
//     var credential = error.credential;
//     // ...
//     });