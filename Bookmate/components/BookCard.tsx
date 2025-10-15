import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native";
import { Book } from "../types/Book";

interface Props {
  book: Book & { similarity?: number };
  onPress?: () => void;
}

const { width } = Dimensions.get("window");

export const BookCard: React.FC<Props> = ({ book, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.8}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: book.coverUrl || "https://via.placeholder.com/120x180.png?text=No+Cover" }}
          style={styles.cover}
        />
        {book.similarity !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{(book.similarity * 100).toFixed(0)}%</Text>
          </View>
        )}
      </View>
      <Text style={styles.title} numberOfLines={2}>{book.title}</Text>
      <Text style={styles.author} numberOfLines={1}>
        {book.authors?.map(a => a.name).join(", ") || "Unknown Author"}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    width: width * 0.33, // 1/3rd of screen
    marginRight: 12,
  },
  imageContainer: {
    position: "relative",
    marginBottom: 6,
  },
  cover: {
    width: "100%",
    height: 180,
    borderRadius: 10,
    backgroundColor: "#eee",
  },
  badge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "#007AFF",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
  },
  title: {
    fontWeight: "bold",
    fontSize: 14,
    color: "#111",
    marginBottom: 2,
  },
  author: {
    fontSize: 12,
    color: "#555",
  },
});
