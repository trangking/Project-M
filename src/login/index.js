import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/firebase1";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "../css/user.css";

const Login = () => {
  const [userInfo, setuserInfo] = useState();
  const [token, setToken] = useState();
  const navigate = useNavigate();
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      console.log(user);
      navigate("/member");
    }
  }, []);

  const signIn_google = async () => {
    // const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        setToken(token);
        // The signed-in user info.
        const user = result.user;
        setuserInfo(user);

        navigate("/member");
        // IdP data available using getAdditionalUserInfo(result)
        // ...
      })
      .catch((error) => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.customData.email;
        // The AuthCredential type that was used.
        const credential = GoogleAuthProvider.credentialFromError(error);
        // ...
      });
  };

  const test = () => {
    console.log(user);
    console.log(token);
  };

  return (
    <div className="container text-center">
      <div className="loginPage">
        <div className="row align-items-start mt-2">
          <h1>Sign In</h1>
        </div>

        <Button className="mt-3" variant="danger" type="submit" onClick={signIn_google}>
          Sing In with Google
        </Button>
        {/* <Button variant="primary" type="submit" onClick={test}>
            test
          </Button> */}
      </div>
    </div>
  );
};

export default Login;