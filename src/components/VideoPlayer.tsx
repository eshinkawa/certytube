import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import YoutubeIframe from 'react-native-youtube-iframe';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getVideoId } from '../utils/youtube';

interface VideoPlayerProps {
  videoUrl: string;
  onProgressUpdate: (progress: number, duration: number) => void;
  onVideoComplete: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({
  videoUrl,
  onProgressUpdate,
  onVideoComplete,
}) => {
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const playerRef = useRef(null);
  const progressInterval = useRef<NodeJS.Timeout | null>(null);
  const videoId = getVideoId(videoUrl);

  // Load saved progress
  useEffect(() => {
    loadSavedProgress();
    return () => {
      if (progressInterval.current) {
        clearInterval(progressInterval.current);
      }
    };
  }, [videoId]);

  const loadSavedProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(`video-progress-${videoId}`);
      if (savedProgress) {
        const progress = parseFloat(savedProgress);
        setCurrentTime(progress);
        // Seek to saved position
        if (playerRef.current) {
          playerRef.current.seekTo(progress, true);
        }
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const startProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }

    progressInterval.current = setInterval(async () => {
      if (playerRef.current) {
        const currentTime = await playerRef.current.getCurrentTime();
        setCurrentTime(currentTime);
        onProgressUpdate(currentTime, duration);
        // Save progress
        await AsyncStorage.setItem(
          `video-progress-${videoId}`,
          currentTime.toString()
        );
      }
    }, 3000); // Update every 3 seconds
  }, [videoId, duration]);

  const stopProgressTracking = useCallback(() => {
    if (progressInterval.current) {
      clearInterval(progressInterval.current);
    }
  }, []);

  const onStateChange = useCallback((state: string) => {
    if (state === 'ended') {
      setPlaying(false);
      stopProgressTracking();
      onVideoComplete();
      // Clear saved progress when video is completed
      AsyncStorage.removeItem(`video-progress-${videoId}`);
    } else if (state === 'playing') {
      startProgressTracking();
    } else if (state === 'paused') {
      stopProgressTracking();
    }
  }, []);

  const onReady = useCallback(async () => {
    if (playerRef.current) {
      const videoDuration = await playerRef.current.getDuration();
      setDuration(videoDuration);
    }
  }, []);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <YoutubeIframe
        ref={playerRef}
        height={220}
        width={Dimensions.get('window').width}
        videoId={videoId}
        play={playing}
        onChangeState={onStateChange}
        onReady={onReady}
      />

      <View style={styles.controls}>
        <TouchableOpacity
          style={styles.playButton}
          onPress={() => setPlaying(prev => !prev)}
        >
          <Text style={styles.playButtonText}>
            {playing ? 'Pause' : 'Play'}
          </Text>
        </TouchableOpacity>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View 
              style={[
                styles.progress, 
                { width: `${(currentTime / duration) * 100}%` }
              ]} 
            />
          </View>
          <Text style={styles.timeText}>
            {formatTime(currentTime)} / {formatTime(duration)}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#000',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
  },
  controls: {
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  playButton: {
    backgroundColor: '#1a73e8',
    padding: 8,
    borderRadius: 4,
    alignItems: 'center',
    marginBottom: 8,
  },
  playButtonText: {
    color: '#fff',
    fontWeight: '600',
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#ddd',
    borderRadius: 2,
    marginBottom: 4,
  },
  progress: {
    height: '100%',
    backgroundColor: '#1a73e8',
    borderRadius: 2,
  },
  timeText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'right',
  },
});

export default VideoPlayer; 