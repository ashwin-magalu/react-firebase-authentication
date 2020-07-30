import app from "firebase/app";
import "firebase/auth";
import "firebase/database";

const config = {
  apiKey: "something",
  authDomain: "something",
  databaseURL: "something",
  projectId: "ashu-auth-dev",
  storageBucket: "ashu-auth-dev.appspot.com",
  messagingSenderId: "something",
  appId: "something",
  measurementId: "something",
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.database(); //For Realtime DB in React
  }

  //Auth API
  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);

  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);

  doSignOut = () => this.auth.signOut();

  doPasswordReset = (email) => this.auth.sendPasswordResetEmail(email);

  doPasswordUpdate = (password) =>
    this.auth.currentUser.updatePassword(password);

  // Merge Auth and DB User API
  onAuthUserListener = (next, fallback) =>
    this.auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        this.user(authUser.uid)
          .once("value")
          .then((snapshot) => {
            const dbUser = snapshot.val();

            // default empty roles
            if (!dbUser.roles) {
              dbUser.roles = [];
            }

            // merge auth and db user
            authUser = {
              uid: authUser.uid,
              email: authUser.email,
              ...dbUser,
            };
            next(authUser);
          });
      } else {
        fallback();
      }
    });

  //User Api
  user = (uid) => this.db.ref(`users/${uid}`);

  users = () => this.db.ref("users");

  //The paths in the ref() method match the location where your entities (users) will be
  //stored in Firebase's realtime database API. If you delete a user at "users/5",
  //the user with the identifier 5 will be removed from the database. If you create a
  //new user at "users", Firebase creates the identifier for you and assigns all the information
  //you pass for the user.

  //Activate Firebase's Realtime Database on your Firebase Dashboard
  //Set your Database Rules on your Firebase Project's Dashboard to
  //{ "rules": { ".read": true, ".write": true } } to give everyone read and write access for now.
}

export default Firebase;
