import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import { ResizeMode, Video } from "expo-av";
import CardButtons from "./CardButtons";

const VideoCard = ({
  title,
  creatorName,
  avatar,
  thumbnail,
  video,
  savedVideo,
  onLikeToggle,
  onDelete,
  onEdit,
  content,
  isCreator,
  createdAt,
  openMenu,
  onToggleMenu,
}) => {
  const [play, setPlay] = useState(false);

  const createdDate = new Date(createdAt);
  const year = createdDate.getFullYear();
  const month = String(createdDate.getMonth() + 1).padStart(2, "0");
  const day = String(createdDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

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
            <Text className=" text-brown font-psemibold " numberOfLines={1}>
              {creatorName}
            </Text>
            <Text
              className="text-xs text-brown font-pregular"
              numberOfLines={1}
            >
              {formattedDate}
            </Text>
          </View>
        </View>

        <CardButtons
          onLikeToggle={onLikeToggle}
          savedList={savedVideo}
          isCreator={isCreator}
          onEdit={onEdit}
          onDelete={onDelete}
          openMenu={openMenu}
          onToggleMenu={onToggleMenu}
        />
      </View>
      <Text className="text-brown mt-3 mb-3 font-psemibold">{title}</Text>
      <Text className="text-brown  mb-3">{content}</Text>

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
