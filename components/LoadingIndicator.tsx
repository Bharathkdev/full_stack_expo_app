import React from 'react';
import { View, ActivityIndicator } from 'react-native';

type LoadingIndicatorTypes = {
  loading: boolean;
  loaderStyle?: string;
};

export const LoadingIndicator: React.FC<LoadingIndicatorTypes> = ({
  loading,
  loaderStyle = "absolute z-50 w-full h-full flex justify-center items-center"
}) => {
  if (loading) {
    return (
      <View className={`${loaderStyle}`}>
        <ActivityIndicator size="large" animating={loading} color="#FFA001" />
      </View>
    );
  }

  return null;
};