import React, {memo, useCallback, useEffect, useMemo, useState} from "react";

// react-bootstrap components
import {Card, Col, Container, Form, Row} from "react-bootstrap";
import {updateConfig} from "../services/settingServices";
import {Button, Checkbox, TimePicker} from "antd";
import dayjs from "dayjs";
import {useAsyncFn} from "react-use";
import axios from "axios";
import {requestAllLocationClient} from "../store/clientWifi/function";
import {requestGetTimesheet} from "../services/timsheetService";

const ShiftCheckbox = memo(function ShiftCheckbox({
    params,
                                                      keyName,
                                                      onChangeValue
                                                  }) {
    const checked = useMemo(()=>{
        return (Number(params?.[keyName]) === 0);
    },[params])
    console.log("key", params?.[keyName] === 0, keyName, checked)
    const onChange = (e) => {
        onChangeValue(keyName, e.target.checked ? 0 : 1)
    }
    return (
        <Checkbox checked={checked} onChange={onChange}>Ca nghỉ</Checkbox>)
})
const ShiftTimePicker = memo(function ShiftCheckbox({
                                                        keyName,
                                                        onChangeValue,
                                                        params
                                                    }) {
    const onChange = (time, timeString) => {
        onChangeValue(keyName, timeString)

    };
    return (
        <TimePicker onChange={onChange} value={params?.[keyName] ? dayjs(params[keyName], "HH:mm") : null} format={"HH:mm"} defaultValue={params?.[keyName] ? dayjs(params[keyName], "HH:mm") : null} >Ca nghỉ</TimePicker>)
})

function Setting() {
    const [params, setParams] = useState();

    const onChangeValue = useCallback((keyName, value) => {
       setParams(
           {
               ...params,
               [keyName]: value,
           }
       ) ;
    }, [params]);

    // useEffect(() => {
    //   getConfig()
    //   .then(res => {
    //     setDistance(res.data.data.distance);
    //   })
    //   .catch(e => {
    //     alert('Something was wrong!');
    //   })
    // }, [])

    const handleUpdate = () => {
        updateConfig(parseFloat(distance))
            .then(res => {
                alert('Update distance successfully!');
            })
            .catch(e => {
                alert('Something was wrong!');
            })
    }
        useEffect(() => {
            requestGetTimesheet()
                .then(res => {
                    console.log("res", res)
                    setParams(res);
                })
                .catch(e => {
                    console.log(e);
                })
        }, [])

    const [{loading}, setTimesheet] = useAsyncFn(async () => {
        console.log("params", params)
        let data = JSON.stringify(params);

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/timesheet/set',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

        await axios.request(config)
            .then((response) => {
                alert(response.data.message)
            })
            .catch((error) => {
                alert(error)
                console.log(error);
            });

    }, [params]);
    console.log("parms", params)

    return (
        <>
            <Container fluid>
                <Row>
                    <Col md="12">
                        <Card>
                            <Card.Body>
                                <Form>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Thứ 2:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s1"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_1_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_1_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c1"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_1_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_1_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Thứ 3:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s2"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_2_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_2_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c2"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_2_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_2_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Thứ 4:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s3"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_3_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_3_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c3"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_3_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_3_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Thứ 5:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s4"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_4_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_4_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c4"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_4_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_4_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Thứ 6:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s5"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_5_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_5_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c5"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_5_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_5_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Thứ 7:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s6"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_6_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_6_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c6"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_6_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_6_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                    <Form.Group className={"shift-group"}>
                                        <div className={"shift-day"}>Chủ nhật:</div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca sáng </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_s0"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_0_0"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_0_1"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                        <div className={"shift-view"}>
                                            <div className={"shift-card"}>
                                                <div style={{display: "flex", flexDirection: "column", gap: 8}}>
                                                    <span>Ca chiều </span>
                                                    <ShiftCheckbox params={params} keyName={"shift_c0"} onChangeValue={onChangeValue}/>
                                                </div>
                                                <div style={{
                                                    display: "flex",
                                                    flexDirection: "row",
                                                    gap: 16,
                                                    alignItems: "flex-start"
                                                }}>
                                                    <ShiftTimePicker keyName={"shift_0_2"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                    <ShiftTimePicker keyName={"shift_0_3"} onChangeValue={onChangeValue}
                                                                     params={params}/>
                                                </div>
                                            </div>
                                        </div>
                                    </Form.Group>
                                </Form>
                                <Button style={{ background: "#17C286", color: "#fff", borderColor: "#fff", marginLeft: "38%" }} onClick={setTimesheet} loading={loading} >Lưu lịch làm việc</Button>

                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>
        </>
    );
}

export default Setting;
