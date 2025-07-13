import React, { useState, useEffect } from 'react';
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
import { Send, Bot } from 'lucide-react-native';
import { OpenRouterAPI } from '@/services/openRouterAPI';
import LoadingSpinner from '@/components/LoadingSpinner';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function AssistantScreen() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Assalamu Alaikum wa Rahmatullahi wa Barakatuh! I am Qafila, your AI Islamic Assistant powered by advanced AI. Ask me about prayers, Zakat, Hajj, Islamic jurisprudence, or any Islamic topic. How may I assist you today?',
      isUser: false,
      timestamp: new Date(),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiClient, setApiClient] = useState<OpenRouterAPI | null>(null);

  useEffect(() => {
    try {
      const client = new OpenRouterAPI();
      setApiClient(client);
    } catch (error) {
      Alert.alert('Configuration Error', 'Please check your API configuration.');
      setApiClient(null);
    }
  }, []);

  const sendMessage = async () => {
    if (inputText.trim() === '') return;
    if (!apiClient) {
      Alert.alert('Error', 'API client not available. Please check configuration.');
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputText('');
    setIsLoading(true);

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
        content: inputText.trim(),
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
        text: 'I apologize, but I encountered an error. Please try again or check your internet connection.',
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Bot size={32} color="#FFFFFF" />
        <Text style={styles.headerTitle}>Qafila AI Assistant</Text>
        <Text style={styles.headerSubtitle}>Powered by DeepSeek AI • Ask any Islamic question</Text>
      </View>

      <ScrollView style={styles.messagesContainer} showsVerticalScrollIndicator={false}>
        {messages.map((message) => (
          <View
            key={message.id}
            style={[
              styles.messageContainer,
              message.isUser ? styles.userMessage : styles.botMessage,
            ]}
          >
            <Text style={[
              styles.messageText,
              message.isUser ? styles.userMessageText : styles.botMessageText,
            ]}>
              {message.text}
            </Text>
          </View>
        ))}
        {isLoading && (
          <View style={styles.loadingContainer}>
            <LoadingSpinner size="small" color="#059669" />
            <Text style={styles.loadingText}>Qafila is thinking...</Text>
          </View>
        )}
      </ScrollView>

      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.inputContainer}
      >
        <View style={styles.inputWrapper}>
          <TextInput
            style={styles.textInput}
            value={inputText}
            onChangeText={setInputText}
            placeholder="Ask about Islamic teachings..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity 
            style={[styles.sendButton, isLoading && styles.sendButtonDisabled]} 
            onPress={sendMessage}
            disabled={isLoading}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFFFFF',
    marginTop: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#DCFCE7',
    marginTop: 4,
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  messageContainer: {
    marginBottom: 12,
    borderRadius: 16,
    padding: 12,
    maxWidth: '85%',
  },
  userMessage: {
    backgroundColor: '#059669',
    alignSelf: 'flex-end',
  },
  botMessage: {
    backgroundColor: '#FFFFFF',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
  },
  userMessageText: {
    color: '#FFFFFF',
  },
  botMessageText: {
    color: '#374151',
  },
  inputContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F3F4F6',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    maxHeight: 100,
    paddingVertical: 8,
  },
  sendButton: {
    backgroundColor: '#059669',
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  sendButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#6B7280',
    fontStyle: 'italic',
  },
});