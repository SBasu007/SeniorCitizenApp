import { StyleSheet,Dimensions } from "react-native";

const { width, height } = Dimensions.get('window');

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
  mapContainer: {
  height: 200, 
  marginTop: 20, 
  marginBottom: 20, 
  position: "relative",
  backgroundColor: 'white',
  borderRadius: 16,         // <== move borderRadius here
  overflow: 'hidden',       // <== this is required for borderRadius to work on MapView
  shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  map:{
    width: "100%", 
    height: "100%",
  },
  additionalSection: {
    marginBottom: 20,
  },
  additionalSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  additionalGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
  },
  additionalCard: {
    backgroundColor: 'white',
    padding: 12,
    alignContent:'center',
    justifyContent:'center',
    borderRadius: 8,
    width: (width - 60) / 2,
    height:70,
    alignItems: 'center',
    marginBottom: 15,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6
  },
  additionalCardText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cardRow: {
    flexDirection: "row",
    alignItems: "center",
  },

})

export default ambulanceStyles;