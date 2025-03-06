import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { getApiUrl } from "./utils/config";
import { BounceAnimation } from "./animations/BounceAnimation";

const RARITY_OPTIONS = [
  { label: "⭐", value: 1 },
  { label: "⭐⭐", value: 2 },
  { label: "⭐⭐⭐", value: 3 },
  { label: "⭐⭐⭐⭐", value: 4 },
];

const ITEM_TYPES = [
  { label: "Carte", value: "card" },
  { label: "Booster", value: "booster" },
  { label: "Display", value: "display" },
];

export default function Modal() {
  const { token } = useAuth();
  const params = useLocalSearchParams();
  const isEditMode = params.mode === "edit";

  const [type, setType] = useState(
    isEditMode ? (params.type as string) : "card"
  );
  const [name, setName] = useState(isEditMode ? (params.name as string) : "");
  const [rarity, setRarity] = useState(
    isEditMode ? (params.rarity as string) : "1"
  );
  const [quantity, setQuantity] = useState(
    isEditMode ? (params.quantity as string) : "1"
  );
  const [price, setPrice] = useState(
    isEditMode ? (params.price as string) : ""
  );

  const handleSubmit = async () => {
    try {
      const data = {
        type,
        name,
        rarity: parseInt(rarity),
        quantity: parseInt(quantity),
        price: parseFloat(price),
      };

      if (isEditMode) {
        await axios.put(
          `${getApiUrl()}/items/${params.type}/${params.id}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
      } else {
        await axios.post(`${getApiUrl()}/items`, data, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      router.replace("/(tabs)/collection");
    } catch (error) {
      Alert.alert(
        "Erreur",
        isEditMode
          ? "Impossible de modifier l'item"
          : "Impossible d'ajouter l'item"
      );
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 100 : 0}
    >
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.formContainer}>
          <Text style={styles.title}>
            {isEditMode ? "Modifier un item" : "Ajouter un item"}
          </Text>

          <View style={styles.form}>
            <View style={styles.pickersRow}>
              <View style={styles.pickerWrapper}>
                <Text style={styles.label}>Type :</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={type}
                    onValueChange={(value: string) => setType(value)}
                    enabled={!isEditMode}
                    style={[styles.picker, isEditMode && styles.disabledPicker]}
                  >
                    {ITEM_TYPES.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value}
                      />
                    ))}
                  </Picker>
                </View>
              </View>

              <View style={styles.pickerWrapper}>
                <Text style={styles.label}>Rareté :</Text>
                <View style={styles.pickerContainer}>
                  <Picker
                    selectedValue={rarity}
                    onValueChange={(value: string) => setRarity(value)}
                    style={styles.picker}
                  >
                    {RARITY_OPTIONS.map((item) => (
                      <Picker.Item
                        key={item.value}
                        label={item.label}
                        value={item.value.toString()}
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            </View>

            <Text style={styles.label}>Nom :</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="Nom de l'item"
              returnKeyType="done"
            />

            <View style={styles.inputsRow}>
              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Quantité :</Text>
                <TextInput
                  style={styles.input}
                  value={quantity}
                  onChangeText={setQuantity}
                  keyboardType="numeric"
                  placeholder="Quantité"
                  returnKeyType="done"
                />
              </View>

              <View style={styles.inputWrapper}>
                <Text style={styles.label}>Prix :</Text>
                <TextInput
                  style={styles.input}
                  value={price}
                  onChangeText={setPrice}
                  keyboardType="numeric"
                  placeholder="Prix en euros"
                  returnKeyType="done"
                />
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.submitButton]}
                onPress={handleSubmit}
              >
                <Text style={styles.buttonText}>
                  {isEditMode ? "Modifier" : "Ajouter"}
                </Text>
                <BounceAnimation
                  source={require("../assets/images/pokemon/pokemon_balls.gif")}
                  size={30}
                  duration={1500}
                  bounceHeight={8}
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={() => router.back()}
              >
                <Text style={styles.buttonText}>Annuler</Text>
                <BounceAnimation
                  source={require("../assets/images/pokemon/pokemon_balls.gif")}
                  size={30}
                  duration={1500}
                  bounceHeight={8}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollViewContent: {
    flexGrow: 1,
  },
  formContainer: {
    padding: 20,
    paddingBottom: 300,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    gap: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: "500",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#fff",
    marginBottom: 12,
  },
  pickersRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
    justifyContent: "space-between",
  },
  pickerWrapper: {
    width: "45%",
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  picker: {
    backgroundColor: "transparent",
  },
  disabledPicker: {
    opacity: 0.5,
  },
  buttonContainer: {
    gap: 10,
    marginTop: 20,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
  submitButton: {
    backgroundColor: "#3B4CCA",
  },
  cancelButton: {
    backgroundColor: "#FF0000",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inputsRow: {
    flexDirection: "row",
    gap: 10,
    marginBottom: 12,
  },
  inputWrapper: {
    flex: 1,
  },
});
