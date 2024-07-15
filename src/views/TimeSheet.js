import React, {useEffect, useMemo, useState} from "react";
import {getUserByKey} from "../store/user";
import {requestAllRequest} from "../store/request/function";
import moment from "moment/moment";
import {Button, Modal, Table, Tag} from "antd";
import {useAsyncFn} from "react-use";
import axios from "axios";
import {Card, Col, Row} from "react-bootstrap";
import {requestAllShift} from "../store/shift/function";

function Shift() {
    const [shifts, setShifts] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeShift, setActiveShift] = useState("")
    const [refetch, setRefetch] = useState(0);
    const getUserById = (id) => {
        const user = getUserByKey(id)
        return  user?.name || "unknown"
    }
    const showModal = () => {
        setIsModalOpen(true);
    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    useEffect(() => {
        requestAllShift()
            .then(res => {
                setShifts(res);
            })
            .catch(e => {
                console.log(e);
            })
    }, [refetch])
    const { dataSource, lids, uids } = useMemo(() => {
        const lids = {};
        const uids = {};
        let results = [];

        for (let i = 0; i < shifts.length; i++){
            const record = shifts[i];
            const userName = getUserById(record.userId)
            uids[userName] = userName;
            lids[record.status] = record.status
            results.push({
                index: i + 1,
                id: record.id,
                key: record.id,
                month: record.month,
                totalShift: record?.totalShift,
                totalUserShift: record?.totalUserShift,
                userName: userName,
                createAt: moment.unix(record.createAt).format("DD/MM/YYYY"),
                timestamp: Number(record.createAt),
                status: record?.status || "pending",
                late: record?.late,
                timeoff: record?.timeoff,
                reason: record?.reason || ""
            })
        }

        return {
            lids,
            uids,
            dataSource: results,
        };
    }, [shifts]);
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                key: "index",
                dataIndex: "index",
            },
            {
                title: "Bảng công tháng",
                key: "month",
                dataIndex: "month",
            },
            {
                title: "Người đề xuất",
                key: "userName",
                dataIndex: "userName",
                filters: Object.values(uids || {}).map((name) => ({ text: name, value: name })),
                onFilter: (value, record) =>
                    record.userName === value,
            },
            {
                title: "Tổng công",
                key: "totalShift",
                dataIndex: "totalShift",
            },
            {
                title: "Công thực tế",
                key: "totalUserShift",
                dataIndex: "totalUserShift",
            },
            {
                title: "Muộn",
                key: "late",
                dataIndex: "late",
            },
            {
                title: "Nghỉ phép",
                key: "timeoff",
                dataIndex: "timeoff",
            },
            {
                title: "Tạo lúc",
                key: "createAt",
                dataIndex: "createAt",
                defaultSortOrder: "descend",
                sorter: (a, b) =>
                    a.timestamp - b.timestamp,
            },
            {
                title: "Trạng thái",
                key: "status",
                dataIndex: "status",
                filters: Object.values(lids || {}).map((name) => ({ text: name, value: name })),
                onFilter: (value, record) =>
                    record.status === value,
                render: (tag ) => {
                    console.log("tag", tag)
                    let color = tag === "pending" ? "geekblue" : (tag === "approved" ? 'green' : 'volcano');

                    return (
                        <Tag color={color} key={tag}>
                            {tag}
                        </Tag>
                    );
                }


            },
        ];
    }, [ lids, uids]);
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
                                Danh sách bảng công
                            </div>

                        </Card.Header>
                        <Card.Body className="table-full-width table-responsive px-0">
                            {/*<Table className="table-hover table-striped">*/}
                            {/*    <thead>*/}
                            {/*    <tr>*/}
                            {/*        <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>STT</th>*/}
                            {/*        <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Tên đề xuất</th>*/}
                            {/*        <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Người tạo</th>*/}
                            {/*        <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Ngày đề xuất</th>*/}
                            {/*        <th className="border-0" style={{ fontSize: '15px', fontWeight: 'bold', color: '#000' }}>Trạng thái</th>*/}
                            {/*    </tr>*/}
                            {/*    </thead>*/}
                            {/*    <tbody>*/}
                            {/*    {requests.map((item, index) => (*/}
                            {/*        <tr key={index}*/}
                            {/*            onClick={() => {*/}
                            {/*            }}*/}
                            {/*        >*/}
                            {/*            <td>{index + 1}</td>*/}
                            {/*            <td style={{ cursor: 'pointer'}}>{item?.name || ""}</td>*/}
                            {/*            <td>{getUserById(item.userId)|| ""}</td>*/}
                            {/*            <td>{moment.unix(item?.timestamp).format("DD/MM/YYYY")  || ""}</td>*/}
                            {/*            <td>*/}
                            {/*                {item?.status || ""}*/}
                            {/*            </td>*/}
                            {/*        </tr>*/}
                            {/*    ))}*/}
                            {/*    </tbody>*/}
                            {/*</Table>*/}
                            <Table columns={columns} dataSource={dataSource} onRow={(record, rowIndex) => {
                                return {
                                    onClick: (event) => {
                                        setActiveShift(record)
                                        showModal()
                                    }, // click row
                                };
                            }}/>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            {/*<Modal title={activeRequest?.name || "Chi tiết đề xuất"} open={isModalOpen} onOk={() => {*/}
            {/*}} onCancel={handleCancel}*/}
            {/*       footer={<div className={"row-footer"}>*/}
            {/*           <Button style={{ background: "red", color: "#fff", borderColor: "#fff" }} onClick={rejectRequest} loading={rejecting}>Từ chối</Button>*/}

            {/*           <Button style={{ background: "#17C286", color: "#fff", borderColor: "#fff" }} onClick={approveRequest} loading={approving}>Chấp thuận</Button>*/}
            {/*       </div>}*/}
            {/*><div className={"row-information"}>*/}
            {/*    <span className={"label"}>Loại đề xuất :</span>*/}
            {/*    {*/}
            {/*        activeRequest.type === "self-claim" ?*/}
            {/*            <div className={"value"}>*/}
            {/*                <span>Chấm công bù</span>*/}
            {/*            </div>*/}
            {/*            :*/}
            {/*            <div className={"value"}>*/}
            {/*                <span>Nghỉ phép </span>*/}
            {/*            </div>*/}
            {/*    }*/}
            {/*</div>*/}
            {/*    <div className={"row-information"}>*/}
            {/*        <span className={"label"}>Người tạo :</span>*/}
            {/*        <div className={"value"}>*/}
            {/*            {activeRequest.userName}*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={"row-information"}>*/}
            {/*        <span className={"label"}>Trạng thái :</span>*/}
            {/*        <div className={"value"}>*/}
            {/*            <Tag*/}
            {/*                color={activeRequest.status === "pending" ? "geekblue" : (activeRequest.status === "approved" ? 'green' : 'volcano')}>{activeRequest.status}</Tag>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={"row-information"}>*/}
            {/*        <span className={"label"}>Lý do :</span>*/}
            {/*        <div className={"value"}>*/}
            {/*            <span>{activeRequest.reason || ""}</span>*/}
            {/*        </div>*/}
            {/*    </div>*/}
            {/*    <div className={"row-information"}>*/}
            {/*        <span className={"label"}>Thời gian đề xuất :</span>*/}
            {/*        {*/}
            {/*            activeRequest.type === "self-claim" ?*/}
            {/*                <div className={"value"}>*/}
            {/*                    <span>{moment.unix(activeRequest.timestamp).format("DD/MM/YYYY HH:mm") || ""}</span>*/}
            {/*                </div>*/}
            {/*                :*/}
            {/*                <div className={"value"}>*/}
            {/*                    <span>{moment.unix(activeRequest.timestamp).format("DD/MM/YYYY") || ""}</span>*/}
            {/*                </div>*/}
            {/*        }*/}
            {/*    </div>*/}
            {/*</Modal>*/}
        </>
    );
}

export default Shift;
