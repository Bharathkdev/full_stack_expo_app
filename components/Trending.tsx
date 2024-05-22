import React, { useState } from 'react';
import { FlatList, TouchableOpacity, ImageBackground } from 'react-native';
import { icons } from '@/constants';
import * as Animatable from 'react-native-animatable';
import { Video, ResizeMode } from 'expo-av';
import { Image } from 'expo-image';
import { LoadingIndicator } from './LoadingIndicator';

const zoomIn = {
  0: {
    scale: 0.9
  },
  1: {
    scale: 1
  }
};

const zoomOut = {
  0: {
    scale: 1
  },
  1: {
    scale: 0.9
  }
};

const TrendingItem = ({activeItem, item}: any) => {
  const[play, setPlay] = useState(false);
  const[isBuffering, setIsBuffering] = useState(false);

  return (
    <Animatable.View 
      className="mr-3"
      animation={activeItem === item.$id ? zoomIn : zoomOut}
      duration={500}
    >
      {play ? (
        <>
          <LoadingIndicator loading={isBuffering} />
          <Video 
            source={{ uri: item.video }}
            className="w-52 h-80 rounded-[20px] overflow-hidden shadow-lg bg-white/10"
            resizeMode={ResizeMode.COVER}
            onLoadStart={() => setIsBuffering(true)}
            onLoad={() => setIsBuffering(false)}
            posterSource={{ uri: item.thumbnail }}
            posterStyle={{
                resizeMode: 'cover',
            }}
            usePoster
            useNativeControls
            shouldPlay
            onPlaybackStatusUpdate={status => {
              if(status.didJustFinish) {
                  setPlay(false);
              }
              if(status.isBuffering) {
                  setIsBuffering(true);
              }
              if(status.isPlaying) {
                  setIsBuffering(false);
              }
            }}
          />
        </>
      ) : (
        <TouchableOpacity 
          className="relative justify-center items-center"
          activeOpacity={0.7}
          onPress={() => setPlay(true)}
        >
          <ImageBackground 
            source={{ uri: item.thumbnail }}
            className="w-52 h-80 rounded-[20px] overflow-hidden shadow-lg shadow-black/40"
            resizeMode='cover'
          />

         <Image 
            source={icons.playButton}
            className="w-12 h-12 absolute"
            contentFit='contain'
            priority="high"
         />
        </TouchableOpacity>
      )}
    </Animatable.View>
  )
}

const Trending = ({posts}: any) => {
  const[activeItem, setActiveItem] = useState(posts[0]);

  const viewableItemsChanged = ({ viewableItems }: any) => {
    if(viewableItems.length > 0) {
      setActiveItem(viewableItems[0].key);
    }
  }

  return (
    <FlatList 
        data={posts}
        keyExtractor={item => item.$id}
        renderItem={({item}) => (
          <TrendingItem activeItem={activeItem} item={item} />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={viewableItemsChanged}
        viewabilityConfig={{
          viewAreaCoveragePercentThreshold: 100,
        }}
    />
  )
}

export default Trending;