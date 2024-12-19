import { View, Text, Image, TouchableOpacity, Button } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import { ResizeMode, Video } from "expo-av";

const VideoCard = ({
  title,
  creatorName,
  avatar,
  thumbnail,
  video,
  savedVideo,
  onLikeToggle,
  onDelete,
  content,
  isCreator,
}) => {
  const [play, setPlay] = useState(false);

  return (
    <View className="flex-col px-4 py-1 my-4 ">
      <View className="flex-row gap-3 items-start ">
        <View className="justify-center items-center flex-row flex-1 ">
          <View className="w-[46px] h-[46px] rounded-lg justify-center items-center ">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1 ">
            <Text
              className="text-brown font-psemibold text-sm "
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className=" text-xs text-brown font-pregular"
              numberOfLines={1}
            >
              {creatorName}
            </Text>
          </View>
        </View>

        <View className="mr-2 flex-row justify-center items-center ">
          <TouchableOpacity onPress={onLikeToggle}>
            <Image
              source={savedVideo ? icons.favorite : icons.unfavorite}
              className="w-7 h-7 "
              resizeMode="contain"
            />
          </TouchableOpacity>
          {isCreator && (
            <TouchableOpacity onPress={onDelete}>
              <Image
                source={icons.icon_delete}
                className="w-7 h-7"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <Text className="text-brown mt-3 mb-3 px-2">{content}</Text>

      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-56 mt-2 rounded-xl "
          resizeMode={ResizeMode.CONTAIN}
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
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
          className="w-full h-60 rounded-xl relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl "
            resizeMode="cover"
          />
          <Image
            source={icons.play}
            className="w-12 h-12 absolute"
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default VideoCard;
