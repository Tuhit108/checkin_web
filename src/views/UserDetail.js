import React, {useEffect, useState} from 'react';
import {useParams} from 'react-router-dom';
import {Calendar, Skeleton} from "antd";
import 'global.css'
import './view.css'
import moment from "moment/moment";
import {useUser} from "../store/user";
import {useAsyncFn} from "react-use";
import {getCheckinByDateAndUser, requestAllCheckinsByUser} from "../store/checkinLogs/function";
import {Card, Modal} from "react-bootstrap";
import {requestGetTimesheet} from "../services/timsheetService";

const ShiftModal = ({isOpen, onClose, count}) => {
    const countShift = count()

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
                <button
                    style={{
                        backgroundColor: '#2686ed',
                        color: 'white',
                        borderWidth: '0px',
                        borderRadius: '4px',
                        padding: '4px 8px'
                    }}
                    onClick={() => {}}
                >
                    Duyệt bảng công
                </button>
                <button
                    style={{
                        backgroundColor: '#2686ed',
                        color: 'white',
                        borderWidth: '0px',
                        borderRadius: '4px',
                        padding: '4px 8px'
                    }}
                    onClick={() => {}}
                >
                    Gửi bảng công
                </button>
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
                        <td className="tg-0pky">2</td>
                    </tr>
                    </tbody>
                </table>
                <div className="shift-label">Bảng công chi tiết</div>
                <table className="tg">
                    <thead>
                    <tr>
                        <th className="tg-0pky">Ngày</th>
                        <th className="tg-0pky">Số công</th>
                        <th className="tg-0pky">Đi muộn</th>
                    </tr>
                    </thead>
                    {
                        countShift.shift.map((item) => (
                            <tbody>
                            <tr>
                                <th className="tg-0pky">{item.date}</th>
                                <th className="tg-0pky">{item.shiftCount}</th>
                                <th className="tg-0pky">{item.late || 0}</th>
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
const compareTime = (time1, time2) =>{

// Tách giờ và phút ra
    const [timeHour, timeMinute] = time1.split(":").map(Number);
    const [logHour, logMinute] = time2.split(":").map(Number);

    return (logHour * 60 + logMinute) - (timeHour * 60 + timeMinute)
}

const UserDetail = () => {
    const {id} = useParams();
    const user = useUser(id)
    const [showAdd, setShowAdd] = useState(false)
    const [showDateModal, setShowDateModal] = useState(false)
    const [currentDate, setCurrentDate] = useState("")
    const timesheet = localStorage.getItem('timesheet');
    console.log("shift", timesheet)

    const countShift = () => {
        // Tạo đối tượng moment từ timestamp
        const monthStart = moment();

        // Lấy số ngày trong tháng
        const daysInMonth = monthStart.daysInMonth();
        let totalShift = 0
        let countShift = 0
        let countLate = 0

        let shift = []

        // Lặp qua các ngày trong tháng và in ra
        for (let i = 1; i <= daysInMonth; i++) {
            const day = monthStart.date(i).format('DD-MM-YYYY');
            const dayInWeek = monthStart.date(i).day()
            const shiftSkey = `shift_s${dayInWeek}`
            const shiftCkey = `shift_c${dayInWeek}`
            const startShiftS = shift?.[`shift_${dayInWeek}_0`] || "08:00"
            const endShiftS = shift?.[`shift_${dayInWeek}_1`] || "12:00"
            const startShiftC = shift[`shift_${dayInWeek}_2`] || "14:00"
            const endShiftC = shift[`shift_${dayInWeek}_2`] || "18:00"


            const logInDate = getCheckinByDateAndUser(`${day}_${user?.userCode}`)
            if (shift?.[shiftSkey] === 1 && shift?.[shiftCkey] === 1) {
                totalShift += 2
                if (logInDate.length < 2) {
                    shift.push({
                        date: day,
                        shiftCount: 0
                    })
                }
                else if (compareTime(moment.unix(logInDate[0]).format("HH:mm"), startShiftS) >= 0 ) {
                    if (compareTime(endShiftC, moment.unix(logInDate[logInDate.length - 1]).format("HH:mm")) >= 0) {
                        shift.push({
                            date: day,
                            shiftCount: 2,
                            late: 0
                        })
                    } else if (compareTime(endShiftC, moment.unix(logInDate[logInDate.length - 1]).format("HH:mm")) < 0 && compareTime(endShiftS, moment.unix(logInDate[logInDate.length - 1]).format("HH:mm"))>=0 ) {
                        shift.push({
                            date: day,
                            shiftCount: 1,
                            late: 0
                        })
                    } else {

                    }

                }

            }
            if (logInDate.length < 2) {
                shift.push({
                    date: day,
                    shiftCount: 0
                })

            } else {

                const firstLog = moment.unix(logInDate[0].timestamp)
                const lastLog = moment.unix(logInDate[logInDate.length - 1].timestamp)
                if (firstLog.hour() < 14 && lastLog.hour() >= 18) {
                    if (firstLog.hour() < 9 && lastLog.hour() >= 18) {

                        if (firstLog.hour() === 8) {
                            countLate += 1
                            shift.push({
                                date: day,
                                shiftCount: 1,
                                late: 1
                            })
                        } else {
                            shift.push({
                                date: day,
                                shiftCount: 1,
                            })
                        }
                        countShift += 1

                    } else {
                        shift.push({
                            date: day,
                            shiftCount: 0.5
                        })
                        countShift += 0.5
                    }

                } else {
                    shift.push({
                        date: day,
                        shiftCount: 0
                    })
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

    const countShiftInDay = (logInDate)=>{
        if (logInDate.length < 2) {
            return({
                shiftCount: 0
            })

        } else {

            const firstLog = moment.unix(logInDate[0].timestamp)
            const lastLog = moment.unix(logInDate[logInDate.length - 1].timestamp)
            if (firstLog.hour() < 14 && lastLog.hour() >= 18) {
                if (firstLog.hour() < 9 && lastLog.hour() >= 18) {

                    if (firstLog.hour() === 8) {
                        return({
                            shiftCount: 1,
                            late: 1
                        })
                    } else {
                        return({
                            shiftCount: 1,
                        })
                    }

                } else {
                    return({
                        shiftCount: 0.5
                    })
                }

            } else {
                return({
                    shiftCount: 0
                })
            }
        }
    }

    const getListData = (value) => {
        let listData = getCheckinByDateAndUser(`${value.format("DD-MM-YYYY")}_${user?.userCode}`);
        return listData || [];
    };
    const DayModal = ({isOpen, onClose}) => {
        let listData = getCheckinByDateAndUser(`${currentDate}_${user?.userCode}`);
        const shiftInDay = countShiftInDay(listData)
        console.log("list", listData)
        return (
            <Modal show={isOpen} onHide={onClose} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Công trong ngày</Modal.Title>
                </Modal.Header>

                <div className="content-shift">
                    <div className="shift-label">{currentDate }</div>

                    <tbody>
                    <tr>
                        <th >Công</th>
                        <th >{shiftInDay.shiftCount}</th>
                    </tr>
                    </tbody>
                    <tbody>
                    <tr>
                        <th >Muộn</th>
                        <th >{shiftInDay.late || 0}</th>
                    </tr>
                    </tbody>
                    <div className="shift-label">Dữ liệu chấm công</div>

                    {listData.map((item) => (
                        <div className={"log-item"} key={item.id}>
                            <div className={"log-row"}>
                                Time: {moment.unix(item?.timestamp).format("HH:mm")}
                            </div>
                            <div>
                                ClientId: {item.clientID}
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

    return (
        <div className="container-detail">
            <Card.Header style={{
                display: "flex",
                justifyContent: 'flex-end',
                marginLeft: 24,
                marginTop: 24,
                marginBottom: 24

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
                    Tính công
                </button>
            </Card.Header>
            <div className={"calendar-view"}>
                {refreshing ? <Skeleton/> :
                    <Calendar mode={"month"} cellRender={cellRender} style={{borderRadius: 12}}/>
                }

            </div>
            <ShiftModal isOpen={showAdd} onClose={() => {
                setShowAdd(false)
            }} count={countShift}/>
            <ShiftModal isOpen={showAdd} onClose={() => {
                setShowAdd(false)
            }} count={countShift}/>
            <DayModal isOpen={showDateModal} onClose={() => {
                setShowDateModal(false)
            }} />


            {/* Hiển thị thông tin chi tiết của người dùng */}
        </div>
    );
};

export default UserDetail;
