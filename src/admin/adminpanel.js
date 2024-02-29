import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import { useNavigate } from "react-router-dom";
import "../css/admin.css";
import {
  db,
  auth,
  fetchRequestData,
  fetchAppointData,
} from "../firebase/firebase1";
import { addDoc, collection, deleteDoc, doc } from "firebase/firestore";
import React, { useState, useEffect } from "react";

const Adminpanel = () => {
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [docName, setdocName] = useState("");
  const [tel, setTel] = useState("");
  const [show, setShow] = useState(false);
  const [pssChange, changePassword] = useState("");
  const [nameChange, changeName] = useState("");
  const [phoneChange, changePhone] = useState("");
  const [request, setRequest] = useState([]);
  const [appoint, setAppoint] = useState([]);
  const [selectedIdDelete, setSelectedIdDelete] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const user = auth.currentUser;

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setSelectedIdDelete(id);
    setShowDelete(true);
  };

  const handleClose = () => setShow(false);
  const handleShow = (data) => {
    setShow(true);
    setdocName(data.namedoc);
    setTel(data.tel);
    setpassword(data.passwordLogin);
    setemail(data.emailLogin);
  };

  useEffect(() => {
    const fetchData = async () => {
      const requestData = await fetchRequestData();
      const appointData = await fetchAppointData();
      setRequest(requestData);
      setAppoint(appointData);
    };
    fetchData();
  }, []);

  const list_doctor = [
    {
      id: "1",
      namedoc: "Poke",
      emailLogin: "Earn@hot.com",
      passwordLogin: "pokemon",
      tel: "0100000000",
    },
    {
      id: "2",
      namedoc: "Mon",
      emailLogin: "Share@hot.com",
      passwordLogin: "pokemon",
      tel: "0200000000",
    },
    {
      id: "3",
      namedoc: "zet",
      emailLogin: "Tonnam@hot.com",
      passwordLogin: "pokemon",
      tel: "0300000000",
    },
    {
      id: "4",
      namedoc: "Non",
      emailLogin: "Mem@hot.com",
      passwordLogin: "pokemon",
      tel: "0400000000",
    },
  ];

  const list_member = [
    { id: "1", namedoc: "Ben", nickname: "Earn" },
    { id: "2", namedoc: "Milk", nickname: "Share" },
    { id: "3", namedoc: "James", nickname: "Tonnam" },
    { id: "4", namedoc: "Ten", nickname: "Mem" },
  ];

  //ยืนยัน request ถ้ากด approve จะเพิ่มข้อมูลนั้นๆใน appointment
  const approveRequest = async (data) => {
    const docRef = await addDoc(collection(db, "appointment"), {
      userUid: data.userUid,
      userEmail: data.userEmail,
      typePet: data.typePet,
      petName: data.petName,
      petSym: data.petSym,
      dateForAppoint: data.dateForAppoint,
      checkedVer: false,
    });
  };

  //เอาไว้ลบข้อมูล เมื่อกด no approve
  const deleteData = async (dataId) => {
    await deleteDoc(doc(db, "request", dataId));
    const requestData = await fetchRequestData();
    setRequest(requestData);
    setShowDelete(false);
  };

  //table doctor
  const table_doctor = (data) => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Email Login(Can't Change)</th>
            <th>Password Login</th>
            <th>Phone Number</th>
            <th>Appointment</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data.map((val, index) => (
            <tr key={index}>
              <td>{val.id}</td>
              <td>{val.namedoc}</td>
              <td>{val.emailLogin}</td>
              <td>{val.passwordLogin}</td>
              <td>{val.tel}</td>
              <td>
                <Button variant="outline-primary">See</Button>
              </td>
              <td>
                <Button variant="warning" onClick={() => handleShow(val)}>
                  Update
                </Button>
              </td>
              <td>
                <Button variant="danger">Delete</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    );
  };

  //table request
  const table_request = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Requester Email</th>
            <th>Pet Name</th>
            <th>Pet Symptoms</th>
            <th>Type</th>
            <th>Appointment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {request &&
            request.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.userEmail}</td>
                <td>{val.petName}</td>
                <td>{val.petSym}</td>
                <td>{val.typePet}</td>
                <td>{val.dateForAppoint}</td>
                <td className="Controlbutton">
                  <Button
                    variant="outline-success"
                    onClick={() => approveRequest(val)}
                  >
                    approve
                  </Button>

                  <Button
                    variant="outline-danger"
                    onClick={() => handleShowDelete(val.id)}
                  >
                    Not approved
                  </Button>
                  <Modal show={showDelete} onHide={handleCloseDelete}>
                    <Modal.Header closeButton>
                      <Modal.Title>Are Sure</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>ตรวจสอบว่าข้อมูลว่าลบถูกหรือไม่</Modal.Body>
                    <Modal.Footer>
                      <Button variant="secondary" onClick={handleCloseDelete}>
                        Close
                      </Button>
                      <Button
                        variant="danger"
                        onClick={() => deleteData(selectedIdDelete)}
                      >
                        Yes Delete
                      </Button>
                    </Modal.Footer>
                  </Modal>
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  };

  //table appointment
  const table_appointment = () => {
    return (
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>#</th>
            <th>Requester Email</th>
            <th>Pet Name</th>
            <th>Pet Symptoms</th>
            <th>Type</th>
            <th>Appointment Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {appoint &&
            appoint.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.userEmail}</td>
                <td>{val.petName}</td>
                <td>{val.petSym}</td>
                <td>{val.typePet}</td>
                <td>{val.dateForAppoint}</td>
                <td>{val.checkedVer ? "Checked" : "Not yet Checked"}</td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
  };

  return (
    <div>
      <div className="container text-center">
        <div className="row align-items-start mt-5">
          <h1>Admin Panel</h1>
        </div>
        <Tabs
          defaultActiveKey="profile"
          id="fill-tab-example"
          className="mb-3"
          fill
        >
          <Tab eventKey="request" title="Request">
            {table_request()}
          </Tab>
          <Tab eventKey="appointment" title="Appointments">
            {table_appointment()}
          </Tab>
          <Tab eventKey="doctor" title="Doctor">
            {table_doctor(list_doctor)}
          </Tab>
          <Tab eventKey="member" title="Member">
            {table_doctor(list_member)}
          </Tab>
          <Tab eventKey="vaccine" title="Vaccine"></Tab>
        </Tabs>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* // Form change password */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control type="email" value={email} disabled />
            </Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="text"
              id="docname"
              value={password}
              onChange={(e) => changePassword(e.target.value)}
            />

            <Modal.Footer>
              <Button variant="danger" onClick={handleClose}>
                Change Password
              </Button>
            </Modal.Footer>
          </Form>

          {/* // Form change normal data */}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                id="docname"
                value={docName}
                onChange={(e) => changeName(e.target.value)}
              />

              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                id="phonenum"
                value={tel}
                onChange={(e) => changePhone(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Adminpanel;
