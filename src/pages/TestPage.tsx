import React, { useState, useEffect } from 'react';
import { Card, Button, Progress, Radio, Input, message, Modal, Result, Statistic, Row, Col, List } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, TrophyOutlined, FieldTimeOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { testService, vocabularyService } from '../services/api';
import { TestQuestion, TestResult } from '../types';

const TestPage: React.FC = () => {
  const [testMode, setTestMode] = useState<'beginner' | 'intermediate' | 'advanced'>('beginner');
  const [questions, setQuestions] = useState<TestQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState<{ [key: string]: string }>({});
  const [testStarted, setTestStarted] = useState(false);
  const [testCompleted, setTestCompleted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timer, setTimer] = useState<NodeJS.Timeout | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [timer]);

  const startTest = async () => {
    setLoading(true);
    try {
      const questionCount = testMode === 'beginner' ? 10 : testMode === 'intermediate' ? 15 : 20;
      const generatedQuestions = await testService.generateTest({
        difficulty: testMode,
        questionCount,
        questionTypes: ['multiple-choice', 'fill-blank', 'translation'],
      });
      
      setQuestions(generatedQuestions);
      setCurrentQuestion(0);
      setUserAnswers({});
      setTestStarted(true);
      setTestCompleted(false);
      setTimeSpent(0);
      
      // Start timer
      const interval = setInterval(() => {
        setTimeSpent(prev => prev + 1);
      }, 1000);
      setTimer(interval);
      
      message.success('测试开始！');
    } catch (error) {
      message.error('生成测试失败');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerChange = (questionId: string, answer: string) => {
    setUserAnswers(prev => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      finishTest();
    }
  };

  const previousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const finishTest = async () => {
    if (timer) {
      clearInterval(timer);
      setTimer(null);
    }

    setLoading(true);
    try {
      // Calculate score
      let correctCount = 0;
      const answers = Object.entries(userAnswers).map(([questionId, userAnswer]) => {
        const question = questions.find(q => q.id === questionId);
        const isCorrect = question?.correctAnswer.toLowerCase() === userAnswer.toLowerCase();
        if (isCorrect) correctCount++;
        
        return {
          questionId,
          userAnswer,
          isCorrect,
          timeSpent: 0, // Mock time per question
        };
      });

      const score = Math.round((correctCount / questions.length) * 100);
      
      const result: TestResult = {
        id: Date.now().toString(),
        userId: 'current',
        testId: 'generated',
        score,
        totalQuestions: questions.length,
        correctAnswers: correctCount,
        timeSpent,
        completedAt: new Date(),
        answers,
      };

      setTestResult(result);
      setTestCompleted(true);
      
      // Show result message
      if (score >= 80) {
        message.success('太棒了！你的表现非常出色！');
      } else if (score >= 60) {
        message.info('做得不错！继续努力！');
      } else {
        message.warning('需要更多练习，加油！');
      }
    } catch (error) {
      message.error('提交测试失败');
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return '#52c41a';
    if (score >= 60) return '#fa8c16';
    return '#f5222d';
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderQuestion = (question: TestQuestion) => {
    const userAnswer = userAnswers[question.id] || '';

    switch (question.type) {
      case 'multiple-choice':
        return (
          <div>
            <h3>{question.question}</h3>
            <Radio.Group
              value={userAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              style={{ width: '100%' }}
            >
              {question.options?.map((option, index) => (
                <Radio key={index} value={option} style={{ display: 'block', margin: '8px 0' }}>
                  {option}
                </Radio>
              ))}
            </Radio.Group>
          </div>
        );

      case 'fill-blank':
        return (
          <div>
            <h3>{question.question}</h3>
            <Input
              placeholder="请输入答案"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              size="large"
            />
          </div>
        );

      case 'translation':
        return (
          <div>
            <h3>{question.question}</h3>
            <Input
              placeholder="请输入翻译"
              value={userAnswer}
              onChange={(e) => handleAnswerChange(question.id, e.target.value)}
              size="large"
            />
          </div>
        );

      default:
        return <div>Unsupported question type</div>;
    }
  };

  if (!testStarted) {
    return (
      <div>
        <Card>
          <h2>智能测试系统</h2>
          <p style={{ color: '#666', marginBottom: 24 }}>
            根据你的水平智能调整题目难度，帮助你有效提升英语能力。
          </p>
          
          <Row gutter={[16, 16]}>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  border: testMode === 'beginner' ? '2px solid #52c41a' : '1px solid #d9d9d9',
                  background: testMode === 'beginner' ? '#f6ffed' : '#fff',
                }}
                onClick={() => setTestMode('beginner')}
              >
                <h3 style={{ color: '#52c41a' }}>入门测试</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  选择题为主，建立信心
                </p>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  10题 • 约15分钟
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  border: testMode === 'intermediate' ? '2px solid #fa8c16' : '1px solid #d9d9d9',
                  background: testMode === 'intermediate' ? '#fff7e6' : '#fff',
                }}
                onClick={() => setTestMode('intermediate')}
              >
                <h3 style={{ color: '#fa8c16' }}>进阶测试</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  填空、翻译混合，适度挑战
                </p>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  15题 • 约25分钟
                </div>
              </Card>
            </Col>
            
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ 
                  textAlign: 'center',
                  border: testMode === 'advanced' ? '2px solid #f5222d' : '1px solid #d9d9d9',
                  background: testMode === 'advanced' ? '#fff1f0' : '#fff',
                }}
                onClick={() => setTestMode('advanced')}
              >
                <h3 style={{ color: '#f5222d' }}>高阶测试</h3>
                <p style={{ color: '#666', fontSize: '14px' }}>
                  语境应用、接近高考难度
                </p>
                <div style={{ fontSize: '12px', color: '#999' }}>
                  20题 • 约35分钟
                </div>
              </Card>
            </Col>
          </Row>
          
          <div style={{ textAlign: 'center', marginTop: 32 }}>
            <Button
              type="primary"
              size="large"
              onClick={startTest}
              loading={loading}
            >
              开始测试
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (testCompleted && testResult) {
    return (
      <div>
        <Result
          status={testResult.score >= 80 ? 'success' : testResult.score >= 60 ? 'info' : 'warning'}
          title={`测试完成！得分：${testResult.score}`}
          subTitle={`答对 ${testResult.correctAnswers} 题，共 ${testResult.totalQuestions} 题`}
          extra={[
            <Button key="dashboard" type="primary" onClick={() => window.location.href = '/'}>
              返回首页
            </Button>,
            <Button key="retry" onClick={() => setTestStarted(false)}>
              重新测试
            </Button>,
          ]}
        />
        
        <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="得分"
                value={testResult.score}
                suffix="分"
                valueStyle={{ color: getScoreColor(testResult.score) }}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="正确率"
                value={Math.round((testResult.correctAnswers / testResult.totalQuestions) * 100)}
                suffix="%"
                valueStyle={{ color: '#1890ff' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="用时"
                value={formatTime(testResult.timeSpent)}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
          <Col xs={24} md={6}>
            <Card>
              <Statistic
                title="等级"
                value={testResult.score >= 80 ? '优秀' : testResult.score >= 60 ? '良好' : '需提升'}
                valueStyle={{ color: getScoreColor(testResult.score) }}
              />
            </Card>
          </Col>
        </Row>
        
        <Card title="答题详情" style={{ marginTop: 16 }}>
          <List
            dataSource={testResult.answers}
            renderItem={(answer, index) => {
              const question = questions.find(q => q.id === answer.questionId);
              return (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      answer.isCorrect ? (
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '20px' }} />
                      ) : (
                        <CloseCircleOutlined style={{ color: '#f5222d', fontSize: '20px' }} />
                      )
                    }
                    title={`第 ${index + 1} 题`}
                    description={
                      <div>
                        <div>{question?.question}</div>
                        <div style={{ color: '#666' }}>
                          你的答案：{answer.userAnswer}
                        </div>
                        {!answer.isCorrect && (
                          <div style={{ color: '#f5222d' }}>
                            正确答案：{question?.correctAnswer}
                          </div>
                        )}
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        </Card>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <Card>
        <div style={{ textAlign: 'center' }}>
          <p>加载题目中...</p>
        </div>
      </Card>
    );
  }

  const currentQ = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div>
      <Card>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h3>{testMode === 'beginner' ? '入门测试' : testMode === 'intermediate' ? '进阶测试' : '高阶测试'}</h3>
            <p style={{ color: '#666', margin: 0 }}>
              第 {currentQuestion + 1} 题，共 {questions.length} 题
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '18px', color: '#1890ff' }}>
              <FieldTimeOutlined /> {formatTime(timeSpent)}
            </div>
            <div style={{ fontSize: '12px', color: '#666' }}>
              用时
            </div>
          </div>
        </div>
        
        <Progress percent={progress} strokeColor="#1890ff" />
      </Card>
      
      <Card style={{ marginTop: 16 }}>
        <motion.div
          key={currentQuestion}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderQuestion(currentQ)}
        </motion.div>
      </Card>
      
      <Card style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            onClick={previousQuestion}
            disabled={currentQuestion === 0}
          >
            上一题
          </Button>
          
          <div style={{ color: '#666', fontSize: '14px' }}>
            已答题：{Object.keys(userAnswers).length} / {questions.length}
          </div>
          
          <Button
            type="primary"
            onClick={currentQuestion === questions.length - 1 ? finishTest : nextQuestion}
            disabled={!userAnswers[currentQ.id]}
          >
            {currentQuestion === questions.length - 1 ? '完成测试' : '下一题'}
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default TestPage;