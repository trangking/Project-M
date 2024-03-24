import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db, fetchTypeData } from "../firebase/firebase1";
import { setDoc, getDoc, doc } from "firebase/firestore";
import "../css/user.css"
import { Button } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';


const Profile = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [checked, setChecked] = useState(false)
  const [username , setUsername] = useState();
  const [phone , setPhone] = useState();
  const [address, setAddress]= useState();

  useEffect(() => {
    if (!user) navigate("/login");
    else {
      queryData();
    }
  }, []);

  const queryData = async () => {
    
    const docRef = doc(db, "member", user.uid);
    const docSnap = await getDoc(docRef);
    if(docSnap.exists()){
      setUsername(docSnap.data().username);
      setPhone(docSnap.data().phoneNumber);
      setAddress(docSnap.data().address);
    }
    
  };

  const submit_change = async(e) =>{
    e.preventDefault();
    await setDoc(doc(db, "member", user.uid), {
      memberEmail: user.email,
      username : username,
      phoneNumber: phone,
      address: address
          
    });
    queryData();
    setChecked(false);
  }

  const showUserData = () =>{
   
    return(
      <>
        <Form onSubmit={submit_change}>
          <Form.Control
            type="text"
            placeholder="Disabled readonly input"
            aria-label="Disabled input example"
            defaultValue={user.email}
            disabled
            readOnly
            className="mb-3"
          />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control required type="text" 
            placeholder="Enter User Name" 
            defaultValue={username}
            disabled = {!checked}
           
            onChange={(e) => setUsername(e.target.value)}
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control required type="text" 
            placeholder="091xxxxxxx" 
            defaultValue={phone}
            disabled = {!checked}
           
            onChange={(e) => setPhone(e.target.value)} 
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              defaultValue={address}
              disabled = {!checked}
              
              onChange={(e) => setAddress(e.target.value)}
              style={{ minHeight: "100px", maxHeight: "200px" }}
            />
          </Form.Group>

          <Button disabled={!checked} variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </>
    )
  }

  return (
    <div className="centerEvery">
      <h1>Your Information</h1>
      <ToggleButton
        className="mb-2"
        id="toggle-check"
        type="checkbox"
        variant="outline-primary"
        checked={checked}
        value="1"
        onChange={(e) => setChecked(e.currentTarget.checked)}
      >
        Change Information
      </ToggleButton>
      
      {user ? showUserData():""}
    </div>
  );
};

export default Profile;
