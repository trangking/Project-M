import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import "../css/admin.css";
import React, { useState } from "react";

const Admin = () => {
  const [emailLogin, setemail] = useState("");
  const [pssLogin, setpassword] = useState("");

  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Do something with the input value, e.g., send it to an API, update state, etc.
    console.log("Input Value:", emailLogin);
    console.log("Input Value:", pssLogin);
  };

  return (
    <div>
      <div className="container text-center">
        <div className="row align-items-start mt-5">
          <h1>Admin Login Page</h1>
        </div>
        <div className="row align-items-start">
          <div className="col"></div>
          <form className="formLogincss" onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Email address</Form.Label>
              <Form.Control  
              value={emailLogin}
              onChange={(e) => setemail(e.target.value)}
              type="email" placeholder="Enter email" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control  
              value={pssLogin} 
              onChange={(e) => setpassword(e.target.value)}
              type="password" placeholder="Password" />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </form>
          <div className="col"></div>
        </div>
      </div>
    </div>
  );
};

export default Admin;
