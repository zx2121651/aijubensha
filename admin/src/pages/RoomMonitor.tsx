import React, { useState } from 'react';
import { Table, Tag, Modal, List, Button, message, Space, Typography, Card, Row, Col, Badge } from 'antd';
import { EyeOutlined, WarningOutlined, StopOutlined, DeleteOutlined, ClockCircleOutlined } from '@ant-design/icons';

const { Text } = Typography;

export default function RoomMonitor() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<any>(null);

  // Mock Active Rooms
  const rooms = [
    { id: 'R102', script: '死光法则', dm: '无情推土机', phase: 'DISCUSSING', players: 6, duration: '4h 20m', isOvertime: false },
    { id: 'R105', script: '第七号嫌疑人', dm: 'AI托管', phase: 'INVESTIGATING', players: 5, duration: '6h 15m', isOvertime: true },
    { id: 'R108', script: '迷雾山庄', dm: '深夜小酒馆', phase: 'VOTING', players: 8, duration: '3h 10m', isOvertime: false },
  ];

  // Mock Socket Logs
  const mockLogs = [
    { time: '14:20:05', user: '戏精本精', type: 'chat', content: '那张纸条到底写了什么？' },
    { time: '14:20:12', user: '划水怪', type: 'action', content: '[搜查了后花园]' },
    { time: '14:20:15', user: '系统', type: 'system', content: '获得了线索卡 #12' },
    { time: '14:21:00', user: '推理大师', type: 'chat', content: '大家都把线索发出来看看吧' },
  ];

  const handleOpenMonitor = (room: any) => {
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  const handleDismiss = () => {
    Modal.confirm({
      title: '高危操作确认：强制解散房间',
      content: '强制解散后，房间内所有玩家将被踢出，且未结算订单可能退款。确认继续吗？',
      okText: '确认解散并清退',
      okType: 'danger',
      cancelText: '取消',
      onOk: () => {
        message.success(`已强制解散房间 ${selectedRoom.id}`);
        setIsModalOpen(false);
      }
    });
  };

  const handleMuteAll = () => {
    message.warning(`已对房间 ${selectedRoom.id} 执行全员强制禁言`);
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold m-0 flex items-center gap-2">
          对局大盘巡场
          <Badge status="processing" text="正在实时监听" />
        </h2>
      </div>

      <Row gutter={[16, 16]}>
        {rooms.map(room => (
          <Col span={8} key={room.id}>
            <Card
              hoverable
              onClick={() => handleOpenMonitor(room)}
              style={{ borderColor: room.isOvertime ? '#faad14' : '#f0f0f0' }}
              bodyStyle={{ padding: 16 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-col gap-1">
                  <Text strong>{room.script}</Text>
                  <Text type="secondary" className="text-xs">房间 ID: {room.id}</Text>
                </div>
                <Tag color={room.phase === 'DISCUSSING' ? 'blue' : room.phase === 'VOTING' ? 'purple' : 'cyan'}>
                  {room.phase}
                </Tag>
              </div>

              <div className="flex flex-col gap-2 mt-4 text-xs">
                <div className="flex justify-between">
                  <Text type="secondary">DM/状态：</Text>
                  <Text>{room.dm}</Text>
                </div>
                <div className="flex justify-between">
                  <Text type="secondary">在线人数：</Text>
                  <Text>{room.players} 人</Text>
                </div>
                <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                  <Text type="secondary"><ClockCircleOutlined /> 运行时间：</Text>
                  <Text type={room.isOvertime ? 'warning' : 'success'} strong>
                    {room.duration} {room.isOvertime && <WarningOutlined />}
                  </Text>
                </div>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal
        title={`上帝巡场视角：房间 ${selectedRoom?.id} (${selectedRoom?.script})`}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={900}
        footer={null}
        destroyOnClose
      >
        <div className="flex gap-6 h-[500px]">
          {/* Left: Socket Logs */}
          <div className="flex-1 border border-gray-200 rounded-lg flex flex-col overflow-hidden">
            <div className="bg-gray-50 px-4 py-2 border-b border-gray-200 font-bold text-sm flex items-center gap-2">
              <EyeOutlined /> 实时日志流 (Socket.io)
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {mockLogs.map((log, i) => (
                <div key={i} className="mb-3 text-sm flex items-start gap-2">
                  <span className="text-gray-400 text-xs shrink-0 font-mono mt-0.5">[{log.time}]</span>
                  <div className="flex-1">
                    <Text
                      strong
                      type={log.type === 'system' ? 'danger' : log.type === 'action' ? 'warning' : 'secondary'}
                    >
                      {log.user}:
                    </Text>
                    <Text className="ml-2" type={log.type === 'system' ? 'secondary' : 'default'}>
                      {log.content}
                    </Text>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Danger Actions */}
          <div className="w-64 flex flex-col gap-4">
            <Card title="高危操作面板" size="small" headStyle={{ color: '#cf1322' }}>
              <Space direction="vertical" style={{ width: '100%' }}>
                <Button danger icon={<StopOutlined />} block onClick={handleMuteAll}>
                  全员强制禁言
                </Button>
                <Button danger type="primary" icon={<DeleteOutlined />} block onClick={handleDismiss}>
                  强制解散房间
                </Button>
              </Space>
              <div className="mt-4 text-xs text-gray-400 bg-red-50 p-2 rounded border border-red-100">
                <WarningOutlined className="text-red-500 mr-1" />
                警告：强制解散会导致剧本杀立刻终止，相关对局数据可能丢失，请在收到多名玩家投诉或超时严重时使用。
              </div>
            </Card>
          </div>
        </div>
      </Modal>
    </div>
  );
}
