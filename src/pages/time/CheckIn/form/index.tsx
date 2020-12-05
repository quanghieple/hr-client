import React, { useState, useEffect, Component } from 'react';
import { Alert, Button, Form, Input, message, Select } from 'antd';
import { getCurrentShift } from '@/services/checkin';
import { connect, formatMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/data/database';

interface FormCheckProps {
    errorMessage: string;
    alertType: 'success' | 'info' | 'warning' | 'error';
    handleSubmit: Function;
    currentUser: CurrentUser;
    currentCheck: any;
    loading: boolean;
}

interface FormCheckState {
    note: string;
    shift: string;
    shifts: object;
    checkedShift: Array<any>;
    checkin: number;
    submitting: boolean;
}

const { Option } = Select;

const TimeWork = (props: {checkin: number, shift: string}) => {
    const [count, setCount] = useState("")
    useEffect(() => {
        let timeout = setTimeout(() => {
            calculateTimeLeft()
        }, 1000)

        return () => clearTimeout(timeout)
    })
    const calculateTimeLeft = () => {
        let difference = (new Date()).getTime() - props.checkin;
    
        let left = {
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };

        setCount(`${left.hours}h:${left.minutes}m:${left.seconds}s`)
    }
    return (
        <Alert message="info" description={`${formatMessage({id: 'checkin.working-on'})} ${props.shift}(${count})`} />
    )
}

class FormCheck extends Component<FormCheckProps, FormCheckState> {
    constructor(props: FormCheckProps) {
        super(props);
        this.state = {
            note: "",
            shift: "",
            checkin: 0,
            submitting: false,
            shifts: {"morning": "Morning", "evening": "Evening", "night": "Night"},
            checkedShift: []
        }
    }
    
    componentDidMount() {
        getCurrentShift(this.props.currentUser.uid).then((snap) => {
            let value = snap.val();
            if(value) {
                this.setState({checkin: value.checkTime})
            }
        })

        let key: string = new Date().getDate().toString()
        let history = this.props.currentCheck[key] || {}

        Object.keys(history).forEach((key) => {
            let checkin = history[key]
            if(checkin.in) {
                if (checkin.out) {
                    this.setState({ checkedShift: [...this.state.checkedShift, {...checkin, shift: key}]})
                }
            }
        })
    }

    handleSubmit = (check: any) => {
        this.setState({ submitting: true });
        this.props.handleSubmit(check.shift, check.note).then((res: any) => {
            this.setState({submitting: false})
            if (res.ok) {
                let result = res.body
                if (result.ok) {
                    if(result.type == "in") {
                        this.setState({checkin: result.time})
                    }
                    message.info(`${formatMessage({id: 'checkin.success'})}. shift ${check.shift}`)
                } else {
                    message.error(`${formatMessage({id: 'checkin.fail'})}. code ${result.code}`)
                }
            } else {
                message.error(res.message)
            }
            
        }).catch((err: any) => {
            message.error(formatMessage({id: 'error.it.help'}))
        })
    }

    calculateTimeDiff(from: number, to: number) {
        let difference = to - from
    
        let left = {
            hours: Math.floor(difference / (1000 * 60 * 60)),
            minutes: Math.floor((difference / 1000 / 60) % 60),
            seconds: Math.floor((difference / 1000) % 60)
        };

        return `${left.hours}h:${left.minutes}m`
    }

    render() {
        const { alertType, errorMessage } = this.props
        const {checkin, shift, shifts, note, checkedShift} = this.state;
        return (
            <div style={{ paddingTop: "20px" }} >
                {errorMessage === "" ? (
                    <Form
                    layout="vertical"
                    name="basic"
                    onFinish={this.handleSubmit}
                >
                    {checkedShift.length > 0 && (
                        checkedShift.map((value: any) => {
                            return <Alert message={formatMessage({id: 'checkin.today-history'})} description={`${shifts[value.shift]} - ${this.calculateTimeDiff(value.in, value.out)}`} type={"info"} showIcon/>
                        })
                    )}
                    {checkin != 0 && (
                        <TimeWork checkin={checkin} shift={shift} />
                    )}
                    <Form.Item
                        label={formatMessage({id: 'checkin.form.shift'})}
                        name="shift"
                        rules={[
                            {
                              required: true,
                              message: formatMessage({id: 'checkin.form.shift.required'}),
                            },
                          ]}
                    >
                        <Select disabled={checkin != 0} defaultActiveFirstOption value={shift} onChange={(value) => this.setState({shift: value})}>
                            {Object.keys(shifts).map(key => {
                                return <Option value={key} disabled={checkedShift.some(c => c.shift == key)}>{shifts[key]}</Option>
                            })}
                        </Select>
                    </Form.Item>
    
                    <Form.Item
                        label={formatMessage({id: 'checkin.form.note'})}
                        name="note"
                    >
                        <Input.TextArea value={note} onChange={(event) => this.setState({note: event.target.value})}  />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={this.state.submitting} type="primary" htmlType="submit">
                            Submit
                    </Button>
                    </Form.Item>
                </Form>
                ) : <Alert message={alertType} description={errorMessage} type={alertType} showIcon/>}
            </div>
        )
    }
}

export default connect(({ user, checkin, loading }: ConnectState) => ({
    currentUser: user.currentUser,
    currentCheck: checkin.history,
    loading: loading.models
}))(FormCheck)