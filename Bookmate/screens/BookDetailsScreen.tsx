import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, StyleSheet, FlatList } from "react-native";
import { RouteProp, useRoute, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "../types/navigation";
import { fetchBookDetails, fetchSimilarBooks } from "../services/api";
import { BookCard } from "../components/BookCard";
import { Book } from "../types/Book";

type BookDetailsRouteProp = RouteProp<RootStackParamList, "BookDetails">;

export const BookDetailsScreen = () => {
  const route = useRoute<BookDetailsRouteProp>();
  const navigation = useNavigation<any>();
  const { bookKey, bookTitle } = route.params;

  const [book, setBook] = useState<Book | null>(null);
  const [similarBooks, setSimilarBooks] = useState<(Book & { similarity?: number })[]>([]);

  useEffect(() => {
    const load = async () => {
      const details = await fetchBookDetails(bookKey);
      setBook(details);

      if (details) {
        const similar = await fetchSimilarBooks(bookKey, 10);
        setSimilarBooks(similar.filter(b => b.key !== bookKey));
      }
    };
    load();
  }, [bookKey]);

  if (!book) return <Text>Loading book details...</Text>;

  return (
    <ScrollView style={styles.container}>
      <Image
        source={{ uri: book.coverUrl || "https://via.placeholder.com/200x300.png" }}
        style={styles.cover}
      />
      <Text style={styles.title}>{book.title}</Text>
      <Text style={styles.author}>
        {book.authors?.map(a => a.name).join(", ") || "Unknown Author"}
      </Text>
      <Text style={styles.publish}>📅 {book.publish_date || "Unknown Date"}</Text>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Similar Books</Text>
        <FlatList
          horizontal
          data={similarBooks}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => (
            <BookCard
              book={item}
              onPress={() => navigation.navigate("BookDetails", { bookKey: item.key, bookTitle: item.title })}
            />
          )}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fdfdfd", padding: 16 },
  cover: { width: "100%", height: 300, borderRadius: 10, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "700", marginBottom: 6 },
  author: { fontSize: 18, color: "#555", marginBottom: 6 },
  publish: { fontSize: 14, color: "#777", marginBottom: 16 },
  section: { marginTop: 20 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 10 },
});
