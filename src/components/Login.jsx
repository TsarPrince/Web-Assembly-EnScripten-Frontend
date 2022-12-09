import { useState, useEffect } from 'react'
import { getAuth, signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";


const Login = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const alreadyLoggedInUser = localStorage.getItem('user');
    if (alreadyLoggedInUser) {
      setUser(JSON.parse(alreadyLoggedInUser));
    }
  }, [])

  // Initialize Firebase
  const { app } = require('../firebase');

  const loginWithGoogle = () => {
    // google oauth
    const auth = getAuth();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        // const credential = GoogleAuthProvider.credentialFromResult(result);
        // const token = credential.accessToken;
        // The signed-in user info.
        const user = result.user;
        setUser(user);
        localStorage.setItem('user', JSON.stringify(user));

      }).catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData?.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);

        console.log({
          errorCode, errorMessage, email, credential
        })
      });
  }

  const logout = () => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
      localStorage.removeItem('user');
      setUser(null);
    }).catch((error) => {
      // An error happened.
      console.log(error)
    });
  }

  return (
    <div>
      {
        user
          ? <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex' }}>
              <img src={user.photoURL} alt={user.displayName} />
              <div>
                <p>Welcome, {user.displayName}</p>
                <p>Progress synced to {user.email}</p>
              </div>
            </div>
            <button onClick={logout}>Logout</button>
          </div>
          : <div>
            <p>Your progress is not being saved.</p>
            <button onClick={loginWithGoogle}>Login with Google</button>
          </div>
      }

    </div>
  )
}

export default Login