import React, { useState, useEffect } from 'react';
import { Card, Button, Input, List, Avatar, Badge, Tabs, Modal, Form, message, Tag, Row, Col } from 'antd';
import { UserOutlined, TeamOutlined, TrophyOutlined, PlusOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { achievementService } from '../services/api';
import { Achievement, User } from '../types';

const { TabPane } = Tabs;

interface StudyGroup {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  maxMembers: number;
  creator: User;
  isJoined: boolean;
  isPrivate: boolean;
}

const SocialPage: React.FC = () => {
  const [studyGroups, setStudyGroups] = useState<StudyGroup[]>([]);
  const [friends, setFriends] = useState<User[]>([]);
  const [leaderboard, setLeaderboard] = useState<User[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [userAchievements, setUserAchievements] = useState<any[]>([]);
  const [createGroupModalVisible, setCreateGroupModalVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadSocialData();
  }, []);

  const loadSocialData = async () => {
    try {
      const [achievementsData] = await Promise.all([
        achievementService.getAchievements(),
      ]);
      setAchievements(achievementsData);

      // Mock data for demo
      setStudyGroups([
        {
          id: '1',
          name: '高三英语冲刺班',
          description: '一起备战高考英语',
          memberCount: 25,
          maxMembers: 30,
          creator: { id: '1', username: '张老师', email: '', level: 10, experience: 5000, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
          isJoined: true,
          isPrivate: false,
        },
        {
          id: '2',
          name: '词汇爱好者',
          description: '每天学习新词汇',
          memberCount: 12,
          maxMembers: 20,
          creator: { id: '2', username: '李同学', email: '', level: 8, experience: 3200, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
          isJoined: false,
          isPrivate: false,
        },
        {
          id: '3',
          name: '英语角',
          description: '练习口语和听力',
          memberCount: 18,
          maxMembers: 25,
          creator: { id: '3', username: '王同学', email: '', level: 6, experience: 2100, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
          isJoined: false,
          isPrivate: true,
        },
      ]);

      setFriends([
        { id: '1', username: '小明', email: '', level: 5, experience: 1500, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        { id: '2', username: '小红', email: '', level: 7, experience: 2800, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        { id: '3', username: '小李', email: '', level: 4, experience: 1200, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
      ]);

      setLeaderboard([
        { id: '1', username: '学霸小明', email: '', level: 12, experience: 6500, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        { id: '2', username: '英语达人', email: '', level: 11, experience: 5800, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        { id: '3', username: '词汇大师', email: '', level: 10, experience: 5200, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        { id: '4', username: '努力中的你', email: '', level: 8, experience: 3500, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        { id: '5', username: '新手学习者', email: '', level: 6, experience: 2100, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
      ]);

      setUserAchievements([
        { achievement: achievementsData[0], unlockedAt: new Date() },
        { achievement: achievementsData[1], unlockedAt: new Date() },
      ]);
    } catch (error) {
      console.error('Failed to load social data:', error);
    }
  };

  const handleCreateGroup = async (values: { name: string; description: string; isPrivate: boolean }) => {
    setLoading(true);
    try {
      // Mock API call
      const newGroup: StudyGroup = {
        id: Date.now().toString(),
        name: values.name,
        description: values.description,
        memberCount: 1,
        maxMembers: 20,
        creator: { id: 'current', username: '当前用户', email: '', level: 1, experience: 0, avatar: '', createdAt: new Date(), lastLoginAt: new Date() },
        isJoined: true,
        isPrivate: values.isPrivate,
      };
      setStudyGroups([newGroup, ...studyGroups]);
      setCreateGroupModalVisible(false);
      message.success('学习小组创建成功！');
    } catch (error) {
      message.error('创建小组失败');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    try {
      setStudyGroups(studyGroups.map(group =>
        group.id === groupId ? { ...group, isJoined: true, memberCount: group.memberCount + 1 } : group
      ));
      message.success('加入学习小组成功！');
    } catch (error) {
      message.error('加入小组失败');
    }
  };

  const handleLeaveGroup = async (groupId: string) => {
    try {
      setStudyGroups(studyGroups.map(group =>
        group.id === groupId ? { ...group, isJoined: false, memberCount: group.memberCount - 1 } : group
      ));
      message.success('离开学习小组成功！');
    } catch (error) {
      message.error('离开小组失败');
    }
  };

  const getAchievementColor = (rarity: string) => {
    switch (rarity) {
      case 'legendary': return '#fa8c16';
      case 'epic': return '#722ed1';
      case 'rare': return '#1890ff';
      default: return '#52c41a';
    }
  };

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Tabs defaultActiveKey="groups">
              <TabPane tab="学习小组" key="groups">
                <div style={{ marginBottom: 16 }}>
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setCreateGroupModalVisible(true)}
                  >
                    创建学习小组
                  </Button>
                </div>

                <List
                  dataSource={studyGroups}
                  renderItem={(group) => (
                    <List.Item
                      actions={[
                        group.isJoined ? (
                          <Button
                            danger
                            onClick={() => handleLeaveGroup(group.id)}
                          >
                            离开
                          </Button>
                        ) : (
                          <Button
                            type="primary"
                            onClick={() => handleJoinGroup(group.id)}
                            disabled={group.memberCount >= group.maxMembers}
                          >
                            加入
                          </Button>
                        )
                      ]}
                    >
                      <List.Item.Meta
                        avatar={
                          <Badge count={group.memberCount} showZero color="#1890ff">
                            <Avatar icon={<TeamOutlined />} />
                          </Badge>
                        }
                        title={
                          <div>
                            {group.name}
                            {group.isPrivate && <Tag color="orange" style={{ marginLeft: 8 }}>私密</Tag>}
                            {group.isJoined && <Tag color="green" style={{ marginLeft: 8 }}>已加入</Tag>}
                          </div>
                        }
                        description={
                          <div>
                            <p>{group.description}</p>
                            <div style={{ fontSize: '12px', color: '#666' }}>
                              创始人：{group.creator.username} | 成员：{group.memberCount}/{group.maxMembers}
                            </div>
                          </div>
                        }
                      />
                    </List.Item>
                  )}
                />
              </TabPane>

              <TabPane tab="好友" key="friends">
                <List
                  dataSource={friends}
                  renderItem={(friend) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={<Avatar src={friend.avatar} icon={<UserOutlined />} />}
                        title={friend.username}
                        description={`等级 ${friend.level} | ${friend.experience} EXP`}
                      />
                      <div style={{ textAlign: 'right' }}>
                        <Badge count={friend.level} showZero color="#52c41a" />
                        <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                          最后上线：2小时前
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>

              <TabPane tab="排行榜" key="leaderboard">
                <List
                  dataSource={leaderboard}
                  renderItem={(user, index) => (
                    <List.Item>
                      <List.Item.Meta
                        avatar={
                          <Badge count={index + 1} showZero color={index < 3 ? '#fa8c16' : '#666'}>
                            <Avatar src={user.avatar} icon={<TrophyOutlined />} />
                          </Badge>
                        }
                        title={user.username}
                        description={`等级 ${user.level}`}
                      />
                      <div style={{ textAlign: 'right' }}>
                        <div style={{ color: '#1890ff', fontSize: '16px' }}>
                          {user.experience} EXP
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          {index === 3 && '就是你！'}
                        </div>
                      </div>
                    </List.Item>
                  )}
                />
              </TabPane>

              <TabPane tab="成就" key="achievements">
                <Row gutter={[16, 16]}>
                  <Col span={24}>
                    <Card title="我的成就" size="small">
                      <Row gutter={16}>
                        {userAchievements.map((item, index) => (
                          <Col xs={12} sm={6} key={index}>
                            <motion.div
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                            >
                              <Card
                                style={{ textAlign: 'center' }}
                                bodyStyle={{ padding: '16px' }}
                              >
                                <Avatar
                                  size={48}
                                  icon={<TrophyOutlined />}
                                  style={{
                                    background: getAchievementColor(item.achievement.rarity),
                                    marginBottom: '8px'
                                  }}
                                />
                                <div style={{ fontSize: '12px', fontWeight: 'bold' }}>
                                  {item.achievement.name}
                                </div>
                                <div style={{ fontSize: '10px', color: '#666' }}>
                                  {item.achievement.points} 分
                                </div>
                              </Card>
                            </motion.div>
                          </Col>
                        ))}
                      </Row>
                    </Card>
                  </Col>

                  <Col span={24}>
                    <Card title="所有成就" size="small">
                      <List
                        dataSource={achievements}
                        renderItem={(achievement) => (
                          <List.Item>
                            <List.Item.Meta
                              avatar={
                                <Avatar
                                  icon={<TrophyOutlined />}
                                  style={{ background: getAchievementColor(achievement.rarity) }}
                                />
                              }
                              title={achievement.name}
                              description={achievement.description}
                            />
                            <div style={{ textAlign: 'right' }}>
                              <Tag color={getAchievementColor(achievement.rarity)}>
                                {achievement.rarity}
                              </Tag>
                              <div style={{ fontSize: '12px', color: '#666', marginTop: 4 }}>
                                {achievement.points} 分
                              </div>
                            </div>
                          </List.Item>
                        )}
                      />
                    </Card>
                  </Col>
                </Row>
              </TabPane>
            </Tabs>
          </Card>
        </Col>
      </Row>

      <Modal
        title="创建学习小组"
        visible={createGroupModalVisible}
        onCancel={() => setCreateGroupModalVisible(false)}
        footer={null}
      >
        <Form onFinish={handleCreateGroup} layout="vertical">
          <Form.Item
            name="name"
            label="小组名称"
            rules={[{ required: true, message: '请输入小组名称' }]}
          >
            <Input placeholder="请输入小组名称" />
          </Form.Item>

          <Form.Item
            name="description"
            label="小组描述"
            rules={[{ required: true, message: '请输入小组描述' }]}
          >
            <Input.TextArea placeholder="请输入小组描述" rows={3} />
          </Form.Item>

          <Form.Item name="isPrivate" valuePropName="checked">
            <Input type="checkbox" /> 私密小组
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              创建小组
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SocialPage;