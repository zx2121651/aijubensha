import React, { useState } from 'react';
import { Table, Tag, Space, Button, Input, message } from 'antd';
import type { ColumnsType } from 'antd/es/table';

interface DataType {
  key: string;
  id: string;
  name: string;
  phone: string;
  status: 'normal' | 'banned';
  registerTime: string;
}

const mockData: DataType[] = [
  { key: '1', id: 'U1001', name: '推理狂魔', phone: '138****1234', status: 'normal', registerTime: '2023-10-01' },
  { key: '2', id: 'U1002', name: '违规玩家A', phone: '139****5678', status: 'banned', registerTime: '2023-10-05' },
  { key: '3', id: 'U1003', name: '情感本爱好者', phone: '137****9012', status: 'normal', registerTime: '2023-10-12' },
];

const UserManage: React.FC = () => {
  const [data, setData] = useState(mockData);

  const handleBan = (id: string, currentStatus: string) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = currentStatus === 'normal' ? 'banned' : 'normal';
        message.success(`已将用户 ${item.name} 状态更改为：${newStatus === 'normal' ? '正常' : '封禁'}`);
        return { ...item, status: newStatus as 'normal' | 'banned' };
      }
      return item;
    }));
  };

  const columns: ColumnsType<DataType> = [
    { title: '用户ID', dataIndex: 'id', key: 'id' },
    { title: '昵称', dataIndex: 'name', key: 'name' },
    { title: '手机号', dataIndex: 'phone', key: 'phone' },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'normal' ? 'green' : 'red'}>
          {status === 'normal' ? '正常' : '封禁'}
        </Tag>
      )
    },
    { title: '注册时间', dataIndex: 'registerTime', key: 'registerTime' },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">查看详情</Button>
          <Button
            type="link"
            danger={record.status === 'normal'}
            size="small"
            onClick={() => handleBan(record.id, record.status)}
          >
            {record.status === 'normal' ? '封禁' : '解封'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">用户管理</h2>
        <Input.Search placeholder="搜索用户ID/昵称/手机号" style={{ width: 300 }} onSearch={(val) => console.log(val)} />
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default UserManage;
