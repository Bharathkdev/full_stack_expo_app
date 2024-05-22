import React from 'react';
import { View, Text } from 'react-native';
import { images } from '@/constants';
import CustomButton from './CustomButton';
import { Image } from 'expo-image';
import { router } from 'expo-router';

type EmptyStatePropTypes = {
  title: string;
  subtitle: string;
  screen: string;
}

const EmptyState = ({title, subtitle, screen}: EmptyStatePropTypes) => {
  return (
    <View className="justify-center items-center px-4">
      <Image 
        source={images.empty}
        className="w-[270px] h-[215px]"
        contentFit='contain'
        priority="high"
      />
      <Text className="text-xl text-center font-psemibold text-white mt-2">{title}</Text>
      <Text className="font-pmedium text-sm text-gray-100 my-3">{subtitle}</Text>

      <CustomButton 
        title={screen === "bookmark" ? "Go to Home" : "Create Video"} 
        handlePress={() => {
          screen === "bookmark" ? router.push('/home') : router.push('/create')
        }} 
        containerStyle="w-full my-5"
      />
    </View>
  )
}

export default EmptyState;