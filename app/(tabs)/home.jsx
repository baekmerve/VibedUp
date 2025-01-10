import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useMemo, useCallback, memo } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../components/SearchInput";
import RecentlyAdded from "../components/RecentlyAdded";
import EmptyState from "../components/EmptyState";
import VideoCard from "../components/VideoCard";
import PostCard from "../components/PostCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const {
    user,
    savedContentId,
    toggleSaveContent,
    latestPosts,
    fetchLatestVideoContent,
    refreshing,
    fetchAllContents,
    allContents,
    fetchUserSavedContent,
  } = useGlobalContext();

  console.log("home is being rendered");


  const memoizedLatestPosts = useMemo(() => latestPosts ?? [], [latestPosts]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!refreshing) {
          await Promise.all([
            fetchLatestVideoContent(),
            fetchAllContents(), // Fetch all contents (posts + videos)
            fetchUserSavedContent(user.$id),
          ]);
        }
      } catch (error) {
        console.error("Error fetching home data:", error);
        alert("Failed to fetch home content.");
      }
    };
    fetchData(); // Call the async function
  }, [refreshing]);

  const onRefresh = async () => {
    if (refreshing) return; // Prevent refresh if already in progress
    try {
      // Run the fetch functions concurrently with Promise.all
      await Promise.all([
        fetchLatestVideoContent(),
        fetchAllContents(),
        fetchUserSavedContent(user.$id),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error); // Log any errors that occur during fetching
    }
  };

  const renderItem = useCallback(
    ({ item }) => {
      if (item.type === "post") {
        return (
          <PostCard
            createdAt={item.$createdAt}
            title={item.title}
            content={item.content}
            creatorName={item.creator.username}
            coverImage={item.thumbnail}
            avatar={item.creator.avatar}
            isCreator={item.creator.$id === user?.$id}
            onLikeToggle={() => toggleSaveContent(item.$id, "post")}
            savedContent={savedContentId.includes(item.$id)}
            showSaveButton={true}
            showSettingsButton={false}
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
              savedContent={savedContentId.includes(item.$id)}
              onLikeToggle={() => toggleSaveContent(item.$id, "video")}
              isCreator={item.creator.$id === user?.$id}
              showSaveButton={true}
              showSettingsButton={false}
            />
          </View>
        );
      }
    },
    [savedContentId, user]
  );

  return (
    <SafeAreaView className="bg-warmGray h-full ">
      {/* Background */}

      <FlatList
        data={allContents}
        keyExtractor={(item) => item.$id}
        onEndReachedThreshold={0.5} // Load more when user scrolls to half of the list
        renderItem={renderItem}
        ListHeaderComponent={() => (
          <View className="flex my-4 px-2 ">
            <View className="flex justify-between items-start flex-row mb-2 ">
              <View>
                <Text className="font-pmedium text-base text-brown">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-brown">
                  {user?.username}
                </Text>
              </View>
              <View className="">
                <Image
                  source={images.logo}
                  className="w-24 h-16 "
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className=" w-full flex-1 pb-4   my-2 rounded-xl">
              <Text className="text-brown text-2xl text-center font-psemibold my-4 ">
                Recently Added
              </Text>
              <RecentlyAdded posts={memoizedLatestPosts} />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <EmptyState
            title="No Content Found"
            subtitle="Be the first one to share a content"
          />
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
};

export default memo(Home);
