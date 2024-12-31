import { View, Text, FlatList } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import EmptyState from "../components/EmptyState";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useLocalSearchParams } from "expo-router";
import { useGlobalContext } from "../../context/GlobalProvider";

const Search = () => {
  const { query } = useLocalSearchParams();

  const {
    toggleLikeVideo,
    toggleLikePost,
    savedVideoId,
    savedPostId,
    searchPostResult,
    searchVideoResult,
    fetchSearchVideos,
    fetchSearchPosts,
    refreshing,
  } = useGlobalContext();

  const userContent = [
    ...searchVideoResult.map((item) => ({ ...item, type: "video" })),
    ...searchPostResult.map((item) => ({ ...item, type: "post" })),
  ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!refreshing) {
          await fetchSearchVideos(query);
          await fetchSearchPosts(query);
        }
      } catch (error) {
        console.error("Error fetching search data:", error);
        alert("Failed to fetch search content.");
      }
    };

    fetchData(); // Call the async function
  }, [query]);

  return (
    <SafeAreaView className="bg-paper h-full">
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
                savedVideo={savedVideoId.includes(item.$id)}
                onLikeToggle={() => toggleLikeVideo(item.$id)}
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
                onLikeToggle={() => toggleLikePost(item.$id)}
                savedPost={savedPostId.includes(item.$id)}
              />
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="font-pmedium text-sm text-brown">
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
