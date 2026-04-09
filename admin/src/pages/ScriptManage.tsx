import React, { useState } from 'react';
import { Table, Tag, Space, Button, message } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';

interface ScriptDataType {
  key: string;
  id: string;
  title: string;
  difficulty: string;
  players: string;
  status: 'published' | 'draft';
}

const mockScripts: ScriptDataType[] = [
  { key: '1', id: 'S001', title: '良辰吉日', difficulty: '进阶', players: '6人 (3男3女)', status: 'published' },
  { key: '2', id: 'S002', title: '诡影密室', difficulty: '烧脑', players: '5人 (不限)', status: 'published' },
  { key: '3', id: 'S003', title: '霸道总裁爱上我', difficulty: '新手', players: '4人 (2男2女)', status: 'draft' },
];

const ScriptManage: React.FC = () => {
  const [data, setData] = useState(mockScripts);

  const toggleStatus = (id: string, currentStatus: string) => {
    setData(prev => prev.map(item => {
      if (item.id === id) {
        const newStatus = currentStatus === 'published' ? 'draft' : 'published';
        message.success(`剧本 ${item.title} 已${newStatus === 'published' ? '上架' : '下架'}`);
        return { ...item, status: newStatus as 'published' | 'draft' };
      }
      return item;
    }));
  };

  const columns: ColumnsType<ScriptDataType> = [
    { title: '剧本ID', dataIndex: 'id', key: 'id' },
    { title: '剧本名称', dataIndex: 'title', key: 'title', render: text => <a>{text}</a> },
    { title: '难度', dataIndex: 'difficulty', key: 'difficulty' },
    { title: '人数配置', dataIndex: 'players', key: 'players' },
    {
      title: '状态',
      key: 'status',
      dataIndex: 'status',
      render: (status) => (
        <Tag color={status === 'published' ? 'blue' : 'default'}>
          {status === 'published' ? '已上架' : '未上架/草稿'}
        </Tag>
      )
    },
    {
      title: '操作',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <Button type="link" size="small">编辑内容</Button>
          <Button
            type="link"
            size="small"
            onClick={() => toggleStatus(record.id, record.status)}
          >
            {record.status === 'published' ? '下架' : '上架'}
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">剧本内容管理</h2>
        <Button type="primary" icon={<PlusOutlined />}>录入新剧本</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ScriptManage;
