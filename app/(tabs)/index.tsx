import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { OpenRouterAPI } from '@/services/openRouterAPI';
import { useTheme } from '@/components/ThemeContext';
import PromptSuggestions from '@/components/PromptSuggestions';
import TypingIndicator from '@/components/TypingIndicator';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssistantScreen() {
  const { colors, isDark, toggleTheme } = useTheme();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh! 🌙\n\nI am Qafila, your AI Islamic Assistant powered by DeepSeek AI. I\'m here to help you with:\n\n• Prayer guidance and Islamic jurisprudence\n• Zakat calculations and charity\n• Quran and Hadith explanations\n• Daily Islamic practices\n• Spiritual guidance\n\nHow may I assist you on your Islamic journey today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiClient, setApiClient] = useState<OpenRouterAPI | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);

  useEffect(() => {
    try {
      const client = new OpenRouterAPI();
      setApiClient(client);
    } catch (error) {
      Alert.alert('Configuration Error', 'Please check your API configuration.');
      setApiClient(null);
    }
  }, []);

  const sendMessage = async (messageText?: string) => {
    const textToSend = messageText || inputText.trim();
    if (textToSend === '') return;
    if (!apiClient) {
      Alert.alert('Error', 'API client not available. Please check configuration.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: textToSend,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

    // Scroll to bottom after adding user message
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);

    try {
      // Convert messages to API format
      const chatMessages = messages
        .filter(msg => msg.isUser)
        .map(msg => ({
          role: 'user' as const,
          content: msg.text,
        }));
      
      // Add current message
      chatMessages.push({
        role: 'user' as const,
        content: textToSend,
      });

      const response = await apiClient.sendMessage(chatMessages);
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: 'I apologize, but I encountered an error. Please try again or check your internet connection. 🤲',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      // Scroll to bottom after bot response
      setTimeout(() => {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }
  };

  const handlePromptSelect = (prompt: string) => {
    setInputText(prompt);
    sendMessage(prompt);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: colors.primary }]}>
        <View style={styles.headerContent}>
          <View style={styles.headerLeft}>
            <View style={styles.logoContainer}>
              <Ionicons name="chatbubbles" size={28} color="#FFFFFF" />
            </View>
            <View>
              <Text style={styles.headerTitle}>Qafila AI</Text>
              <Text style={styles.headerSubtitle}>Islamic Assistant • Powered by DeepSeek</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.themeToggle} onPress={toggleTheme}>
            <Ionicons 
              name={isDark ? 'sunny' : 'moon'} 
              size={20} 
              color="#FFFFFF" 
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView 
        ref={scrollViewRef}
        style={styles.messagesContainer} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.messagesContent}
      >
        {/* Prompt Suggestions - Show only when no user messages */}
        {messages.filter(m => m.isUser).length === 0 && (
          <PromptSuggestions onSelectPrompt={handlePromptSelect} />
        )}

        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.botMessage,
            ]}
          >
            {!message.isUser && (
              <View style={[styles.botAvatar, { backgroundColor: colors.primary }]}>
                <Ionicons name="chatbubbles" size={16} color="#FFFFFF" />
              </View>
            )}
            <View style={[
              styles.messageBubble,
              message.isUser 
                ? { backgroundColor: colors.primary } 
                : { backgroundColor: colors.card, borderColor: colors.border }
            ]}>
              <Text style={[
                styles.messageText,
                { color: message.isUser ? '#FFFFFF' : colors.text }
              ]}>
                {message.text}
              </Text>
              <Text style={[
                styles.messageTime,
                { color: message.isUser ? 'rgba(255,255,255,0.7)' : colors.textSecondary }
              ]}>
                {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </Text>
            </View>
          </View>
        ))}
        
        {/* Typing Indicator */}
        {isLoading && <TypingIndicator />}
      </ScrollView>

      {/* Input Area */}
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={[styles.inputContainer, { backgroundColor: colors.surface, borderTopColor: colors.border }]}
      >
        <View style={[styles.inputWrapper, { backgroundColor: colors.background }]}>
          <TextInput
            style={[styles.textInput, { color: colors.text }]}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about Islamic teachings..."
            placeholderTextColor={colors.textSecondary}
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[
              styles.sendButton, 
              { backgroundColor: inputText.trim() ? colors.primary : colors.textSecondary }
            ]} 
            onPress={() => sendMessage()}
            disabled={isLoading || !inputText.trim()}
          >
            <Ionicons name="send" size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  themeToggle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
  },
  messagesContent: {
    paddingTop: 16,
    paddingBottom: 100, // Extra space for tab bar
  },
  messageContainer: {
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  botMessage: {
    alignItems: 'flex-start',
    flexDirection: 'row',
  },
  botAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
    marginTop: 4,
  },
  messageBubble: {
    maxWidth: '80%',
    borderRadius: 20,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  messageTime: {
    fontSize: 11,
    textAlign: 'right',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    position: 'absolute',
    bottom: Platform.OS === 'ios' ? 88 : 64, // Account for tab bar
    left: 0,
    right: 0,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    maxHeight: 100,
    paddingVertical: 8,
    paddingRight: 8,
  },
  sendButton: {
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});