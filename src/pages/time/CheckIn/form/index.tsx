import React, { useState, useEffect, Component } from 'react';
import { Alert, Badge, Button, Form, Input, message, notification, Select } from 'antd';
import { getCurrentShift, getListShift } from '@/services/checkin';
import { connect, formatMessage } from 'umi';
import { ConnectState } from '@/models/connect';
import { User } from '@/data/database';
import { timeDiff, timeDiffS } from '@/utils/date';
import { FormInstance } from 'antd/lib/form';
interface FormCheckProps {
    errorMessage: string;
    alertType: 'success' | 'info' | 'warning' | 'error';
    handleSubmit: Function;
    resetForm: Function;
    currentUser: User;
    currentCheck: any;
}

interface FormCheckState {
  id: number | undefined;
    shift: string;
    shifts: object;

    checkedShift: any[];
    checkin: string;
    submitting: boolean;
}

const { Option } = Select;

const TimeWork = (props: {checkin: string, shift: string}) => {
    const [count, setCount] = useState("")
    useEffect(() => {
        let timeout = setTimeout(() => {
            calculateTimeLeft()
        }, 1000)

        return () => clearTimeout(timeout)
    })
    const calculateTimeLeft = () => {
        setCount(timeDiff(new Date(props.checkin).getTime(), (new Date()).getTime(), true))
    }
    return (
        <Alert style={{margin: '15'}} message="" description={`${formatMessage({id: 'checkin.working-on'})} ${props.shift} (${count})`} />
    )
}

const History = (props: {data: Array<any>}) => {
    return (
        <ul className="events" style={{paddingLeft: '10px'}}>
            {props.data.map((value: any) => {
                return <li key={value.shift}>
                    <Badge status='success' text={`${value.shift.name} - ${timeDiffS(value.inn, value.out)}`} />
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
          id: undefined,
            shift: "",
            checkin: "",
            submitting: false,
            shifts: {},
            checkedShift: [],
        }
    }

    componentDidMount() {
        getCurrentShift().then((value) => {
            if(value) {
                this.setState({checkin: value.inn, shift: value.shift.name, id: value.id})
                if(this.formRef.current)
                    this.formRef.current.setFieldsValue({
                        shift: value.shift.id
                    });
            }
        })

        getListShift().then((value) => {
          const shifts = value.reduce((map : any, item : any) => {
            return {...map, [item.id]: item}
          }, {})
          this.setState({shifts: shifts})
        })

        let key: string = "d" + (new Date().getDate())
        let history = (this.props.currentCheck[key] || []).filter((key: any) => key.status == 2)

        this.setState({checkedShift: history})
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
        console.log(check);

        const shiftName = this.state.shifts[check.shift].name;
        this.props.handleSubmit(check.shift, check.note, this.state.id).then((res: any) => {
          this.setState({submitting: false})
          if (res.code == 1) {
              let result = res.data
              if(result.status == 1) {
                  this.setState({checkin: result.inn, shift: shiftName, id: result.id})
              } else {
                  this.setState({id: undefined, checkin: "", checkedShift: [...this.state.checkedShift, {...result, shift: {id: check.shift, name: shiftName}}]})
                  if(this.formRef.current) {
                      this.formRef.current.setFieldsValue({
                          shift: ""
                      });
                  }
              }
              message.info(`${formatMessage({id: 'checkin.success'})}. shift ${shiftName}`)
              this.resetForm()
          } else {
            this.openNotification(formatMessage({id: 'checkin.fail'}), formatMessage({id: res.msg}))
            this.resetForm()
          }
        }).catch((err: any) => {
            this.openNotification(formatMessage({id: 'checkin.fail'}), formatMessage({id: 'error.it.help'}))
        })
    }

    render() {
        const { alertType, errorMessage } = this.props
        const { checkin, shift, shifts, checkedShift } = this.state;
        return (
            <div style={{ paddingTop: "20px" }} >
                {checkedShift.length > 0 && (
                    <Alert style={{marginBottom: '15px'}} message={formatMessage({id: 'checkin.today-history'})} description={<History data={checkedShift} />} type={"success"} showIcon/>
                )}
                {checkin != "" && (
                    <div style={{marginBottom: '15px'}}>
                        <TimeWork checkin={checkin} shift={shift} />
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
                        <Select disabled={checkin != ""} defaultActiveFirstOption={true}>
                            {Object.keys(shifts).map(key => {
                                return <Option value={shifts[key].id} disabled={checkedShift.map(c => c.shift.id).indexOf(shifts[key].id) >= 0}>{shifts[key].name}</Option>
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
                            {checkin != "" ? formatMessage({id: 'checkin.checkout'}) : formatMessage({id: 'checkin.checkin'})}
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
