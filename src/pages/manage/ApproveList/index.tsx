import { Button, Collapse, Drawer, Select } from 'antd';
import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { RequestUpdate } from '@/data/database';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import { getApproveList } from '@/services/checkin';
import { formatDate, formatTimeDate } from '@/utils/date';
import { Option } from 'antd/lib/mentions';
import _ from '@umijs/deps/compiled/lodash';
import ProDescriptions from '@ant-design/pro-descriptions';
import { CheckinStatus } from '@/pages/time/WorkSheet';
const { Panel } = Collapse;

const ApproveList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [item, setItem] = useState<RequestUpdate>();
  const [openDraw, setOpenDraw] = useState(false);

  const getStatus = (status: number) => {
    switch (status) {
      case 1: return <p style={{color: 'black'}}>Wating</p>;
      case 2: return <p style={{color: 'green'}}>Approve</p>;
      case 3: return <p style={{color: 'red'}}>Reject</p>;
      default: return "";
    }
  }

  const generateCheckInStatus = (status: number): string => {
    if (status == CheckinStatus.Checkin) {
        return "Check In";
    } else if (status == CheckinStatus.Checkout) {
        return "Check Out";
    } else {
        return "Forgot Checkout";
    }
}

  const columns: ProColumns<RequestUpdate>[] = [
    {
      title: 'User',
      dataIndex: "from",
      render: (_, entity) => {
        return <a onClick={() => {setOpenDraw(true); setItem(entity)}}>{entity.from.name}</a>;
      }
    },
    {
      title: 'Update From',
      dataIndex: 'updateFrom',
      render: (_, entity) => {
        return formatTimeDate(entity.updateFrom);
      },
    },
    {
      title: 'Update To',
      dataIndex: 'updateTo',
      copyable: true,
      sorter: true,
      valueType: 'textarea',
      render: (_, entity) => {
        return formatTimeDate(entity.updateTo);
      }
    },
    {
      title: 'Date',
      dataIndex: 'date',
      sorter: true,
      render: (_, entity) => {
        return formatDate(entity.updateFrom);
      }
    },
    {
      title: 'Note',
      dataIndex: 'note',
      hideInSearch: true
    },
    {
      title: 'Status',
      dataIndex: 'disabled',
      render: (_ , record) => {
        return getStatus(record.status);
      }
    }
  ];

  return (
    <>
      <ProTable<RequestUpdate>
        actionRef={actionRef}
        rowKey="key"
        search={{
          labelWidth: 120,
          searchText: "Search",
          resetText: "Reset",
          collapseRender: (collapsed) => {
            return collapsed ? <PlusCircleOutlined /> : <MinusCircleOutlined />;
          },
          optionRender: (props) => {
            return [<Select>
              <Option>haha</Option>
            </Select>]
          }
        }}
        request={(params, sorter, filter) => getApproveList({ ...params, sorter, filter })}
        columns={columns}
        pagination={{
          showTotal: (total) => `Total: ${total}`,
        }}
      />

      <Drawer
        title={formatMessage({id: 'checkin.qr.title'})}
        width={'50vh'}
        placement="right"
        onClose={() => setOpenDraw(false)}
        visible={openDraw}
      >
        {item?.id && (
          <>
            <ProDescriptions column={1}>
              <ProDescriptions.Item label={formatMessage({id: 'checkin.shift'})} valueType="text">
                  {item.checkIn.shiftId}
              </ProDescriptions.Item>
              <ProDescriptions.Item label="Status" valueType="text">
                  {generateCheckInStatus(item.checkIn.status)}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={formatMessage({ id: 'checkin.checkin' })} valueType="dateTime">
                  {item.checkIn.inn}
              </ProDescriptions.Item>
              <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-int' })} valueType="text">
                  {item.checkIn.noteIn}
              </ProDescriptions.Item>
              {item.status == CheckinStatus.Checkout && (
                  <>
                      <ProDescriptions.Item label="Check out" valueType="dateTime">
                          {item.checkIn.out}
                      </ProDescriptions.Item>
                      <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-out' })} valueType="text">
                          {item.checkIn.noteOut}
                      </ProDescriptions.Item>
                  </>
              )}

            </ProDescriptions>
            <Collapse defaultActiveKey="1" >
              <Panel header="Request" key="1">
                <ProDescriptions column={1}>
                  <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-int' })} valueType="text">
                    {formatTimeDate(item.updateFrom)}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-int' })} valueType="text">
                    {formatTimeDate(item.updateTo)}
                  </ProDescriptions.Item>
                  <ProDescriptions.Item label={formatMessage({ id: 'checkin.work-shift.updated.note-int' })} valueType="text">
                    {item.note}
                  </ProDescriptions.Item>
                </ProDescriptions>
                <Button type="default" htmlType="submit" style={{color: 'white', backgroundColor: 'darkred', marginRight: '10px'}}>
                  {formatMessage({ id: 'button.reject' })}
                </Button>

                <Button type="primary" htmlType="submit" >
                  {formatMessage({ id: 'button.approve' })}
                </Button>
              </Panel>
            </Collapse>
          </>
        )}
      </Drawer>
    </>
  );
};

export default ApproveList;
