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
  fetchVaccineData,
  fetchDoctorData,
  fetchMemberData,
  fetchAdminData
} from "../firebase/firebase1";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  updateDoc,
  setDoc,
} from "firebase/firestore";
import React, { useState, useEffect } from "react";
import { signOut } from "firebase/auth";

const Adminpanel = () => {
  const navigate = useNavigate();
  const [emailDoctor, setemailDoctor] = useState("");
  
  const [docName, setdocName] = useState("");
  
  const [vaccineName, setVaccineName] = useState("");
  const [request, setRequest] = useState([]);
  const [appoint, setAppoint] = useState([]);
  const [selectedIdDelete, setSelectedIdDelete] = useState(null);
  const [showDelete, setShowDelete] = useState(false);
  const [vaccine, setVaccine] = useState([]);
  const [doctorList, setDoctorList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [showVaccine, setShowVaccine] = useState(false);
  const [vaccineAmount, setVaccineAmount] = useState();
  const [selectVaccineId, setVaccineIdSelect] = useState();
  const user = auth.currentUser;

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setSelectedIdDelete(id);
    setShowDelete(true);
  };


  const handShowVaccine = (val) => {
    setShowVaccine(true);
    setVaccineName(val.vaccineName);
    setVaccineAmount(val.amount);
    setVaccineIdSelect(val.id);
  };
  const handCloseVaccine = () => {
    setShowVaccine(false);
  };

  const fetchData = async () => {
    const requestData = await fetchRequestData();
    const appointData = await fetchAppointData();
    const vaccineData = await fetchVaccineData();
    const doctorData = await fetchDoctorData();
    const memberData = await fetchMemberData();
    setRequest(requestData);
    setAppoint(appointData);
    setVaccine(vaccineData);
    setDoctorList(doctorData)
    setMemberList(memberData)
  };

  const isAdmin = async() =>{
    const adminData = await fetchAdminData();
    const listAdminUid=[];

    adminData.forEach((i) => {     
      listAdminUid.push(i.adminUid);
    });
   
    return listAdminUid.includes(user.uid);
  }

  useEffect(() => {
    if (!user) navigate("/login");
    else {
      if(isAdmin) fetchData(); 
    }
  }, []);


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
      vaccineName: "",
    });
    await deleteData(data.id, 1);
    const appointmentData = await fetchAppointData();
    setAppoint(appointmentData);
  };

  //เอาไว้ลบข้อมูล เมื่อกด no approve
  const deleteData = async (dataId, whichOne) => {
    if(whichOne ==1){
      await deleteDoc(doc(db, "request", dataId));
      const requestData = await fetchRequestData();
      setRequest(requestData);
      setShowDelete(false);
    }else if(whichOne ==2){
      await deleteDoc(doc(db, "doctor", dataId));
      const doctorData = await fetchDoctorData();
      setDoctorList(doctorData);
      
    }else{
      await deleteDoc(doc(db, "vaccine", dataId));
      const viccineData = await fetchVaccineData();
      setVaccine(viccineData);
    }
  };

  const addDoctor = async(e)=>{
    e.preventDefault();
    const docRef = await addDoc(collection(db, "doctor"), {
      doctorName: docName,
      doctorEmail: emailDoctor,
    });
    const doctorData = await fetchDoctorData();
    setDoctorList(doctorData)
  }

  //table doctor
  const table_doctor = (data) => {
    return (
      <>
        <form onSubmit={addDoctor}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Control
                type="email"
                placeholder="Doctor e-mail"
                onChange={(e) => setemailDoctor(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Doctor Name"
                onChange={(e) => setdocName(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Add Doctor
            </Button>
          </Modal.Footer>
        </form>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email </th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {data.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.doctorName}</td>
                <td>{val.doctorEmail}</td>
                <td>
                  <Button variant="danger" onClick={()=> deleteData(val.id, 2)}>Delete</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </>
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
                        onClick={() => deleteData(selectedIdDelete, 1)}
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

  const table_vaccine = () => {
    return (
      <Table striped bordered hover className="mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>Vaccine Name</th>
            <th>Amount</th>
            <th></th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {vaccine &&
            vaccine.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.vaccineName}</td>
                <td>{val.amount}</td>
                <td>
                  <Button
                    variant="outline-success"
                    onClick={() => handShowVaccine(val)}
                  >
                    Manage Vaccine
                  </Button>
                </td>
                <td>
                  <Button variant="danger" onClick={()=> deleteData(val.id, 3)}>Delete</Button>
                </td>

                {/* <td>{val.checkedVer ? "Checked" : "Not yet Checked"}</td> */}
              </tr>
            ))}
        </tbody>
      </Table>
    );
  };

  const table_member =()=>{
    return(
      <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Uid </th>
              
            </tr>
          </thead>
          <tbody>
            {memberList.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.memberEmail}</td>
                <td>{val.id}</td>
                
              </tr>
            ))}
          </tbody>
        </Table>
    )
  }

  const updateVaccineData = async (e) => {
    e.preventDefault();
    const vacRef = doc(db, "vaccine", selectVaccineId);
    await updateDoc(vacRef, {
      vaccineName: vaccineName,
      amount: parseInt(vaccineAmount),
    });

    fetchData();
    setShowVaccine(false);
  };

  const addVaccineData = async (e) => {
    e.preventDefault();
    const docRef = await addDoc(collection(db, "vaccine"), {
      vaccineName: vaccineName,
      amount: parseInt(vaccineAmount),
    });
    const vaccineData = await fetchVaccineData();
    setVaccine(vaccineData);
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

  return (
    <div>
      <div className="container text-center">
        <div className="row align-items-start mt-5">
          <h1>Admin Panel</h1>
        </div>
        <Button className="bt_rightside" onClick={signOutFunc} variant="danger">
        Sign Out
      </Button>
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
            {table_doctor(doctorList)}
          </Tab>
          <Tab eventKey="member" title="Member">
            {table_member()}
          </Tab>
          <Tab eventKey="vaccine" title="Vaccine">
            <form onSubmit={addVaccineData}>
              <Modal.Body>
                <Form.Group className="mb-3">
                  <Form.Control
                    type="text"
                    placeholder="Vaccine's Name"
                    onChange={(e) => setVaccineName(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Control
                    type="number"
                    placeholder="Amount"
                    onChange={(e) => setVaccineAmount(e.target.value)}
                    required
                  />
                </Form.Group>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="primary" type="submit">
                  Add Vaccine
                </Button>
              </Modal.Footer>
            </form>
            {table_vaccine()}
          </Tab>
        </Tabs>
      </div>

      <Modal show={showVaccine} onHide={handCloseVaccine}>
        <Modal.Header closeButton>
          <Modal.Title>Vaccine</Modal.Title>
        </Modal.Header>
        <form onSubmit={updateVaccineData}>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Control
                type="text"
                placeholder="Vaccine's Name"
                value={vaccineName}
                onChange={(e) => setVaccineName(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Control
                type="number"
                placeholder="Amount"
                value={vaccineAmount}
                onChange={(e) => setVaccineAmount(e.target.value)}
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Modal.Footer>
        </form>
      </Modal>
    </div>
  );
};

export default Adminpanel;
