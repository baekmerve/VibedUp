import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Alert,
  Text,
} from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import {
  deleteUserPost,
  deleteUserVideo,
  getUserPosts,
  getUserVideos,
  logout,
} from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../components/InfoBox";
import { router } from "expo-router";

const Profile = () => {
  const { user, setUser, likedVideos, toggleLike, setIsLoggedIn } =
    useGlobalContext();

  const { data: videos = [], refetch: refetchUserVideos } = useAppwrite(() =>
    getUserVideos(user.$id)
  );
  const { data: posts = [], refetch: refetchUserPosts } = useAppwrite(() =>
    getUserPosts(user.$id)
  );

  // Combine videos and posts
  const userContent = [
    ...videos.map((item) => ({ ...item, type: "video" })),
    ...posts.map((item) => ({ ...item, type: "post" })),
  ];

  // Function to handle deletion
  const handleDelete = async (contentId, type) => {
    try {
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
                await refetchUserVideos();
              } else if (type === "post") {
                await deleteUserPost(user.$id, contentId); // Call delete API for post
                await refetchUserPosts();
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

  const handleLogout = async () => {
    await logout();
    setUser(null);
    setIsLoggedIn(false);
    router.replace("/sign-in");
  };

  return (
    <SafeAreaView className="bg-paper h-full">
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
              <VideoCard
                title={item.title}
                content={item.content}
                thumbnail={item.thumbnail}
                video={item.video}
                creatorName={item.creator.username}
                savedVideo={likedVideos.includes(item.$id)}
                onLikeToggle={() => toggleLike(item.$id)}
                avatar={item.creator.avatar}
                showLikeButton={false}
                showDeleteButton={item.creator.$id === user?.$id}
                onDelete={() => handleDelete(item.$id, "video")}
                isCreator={item.creator.$id === user?.$id}
              />
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4 ">
            <TouchableOpacity
              className=" w-full items-end mb-10"
              onPress={handleLogout}
            >
              <View className="flex-row font-bold justify-center items-center gap-2">
                <Text className="font-psemibold">Logout</Text>
                <Image
                  source={icons.logout}
                  resizeMode="contain"
                  className="w-7 h-7"
                />
              </View>
            </TouchableOpacity>
            <View className=" w-full bg-[#72ACB1] rounded-2xl justify-center items-center ">
              <View className=" mt-3">
                <Image
                  source={{ uri: user?.avatar }}
                  className="w-32 h-32 rounded-full"
                  resizeMode="cover"
                />
                <InfoBox
                  title={user?.username}
                  containerStyles="mt-2"
                  titleStyles="text-lg"
                />
              </View>

              <View className="mb-4 flex-row justify-center items-center  align-middle ">
                <InfoBox
                  title={videos.length || 0}
                  subtitle="Videos"
                  containerStyles="mx-5"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title={posts.length || 0}
                  subtitle="Posts"
                  containerStyles="mx-5"
                  titleStyles="text-xl"
                />
              </View>
            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState
            title="No Content Found"
            subtitle="No videos or posts found for this user"
          />
        )}
      />
    </SafeAreaView>
  );
};

export default Profile;
