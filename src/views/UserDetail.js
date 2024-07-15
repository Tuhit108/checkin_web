import React, {useEffect, useMemo, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Calendar, Skeleton, Select} from "antd";
import 'global.css'
import './view.css'
import moment from "moment/moment";
import {syncUser, useUser} from "../store/user";
import {useAsyncFn} from "react-use";
import {getCheckinByDateAndUser, requestAllCheckinsByUser} from "../store/checkinLogs/function";
import {Button, Card, Form, Modal} from "react-bootstrap";
import {requestGetTimesheet} from "../services/timsheetService";
import {getClient, useClientsIdsByQuery} from "../store/client";
import axios from "axios";
import {requestApprovedRequestInMonth} from "../store/request/function";
import {syncShifts} from "../store/shift";
const XLSX = require('xlsx');

const ShiftModal = ({userId, isOpen, onClose, count, selectedMonth}) => {
    const countShift = count(selectedMonth)
    const [timeoffCount, setTimeoffCount] = useState(1)
    const dataShift = useMemo (()=>{
        let dataArray = [];
        const shiftData = countShift.shift

        for (const key in shiftData) {
            const [date, shift] = key.split('_');
            const [day, month, year] = date.split('-');
            const dateString = `${day}-${month}-${year}`;

            dataArray.push({
                date: dateString,
                ca: shift === 's' ? 'Sáng' : 'Chiều',
                countShift: shiftData[key]?.countShift || 0,
                late: shiftData[key]?.late || 0
            });
        }
        console.log("data", dataArray)
        return dataArray
    },[countShift])
    const convertExcel = ()=>{
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(dataShift);
        XLSX.utils.book_append_sheet(workbook, worksheet, 'shift_detail');
        XLSX.writeFile(workbook, 'shift_detail.xlsx');

    }
    const [{loading: approving}, requestApproved] = useAsyncFn(async () => {
        const keyMonth = moment(selectedMonth, 'MM/YYYY').format("MM_YYYY")
        const key = `${keyMonth}_${userId}`
        console.log("key", key)

        const res = await requestApprovedRequestInMonth(key)
        console.log("ress", res)
        if (res) {
            setTimeoffCount(res?.listIds?.length || 0)
        }
    }, [selectedMonth, userId, timeoffCount]);

    useEffect(() => {
        requestApproved().then()
    }, [selectedMonth, userId, timeoffCount]);

    const [{loading: saving}, addShift] = useAsyncFn(async () => {
        let data = JSON.stringify({
            ...countShift,
            month: selectedMonth,
            userId: userId,
            createAt: moment().unix(),
            timeoff: timeoffCount
        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/shift/add',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

        await axios.request(config)
            .then((response) => {
                syncShifts([response.data.data])
                alert(response.data.message)
            })
            .catch((error) => {
                alert(error)
                console.log(error);
            });

    }, [userId, countShift, timeoffCount]);


    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Bảng công</Modal.Title>
            </Modal.Header>
            <Card.Header style={{
                display: "flex",
                justifyContent: 'flex-end',
                margin: 24,
                gap: 24

            }}>
                <Button style={{ background: "#17C286", marginTop: 12, color: "#333", borderColor: "#fff" }} onClick={addShift} loading={saving} >Duyệt bảng công</Button>

            </Card.Header>
            <div className="content-shift">
                <table className="tg">
                    <thead>
                    <tr>
                        <th className="tg-0pky">Tổng công tháng</th>
                        <th className="tg-0pky">{countShift.totalShift}</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td className="tg-0pky">Công nhân sự</td>
                        <td className="tg-0pky">{countShift.totalUserShift}</td>
                    </tr>
                    <tr>
                        <td className="tg-0pky">Số lần đi muộn</td>
                        <td className="tg-0pky">{countShift.late}</td>
                    </tr>
                    <tr>
                        <td className="tg-0pky">Số phép được duyệt</td>
                        <td className="tg-0pky">{timeoffCount}</td>
                    </tr>
                    </tbody>
                </table>
                <div style={{display:"flex", flexDirection: 'row', justifyContent: "space-between"}}>
                    <div className="shift-label">Bảng công chi tiết</div>
                    <button
                        style={{
                            backgroundColor: '#2686ed',
                            color: 'white',
                            borderWidth: '0px',
                            borderRadius: '4px',
                            padding: '4px 4px',
                            margin: "8px"
                        }}
                        onClick={() => {
                            convertExcel()
                        }}
                    >
                        Xuất Excel
                    </button>

                </div>
                <table className="tg">
                    <thead>
                    <tr>
                        <th className="tg-0pky">Ngày</th>
                        <th className="tg-0pky">Ca</th>
                        <th className="tg-0pky">Số công</th>
                        <th className="tg-0pky">Đi muộn(phút)</th>
                    </tr>
                    </thead>
                    { dataShift?.length &&
                        dataShift.map((item) => (
                            <tbody>
                            <tr>
                                <th className="tg-0pky">{item?.date }</th>
                                <th className="tg-0pky">{item?.ca}</th>
                                <th className="tg-0pky">{item?.countShift || 0}</th>
                                <th className="tg-0pky">{item?.late || 0}</th>
                            </tr>
                            </tbody>
                        ))
                    }
                </table>

            </div>
        </Modal>
    )
}
const DayModal = ({isOpen, onClose, date, logInDate}) => {

    return (
        <Modal show={isOpen} onHide={onClose} size="lg">
            <Modal.Header closeButton>
                <Modal.Title>Công trong ngày</Modal.Title>
            </Modal.Header>
            <div className="content-shift">

            </div>
        </Modal>
    )
}
const compareTime = (time1, time2) => {

// Tách giờ và phút ra
    const [timeHour, timeMinute] = time1.split(":").map(Number);
    const [logHour, logMinute] = time2.split(":").map(Number);

    return (logHour * 60 + logMinute) - (timeHour * 60 + timeMinute)
}

const calShift = (start, end, log) => {
    if(!log){
        return {
            countShift: 0,
            late: 0
        }
    }
    if (log.length < 2) {
        return {
            countShift: 0,
            late: 0
        }
    }
    if (compareTime(end, moment.unix(log[log.length - 1].timestamp).format("HH:mm")) < 0) {
        return {
            countShift: 0,
            late: 0
        }
    }
    if (compareTime(moment.unix(log[0].timestamp).format("HH:mm"), start) >= -30) {
        const late = compareTime(start, moment.unix(log[0].timestamp).format("HH:mm")) > 0 ? compareTime(start, moment.unix(log[0].timestamp).format("HH:mm")) : 0
        return {
            countShift: 1,
            late: late
        }
    }
    if (compareTime(moment.unix(log[0].timestamp).format("HH:mm"), start) >= -60) {
        console.log("vao day", -30 > compareTime(moment.unix(log[0].timestamp).format("HH:mm"), start) >= -60)
        const late = compareTime(start, moment.unix(log[0].timestamp).format("HH:mm"))
            return {
                countShift: 0.5,
                late: late
            }

    }
    if (compareTime(moment.unix(log[0].timestamp).format("HH:mm"), start) < -60) {
            return {
                countShift: 0,
                late: 0
            }
    }
    else {
        return {
            countShift: 0,
            late: 0
        }
    }

}

const UserDetail = () => {
    const {id} = useParams();
    const user = useUser(id)
    const [showAdd, setShowAdd] = useState(false)
    const [showAddClient, setShowAddClient] = useState(false)
    const [showDateModal, setShowDateModal] = useState(false)
    const [currentDate, setCurrentDate] = useState("")
    const timesheet = JSON.parse(localStorage.getItem('timesheet')) ;
    const [selectedValue, setSelectedValue] = useState(moment().format("MM/YYYY"));
    const [clientIds, setClientIds] = useState(user?.clientsIds || []);
    const allClient = useClientsIdsByQuery("all")
    const options = useMemo(()=>{
        return allClient.map(item => {
            const client = getClient(item)
            return {
                label: client?.name || "unknown",
                value: item
            }
        })
    },[allClient])
    const handleChange = (value) => {
        setClientIds(value)
    };


    const countShift = (monthYearString) => {
        // Tạo đối tượng moment từ timestamp
        const monthStart = moment(monthYearString, 'MM/YYYY');

        // Lấy số ngày trong tháng
        const daysInMonth = monthStart.daysInMonth();
        let totalShift = 0
        let countShift = 0
        let countLate = 0

        let shift = {}

        // Lặp qua các ngày trong tháng và in ra
        for (let i = 1; i <= daysInMonth; i++) {
            const day = monthStart.date(i).format('DD-MM-YYYY');
            const dayInWeek = monthStart.date(i).day()
            const shiftSkey = `shift_s${dayInWeek}`
            const shiftCkey = `shift_c${dayInWeek}`
            const startShiftS = timesheet?.[`shift_${dayInWeek}_0`] || "08:00"
            const endShiftS = timesheet?.[`shift_${dayInWeek}_1`] || "12:00"
            const startShiftC = timesheet[`shift_${dayInWeek}_2`] || "14:00"
            const endShiftC = timesheet[`shift_${dayInWeek}_2`] || "18:00"


            const logInDate = getCheckinByDateAndUser(`${day}_${user?.userCode}`)


            if (timesheet?.[shiftSkey] === 1) {
                totalShift +=1
                const shiftObject = calShift(startShiftS, endShiftS, logInDate)
                countShift += shiftObject.countShift
                shift = {
                    ...shift,
                    [`${day}_s`]: shiftObject
                }
                if (shiftObject.late > 0 ){
                    countLate+=1
                }
            }
            if (timesheet?.[shiftCkey] === 1) {
                totalShift +=1
                const shiftObject = calShift(startShiftC, endShiftC, logInDate)
                countShift += shiftObject.countShift
                shift = {
                    ...shift,
                    [`${day}_c`]: shiftObject
                }
                if (shiftObject.late > 0 ){
                    countLate+=1
                }
            }
        }
        return {
            shift: shift,
            late: countLate,
            totalUserShift: countShift,
            totalShift: totalShift
        }
    }
    const [{loading: refreshing}, getListCheckin] = useAsyncFn(async () => {
        if (!user) {
            return
        }
        const res = await requestAllCheckinsByUser(user?.userCode || "");
        return res
    }, [user?.userCode]);
    useEffect(() => {
        getListCheckin().then()
        requestGetTimesheet().then()
    }, [user]);
    useEffect(()=>{
        console.log("vao day", user)
    },[])

    const countShiftInDay = (logInDate, day)=>{
        const dayInWeek = moment(currentDate, "DD-MM-YYYY").day()
        const shiftSkey = `shift_s${dayInWeek}`
        const shiftCkey = `shift_c${dayInWeek}`
        const startShiftS = timesheet?.[`shift_${dayInWeek}_0`] || "08:00"
        const endShiftS = timesheet?.[`shift_${dayInWeek}_1`] || "12:00"
        const startShiftC = timesheet[`shift_${dayInWeek}_2`] || "14:00"
        const endShiftC = timesheet[`shift_${dayInWeek}_2`] || "18:00"
        let countShift = 0
        let countLate = 0

        if (timesheet?.[shiftSkey] === 1) {
            const shiftObject = calShift(startShiftS, endShiftS, logInDate)
            countShift += shiftObject.countShift
            countLate += shiftObject.late
        }
        if (timesheet?.[shiftCkey] === 1) {
            const shiftObject = calShift(startShiftC, endShiftC, logInDate)
            countShift += shiftObject.countShift
            countLate += shiftObject.late
        }
        return {countShift, countLate}
    }

    const getListData = (value) => {
        let listData = getCheckinByDateAndUser(`${value.format("DD-MM-YYYY")}_${user?.userCode}`);
        return listData || [];
    };
    const DayModal = ({isOpen, onClose}) => {
        let listData = getCheckinByDateAndUser(`${currentDate}_${user?.userCode}`);
        const shiftInDay = countShiftInDay(listData, currentDate)

        return (
            <Modal show={isOpen} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Công trong ngày</Modal.Title>
                </Modal.Header>

                <div className="content-shift">
                    <div className="shift-label">{currentDate }</div>

                    <tbody>
                    <tr>
                        <th >Công: </th>
                        <th > {shiftInDay.countShift}</th>
                    </tr>
                    </tbody>
                    <tbody>
                    <tr>
                        <th >Muộn: </th>
                        <th > {shiftInDay.countLate || 0} phút</th>
                    </tr>
                    </tbody>
                    <div className="shift-label">Dữ liệu chấm công</div>

                    {listData.map((item) => (
                        <div className={"log-item"} key={item.id}>
                            <div className={"log-row"}>
                                Time: {moment.unix(item?.timestamp).format("HH:mm")}
                            </div>
                            <div>
                                Địa điểm: { item?.type === "machine" ? "Máy chấm công" : getClient(item.clientID)?.name|| "unknown" }
                            </div>
                        </div>

                    ))}
                </div>
            </Modal>
        )
    }
    const dateCellRender = (value) => {
        const listData = getListData(value);
        return (
            <div className="events" onClick={()=>{
                setShowDateModal(true);
                setCurrentDate(value.format("DD-MM-YYYY").toString())
            }}>
                {listData.map((item) => (
                    <p key={item.id}>
                        {moment.unix(item?.timestamp).format("HH:mm")}
                    </p>
                ))}
            </div>
        );
    };
    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    };
    const onSelect = (newValue) => {
        setSelectedValue(newValue?.format('MM/YYYY'));
    };
    const [{loading: saving}, assignClient] = useAsyncFn(async () => {
        let data = JSON.stringify({
            "userId": id,
            "clientsIds": clientIds

        });

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/user/assignClient',
            headers: {
                'Content-Type': 'application/json'
            },
            data : data
        };

        await axios.request(config)
            .then((response) => {
                syncUser([response.data.data])
                alert(response.data.message)
            })
            .catch((error) => {
                alert(error)
                console.log(error);
            });

    }, [id, clientIds]);

    return (
        <div className="container-detail">
            <Card.Header style={{
                display: "flex",
                justifyContent: 'space-between',
                marginLeft: 24,
                marginTop: 24,
                marginBottom: 24

            }}>
                <div className={"header-table"}>
                    {user?.name || ""}
                </div>
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
                    Tính công
                </button>
            </Card.Header>
            <div className={"calendar-view"}>
                {refreshing ? <Skeleton/> :
                    <Calendar mode={"month"} cellRender={cellRender} style={{borderRadius: 12}} onSelect={onSelect}/>
                }

            </div>
            <Card.Header style={{
                display: "flex",
                justifyContent: 'space-between',
                marginLeft: 24,
                marginTop: 24,
                marginBottom: 24

            }}>
                <div className={"header-table"}>
                    Danh sách client
                </div>
                <div style={{width: '60%', display: "flex", flexDirection: "column", alignItems: "flex-end"}}>
                    <Select
                        mode="multiple"
                        allowClear
                        style={{
                            width: '100%',
                        }}
                        placeholder="Chọn client cho nhân viên"
                        onChange={handleChange}
                        options={options}
                        value={clientIds}
                        defaultValue={user?.clientsIds || []}
                    />
                    {/*<button*/}
                    {/*    style={{*/}
                    {/*        backgroundColor: '#2686ed',*/}
                    {/*        color: 'white',*/}
                    {/*        borderWidth: '0px',*/}
                    {/*        borderRadius: '4px',*/}
                    {/*        padding: '4px 8px',*/}
                    {/*        marginTop: "12px"*/}
                    {/*    }}*/}
                    {/*    onClick={() => setShowAddClient(true)}*/}
                    {/*>*/}
                    {/*    Thêm client cho nhân viên*/}
                    {/*</button>*/}
                    <Button style={{ background: "#17C286", marginTop: 12, color: "#333", borderColor: "#fff" }} onClick={assignClient} loading={saving} >Lưu client cho nhân viên</Button>


                </div>

            </Card.Header>
            <ShiftModal userId={id} isOpen={showAdd} onClose={() => {
                setShowAdd(false)
            }} selectedMonth={selectedValue} count={countShift}/>
            <DayModal isOpen={showDateModal} onClose={() => {
                setShowDateModal(false)
            }}/>


            {/* Hiển thị thông tin chi tiết của người dùng */}
        </div>
    );
};

export default UserDetail;
