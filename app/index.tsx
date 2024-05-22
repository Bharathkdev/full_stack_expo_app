import { StatusBar } from 'expo-status-bar';
import { View, Text, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import { SafeAreaView } from 'react-native-safe-area-context';
import { images } from '../constants';
import CustomButton from '@/components/CustomButton';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';

const HomeScreen = () => {
  const {isLoading, isLoggedIn} = useGlobalContext();

  const onStart = () => {
    if(!isLoading && isLoggedIn) {
      return router.replace('/home');
    }
    router.push('/sign-in');
  }

  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View className="w-full justify-center items-center h-full px-4">
          <Image source={images.logo} className='w-[130px] h-[84px]' contentFit='contain' priority="high" />
          <Image source={images.cards} className='max-w-[380px] h-[300px] w-full' contentFit='contain' priority="high" />
          <View className="relative mt-5">
            <Text className="text-3xl text-white font-pbold text-center">Discover Endless Possibilities with{' '}
              <Text className="text-secondary-200">Aora</Text>
            </Text>
            <Image source={images.path} className="w-[136px] h-[15px] absolute -bottom-2 -right-8" contentFit='contain' priority="high" />
          </View>
          <Text className="text-sm font-pregular text-gray-100 mt-7 text-center">Where creativity meets innovation: embark on a journey of limitless exploration with Aora</Text>
          <CustomButton title="Start Exploring" handlePress={onStart} containerStyle="w-full mt-7" />
        </View>
      </ScrollView>
      <StatusBar backgroundColor='#161622' style='light' />
    </SafeAreaView>
  );
};

export default HomeScreen;
