import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";

const PostCard = ({
  title,
  creatorName,
  avatar,
  content,
  onDelete,
  isCreator,
}) => {
  const [openMenu, setOpenMenu] = useState(false);

  const toggleMenu = () => {
    setOpenMenu((prevState) => !prevState); // Toggle the menu
  };

  return (
    <ScrollView>
      <View className="flex-col items-center px-4 mb-14 ">
        <View className="flex-row gap-3 items-start">
          <View className="justify-center items-center flex-row flex-1">
            <View className="w-[46px] h-[46px] rounded-lg justify-center items-center p-0.5">
              <Image
                source={{ uri: avatar }}
                className="w-full h-full rounded-full"
                resizeMode="cover"
              />
            </View>
            <View className="justify-center flex-1 ml-3 gap-y-1">
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

          <View className="align-middle ">
            {/* Menu button */}
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
          <View className="bg-[#1E1E2D] border border-[#232533] rounded-xl w-28 h-[50px] justify-center space-y-2 absolute top-10 right-4 z-10">
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

        <View className="w-full h-60 rounded-xl mt-4 bg-[#1E1E2D] border border-[#232533] ">
          <Text className=" text-white mt-3 px-3 font-pbold"> {title}</Text>
          <Text className="text-white mt-4 px-3"> {content}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PostCard;
