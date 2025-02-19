import { Platform } from "react-native";

export const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://127.0.0.1:5000";
  }
  return "http://192.168.1.105:5000";
};
