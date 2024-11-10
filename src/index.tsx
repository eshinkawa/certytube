import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import VideoLesson from './components/VideoLesson';

const App = () => {
  const [videoUrl, setVideoUrl] = useState('');
  const [isVideoStarted, setIsVideoStarted] = useState(false);

  const handleStartLesson = () => {
    if (videoUrl.trim()) {
      setIsVideoStarted(true);
    }
  };

  const handleReset = () => {
    setIsVideoStarted(false);
    setVideoUrl('');
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.container}
      >
        {!isVideoStarted ? (
          <View style={styles.inputContainer}>
            <Text style={styles.title}>CertyTube</Text>
            <Text style={styles.subtitle}>
              Learn from YouTube videos and earn certificates
            </Text>
            
            <TextInput
              style={styles.input}
              placeholder="Enter YouTube URL"
              value={videoUrl}
              onChangeText={setVideoUrl}
              autoCapitalize="none"
              autoCorrect={false}
            />
            
            <TouchableOpacity
              style={[
                styles.button,
                !videoUrl.trim() && styles.buttonDisabled
              ]}
              onPress={handleStartLesson}
              disabled={!videoUrl.trim()}
            >
              <Text style={styles.buttonText}>Start Learning</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.lessonContainer}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={handleReset}
            >
              <Text style={styles.backButtonText}>← Back</Text>
            </TouchableOpacity>
            
            <VideoLesson
              videoUrl={videoUrl}
              lessonId={`lesson_${Date.now()}`} // Generate unique lesson ID
            />
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  inputContainer: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#1a73e8',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 20,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#ccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  lessonContainer: {
    flex: 1,
  },
  backButton: {
    padding: 15,
  },
  backButtonText: {
    color: '#1a73e8',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App; 