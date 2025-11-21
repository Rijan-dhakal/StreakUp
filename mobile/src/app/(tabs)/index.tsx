import { Link } from "expo-router";
import {  View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={"/auth"}>Auth Page</Link>
    </View>
  );
}
