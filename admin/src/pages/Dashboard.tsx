import React from 'react';
import { Card, Col, Row, Statistic } from 'antd';
import { UserOutlined, ArrowUpOutlined, PlaySquareOutlined, AccountBookOutlined } from '@ant-design/icons';

const Dashboard: React.FC = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-xl font-bold mb-4">数据大盘</h2>

      <Row gutter={16}>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="今日日活 (DAU)"
              value={112893}
              valueStyle={{ color: '#3f8600' }}
              prefix={<ArrowUpOutlined />}
              suffix="人"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="当前在线房间"
              value={321}
              prefix={<PlaySquareOutlined />}
              suffix="局"
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="新增注册用户"
              value={93}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card bordered={false} className="shadow-sm">
            <Statistic
              title="今日营收"
              value={45600}
              precision={2}
              valueStyle={{ color: '#cf1322' }}
              prefix={<AccountBookOutlined />}
              suffix="￥"
            />
          </Card>
        </Col>
      </Row>

      <div className="mt-8 bg-gray-50 h-64 rounded flex items-center justify-center border border-gray-200 border-dashed text-gray-400">
        图表区域预留 (可引入 ECharts 展示留存、营收趋势等)
      </div>
    </div>
  );
};

export default Dashboard;
