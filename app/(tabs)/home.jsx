import { View, Text, FlatList, Image, RefreshControl } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { images } from "../../constants";
import SearchInput from "../components/SearchInput";
import Trending from "../components/Trending";
import EmptyState from "../components/EmptyState";
import { fetchAllVideos, fetchLatestVideos } from "../../lib/appwrite";
import useAppwrite from "../../lib/useAppwrite";
import VideoCard from "../components/VideoCard";
import { useGlobalContext } from "../../context/GlobalProvider";

const Home = () => {
  const { data: videos, refetch } = useAppwrite(fetchAllVideos);

  const { data: latestPosts } = useAppwrite(fetchLatestVideos);

  const { user, likedVideos, toggleLike } =
    useGlobalContext();

  const [refreshing, setRefreshing] = useState(false);



  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList
        data={videos}
        keyExtractor={(item) => item.$id}
        renderItem={({ item }) => (
          <View className="flex relative">
            <VideoCard
              title={item.title}
              thumbnail={item.thumbnail}
              video={item.video}
              videoId={item.$id}
              userId={user.$id}
              creator={item.creator.username}
              avatar={item.creator.avatar}
              liked={likedVideos.includes(item.$id)}
              onLikeToggle={() => toggleLike(item.$id)}
              showLikeButton={true}
            />
          </View>
        )}
        ListHeaderComponent={() => (
          <View className="flex my-6 px-4 space-y-6">
            <View className="flex justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">
                  Welcome Back,
                </Text>
                <Text className="text-2xl font-psemibold text-white">
                  {user?.username}
                </Text>
              </View>
              <View className="mt-1.5">
                <Image
                  source={images.logoSmall}
                  className="w-12 h-12"
                  resizeMode="contain"
                />
              </View>
            </View>
            <SearchInput />
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">
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
