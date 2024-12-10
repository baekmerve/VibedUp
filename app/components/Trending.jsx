import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  Text,
} from "react-native";
import React, { useEffect, useRef, useState } from "react";
import * as Animatable from "react-native-animatable";

import { icons } from "../../constants";

import { Video, ResizeMode } from "expo-av";

const zoomIn = {
  0: {
    scale: 0.9,
  },
  1: {
    scale: 1.1,
  },
};

const zoomOut = {
  0: {
    scale: 1.1,
  },
  1: {
    scale: 0.9,
  },
};

const TrendingItem = ({ activeItem, item, setIsPlaying }) => {
  const [play, setPlay] = useState(false);



  return (
    <Animatable.View
      className="mr-5"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
       duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] mt-3 bg-white/10"
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
          if (status.isPlaying) {
            setIsPlaying(true); // Notify the parent that a video is playing
          } else if (!status.isPlaying && !status.didJustFinish) {
            setIsPlaying(false); // Resume scrolling if the user pauses the video
          } else if (status.didJustFinish) {
            setPlay(false);
            setIsPlaying(false); // Resume scrolling when the video finishes
          }
          }}
        />
      ) : (
        <TouchableOpacity
          className=" relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
            setIsPlaying(true); // Notify the parent that the video started playing
          }}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className=" w-52 h-72 rounded-[35px] my-5 overflow-hidden shadow-lg shadow-black/40"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const Trending = ({ posts }) => {
  //const [activeItem, setActiveItem] = useState(posts[1]);
  // const viewableItemChanged = ({ viewableItems }) => {
  //   if (viewableItemChanged.length > 0) {
  //     setActiveItem(viewableItems[0].key);
  //   }
  // };

  const [activeItemIndex, setActiveItemIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false); // Track if a video is being played

  const flatListRef = useRef(null);

  useEffect(() => {
    if (!isPlaying && posts.length > 0) {
      const timer = setInterval(() => {
        setActiveItemIndex((prevIndex) =>
          prevIndex === posts.length - 1 ? 0 : prevIndex + 1
        );
      }, 3000); // Change slide every 3 seconds

      return () => clearInterval(timer);
    }
  }, [posts, isPlaying]);

  useEffect(() => {
    if (posts.length > 0 && flatListRef.current && !isPlaying) {
      flatListRef.current.scrollToIndex({
        index: activeItemIndex,
        animated: true,
      });
    }
  }, [activeItemIndex, posts, isPlaying]);


  if (posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text> No posts available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      ref={flatListRef}
      data={posts}
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        //<TrendingItem activeItem={activeItem} item={item} />
        <TrendingItem
          activeItem={posts[activeItemIndex]?.$id}
          item={item}
          setIsPlaying={setIsPlaying}
        />
      )}
      //onViewableItemsChanged={viewableItemChanged}
      //viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      //contentOffset={{ x: 170 }}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      onScrollToIndexFailed={(info) => {
        try {
          flatListRef.current?.scrollToIndex({
            index: info.highestMeasuredFrameIndex || 0,
            animated: true,
          });
        } catch (error) {
          console.warn("ScrollToIndex failed:", error);
        }
      }}
    />
  );
};

export default Trending;
