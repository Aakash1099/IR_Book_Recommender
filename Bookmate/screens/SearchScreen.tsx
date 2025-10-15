import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  Text,
  StyleSheet,
  ActivityIndicator,
  Keyboard,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { searchBooksByTitle } from "../services/api";
import { BookCard } from "../components/BookCard";
import { Book } from "../types/Book";

type SearchNavigationProp = NativeStackNavigationProp<RootStackParamList, "Search">;

export const SearchScreen = () => {
  const navigation = useNavigation<SearchNavigationProp>();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<(Book & { score?: number })[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    Keyboard.dismiss();

    try {
      const res = await searchBooksByTitle(query, 20);
      setResults(res);
    } catch (err) {
      console.error("Search API error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search books..."
        value={query}
        onChangeText={setQuery}
        onSubmitEditing={handleSearch}
        returnKeyType="search"
      />
      {loading && <ActivityIndicator size="large" color="#007AFF" style={{ marginTop: 20 }} />}
      {!loading && results.length === 0 && query !== "" && (
        <Text style={styles.noResults}>No results found.</Text>
      )}

      <FlatList
        data={results}
        keyExtractor={(item) => item.key}
        numColumns={2} // 2x2 grid
        columnWrapperStyle={styles.row} // spacing between columns
        renderItem={({ item }) => (
          <BookCard
            book={{ ...item, similarity: item.score }} // show relevance as percentage
            onPress={() =>
              navigation.navigate("BookDetails", { bookKey: item.key, bookTitle: item.title })
            }
          />
        )}
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
    backgroundColor: "#fdfdfd",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 16,
  },
  noResults: {
    textAlign: "center",
    color: "#777",
    marginTop: 20,
    fontSize: 16,
  },
  row: {
    justifyContent: "space-between",
    marginBottom: 16,
  },
});
