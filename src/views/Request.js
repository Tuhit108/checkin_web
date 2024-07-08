import React, {useEffect, useMemo, useState} from "react";
import EditIcon from '@mui/icons-material/Edit';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

import {
    Card,
    Row,
    Col,
} from "react-bootstrap";
import {requestAllClientWifi} from "../store/clientWifi/function";
import {requestAllRequest} from "../store/request/function";
import {getUserByKey} from "../store/user";
import moment from "moment";
import VirtualTable from "../components/VirtualTable";
import {Tag, Table, Modal} from "antd";



function Request() {
    const [requests , setRequests] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [activeRequest, setActiveRequest] = useState("")
    const [refetch, setRefetch] = useState(0);
    const getUserById = (id)=>{
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
        requestAllRequest()
            .then(res => {
                setRequests(res);
            })
            .catch(e => {
                console.log(e);
            })
    }, [refetch])
    const { dataSource, lids, uids } = useMemo(() => {
        const lids = {};
        const uids = {};
        let results = [];

        for (let i = 0; i < requests.length; i++){
            const record = requests[i];
            const userName = getUserById(record.userId)
            uids[userName] = userName;
            lids[record.status] = record.status
            results.push({
                index: i+1,
                key: record.id,
                name: record.name,
                uid: record?.userId,
                userName: userName,
                date: moment.unix(record.timestamp).format("DD/MM/YYYY"),
                timestamp:Number(record.timestamp) ,
                status: record?.status || "pending",
                reason: record?.reason || ""
            })
        }

        return {
            lids,
            uids,
            dataSource: results,
        };
    }, [requests?.length]);
    const columns = useMemo(() => {
        return [
            {
                title: "ID",
                key: "index",
                dataIndex: "index",
            },
            {
                title: "Tên đề xuất",
                key: "name",
                dataIndex: "name",
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
                title: "Ngày",
                key: "date",
                dataIndex: "date",
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
                                Danh sách đề xuất
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
                                        setActiveRequest(record)
                                        showModal()}, // click row
                                };
                            }}/>

                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            <Modal title="Chi tiết đề xuất" open={isModalOpen} onOk={() => {
            }} onCancel={handleCancel}
                   footer={<div> hahahoo</div>}
            >
                <div>
                    {activeRequest.name}
                </div>
                <div>
                    {activeRequest.reason}
                </div>
                <div>
                    {activeRequest.userName}
                </div>

            </Modal>
        </>
    );
}

export default Request;
