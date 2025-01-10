import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { memo } from "react";
import { icons } from "../../constants";

const SettingsButton = ({
  isCreator,
  onEdit,
  onDelete,
  showSettingsButton,
}) => {
  return (
    <View>
      {isCreator && showSettingsButton && (
        <View className="flex-row gap-2 ">
          <TouchableOpacity onPress={onEdit}>
            <Image
              source={icons.edit}
              className="w-7 h-7 "
              resizeMode="contain"
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={onDelete}>
            <Image
              source={icons.icon_delete}
              className="w-7 h-7 "
              resizeMode="contain "
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default memo(SettingsButton);
