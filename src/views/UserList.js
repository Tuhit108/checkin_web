import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
// react-bootstrap components
import {
  Badge,
  Button,
  Card,
  Navbar,
  Nav,
  Table,
  Container,
  Row,
  Col,
  Form,
  Modal
} from "react-bootstrap";
import moment from "moment";
import { getAllUser, deleteUserById, updateUserById } from "services/userServices";
import { createUser } from "services/userServices";
import { MenuItem, Select } from "@mui/material";
import {Link} from "react-router-dom";
import {requestAddUser} from "../store/user/function";

const AddModal = ({ isOpen, onSubmit, onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState('user');
  const [userCode, setUserCode] = useState('');

  const handleSubmit = () => {
    if (!name || !email || !password || !userCode) {
      alert('Vui lòng nhập đầy đủ thông tin')
      return
    }
    onSubmit({
      name,
      email,
      password,
      userCode,
      role
    });
    onClose();
  };

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add user</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="text"
              placeholder="Username"
              autoFocus
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Password"
              autoFocus
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ flex: 1 }}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="John"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3" style={{ flex: 1 }}>
              <Form.Label>Role</Form.Label>
              <Form.Select
                placeholder="ADMIN"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value='admin'>ADMIN</option>
                <option value='user'>USER</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ flex: 1 }}>
              <Form.Label>User Code</Form.Label>
              <Form.Control
                type="text"
                placeholder="100032"
                required
                value={userCode}
                onChange={(e) => setUserCode(e.target.value)}
              />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

const EditModal = ({ isOpen, onSubmit, onClose, data }) => {
  const [userName, setUserName] = useState(data?.userName ?? '');
  const [name, setName] = useState(data?.name ?? '');
  const [role, setRole] = useState(data?.role ?? '');
  const [phone, setPhone] = useState(data?.phone ?? '');
  const [dob, setDob] = useState(data?.dob ?? '');

  useEffect(() => {
    setUserName(data?.userName);
    setName(data?.name);
    setRole(data?.role);
    setPhone(data?.phone);
    setDob(data?.dob);

  }, [data]);

  const handleSubmit = () => {
    console.log(data?.id, {
      userName,
      name,
      role,
      phone,
      dob
    });
    onSubmit(data?.id, {
      userName,
      name,
      role,
      phone,
      dob
    });
    onClose();
  }

  return (
    <Modal show={isOpen} onHide={onClose} size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Add user</Modal.Title>
      </Modal.Header>
      <Form>
        <Modal.Body>
          <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
            <Form.Label>EMAIL</Form.Label>
            <Form.Control
              type="text"
              placeholder="duong123"
              autoFocus
              required
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
            />
          </Form.Group>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ flex: 1 }}>
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Lotte Center"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput3" style={{ flex: 1 }}>
              <Form.Label>Role</Form.Label>
              <Form.Select
                placeholder="ADMIN"
                required
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value='ADMIN'>ADMIN</option>
                <option value='SECURITY'>SECURITY</option>
              </Form.Select>
            </Form.Group>
          </Row>
          <Row>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput1" style={{ flex: 1 }}>
              <Form.Label>DoB</Form.Label>
              <Form.Control
                type="text"
                placeholder="20"
                required
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="exampleForm.ControlInput2" style={{ flex: 1 }}>
              <Form.Label>Phone</Form.Label>
              <Form.Control
                placeholder="0123345679"
                required
                inputMode="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </Form.Group>
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  )
}

function UserList() {
  const [userList, setUserList] = useState([]);
  const [showAdd, setShowAdd] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [dataEdit, setDataEdit] = useState(null);
  const [refetch, setRefetch] = useState(0);

  useEffect(() => {
    getAllUser()
      .then(res => {
        setUserList(res.data.data);
      })
      .catch(e => {
        console.log(e);
      })
  }, [refetch])

  const handleAddUser = (data) => {
    console.log("dtaa", data)
    requestAddUser(data)
      .then(res => {
        alert('Create user succesfully!')
        setRefetch(refetch + 1);
      })
      .catch(e => {
        console.log(e);
        alert('Something when wrong!')
      })
  }

  const handleUpdate = (id, data) => {
    updateUserById(id, data)
      .then(res => {
        alert('Update User successfully!');
        setRefetch(refetch + 1);
      })
      .catch(e => {
        alert('Something when wrong!')
      })
  }

  const handleDelete = (id) => {
    deleteUserById(id)
      .then(res => {
        alert('Delete User successfully!')
        setRefetch(refetch + 1);
      })
      .catch(e => {
        alert('Something when wrong!')
      })
  }
  console.log("user", userList)

  return (
    <>
      <Row>
        <Col md="12">
          <Card className="strpied-tabled-with-hover">
            <Card.Header style={{
              display: "flex",
              justifyContent: 'end'
            }}>
              <button
                style={{
                  backgroundColor: '#2686ed',
                  color: 'white',
                  borderWidth: '0px',
                  borderRadius: '4px',
                  padding: '4px 8px'
                }}
                onClick={() => setShowAdd(true)}
              >
                Add user
              </button>
            </Card.Header>
            <Card.Body className="table-full-width table-responsive px-0">
              <Table className="table-hover table-striped">
                <thead>
                <tr>
                  <th className="border-0" style={{fontSize: '15px', fontWeight: 'bold', color: '#000'}}>ID</th>
                  <th className="border-0" style={{fontSize: '15px', fontWeight: 'bold', color: '#000'}}>Họ tên</th>
                  <th className="border-0" style={{fontSize: '15px', fontWeight: 'bold', color: '#000'}}>Email</th>
                  <th className="border-0" style={{fontSize: '15px', fontWeight: 'bold', color: '#000'}}>Chức vụ</th>
                  <th className="border-0" style={{fontSize: '15px', fontWeight: 'bold', color: '#000'}}>Mã chấm công</th>
                  <th className="border-0" style={{fontSize: '15px', fontWeight: 'bold', color: '#000'}}>Hành động</th>

                </tr>
                </thead>
                <tbody>
                {userList.map((item, index) => (
                    <tr key={index}>
                        <td>{index + 1}</td>
                        <td>
                          <Link to={`/admin/users/${item.id}`}>
                            {item.name}
                          </Link>
                          </td>
                        <td>{item.email}</td>
                        <td>{item?.role || "Nhân viên"}</td>
                        <td>{item?.userCode}</td>
                        <td>
                          <EditIcon
                              style={{
                                backgroundColor: '#006000',
                                color: 'white',
                                padding: '3px',
                                borderRadius: '4px',
                                marginRight: '10px',
                                cursor: 'pointer'
                              }}
                              onClick={() => {
                                setDataEdit(item);
                                setShowEdit(true);
                              }}
                          />
                          <DeleteForeverIcon
                              style={{
                                backgroundColor: '#e53e3e',
                                color: '#ffffff',
                                padding: '3px',
                                borderRadius: '4px',
                                cursor: 'pointer'
                              }}
                              onClick={() => handleDelete(item.id)}
                          />
                        </td>
                      </tr>


                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <AddModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSubmit={handleAddUser}/>
      <EditModal
          isOpen={showEdit}
          onClose={() => {
            setShowEdit(false);
            setDataEdit(null);
          }}
          onSubmit={handleUpdate}
          data={dataEdit}
      />
    </>
  );
}

export default UserList;
