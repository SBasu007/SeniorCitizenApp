import { StyleSheet } from "react-native";

export const ambulanceStyles = StyleSheet.create({
    container: {
    flex: 1,
    backgroundColor: '#FCF3F2',
  },
  
  bookedAmbulanceCard: {
    backgroundColor: '#FF6B6B',
    borderRadius: 16,
    padding: 15,
    marginBottom:8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  bookedAmbulanceCardText:{
    color:'white',
    fontSize:15,
  },


})