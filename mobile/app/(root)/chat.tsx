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
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';
import { chatStyles } from '../styles/chat.styles';
import Markdown from 'react-native-markdown-display';

// Add the missing Message interface
interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'general' | 'booking';
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
      const response = await fetch(`https://seniorcitizenapp.onrender.com//ai-chat/history/${user?.id}`);
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
      const response = await fetch('https://seniorcitizenapp.onrender.com/ai-chat/message', {
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
        text: "I'm sorry, I can't connect right now. Please check your internet connection and try again.",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoicePress = () => {
    console.log('Voice button pressed');
  };

  // Add the missing handleAvatarPress function
  const handleAvatarPress = () => {
    router.push('/profile');
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Add new chat function
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
              // Clear conversation on backend
              await fetch(`https://seniorcitizenapp.onrender.com/ai-chat/history/${user?.id}`, {
                method: 'DELETE',
              });
              
              // Clear local messages
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
          message.type === 'booking' && !message.isUser && chatStyles.bookingMessage
        ]}
      >
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
        Ask me anything about your health, book appointments, or get medical advice!
      </Text>
    </View>
  );

  return (
    <KeyboardAvoidingView
      style={chatStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
    >
      {/* Updated Header with New Chat button */}
      <View style={chatStyles.header}>
        <View style={chatStyles.headerInfo}>
          <Text style={chatStyles.headerTitle}>Diagno AI</Text>
          <Text style={chatStyles.headerSubtitle}>
            {isTyping ? 'Typing...' : 'Online'}
          </Text>
        </View>
        
        <View style={chatStyles.headerActions}>
          {/* New Chat Button */}
          {messages.length > 0 && (
            <TouchableOpacity
              style={chatStyles.newChatButton}
              onPress={startNewChat}
              activeOpacity={0.7}
            >
              <Ionicons name="add-circle-outline" size={24} color="#DC2626" />
            </TouchableOpacity>
          )}
          
          {/* Profile Avatar */}
          <TouchableOpacity
            style={chatStyles.avatarContainer}
            onPress={handleAvatarPress}
            activeOpacity={0.7}
          >
            <Ionicons name="person-circle" size={40} color="#DC2626" />
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
                <Text style={chatStyles.typingText}>Diagno AI is thinking...</Text>
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
            placeholder="Ask about health, book appointments..."
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
