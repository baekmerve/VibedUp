import { View, Text, FlatList} from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import EmptyState from "../components/EmptyState";
import { searchPosts, searchVideos } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useLocalSearchParams } from "expo-router";

const Search = () => {
  const { query } = useLocalSearchParams();

  const { data: videos, refetch: refetchVideos } = useAppwrite(() =>
    searchVideos(query)
  );

    const { data: posts, refetch: refetchPosts } = useAppwrite(() =>
      searchPosts(query)
    );

     const userContent = [
       ...videos.map((item) => ({ ...item, type: "video" })),
       ...posts.map((item) => ({ ...item, type: "post" })),
     ];


  useEffect(() => {
    refetchVideos();
    refetchPosts();
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
                title={item.title}
                thumbnail={item.thumbnail}
                content={item.content}
                video={item.video}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
              />
            );
          }
          if (item.type === "post") {
            return (
              <PostCard
                title={item.title}
                content={item.content}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
             
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
              {query}
            </Text>

            <View className="mt-4 mb-8">
              <SearchInput initialQuery={query} />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="No videos found for this query"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Search;
