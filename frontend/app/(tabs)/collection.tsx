import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Platform,
  TouchableOpacity,
  Alert,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { Ionicons } from "@expo/vector-icons";

// Définition du type pour une carte
type Card = {
  id: number;
  type: "card" | "booster" | "display";
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
  return "http://172.20.10.3:5000";
};

export default function Collection() {
  const { token, isAuthenticated, logout } = useAuth();
  const [cards, setCards] = useState<Card[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const deleteItem = async (item: Card) => {
    try {
      const response = await axios({
        method: "delete",
        url: `${getApiUrl()}/items/${item.type}/${item.id}`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        setCards((prevCards) =>
          prevCards.filter((card) => card.id !== item.id)
        );
        Alert.alert("Succès", "Item supprimé avec succès");
      }
    } catch (error) {
      console.error("Erreur de suppression:", error);
      Alert.alert("Erreur", "Impossible de supprimer l'item");
    }
  };

  const handleEdit = (item: Card) => {
    router.push({
      pathname: "/modal",
      params: { mode: "edit", ...item },
    });
  };

  useEffect(() => {
    if (!isAuthenticated && !isLoading) {
      router.replace("/auth-modal");
      return;
    }

    if (isAuthenticated) {
      axios
        .get(`${getApiUrl()}/items`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => setCards(response.data))
        .catch((error) =>
          console.error("Erreur lors de la récupération des cartes :", error)
        )
        .finally(() => setIsLoading(false));
    }
  }, [isAuthenticated, token]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Button title="Ajouter un item" onPress={() => router.push("/modal")} />
        <Button title="Se déconnecter" onPress={logout} color="red" />
      </View>
      <Text style={styles.title}>Ma Collection Pokemon</Text>
      <FlatList
        data={cards}
        keyExtractor={(item) => `${item.type}-${item.id}`}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardContent}>
              <View>
                <Text>Type: {item.type}</Text>
                <Text>Nom: {item.name}</Text>
                <Text>Rareté: {"⭐".repeat(item.rarity)}</Text>
                <Text>Quantité: {item.quantity}</Text>
                <Text>Prix: {item.price} €</Text>
              </View>
              <View style={styles.cardActions}>
                <TouchableOpacity
                  onPress={() => handleEdit(item)}
                  style={styles.editButton}
                >
                  <Ionicons name="pencil" size={24} color="#4a90e2" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteItem(item)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash" size={24} color="red" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    padding: 12,
    backgroundColor: "#FFFFFF",
    marginBottom: 8,
    borderRadius: 8,
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  editButton: {
    padding: 8,
  },
  deleteButton: {
    padding: 8,
  },
});
