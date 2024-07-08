import React, { useEffect, useState } from "react";

// react-bootstrap components
import {
  Button,
  Card,
  Form,
  Container,
  Row,
  Col
} from "react-bootstrap";
import { getUserById } from "../services/userServices";
import axios from "axios";

function Account() {
  const [user, setUser] = useState();
  const userData = JSON.parse(localStorage.getItem('userData'));

  useEffect(() => {
    getUserById(userData.id)
      .then(res => {
        setUser(res.data);
      })
      .catch(e => {
        alert('Something was wrong!')
      })

  }, [])

  const handleUpdate = async () => {
    await axios.post(`${'http://178.128.126.128:9000'}/user/${userData?.id}`, user)
      .then(res => {
        alert('Update profile successfully!');
      })
      .catch(e => {
        alert('Something was wrong!');
      })
  }

  return (
    <>
      <Row style={{ padding: 20 }}>
        <Col md="12">
          <Card style={{ padding: 20 }}>
            <Card.Header>
              <Card.Title as="h4">Edit Profile</Card.Title>
            </Card.Header>
            <Card.Body>
              <Form >
                <Row>
                  <Col className="pl-1" md="5" style={{ flex: 1 }}>
                    <Form.Group>
                      <label>Username</label>
                      <Form.Control
                        value={user?.userName}
                        placeholder="Username"
                        disabled
                        type="text"
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pl-1" md="5" style={{ flex: 1 }}>
                    <Form.Group>
                      <label>Name</label>
                      <Form.Control
                        value={user?.name}
                        placeholder="Name"
                        type="text"
                        onChange={(e) => setUser({
                          ...user,
                          name: e.target.value
                        })}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pl-1" md="5" style={{ flex: 1 }}>
                    <Form.Group>
                      <label>Day of Birth</label>
                      <Form.Control
                        value={user?.dob}
                        placeholder="Date of birth"
                        type="text"
                        onChange={(e) => {
                          console.log(e.target.value); setUser({
                            ...user,
                            dob: e.target.value
                          })
                        }}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  <Col className="pl-1" md="5" style={{ flex: 1 }}>
                    <Form.Group>
                      <label>Phone Number</label>
                      <Form.Control
                        value={user?.phone}
                        placeholder="Phone Nunber"
                        type="text"
                        onChange={(e) => setUser({
                          ...user,
                          phone: e.target.value
                        })}
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                  <Col className="pl-1" md="5" style={{ flex: 1 }}>
                    <Form.Group>
                      <label>Role</label>
                      <Form.Control
                        defaultValue="ADMIN"
                        disabled
                      ></Form.Control>
                    </Form.Group>
                  </Col>
                </Row>
                <div style={{ width: '100%', alignItems: 'center', justifyContent: 'center', display: 'flex' }}>
                  <Button
                    className="btn-fill pull-right"
                    variant="info"
                    style={{ marginTop: '15px' }}
                    onClick={handleUpdate}
                  >
                    Update Profile
                  </Button>
                </div>
                <div className="clearfix"></div>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
}

export default Account;
