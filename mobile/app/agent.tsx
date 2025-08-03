import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Linking,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

export default function AgentScreen() {
  const agentUrl = 'https://elevenlabs.io/app/talk-to?agent_id=agent_5801k1qyj4pffza8kan3sx47pe28';

  const handleGoBack = () => {
    router.back();
  };

  const openAgentInBrowser = async () => {
    try {
      const supported = await Linking.canOpenURL(agentUrl);
      if (supported) {
        await Linking.openURL(agentUrl);
        // Optionally go back to previous screen after opening browser
        // handleGoBack();
      } else {
        Alert.alert('Error', 'Unable to open the agent. Please try again.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to open the AI agent. Please try again.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="dark" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleGoBack}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color="#DC2626" />
        </TouchableOpacity>

        <View style={styles.headerTitle}>
          <Text style={styles.titleText}>Diagno AI Agent</Text>
          <Text style={styles.subtitleText}>Voice Assistant</Text>
        </View>

        <View style={styles.headerSpacer} />
      </View>

      {/* Content */}
      <View style={styles.content}>
        <View style={styles.agentInfo}>
          <View style={styles.agentIcon}>
            <Ionicons name="mic" size={60} color="#DC2626" />
          </View>
          <Text style={styles.agentTitle}>Diagno AI Voice Agent</Text>
          <Text style={styles.agentDescription}>
            Start a voice conversation with our AI medical assistant for instant health advice and support.
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={openAgentInBrowser}
          activeOpacity={0.8}
        >
          <Ionicons name="call" size={24} color="#FFFFFF" />
          <Text style={styles.startButtonText}>Start Voice Chat</Text>
        </TouchableOpacity>

        <Text style={styles.note}>
          This will open the voice agent in your browser
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    paddingTop: 30,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  backButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  headerTitle: {
    flex: 1,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  titleText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1F2937',
  },
  subtitleText: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 2,
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  agentInfo: {
    alignItems: 'center',
    marginBottom: 48,
  },
  agentIcon: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#FEF2F2',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  agentTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 12,
    textAlign: 'center',
  },
  agentDescription: {
    fontSize: 16,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 24,
  },
  startButton: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
    shadowColor: '#DC2626',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
  note: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
