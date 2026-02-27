import React, { useState, useEffect } from 'react';
import { Card, Button, Form, Input, DatePicker, Progress, List, Modal, Tag, Statistic, Row, Col, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, CalendarOutlined, TrophyOutlined, BookOutlined, AimOutlined } from '@ant-design/icons';
import { studyPlanService } from '../services/api';
import { StudyPlan } from '../types';
import moment from 'moment';

const StudyPlanPage: React.FC = () => {
  const [plans, setPlans] = useState<StudyPlan[]>([]);
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [editingPlan, setEditingPlan] = useState<StudyPlan | null>(null);
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      const plansData = await studyPlanService.getPlans();
      setPlans(plansData);
    } catch (error) {
      console.error('Failed to load study plans:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePlan = async (values: any) => {
    try {
      const planData = {
        ...values,
        startDate: values.startDate.toDate(),
        endDate: values.endDate.toDate(),
        completedWords: 0,
        isActive: true,
      };

      if (editingPlan) {
        await studyPlanService.updatePlan(editingPlan.id, planData);
        message.success('学习计划更新成功！');
      } else {
        await studyPlanService.createPlan(planData);
        message.success('学习计划创建成功！');
      }

      setCreateModalVisible(false);
      setEditingPlan(null);
      form.resetFields();
      loadPlans();
    } catch (error) {
      message.error('操作失败');
    }
  };

  const handleDeletePlan = async (planId: string) => {
    try {
      await studyPlanService.deletePlan(planId);
      message.success('学习计划删除成功！');
      loadPlans();
    } catch (error) {
      message.error('删除失败');
    }
  };

  const handleEditPlan = (plan: StudyPlan) => {
    setEditingPlan(plan);
    form.setFieldsValue({
      ...plan,
      startDate: moment(plan.startDate),
      endDate: moment(plan.endDate),
    });
    setCreateModalVisible(true);
  };

  const getDaysRemaining = (endDate: Date) => {
    const today = new Date();
    const end = new Date(endDate);
    const diffTime = end.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getProgressPercentage = (plan: StudyPlan) => {
    return Math.round((plan.completedWords / plan.targetWords) * 100);
  };

  const getStatusColor = (plan: StudyPlan) => {
    const progress = getProgressPercentage(plan);
    const daysRemaining = getDaysRemaining(plan.endDate);

    if (progress >= 100) return '#52c41a';
    if (daysRemaining < 0) return '#f5222d';
    if (progress >= 80) return '#52c41a';
    if (progress >= 50) return '#fa8c16';
    return '#1890ff';
  };

  const getStatusText = (plan: StudyPlan) => {
    const progress = getProgressPercentage(plan);
    const daysRemaining = getDaysRemaining(plan.endDate);

    if (progress >= 100) return '已完成';
    if (daysRemaining < 0) return '已过期';
    if (progress >= 80) return '即将完成';
    if (progress >= 50) return '进行中';
    return '开始阶段';
  };

  const stats = {
    totalPlans: plans.length,
    activePlans: plans.filter(p => p.isActive).length,
    completedPlans: plans.filter(p => getProgressPercentage(p) >= 100).length,
    totalTargetWords: plans.reduce((sum, p) => sum + p.targetWords, 0),
    completedWords: plans.reduce((sum, p) => sum + p.completedWords, 0),
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
              title="总计划数"
              value={stats.totalPlans}
              prefix={<AimOutlined />}
              valueStyle={{ color: '#1890ff' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="进行中"
              value={stats.activePlans}
              prefix={<CalendarOutlined />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="已完成"
              value={stats.completedPlans}
              prefix={<TrophyOutlined />}
              valueStyle={{ color: '#fa8c16' }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={6}>
          <Card>
            <Statistic
              title="完成率"
              value={stats.totalTargetWords > 0 ? Math.round((stats.completedWords / stats.totalTargetWords) * 100) : 0}
              suffix="%"
              prefix={<BookOutlined />}
              valueStyle={{ color: '#722ed1' }}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="学习计划"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => setCreateModalVisible(true)}
          >
            创建计划
          </Button>
        }
        style={{ marginTop: 16 }}
      >
        {plans.length > 0 ? (
          <List
            dataSource={plans}
            renderItem={(plan) => {
              const progress = getProgressPercentage(plan);
              const daysRemaining = getDaysRemaining(plan.endDate);

              return (
                <List.Item
                  actions={[
                    <Button
                      icon={<EditOutlined />}
                      onClick={() => handleEditPlan(plan)}
                    >
                      编辑
                    </Button>,
                    <Button
                      danger
                      icon={<DeleteOutlined />}
                      onClick={() => handleDeletePlan(plan.id)}
                    >
                      删除
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    title={
                      <div>
                        {plan.name}
                        <Tag color={getStatusColor(plan)} style={{ marginLeft: 8 }}>
                          {getStatusText(plan)}
                        </Tag>
                        {plan.isActive && <Tag color="green">活跃</Tag>}
                      </div>
                    }
                    description={
                      <div>
                        <div style={{ marginBottom: 8 }}>
                          目标：{plan.targetWords} 个单词 | 每日：{plan.dailyGoal} 个
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          时间：{moment(plan.startDate).format('YYYY-MM-DD')} 至 {moment(plan.endDate).format('YYYY-MM-DD')}
                        </div>
                        <div style={{ marginBottom: 8 }}>
                          <Progress
                            percent={progress}
                            strokeColor={getStatusColor(plan)}
                            format={() => `${plan.completedWords}/${plan.targetWords}`}
                          />
                        </div>
                        <div style={{ fontSize: '12px', color: '#666' }}>
                          剩余天数：{daysRemaining > 0 ? daysRemaining : '已过期'} 天
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              );
            }}
          />
        ) : (
          <div style={{ textAlign: 'center', padding: '40px 0' }}>
            <CalendarOutlined style={{ fontSize: '48px', color: '#1890ff' }} />
            <p style={{ marginTop: 16, color: '#666' }}>还没有学习计划</p>
            <Button type="primary" onClick={() => setCreateModalVisible(true)}>
              创建第一个学习计划
            </Button>
          </div>
        )}
      </Card>

      <Modal
        title={editingPlan ? '编辑学习计划' : '创建学习计划'}
        visible={createModalVisible}
        onCancel={() => {
          setCreateModalVisible(false);
          setEditingPlan(null);
          form.resetFields();
        }}
        footer={null}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleCreatePlan}
        >
          <Form.Item
            name="name"
            label="计划名称"
            rules={[{ required: true, message: '请输入计划名称' }]}
          >
            <Input placeholder="例如：高考英语词汇冲刺" />
          </Form.Item>

          <Form.Item
            name="targetWords"
            label="目标单词数"
            rules={[{ required: true, message: '请输入目标单词数' }]}
          >
            <Input type="number" placeholder="例如：1000" />
          </Form.Item>

          <Form.Item
            name="dailyGoal"
            label="每日目标"
            rules={[{ required: true, message: '请输入每日目标' }]}
          >
            <Input type="number" placeholder="例如：20" />
          </Form.Item>

          <Form.Item
            name="startDate"
            label="开始日期"
            rules={[{ required: true, message: '请选择开始日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item
            name="endDate"
            label="结束日期"
            rules={[{ required: true, message: '请选择结束日期' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" block>
              {editingPlan ? '更新计划' : '创建计划'}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default StudyPlanPage;