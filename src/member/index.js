import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";
import Alert from "react-bootstrap/Alert";
import Table from "react-bootstrap/Table";
import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth, db, fetchTypeData } from "../firebase/firebase1";
import { collection, addDoc, query, where, getDocs } from "firebase/firestore";
import "../css/user.css";
import DatePicker from "react-datepicker";

import Col from "react-bootstrap/Col";
import "react-datepicker/dist/react-datepicker.css";

const Member = () => {
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const user = auth.currentUser;
  const [pet, setPet] = useState("");
  const [petName, setPetname] = useState("");
  const [petSym, setPetSym] = useState("");
  const [alert, setAlert] = useState(false);
  const [listRequest, setRequest] = useState([]);
  const [appointList, setAppoint] = useState([]);
  const [historyList, setHistory] = useState([])
  const [typeList, setTypeList] = useState([]);
  const formRef = useRef(null);

  useEffect(() => {
    if (!user) navigate("/login");
    else {
      queryData();
    }
  }, []);

  const handleClose = () => {
    setShow(false);
  };
  const handleShow = (data) => {
    setShow(true);
  };

  //get data where user uid is bla bla
  const queryData = async () => {
    const q = query(
      collection(db, "request"),
      where("userUid", "==", user.uid)
    );

    const appointQuery = query(
      collection(db, "appointment"),
      where("userUid", "==", user.uid)
    );
    let listObj = [];
    let appointListQuery = [];
    let historyListQuery = [];
    const querySnapshot = await getDocs(q);
    const appointSnapshot = await getDocs(appointQuery);
    querySnapshot.forEach((doc) => {
      listObj.push(doc.data());
    });

    appointSnapshot.forEach((doc) => {
      
      if(doc.data().checkedVer){
        historyListQuery.push(doc.data());
      }else{
        appointListQuery.push(doc.data());
      }
      
    });

    const type = await fetchTypeData();
    setTypeList(type);
    setAppoint(appointListQuery);
    setHistory(historyListQuery);
    setRequest(listObj);
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

    if (petType == "") {
      petType = "Cat";
    }

    const docRef = await addDoc(collection(db, "request"), {
      userUid: user.uid,
      userEmail: user.email,
      typePet: petType,
      petName: petName,
      petSym: petSym,
      dateForAppoint: dateToappoint,
    });
    setPet("");
    setAlert(true);
    setTimeout(() => {
      setAlert(false);
      setShow(false);
    }, 1000);
    queryData();
    formRef.current.reset();
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
              <td>{index + 1}</td>
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

  const table_appointment = (data) => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>

            <th>Pet(type)</th>
            <th>Pet Name</th>
            <th>Pet Symptom</th>
            <th>On date</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((val, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>{val.typePet}</td>
              <td>{val.petName}</td>
              <td>{val.petSym}</td>
              <td>{val.dateForAppoint}</td>
              {/* <td>{val.checkedVer ? (
                    "Checked"
                  ) : (
                    "No Check"
                  )}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  const table_history = (data) =>{
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>

            <th>Pet(type)</th>
            <th>Pet Name</th>
            <th>Pet Symptom</th>
            <th>On date</th>
            
            <th>Vaccine</th>
            
          </tr>
        </thead>
        <tbody>
          {data.map((val, index) => (
            <tr key={index}>
              <td>{index + 1}</td>

              <td>{val.typePet}</td>
              <td>{val.petName}</td>
              <td>{val.petSym}</td>
              <td>{val.dateForAppoint}</td>
              <td>{ val.vaccineName != "" ? (
                      val.vaccineName
                    ) : (
                      "None"
                    )}</td>
              {/* <td>{val.checkedVer ? (
                    "Checked"
                  ) : (
                    "No Check"
                  )}</td> */}
            </tr>
          ))}
        </tbody>
      </Table>
    );
  }

  const form_select = () => {
    return (
      <form ref={formRef} onSubmit={submit_for_request}>
        <Modal.Body>
          <Form.Label>Pet (what is your pet?)</Form.Label>
          <Form.Select
            className="mb-3"
            aria-label="Default select example"
            onChange={(e) => setPet(e.target.value)}
            required
          >
            <option value="Cat">Cat</option>
            {typeList.map((i) =>
              i.typePet !== "Cat" ? (
                <option key={i.id} value={i.typePet}>
                  {i.typePet}
                </option>
              ) : null
            )}
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
    );
  };

  return (
    <div>
      <div className="container text-center mt-5">
        <Row>
          <Col>
            
            <Button
              className="bt_rightside"
              onClick={()=>{navigate('/member/profile')}}
              variant="primary"
            >
              Profile
            </Button>
          </Col>
          <Col xs={6}>
            <h1>Member Page</h1>
          </Col>
          <Col>
            <Button
              className="bt_rightside"
              onClick={signOutFunc}
              variant="danger"
            >
              Sign Out
            </Button>
          </Col>
        </Row>
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
          <Tab eventKey="doctor" title="Requestion">
            {table_request(listRequest)}
          </Tab>
          <Tab eventKey="member" title="Appointment">
            {table_appointment(appointList)}
          </Tab>
          <Tab eventKey="history" title="History">
            {table_history(historyList)}
          </Tab>
        </Tabs>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Request for Appointment</Modal.Title>
        </Modal.Header>
        {form_select()}
      </Modal>
    </div>
  );
};

export default Member;
