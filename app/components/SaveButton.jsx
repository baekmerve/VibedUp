import { View, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { icons } from "../../constants";

const SaveButton = ({ onLikeToggle, savedContent, showSaveButton }) => {
  return (
    <View className="mr-2 flex-row justify-center items-center ">
      {showSaveButton && (
        <TouchableOpacity onPress={onLikeToggle}>
          <Image
            source={savedContent ? icons.favorite : icons.unfavorite}
            className="w-8 h-8 "
            resizeMode="contain"
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default memo(SaveButton);
