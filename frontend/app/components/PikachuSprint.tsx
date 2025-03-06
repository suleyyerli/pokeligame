import React from "react";
import { View, Image, StyleSheet } from "react-native";

export const PikachuSprint = () => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/pokemon/PikachuSprint.gif")}
        style={styles.pikachu}
      />
      <Image
        source={require("../../assets/images/pokemon/PikachuSprint.gif")}
        style={styles.pikachu}
      />
      <Image
        source={require("../../assets/images/pokemon/PikachuSprint.gif")}
        style={styles.pikachu}
      />
      <Image
        source={require("../../assets/images/pokemon/PikachuSprint.gif")}
        style={styles.pikachu}
      />
      <Image
        source={require("../../assets/images/pokemon/PikachuSprint.gif")}
        style={styles.pikachu}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  pikachu: {
    width: 40,
    height: 30,
    marginHorizontal: 5,
  },
});

export default PikachuSprint;
