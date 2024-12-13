import { View, Text } from 'react-native'
import React from 'react'

const InfoBox = ({ title, subtitle, containerStyles, titleStyles }) => {
  return (
    <View className={containerStyles}>
      <Text
        className={`text-paper text-center font-psemibold ${titleStyles} `}
      >
        {title}
      </Text>
      <Text className=" text-sm text-paper text-center font-pregular">
        {subtitle}
      </Text>
    </View>
  );
};

export default InfoBox