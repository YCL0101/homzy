import React, { useContext, useMemo } from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { AuthContext } from "../../contexts/AuthContext";

const TagItem = React.memo(({ item, onPress }) => (
  <TouchableOpacity style={styles.tag} onPress={onPress}>
    <Text style={styles.tagText}>{item.name}</Text>
  </TouchableOpacity>
));

export default function Classification() {
  const { gameTags } = useContext(AuthContext);
  const navigation = useNavigation();

  const formattedTags = useMemo(() => {
    return gameTags.reduce((acc, item, index) => {
      const chunkIndex = Math.floor(index / 5);
      if (!acc[chunkIndex]) {
        acc[chunkIndex] = [];
      }
      acc[chunkIndex].push(item);
      return acc;
    }, []);
  }, [gameTags]);

  const renderItem = ({ item }) => (
    <View style={styles.tagRow}>
      {item.map((tag) => (
        <TagItem
          key={tag.name}
          item={tag}
          onPress={() =>
            navigation.navigate("Search", { searchText: tag.name })
          }
        />
      ))}
    </View>
  );

  return (
    <FlatList
      data={formattedTags}
      renderItem={renderItem}
      keyExtractor={(item, index) => index.toString()}
      contentContainerStyle={{ backgroundColor: "white" }}
    />
  );
}

const styles = StyleSheet.create({
  tagRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    alignItems: "center",
  },
  tag: {
    margin: 5,
    padding: 5,
    backgroundColor: "#ddd",
    borderRadius: 5,
    minWidth: 50,
    textAlign: "center",
  },
  tagText: {
    fontSize: 10,
    textAlign: "center",
  },
});
