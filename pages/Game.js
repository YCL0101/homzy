import React from "react";
import { View, Text, ScrollView, StyleSheet } from "react-native";
import GameDetails from "../components/GameDetails/GameDetails";
export default function Game(route) {
  // console.log('route', route);
  const { gameID } = route.route.params;

  return (
    <ScrollView >
        <GameDetails gameID={gameID} />
    </ScrollView>
  );
}
const styles = StyleSheet.create({
  // container: { width: "100%", height: "100%", blackgroundColor: "gray" },
});
