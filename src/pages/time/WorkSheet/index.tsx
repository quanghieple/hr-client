import React, { Component } from "react";
import { Badge, Calendar, Drawer, Tag } from "antd";
import { connect } from "umi";
import { ConnectState } from "@/models/connect";
import { CurrentUser } from "@/data/database";
import { getListMeal, getTrackingThisMonth } from "@/services/checkin";
import MealHistory from "../MealHistory";
import moment from "moment";

interface WorkSheetProps {
    currentUser: CurrentUser;
    currentMonth: any
}

interface WorkSheetState {
    current: any;
    shifts: any;
    month: number;
    year: number;
    data: {};
    meal: {};
    item: any;
    openDraw: boolean;
    time: any;
}

class WorkSheet extends Component<WorkSheetProps, WorkSheetState> {

    constructor(props: WorkSheetProps) {
        super(props)
        this.state = {
            current: props.currentMonth,
            shifts: {"morning": "success", "evening": "warning", "night": "error"},
            month: new Date().getMonth(),
            year: new Date().getFullYear(),
            data: {},
            meal: {},
            item: {},
            openDraw: false,
            time: moment()
        }
    }

    componentDidMount = () => {
      getTrackingThisMonth(this.state.month, this.state.year).then((tm) => {
        this.setState({data: tm});
      })

      getListMeal().then((list) => {
        this.setState({meal: list});
      })
    }

    getTimeCheck(time: number) {
        let date = new Date(time)
        return `${date.getHours()}h:${date.getMinutes()}m`
    }

    isSmall = () => window.innerWidth < 800

    renderDot = (meal: any) => {
      if(this.isSmall()) {
        return <Badge color={meal.color} />
      } else {
        return <Tag color={meal.color}>{meal.title}</Tag>
      }
    }

    dateCellRender = (value: any) => {
        const { data, meal, month } = this.state
        if (month != value.month()) return null;
        let currentDate = data[value.date().toString()]
        if (currentDate) {
            return (
              <div style={{display: this.isSmall() ? 'flex' : 'block' }} onClick={() => this.setState({ item: currentDate, openDraw: true, time: value })}>
                {Object.keys(currentDate).map(item => this.renderDot(meal[currentDate[item].meal] || {}))}
              </div>
            )
        } else return null
    }

    monthCellRender = (value: any) => {
        return null
    }

    handleChange = (value: any) => {
      getTrackingThisMonth(this.state.month, this.state.year).then((tm) => {
        this.setState({data: tm, month: value.month(), year: value.year()});
      })
    }

    onNext = () => {

    }

    onPrev = () => {

    }

    render() {
      return (
          <>
            <Calendar dateCellRender={this.dateCellRender} monthCellRender={this.monthCellRender} onChange={this.handleChange} />
            <Drawer
              title={`Lịch sử ${this.state.time.format('DD/MM/YYYY')}`}
              width={'min(90vw, 600px)'}
              placement="right"
              onClose={() => this.setState({ openDraw: false })}
              visible={this.state.openDraw}
            >
              <MealHistory list={Object.values(this.state.item)} meals={this.state.meal || {}} onNext={this.onNext} onPrev={this.onPrev}/>
            </Drawer>
          </>
        )
    }
}

export default connect(({ user, checkin }: ConnectState) => ({
    currentUser: user.currentUser,
    currentMonth: checkin.history
}))(WorkSheet)
