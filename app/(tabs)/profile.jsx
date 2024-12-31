import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  RefreshControl,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import EmptyState from "../components/EmptyState";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useGlobalContext } from "../../context/GlobalProvider";
import { icons } from "../../constants";
import InfoBox from "../components/InfoBox";
import EditModal from "../components/EditModal";
import { router } from "expo-router";

const Profile = () => {
  const {
    user,
    savedVideoId,
    savedPostId,
    toggleLikeVideo,
    userPosts,
    userVideos,
    fetchUserPostList,
    fetchUserVideoList,
    deleteContent,
    userLogout,
    commonRefresh,
    refreshing,
  } = useGlobalContext();

  //const [refreshing, setRefreshing] = useState(false);
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const userContent = [
    ...userVideos.map((item) => ({ ...item, type: "video" })),
    ...userPosts.map((item) => ({ ...item, type: "post" })),
  ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));

  const handleEditPress = (item) => {
    setSelectedItem({
      id: item.$id,
      type: item.type,
      title: item.title,
      content: item.content,
    });
    setModalVisible(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchUserPostList(user.$id);
        await fetchUserVideoList(user.$id);
      } catch (error) {
        console.error("Error fetching user data:", error);
        alert("Failed to fetch user content.");
      }
    };

    if (user) {
      fetchData(); // Call the async function only if `user` exists
    }
  }, [user]); // Dependency on `user`, ensuring the fetch is triggered when `user` changes.

  const onRefresh = () => {
    commonRefresh(async () => {
      await fetchUserPostList(user.$id);
      await fetchUserVideoList(user.$id);
    });
  };

  // Function to handle deletion
  const handleDelete = async (contentId, type) => {
    if (type === "post") {
      deleteContent(contentId, type, fetchUserPostList);
    } else {
      deleteContent(contentId, type, fetchUserVideoList);
    }
  };

  const handleLogout = async () => {
    await userLogout();
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
                onEdit={() => handleEditPress(item)}
                isCreator={item.creator.$id === user?.$id}
                savedPost={savedPostId.includes(item.$id)}
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
                savedVideo={savedVideoId.includes(item.$id)}
                onLikeToggle={() => toggleLikeVideo(item.$id)}
                avatar={item.creator.avatar}
                showLikeButton={false}
                showDeleteButton={item.creator.$id === user?.$id}
                onDelete={() => handleDelete(item.$id, "video")}
                onEdit={() => handleEditPress(item)}
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
            <View className=" w-full bg-blueGreen rounded-2xl justify-center items-center ">
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
                  title={userVideos.length || 0}
                  subtitle="Videos"
                  containerStyles="mx-5"
                  titleStyles="text-xl"
                />
                <InfoBox
                  title={userPosts.length || 0}
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
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
      {selectedItem && (
        <EditModal
          contentId={selectedItem.id}
          visible={isModalVisible}
          onClose={() => setModalVisible(false)}
          type={selectedItem.type}
          initialData={{
            title: selectedItem?.title || "",
            content: selectedItem?.content || "",
          }}
        />
      )}
    </SafeAreaView>
  );
};

export default Profile;
