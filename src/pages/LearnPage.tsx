import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Tag, Input, Spin, message, Row, Col } from 'antd';
import { SoundOutlined, HeartOutlined, BookOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { vocabularyService, learningService } from '../services/api';
import { Vocabulary } from '../types';

const LearnPage: React.FC = () => {
  const [currentWord, setCurrentWord] = useState<Vocabulary | null>(null);
  const [loading, setLoading] = useState(true);
  const [showExample, setShowExample] = useState(false);
  const [userAnswer, setUserAnswer] = useState('');
  const [testMode, setTestMode] = useState(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    correct: 0,
    streak: 0,
  });

  useEffect(() => {
    loadNextWord();
  }, []);

  const loadNextWord = async () => {
    setLoading(true);
    try {
      const words = await vocabularyService.getRandomWords(1);
      setCurrentWord(words[0]);
      setShowExample(false);
      setUserAnswer('');
      setIsCorrect(null);
    } catch (error) {
      message.error('加载单词失败');
    } finally {
      setLoading(false);
    }
  };

  const playPronunciation = () => {
    if (currentWord?.audioUrl) {
      const audio = new Audio(currentWord.audioUrl);
      audio.play();
    } else {
      const utterance = new SpeechSynthesisUtterance(currentWord?.word);
      utterance.lang = 'en-US';
      speechSynthesis.speak(utterance);
    }
  };

  const checkAnswer = () => {
    if (!currentWord || !userAnswer) return;

    const correct = userAnswer.toLowerCase().trim() === currentWord.word.toLowerCase();
    setIsCorrect(correct);

    if (correct) {
      setStats(prev => ({
        ...prev,
        correct: prev.correct + 1,
        streak: prev.streak + 1,
        total: prev.total + 1,
      }));
      message.success('正确！');
    } else {
      setStats(prev => ({
        ...prev,
        streak: 0,
        total: prev.total + 1,
      }));
      message.error(`不正确，正确答案是：${currentWord.word}`);
    }

    setTimeout(() => {
      loadNextWord();
    }, 1500);
  };

  const markAsKnown = async () => {
    if (!currentWord) return;

    try {
      await learningService.markWordStudied(currentWord.id, true);
      message.success('标记为已掌握');
      loadNextWord();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const markAsUnknown = async () => {
    if (!currentWord) return;

    try {
      await learningService.markWordStudied(currentWord.id, false);
      message.info('需要更多练习');
      loadNextWord();
    } catch (error) {
      message.error('操作失败');
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (!currentWord) {
    return (
      <Card>
        <div style={{ textAlign: 'center' }}>
          <h3>没有找到单词</h3>
          <Button onClick={loadNextWord}>重试</Button>
        </div>
      </Card>
    );
  }

  return (
    <div>
      <Row gutter={[16, 16]}>
        <Col span={24}>
          <Card>
            <Row gutter={16} align="middle">
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Progress
                    type="circle"
                    percent={Math.round((stats.correct / stats.total) * 100) || 0}
                    format={() => `${stats.correct}/${stats.total}`}
                    size={80}
                  />
                  <p style={{ marginTop: 8 }}>正确率</p>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f5222d' }}>
                    {stats.streak}
                  </div>
                  <p>连续答对</p>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Button
                    type={testMode ? 'primary' : 'default'}
                    onClick={() => setTestMode(!testMode)}
                  >
                    {testMode ? '退出测试' : '开始测试'}
                  </Button>
                </div>
              </Col>
              <Col span={6}>
                <div style={{ textAlign: 'center' }}>
                  <Button onClick={loadNextWord}>下一个单词</Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col xs={24} lg={16}>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              {testMode ? (
                <div style={{ textAlign: 'center' }}>
                  <h2>{currentWord.translation}</h2>
                  <p style={{ color: '#666', marginBottom: 24 }}>
                    请输入对应的英文单词
                  </p>
                  <Input
                    placeholder="输入英文单词"
                    size="large"
                    value={userAnswer}
                    onChange={(e) => setUserAnswer(e.target.value)}
                    onPressEnter={checkAnswer}
                    style={{ marginBottom: 16 }}
                  />
                  <Button
                    type="primary"
                    size="large"
                    onClick={checkAnswer}
                    disabled={!userAnswer}
                  >
                    提交答案
                  </Button>
                  {isCorrect !== null && (
                    <div style={{ marginTop: 16 }}>
                      {isCorrect ? (
                        <Tag color="success">正确！</Tag>
                      ) : (
                        <Tag color="error">错误</Tag>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div style={{ textAlign: 'center' }}>
                  <motion.h1
                    style={{ fontSize: '48px', margin: '24px 0' }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    {currentWord.word}
                  </motion.h1>

                  <div style={{ margin: '16px 0' }}>
                    <Button
                      icon={<SoundOutlined />}
                      onClick={playPronunciation}
                      size="large"
                      style={{ marginRight: 8 }}
                    >
                      发音
                    </Button>
                    <Tag color={currentWord.difficulty === 'easy' ? 'green' : currentWord.difficulty === 'medium' ? 'orange' : 'red'}>
                      {currentWord.difficulty}
                    </Tag>
                  </div>

                  <div style={{ fontSize: '18px', color: '#666', margin: '16px 0' }}>
                    {currentWord.pronunciation}
                  </div>

                  <div style={{ fontSize: '24px', margin: '24px 0', color: '#1890ff' }}>
                    {currentWord.translation}
                  </div>

                  <div style={{ fontSize: '16px', color: '#666', margin: '16px 0' }}>
                    {currentWord.definition}
                  </div>

                  {showExample && currentWord.examples && currentWord.examples.length > 0 && (
                    <div style={{ textAlign: 'left', margin: '24px 0', padding: '16px', background: '#f8f9fa', borderRadius: '8px' }}>
                      <h4>例句：</h4>
                      {currentWord.examples.map((example, index) => (
                        <div key={index} style={{ marginBottom: '8px' }}>
                          <p style={{ margin: 0 }}>• {example.sentence}</p>
                          <p style={{ margin: 0, color: '#666' }}>{example.translation}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  <div style={{ marginTop: 24 }}>
                    <Button
                      onClick={() => setShowExample(!showExample)}
                      style={{ marginRight: 8 }}
                    >
                      {showExample ? '隐藏例句' : '显示例句'}
                    </Button>
                    <Button
                      type="primary"
                      icon={<HeartOutlined />}
                      onClick={markAsKnown}
                      style={{ marginRight: 8 }}
                    >
                      认识
                    </Button>
                    <Button
                      icon={<BookOutlined />}
                      onClick={markAsUnknown}
                    >
                      不认识
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </motion.div>
        </Col>

        <Col xs={24} lg={8}>
          <Card title="学习提示" size="small">
            <div style={{ fontSize: '14px', lineHeight: '1.6' }}>
              <p><strong>学习技巧：</strong></p>
              <ul>
                <li>先看中文，回忆英文</li>
                <li>点击发音按钮跟读</li>
                <li>查看例句加深理解</li>
                <li>使用测试模式检验记忆</li>
              </ul>

              <p style={{ marginTop: '16px' }}><strong>记忆方法：</strong></p>
              <ul>
                <li>联想记忆法</li>
                <li>词根词缀法</li>
                <li>语境记忆法</li>
                <li>重复记忆法</li>
              </ul>
            </div>
          </Card>

          <Card title="今日进度" size="small" style={{ marginTop: 16 }}>
            <Progress percent={65} status="active" />
            <div style={{ marginTop: 8, fontSize: '14px', color: '#666' }}>
              今日目标：20个单词（已完成13个）
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default LearnPage;