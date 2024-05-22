import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchInput from '@/components/SearchInput';
import EmptyState from '@/components/EmptyState';
import { searchPosts } from '@/lib/appwrite';
import useAppWrite from '@/hooks/useAppWrite';
import VideoCard from '@/components/VideoCard';
import { useLocalSearchParams } from 'expo-router';
import { LoadingIndicator } from '@/components/LoadingIndicator';
import { useGlobalContext } from '@/context/GlobalProvider';

const Search = () => {
  const { query } = useLocalSearchParams();
  const { isLiked } = useGlobalContext();
  const { data: posts, refetch, isLoading } = useAppWrite(() => searchPosts(query)); 

  useEffect(() => {
    refetch();
  }, [query, isLiked])

  const renderItem = useCallback((item) => {
    return <VideoCard video={item} />;
  }, []);

  return (
    <SafeAreaView className="bg-primary h-full">
      <View className="my-6 px-4">
        <Text className="font-pmedium text-sm text-gray-100">Search Results</Text>
        <Text className="text-2xl font-psemibold text-white">{query}</Text>
          
        <View className="mt-6 mb-3">
          <SearchInput initialQuery={query} />
        </View>
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
          <EmptyState title="No Videos Found" subtitle="No videos found for this search query" screen="search" />
        )}
      />}
    </SafeAreaView>
  )
}

export default Search;