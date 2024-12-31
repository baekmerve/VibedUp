import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../components/SearchInput";
import Trending from "../components/Trending";
import EmptyState from "../components/EmptyState";
import EditModal from "../components/EditModal";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const {
    user,
    savedVideoId,
    savedPostId,
    toggleLikeVideo,
    toggleLikePost,
    videos,
    posts,
    latestPosts,
    fetchAllVideoContent,
    fetchAllPostContent,
    fetchLatestVideoContent,
    deleteContent,
    commonRefresh,
    refreshing,
  } = useGlobalContext();

  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  const userContent = React.useMemo(() => {
    return [
      ...videos.map((item) => ({ ...item, type: "video" })),
      ...posts.map((item) => ({ ...item, type: "post" })),
    ].sort((a, b) => new Date(b.$createdAt) - new Date(a.$createdAt));
  }, [videos, posts]); // Recompute only when videos or posts change

  const handleEditPress = (item) => {
    setSelectedItem({
      id: item.$id,
      type: item.type,
      title: item.title,
      content: item.content,
    });
    setModalVisible(true);
  };

  // Function to handle deletion
  const handleDelete = async (contentId, type) => {
    if (type === "post") {
      deleteContent(contentId, type, fetchAllPostContent);
    } else {
      deleteContent(contentId, type, fetchAllVideoContent);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!refreshing) {
          await Promise.all([
            fetchLatestVideoContent(),
            fetchAllVideoContent(),
            fetchAllPostContent(),
          ]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        alert("Failed to fetch home content.");
      }
    };

    fetchData(); // Call the async function
  }, []);

  const onRefresh = async () => {
    if (refreshing) return; // Prevent refresh if already in progress

    // Start refreshing by calling the commonRefresh function
    commonRefresh(async () => {
      try {
        // Run the fetch functions concurrently with Promise.all
        await Promise.all([
          fetchLatestVideoContent(),
          fetchAllVideoContent(),
          fetchAllPostContent(),
        ]);
      } catch (error) {
        console.error("Error fetching data:", error); // Log any errors that occur during fetching
      }
    });
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
                createdAt={item.$createdAt}
                title={item.title}
                content={item.content}
                creatorName={item.creator.username}
                coverImage={item.thumbnail}
                avatar={item.creator.avatar}
                onDelete={() => handleDelete(item.$id, "post")}
                onEdit={() => handleEditPress(item)}
                isCreator={item.creator.$id === user?.$id}
                onLikeToggle={() => toggleLikePost(item.$id)}
                savedPost={savedPostId.includes(item.$id)}
                showLikeButton={true}
              />
            );
          }
          if (item.type === "video") {
            return (
              <View className="flex relative">
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
                  showLikeButton={item.creator.$id !== user?.$id}
                  onDelete={() => handleDelete(item.$id, "video")}
                  onEdit={() => handleEditPress(item)}
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
                Newly Added Videos
              </Text>
              {/* //desc: if there is no trending video, it wont break with ?? [] */}

              <Trending posts={latestPosts ?? []} />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <EmptyState
            title="No Content Found"
            subtitle="Be the first one to upload a content"
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

export default Home;
