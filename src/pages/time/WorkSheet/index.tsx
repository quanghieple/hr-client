import React, { Component } from "react";
import { Badge, Calendar, Drawer, Tooltip } from "antd";
import { connect, formatMessage } from "umi";
import { ConnectState } from "@/models/connect";
import { User } from "@/data/database";
import { currentDiff, timeDiffS } from "@/utils/date";
import { getMonth } from "@/services/checkin";
import UpdateWorkShift from "./components/UpdateWorkShift";
interface WorkSheetProps {
    currentUser: User;
    currentMonth: any
}

interface WorkSheetState {
    current: any;
    shifts: any;
    month: any;
    year: any;
    openDraw: boolean;
    item: any;
}

export enum CheckinStatus {
    Checkin = 1,
    Checkout = 2,
    forgot = 3,
}

export enum RequestUpdateStatus {
    Wating = 1,
    Approve = 2,
    Reject = 3,
}

class WorkSheet extends Component<WorkSheetProps, WorkSheetState> {

    constructor(props: WorkSheetProps) {
        super(props)
        this.state = {
            current: props.currentMonth,
            shifts: {"s1": "success", "s2": "warning", "s3": "error"},
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            openDraw: false,
            item: {}
        }
    }

    getTimeCheck(time: string) {
        let date = new Date(time)
        return `${date.getHours()}h:${date.getMinutes()}m`
    }

    renderTooltip = (item: any) => {
        const { shifts } = this.state

        if (item.status === CheckinStatus.Checkin) {
            return (
                <Tooltip title={`${formatMessage({id: 'checkin.shift'})} ${item.shift.name} (${currentDiff(item.inn)})`}>
                    <Badge status={shifts["s" + item.shift.id] || 'success'} text={`${this.getTimeCheck(item.inn)} - current`} />
                </Tooltip>
            )
        } else if (item.status === CheckinStatus.Checkout) {
            return (
                <Tooltip title={`${formatMessage({id: 'checkin.shift'})} ${item.shift.name} (${timeDiffS(item.inn, item.out)})`}>
                    <Badge status={shifts["s" + item.shift.id] || 'success'} text={`${this.getTimeCheck(item.inn)} - ${this.getTimeCheck(item.out)}`} />
                </Tooltip>
            )
        } else {
            return (
                <Tooltip title={`${formatMessage({id: 'checkin.shift'})} ${item.shift.name} (forgot checkout)`}>
                    <Badge style={{color: 'red'}} status={shifts["s" + item.shift.id] || 'success'} text={`${this.getTimeCheck(item.inn)} - x`} />
                </Tooltip>
            )
        }
    }

    dateCellRender = (value: any) => {
        const { current, month } = this.state
        if (month != value.month()) return null;
        let data = current["d" + value.date()]
        if (data) {
            return (
                <ul className="events" style={{paddingLeft: '5px'}}>
                    {Object.keys(data).map(item => (
                        <li key={item}>
                            <div onClick={() => this.setState({openDraw: true, item: data[item]})}>
                            {this.renderTooltip(data[item])}
                            </div>
                        </li>
                    ))}
                </ul>
            );
        } else return null
    }

    monthCellRender = (value: any) => {
        return null
    }

    generateStatus = (status: number): string => {
        if (status == CheckinStatus.Checkin) {
            return "Check In";
        } else if (status == CheckinStatus.Checkout) {
            return "Check Out";
        } else {
            return "Forgot Checkout";
        }
    }

    loadData = (month: number, year: number) => {
        getMonth(month, year).then((snap) => {
            var history = {}
            snap.forEach((item: any) => {
                const key: string = "d" + item.date
                if (history[key])
                history[key] = [...history[key], item]
                else
                history[key] = [item]
            })
            this.setState({current: history || {}, month: month, year: year})
        })
    }

    handleChange = (value: any) => {
        let time = new Date()
        if (value.year() == time.getFullYear() && value.month() == time.getMonth()) {
            this.setState({current: this.props.currentMonth, month: time.getMonth()})
        } else {
            this.loadData(value.month(), value.year());
        }
    }
    
    render() {
        const {openDraw, item, month, year} = this.state;
        return (
            <>
                <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onChange={this.handleChange} />
                <Drawer
                    title={formatMessage({id: 'checkin.qr.title'})}
                    width={'50vh'}
                    placement="right"
                    onClose={() => this.setState({openDraw: false})}
                    visible={openDraw}
                >
                    <UpdateWorkShift item={item} onRefresh={() => this.loadData(month, year)}/>
                </Drawer>
            </>
        )
    }
}

export default connect(({ user, checkin }: ConnectState) => ({
    currentUser: user.currentUser,
    currentMonth: checkin.history
}))(WorkSheet)
