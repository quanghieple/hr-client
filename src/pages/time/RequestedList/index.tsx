import { Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import { RequestUpdate, User } from '@/data/database';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { formatMessage } from 'umi';
import { getCheckIn, queryRule } from '@/services/checkin';
import { formatDate, formatTimeDate } from '@/utils/date';
import UpdateWorkShift from '../WorkSheet/components/UpdateWorkShift';

const RequestedList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [item, setItem] = useState<User>();
  const [updateItem, setUpdateItem] = useState<User>();
  const [openDraw, setOpenDraw] = useState(false);

  const getStatus = (status: number) => {
    switch (status) {
      case 1: return <p style={{color: 'black'}}>Wating</p>;
      case 2: return <p style={{color: 'green'}}>Approve</p>;
      case 3: return <p style={{color: 'red'}}>Reject</p>;
      default: return "";
    }
  }

  const getCheckInData = (id: number) => {
    getCheckIn(id).then(res => {
      if (res) {
        setItem(res);
        setOpenDraw(true);
      }
    })
  }

  const columns: ProColumns<RequestUpdate>[] = [
    {
      title: 'Update From',
      dataIndex: 'updateFrom',
      render: (_, entity) => {
        return <a onClick={() => {getCheckInData(entity.id); setUpdateItem(entity)}}>{formatTimeDate(entity.updateFrom)}</a>;
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
          }
        }}
        request={(params, sorter, filter) => queryRule({ ...params, sorter, filter })}
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
          <UpdateWorkShift item={item} updateItem={updateItem} onRefresh={() => actionRef.current?.reload()}/>
      </Drawer>
    </>
  );
};

export default RequestedList;
