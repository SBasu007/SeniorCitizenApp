import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { chatStyles } from '../styles/chat.styles';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (inputText.trim() === '') return;

    const newMessage: Message = {
      id: Date.now().toString(),
      text: inputText.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, newMessage]);
    setInputText('');
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        text: "Hello! I'm your AI assistant. How can I help you today?",
        isUser: false,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handleVoicePress = () => {
    // Implement voice recording functionality
    console.log('Voice button pressed');
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
        ]}
      >
        <Text
          style={[
            chatStyles.messageText,
            message.isUser ? chatStyles.userMessageText : chatStyles.aiMessageText,
          ]}
        >
          {message.text}
        </Text>
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
      <Text style={chatStyles.welcomeTitle}>Diagno easy AI</Text>
      <Text style={chatStyles.welcomeSubtitle}>
        Ask me anything about your health, symptoms, or medications. I'm here to help!
      </Text>
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
        <View>
          <Text style={chatStyles.headerTitle}>Diagno AI</Text>
          <Text style={chatStyles.headerSubtitle}>
            {isTyping ? 'Typing...' : 'Online'}
          </Text>
        </View>
        <View style={chatStyles.avatarContainer}>
          <Text style={chatStyles.avatarText}>AI</Text>
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
                <Text style={chatStyles.typingText}>AI is typing...</Text>
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
            placeholder="Ask anything"
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
            disabled={inputText.trim() === ''}
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