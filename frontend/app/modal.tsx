import { useState, useEffect } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  TouchableOpacity,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import axios from "axios";
import { useAuth } from "./context/AuthContext";
import { getApiUrl } from "./utils/config";

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <Text style={styles.title}>
          {isEditMode ? "Modifier un item" : "Ajouter un item"}
        </Text>

        <View style={styles.form}>
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

          <Text style={styles.label}>Nom :</Text>
          <TextInput
            style={styles.input}
            value={name}
            onChangeText={setName}
            placeholder="Nom de l'item"
            returnKeyType="done"
          />

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

          <Text style={styles.label}>Quantité :</Text>
          <TextInput
            style={styles.input}
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholder="Quantité"
            returnKeyType="done"
          />

          <Text style={styles.label}>Prix :</Text>
          <TextInput
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="Prix en euros"
            returnKeyType="done"
          />

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={[styles.button, styles.submitButton]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonText}>
                {isEditMode ? "Modifier" : "Ajouter"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={() => router.back()}
            >
              <Text style={styles.buttonText}>Annuler</Text>
            </TouchableOpacity>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  form: {
    gap: 8,
    paddingBottom: 40,
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
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    marginBottom: 12,
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
    marginTop: 10,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  submitButton: {
    backgroundColor: "#4a90e2",
  },
  cancelButton: {
    backgroundColor: "#e74c3c",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
