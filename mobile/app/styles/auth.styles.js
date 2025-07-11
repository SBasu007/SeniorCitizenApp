// styles/auth.styles.js
import { StyleSheet } from "react-native";
// import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
    padding: 20,
    justifyContent: "center",
  },
  illustration: {
    height: 310,
    width: 300,
    resizeMode: "contain",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#C52727",
    marginVertical: 15,
    textAlign: "center",
  },
  input: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "black",
    fontSize: 16,
    color: "red",
  },
  errorInput: {
    borderColor: "red",
  },
  button: {
    backgroundColor: "#C52727",
    borderRadius: 12,
    padding: 16,
    alignItems: "center",
    marginTop: 10,
    marginBottom: 20,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
  },
  footerContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  footerText: {
    color: "black",
    fontSize: 16,
  },
  linkText: {
    color: "#C52727",
    fontSize: 16,
    fontWeight: "600",
  },
  verificationContainer: {
    flex: 1,
    backgroundColor: "balck",
    padding: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  verificationTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#C52727",
    marginBottom: 20,
    textAlign: "center",
  },
  verificationInput: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 15,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#C52727",
    fontSize: 16,
    color: "#C52727",
    width: "100%",
    textAlign: "center",
    letterSpacing: 2,
  },

  // 🔴 Error styles
  errorBox: {
    backgroundColor: "#FFE5E5",
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: "black",
    marginBottom: 16,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
  errorText: {
    color: "black",
    marginLeft: 8,
    flex: 1,
    fontSize: 14,
  },
});