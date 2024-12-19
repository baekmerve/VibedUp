import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import React from "react";
import { icons } from "../../constants";

const PostCard = ({
  title,
  creatorName,
  avatar,
  content,
  onDelete,
  isCreator,
}) => {
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
              <Text
                className="text-brown font-psemibold text-sm"
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

          {isCreator && (
            <View className=" justify-center items-center mr-2">
              <TouchableOpacity onPress={onDelete}>
                <Image
                  source={icons.icon_delete}
                  className="w-7 h-7"
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View className="w-full h-60 rounded-xl mt-4 bg-darkBlue  ">
          <Text className=" text-white mt-3 px-3 font-pbold"> {title}</Text>
          <Text className="text-white mt-4 px-3"> {content}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default PostCard;
