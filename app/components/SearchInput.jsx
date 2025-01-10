import {
  View,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import { router, usePathname } from "expo-router";

const SearchInput = ({ initialQuery }) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || "");

  const handleSearchPress = () => {
    if (!query.trim()) {
      Alert.alert("Missing query", "Please input something to search.");
      return;
    }
    if (pathname.startsWith("/search")) {
      // Update params if already on search page
      router.setParams({ query });
    } else {
      // Navigate to the search page with query
      router.push(`/search/${query}`);
    }
  };

  const handleTextChange = (text) => {
    if (text !== query) {
      setQuery(text);
    }
  };

  return (
    <View className=" w-full h-16 px-4 bg-brown rounded-2xl items-center flex-row space-x-4">
      <TextInput
        className="flex-1  text-white font-pregular mt-0.5"
        value={query}
        placeholder="Search for a video"
        placeholderTextColor="#DADADA"
        onChangeText={handleTextChange}
      />
      <TouchableOpacity onPress={handleSearchPress}>
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
