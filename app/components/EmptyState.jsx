import { View, Text, Image } from "react-native";
import React, {memo} from "react";
import { images } from "../../constants";
import CustomButton from "../components/CustomButton";
import { router } from "expo-router";

const EmptyState = ({ title, subtitle }) => {
  return (
    <View className="justify-center items-center px-4">
      <Image
        source={images.empty}
        className="w-[270px] h-[215px]"
        resizeMode="contain"
      />
      <Text
        className="text-xl 
     text-center font-psemibold text-brown"
      >
        {title}
      </Text>
      <Text className=" mb-2 font-pmedium text-sm text-brown">{subtitle}</Text>

      <CustomButton
        title="Create a Content"
        handlePress={() => router.push("/create")}
        containerStyles="w-full mt-10 "
      />
    </View>
  );
};

export default memo(EmptyState);
