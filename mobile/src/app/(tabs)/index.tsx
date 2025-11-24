import { useAuth } from "@/src/lib/AuthContext";
import { Link } from "expo-router";
import {  TouchableOpacity, View } from "react-native";
import { Text } from "react-native-paper";

export default function Index() {

  const {logout} = useAuth();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Link href={"/auth"}>Auth Page</Link>
      <TouchableOpacity onPress={logout}><Text>Logout</Text></TouchableOpacity>
    </View>
  );
}
