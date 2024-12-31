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
  onEdit,
  content,
  isCreator,
  createdAt,
}) => {
  const [play, setPlay] = useState(false);
  const [openMenu, setOpenMenu] = useState(false);

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

        <View className="mr-2 flex-row justify-center items-center ">
          <TouchableOpacity onPress={onLikeToggle}>
            <Image
              source={savedVideo ? icons.favorite : icons.unfavorite}
              className="w-7 h-7 "
              resizeMode="contain"
            />
          </TouchableOpacity>
          {isCreator && (
            <View className=" relative">
              <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}>
                <Image
                  source={icons.more}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>
              {openMenu && (
                <View className="border shadow-sm items-center absolute top-9 right-1 z-10  p-1 w-32 rounded-lg bg-paper">
                  <TouchableOpacity
                    onPress={onEdit}
                    className=" flex-row m-1 w-[90%]   items-center"
                  >
                    <Image
                      source={icons.edit}
                      className="w-7 h-7"
                      resizeMode="contain"
                    />
                    <Text className="ml-3">Edit</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    onPress={onDelete}
                    className="flex-row m-1 w-[90%] items-center "
                  >
                    <Image
                      source={icons.icon_delete}
                      className="w-7 h-7"
                      resizeMode="contain"
                    />
                    <Text className="ml-3">Delete</Text>
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}
        </View>
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
