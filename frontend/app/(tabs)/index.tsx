import { View, Text, Button } from "react-native";
import { router } from "expo-router";

export default function Home() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        gap: 10,
      }}
    >
      <Text style={{ fontSize: 24 }}>Pokeligame !</Text>
      <Button
        title="S'authentifier"
        onPress={() => router.push("/auth-modal")}
      />
      <Button
        title="Voir la collection"
        onPress={() => router.push("/collection")}
      />
    </View>
  );
}
