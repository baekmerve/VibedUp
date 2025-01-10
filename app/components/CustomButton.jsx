import { TouchableOpacity, Text } from "react-native";
import React from "react";

const CustomButton = ({
  title,
  handlePress,
  containerStyles,
  textStyles,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      disabled={isLoading}
      className={` bg-orange  rounded-xl min-h-[62px] justify-center items-center ${containerStyles} ${
        isLoading ? "opacity-50" : ""
      }`}
    >
      {/* React Native's Text component can only accept strings or numbers as its children. */}
      <Text className={`text-white font-semibold text-lg ${textStyles}`}>
        {!isLoading ? title : "Loading.."}
      
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;
