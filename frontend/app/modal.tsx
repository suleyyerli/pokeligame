import { StyleSheet, Text, View, Button } from "react-native";
import { router } from "expo-router";

export default function Modal() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Modal</Text>
      <Button title="Fermer" onPress={() => router.back()} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
});
