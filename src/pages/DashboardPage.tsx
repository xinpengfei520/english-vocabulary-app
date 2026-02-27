import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Statistic, List, Avatar, Badge, Timeline } from 'antd';
import { TrophyOutlined, BookOutlined, TeamOutlined, ClockCircleOutlined, FireOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useAuth } from '../hooks/useAuth';
import { vocabularyService, learningService } from '../services/api';
import { Vocabulary, LearningProgress } from '../types';

const DashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [recentWords, setRecentWords] = useState<Vocabulary[]>([]);
  const [progress, setProgress] = useState<LearningProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [wordsData, progressData] = await Promise.all([
          vocabularyService.getRandomWords(5),
          learningService.getProgress()
        ]);
        setRecentWords(wordsData);
        setProgress(progressData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const masteredWords = progress.filter(p => p.masteryLevel >= 0.8).length;
  const learningWords = progress.filter(p => p.masteryLevel > 0 && p.masteryLevel < 0.8).length;
  const newWords = progress.filter(p => p.masteryLevel === 0).length;

  const stats = [
    {
      title: '已掌握',
      value: masteredWords,
      icon: <TrophyOutlined style={{ color: '#52c41a' }} />,
    },
    {
      title: '学习中',
      value: learningWords,
      icon: <BookOutlined style={{ color: '#1890ff' }} />,
    },
    {
      title: '待学习',
      value: newWords,
      icon: <ClockCircleOutlined style={{ color: '#fa8c16' }} />,
    },
    {
      title: '连续天数',
      value: 7,
      icon: <FireOutlined style={{ color: '#f5222d' }} />,
    },
  ];

  return (
    <div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Row gutter={[16, 16]}>
          <Col span={24}>
            <Card>
              <Row gutter={16}>
                <Col span={18}>
                  <h2>欢迎回来，{user?.username}！</h2>
                  <p style={{ color: '#666', marginTop: 8 }}>
                    继续你的英语学习之旅吧！
                  </p>
                </Col>
                <Col span={6} style={{ textAlign: 'right' }}>
                  <Badge count={user?.level || 1} showZero color="#52c41a">
                    <Avatar size={64} src={user?.avatar} icon={<TrophyOutlined />} />
                  </Badge>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          {stats.map((stat, index) => (
            <Col xs={24} sm={12} md={6} key={stat.title}>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card>
                  <Statistic
                    title={stat.title}
                    value={stat.value}
                    prefix={stat.icon}
                    valueStyle={{ color: '#1890ff' }}
                  />
                </Card>
              </motion.div>
            </Col>
          ))}
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} lg={12}>
            <Card title="最近学习的单词" loading={loading}>
              <List
                dataSource={recentWords}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar>{item.word.charAt(0).toUpperCase()}</Avatar>}
                      title={item.word}
                      description={item.translation}
                    />
                    <Badge
                      count={item.difficulty}
                      color={item.difficulty === 'easy' ? '#52c41a' : item.difficulty === 'medium' ? '#fa8c16' : '#f5222d'}
                    />
                  </List.Item>
                )}
              />
            </Card>
          </Col>

          <Col xs={24} lg={12}>
            <Card title="学习进度" loading={loading}>
              <Timeline>
                <Timeline.Item color="green">
                  <p>完成了基础词汇学习</p>
                  <p style={{ color: '#666', fontSize: '12px' }}>2小时前</p>
                </Timeline.Item>
                <Timeline.Item color="blue">
                  <p>通过了词汇测试</p>
                  <p style={{ color: '#666', fontSize: '12px' }}>昨天</p>
                </Timeline.Item>
                <Timeline.Item color="orange">
                  <p>加入了学习小组</p>
                  <p style={{ color: '#666', fontSize: '12px' }}>3天前</p>
                </Timeline.Item>
              </Timeline>
            </Card>
          </Col>
        </Row>

        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col span={24}>
            <Card title="今日推荐">
              <Row gutter={16}>
                <Col xs={24} md={8}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center' }}
                    onClick={() => window.location.href = '/learn'}
                  >
                    <BookOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
                    <h3>继续学习</h3>
                    <p>复习今天的单词</p>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center' }}
                    onClick={() => window.location.href = '/game'}
                  >
                    <TrophyOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                    <h3>单词游戏</h3>
                    <p>在游戏中巩固词汇</p>
                  </Card>
                </Col>
                <Col xs={24} md={8}>
                  <Card
                    hoverable
                    style={{ textAlign: 'center' }}
                    onClick={() => window.location.href = '/test'}
                  >
                    <TeamOutlined style={{ fontSize: '48px', color: '#fa8c16' }} />
                    <h3>词汇测试</h3>
                    <p>检验学习成果</p>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Col>
        </Row>
      </motion.div>
    </div>
  );
};

export default DashboardPage;