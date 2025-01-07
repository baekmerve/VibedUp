import { View, Text, Image, ScrollView } from "react-native";
import React from "react";
import CardButtons from "./CardButtons";
import { icons } from "../../constants";

const PostCard = ({
  title,
  creatorName,
  avatar,
  content,
  onDelete,
  onEdit,
  isCreator,
  onLikeToggle,
  savedPost,
  coverImage,
  createdAt,
  openMenu,
  onToggleMenu,
}) => {
 
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

  return (
    <ScrollView>
      <View className="flex-col items-center px-4 my-4">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg justify-center items-center ">
              {avatar ? (
                <Image
                  source={{ uri: avatar }}
                  className="w-full h-full rounded-full"
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
            <View className="justify-center flex-1 ml-3 gap-y-1">
              <Text className=" text-brown font-psemibold" numberOfLines={1}>
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
            savedList={savedPost}
            isCreator={isCreator}
            onEdit={onEdit}
            onDelete={onDelete}
            openMenu={openMenu}
            onToggleMenu={onToggleMenu}
          />
        </View>

        {coverImage ? (
          <View className="w-full h-auto rounded-xl mt-4">
            <Text className="text-brown mt-3 mb-3 font-psemibold">{title}</Text>
            {/* Adding ScrollView for content */}
            <ScrollView
              nestedScrollEnabled={true} // Allows nested scrolling
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text className="text-brown mb-3">{content}</Text>
            </ScrollView>

            <Image
              source={{ uri: coverImage }}
              className="w-full h-60 rounded-xl "
              resizeMode="cover"
            />
          </View>
        ) : (
          <View className="w-full h-60 rounded-xl mt-4  bg-[#F7EBE8]  shadow-md  border border-[#D5C5B5]">
            <Text className=" text-[#4E3629] mt-3 px-3 font-pbold">
              {title}
            </Text>
            {/* Adding ScrollView for content */}
            <ScrollView
              nestedScrollEnabled={true} // Allows nested scrolling
              contentContainerStyle={{ flexGrow: 1 }}
            >
              <Text className="text-[#4E3629] mt-4 px-3"> {content}</Text>
            </ScrollView>
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default PostCard;
