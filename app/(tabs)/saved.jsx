import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import VideoCard from "../components/VideoCard";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";
import PostCard from "../components/PostCard";

const Saved = () => {
  const {
    user,
    toggleSaveContent,
    savedContentId,
    refreshing,
    fetchUserSavedContent,
    savedContents,
    setSavedContents,
  } = useGlobalContext();

  console.log("savedContentId", savedContentId);

  useEffect(() => {
    if (!user) return; // Exit if no user
    const fetchData = async () => {
      try {
        const response = await fetchUserSavedContent(user.$id);
        if (response?.length > 0) {
          setSavedContents(response);
        } else {
          console.warn("No user saved content found");
        }
      } catch (error) {
        console.error("Error fetching user  saved data:", error);
        alert("Failed to fetch user saved content.");
      }
    };

    fetchData(); // Call the async function
  }, []);

  const onRefresh = () => {
    fetchUserSavedContent(user.$id);
  };


  return (
    <SafeAreaView className="bg-warmGray h-full">
      <FlatList
        data={savedContents}
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
                onLikeToggle={() => toggleSaveContent(item.$id, "post")}
                savedContent={savedContentId.includes(item.$id)}
                showSaveButton={true}
                showSettingsButton={false}
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
                savedContent={savedContentId.includes(item.$id)}
                onLikeToggle={() => toggleSaveContent(item.$id, "video")}
                showSaveButton={true}
                showSettingsButton={false}
              />
            );
          }
        }}
        ListHeaderComponent={() => (
          <View className="my-2 px-4">
            <Text className="text-2xl mb-2 text-brown font-psemibold">
              Saved Contents
            </Text>
            <View className="flex-row items-center">
              <Text className="text-sm mt-3 mb-2 font-semibold text-brown pb-1 ">
                Your total saved content:
              </Text>
              <Text className="text-2xl text-orange ml-2 font-psemibold">
                {savedContents?.length}
              </Text>
            </View>

            <View className="mt-3 ">
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
