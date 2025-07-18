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
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Task, TaskList, Prayer } from '@/types/planner';
import { useTheme } from '@/components/ThemeContext';

const taskLists: TaskList[] = [
  { id: '1', name: 'Daily Prayers', color: '#059669', icon: 'moon', taskCount: 5, completedCount: 3 },
  { id: '2', name: 'Quran Study', color: '#3B82F6', icon: 'book', taskCount: 3, completedCount: 1 },
  { id: '3', name: 'Islamic Learning', color: '#F59E0B', icon: 'school', taskCount: 4, completedCount: 2 },
  { id: '4', name: 'Personal Tasks', color: '#8B5CF6', icon: 'person', taskCount: 6, completedCount: 4 },
];

const priorityColors = {
  low: '#10B981',
  medium: '#F59E0B',
  high: '#EF4444',
  urgent: '#DC2626',
};

const categoryIcons = {
  prayer: 'moon',
  quran: 'book',
  dhikr: 'heart',
  charity: 'gift',
  learning: 'school',
  personal: 'person',
};

export default function PlannerScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: '1',
      title: 'Read Surah Al-Kahf',
      description: 'Friday weekly reading - Sunnah practice',
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
  const [isRecurring, setIsRecurring] = useState(false);
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
      isRecurring,
      recurringType: isRecurring ? 'daily' : undefined,
    };

    setTasks(prev => [newTask, ...prev]);
    setNewTaskTitle('');
    setNewTaskDescription('');
    setIsRecurring(false);
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
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={[styles.header, { backgroundColor: colors.primary }]}>
          <View style={styles.headerContent}>
            <View style={styles.headerLeft}>
              <View style={styles.logoContainer}>
                <Ionicons name="compass" size={28} color="#FFFFFF" />
              </View>
              <View>
                <Text style={styles.headerTitle}>Islamic Planner</Text>
                <Text style={styles.headerSubtitle}>
                  {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                </Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
                <Ionicons 
                  name={isDark ? 'sunny' : 'moon'} 
                  size={20} 
                  color="#FFFFFF" 
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.addButton} onPress={() => setShowAddTask(true)}>
                <Ionicons name="add" size={24} color="#FFFFFF" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.content}>
          {/* Progress Overview */}
          <View style={styles.progressSection}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Today's Progress</Text>
            <View style={styles.progressCards}>
              <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                <View style={styles.progressHeader}>
                  <View style={[styles.progressIcon, { backgroundColor: colors.primary + '20' }]}>
                    <Ionicons name="moon" size={20} color={colors.primary} />
                  </View>
                  <Text style={[styles.progressTitle, { color: colors.text }]}>Prayers</Text>
                </View>
                <Text style={[styles.progressNumber, { color: colors.text }]}>{completedPrayersCount}/5</Text>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Completed</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.primary,
                        width: `${(completedPrayersCount / 5) * 100}%`
                      }
                    ]} 
                  />
                </View>
              </View>
              
              <View style={[styles.progressCard, { backgroundColor: colors.card }]}>
                <View style={styles.progressHeader}>
                  <View style={[styles.progressIcon, { backgroundColor: colors.secondary + '20' }]}>
                    <Ionicons name="checkmark-circle" size={20} color={colors.secondary} />
                  </View>
                  <Text style={[styles.progressTitle, { color: colors.text }]}>Tasks</Text>
                </View>
                <Text style={[styles.progressNumber, { color: colors.text }]}>{completedTasksCount}/{totalTasksCount}</Text>
                <Text style={[styles.progressLabel, { color: colors.textSecondary }]}>Completed</Text>
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        backgroundColor: colors.secondary,
                        width: totalTasksCount > 0 ? `${(completedTasksCount / totalTasksCount) * 100}%` : '0%'
                      }
                    ]} 
                  />
                </View>
              </View>
            </View>
          </View>

          {/* Prayer Status */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Prayer Status</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.prayerScroll}>
              {prayers.map((prayer) => (
                <View key={prayer.id} style={[
                  styles.prayerCard,
                  { backgroundColor: colors.card, borderColor: colors.border },
                  prayer.isCurrentPrayer && { borderColor: colors.primary, backgroundColor: colors.primary + '10' }
                ]}>
                  <Text style={[styles.prayerName, { color: colors.text }]}>{prayer.name}</Text>
                  <Text style={[styles.prayerArabic, { color: colors.primary }]}>{prayer.arabicName}</Text>
                  <Text style={[styles.prayerTime, { color: colors.textSecondary }]}>{prayer.time}</Text>
                  <View style={styles.prayerStatus}>
                    <Ionicons 
                      name={prayer.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                      size={24} 
                      color={prayer.completed ? colors.success : colors.textSecondary} 
                    />
                  </View>
                  {prayer.isCurrentPrayer && (
                    <View style={[styles.currentBadge, { backgroundColor: colors.primary }]}>
                      <Text style={styles.currentBadgeText}>Current</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Task Lists Overview */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Task Lists</Text>
            <View style={styles.taskListsGrid}>
              {taskLists.map((list) => (
                <TouchableOpacity 
                  key={list.id} 
                  style={[
                    styles.taskListCard, 
                    { backgroundColor: colors.card, borderLeftColor: list.color }
                  ]}
                >
                  <View style={styles.taskListHeader}>
                    <View style={styles.taskListLeft}>
                      <Ionicons name={list.icon as any} size={20} color={list.color} />
                      <Text style={[styles.taskListName, { color: colors.text }]}>{list.name}</Text>
                    </View>
                    <Text style={[styles.taskListCount, { color: colors.textSecondary }]}>
                      {list.completedCount}/{list.taskCount}
                    </Text>
                  </View>
                  <View style={styles.taskListProgress}>
                    <View style={[styles.progressBarSmall, { backgroundColor: list.color + '20' }]}>
                      <View 
                        style={[
                          styles.progressFillSmall, 
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
                      { backgroundColor: colors.background, borderColor: colors.border },
                      filterCategory === category && { backgroundColor: colors.primary, borderColor: colors.primary }
                    ]}
                    onPress={() => setFilterCategory(category)}
                  >
                    <Text style={[
                      styles.filterTabText,
                      { color: colors.textSecondary },
                      filterCategory === category && { color: '#FFFFFF' }
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
              <Text style={[styles.sectionTitle, { color: colors.text }]}>Tasks</Text>
              <Text style={[styles.taskCounter, { color: colors.textSecondary }]}>
                {filteredTasks.length} {filteredTasks.length === 1 ? 'task' : 'tasks'}
              </Text>
            </View>
            
            {filteredTasks.length === 0 ? (
              <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
                <Ionicons name="clipboard-outline" size={48} color={colors.textSecondary} />
                <Text style={[styles.emptyStateText, { color: colors.text }]}>No tasks found</Text>
                <Text style={[styles.emptyStateSubtext, { color: colors.textSecondary }]}>
                  {filterCategory === 'all' 
                    ? 'Add your first task to get started' 
                    : `No ${filterCategory} tasks yet`}
                </Text>
                <TouchableOpacity 
                  style={[styles.emptyStateButton, { backgroundColor: colors.primary }]}
                  onPress={() => setShowAddTask(true)}
                >
                  <Ionicons name="add" size={20} color="#FFFFFF" />
                  <Text style={styles.emptyStateButtonText}>Add Task</Text>
                </TouchableOpacity>
              </View>
            ) : (
              filteredTasks.map((task) => (
                <View key={task.id} style={[styles.taskCard, { backgroundColor: colors.card }]}>
                  <TouchableOpacity 
                    style={styles.taskContent}
                    onPress={() => toggleTask(task.id)}
                  >
                    <View style={styles.taskLeft}>
                      <TouchableOpacity style={styles.taskCheckbox} onPress={() => toggleTask(task.id)}>
                        <Ionicons 
                          name={task.completed ? 'checkmark-circle' : 'ellipse-outline'} 
                          size={24} 
                          color={task.completed ? colors.success : colors.textSecondary} 
                        />
                      </TouchableOpacity>
                      <View style={styles.taskInfo}>
                        <Text style={[
                          styles.taskTitle,
                          { color: colors.text },
                          task.completed && { textDecorationLine: 'line-through', color: colors.textSecondary }
                        ]}>
                          {task.title}
                        </Text>
                        {task.description && (
                          <Text style={[styles.taskDescription, { color: colors.textSecondary }]}>
                            {task.description}
                          </Text>
                        )}
                        <View style={styles.taskMeta}>
                          <View style={[styles.priorityBadge, { backgroundColor: priorityColors[task.priority] }]}>
                            <Text style={styles.priorityText}>{task.priority}</Text>
                          </View>
                          <View style={styles.categoryBadge}>
                            <Ionicons 
                              name={categoryIcons[task.category] as any} 
                              size={12} 
                              color={colors.textSecondary} 
                            />
                            <Text style={[styles.categoryText, { color: colors.textSecondary }]}>
                              {task.category}
                            </Text>
                          </View>
                          {task.dueDate && (
                            <View style={styles.dueDateContainer}>
                              <Ionicons name="time-outline" size={12} color={colors.textSecondary} />
                              <Text style={[styles.dueDateText, { color: colors.textSecondary }]}>
                                {formatDate(task.dueDate)}
                              </Text>
                            </View>
                          )}
                          {task.isRecurring && (
                            <Ionicons name="repeat" size={12} color={colors.secondary} />
                          )}
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    style={styles.taskActions}
                    onPress={() => deleteTask(task.id)}
                  >
                    <Ionicons name="trash-outline" size={18} color={colors.error} />
                  </TouchableOpacity>
                </View>
              ))
            )}
          </View>

          {/* Islamic Quote */}
          <View style={[styles.quoteCard, { backgroundColor: colors.secondary + '20', borderColor: colors.secondary }]}>
            <Ionicons name="book" size={24} color={colors.secondary} style={styles.quoteIcon} />
            <Text style={[styles.quoteText, { color: colors.text }]}>
              "And whoever relies upon Allah - then He is sufficient for him. Indeed, Allah will accomplish His purpose."
            </Text>
            <Text style={[styles.quoteReference, { color: colors.secondary }]}>- Quran 65:3</Text>
          </View>
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={showAddTask}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setShowAddTask(false)}
      >
        <SafeAreaView style={[styles.modalContainer, { backgroundColor: colors.background }]}>
          <View style={[styles.modalHeader, { backgroundColor: colors.surface, borderBottomColor: colors.border }]}>
            <TouchableOpacity onPress={() => setShowAddTask(false)}>
              <Text style={[styles.modalCancel, { color: colors.textSecondary }]}>Cancel</Text>
            </TouchableOpacity>
            <Text style={[styles.modalTitle, { color: colors.text }]}>New Task</Text>
            <TouchableOpacity onPress={addTask}>
              <Text style={[styles.modalSave, { color: colors.primary }]}>Save</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.modalContent}>
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Title</Text>
              <TextInput
                style={[styles.textInput, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={newTaskTitle}
                onChangeText={setNewTaskTitle}
                placeholder="Enter task title"
                placeholderTextColor={colors.textSecondary}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Description</Text>
              <TextInput
                style={[styles.textInput, styles.textArea, { backgroundColor: colors.card, borderColor: colors.border, color: colors.text }]}
                value={newTaskDescription}
                onChangeText={setNewTaskDescription}
                placeholder="Enter task description (optional)"
                placeholderTextColor={colors.textSecondary}
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Priority</Text>
              <View style={styles.prioritySelector}>
                {(['low', 'medium', 'high', 'urgent'] as const).map((priority) => (
                  <TouchableOpacity
                    key={priority}
                    style={[
                      styles.priorityOption,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      selectedPriority === priority && { 
                        backgroundColor: priorityColors[priority] + '20',
                        borderColor: priorityColors[priority]
                      }
                    ]}
                    onPress={() => setSelectedPriority(priority)}
                  >
                    <Text style={[
                      styles.priorityOptionText,
                      { color: colors.text },
                      selectedPriority === priority && { color: priorityColors[priority] }
                    ]}>
                      {priority.charAt(0).toUpperCase() + priority.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: colors.text }]}>Category</Text>
              <View style={styles.categorySelector}>
                {(['prayer', 'quran', 'dhikr', 'charity', 'learning', 'personal'] as const).map((category) => (
                  <TouchableOpacity
                    key={category}
                    style={[
                      styles.categoryOption,
                      { backgroundColor: colors.card, borderColor: colors.border },
                      selectedCategory === category && { 
                        backgroundColor: colors.primary,
                        borderColor: colors.primary
                      }
                    ]}
                    onPress={() => setSelectedCategory(category)}
                  >
                    <Ionicons 
                      name={categoryIcons[category] as any} 
                      size={16} 
                      color={selectedCategory === category ? '#FFFFFF' : colors.textSecondary} 
                    />
                    <Text style={[
                      styles.categoryOptionText,
                      { color: colors.text },
                      selectedCategory === category && { color: '#FFFFFF' }
                    ]}>
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <View style={styles.switchContainer}>
                <View>
                  <Text style={[styles.inputLabel, { color: colors.text }]}>Recurring Task</Text>
                  <Text style={[styles.switchDescription, { color: colors.textSecondary }]}>
                    Repeat this task daily
                  </Text>
                </View>
                <Switch
                  value={isRecurring}
                  onValueChange={setIsRecurring}
                  trackColor={{ false: colors.border, true: colors.primary + '40' }}
                  thumbColor={isRecurring ? colors.primary : colors.textSecondary}
                />
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
  },
  scrollContent: {
    paddingBottom: 100, // Space for tab bar
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSubtitle: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
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
    marginBottom: 12,
  },
  progressCards: {
    flexDirection: 'row',
    gap: 12,
  },
  progressCard: {
    flex: 1,
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
  progressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  progressTitle: {
    fontSize: 14,
    fontWeight: '600',
  },
  progressNumber: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  progressLabel: {
    fontSize: 12,
    marginBottom: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: 'rgba(0,0,0,0.1)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 2,
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
  taskCounter: {
    fontSize: 14,
  },
  prayerScroll: {
    marginHorizontal: -20,
    paddingHorizontal: 20,
  },
  prayerCard: {
    borderRadius: 12,
    padding: 12,
    marginRight: 12,
    minWidth: 100,
    alignItems: 'center',
    borderWidth: 1,
    position: 'relative',
  },
  prayerName: {
    fontSize: 14,
    fontWeight: '600',
  },
  prayerArabic: {
    fontSize: 16,
    marginVertical: 4,
    fontWeight: '500',
  },
  prayerTime: {
    fontSize: 12,
    marginBottom: 8,
  },
  prayerStatus: {
    alignItems: 'center',
  },
  currentBadge: {
    position: 'absolute',
    top: -6,
    right: -6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  currentBadgeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  taskListsGrid: {
    gap: 12,
  },
  taskListCard: {
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
  taskListLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  taskListName: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
  taskListCount: {
    fontSize: 14,
  },
  taskListProgress: {
    marginTop: 8,
  },
  progressBarSmall: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFillSmall: {
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
    borderWidth: 1,
  },
  filterTabText: {
    fontSize: 14,
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
    borderRadius: 16,
    marginTop: 8,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 16,
  },
  emptyStateSubtext: {
    fontSize: 14,
    marginTop: 4,
    textAlign: 'center',
    marginBottom: 20,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 20,
    gap: 8,
  },
  emptyStateButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  taskCard: {
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
    marginBottom: 4,
  },
  taskDescription: {
    fontSize: 14,
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
  categoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  categoryText: {
    fontSize: 12,
    textTransform: 'capitalize',
  },
  dueDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dueDateText: {
    fontSize: 12,
  },
  taskActions: {
    padding: 16,
  },
  quoteCard: {
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    marginTop: 16,
    alignItems: 'center',
  },
  quoteIcon: {
    marginBottom: 12,
  },
  quoteText: {
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
    textAlign: 'center',
    marginBottom: 8,
  },
  quoteReference: {
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
  modalContainer: {
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  modalCancel: {
    fontSize: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
  },
  modalSave: {
    fontSize: 16,
    fontWeight: '600',
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
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
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
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  categorySelector: {
    flexDirection: 'row',
    gap: 8,
    flexWrap: 'wrap',
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    gap: 6,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  switchDescription: {
    fontSize: 14,
    marginTop: 2,
  },
});