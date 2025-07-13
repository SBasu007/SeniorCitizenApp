import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FCF3F2",
    padding: 20,
  },
  healthCheckImage: {
    width: 350, // Adjusted to match the image size in the provided design
    height: 350,
    marginBottom: 20,
    borderRadius: 10, // Slight rounding to match the image border
  },
  title: {
    fontSize: 25, // Adjusted to match the design
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#FF4C4C", // Red color from the design
    paddingVertical: 12,
    paddingHorizontal: 110,
    borderRadius: 10, // Rounded button as per design
    alignItems: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContainer: {
    paddingBottom: 30,
},

uploadBox: {
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "#FF4C4C",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
},

uploadText: {
    color: "#FF4C4C",
    fontWeight: "bold",
    fontSize: 16,
},

sectionTitle: {
    fontSize: 25,
    fontWeight: "bold",
    marginLeft: 20,
    marginBottom: 10,
    color: "#333",
},

filesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    marginBottom: 30,
},

fileCard: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
    width: 90,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
},

fileText: {
    fontSize: 12,
    marginTop: 5,
    color: "#333",
    textAlign: "center",
},
suggestionCardContainer: {
    paddingHorizontal: 20,
    marginTop: 10,
    marginBottom: 80,
},

suggestionCardGreen: {
    backgroundColor: "#DFFFE0",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#18A558",
},

suggestionCardRed: {
    backgroundColor: "#FFE0E0",
    padding: 20,
    marginBottom: 20,
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: "#D9534F",
},

suggestionText: {
    fontSize: 15,
    color: "#333",
},
nextboxdesign: {
    backgroundColor: "#FCF3F2",
}

});

export default styles;