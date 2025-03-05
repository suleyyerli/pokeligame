import { Platform } from "react-native";

export const getApiUrl = () => {
  if (Platform.OS === "web") {
    return "http://127.0.0.1:5000";
  }
  return "http://172.20.10.3:5000";
};
