import React, { useEffect, useState, useContext } from "react";
import { View, Switch, StyleSheet,Text } from "react-native";
import { AuthContext } from "../contexts/AuthContext.js";
export default function App() {
  const { isEnabled, setIsEnabled } = useContext(AuthContext);
  const toggleSwitch = () => setIsEnabled((previousState) => !previousState);
  // useEffect(() => {
  //   console.log("isEnabled", isEnabled);
  // }, [isEnabled]);
  return (
    <View style={styles.container}>
      <View style={styles.BrowserDownload}>
        <Text>浏览器下载</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleSwitch}
          value={isEnabled}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    // justifyContent: "center",
    backgroundColor: "#fff",
  },BrowserDownload:{
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    height: 50,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingLeft: 20,
    paddingRight: 20,
  }
});
