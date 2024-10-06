import { Platform, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";
import Constants from "expo-constants";

export default function HomeScreen() {
  return (
    <WebView
      style={styles.container}
      source={{ uri: "https://idsp-2-circles.fly.dev/" }}
      userAgent={
        Platform.OS === "android"
          ? "Chrome/18.0.1025.133 Mobile Safari/535.19"
          : "AppleWebKit/602.1.50 (KHTML, like Gecko) CriOS/56.0.2924.75"
      }
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: "absolute",
  },
  container: {
    flex: 1,
    marginTop: Constants.statusBarHeight,
  },
});
