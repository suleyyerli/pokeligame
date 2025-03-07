import { Platform } from "react-native";

export const getApiUrl = () => {
  const baseUrl =
    Platform.OS === "web"
      ? "http://127.0.0.1:5000"
      : "http://192.168.1.105:5000";
  return `${baseUrl}/api`;
};
