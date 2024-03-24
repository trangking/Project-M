import React, { useState, useEffect } from "react";
import { Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { auth, db, fetchTypeData } from "../firebase/firebase1";
import {  doc, setDoc } from "firebase/firestore";
import "../css/user.css";
import Form from "react-bootstrap/Form";

const Register = () => {
  const user = auth.currentUser;
  const navigate = useNavigate();
  const [userName , setuserName] = useState();
  const [numberPhone , setNumberPhone] = useState();
  const [address , setAddress] = useState();

  const [isUser, setIsUser] = useState(false);

  useEffect(() => {
    // if (!user) navigate("/login");
    // else {
      
    // }

    if(user){
      setIsUser(true)
    }else navigate('/login');
  }, []);

  const submitData = async(e) => {
    e.preventDefault();
    await setDoc(doc(db, "member", user.uid), {
      memberEmail: user.email,
      username : userName,
      phoneNumber: numberPhone,
      address: address
          
    });
    navigate('/member');
  };

  const test = ()=>{
    if(!user) console.log("NO");
    else console.log("YES");
    
  }

  const form_later = () =>{
    return(
      <Form onSubmit={submitData}>
          <Form.Control
            type="text"
            placeholder="Disabled readonly input"
            aria-label="Disabled input example"
            defaultValue={user.email}
            readOnly
            className="mb-3"
          />
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>User Name</Form.Label>
            <Form.Control required type="text" 
            placeholder="Enter User Name" 
            onChange={(e) => setuserName(e.target.value)}/>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Phone Number</Form.Label>
            <Form.Control required type="text" 
            placeholder="091xxxxxxx" 
            onChange={(e) => setNumberPhone(e.target.value)} />
          </Form.Group>

          <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
            <Form.Label>Address</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              required
              onChange={(e) => setAddress(e.target.value)}
              style={{ minHeight: "100px", maxHeight: "200px" }}
            />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>

    )
  }

  return (
    <>
      <div className="centerEvery ">
        
        <h1 className="mb-3">Sign Up</h1>
        {isUser ? form_later(): ""}
      </div>
    </>
  );
};

export default Register;
