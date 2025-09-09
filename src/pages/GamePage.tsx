import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Row, Col, Modal, List, Avatar, Badge, message } from 'antd';
import { TrophyOutlined, CrownOutlined, StarOutlined, PlayCircleOutlined, LockOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { gameService, vocabularyService } from '../services/api';
import { GameSession, Vocabulary } from '../types';

interface GameLevel {
  id: number;
  name: string;
  description: string;
  requiredLevel: number;
  rewards: {
    experience: number;
    coins: number;
  };
  completed: boolean;
  locked: boolean;
}

const GamePage: React.FC = () => {
  const [currentSession, setCurrentSession] = useState<GameSession | null>(null);
  const [gameLevels, setGameLevels] = useState<GameLevel[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [userStats, setUserStats] = useState({
    level: 1,
    experience: 0,
    coins: 0,
    achievements: 0,
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadGameData();
  }, []);

  const loadGameData = async () => {
    try {
      const [leaderboardData] = await Promise.all([
        gameService.getLeaderboard('weekly'),
      ]);
      setLeaderboard(leaderboardData);
      
      // Mock game levels data
      setGameLevels([
        {
          id: 1,
          name: '新手村',
          description: '开始你的单词冒险之旅',
          requiredLevel: 1,
          rewards: { experience: 100, coins: 50 },
          completed: true,
          locked: false,
        },
        {
          id: 2,
          name: '词汇森林',
          description: '在森林中寻找隐藏的单词',
          requiredLevel: 2,
          rewards: { experience: 200, coins: 100 },
          completed: false,
          locked: false,
        },
        {
          id: 3,
          name: '语法山脉',
          description: '攀登语法的高峰',
          requiredLevel: 5,
          rewards: { experience: 300, coins: 150 },
          completed: false,
          locked: true,
        },
        {
          id: 4,
          name: '阅读城堡',
          description: '在城堡中探索阅读的秘密',
          requiredLevel: 8,
          rewards: { experience: 500, coins: 200 },
          completed: false,
          locked: true,
        },
        {
          id: 5,
          name: '写作王国',
          description: '成为写作的大师',
          requiredLevel: 10,
          rewards: { experience: 800, coins: 300 },
          completed: false,
          locked: true,
        },
      ]);
    } catch (error) {
      console.error('Failed to load game data:', error);
    }
  };

  const startGameSession = async (gameType: 'adventure' | 'arena' | 'practice', level: number = 1) => {
    setLoading(true);
    try {
      const session = await gameService.startSession(gameType, level);
      setCurrentSession(session);
      message.success('游戏开始！');
    } catch (error) {
      message.error('开始游戏失败');
    } finally {
      setLoading(false);
    }
  };

  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return '#52c41a';
    if (percentage >= 60) return '#fa8c16';
    return '#f5222d';
  };

  const GameModeCard: React.FC<{
    title: string;
    description: string;
    icon: React.ReactNode;
    gameType: 'adventure' | 'arena' | 'practice';
    color: string;
  }> = ({ title, description, icon, gameType, color }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <Card
        hoverable
        style={{ 
          textAlign: 'center',
          border: `2px solid ${color}`,
          background: `${color}10`,
        }}
        onClick={() => startGameSession(gameType)}
      >
        <div style={{ fontSize: '48px', color: color, marginBottom: '16px' }}>
          {icon}
        </div>
        <h3>{title}</h3>
        <p style={{ color: '#666', fontSize: '14px' }}>{description}</p>
        <Button 
          type="primary" 
          style={{ background: color, borderColor: color, marginTop: '8px' }}
          loading={loading}
        >
          开始游戏
        </Button>
      </Card>
    </motion.div>
  );

  const LevelCard: React.FC<{ level: GameLevel }> = ({ level }) => (
    <Card
      style={{
        opacity: level.locked ? 0.6 : 1,
        position: 'relative',
      }}
    >
      {level.locked && (
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          fontSize: '48px',
          color: '#666',
        }}>
          <LockOutlined />
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h3>{level.name}</h3>
          <p style={{ color: '#666', fontSize: '14px' }}>{level.description}</p>
          <div style={{ marginTop: '8px' }}>
            <Badge count={`等级 ${level.requiredLevel}`} style={{ backgroundColor: '#52c41a' }} />
            {level.completed && <Badge count="已完成" style={{ backgroundColor: '#1890ff', marginLeft: '8px' }} />}
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '12px', color: '#666' }}>奖励</div>
          <div style={{ color: '#fa8c16' }}>
            <StarOutlined /> {level.rewards.coins}
          </div>
          <div style={{ color: '#52c41a' }}>
            <TrophyOutlined /> {level.rewards.experience} EXP
          </div>
          {!level.locked && !level.completed && (
            <Button 
              type="primary" 
              size="small"
              style={{ marginTop: '8px' }}
              onClick={() => startGameSession('adventure', level.id)}
            >
              挑战
            </Button>
          )}
        </div>
      </div>
    </Card>
  );

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Avatar size={64} icon={<CrownOutlined />} style={{ background: '#fa8c16' }} />
                  <div style={{ fontSize: '24px', fontWeight: 'bold', marginTop: '8px' }}>
                    等级 {userStats.level}
                  </div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '16px', color: '#666' }}>经验值</div>
                  <Progress 
                    percent={65} 
                    strokeColor="#52c41a"
                    format={() => `${userStats.experience}/1000`}
                  />
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#fa8c16' }}>
                    <StarOutlined /> {userStats.coins}
                  </div>
                  <div>金币</div>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', color: '#1890ff' }}>
                    <TrophyOutlined /> {userStats.achievements}
                  </div>
                  <div>成就</div>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} md={8}>
          <GameModeCard
            title="冒险模式"
            description="RPG式的单词学习冒险"
            icon={<CrownOutlined />}
            gameType="adventure"
            color="#1890ff"
          />
        </Col>
        <Col xs={24} md={8}>
          <GameModeCard
            title="竞技场"
            description="与其他玩家实时对战"
            icon={<TrophyOutlined />}
            gameType="arena"
            color="#fa8c16"
          />
        </Col>
        <Col xs={24} md={8}>
          <GameModeCard
            title="练习模式"
            description="无压力的自由练习"
            icon={<PlayCircleOutlined />}
            gameType="practice"
            color="#52c41a"
          />
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <Card title="冒险关卡">
            <List
              dataSource={gameLevels}
              renderItem={(level) => (
                <List.Item style={{ padding: '12px 0' }}>
                  <LevelCard level={level} />
                </List.Item>
              )}
            />
          </Card>
        </Col>
        
        <Col xs={24} lg={8}>
          <Card title="本周排行榜" size="small">
            <List
              dataSource={leaderboard.slice(0, 10)}
              renderItem={(item, index) => (
                <List.Item style={{ padding: '8px 0' }}>
                  <List.Item.Meta
                    avatar={
                      <Badge count={index + 1} showZero color={index < 3 ? '#fa8c16' : '#666'}>
                        <Avatar src={item.avatar} icon={<TrophyOutlined />} />
                      </Badge>
                    }
                    title={item.username}
                    description={`等级 ${item.level}`}
                  />
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ color: '#1890ff' }}>{item.score} 分</div>
                    <div style={{ fontSize: '12px', color: '#666' }}>{item.experience} EXP</div>
                  </div>
                </List.Item>
              )}
            />
          </Card>
          
          <Card title="成就系统" size="small" style={{ marginTop: 16 }}>
            <Row gutter={8}>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Badge count={5} style={{ backgroundColor: '#52c41a' }}>
                  <Avatar icon={<TrophyOutlined />} style={{ background: '#f0f0f0', color: '#666' }} />
                </Badge>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>已获得</div>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <Badge count={15} style={{ backgroundColor: '#666' }}>
                  <Avatar icon={<StarOutlined />} style={{ background: '#f0f0f0', color: '#666' }} />
                </Badge>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>总成就</div>
              </Col>
              <Col span={8} style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '24px', color: '#fa8c16' }}>
                  33%
                </div>
                <div style={{ fontSize: '12px', marginTop: '4px' }}>完成度</div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default GamePage;