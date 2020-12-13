import { timeDiff } from '@/utils/date';
import { Spin, Table, Tag } from 'antd';
import React, { Component } from 'react';

interface WorkListProps {

} 

interface WorkListState {
  columns: Array<object>;
  shifts: any;
  data: any;
  month: number;
}

const renderShift = (data: any, shifts: any) =>  {
  return <>
    {Object.keys(data).map(item => {
      <Tag color={shifts[item] || 'green'} key={item}>
        {timeDiff(data[item].in, data[item].out)}
    </Tag>
    })}
  </>
}

const columns = [
  {
    title: 'User',
    dataIndex: 'name',
    key: 'name'
  }
];

class WorkList extends Component<WorkListProps, WorkListState> {

  constructor(props: WorkListProps) {
    super(props)
    this.state = {
      columns: [...columns],
      shifts: {},
      data: [],
      month: -1
    }
  }

  componentDidMount() {
    let date = new Date()
  }

  render() {
    return (
      <Spin spinning={this.state.month == -1}>
        <Table columns={this.state.columns} dataSource={this.state.data} />
      </Spin>
    )
  }
}

export default WorkList