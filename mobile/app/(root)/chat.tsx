import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { chatStyles } from '../styles/chat.styles';
import Markdown from 'react-native-markdown-display';

// Add your local IP and port here
const API_BASE_URL = 'http://192.168.31.56:3000'; // Replace with your actual IP and port

// Updated Message interface
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'general' | 'booking' | 'file_analysis' | 'health_advice';
  metadata?: any;
}

export default function ChatScreen() {
  const { user } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Load conversation history on mount
  useEffect(() => {
    if (user?.id) {
      loadConversationHistory();
    }
  }, [user?.id]);

  const loadConversationHistory = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-chat/history/${user?.id}`);
      const data = await response.json();

      if (data.history) {
        const formattedHistory = data.history.map((msg: any, index: number) => ({
          id: `history-${index}`,
          text: msg.text,
          isUser: msg.role === 'user',
          timestamp: new Date(msg.timestamp),
        }));
        setMessages(formattedHistory);
      }
    } catch (error) {
      console.error('Failed to load conversation history:', error);
      Alert.alert('Connection Error', 'Make sure your server is running and accessible.');
    }
  };

  const sendMessage = async () => {
    if (inputText.trim() === '' || !user?.id) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    const messageToSend = inputText.trim();
    setInputText('');
    setIsTyping(true);

    try {
      const response = await fetch(`${API_BASE_URL}/ai-chat/message`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: messageToSend,
          userId: user.id,
          conversationType: 'medical'
        }),
      });

      const data = await response.json();

      if (response.ok) {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: data.response,
          isUser: false,
          timestamp: new Date(data.timestamp),
          type: data.type,
          metadata: data.metadata
        };

        setMessages(prev => [...prev, aiResponse]);
      } else {
        const fallbackMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: data.fallback || "I'm sorry, I'm having trouble right now. Please try again.",
          isUser: false,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, fallbackMessage]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: "I'm sorry, I can't connect to the server. Please check your connection and make sure the server is running.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const startNewChat = async () => {
    Alert.alert(
      'New Chat',
      'Are you sure you want to start a new conversation? Current chat will be saved.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'New Chat',
          style: 'default',
          onPress: async () => {
            try {
              await fetch(`${API_BASE_URL}/ai-chat/history/${user?.id}`, {
                method: 'DELETE',
              });
              
              setMessages([]);
              setInputText('');
              setIsTyping(false);
            } catch (error) {
              console.error('Failed to start new chat:', error);
              Alert.alert('Error', 'Failed to start new chat. Please try again.');
            }
          },
        },
      ]
    );
  };

  // Debug function to test file fetching
  const debugFiles = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/ai-chat/debug/files/${user?.id}`);
      const data = await response.json();
      console.log('Debug files result:', data);
      Alert.alert('Debug Files', `Found ${data.filesFound} files. Check console for details.`);
    } catch (error) {
      console.error('Debug files error:', error);
      Alert.alert('Debug Error', 'Failed to fetch files for debugging');
    }
  };

  const handleVoicePress = () => {
    console.log('Voice button pressed');
  };

  const handleAvatarPress = () => {
    router.push('/profile');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const renderMessage = (message: Message) => (
    <View
      key={message.id}
      style={[
        chatStyles.messageRow,
        message.isUser ? chatStyles.userMessageRow : chatStyles.aiMessageRow,
      ]}
    >
      <View
        style={[
          chatStyles.messageBubble,
          message.isUser ? chatStyles.userMessage : chatStyles.aiMessage,
          message.type === 'file_analysis' && !message.isUser && chatStyles.fileAnalysisMessage
        ]}
      >
        {message.type === 'file_analysis' && !message.isUser && (
          <View style={chatStyles.fileAnalysisHeader}>
            <Ionicons name="document-text" size={16} color="#059669" />
            <Text style={chatStyles.fileAnalysisTitle}>File Analysis Result</Text>
          </View>
        )}

        {message.isUser ? (
          <Text
            style={[
              chatStyles.messageText,
              chatStyles.userMessageText,
            ]}
          >
            {message.text}
          </Text>
        ) : (
          <Markdown
            style={{
              body: {
                color: '#1f2937',
                fontSize: 15,
                lineHeight: 22,
              },
              strong: {
                fontWeight: 'bold',
              },
              paragraph: {
                marginBottom: 8,
              },
            }}
          >
            {message.text}
          </Markdown>
        )}

        {message.type === 'booking' && !message.isUser && (
          <TouchableOpacity
            style={chatStyles.bookingButton}
            onPress={() => {
              Alert.alert('Booking', 'Navigate to booking page?');
            }}
          >
            <Text style={chatStyles.bookingButtonText}>Book Now</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={chatStyles.timestamp}>
        {formatTime(message.timestamp)}
      </Text>
    </View>
  );

  const renderWelcomeScreen = () => (
    <View style={chatStyles.welcomeContainer}>
      <View style={chatStyles.aiIcon}>
        <Ionicons name="chatbubbles" size={30} color="#FFFFFF" />
      </View>
      <Text style={chatStyles.welcomeTitle}>Diagno AI</Text>
      <Text style={chatStyles.welcomeSubtitle}>
        Ask me anything about your health, analyze your uploaded files, book appointments, or get medical advice!
      </Text>
      
      <View style={chatStyles.welcomeExamples}>
        <Text style={chatStyles.examplesTitle}>Try asking:</Text>
        <Text style={chatStyles.exampleText}>• "Analyze my lab report"</Text>
        <Text style={chatStyles.exampleText}>• "Check my uploaded files"</Text>
        <Text style={chatStyles.exampleText}>• "What do my test results mean?"</Text>
        <Text style={chatStyles.exampleText}>• "I have a headache, what should I do?"</Text>
      </View>

      {/* Debug button for development */}
      {__DEV__ && (
        <TouchableOpacity
          onPress={debugFiles}
          style={{
            marginTop: 20,
            padding: 10,
            backgroundColor: '#DC2626',
            borderRadius: 8,
          }}
        >
          <Text style={{ color: 'white', fontWeight: 'bold' }}>Debug Files</Text>
        </TouchableOpacity>
      )}
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={chatStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Header */}
      <View style={chatStyles.header}>
        <View style={chatStyles.headerInfo}>
          <Text style={chatStyles.headerTitle}>Diagno AI</Text>
          <Text style={chatStyles.headerSubtitle}>
            {isTyping ? 'Analyzing...' : 'Online'}
          </Text>
        </View>
        
        <View style={chatStyles.headerActions}>
          {messages.length > 0 && (
            <TouchableOpacity
              style={chatStyles.newChatButton}
              onPress={startNewChat}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={24} color="#DC2626" />
            </TouchableOpacity>
          )}
          
          <TouchableOpacity
            style={chatStyles.avatarContainer}
            onPress={handleAvatarPress}
            activeOpacity={0.7}
          >
            <Text style={chatStyles.avatarText}>
              {user?.firstName?.charAt(0) ?? "U"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        style={chatStyles.messagesContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.length === 0 ? (
          renderWelcomeScreen()
        ) : (
          <>
            {messages.map(renderMessage)}
            {isTyping && (
              <View style={chatStyles.typingIndicator}>
                <ActivityIndicator size="small" color="#059669" />
                <Text style={chatStyles.typingText}>
                  Diagno AI is analyzing...
                </Text>
              </View>
            )}
          </>
        )}
      </ScrollView>

      {/* Input Area */}
      <View style={chatStyles.inputContainer}>
        <View style={chatStyles.textInputWrapper}>
          <TouchableOpacity
            style={chatStyles.voiceButton}
            onPress={handleVoicePress}
            activeOpacity={0.7}
          >
            <Ionicons name="mic" size={24} color="#666" />
          </TouchableOpacity>

          <TextInput
            style={chatStyles.textInput}
            placeholder="Ask about health, analyze my files, book appointments..."
            placeholderTextColor="#999"
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={sendMessage}
          />

          <TouchableOpacity
            style={[
              chatStyles.submitButton,
              inputText.trim() ? chatStyles.enabledButton : chatStyles.disabledButton,
            ]}
            onPress={sendMessage}
            disabled={inputText.trim() === '' || isTyping}
            activeOpacity={0.7}
          >
            <Ionicons
              name="arrow-up"
              size={20}
              color={inputText.trim() ? '#FFFFFF' : '#999'}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
