import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import EmptyState from '@/components/EmptyState';
import { getLikedPosts } from '@/lib/appwrite';
import useAppWrite from '@/hooks/useAppWrite';
import VideoCard from '@/components/VideoCard';
import { useGlobalContext } from '@/context/GlobalProvider';
import { useLocalSearchParams } from 'expo-router';
import { LoadingIndicator } from '@/components/LoadingIndicator';

const Bookmark = () => {
  const { query } = useLocalSearchParams();
  const { user, isLiked } = useGlobalContext();
  const { data: posts, refetch, isLoading } = useAppWrite(() => getLikedPosts(user.$id)); 

  useEffect(() => {
    refetch();
  }, [query, isLiked]);

  const renderItem = useCallback((item) => {
    return <VideoCard video={item} />;
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4">
        <Text className="text-2xl font-psemibold text-white">Saved Videos</Text>
      </View>
      {isLoading && posts.length === 0 ? 
      <LoadingIndicator loading={isLoading} /> :
      <FlatList 
        data={posts}
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
          renderItem(item)
        )}
        ListEmptyComponent={() => (
          <EmptyState title={"No Videos Found"} subtitle="Please add some videos to your favorites" screen="bookmark" />
        )}
      />}
    </SafeAreaView>
  )
}

export default Bookmark;