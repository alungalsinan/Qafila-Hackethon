import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { BookOpen, Plus, Calendar, CircleCheck as CheckCircle, Circle, Star, Clock, Filter, MoveVertical as MoreVertical, CreditCard as Edit3, Trash2, Bell, Repeat, Tag, List } from 'lucide-react-native';
import { Task, TaskList, Prayer } from '@/types/planner';

const taskLists: TaskList[] = [
  { id: '1', name: 'Daily Prayers', color: '#059669', icon: 'prayer', taskCount: 5, completedCount: 3 },
  { id: '2', name: 'Quran Study', color: '#3B82F6', icon: 'book', taskCount: 3, completedCount: 1 },
  { id: '3', name: 'Islamic Learning', color: '#F59E0B', icon: 'star', taskCount: 4, completedCount: 2 },
  { id: '4', name: 'Personal Tasks', color: '#8B5CF6', icon: 'user', taskCount: 6, completedCount: 4 },
];

const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  urgent: '#DC2626',
};

export default function PlannerScreen() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Read Surah Al-Kahf',
      description: 'Friday weekly reading',
      completed: false,
      priority: 'high',
      category: 'quran',
      dueDate: new Date(),
      createdAt: new Date(),
      isRecurring: true,
      recurringType: 'weekly',
      tags: ['friday', 'sunnah'],
    },
    {
      id: '2',
      title: 'Morning Dhikr',
      description: 'SubhanAllah 33x, Alhamdulillah 33x, Allahu Akbar 34x',
      completed: true,
      priority: 'medium',
      category: 'dhikr',
      createdAt: new Date(),
      completedAt: new Date(),
      isRecurring: true,
      recurringType: 'daily',
    },
    {
      id: '3',
      title: 'Study Islamic Finance',
      description: 'Complete chapter on Riba and Halal investments',
      completed: false,
      priority: 'medium',
      category: 'learning',
      dueDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      createdAt: new Date(),
    },
  ]);

  const [prayers] = useState<Prayer[]>([
    { id: '1', name: 'Fajr', arabicName: 'الفجر', time: '5:30 AM', completed: true },
    { id: '2', name: 'Dhuhr', arabicName: 'الظهر', time: '12:30 PM', completed: true },
    { id: '3', name: 'Asr', arabicName: 'العصر', time: '3:45 PM', completed: true },
    { id: '4', name: 'Maghrib', arabicName: 'المغرب', time: '6:15 PM', completed: false, isCurrentPrayer: true },
    { id: '5', name: 'Isha', arabicName: 'العشاء', time: '8:00 PM', completed: false },
  ]);

  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<'low' | 'medium' | 'high' | 'urgent'>('medium');
  const [selectedCategory, setSelectedCategory] = useState<'prayer' | 'quran' | 'dhikr' | 'charity' | 'learning' | 'personal'>('personal');
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const toggleTask = (taskId: string) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === taskId
          ? { 
              ...task, 
              completed: !task.completed,
              completedAt: !task.completed ? new Date() : undefined
            }
          : task
      )
    );
  };

  const addTask = () => {
    if (newTaskTitle.trim() === '') {
      Alert.alert('Error', 'Please enter a task title');
      return;
    }

    const newTask: Task = {
      id: Date.now().toString(),
      title: newTaskTitle.trim(),
      description: newTaskDescription.trim(),
      completed: false,
      priority: selectedPriority,
      category: selectedCategory,
      createdAt: new Date(),
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setShowAddTask(false);
  };

  const deleteTask = (taskId: string) => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => setTasks(prev => prev.filter(task => task.id !== taskId))
        },
      ]
    );
  };

  const filteredTasks = filterCategory === 'all' 
    ? tasks 
    : tasks.filter(task => task.category === filterCategory);

  const completedTasksCount = tasks.filter(task => task.completed).length;
  const totalTasksCount = tasks.length;
  const completedPrayersCount = prayers.filter(prayer => prayer.completed).length;

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.headerTitle}>Islamic Planner</Text>
              <Text style={styles.headerSubtitle}>
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </Text>
            </View>
            <TouchableOpacity style={styles.addButton} onPress={() => setShowAddTask(true)}>
              <Plus size={24} color="#FFFFFF" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.content}>
          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <Text style={styles.sectionTitle}>Today's Progress</Text>
            <View style={styles.progressCards}>
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <BookOpen size={20} color="#059669" />
                  <Text style={styles.progressTitle}>Prayers</Text>
                </View>
                <Text style={styles.progressNumber}>{completedPrayersCount}/5</Text>
                <Text style={styles.progressLabel}>Completed</Text>
              </View>
              <View style={styles.progressCard}>
                <View style={styles.progressHeader}>
                  <CheckCircle size={20} color="#3B82F6" />
                  <Text style={styles.progressTitle}>Tasks</Text>
                </View>
                <Text style={styles.progressNumber}>{completedTasksCount}/{totalTasksCount}</Text>
                <Text style={styles.progressLabel}>Completed</Text>
              </View>
            </View>
          </View>

          {/* Quick Prayer Status */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Prayer Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.prayerScroll}>
              {prayers.map((prayer) => (
                <View key={prayer.id} style={[
                  styles.prayerCard,
                  prayer.isCurrentPrayer && styles.currentPrayerCard
                ]}>
                  <Text style={styles.prayerName}>{prayer.name}</Text>
                  <Text style={styles.prayerArabic}>{prayer.arabicName}</Text>
                  <Text style={styles.prayerTime}>{prayer.time}</Text>
                  <View style={styles.prayerStatus}>
                    {prayer.completed ? (
                      <CheckCircle size={20} color="#059669" />
                    ) : (
                      <Circle size={20} color="#9CA3AF" />
                    )}
                  </View>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Task Lists Overview */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Task Lists</Text>
            <View style={styles.taskListsGrid}>
              {taskLists.map((list) => (
                <TouchableOpacity key={list.id} style={[styles.taskListCard, { borderLeftColor: list.color }]}>
                  <View style={styles.taskListHeader}>
                    <Text style={styles.taskListName}>{list.name}</Text>
                    <Text style={styles.taskListCount}>{list.completedCount}/{list.taskCount}</Text>
                  </View>
                  <View style={styles.taskListProgress}>
                    <View style={[styles.progressBar, { backgroundColor: `${list.color}20` }]}>
                      <View 
                        style={[
                          styles.progressFill, 
                          { 
                            backgroundColor: list.color,
                            width: `${(list.completedCount / list.taskCount) * 100}%`
                          }
                        ]} 
                      />
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Filter Tabs */}
          <View style={styles.filterSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.filterTabs}>
                {['all', 'prayer', 'quran', 'dhikr', 'learning', 'personal'].map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.filterTab,
                      filterCategory === category && styles.activeFilterTab
                    ]}
                    onPress={() => setFilterCategory(category)}
                  >
                    <Text style={[
                      styles.filterTabText,
                      filterCategory === category && styles.activeFilterTabText
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>

          {/* Tasks List */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Tasks</Text>
              <TouchableOpacity>
                <Filter size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            {filteredTasks.length === 0 ? (
              <View style={styles.emptyState}>
                <List size={48} color="#9CA3AF" />
                <Text style={styles.emptyStateText}>No tasks found</Text>
                <Text style={styles.emptyStateSubtext}>
                  {filterCategory === 'all' 
                    ? 'Add your first task to get started' 
                    : `No ${filterCategory} tasks yet`}
                </Text>
              </View>
            ) : (
              filteredTasks.map((task) => (
                <View key={task.id} style={styles.taskCard}>
                  <TouchableOpacity 
                    style={styles.taskContent}
                    onPress={() => toggleTask(task.id)}
                  >
                    <View style={styles.taskLeft}>
                      <View style={styles.taskCheckbox}>
                        {task.completed ? (
                          <CheckCircle size={24} color="#059669" />
                        ) : (
                          <Circle size={24} color="#9CA3AF" />
                        )}
                      </View>
                      <View style={styles.taskInfo}>
                        <Text style={[
                          styles.taskTitle,
                          task.completed && styles.completedTaskTitle
                        ]}>
                          {task.title}
                        </Text>
                        {task.description && (
                          <Text style={styles.taskDescription}>{task.description}</Text>
                        )}
                        <View style={styles.taskMeta}>
                          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[task.priority] }]}>
                            <Text style={styles.priorityText}>{task.priority}</Text>
                          </View>
                          <Text style={styles.categoryText}>{task.category}</Text>
                          {task.dueDate && (
                            <View style={styles.dueDateContainer}>
                              <Clock size={12} color="#6B7280" />
                              <Text style={styles.dueDateText}>{formatDate(task.dueDate)}</Text>
                            </View>
                          )}
                          {task.isRecurring && (
                            <Repeat size={12} color="#6B7280" />
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.taskActions}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Trash2 size={16} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Islamic Quote */}
          <View style={styles.quoteCard}>
            <Text style={styles.quoteText}>
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
            </Text>
            <Text style={styles.quoteReference}>- Quran 65:3</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddTask}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <SafeAreaView style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <TouchableOpacity onPress={() => setShowAddTask(false)}>
              <Text style={styles.modalCancel}>Cancel</Text>
            </TouchableOpacity>
            <Text style={styles.modalTitle}>New Task</Text>
            <TouchableOpacity onPress={addTask}>
              <Text style={styles.modalSave}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Title</Text>
              <TextInput
                style={styles.textInput}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="Enter task title"
                placeholderTextColor="#9CA3AF"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea]}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Enter task description (optional)"
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Priority</Text>
              <View style={styles.prioritySelector}>
                {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      selectedPriority === priority && styles.selectedPriorityOption,
                      { borderColor: priorityColors[priority] }
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      selectedPriority === priority && { color: priorityColors[priority] }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <View style={styles.categorySelector}>
                {(['prayer', 'quran', 'dhikr', 'charity', 'learning', 'personal'] as const).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      selectedCategory === category && styles.selectedCategoryOption
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Text style={[
                      styles.categoryOptionText,
                      selectedCategory === category && styles.selectedCategoryOptionText
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </ScrollView>
        </SafeAreaView>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    backgroundColor: '#059669',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#DCFCE7',
    marginTop: 4,
  },
  addButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 12,
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    padding: 20,
  },
  progressSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  progressHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
    marginLeft: 8,
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#374151',
  },
  progressLabel: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  prayerScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  prayerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentPrayerCard: {
    borderColor: '#059669',
    backgroundColor: '#F0FDF4',
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
  },
  prayerArabic: {
    fontSize: 16,
    color: '#059669',
    marginVertical: 4,
  },
  prayerTime: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  prayerStatus: {
    alignItems: 'center',
  },
  taskListsGrid: {
    gap: 12,
  },
  taskListCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskListHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  taskListName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  taskListCount: {
    fontSize: 14,
    color: '#6B7280',
  },
  taskListProgress: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
  },
  filterSection: {
    marginBottom: 16,
  },
  filterTabs: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 4,
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  activeFilterTab: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeFilterTabText: {
    color: '#FFFFFF',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
    textAlign: 'center',
  },
  taskCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  taskContent: {
    flex: 1,
    padding: 16,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  taskCheckbox: {
    marginRight: 12,
    marginTop: 2,
  },
  taskInfo: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 4,
  },
  completedTaskTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  taskDescription: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 8,
    lineHeight: 20,
  },
  taskMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  priorityText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
    textTransform: 'uppercase',
  },
  categoryText: {
    fontSize: 12,
    color: '#6B7280',
    textTransform: 'capitalize',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
    color: '#6B7280',
  },
  taskActions: {
    padding: 16,
  },
  quoteCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#F59E0B',
    marginTop: 16,
  },
  quoteText: {
    fontSize: 16,
    color: '#92400E',
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
  },
  quoteReference: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  modalCancel: {
    fontSize: 16,
    color: '#6B7280',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
    color: '#059669',
  },
  modalContent: {
    flex: 1,
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#374151',
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  prioritySelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  priorityOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
  },
  selectedPriorityOption: {
    backgroundColor: '#F9FAFB',
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryOption: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  selectedCategoryOption: {
    backgroundColor: '#059669',
    borderColor: '#059669',
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedCategoryOptionText: {
    color: '#FFFFFF',
  },
});