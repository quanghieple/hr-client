import { formatMessage } from '@/.umi/plugin-locale/localeExports';
import { getListShift, updateShift } from '@/services/checkin';
import { Button, Col, List, message, Row, TimePicker } from 'antd';
import { Form, Input } from 'antd';
import { FormInstance } from 'antd/lib/form';
import moment from 'moment';
import React, { Component, Fragment } from 'react';

type Unpacked<T> = T extends (infer U)[] ? U : T;

interface ShiftProps {
  shift: any[];
}

interface ShiftState {
  current: any;
  shifts: any[];
  updating: boolean;
}

class NotificationView extends Component<ShiftProps, ShiftState> {
  formRef = React.createRef<FormInstance>();

  constructor(props: ShiftProps) {
    super(props);
    this.state = {
      current: {},
      shifts: [],
      updating: false
    }
  }

  componentDidMount() {
    getListShift().then(sf => this.setState({shifts: sf}))
  }

  handleSubmit = (value: any) => {
    this.setState({updating: true});
    var data = {name: value.name}
    if (this.state.current.id) data["id"] = this.state.current.id;
    if(value.range) {
      data["start"] = value.range[0].minutes() + value.range[0].hours()*60;
      data["end"] = value.range[1].minutes() + value.range[1].hours()*60;
    } else {
      data["start"] = 0;
      data["end"] = 24*60 - 1;
    }
    updateShift(data).then((res) => {
      if (res.code) {
        if (this.state.current.id) {
          getListShift().then(sf => this.setState({shifts: sf}))
        }
        message.success(formatMessage({id: this.state.current.id? 'checkin.shift.updated.success' : 'checkin.shift.created.success'}))
        this.handleCancelClick();
      } else {
        message.error(formatMessage({id: res.msg}))
      }
      this.setState({updating: false});
    })
  }

  handleUpdateClick = (data: any) => {
    this.setState({current: data})
    this.formRef.current?.setFieldsValue({
      name: data.name,
      range: [moment().hours(Math.floor(data.start/60)).minutes(data.start%60), moment().hours(Math.floor(data.end/60)).minutes(data.end%60)]
    })
  }

  handleCancelClick = () => {
    this.setState({current: {}})
    this.formRef.current?.setFieldsValue({
      name: "",
      range: undefined
    })
  }

  render() {
    const data = this.state.shifts
    const action = (data: any) => (
      <Button onClick={() => this.handleUpdateClick(data)}>
        Update
      </Button>
    )
    return (
      <Fragment>
        <h3 style={{marginTop: "30px"}}>Current Shift</h3>
        <List<Unpacked<typeof data>>
          itemLayout="horizontal"
          dataSource={data}
          renderItem={(item) => (
            <List.Item actions={[action(item)]}>
              <List.Item.Meta title={item.name} description={`from ${Math.floor(item.start/60)}:${item.start%60} to ${Math.floor(item.end/60)}:${item.end%60}`} />
            </List.Item>
          )}
        />
        <h3 style={{marginTop: "30px"}}>New Shift</h3>
        <Form onFinish={this.handleSubmit} ref={this.formRef} >
          <Row>
            <Col span={12}>
            <Form.Item
              name="name"
              label="Shift Name"
              rules={[{ required: true, message: "Please input shift name!" }]}
            >
              <Input style={{ width: "100%" }} />
            </Form.Item>
            </Col>
            <Col span={12}>
            <Form.Item
              name="range"
              label="Time"
            >
              <TimePicker.RangePicker format="HH:mm"/>
            </Form.Item>
            </Col>
          </Row>
          <Row>
           <Col span={36}>
              <Button loading={this.state.updating} type="primary" htmlType="submit" >
                {this.state.current.id ? "Update" : "Create"}
              </Button>
            </Col>
            {this.state.current.id && (
              <Button loading={this.state.updating} style={{marginLeft: "10px"}} type="default" onClick={this.handleCancelClick} >
                Cancel
              </Button>
            )}
          </Row>
        </Form>
      </Fragment>
    );
  }
}

export default NotificationView;
