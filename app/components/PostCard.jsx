import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
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
}) => {
  const createdDate = new Date(createdAt);
  const year = createdDate.getFullYear();
  const month = String(createdDate.getMonth() + 1).padStart(2, "0");
  const day = String(createdDate.getDate()).padStart(2, "0");
  const formattedDate = `${year}-${month}-${day}`;

  const [openMenu, setOpenMenu] = useState(false);

  return (
    <ScrollView>
      <View className="flex-col items-center px-4 my-2 ">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg justify-center items-center ">
              <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
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
          <View className="mr-2 flex-row justify-center items-center ">
            <TouchableOpacity onPress={onLikeToggle}>
              <Image
                source={savedPost ? icons.favorite : icons.unfavorite}
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
                  <View className="items-center absolute top-9 right-1 z-10  p-1 w-32 rounded-lg bg-paper shadow-md">
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
