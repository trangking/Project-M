import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebase/firebase1";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "../css/user.css";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";

const Member = () => {
  const [userInfo, setuserInfo] = useState();
  const [token, setToken] = useState();
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [pet, setPet] = useState("");
  const [petName, setPetname] = useState("");
  const [petSym, setPetSym] = useState("");
  const [alert, setAlert] = useState(false);
  const [listRequest, setRequest] = useState([]);

  useEffect(() => {
    if (!user) navigate("/login");
    else queryData();
  }, []);

  

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (data) => {
    setShow(true);
  };

  const queryData = async () => {
    const q = query(
      collection(db, "request"),
      where("userUid", "==", user.uid)
    );
    let listObj = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      listObj.push(doc.data())
      
      // doc.data() is never undefined for query doc snapshots
      
    });
    console.log("This is list obj", listObj);
    setRequest(listObj)
  };

  const submit_for_request = async (event) => {
    event.preventDefault();
    let petType = pet;
    const list_month = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nor",
      "Dis",
    ];
    const dateToappoint =
      startDate.getDate() +
      " " +
      list_month[startDate.getMonth()] +
      " " +
      startDate.getFullYear();
    if (pet == "") {
      petType = "Dog";
    }
    const docRef = await addDoc(collection(db, "request"), {
      userUid: user.uid,
      userEmail: user.email,
      typePet: petType,
      petName: petName,
      petSym: petSym,
      dateForAppoint: dateToappoint,
    });
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
      setShow(false);
    }, 3000);
    queryData();
  };

  const getTest = () => {
    console.log(user.uid);
    console.log(user.email);
    console.log(listRequest);
  };

  const signOutFunc = async () => {
    signOut(auth)
      .then(() => {
        navigate("/login");
      })
      .catch((error) => {
        // An error happened.
      });
  };

  const table_request = (data) => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>User Email</th>
            <th>Pet(type)</th>
            <th>Pet Name</th>
            <th>Pet Symptom</th>
            <th>On date</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((val, index) => (
            <tr key={index}>
              <td>{index+1}</td>
              <td>{val.userEmail}</td>
              <td>{val.typePet}</td>
              <td>{val.petName}</td>
              <td>{val.petSym}</td>
              <td>{val.dateForAppoint}</td>
              
              
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      <Button className="bt_rightside" onClick={signOutFunc} variant="danger">
        Sign Out
      </Button>
      <div className="container text-center">
        <div className=" mt-5">
          <h1>Member Page</h1>
        </div>
        <Button
          className="mt-3"
          variant="success"
          onClick={() => handleShow(user)}
        >
          Add new request +
        </Button>
        <Tabs
          defaultActiveKey="profile"
          id="fill-tab-example"
          className="mb-3 mt-3"
          fill
        >
          <Tab eventKey="doctor" title="Requested">
          {table_request(listRequest)}
          </Tab>
          <Tab eventKey="member" title="Appointment">
            test2
          </Tab>
        </Tabs>
      </div>

      <Button className="bt_rightside" onClick={getTest} variant="danger">
        test
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Request for Appointment</Modal.Title>
        </Modal.Header>
        <form onSubmit={submit_for_request}>
          <Modal.Body>
            <Form.Label>Pet (what is your pet?)</Form.Label>
            <Form.Select
              className="mb-3"
              aria-label="Default select example"
              onChange={(e) => setPet(e.target.value)}
              required
            >
              <option value="Dog">Dog</option>
              <option value="Cat">Cat</option>
              <option value="Rabbit">Rabbit</option>
              <option value="Horse">Horse</option>
              <option value="Mouse">Mouse</option>
            </Form.Select>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Pet's Name"
                onChange={(e) => setPetname(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Symptom"
                onChange={(e) => setPetSym(e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">
                Please choose a username.
              </Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3 text-center">
              <Form.Label>Appointment Date</Form.Label>
              <Row className="g-2">
                <DatePicker
                  selected={startDate}
                  onChange={(date) => setStartDate(date)}
                />
              </Row>
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
          <Alert show={alert} variant="success">
            Sent the request!
          </Alert>
        </form>
      </Modal>
    </div>
  );
};

export default Member;
