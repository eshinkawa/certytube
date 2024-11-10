import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import VideoLesson from '../components/VideoLesson';
import { useRoute, RouteProp } from '@react-navigation/native';

type VideoPlayerParams = {
  VideoPlayer: {
    videoUrl: string;
    lessonId: string;
    title?: string;
  };
};

const VideoPlayerScreen = () => {
  const route = useRoute<RouteProp<VideoPlayerParams, 'VideoPlayer'>>();
  const { videoUrl, lessonId, title } = route.params;

  return (
    <SafeAreaView style={styles.container}>
      <VideoLesson 
        videoUrl={videoUrl}
        lessonId={lessonId}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default VideoPlayerScreen; 