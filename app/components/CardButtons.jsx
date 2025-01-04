import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";
import { useGlobalContext } from "../../context/GlobalProvider";

const CardButtons = ({
  onLikeToggle,
  savedList,
  isCreator,
  onEdit,
  onDelete,
  openMenu,
  onToggleMenu,
}) => {
  //const [openMenu, setOpenMenu] = useState(false);

  return (
    <View className="mr-2 flex-row justify-center items-center ">
      <TouchableOpacity onPress={onLikeToggle}>
        <Image
          source={savedList ? icons.favorite : icons.unfavorite}
          className="w-7 h-7 "
          resizeMode="contain"
        />
      </TouchableOpacity>

      {isCreator && (
        <View className=" relative">
          {/* <TouchableOpacity onPress={() => setOpenMenu(!openMenu)}> */}
          <TouchableOpacity onPress={onToggleMenu}>
            <Image
              source={icons.more}
              className="w-7 h-7"
              resizeMode="contain"
            />
          </TouchableOpacity>
          {openMenu && (
            <View className="items-center absolute top-9 right-1 z-10  p-1 w-32 rounded-lg bg-paper shadow-md">
              <TouchableOpacity
                //onPress={onEdit}
                onPress={() => {
                  onEdit(); // Call edit function
                  onToggleMenu(); // Close the menu after editing
                }}
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
                //onPress={onDelete}
                onPress={() => {
                  onDelete(); // Call delete function
                  onToggleMenu(); // Close the menu after deleting
                }}
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
  );
};

export default CardButtons;
