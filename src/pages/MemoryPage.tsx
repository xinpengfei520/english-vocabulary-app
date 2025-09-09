import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Tag, Calendar, Badge, Modal, List, Avatar, message, Statistic, Row, Col } from 'antd';
import { CalendarOutlined, ClockCircleOutlined, CheckCircleOutlined, BookOutlined, TrophyOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { learningService, vocabularyService } from '../services/api';
import { Vocabulary, LearningProgress } from '../types';

interface ReviewSchedule {
  date: string;
  words: Vocabulary[];
  count: number;
}

const MemoryPage: React.FC = () => {
  const [reviewWords, setReviewWords] = useState<Vocabulary[]>([]);
  const [learningProgress, setLearningProgress] = useState<LearningProgress[]>([]);
  const [reviewSchedule, setReviewSchedule] = useState<ReviewSchedule[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [stats, setStats] = useState({
    totalWords: 0,
    masteredWords: 0,
    learningWords: 0,
    reviewWords: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMemoryData();
  }, []);

  const loadMemoryData = async () => {
    try {
      const [reviewData, progressData] = await Promise.all([
        learningService.getWordsForReview(),
        learningService.getProgress(),
      ]);
      
      setReviewWords(reviewData);
      setLearningProgress(progressData);
      
      // Calculate stats
      const totalWords = progressData.length;
      const masteredWords = progressData.filter(p => p.masteryLevel >= 0.8).length;
      const learningWords = progressData.filter(p => p.masteryLevel > 0 && p.masteryLevel < 0.8).length;
      const reviewWordsCount = reviewData.length;
      
      setStats({
        totalWords,
        masteredWords,
        learningWords,
        reviewWords: reviewWordsCount,
      });
      
      // Generate review schedule for next 30 days
      generateReviewSchedule(progressData);
    } catch (error) {
      console.error('Failed to load memory data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateReviewSchedule = (progress: LearningProgress[]) => {
    const schedule: ReviewSchedule[] = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() + i);
      const dateStr = date.toISOString().split('T')[0];
      
      const wordsForDate = progress.filter(p => {
        const reviewDate = new Date(p.nextReview);
        return reviewDate.toISOString().split('T')[0] === dateStr;
      });
      
      if (wordsForDate.length > 0) {
        schedule.push({
          date: dateStr,
          words: wordsForDate.map(w => ({
            id: w.vocabularyId,
            word: 'Word ' + w.vocabularyId, // Mock word data
            pronunciation: '',
            definition: '',
            translation: '',
            difficulty: 'medium',
            category: 'general',
            examples: [],
          })),
          count: wordsForDate.length,
        });
      }
    }
    
    setReviewSchedule(schedule);
  };

  const markAsReviewed = async (vocabularyId: string, isCorrect: boolean) => {
    try {
      await learningService.markWordStudied(vocabularyId, isCorrect);
      
      if (isCorrect) {
        message.success('复习正确！掌握度提升');
      } else {
        message.info('需要继续复习这个单词');
      }
      
      // Reload data
      loadMemoryData();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const getMasteryColor = (masteryLevel: number) => {
    if (masteryLevel >= 0.8) return '#52c41a';
    if (masteryLevel >= 0.5) return '#fa8c16';
    if (masteryLevel >= 0.2) return '#1890ff';
    return '#f5222d';
  };

  const getMasteryText = (masteryLevel: number) => {
    if (masteryLevel >= 0.8) return '已掌握';
    if (masteryLevel >= 0.5) return '熟悉';
    if (masteryLevel >= 0.2) return '学习中';
    return '新单词';
  };

  const dateCellRender = (date: any) => {
    const dateStr = date.toISOString().split('T')[0];
    const schedule = reviewSchedule.find(s => s.date === dateStr);
    
    if (schedule) {
      return (
        <div style={{ textAlign: 'center' }}>
          <Badge count={schedule.count} style={{ backgroundColor: '#f5222d' }} />
        </div>
      );
    }
    
    return null;
  };

  const onSelectDate = (date: any) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
  };

  const getWordsForSelectedDate = () => {
    if (!selectedDate) return [];
    const schedule = reviewSchedule.find(s => s.date === selectedDate);
    return schedule ? schedule.words : [];
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <div>加载中...</div>
      </div>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="总词汇量"
              value={stats.totalWords}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="已掌握"
              value={stats.masteredWords}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="学习中"
              value={stats.learningWords}
              prefix={<BookOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="待复习"
              value={stats.reviewWords}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f5222d' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={12}>
          <Card title="今日复习" loading={loading}>
            {reviewWords.length > 0 ? (
              <List
                dataSource={reviewWords}
                renderItem={(word) => {
                  const progress = learningProgress.find(p => p.vocabularyId === word.id);
                  return (
                    <List.Item
                      actions={[
                        <Button 
                          type="primary" 
                          size="small"
                          onClick={() => markAsReviewed(word.id, true)}
                        >
                          认识
                        </Button>,
                        <Button 
                          size="small"
                          onClick={() => markAsReviewed(word.id, false)}
                        >
                          不认识
                        </Button>,
                      ]}
                    >
                      <List.Item.Meta
                        avatar={<Avatar>{word.word.charAt(0).toUpperCase()}</Avatar>}
                        title={word.word}
                        description={
                          <div>
                            <div>{word.translation}</div>
                            {progress && (
                              <div style={{ marginTop: 4 }}>
                                <Tag color={getMasteryColor(progress.masteryLevel)}>
                                  {getMasteryText(progress.masteryLevel)}
                                </Tag>
                                <Progress 
                                  percent={Math.round(progress.masteryLevel * 100)} 
                                  size="small" 
                                  style={{ width: 100, marginLeft: 8 }}
                                />
                              </div>
                            )}
                          </div>
                        }
                      />
                    </List.Item>
                  );
                }}
              />
            ) : (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a' }} />
                <p style={{ marginTop: 16, color: '#666' }}>今日没有需要复习的单词</p>
                <Button type="primary" onClick={() => window.location.href = '/learn'}>
                  开始学习新单词
                </Button>
              </div>
            )}
          </Card>
        </Col>
        
        <Col xs={24} lg={12}>
          <Card title="复习日历">
            <Calendar 
              fullscreen={false} 
              dateCellRender={dateCellRender}
              onSelect={onSelectDate}
            />
            {selectedDate && (
              <div style={{ marginTop: 16 }}>
                <h4>{selectedDate} 复习计划</h4>
                {getWordsForSelectedDate().length > 0 ? (
                  <List
                    dataSource={getWordsForSelectedDate()}
                    renderItem={(word) => (
                      <List.Item>
                        <List.Item.Meta
                          avatar={<Avatar>{word.word.charAt(0).toUpperCase()}</Avatar>}
                          title={word.word}
                          description={word.translation}
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <p style={{ color: '#666' }}>该日没有复习计划</p>
                )}
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card title="记忆曲线说明">
            <Row gutter={16}>
              <Col xs={24} md={8}>
                <Card size="small" title="艾宾浩斯遗忘曲线">
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p>德国心理学家艾宾浩斯研究发现：</p>
                    <ul>
                      <li>20分钟后遗忘42%</li>
                      <li>1小时后遗忘56%</li>
                      <li>1天后遗忘74%</li>
                      <li>1周后遗忘77%</li>
                      <li>1个月后遗忘79%</li>
                    </ul>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="最佳复习时间">
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p>根据遗忘曲线，最佳复习时间为：</p>
                    <ul>
                      <li>学习后20分钟</li>
                      <li>1小时后</li>
                      <li>1天后</li>
                      <li>3天后</li>
                      <li>7天后</li>
                      <li>15天后</li>
                      <li>30天后</li>
                    </ul>
                  </div>
                </Card>
              </Col>
              <Col xs={24} md={8}>
                <Card size="small" title="记忆技巧">
                  <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
                    <p>提高记忆效果的方法：</p>
                    <ul>
                      <li>间隔重复复习</li>
                      <li>多感官学习</li>
                      <li>联想记忆法</li>
                      <li>语境记忆</li>
                      <li>主动回忆</li>
                    </ul>
                  </div>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default MemoryPage;