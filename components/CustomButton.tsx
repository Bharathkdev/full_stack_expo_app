import React from 'react';
import { Text, TouchableOpacity } from 'react-native';

type CustomButtonPropTypes = {
    title: string;
    handlePress: () => void;
    containerStyle?: string;
    textStyle?: string;
    isLoading?: boolean;
}

const CustomButton = ({ title, handlePress, containerStyle, textStyle, isLoading }: CustomButtonPropTypes) => {
    return (
        <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePress}
            aria-disabled={isLoading}
            className={`bg-secondary rounded-xl min-h-[62px] justify-center items-center ${containerStyle} ${isLoading ? 'opacity-50' : ''}`} disabled={isLoading}
        >
            <Text className={`text-primary font-psemibold text-lg ${textStyle}`}>{title}</Text>
        </TouchableOpacity>
    )
}

export default CustomButton;