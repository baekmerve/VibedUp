import { View, Text, FlatList, Image, TouchableOpacity } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import EmptyState from "../components/EmptyState";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { router, useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";

const Search = () => {
  const { query } = useLocalSearchParams();

  const {
    savedContentId,
    searchPostResult,
    searchVideoResult,
    fetchSearchVideos,
    fetchSearchPosts,
    toggleSaveContent,
  } = useGlobalContext();

  const userContent = [
    ...searchVideoResult.map((item) => ({ ...item, type: "video" })),
    ...searchPostResult.map((item) => ({ ...item, type: "post" })),
  ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Searching for:", query);

        if (!query) {
          console.error("Missing search parameters");
          return;
        }

        await fetchSearchVideos(query);
        await fetchSearchPosts(query);
      } catch (error) {
        console.error("Error fetching search data:", error);
        alert("Failed to fetch search content.");
      }
    };
    // Call the async function
    if (query) fetchData();
  }, [query]);

   const handleBackToHome = () => {
     router.push("/"); // Navigate to the Home screen
   };

  return (
    <SafeAreaView className="bg-warmGray h-full">
      <FlatList
        data={userContent}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          if (item.type === "video") {
            return (
              <VideoCard
                createdAt={item.$createdAt}
                title={item.title}
                thumbnail={item.thumbnail}
                content={item.content}
                video={item.video}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
                savedContent={savedContentId.includes(item.$id)}
                onLikeToggle={() => toggleSaveContent(item.$id, "video")}
              />
            );
          }
          if (item.type === "post") {
            return (
              <PostCard
                createdAt={item.$createdAt}
                title={item.title}
                content={item.content}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
                coverImage={item.thumbnail}
                onLikeToggle={() => toggleSaveContent(item.$id, "post")}
                savedContent={savedContentId.includes(item.$id)}
              />
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <TouchableOpacity onPress={handleBackToHome}>
              <Image
                source={icons.leftArrow}
                resizeMode="contain"
                className="w-5 h-5 mb-3"
              />
            </TouchableOpacity>
            <Text className="font-pmedium text-sm text-brown ">
              Search results for:
            </Text>
            <Text className=" mt-2 text-2xl font-psemibold text-brown">
              "{query}"
            </Text>

            <View className="mt-4 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <EmptyState
            title="No Content Found"
            subtitle="No content found for this query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
