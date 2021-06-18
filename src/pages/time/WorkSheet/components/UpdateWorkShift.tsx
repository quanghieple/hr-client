import React from 'react';
import { Button, Collapse, Form, Input, message, TimePicker } from "antd";
import { formatMessage } from "umi";
import ProDescriptions from "@ant-design/pro-descriptions";
import moment from "moment";
import { range } from "lodash";
import { CheckinStatus, RequestUpdateStatus } from '..';
import { getUpdateWorkShift, updateWorkShift } from '@/services/checkin';
const { Panel } = Collapse;

interface UpdateWorkShiftProps {
    item: any;
    updateItem?: any;
    onRefresh: () => void;
}

const UpdateWorkShift: React.FC<UpdateWorkShiftProps> = (props) => {
    const { item, updateItem, onRefresh } = props;
    const [loading, setLoading] = React.useState(false);
    const [current, setCurrent] = React.useState<any>({ note: null, updateTo: null });
    const formValue = {...item, requestNote: current.note }

    React.useEffect(() => {
      if (!updateItem) {
        getUpdateWorkShift(item.id).then((res) => {
            if (res.code) {
                setCurrent(res.data)
            }
        })
      } else {
        setCurrent(updateItem)
      }
    }, [item]);

    const generateStatus = (status: number): string => {
        if (status == CheckinStatus.Checkin) {
            return "Check In";
        } else if (status == CheckinStatus.Checkout) {
            return "Check Out";
        } else {
            return "Forgot Checkout";
        }
    }

    const handleSubmitUpdate = (value: any) => {
        setLoading(true);
        const body = {...value, checkId: item.id};
        if (current) body.id = current?.id;
        updateWorkShift(body).then((res) => {
            if (res.code) {
                if(current.id) {
                    message.success("Update Request successfully");
                } else if(res.data.code === RequestUpdateStatus.Approve) {
                    message.success("Update Workshift successfully");
                    onRefresh();
                } else {
                    message.info(formatMessage({id: 'checkin.work-shift.updated.wating'}));
                    setCurrent(res.data.update || { note: null, updateTo: null });
                }
            } else if (res.msg) {
                message.error(formatMessage({id: res.msg}))
            }
            setLoading(false);
        })
    }

    return (
        <>
            <ProDescriptions column={1} >
                <ProDescriptions.Item label={formatMessage({id: 'checkin.shift'})} valueType="text">
                    {item.shift.name}
                </ProDescriptions.Item>
                <ProDescriptions.Item label="Status" valueType="text">
                    {generateStatus(item.status)}
                </ProDescriptions.Item>
                <ProDescriptions.Item label={formatMessage({ id: 'checkin.checkin' })} valueType="dateTime">
                    {item.inn}
                </ProDescriptions.Item>
                <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-int' })} valueType="text">
                    {item.noteIn}
                </ProDescriptions.Item>
                {item.status == CheckinStatus.Checkout && (
                    <>
                        <ProDescriptions.Item label="Check out" valueType="dateTime">
                            {item.out}
                        </ProDescriptions.Item>
                        <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-out' })} valueType="text">
                            {item.noteOut}
                        </ProDescriptions.Item>
                    </>
                )}

            </ProDescriptions>
            {item.status !== CheckinStatus.Checkin && (
                <Collapse defaultActiveKey="1" >
                    <Panel header={current.id ? "Update Your Request" : "Request Update Work Shift"} key={current.id ? "1" : "0"}>
                        <Form
                            layout="vertical"
                            name="basic"
                            onFinish={handleSubmitUpdate}
                            initialValues={formValue}
                        >
                            <Form.Item
                                name="checkout"
                                label={formatMessage({ id: 'checkin.shift.range' })}
                            >
                                <TimePicker
                                    disabledHours={() => { return range(0, moment(item.inn).hours()) }}
                                    disabledMinutes={(hour) => {
                                        const inn = moment(item.inn)
                                        return (hour === inn.hours()) ? range(0, inn.minutes()) : []
                                    }}
                                    defaultValue={moment(current.updateTo || item.out)}
                                    format="HH:mm" />
                            </Form.Item>

                            <Form.Item
                                label={formatMessage({ id: 'checkin.work-shift.updated.note-int' })}
                                name="noteIn"
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item
                                label={formatMessage({ id: 'checkin.work-shift.updated.note-out' })}
                                name="noteOut"
                            >
                                <Input.TextArea />
                            </Form.Item>

                            <Form.Item
                                label={formatMessage({ id: 'checkin.work-shift.updated.note-request' })}
                                name="requestNote"
                            >
                                <Input.TextArea />
                            </Form.Item>
                            <Form.Item>
                                <Button type="primary" htmlType="submit" loading={loading} >
                                    {formatMessage({ id: current.id ? 'checkin.work-shift.updated.button' : 'button.update' })}
                                </Button>
                            </Form.Item>
                        </Form>
                    </Panel>
                </Collapse>
            )}
        </>
    )
}

export default UpdateWorkShift;
