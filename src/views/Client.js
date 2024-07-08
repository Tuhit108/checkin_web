import React, { useEffect, useState } from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {
    Card,
    Table,
    Row,
    Col,
    Form,
    Modal,
    Button,
} from "react-bootstrap";
import {
    requestAddWifiClient,
    requestAllClientWifi,
    requestDeleteWifiClient,
    requestUpdateWifiClient
} from "../store/clientWifi/function";

const AddModal = ({ isOpen, onSubmit, onClose }) => {
    const [name, setName] = useState('');
    const [bssid, setBssid] = useState('');

    const handleSubmit = () => {
        onSubmit({
            name,
            bssid,
        });
        onClose();
    }

    return (
        <Modal show={isOpen} onHide={onClose}>
            <Modal.Header closeButton>
                <Modal.Title>Add location</Modal.Title>
            </Modal.Header>
            <Form>
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Lotte Center"
                            autoFocus
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>BSSID</Form.Label>
                        <Form.Control
                            placeholder="MAC Address"
                            autoFocus
                            required
                            inputMode="text"
                            value={bssid}
                            onChange={(e) => setBssid(e.target.value)}
                        />
                    </Form.Group>

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
    const [name, setName] = useState(data?.name ?? '');
    const [bssid, setBssid] = useState(data?.BSSID ?? '');

    useEffect(() => {
        setName(data?.name);
        setBssid(data?.BSSID);
    }, [data]);

    const handleSubmit = () => {

        onSubmit(data?.id, {
            name,
            bssid,
        });
        onClose();
    }

    return (
        <Modal show={isOpen} onHide={onClose} className={"modal-calendar"}>
            <Modal.Header closeButton>
                <Modal.Title>Edit location</Modal.Title>
            </Modal.Header>
            <Form >
                <Modal.Body>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput1">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Lotte Center"
                            autoFocus
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlInput2">
                        <Form.Label>BSSID</Form.Label>
                        <Form.Control
                            placeholder="MAC"
                            autoFocus
                            required
                            inputMode="text"
                            value={bssid}
                            onChange={(e) => setBssid(e.target.value)}
                        />
                    </Form.Group>

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


function Client() {
    const [client, setClient] = useState([]);
    const [showAdd, setShowAdd] = useState(false);
    const [showEdit, setShowEdit] = useState(false);
    const [dataEdit, setDataEdit] = useState(null);
    const [refetch, setRefetch] = useState(0);

    useEffect(() => {
        requestAllClientWifi()
            .then(res => {
                setClient(res);
            })
            .catch(e => {
                console.log(e);
            })
    }, [refetch])

    const addWifiClient = (data) => {
        requestAddWifiClient(data.name, data.bssid)
            .then(res => {
                alert('Create client successfully!');
                setRefetch(refetch + 1);
            })
            .catch(e => {
                alert('Something when wrong!')
            })
    }

    const updateWifiClient = (id, data) => {
        requestUpdateWifiClient(id, data.name, data.bssid)
            .then(res => {
                alert('Update client successfully!');
                setRefetch(refetch + 1);
            })
            .catch(e => {
                alert('Something when wrong!')
            })
    }

    const handleDeleteWifiClient = (id) => {
        requestDeleteWifiClient(id)
            .then(res => {
                alert('Delete client successfully!')
                setRefetch(refetch + 1);
            })
            .catch(e => {
                alert('Something when wrong!')
            })
    }
    console.log("client", client)

    return (
        <>
            <Row >
                <Col md="12">
                    <Card className="strpied-tabled-with-hover">
                        <Card.Header style={{
                            display: "flex",
                            justifyContent: 'space-between'
                        }}>
                            <div className={"header-table"}>
                                Client Wifi
                            </div>

                            <button
                                style={{
                                    backgroundColor: '#2686ed',
                                    color: 'white',
                                    borderRadius: '4px',
                                    borderWidth: '0px',
                                    padding: '4px 8px'
                                }}
                                onClick={() => setShowAdd(true)}
                            >
                                Add Wifi Client
                            </button>
                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                            <Table className="table-hover table-striped">
                                <thead>
                                <tr>
                                    <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>STT</th>
                                    <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Tên địa điểm</th>
                                    <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>BSSID</th>
                                    <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Thao tác</th>
                                </tr>
                                </thead>
                                <tbody>
                                {client.map((item, index) => (
                                    <tr key={index}
                                        onClick={() => {
                                        }}
                                    >
                                        <td>{index + 1}</td>
                                        <td style={{ cursor: 'pointer'}}>{item.name}</td>
                                        <td>{item.BSSID}</td>
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
                                                onClick={(e) => {
                                                    e.stopPropagation();
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
                                                onClick={(e) => {
                                                    e.stopPropagation()
                                                    handleDeleteWifiClient(item.id)
                                                }}
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
            <AddModal isOpen={showAdd} onClose={() => setShowAdd(false)} onSubmit={addWifiClient} />
            <EditModal
                isOpen={showEdit}
                onClose={() => {
                    setShowEdit(false);
                    setDataEdit(null);
                }}
                onSubmit={updateWifiClient}
                data={dataEdit}
            />
        </>
    );
}

export default Client;
