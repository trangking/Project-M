import React, { useState, useEffect } from "react";
import DatePicker from "react-datepicker";
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
  fetchDoctorData,
  fetchRequestData,
  fetchMemberData,
  fetchTypeData
} from "../firebase/firebase1";
import { signOut } from "firebase/auth";
import { doc, updateDoc, addDoc, collection , deleteDoc } from "firebase/firestore";

const Doctor = () => {
  const [appoint, setAppoint] = useState([]);
  const [checked, setChecked] = useState([]);
  const [vaccine, setVaccine] = useState("None");
  const [vaccineData, setDataVaccine] = useState([]);
  const [show, setShow] = useState(false);
  const [showMember, setShowMember] = useState(false);
  const [request, setRequest] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [showDelete, setShowDelete] = useState(false);
  const [selectedIdDelete, setSelectedIdDelete] = useState(null);
  const [selectedId, setSelectedId] = useState(null);
  const [objMember, setObjMember] = useState({});
  const [pet, setPet] = useState("Cat");
  const [typeList, setTypeList] = useState([]);
  const [petName, setPetname] = useState("");
  const [petSym, setPetSym] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const navigate = useNavigate();
  const user = auth.currentUser;

  //get data from firestore and separate between checked and not yet check
  const fetchData = async () => {
    const appointData = await fetchAppointData();
    const requestData = await fetchRequestData();
    const memberData = await fetchMemberData();
    setRequest(requestData);
    const dataQuery = queryAppoint(appointData);
    setAppoint(dataQuery.notAppoint);
    setChecked(dataQuery.checkedQuery);
    setMemberList(memberData);
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

  const handleCloseDelete = () => setShowDelete(false);
  const handleShowDelete = (id) => {
    setSelectedIdDelete(id);
    setShowDelete(true);
  };

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
  const handleClose_member = () =>{
    setShowMember(false);
  }
  const handleShow = async (id, i) => {
    if(i===1){
      setShow(true);
    setSelectedId(id);
    const data = await fetchVaccineData();
    setDataVaccine(data);
    }else{
      setShowMember(true);
      const type = await fetchTypeData();
      setTypeList(type);
     
      setObjMember(id);
    }
    
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
                      onClick={() => handleShow(val.id, 1)}
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

  const deleteData = async(dataId) =>{
    await deleteDoc(doc(db, "request", dataId));
    const requestData = await fetchRequestData();
    setRequest(requestData);
    setShowDelete(false);
  }

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
    fetchData();
  };

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

  const table_member =()=>{
    return(
      <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>#</th>
              <th>Email</th>
              <th>Username</th>
              <th>Phone Number</th>
              <th>Address</th>
              <th>Make Appointment</th>
              
            </tr>
          </thead>
          <tbody>
            {memberList.map((val, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{val.memberEmail}</td>
                <td>{val.username}</td>
                <td>{val.phoneNumber}</td>
                <td>{val.address}</td>
                <td>
                <Button
                      variant="success"
                      onClick={() => handleShow({id:val.id, emailMember:val.memberEmail}, 2)}
                    >
                      DO
                    </Button>
                </td>
                
              </tr>
            ))}
          </tbody>
        </Table>
    )
  }

  const doctor_submit_appointment = async(e) =>{
    e.preventDefault();
 
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
    
    
    await addDoc(collection(db, "appointment"),{
      userUid: objMember.id,
      userEmail: objMember.emailMember,
      typePet: pet,
      petName: petName,
      petSym: petSym,
      dateForAppoint: dateToappoint,
      checkedVer: false,
      vaccineName: "",
    })

    const appointData = await fetchAppointData();
    const dataQuery = queryAppoint(appointData);
    setAppoint(dataQuery.notAppoint);
    setChecked(dataQuery.checkedQuery);
    setShowMember(false);
  }
  

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
          <Tab eventKey="request" title="Requestion">
            {table_request(request)}
          </Tab>
          <Tab eventKey="doctor" title="New Appointment">
            {table_appointment(appoint)}
          </Tab>
          <Tab eventKey="appointment" title="Checked">
            {table_appointment(checked)}
          </Tab>
          <Tab eventKey="member" title="Member">
            {table_member()}
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

      <Modal show={showMember} onHide={handleClose_member}>
      <Modal.Header closeButton>
          <Modal.Title>Appoint</Modal.Title>
        </Modal.Header>
        <Modal.Body>
       
          <Form onSubmit={doctor_submit_appointment}>
          <Form.Group className="mb-3">
            <Form.Control
              type="text"
             
              defaultValue={objMember.emailMember}
              disabled
            readOnly
              
              required
            />

          </Form.Group>
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
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Control
              type="text"
              placeholder="Symptom"
              onChange={(e) => setPetSym(e.target.value)}
              required
            />
          
          </Form.Group>


          <Form.Group className="mb-3 text-center">
            <Form.Label>Appointment Date: </Form.Label>
           
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
              />
          
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Doctor;
