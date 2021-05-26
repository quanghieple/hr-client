import React from 'react';
import { Button, Collapse, Form, Input, message, TimePicker } from "antd";
import { formatMessage } from "umi";
import ProDescriptions from "@ant-design/pro-descriptions";
import moment from "moment";
import { range } from "lodash";
import { CheckinStatus, RequestUpdateStatus } from '..';
import { updateWorkShift } from '@/services/checkin';
const { Panel } = Collapse;

interface UpdateWorkShiftProps {
    item: any;
    onRefresh: () => void;
}

const UpdateWorkShift: React.FC<UpdateWorkShiftProps> = (props) => {
    const { item, onRefresh } = props;

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
        updateWorkShift({...value, id: item.id}).then((res) => {
            if (res.code) {
                if(res.data === RequestUpdateStatus.Approve) {
                    message.success("Update successfully");
                    onRefresh();
                } else message.info(formatMessage({id: 'checkin.work-shift.updated.wating'}))
            } else if (res.msg)
                message.error(formatMessage({id: res.msg}))
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
                <Collapse >
                    <Panel header="Update" key="1">
                        <Form
                            layout="vertical"
                            name="basic"
                            onFinish={handleSubmitUpdate}
                            initialValues={item}
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
                                    defaultValue={moment(item.out)}
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
                                <Button type="primary" htmlType="submit">
                                    {formatMessage({ id: 'checkin.work-shift.updated.button' })}
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