import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LineChart, PieChart } from "react-native-chart-kit";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { getApiUrl } from "../utils/config";

const { width } = Dimensions.get("window");

interface CollectionStats {
  cards: { count: number; quantity: number; value: number };
  boosters: { count: number; quantity: number; value: number };
  displays: { count: number; quantity: number; value: number };
  total_value: number;
}

export default function StatsScreen() {
  const [stats, setStats] = useState<CollectionStats | null>(null);
  const [loading, setLoading] = useState(true);
  const { token } = useAuth();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(`${getApiUrl()}/collection/total`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setStats(response.data);
    } catch (error) {
      console.error("Erreur lors de la récupération des statistiques:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (!stats) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Erreur lors du chargement des statistiques
        </Text>
      </View>
    );
  }

  const pieChartData = [
    {
      name: "Cartes",
      value: stats.cards.value,
      color: "#FF5D5D",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Boosters",
      value: stats.boosters.value,
      color: "#5DB9FF",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
    {
      name: "Displays",
      value: stats.displays.value,
      color: "#A1E65A",
      legendFontColor: "#7F7F7F",
      legendFontSize: 15,
    },
  ];

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Statistiques de la Collection</Text>
        <Text style={styles.totalValue}>
          Valeur Totale: {stats.total_value.toFixed(2)}€
        </Text>
      </View>

      <View style={styles.chartContainer}>
        <Text style={styles.chartTitle}>Répartition de la Valeur</Text>
        <PieChart
          data={pieChartData}
          width={width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#ffffff",
            backgroundGradientFrom: "#ffffff",
            backgroundGradientTo: "#ffffff",
            color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
          }}
          accessor="value"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Cartes</Text>
          <Text style={styles.statText}>Nombre: {stats.cards.count}</Text>
          <Text style={styles.statText}>Quantité: {stats.cards.quantity}</Text>
          <Text style={styles.statText}>
            Valeur: {stats.cards.value.toFixed(2)}€
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Boosters</Text>
          <Text style={styles.statText}>Nombre: {stats.boosters.count}</Text>
          <Text style={styles.statText}>
            Quantité: {stats.boosters.quantity}
          </Text>
          <Text style={styles.statText}>
            Valeur: {stats.boosters.value.toFixed(2)}€
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statTitle}>Displays</Text>
          <Text style={styles.statText}>Nombre: {stats.displays.count}</Text>
          <Text style={styles.statText}>
            Quantité: {stats.displays.quantity}
          </Text>
          <Text style={styles.statText}>
            Valeur: {stats.displays.value.toFixed(2)}€
          </Text>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  header: {
    padding: 20,
    backgroundColor: "#ffffff",
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  totalValue: {
    fontSize: 20,
    color: "#2ecc71",
    fontWeight: "bold",
  },
  chartContainer: {
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 10,
  },
  chartTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statsContainer: {
    padding: 10,
  },
  statCard: {
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  statTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  statText: {
    fontSize: 16,
    marginBottom: 5,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    textAlign: "center",
    marginTop: 20,
  },
});
