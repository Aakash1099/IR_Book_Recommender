import React from "react";
import { FlatList } from "react-native";
import { Book } from "../types/Book";
import { BookCard } from "./BookCard";

interface Props {
  recommendations: Book[];
  onPress?: (book: Book) => void;
}

export const RecommendedCarousel: React.FC<Props> = ({ recommendations, onPress }) => {
  return (
    <FlatList
      data={recommendations}
      horizontal
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <BookCard book={item} onPress={() => onPress?.(item)} />
      )}
      contentContainerStyle={{ paddingRight: 16 }}
    />
  );
};
