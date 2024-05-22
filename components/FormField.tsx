import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity } from 'react-native'
import {icons} from '../constants';
import { Image } from 'expo-image';

type FormFieldPropTypes = {
  title: string;
  value: string;
  placeholder: string;
  handleChangeText: (value: string) => void;
  otherStyles: string;
}

const FormField = ({title, value, placeholder, handleChangeText, otherStyles, ...props}: FormFieldPropTypes) => {
  const[showPassword, setShowPassword] = useState(false);

  return (
    <View className={`space-y-2 ${otherStyles}`}>
      <Text className="text-base text-gray-100 font-pmedium">{title}</Text>

      <View className="border-2 border-black-200 w-full h-16 px-4 bg-black-100 rounded-2xl focus:border-secondary items-center flex-row">
        <TextInput
            className="flex-1 text-white font-psemibold text-base" 
            value={value}
            placeholder={placeholder}
            placeholderTextColor="#7b7b8b"
            onChangeText={handleChangeText}
            secureTextEntry={title === 'Password' && !showPassword}
            {...props}
        />
        {title === 'Password' && (
          <TouchableOpacity onPress={() => setShowPassword(prevValue => !prevValue)}>
            <Image 
              source={!showPassword ? icons.eye : icons.eyeHide}
              className="w-6 h-6"
              contentFit='contain'
              priority="high"
            />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

export default FormField