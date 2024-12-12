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

  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prevState) => !prevState); // Toggle the menu
  };

  return (
    <View className="flex-col px-4 mb-14 ">
      <View className="flex-row gap-3 items-start ">
        <View className="justify-center items-center flex-row flex-1 ">
          <View className="w-[46px] h-[46px] rounded-lg justify-center items-center p-0.5 ">
            <Image
              source={{ uri: avatar }}
              className="w-full h-full rounded-full"
              resizeMode="cover"
            />
          </View>
          <View className="justify-center flex-1 ml-3 gap-y-1 ">
            <Text
              className="text-white font-psemibold text-sm"
              numberOfLines={1}
            >
              {title}
            </Text>
            <Text
              className=" text-xs text-gray-100 font-pregular"
              numberOfLines={1}
            >
              {creatorName}
            </Text>
          </View>
        </View>
        {/* Menu button */}
        <View className="pt-2 flex-row justify-around ">
          <View className="mr-2">
            <TouchableOpacity onPress={toggleMenu}>
              <Image
                source={icons.menu}
                className="w-7 h-7"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      {/* Menu showing  */}
      {openMenu && (
        <View className="bg-[#1E1E2D] border border-[#232533] rounded-xl w-28 h-[70px] justify-center space-y-2 absolute top-10 right-4 z-10">
          {/* Like/Unlike button */}
          <TouchableOpacity onPress={onLikeToggle}>
            <View className="flex-row justify-evenly items-center">
              <Image
                source={savedVideo ? icons.removeBookmark : icons.bookmark}
                className="w-6 h-6 "
                resizeMode="contain"
              />
              <Text
                className="text-gray-100 
              font-psemibold"
              >
                {savedVideo ? "Remove" : "Save"}
              </Text>
            </View>
          </TouchableOpacity>

          {/* Delete button visible for creators only */}
          {isCreator && (
            <TouchableOpacity onPress={onDelete}>
              <View className="flex-row justify-evenly items-center">
                <Image
                  source={icons.remove}
                  className="w-6 h-6 "
                  resizeMode="contain"
                />
                <Text
                  className="text-gray-100 
              font-psemibold"
                >
                  Delete
                </Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
      )}
      <View className=" mt-5 px-3">
        <Text className="text-white ">{content}</Text>
      </View>
      {play ? (
        <Video
          source={{ uri: video }}
          className="w-full h-56 rounded-xl mt-3"
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
          className="w-full h-60 rounded-xl mt-3 relative justify-center items-center"
        >
          <Image
            source={{ uri: thumbnail }}
            className="w-full h-full rounded-xl mt-3"
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
