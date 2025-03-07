import { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Button,
  Platform,
  Alert,
} from "react-native";
import axios from "axios";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import { CardItem } from "../components/CardItem";
import { getApiUrl } from "../utils/config";

// Définition du type pour une carte
type Card = {
  id: number;
  type: "card" | "booster" | "display";
  name: string;
  rarity: number;
  quantity: number;
  price: number;
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
          <CardItem item={item} onEdit={handleEdit} onDelete={deleteItem} />
        )}
        contentContainerStyle={{ paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingHorizontal: 16,
    marginBottom: 16,
    marginTop: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    color: "#2c3e50",
    textAlign: "center",
    width: "100%",
  },
});
