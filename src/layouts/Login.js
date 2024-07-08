import React from "react";
import PersonIcon from '@mui/icons-material/Person';
import LockIcon from '@mui/icons-material/Lock';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';

import axios from 'axios';
import { useState } from "react";
import { useHistory } from 'react-router-dom';

// react-bootstrap components
import {
    Button,
    Form,
    Container,
    Row,
    Col,
    Card,
    Image
} from "react-bootstrap";

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const history = useHistory();
    const userData = localStorage.getItem('userData');

    if (userData) {
        history.push('/admin');
        return;
    }

    const handleLogin = () => {
        const userCredentials = {
            email: username,
            password: password,
        };
        // Gọi API với Axios
        axios.post('https://us-central1-tcheckin.cloudfunctions.net/app/checkin/login', userCredentials)
            .then(response => {
                if (response.data) {
                    // if (response.data?.data?.role === 'ADMIN') {
                        localStorage.setItem('userData', JSON.stringify(response.data?.user || ""));
                        alert('Login successfully!');
                        history.push('/admin');
                    // }
                    // else {
                    //     alert('You are not Admin!');
                    // }
                }
                else {
                    alert(response?.data?.error);
                }
            })
            .catch(e => {
                alert('Something was wrong!')
            });
    };
    return (
        <div style={{
            backgroundImage: `url(${process.env.PUBLIC_URL}/sigin-bg.jpeg)`,
            backgroundSize: 'cover'
        }}>
            <Container style={{
                display: "flex",
                alignItems: 'center',
                justifyContent: 'center',
                height: '100vh',
            }}
            >
                <Card style={{ width: 500, paddingLeft: 30, paddingRight: 30, paddingTop: 10 }}>
                    <Card.Header style={{ display: "flex", alignItems: "center", justifyContent: 'center', flexDirection: 'column', gap: 20 }}>
                        <Image src={process.env.PUBLIC_URL + '/logo.png'} width={100} />
                        <p style={{ fontFamily: "sans-serif", fontSize: 27, fontWeight: 900, color: '#585858' }} > SECURITY ADMIN</p>
                    </Card.Header>
                    <Card.Body>
                        <Form>
                            <Row >
                                <Col className="px-1" md="12">
                                    <Form.Group>
                                        <label>Tên đăng nhập / Email:</label>
                                        <label style={{ color: 'red', fontSize: '16px' }}>*</label>
                                        <Form.Control
                                            type="text"
                                            placeholder="Username"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col className="px-1" md="12">
                                    <Form.Group>
                                        <label>Mật khẩu:</label>
                                        <label style={{ color: 'red', fontSize: '16px' }}>*</label>
                                        <Form.Control
                                            type="password"
                                            placeholder="Password"
                                            value={password}
                                            onChange={e => setPassword(e.target.value)}
                                        >
                                        </Form.Control>
                                    </Form.Group>
                                </Col>
                            </Row>
                            <Row style={{ marginTop: '10px' }}>
                                <Col className="px-1" md="12" style={{ display: 'flex', justifyContent: 'center' }}>
                                    <Button
                                        className="btn-fill pull-right"
                                        style={{ marginTop: '15px' }}
                                        onClick={handleLogin}
                                    >
                                        Đăng nhập
                                    </Button>
                                </Col>
                            </Row>
                        </Form>
                    </Card.Body>
                </Card>
            </Container>
        </div>
    );
};
export default Login;
