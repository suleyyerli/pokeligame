import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ImageSourcePropType,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

type CardItemProps = {
  item: {
    id: number;
    type: "card" | "booster" | "display";
    name: string;
    rarity: number;
    quantity: number;
    price: number;
  };
  onEdit: (item: any) => void;
  onDelete: (item: any) => void;
};

// Fonction pour obtenir la couleur en fonction du type
const getTypeColor = (type: string) => {
  switch (type) {
    case "card":
      return "#FF5D5D"; // Rouge Pokémon
    case "booster":
      return "#5DB9FF"; // Bleu Pokémon
    case "display":
      return "#A1E65A"; // Vert Pokémon
    default:
      return "#FF5D5D";
  }
};

// Fonction pour obtenir l'image en fonction du type
const getTypeImage = (type: string): ImageSourcePropType => {
  switch (type) {
    case "card":
      return require("../../assets/images/pokemon/pixel_charizard.gif");
    case "booster":
      return require("../../assets/images/pokemon/animated_blastoise.gif");
    case "display":
      return require("../../assets/images/pokemon/venusaur.png");
    default:
      return require("../../assets/images/pokemon/pokeball.png");
  }
};

export const CardItem = ({ item, onEdit, onDelete }: CardItemProps) => {
  const typeColor = getTypeColor(item.type);

  // Nouvelle logique de formatage du prix
  const formattedPrice = () => {
    if (typeof item.price === "number") {
      return item.price.toFixed(2);
    }
    // Si c'est une chaîne de caractères, on essaie de la convertir en nombre
    if (typeof item.price === "string") {
      const numPrice = parseFloat(item.price);
      return isNaN(numPrice) ? "0.00" : numPrice.toFixed(2);
    }
    return "0.00";
  };

  return (
    <View
      style={[styles.card, { borderLeftColor: typeColor, borderLeftWidth: 6 }]}
    >
      <View style={styles.cardActions}>
        <TouchableOpacity
          onPress={() => onEdit(item)}
          style={styles.editButton}
        >
          <Ionicons name="pencil" size={24} color="#4a90e2" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => onDelete(item)}
          style={styles.deleteButton}
        >
          <Ionicons name="trash" size={24} color="red" />
        </TouchableOpacity>
      </View>
      <View style={styles.cardContent}>
        <Image
          source={getTypeImage(item.type)}
          style={styles.cardImage}
          resizeMode="contain"
        />
        <View style={styles.cardInfo}>
          <Text style={styles.cardName}>{item.name}</Text>
          <View style={[styles.typeContainer, { backgroundColor: typeColor }]}>
            <Text style={styles.typeText}>{item.type.toUpperCase()}</Text>
          </View>
          <Text style={styles.cardRarity}>{"⭐".repeat(item.rarity)}</Text>
          <Text style={styles.cardDetails}>
            <Text style={styles.label}>Quantité:</Text> {item.quantity}
          </Text>
          <Text style={styles.cardDetails}>
            <Text style={styles.label}>Prix:</Text> {formattedPrice()} €
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    padding: 16,
    backgroundColor: "#FFFFFF",
    marginBottom: 12,
    borderRadius: 12,
    width: "100%",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    position: "relative",
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    marginBottom: 40,
  },
  cardImage: {
    width: 80,
    height: 80,
    marginRight: 16,
  },
  cardInfo: {
    flex: 1,
  },
  cardName: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#2c3e50",
  },
  typeContainer: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    alignSelf: "flex-start",
    marginBottom: 8,
  },
  typeText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 14,
  },
  cardDetails: {
    marginBottom: 6,
    color: "#666",
    fontSize: 16,
  },
  label: {
    fontWeight: "600",
    color: "#2c3e50",
  },
  cardRarity: {
    color: "#f1c40f",
    marginBottom: 8,
    fontSize: 18,
  },
  cardActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    position: "absolute",
    right: 12,
    bottom: 12,
    zIndex: 1,
  },
  editButton: {
    padding: 8,
    backgroundColor: "#e8f4f8",
    borderRadius: 8,
  },
  deleteButton: {
    padding: 8,
    backgroundColor: "#fde8e8",
    borderRadius: 8,
  },
});
