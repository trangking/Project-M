import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import React, { useState, useEffect } from "react";
import { useNavigate }  from "react-router-dom";
import {  signOut } from "firebase/auth";
import { auth } from "../firebase/firebase1";
// import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import "../css/user.css"
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Member = () => {

  const [userInfo, setuserInfo] = useState()
  const [token, setToken] = useState()
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [pet, setPet] = useState("");
  const [petName, setPetname] = useState("");
  const [petSym, setPetSym] = useState("");

  useEffect(()=>{
    if(!user) navigate("/login");
  },[])
 

 

  const handleClose = () => {setShow(false);};
  const handleShow = (data) => {
    setShow(true);
  };

  const getTest=()=>{
    console.log(user.uid);
    console.log(user.email);
    

  }

  const signOutFunc = async() =>{
    signOut(auth).then(() => {
      navigate("/login");
    }).catch((error) => {
      // An error happened.
    });
  }

  return (
    <div>
      <Button className="bt_rightside" onClick={signOutFunc} variant="danger">Sign Out</Button>
      <div className="container text-center">
      
        <div className=" mt-5">
          <h1>Member Page</h1>
          
        </div>
            <Button className="mt-3" variant="success" onClick={() => handleShow(user)}>Add new request +</Button>
        <Tabs
          defaultActiveKey="profile"
          id="fill-tab-example"
          className="mb-3 mt-3"
          fill
        >
          <Tab eventKey="doctor" title='Requested'>
            test1
          </Tab>
          <Tab eventKey="member" title="Appointment">
            test2
          </Tab>
          
        </Tabs>
      </div>



      <Button className="bt_rightside" onClick={getTest} variant="danger">test</Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Request for Appointment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          
          <form >
            <Form.Select className="mb-3" aria-label="Default select example" onChange={(e)=> setPet(e.target.value)}>
              <option>Pet (what is your pet?)</option>
              <option value="1">Dog</option>
              <option value="2">Cat</option>
              <option value="3">Rabbit</option>
              <option value="4">Horse</option>
              <option value="5">Mouse</option>
            </Form.Select>

            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Pet's Name" onChange={(e)=> setPetname(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control type="text" placeholder="Symptom" onChange={(e)=> setPetSym(e.target.value)}/>
            </Form.Group>

            <Form.Group className="mb-3 text-center">
              <Form.Label>Appointment Date</Form.Label>
              <Row className="g-2">
              
              </Row>
            </Form.Group>
            
          </form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Member;
