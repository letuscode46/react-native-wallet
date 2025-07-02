import { Text, View, StyleSheet } from "react-native";
import { Link } from "expo-router";
import { Image } from "expo-image";  // This is fine if you plan to use Image later

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.headings}>
        Edit app/index.tsx to edit this screen. 123
      </Text>
      <Link href="/about"> About </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "purple",
  },

  headings: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    marginBottom: 20,
  },
});
