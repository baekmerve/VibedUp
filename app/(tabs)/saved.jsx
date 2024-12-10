import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import SearchInput from "../components/SearchInput";
import { getUserLikedVideos } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import { images } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

const Saved = () => {
  const { user, likedVideos, toggleLike } = useGlobalContext();
  const [refreshing, setRefreshing] = useState(false);

  const { data: videos, refetch } = useAppwrite(() =>
    getUserLikedVideos(user.$id)
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  useEffect(() => {
    refetch();
  }, [likedVideos]);

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <VideoCard
            title={item.title}
            thumbnail={item.thumbnail}
            video={item.video}
            creator={item.creator.username}
            avatar={item.creator.avatar}
            liked={likedVideos.includes(item.$id)}
            onLikeToggle={() => toggleLike(item.$id)}
            showLikeButton={true}
          />
        )}
        ListHeaderComponent={() => (
          <View className="my-6 px-4">
            <Text className="text-2xl text-white font-psemibold">
              Saved Videos
            </Text>

            <View className="mt-6 mb-8">
              <SearchInput />
            </View>
          </View>
        )}
        //desc: for decide what will happen if the list is empty
        ListEmptyComponent={() => (
          <View className="justify-center items-center px-4">
            <Image
              source={images.empty}
              className="w-[270px] h-[215px]"
              resizeMode="contain"
            />
            <Text
              className="text-xl 
     text-center font-psemibold text-white mt-2"
            >
              No Saved Videos
            </Text>
            <Text className="font-pmedium text-sm text-gray-100">
              You haven't save any video
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