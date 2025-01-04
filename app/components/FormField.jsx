import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import { icons } from "../../constants";

const FormField = ({
  title,
  value,
  handleChangeText,
  placeholder,
  otherStyles,
  multiline,
  ...props
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles} `}>
      <Text className="font-pmedium text-base text-brown">{title}</Text>
      <View className=" w-full min-h-[60px] p-4 bg-inputBox rounded-2xl border border-brown focus:border-2  items-center flex-row">
        <TextInput
          className="flex-1 text-white font-psemibold text-sm"
          value={value}
          placeholder={placeholder}
          placeholderTextColor="#DADADA"
          onChangeText={handleChangeText}
          secureTextEntry={title === "Password" && !showPassword}
          multiline={multiline}
        />
        {title === "Password" && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Image
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              resizeMode="contain"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default FormField;
