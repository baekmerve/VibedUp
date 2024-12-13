import {
  FlatList,
  TouchableOpacity,
  ImageBackground,
  Image,
  View,
  Text,
} from "react-native";

import React, { useState } from "react";
import * as Animatable from "react-native-animatable";

import { icons } from "../../constants";

import { Video, ResizeMode } from "expo-av";

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

const TrendingItem = ({ activeItem, item }) => {
  const [play, setPlay] = useState(false);

  return (
    <Animatable.View

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
            className=" w-52 h-72 rounded-[35px] my-2 overflow-hidden shadow-lg shadow-black/40"
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
  const [activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemChanged = ({ viewableItems }) => {
    if (viewableItemChanged.length > 0) {
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
      className="px-3 rounded-xl shadow-xl  shadow-brown"
      keyExtractor={(item) => item.$id}
      renderItem={({ item }) => (
        <TrendingItem activeItem={activeItem} item={item} />
      )}
      onViewableItemsChanged={viewableItemChanged}
      viewabilityConfig={{ itemVisiblePercentThreshold: 70 }}
      contentOffset={{ x: 170 }}
      horizontal
    />
  );
};

export default Trending;
