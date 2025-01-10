import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, memo } from "react";
import { icons } from "../../constants";
import { ResizeMode, Video } from "expo-av";
import SaveButton from "./SaveButton";
import SettingsButton from "./SettingsButton";

const VideoCard = ({
  title,
  creatorName,
  avatar,
  thumbnail,
  video,
  savedContent,
  onLikeToggle,
  onDelete,
  onEdit,
  content,
  isCreator,
  createdAt,
  showSaveButton,
  showSettingsButton,
}) => {
  console.log("rendering videoCard");
  const [play, setPlay] = useState(false);
  //? Get year, month, and day

  const createdDate = new Date(createdAt);
  const year = createdDate.getFullYear();
  const month = String(createdDate.getMonth() + 1).padStart(2, "0");
  const day = String(createdDate.getDate()).padStart(2, "0");

  //? Get hours, minutes, and seconds
  const hours = String(createdDate.getHours()).padStart(2, "0");
  const minutes = String(createdDate.getMinutes()).padStart(2, "0");
  const seconds = String(createdDate.getSeconds()).padStart(2, "0");

  //? Format the date and time
  const formattedDate = `${year}.${month}.${day} - ${hours}:${minutes}:${seconds}`;

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <View className="flex-col px-4 my-2  ">
      <View
        className={`bg-[#fffaf5] border border-[#c5d1da] rounded-xl shadow-lg w-full mt-4 p-4 ${
          isExpanded ? "auto" : "max-h-[500px]"
        }`}
      >
        {/* Header: Avatar and Creator Info */}
        <View className="flex-row items-center mb-3 w-full">
          <View className="w-[50px] h-[50px] rounded-full overflow-hidden ">
            {avatar ? (
              <Image
                source={{ uri: avatar }}
                className="w-full h-full"
                resizeMode="cover"
              />
            ) : (
              <Image
                source={icons.profile2}
                className="w-full h-full"
                resizeMode="cover"
              />
            )}
          </View>
          {/* profile info Section */}
          <View className="ml-3 flex-1 ">
            <Text
              className="text-brown font-psemibold text-base"
              numberOfLines={1}
            >
              {creatorName}
            </Text>
            <Text
              className="text-sm text-brown font-pregular"
              numberOfLines={1}
            >
              {formattedDate}
            </Text>
          </View>
          <SettingsButton
            isCreator={isCreator}
            onEdit={onEdit}
            onDelete={onDelete}
            showSettingsButton={showSettingsButton}
          />
          <SaveButton
            onLikeToggle={onLikeToggle}
            savedContent={savedContent}
            showSaveButton={showSaveButton}
          />
        </View>

        {/* Video or Thumbnail */}
        <View className="relative w-full overflow-hidden rounded-lg bg-white/10 mt-2">
          {play ? (
            <Video
              source={{ uri: video }}
              className="w-full h-52"
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
              activeOpacity={0.8}
              onPress={() => setPlay(true)}
              className="w-full h-56 rounded-lg relative justify-center items-center"
            >
              <Image
                source={{ uri: thumbnail }}
                className="w-full h-full"
                resizeMode="cover"
              />
              {/* Play Button */}

              <Image
                source={icons.play}
                className="w-12 h-12 absolute"
                resizeMode="contain"
              />
            </TouchableOpacity>
          )}
        </View>

        {/* Title */}
        <Text className="text-brown text-xl font-semibold  my-3 leading-5">
          {title}
        </Text>

        <View className="relative">
          {/* Content */}
          <Text
            className="text-brown text-base leading-5"
            numberOfLines={isExpanded ? 0 : 3} // 0: Show all lines when expanded, and only 3 when it is not expanded
            ellipsizeMode="tail" // Adds "..." to indicate more text
          >
            {content}
          </Text>
          {!isExpanded ? (
            <TouchableOpacity onPress={() => setIsExpanded(true)}>
              <Text
                className="text-orange
                                        font-semibold mt-2"
              >
                Read More
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={() => setIsExpanded(false)}
              className="mt-3"
            >
              <Text className="text-orange font-semibold">Read Less</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </View>
  );
};

export default memo(VideoCard);
