import { StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const recordStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FCF3F2',
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FCF3F2',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  scrollContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  
  // Profile Section
  profileSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  profileImageContainer: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  profileImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  profileInitials: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 5,
  },
  profileDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  profileStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FF6B6B',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },

  // Quick Actions
  quickActionsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 15,
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  quickActionCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    width: (width - 60) / 2,
    marginBottom: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  quickActionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
  },
  quickActionSubtitle: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
    marginTop: 2,
  },

  // Medical Records Section
  medicalRecordsSection: {
    marginBottom: 20,
  },
  recordCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  recordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  recordType: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  recordDate: {
    fontSize: 12,
    color: '#666',
  },
  recordDetails: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  recordActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  recordStatus: {
    fontSize: 12,
    fontWeight: '500',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusNormal: {
    backgroundColor: '#E8F5E8',
    color: '#4CAF50',
  },
  statusLow: {
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
  },
  statusHigh: {
    backgroundColor: '#FFF3E0',
    color: '#FF9800',
  },
  viewButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#F0F8FF',
    borderRadius: 8,
  },
  viewButtonText: {
    fontSize: 12,
    color: '#007AFF',
    marginLeft: 4,
  },

  // Family Connect Section
  familySection: {
    marginBottom: 30,
  },
  familyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  familyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  familyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  familyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  familySubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
  familyMembers: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  familyMember: {
    alignItems: 'center',
    marginRight: 15,
  },
  familyMemberImage: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  familyMemberName: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  addMemberButton: {
    width: 45,
    height: 45,
    borderRadius: 22.5,
    borderWidth: 2,
    borderColor: '#DDD',
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
  },
  shareButton: {
    backgroundColor: '#FF6B6B',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 20,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  shareButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },

  // Floating Action Button
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF6B6B',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },

  // Animation styles
  fadeIn: {
    opacity: 1,
  },
  slideUp: {
    transform: [{ translateY: 0 }],
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    padding: 40,
  },
  emptyStateIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F0F0F0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 10,
  },
  emptyStateSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
});
export default recordStyles;
