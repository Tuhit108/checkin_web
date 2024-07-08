import React, { useEffect, useMemo, useState } from "react";

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
} from "react-bootstrap";
import { getAllCheckins } from "services/checkinServices";
import { useAsyncFn } from "react-use";
import { store } from "store";
import moment from "moment"
import VirtualTable from "components/VirtualTable";

function CheckinHistory() {
  const [records, setRecords] = useState([]);
  const [{ loading: refreshing }, getList] = useAsyncFn(async () => {
    const res = await getAllCheckins();
    if(res.data) {
      setRecords(res.data)
    }
  }, []);
  useEffect(() => {
    getList().then();
  }, []);
  const { dataSource, lids, uids } = useMemo(() => {
    const lids = {};
    const uids = {};
    let results = [];

    for (let i = 0; i < records.length; i++){
      const record = records[i];
      lids[record?.clientID] = record?.clientID;
      uids[record?.userCode] = record?.userCode;

        results.push({
          key: record.id,
          uid: record?.userCode,
          location: record?.clientID,
          time: moment.unix(record.timestamp).format("HH:mm:ss"),
          date: moment.unix(record.timestamp).format("DD/MM/YYYY"),
          timestamp: record.timestamp,
          note: record?.note || "",
        })
      }

    return {
      lids,
      uids,
      dataSource: results,
    };
  }, [records?.length]);
  const columns = useMemo(() => {
    return [
      {
        title: "Mã nhân viên",
        key: "uid",
        dataIndex: "uid",
        filters: Object.values(uids ||{}).map((uid) => ({ text: uid, value: uid })),
        onFilter: (value, record) => record.uid == value,
      },
      {
        title: "Địa điểm",
        key: "location",
        dataIndex: "location",
        filters: Object.values(lids || {}).map((ip) => ({ text: ip, value: ip })),
        onFilter: (value, record) =>
          record.location === value,
      },
      {
        title: "Thời gian",
        key: "time",
        dataIndex: "time",
        defaultSortOrder: "descend",
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
        title: "Ghi chú",
        key: "note",
        dataIndex: "note",
        defaultSortOrder: "descend",

      },
    ];
  }, [ lids, uids]);

  return (
    <>
      <Container fluid>
        <Row>
          <Col md="12">
            <Card className="strpied-tabled-with-hover">
              <Card.Header>
                <Card.Title as="h4">Danh sách chấm công</Card.Title>
              </Card.Header>
              <Card.Body className="table-full-width table-responsive px-0">
                <VirtualTable columns={columns} dataSource={dataSource}/>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
}

export default CheckinHistory;
