import React, { useState, useEffect, Component } from 'react';
import { Alert, Badge, Button, Form, Input, message, notification, Select } from 'antd';
import { getCurrentShift } from '@/services/checkin';
import { connect, formatMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import { CurrentUser } from '@/data/database';
import { timeDiff } from '@/utils/date';
import { FormInstance } from 'antd/lib/form';

interface FormCheckProps {
    errorMessage: string;
    alertType: 'success' | 'info' | 'warning' | 'error';
    handleSubmit: Function;
    resetForm: Function;
    currentUser: CurrentUser;
    currentCheck: any;
}

interface FormCheckState {
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
        setCount(timeDiff(props.checkin, (new Date()).getTime(), true))
    }
    return (
        <Alert style={{margin: '15'}} message="" description={`${formatMessage({id: 'checkin.working-on'})} ${props.shift} (${count})`} />
    )
}

const History = (props: {data: Array<any>, shifts: any}) => {
    return (
        <ul className="events" style={{paddingLeft: '10px'}}>
            {props.data.map((value: any) => {
                return <li key={value.shift}>
                    <Badge status='success' text={`${props.shifts[value.shift]} - ${timeDiff(value.in, value.out)}`} />
                </li>
            })}
        </ul>
    )
}

class FormCheck extends Component<FormCheckProps, FormCheckState> {
    formRef = React.createRef<FormInstance>();
    constructor(props: FormCheckProps) {
        super(props);
        this.state = {
            shift: "",
            checkin: 0,
            submitting: false,
            shifts: {"morning": "Morning", "evening": "Evening", "night": "Night"},
            checkedShift: [],
        }
    }
    
    componentDidMount() {
        getCurrentShift(this.props.currentUser.uid).then((snap) => {
            let value = snap.val();
            if(value) {
                this.setState({checkin: value.checkTime, shift: value.shift})
                if(this.formRef.current)
                    this.formRef.current.setFieldsValue({
                        shift: value.shift
                    });
            }
        })

        let key: string = new Date().getDate().toString()
        let history = this.props.currentCheck[key] || {}

        let array = Object.keys(history).filter(key => history[key].out).map((key) => {
            let checkin = history[key]
            return {...checkin, shift: key}
        })

        this.setState({checkedShift: array})
    }

    resetForm = () => {
        this.props.resetForm()
    }

    openNotification = (title: string, mess: string) => {
        notification['error']({
          message: title,
          description: mess,
          duration: 15
        });
    }

    handleSubmit = (check: any) => {
        this.setState({ submitting: true });
        this.props.handleSubmit(check.shift, check.note).then((res: any) => {
            var errorMess = ""
            this.setState({submitting: false})
            if (res.ok) {
                let result = res.body
                if (result.ok) {
                    if(result.type == "in") {
                        this.setState({checkin: result.in, shift: check.shift})
                    } else {
                        this.setState({checkin: 0, checkedShift: [...this.state.checkedShift, 
                            {in: result.in, out: result.out, shift: check.shift}]})
                        if(this.formRef.current) {
                            this.formRef.current.setFieldsValue({
                                shift: ""
                            });
                        }
                    }
                    message.info(`${formatMessage({id: 'checkin.success'})}. shift ${check.shift}`)
                    this.resetForm()
                } else {
                    errorMess = formatMessage({id: `checkin.code.${result.code}`, defaultMessage: ""})
                }
            } else {
                errorMess = res.message
            }

            if (errorMess) {
                this.openNotification(formatMessage({id: 'checkin.fail'}), errorMess)
                this.resetForm()
            }
            
        }).catch((err: any) => {
            this.openNotification(formatMessage({id: 'checkin.fail'}), formatMessage({id: 'error.it.help'}))
        })
    }

    render() {
        const { alertType, errorMessage } = this.props
        const {checkin, shift, shifts, checkedShift} = this.state;
        return (
            <div style={{ paddingTop: "20px" }} >
                {checkedShift.length > 0 && (
                    <Alert style={{marginBottom: '15px'}} message={formatMessage({id: 'checkin.today-history'})} description={<History data={checkedShift} shifts={shifts} />} type={"success"} showIcon/>
                )}
                {checkin != 0 && (
                    <div style={{marginBottom: '15px'}}>
                        <TimeWork checkin={checkin} shift={shifts[shift]} />
                    </div>
                )}
                {errorMessage === "" ? (
                    <Form
                    layout="vertical"
                    name="basic"
                    onFinish={this.handleSubmit}
                    ref={this.formRef}
                    initialValues={{shift: shift}}
                >
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
                        <Select disabled={checkin != 0} defaultActiveFirstOption={true}>
                            {Object.keys(shifts).map(key => {
                                return <Option value={key} disabled={checkedShift.some(c => c.shift == key)}>{shifts[key]}</Option>
                            })}
                        </Select>
                    </Form.Item>
    
                    <Form.Item
                        label={formatMessage({id: 'checkin.form.note'})}
                        name="note"
                    >
                        <Input.TextArea />
                    </Form.Item>
                    <Form.Item>
                        <Button loading={this.state.submitting} type="primary" htmlType="submit">
                            {checkin != 0 ? formatMessage({id: 'checkin.checkout'}) : formatMessage({id: 'checkin.checkin'})}
                        </Button>
                    </Form.Item>
                </Form>
                ) : <Alert message={alertType} description={errorMessage} type={alertType} showIcon/>}
            </div>
        )
    }
}

export default connect(({ user, checkin }: ConnectState) => ({
    currentUser: user.currentUser,
    currentCheck: checkin.history
}))(FormCheck)