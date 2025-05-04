import { Platform } from "react-native";

export const getApiUrl = () => {
  const baseUrl =
    Platform.OS === "web" ? "http://127.0.0.1:5000" : "http://172.20.10.3:5000";
  return `${baseUrl}/api`;
};
