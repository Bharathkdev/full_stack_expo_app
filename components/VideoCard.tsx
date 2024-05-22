import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { icons } from '@/constants';
import { useGlobalContext } from '@/context/GlobalProvider';
import { updatePostLikes } from '@/lib/appwrite';
import { ResizeMode, Video } from 'expo-av';
import { LoadingIndicator } from './LoadingIndicator';
import { Image } from 'expo-image';

type VideoCardPropTypes = {
    video: {
        $id: number,
        title: string,
        thumbnail: string,
        video: string,
        liked: any,
        creator: {
            username: string,
            avatar: string,
        }
    }
};

const VideoCard = ({ video: { $id, title, thumbnail, video, liked, creator: { username, avatar } }}: VideoCardPropTypes) => {
  const { user, setIsLiked } = useGlobalContext();
  const[play, setPlay] = useState(false);
  const[isLike, setIsLike] = useState(false);
  const[isBuffering, setIsBuffering] = useState(false);

  const isLiked = liked.some((likedUser: any) => likedUser.$id === user?.$id);

  const onLike = async (postId: number, userId: number) => {
    setIsLike(true);
    await updatePostLikes(postId, userId)
    .then(() => setIsLiked(prev => !prev))
    setIsLike(false);
  }

  return (
    <View className="flex-col items-center px-4 mb-10">
        <View className="flex-row gap-3 item-start mb-4">
            <View className="justify-center items-center flex-row flex-1">
                <View className="w-[46px] h-[46px] rounded-lg border border-secondary justify-center items-center p-0.5">
                    <Image 
                        source={{ uri: avatar }}
                        className="w-full h-full rounded-lg"
                        contentFit='cover'
                        priority="high"
                    />
                </View>

                <View className="justify-center flex-1 ml-3 gap-y-1">
                    <Text className="text-white font-psemibold text-sm" numberOfLines={1}>{title}</Text>
                    <Text className="text-xs text-gray-100 font-pregular" numberOfLines={1}>{username}</Text>
                </View>
            </View>

            {isLike ? 
            <LoadingIndicator loading={isLike} loaderStyle='mt-3' /> :
            <TouchableOpacity activeOpacity={0.7} onPress={() => onLike($id, user?.$id)}>
                <View className="pt-2">
                    <Image 
                        source={isLiked ? icons.like : icons.heart}
                        className="w-7 h-7"
                        contentFit='contain'
                        priority="high"
                    />
                </View>
            </TouchableOpacity>}
        </View>

        {play ? (
            <>
                <LoadingIndicator loading={isBuffering} />
                <Video
                    source={{ uri: video }}
                    className="w-full h-60 rounded-xl justify-center items-center relative"
                    resizeMode={ResizeMode.COVER}
                    onLoadStart={() => setIsBuffering(true)}
                    onLoad={() => setIsBuffering(false)}
                    posterSource={{ uri: thumbnail }}
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
                        else if(!status.isBuffering && !status.isPlaying) {
                            setIsBuffering(false);
                        }
                    }}
                />
            </>
        ) : (
            <TouchableOpacity 
                className="w-full h-60 rounded-xl justify-center items-center relative"
                activeOpacity={0.7}
                onPress={() => setPlay(true)}
            >
                <Image 
                    source={{ uri: thumbnail }}
                    className="w-full h-full rounded-xl"
                    contentFit='cover'
                    priority="high"
                />
                <Image 
                    source={icons.playButton}
                    className="w-12 h-12 absolute"
                    contentFit='cover'
                    priority="high"
                /> 
            </TouchableOpacity>
        )
        }
    </View>
  )
}

export default VideoCard;