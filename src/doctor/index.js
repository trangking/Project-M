import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import {
  db,
  auth,
  fetchAppointData,
  fetchVaccineData,
  fetchDoctorData
} from "../firebase/firebase1";
import { signOut } from "firebase/auth";
import { doc, updateDoc } from "firebase/firestore";

const Doctor = () => {
  const [appoint, setAppoint] = useState([]);
  const [checked, setChecked] = useState([]);
  const [vaccine, setVaccine] = useState("None");
  const [vaccineData, setDataVaccine] = useState([]);
  const [show, setShow] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const navigate = useNavigate();
  const user = auth.currentUser;

  //get data from firestore and separate between checked and not yet check
  const fetchData = async () => {
    const appointData = await fetchAppointData();
    const dataQuery = queryAppoint(appointData);
    setAppoint(dataQuery.notAppoint);
    setChecked(dataQuery.checkedQuery);
  };


  const isDoctor = async() =>{
    const doctorData = await fetchDoctorData();
    const listDoctorEmail=[];

    doctorData.forEach((i) => {
      
      listDoctorEmail.push(i.doctorEmail);
      

    });

    
    return listDoctorEmail.includes(user.email);
  }

  useEffect(() => {
    if (!user) navigate("/login");
    else {
      if(isDoctor) fetchData(); 
    }
    
  }, []);

  //get appoint data which check = false
  const queryAppoint = (data) => {
    let appointQuered = [];
    let checkedQuery = [];
    data.forEach((i) => {
      if (!i.checkedVer) {
        appointQuered.push(i);
      } else {
        checkedQuery.push(i);
      }
    });
    let obj = {
      notAppoint: appointQuered,
      checkedQuery: checkedQuery,
    };
    return obj;
  };
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = async (id) => {
    setShow(true);
    setSelectedId(id);
    const data = await fetchVaccineData();
    setDataVaccine(data);
  };

  const docUseVaccine = async (e) => {
    e.preventDefault();

    if (vaccine != "None") {
      const obj = vaccineData.find((item) => item.id === vaccine);
      // console.log(obj.amount);
      const vacRef = doc(db, "vaccine", vaccine);
      await updateDoc(vacRef, {
        amount: obj.amount - 1,
      });

      const appointRef = doc(db, "appointment", selectedId);
      await updateDoc(appointRef, {
        vaccineName: obj.vaccineName,
      });
    }
    setVaccine("None");

    handleClose();
  };

  //when doctor puss check button to update status that it has checked or not
  const updateStatus = async (id) => {
    const data = doc(db, "appointment", id);
    await updateDoc(data, {
      checkedVer: true,
    });
    fetchData();
  };

  const table_appointment = (data) => {
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
            <th>Vaccine</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data &&
            data.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.userEmail}</td>
                <td>{val.petName}</td>
                <td>{val.petSym}</td>
                <td>{val.typePet}</td>
                <td>{val.dateForAppoint}</td>
                <td>
                  {val.checkedVer ? (
                    val.vaccineName != "" ? (
                      val.vaccineName
                    ) : (
                      "None"
                    )
                  ) : (
                    <Button
                      variant="warning"
                      onClick={() => handleShow(val.id)}
                    >
                      Vaccine
                    </Button>
                  )}
                </td>
                <td>
                  {val.checkedVer ? (
                    "Checked"
                  ) : (
                    <Button
                      variant="success"
                      onClick={() => updateStatus(val.id)}
                    >
                      Check
                    </Button>
                  )}
                </td>
              </tr>
            ))}
        </tbody>
      </Table>
    );
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

  // const testVac = () => {
  //   console.log(vaccineData.length);
  // };
  return (
    <>
      <div className="container text-center">
        <div className=" mt-5">
          <h1>Doctor Page</h1>
        </div>
        <Button className="bt_rightside" onClick={signOutFunc} variant="danger">
        Sign Out
      </Button>
        <Tabs
          defaultActiveKey="profile"
          id="fill-tab-example"
          className="mb-3 mt-3"
          fill
        >
          <Tab eventKey="doctor" title="New Appointment">
            {table_appointment(appoint)}
          </Tab>
          <Tab eventKey="member" title="Checked">
            {table_appointment(checked)}
          </Tab>
        </Tabs>
      </div>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Vaccine</Modal.Title>
        </Modal.Header>
        <form onSubmit={docUseVaccine}>
          <Modal.Body>
            <Form.Select
              className="mb-3"
              aria-label="Default select example"
              onChange={(e) => setVaccine(e.target.value)}
              required
            >
              <option value="None">None</option>
              {vaccineData.map((i) => (
                <option key={i.id} value={i.id}>
                  {i.vaccineName}
                </option>
              ))}
              
            </Form.Select>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </>
  );
};

export default Doctor;
