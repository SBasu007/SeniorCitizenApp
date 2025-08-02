import { Text, View, SafeAreaView, StyleSheet } from "react-native";

export default function IService() {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text>Sup</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FCF3F2"
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  }
});
