import {
  View,
  Text,
  FlatList,
  Image,
  RefreshControl,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../components/SearchInput";
import Trending from "../components/Trending";
import EmptyState from "../components/EmptyState";
import {
  deleteUserPost,
  deleteUserVideo,
  fetchAllPosts,
  fetchAllVideos,
  fetchLatestVideos,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import PostCard from "../components/PostCard";

const Home = () => {
  const { data: videos, refetch: refetchVideos } = useAppwrite(fetchAllVideos);
  const { data: posts, refetch: refetchPosts } = useAppwrite(fetchAllPosts);

  const { data: latestPosts, refetch: refetchLatestPosts } =
    useAppwrite(fetchLatestVideos);

  const { user, likedVideos, toggleLike } = useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);

  const userContent = [
    ...videos.map((item) => ({ ...item, type: "video" })),
    ...posts.map((item) => ({ ...item, type: "post" })),
  ];

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchVideos();
    await refetchPosts(); // Refetch all videos
    await refetchLatestPosts(); // Refetch latest posts
    setRefreshing(false);
  };

  // Function to handle deletion
    const handleDelete = async (contentId, type) => {
      try {
        console.log(contentId);
        Alert.alert(
          "Delete Content",
          `Are you sure you want to delete this ${type}?`,
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: async () => {
                if (type === "video") {
                  await deleteUserVideo(user.$id, contentId); // Call delete API for video
                  await refetchVideos();
                } else if (type === "post") {
                  await deleteUserPost(user.$id, contentId); // Call delete API for post
                  await refetchPosts();
                }
                alert(`${type} deleted successfully`);
              },
            },
          ]
        );
      } catch (error) {
        alert(error.message);
      }
    };

  return (
    <SafeAreaView className="bg-paper h-full ">
      <FlatList
        data={userContent}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => {
          if (item.type === "post") {
            return (
              <PostCard
                title={item.title}
                content={item.content}
                creatorName={item.creator.username}
                avatar={item.creator.avatar}
                onDelete={() => handleDelete(item.$id, "post")}
                isCreator={item.creator.$id === user?.$id}
              />
            );
          }
          if (item.type === "video") {
            return (
              <View className="flex relative">
                <VideoCard
                  title={item.title}
                  content={item.content}
                  thumbnail={item.thumbnail}
                  video={item.video}
                  creatorName={item.creator.username}
                  avatar={item.creator.avatar}
                  savedVideo={likedVideos.includes(item.$id)}
                  onLikeToggle={() => toggleLike(item.$id)}
                  showLikeButton={item.creator.$id !== user?.$id}
                  onDelete={() => handleDelete(item.$id)}
                  isCreator={item.creator.$id === user?.$id}
                />
              </View>
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="flex my-4 px-4 space-y-4 ">
            <View className="flex justify-between items-start flex-row mb-2">
              <View>
                <Text className="font-pmedium text-sm text-brown">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-brown">
                  {user?.username}
                </Text>
              </View>
              <View className="">
                <Image
                  source={images.logo}
                  className="w-24 h-16"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1  pb-4">
              <Text className="text-brown text-lg font-pregular mb-4">
                Trending Videos
              </Text>
              {/* //desc: if there is no trending video, it wont break with ?? [] */}

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <EmptyState
            title="No Videos Found"
            subtitle="Be the first one to upload a video"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default Home;
