import { View, Text, TouchableOpacity, Image, StyleSheet } from "react-native";
import { router } from "expo-router";
import { SpinAnimation } from "../animations/SpinAnimation";
import { BounceAnimation } from "../animations/BounceAnimation";
import PikachuSprint from "../components/PikachuSprint";

export default function Home() {
  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <PikachuSprint />
        <Image
          source={require("../../assets/images/pokemon/pokeligame-txt.png")}
          style={styles.logo}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/auth-modal")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>S'authentifier</Text>
        </TouchableOpacity>
        <SpinAnimation
          source={require("../../assets/images/pokemon/pokeball.png")}
          size={20}
          duration={2000}
        />
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/collection")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Voir la collection</Text>
        </TouchableOpacity>
        <BounceAnimation
          source={require("../../assets/images/pokemon/pokeball.png")}
          size={20}
          duration={1500}
          bounceHeight={8}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 10,
  },
  logo: {
    width: 350,
    height: 100,
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "#FF0000",
    padding: 10,
    borderRadius: 10,
  },
  logoContainer: {
    alignItems: "center",
    gap: 5,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});
