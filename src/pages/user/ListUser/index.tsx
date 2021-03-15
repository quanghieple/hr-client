import { Divider,Drawer } from 'antd';
import React, { useState, useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { ProColumns, ActionType } from '@ant-design/pro-table';
import ProDescriptions from '@ant-design/pro-descriptions';
import { queryRule} from './service';
import { User } from '@/data/database';
import { MinusCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Link } from 'umi';

const TableList: React.FC<{}> = () => {
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<User>();
  const columns: ProColumns<User>[] = [
    {
      title: 'Email',
      dataIndex: 'email',
      copyable: true,
      formItemProps: {
        rules: [
          {
            required: true,
            message: '规则名称为必填项',
          },
        ],
      },
      render: (dom, entity) => {
        return <a onClick={() => setRow(entity)}>{dom}</a>;
      },
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      copyable: true,
      sorter: true,
      valueType: 'textarea',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      sorter: true,
    },
    {
      title: 'Status',
      dataIndex: 'disabled',
      render: (_ , record) => {
        if (record.disabled) {
          return "Disabled";
        } else {
          return "Enable";
        }
      }
    },
    {
      title: 'Address',
      dataIndex: 'address',
      hideInSearch: true,
      hideInTable: true,
      initialValue: ""
    },
    {
      title: 'Info',
      dataIndex: 'profile',
      hideInTable: true,
      hideInSearch: true,
      initialValue: ""
    },
    {
      title: 'Photo',
      dataIndex: 'photoURL',
      hideInTable: true,
      hideInSearch: true,
      render: (_ , record) => {
        if (record.photoURL) {
          return <img width="150px" src={record.photoURL} />
        } else {
          return "";
        }
      }
    },
    {
      title: 'Option',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
            }}
          >
            Disabled
          </a>
          <Divider type="vertical" />
          <Link to={`/other/profile?id=${record.id}`}>Edit</Link>
        </>
      ),
    },
  ];

  return (
    <PageContainer>
      <ProTable<User>
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
        width={600}
        visible={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.id && (
          <ProDescriptions<User>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.id,
            }}
            columns={columns}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
