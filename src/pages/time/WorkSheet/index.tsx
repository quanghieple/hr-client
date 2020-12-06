import React, { Component } from "react";
import { Badge, Calendar, Tooltip } from "antd";
import { connect, formatMessage } from "umi";
import { ConnectState } from "@/models/connect";
import { CurrentUser } from "@/data/database";
import { currentDiff, timeDiff } from "@/utils/date";
import { getMonth } from "@/services/checkin";

interface WorkSheetProps {
    currentUser: CurrentUser;
    currentMonth: any
}

interface WorkSheetState {
    current: any
}

class WorkSheet extends Component<WorkSheetProps, WorkSheetState> {

    constructor(props: WorkSheetProps) {
        super(props)
        this.state = {
            current: props.currentMonth
        }
    }

    getTimeCheck(time: number) {
        let date = new Date(time)
        return `${date.getHours()}h:${date.getMinutes()}m`
    }

    dateCellRender = (value: any) => {
        const { current } = this.state
        let data = current[value.date().toString()]
        if (data) {
            return (
                <ul className="events" style={{paddingLeft: '5px'}}>
                    {Object.keys(data).map(item => (
                        <li key={item}>
                            {data[item].out ? (
                                <Tooltip title={`${formatMessage({id: 'checkin.shift'})} ${item} (${timeDiff(data[item].in, data[item].out)})`}>
                                    <Badge status='success' text={`${this.getTimeCheck(data[item].in)} - ${this.getTimeCheck(data[item].out)}`} />
                                </Tooltip>
                            ) : (
                                <Tooltip title={`${formatMessage({id: 'checkin.shift'})} ${item} (${currentDiff(data[item].in)})`}>
                                    <Badge status='success' text={`${this.getTimeCheck(data[item].in)} - current`} />
                                </Tooltip>
                            )}
                        </li>
                    ))}
                </ul>
            );
        } else return null
    }

    monthCellRender = (value: any) => {
        return null
    }

    handleChange = (value: any) => {
        let time = new Date()
        if (value.year() == time.getFullYear() && value.month() == time.getMonth()) {
            this.setState({current: this.props.currentMonth})
        } else {
            getMonth(value.year(), value.month()).then((snap) => {
                console.log(snap.val())
                this.setState({current: snap.val() || {}})
            })
        }
    }
    render() {
        return (
            <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onChange={this.handleChange} />
        )
    }
}

export default connect(({ user, checkin }: ConnectState) => ({
    currentUser: user.currentUser,
    currentMonth: checkin.history
}))(WorkSheet)