import { StyleSheet } from 'react-native';

export const chatStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },

  // Header Styles
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5E5',
  },

  headerInfo: {
    flex: 1,
  },

  headerTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#000',
  },

  headerSubtitle: {
    fontSize: 16,
    color: '#0cc424ff',
    marginTop: 2,
  },

  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },

  newChatButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
  },

  avatarContainer: {
    width: 40,
    height: 40,
    borderRadius: 22.5,
    backgroundColor: '#DC2626',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  avatarText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Messages Container
  messagesContainer: {
    flex: 1,
    padding: 16,
  },

  messageRow: {
    marginBottom: 12,
    flexDirection: 'column',
    alignItems: 'flex-start',
  },

  userMessageRow: {
    alignItems: 'flex-end',
  },

  aiMessageRow: {
    alignItems: 'flex-start',
  },

  messageBubble: {
    maxWidth: '90%',
    padding: 12,
    borderRadius: 16,
    marginBottom: 4,
  },

  userMessage: {
    backgroundColor: '#DC2626',
  },

  aiMessage: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },

  // Special message types
  bookingMessage: {
    borderColor: '#DC2626',
    borderWidth: 2,
  },

  fileAnalysisMessage: {
    backgroundColor: '#F0FDF4',
    borderColor: '#059669',
    borderWidth: 1,
  },

  // File analysis styles
  fileAnalysisHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#D1FAE5',
  },

  fileAnalysisTitle: {
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
    color: '#059669',
  },

  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },

  userMessageText: {
    color: '#FFFFFF',
  },

  aiMessageText: {
    color: '#333',
  },

  timestamp: {
    fontSize: 12,
    color: '#999',
    marginHorizontal: 8,
  },

  // Typing Indicator
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    alignSelf: 'flex-start',
  },

  typingText: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginLeft: 8,
  },

  // Welcome Screen
  welcomeContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },

  aiIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },

  welcomeTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },

  welcomeSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 20,
    marginBottom: 20,
  },

  // Welcome screen examples
  welcomeExamples: {
    marginTop: 20,
    paddingHorizontal: 20,
  },

  examplesTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
    textAlign: 'center',
  },

  exampleText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 6,
    textAlign: 'center',
  },

  // Input Area
  inputContainer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },

  textInputWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 25,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  voiceButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },

  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#333',
    paddingVertical: 8,
    paddingHorizontal: 4,
    maxHeight: 100,
    minHeight: 40,
    textAlignVertical: 'center',
  },

  submitButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },

  enabledButton: {
    backgroundColor: '#DC2626',
  },

  disabledButton: {
    backgroundColor: '#E0E0E0',
  },

  // Booking-specific styles
  bookingButton: {
    backgroundColor: '#DC2626',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginTop: 8,
    alignSelf: 'flex-start',
  },

  bookingButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },

  // Error message styles
  errorMessage: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
  },

  errorMessageText: {
    color: '#DC2626',
  },

  // Connection status
  connectionStatus: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'center',
    marginVertical: 8,
  },

  connectionStatusText: {
    color: '#92400E',
    fontSize: 12,
    fontWeight: '500',
  },

  // Loading spinner
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },

  loadingText: {
    marginLeft: 8,
    color: '#666',
    fontSize: 14,
  },

  // Quick suggestions (if you want to add them later)
  suggestionsContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },

  suggestionButton: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },

  suggestionText: {
    color: '#374151',
    fontSize: 14,
    fontWeight: '500',
  },

  // Health emergency banner (if needed)
  emergencyBanner: {
    backgroundColor: '#FEE2E2',
    borderColor: '#F87171',
    borderWidth: 1,
    padding: 12,
    margin: 16,
    borderRadius: 8,
  },

  emergencyText: {
    color: '#DC2626',
    fontSize: 14,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default chatStyles;
