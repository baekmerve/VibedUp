import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import VideoCard from "../components/VideoCard";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import PostCard from "../components/PostCard";

const Saved = () => {
  const {
    user,
    toggleLikeVideo,
    toggleLikePost,
    fetchUserLikedVideos,
    fetchUserLikedPosts,
    likedVideoList,
    likedPostList,
    savedVideoId,
    savedPostId,
    commonRefresh,
    refreshing,
  } = useGlobalContext();

  const userContent = [
    ...likedVideoList.map((item) => ({ ...item, type: "video" })),
    ...likedPostList.map((item) => ({ ...item, type: "post" })),
  ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

  const onRefresh = () => {
    commonRefresh(async () => {
      await fetchUserLikedVideos(user.$id);
      await fetchUserLikedPosts(user.$id);
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserLikedVideos();
        await fetchUserLikedPosts();
      } catch (error) {
        console.error("Error fetching saved data:", error);
        alert("Failed to fetch saved content.");
      }
    };

    fetchData(); // Call the async function
  }, []); // Only run once on mount since it doesn’t have dependencies.

  return (
    <SafeAreaView className="bg-paper h-full">
      <FlatList
        data={userContent}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          if (item.type === "post") {
            return (
              <PostCard
                createdAt={item.$createdAt}
                title={item.title}
                content={item.content}
                creatorName={item.creator.username}
                coverImage={item.thumbnail}
                avatar={item.creator.avatar}
                onLikeToggle={() => toggleLikePost(item.$id)}
                savedPost={savedPostId.includes(item.$id)}
                showLikeButton={true}
              />
            );
          }
          if (item.type === "video") {
            return (
              <VideoCard
                createdAt={item.$createdAt}
                title={item.title}
                content={item.content}
                thumbnail={item.thumbnail}
                video={item.video}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
                savedVideo={savedVideoId.includes(item.$id)}
                onLikeToggle={() => toggleLikeVideo(item.$id)}
                showLikeButton={true}
              />
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="mt-6 mb-2 px-4">
            <Text className="text-2xl text-gray-700 font-psemibold">
              Saved Videos & Posts
            </Text>

            <View className="mt-6 mb-8 ">
              <SearchInput />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <View className="justify-center items-center px-4 ">
            <Image
              source={images.empty}
              className="w-[270px] h-[215px]"
              resizeMode="contain"
            />
            <Text className="text-xl text-center font-psemibold text-gray-700 mt-2">
              No Saved Content
            </Text>
            <Text className="font-pmedium text-sm text-gray-700">
              You haven't save any content
            </Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Saved;
