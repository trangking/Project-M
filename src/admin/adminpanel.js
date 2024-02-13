import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Table from "react-bootstrap/Table";
import Modal from "react-bootstrap/Modal";
import "../css/admin.css";
import React, { useState } from "react";

const Adminpanel = () => {
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [docName, setdocName] = useState("");
  const [tel, setTel] = useState("");
  const [show, setShow] = useState(false);
  const [pssChange, changePassword] = useState("");
  const [nameChange, changeName] = useState("");
  const [phoneChange, changePhone] = useState("");

  const handleClose = () => setShow(false);
  const handleShow = (data) => {
    setShow(true);
    setdocName(data.namedoc);
    setTel(data.tel);
    setpassword(data.passwordLogin);
    setemail(data.emailLogin);
  };

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

  //   const handleSubmit = (e) => {
  //     e.preventDefault();
  //     // Do something with the input value, e.g., send it to an API, update state, etc.
  //     console.log("Input Value:", emailLogin);
  //     console.log("Input Value:", pssLogin);
  //   };

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
          <Tab eventKey="doctor" title="Doctor">
            {table_doctor(list_doctor)}
          </Tab>
          <Tab eventKey="member" title="Member">
            {table_doctor(list_member)}
          </Tab>
          <Tab eventKey="vaccine" title="Vaccine"></Tab>
          <Tab eventKey="appointment" title="Appointments"></Tab>
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
