import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, SafeAreaView } from 'react-native';
import VideoPlayer from './VideoPlayer';
import Quiz from './Quiz';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface VideoLessonProps {
  videoUrl: string;
  lessonId: string;
}

interface ProgressData {
  currentTime: number;
  duration: number;
  percentage: number;
  lastUpdated: string;
}

const VideoLesson: React.FC<VideoLessonProps> = ({ videoUrl, lessonId }) => {
  const [progress, setProgress] = useState<ProgressData | null>(null);
  const [summary, setSummary] = useState('');
  const [quizData, setQuizData] = useState(null);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    // Fetch summary and quiz data from backend
    fetchLessonData(lessonId);
  }, [lessonId]);

  const fetchLessonData = async (id: string) => {
    try {
      // Replace with your API endpoints
      const summaryResponse = await fetch(`/api/lessons/${id}/summary`);
      const quizResponse = await fetch(`/api/lessons/${id}/quiz`);
      
      setSummary(await summaryResponse.json());
      setQuizData(await quizResponse.json());
    } catch (error) {
      console.error('Error fetching lesson data:', error);
    }
  };

  const handleProgressUpdate = async (currentTime: number, duration: number) => {
    console.log('Progress Update:', { currentTime, duration });
    
    if (!isNaN(currentTime) && !isNaN(duration) && duration > 0) {
        const percentage = Math.min((currentTime / duration) * 100, 100);
        const progressData: ProgressData = {
            currentTime,
            duration,
            percentage,
            lastUpdated: new Date().toISOString(),
        };

        setProgress(progressData);

        try {
            await AsyncStorage.setItem(
                `lesson-progress-${lessonId}`,
                JSON.stringify(progressData)
            );
            await saveLessonProgress(lessonId, progressData);
        } catch (error) {
            console.error('Error saving progress:', error);
        }
    }
  };

  // Load saved progress when component mounts
  useEffect(() => {
    loadProgress();
  }, [lessonId]);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem(`lesson-progress-${lessonId}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      }
    } catch (error) {
      console.error('Error loading progress:', error);
    }
  };

  const handleVideoComplete = () => {
    setIsCompleted(true);
    // Update completion status in backend
    updateLessonStatus(lessonId, 'completed');
  };

  const saveLessonProgress = async (lessonId: string, progressData: ProgressData) => {
    try {
      await fetch(`/api/lessons/${lessonId}/progress`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(progressData),
      });
    } catch (error) {
      console.error('Error saving progress to backend:', error);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container}>
        <VideoPlayer
          videoUrl={videoUrl}
          onProgressUpdate={handleProgressUpdate} 
          onVideoComplete={handleVideoComplete}
        />
        
        {progress && (
          <View style={styles.progressInfo}>
            <Text style={styles.progressText}>
              Progress: {Math.round(progress.percentage)}%
            </Text>
            {progress.percentage >= 90 && !isCompleted && (
              <Text style={styles.almostDoneText}>
                Almost there! Keep watching to unlock the quiz.
              </Text>
            )}
          </View>
        )}

        {summary && (
          <View style={{ padding: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Summary</Text>
            <Text>{summary}</Text>
          </View>
        )}

        {isCompleted && quizData && (
          <Quiz
            questions={quizData}
            onComplete={(score) => {
              // Handle quiz completion
              shareToLinkedIn(lessonId, score);
            }}
          />
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
  },
  progressInfo: {
    padding: 16,
    backgroundColor: '#f8f9fa',
    marginBottom: 16,
    borderRadius: 8,
  },
  progressText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1a73e8',
  },
  almostDoneText: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
});

export default VideoLesson; 

function updateLessonStatus(lessonId: string, arg1: string) {
    throw new Error('Function not implemented.');
}
