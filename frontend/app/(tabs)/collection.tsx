import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Platform,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";

// Définition du type pour une carte
type Card = {
  id: number;
  name: string;
  rarity: number;
  quantity: number;
  price: number;
};

// Fonction pour obtenir l'URL de l'API
const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://127.0.0.1:5000";
  }
  // Adresse IP de votre ordinateur sur le réseau local
  return "http://192.168.1.105:5000";
};

export default function Collection() {
  const { token, isAuthenticated } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/auth-modal");
      return;
    }

    axios
      .get(`${getApiUrl()}/cards`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => setCards(response.data))
      .catch((error) =>
        console.error("Erreur lors de la récupération des cartes :", error)
      );
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <Button title="Ajouter un item" onPress={() => router.push("/modal")} />
      <Text style={styles.title}>Ma Collection Pokemon</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text>Nom: {item.name}</Text>
            <Text>Rareté: {item.rarity} étoiles</Text>
            <Text>Quantité: {item.quantity}</Text>
            <Text>Prix: {item.price} €</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, alignItems: "center" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 16 },
  card: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderRadius: 8,
  },
});
