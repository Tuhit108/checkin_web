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
import { getConfig, updateConfig } from "../services/settingServices";

function Setting() {
  const [distance, setDistance] = useState('');

  useEffect(() => {
    getConfig()
    .then(res => {
      setDistance(res.data.data.distance);
    })
    .catch(e => {
      alert('Something was wrong!');
    })
  }, [])

  const handleUpdate = () => {
    updateConfig(parseFloat(distance))
    .then(res => {
      alert('Update distance successfully!');
    })
    .catch(e => {
      alert('Something was wrong!');
    })
  }

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card>
              <Card.Body>
                <Form>
                  <Row className="px-1" md="12" style={{ justifyContent: 'space-between' }}>
                    <Form.Group style={{ display: "flex", flexDirection: 'row', alignItems: 'center', gap: 10, flexBasis: '70%' }}>
                      <h5 style={{ flex: 1, margin: 0 }}>Accepted distance: </h5>
                      <Form.Control
                        style={{ flex: 1, flexGrow: 5 }}
                        value={distance}
                        placeholder="Distance"
                        type="numeric"
                        onChange={(e) => setDistance(e.target.value)}
                      />
                      <h5 style={{ flex: 1, margin: 0, color: 'gray' }}>meters</h5>
                    </Form.Group>

                    <Button
                      className="btn-fill pull-right"
                      variant="info"
                      style={{ flexBasis: '10%' }}
                      onClick={handleUpdate}
                    >
                      Save
                    </Button>
                  </Row>
                  <div className="clearfix"></div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default Setting;
