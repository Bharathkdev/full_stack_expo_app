import React, { useCallback, useState } from 'react';
import { View, FlatList, TouchableOpacity, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import { Image } from 'expo-image';
import { getUserPosts, signOut } from '@/lib/appwrite';
import useAppWrite from '@/hooks/useAppWrite';
import VideoCard from '@/components/VideoCard';
import { router } from 'expo-router';
import { useGlobalContext } from '@/context/GlobalProvider';
import { icons } from '@/constants';
import InfoBox from '@/components/InfoBox';
import { LoadingIndicator } from '@/components/LoadingIndicator';

const Profile = () => {
  const { user, setUser, setIsLoggedIn, isLiked } = useGlobalContext();
  const { data: posts, refetch, isLoading } = useAppWrite(() => getUserPosts(user.$id)); 
  const [isSigningOut, setIsSigningOut] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetch();
    }, [isLiked])
  );


  const renderItem = useCallback((item) => {
    return <VideoCard video={item} />;
  }, []);

  const logout = async () => {
    setIsSigningOut(true);
    await signOut()
    setUser(null);
    setIsLoggedIn(false);
    setIsSigningOut(false);
    router.replace('/sign-in');
  };

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="w-full justify-center items-center mt-6 mb-7 px-4">
        <TouchableOpacity
          className="w-full items-end mb-10"
          onPress={logout}
        >
          <View className="flex-row space-x-2">
            <Text className="text-red-500 font-psemibold text-base">{isSigningOut ? 'Logging out...' : 'Log out'}</Text>           
            <Image 
              source={icons.logout}
              contentFit='contain'
              className="w-6 h-6"
              priority="high"
            />
          </View>
        </TouchableOpacity>
        <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
          <Image 
            source={{ uri: user?.avatar }}
            className="w-[90%] h-[90%] rounded-lg"
            contentFit='cover'
            priority="high"
          />
        </View>
        <InfoBox 
          title={user?.username}
          containerStyle="mt-3"
          titleStyle="text-lg"
        />
        <View className="mt-3 flex flex-row">
          <InfoBox 
            title={posts.length || 0}
            subtitle="Posts"
            containerStyle="mr-10"
            titleStyle="text-xl"
          />
          <InfoBox 
            title="1.2k"
            subtitle="Followers"
            titleStyle="text-xl"
          />
        </View>
      </View>
      {isLoading && posts.length === 0 ? 
      <LoadingIndicator loading={isLoading} loaderStyle='absolute w-full h-full flex justify-end items-center'/> :
      <FlatList 
        data={posts}
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
          renderItem(item)
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="No videos found for this profile" screen="profile" />
        )}
      />}
    </SafeAreaView>
  )
}

export default Profile;