import { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Platform,
  Button,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import { router } from "expo-router";
import axios, { AxiosError } from "axios";
import { useAuth } from "./context/AuthContext";

// Fonction pour obtenir l'URL de l'API
const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://127.0.0.1:5000";
  }
  return "http://172.20.10.3:5000";
};

export default function AuthModal() {
  const { setToken } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    try {
      const endpoint = isLogin ? "/login" : "/register";
      const data = isLogin
        ? { email, password }
        : { email, password, username };

      const response = await axios.post(`${getApiUrl()}${endpoint}`, data);

      if (isLogin && response.data.token) {
        setToken(response.data.token);
        router.replace("/(tabs)/collection");
      } else {
        setIsLogin(true);
      }
    } catch (err) {
      const error = err as AxiosError<{ error: string }>;
      setError(error.response?.data?.error || "Une erreur est survenue");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          {isLogin ? "Connexion" : "Inscription"}
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}

        {!isLogin && (
          <TextInput
            style={styles.input}
            placeholder="Nom d'utilisateur"
            value={username}
            onChangeText={setUsername}
          />
        )}

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />

        <TextInput
          style={styles.input}
          placeholder="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <Button
          title={isLogin ? "Se connecter" : "S'inscrire"}
          onPress={handleSubmit}
        />

        <Button
          title={
            isLogin
              ? "Pas de compte ? S'inscrire"
              : "Déjà un compte ? Se connecter"
          }
          onPress={() => setIsLogin(!isLogin)}
        />

        <Button title="Fermer" onPress={() => router.back()} />
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
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  error: {
    color: "red",
    marginBottom: 10,
    textAlign: "center",
  },
});
