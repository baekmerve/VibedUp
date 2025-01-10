import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  Text,
} from "react-native";

import React, { memo, useEffect, useRef, useState } from "react";
import * as Animatable from "react-native-animatable";
import { icons } from "../../constants";
import { Video, ResizeMode } from "expo-av";
// Define of the animations outside of the component
const zoomIn = {
  0: {
    scale: 0.8,
  },
  1: {
    scale: 1.0,
  },
};

const zoomOut = {
  0: {
    scale: 1.0,
  },
  1: {
    scale: 0.8,
  },
};

const RecentItem = ({ activeItem, item }) => {
  console.log("RECENT ITEM");
  const [play, setPlay] = useState(false);

  const animationRef = useRef(null);

  // Only trigger animation if activeItem changes
  useEffect(() => {
    if (activeItem === item.$id) {
      animationRef.current?.animate(zoomIn);
    } else {
      animationRef.current?.animate(zoomOut);
    }
  }, [activeItem, item.$id]);

  return (
    <Animatable.View
      ref={animationRef}
      //animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <Video
          source={{ uri: item.video }}
          className="w-52 h-72 rounded-[35px] bg-white/10 "
          resizeMode={ResizeMode.COVER}
          useNativeControls
          shouldPlay
          onPlaybackStatusUpdate={(status) => {
            if (status.didJustFinish) {
              setPlay(false);
            }
          }}
        />
      ) : (
        <TouchableOpacity
          className=" relative justify-center items-center "
          activeOpacity={0.7}
          onPress={() => {
            setPlay(true);
          }}
        >
          <ImageBackground
            source={{ uri: item.thumbnail }}
            className=" w-52 h-72 rounded-[35px] my-2 overflow-hidden"
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </Animatable.View>
  );
};

const RecentlyAdded = ({ posts }) => {
  console.log("RecentlyAdded rendered ");
  const [activeItem, setActiveItem] = useState(posts[0]?.$id);

  const viewableItemChanged = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  };

  if (posts.length === 0) {
    return (
      <View className="flex-1 justify-center items-center">
        <Text> No posts available.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={posts}
      className="px-1"
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <RecentItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default memo(RecentlyAdded);
