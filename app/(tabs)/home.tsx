import React, { useCallback, useState } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Image } from 'expo-image';
import { images } from '@/constants';
import SearchInput from '@/components/SearchInput';
import Trending from '@/components/Trending';
import EmptyState from '@/components/EmptyState';
import { getAllPosts, getLatestPosts } from '@/lib/appwrite';
import useAppWrite from '@/hooks/useAppWrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { LoadingIndicator } from '@/components/LoadingIndicator';

const Home = () => {
  const { user, isLiked } = useGlobalContext();
  const { data: posts, refetch: refetchAllVideos, isLoading } = useAppWrite(getAllPosts); 
  const { data: latestPosts, refetch: refetchLatestVideos } = useAppWrite(getLatestPosts); 
  const[refreshing, setRefreshing] = useState(false);

  useFocusEffect(
    useCallback(() => {
      refetchAllVideos();
      refetchLatestVideos();
    }, [isLiked])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await refetchAllVideos();
    await refetchLatestVideos();
    setRefreshing(false);
  }

  const renderItem = useCallback((item) => {
    return <VideoCard video={item} />;
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
       <View className="mt-6 px-4 pb-5 space-y-6">
          <View className="justify-between items-start flex-row mb-6">
            <View>
              <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
              <Text className="text-2xl font-psemibold text-white">{user?.username}</Text>
            </View>
            <View className="mt-1.5">
              <Image 
                source={images.logoSmall}
                className="w-9 h-10"
                contentFit='contain'
                priority="high"
              />
            </View>
          </View>

          <SearchInput />
      </View>
      {isLoading && posts.length === 0 ? 
      <LoadingIndicator loading={isLoading} /> :
      <FlatList 
        data={posts}
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
          renderItem(item)
        )}
        ListHeaderComponent={() => (
          <View className="mb-6 mt-2 px-4 space-y-6">
            {latestPosts.length > 0 && <View className="w-full flex-1 pb-5">
            <Text className="text-gray-100 text-lg font-pregular mb-5">Latest Videos</Text>
            <Trending posts={latestPosts} />
            </View>}
          </View>
        )}
        ListEmptyComponent={() => (
          <EmptyState title="No Videos Found" subtitle="Be the first one to upload a video" screen="home" />
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />}
    </SafeAreaView>
  )
}

export default Home;