import React from 'react';
import { View, Text } from 'react-native';

type InfoBoxPropTypes = {
  title: string;
  subtitle: string;
  containerStyle: string;
  titleStyle: string;
}

const InfoBox = ({title, subtitle, containerStyle, titleStyle}: InfoBoxPropTypes) => {
  return (
    <View className={containerStyle}>
      <Text className={`text-white text-center font-psemibold ${titleStyle}`}>{title}</Text>
      <Text className="text-sm text-gray-100 text-center font-pregular">{subtitle}</Text>
    </View>
  )
};

export default InfoBox;