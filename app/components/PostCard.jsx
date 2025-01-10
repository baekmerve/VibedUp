import { View, Text, Image, TouchableOpacity } from "react-native";
import React, { useState, useCallback, memo } from "react";
import { icons } from "../../constants";
import SettingsButton from "./SettingsButton";
import SaveButton from "./SaveButton";

const PostCard = React.memo(
  ({
    title,
    creatorName,
    avatar,
    content,
    onDelete,
    onEdit,
    isCreator,
    onLikeToggle,
    savedContent,
    coverImage,
    createdAt,
    onToggleMenu,
    showSaveButton,
    showSettingsButton,
  }) => {
    console.log("rendering PostCard");

    const createdDate = new Date(createdAt);
    const year = createdDate.getFullYear();
    const month = String(createdDate.getMonth() + 1).padStart(2, "0");
    const day = String(createdDate.getDate()).padStart(2, "0");
    const hours = String(createdDate.getHours()).padStart(2, "0");
    const minutes = String(createdDate.getMinutes()).padStart(2, "0");
    const seconds = String(createdDate.getSeconds()).padStart(2, "0");

    const formattedDate = `${year}.${month}.${day} - ${hours}:${minutes}:${seconds}`;

    const [isExpanded, setIsExpanded] = useState(false);
    const handleToggleExpand = useCallback(() => {
      setIsExpanded((prev) => !prev);
    }, []);

    return (
      <View className="flex-col items-center px-4 my-2">
        {/* bg-[#fef5f2] */}
        <View
          className={`bg-[#fffaf5] border border-[#c5d1da] rounded-xl shadow-lg w-full mt-4 p-4 ${
            isExpanded ? "auto" : "max-h-[500px]"
          }`}
        >
          {/* Header Section */}
          <View className="flex-row mb-3 items-center w-full ">
            <View className="flex-row items-center ">
              {/* avatar Section */}
              <View className="w-[50px] h-[50px] rounded-full overflow-hidden  ">
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
              <View className="flex-1 ml-3">
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
     
                onToggleMenu={onToggleMenu}
                showSettingsButton={showSettingsButton}
              />
              <SaveButton
                onLikeToggle={onLikeToggle}
                savedContent={savedContent}
                showSaveButton={showSaveButton}
              />
            </View>
          </View>
          {/* Image Section */}
          {coverImage && (
            <Image
              source={{ uri: coverImage }}
              className="w-full h-56 rounded-lg mb-3"
              resizeMode="cover"
            />
          )}

          {/* Title Section */}
          <Text className="text-brown text-xl leading-5 font-semibold my-3">
            {title}
          </Text>

          <View className="relative">
            {/* Content Section */}
            <Text
              className="text-brown text-base leading-5 "
              numberOfLines={isExpanded ? 0 : 3} // 0: Show all lines when expanded, and only 3 when it is not expanded
              ellipsizeMode="tail" // Adds "..." to indicate more text
            >
              {content}
            </Text>

            {/* Conditional Buttons */}
            <TouchableOpacity onPress={handleToggleExpand}>
              <Text className="text-orange font-semibold mt-2">
                {isExpanded ? "Read Less" : "Read More"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
);
export default memo(PostCard);
