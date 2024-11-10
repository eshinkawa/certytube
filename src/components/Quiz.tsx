import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
} from 'react-native';

interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
}

interface QuizProps {
  questions: Question[];
  onComplete: (score: number) => void;
}

const Quiz: React.FC<QuizProps> = ({ questions, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);

  const handleAnswer = (selectedOption: number) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = selectedOption;
    setAnswers(newAnswers);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      calculateScore();
    }
  };

  const calculateScore = () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / questions.length) * 100);
    setShowResults(true);

    if (score >= 70) {
      Alert.alert(
        "Congratulations! 🎉",
        `You passed with ${score}%! Would you like to share your achievement?`,
        [
          {
            text: "Share to LinkedIn",
            onPress: () => onComplete(score)
          },
          {
            text: "Close",
            style: "cancel"
          }
        ]
      );
    } else {
      Alert.alert(
        "Keep Learning!",
        `You scored ${score}%. Try again to improve your score!`,
        [
          {
            text: "Review Questions",
            onPress: () => resetQuiz()
          },
          {
            text: "Close",
            style: "cancel"
          }
        ]
      );
    }
  };

  const resetQuiz = () => {
    setCurrentQuestion(0);
    setAnswers([]);
    setShowResults(false);
  };

  const renderQuestion = () => {
    const question = questions[currentQuestion];
    return (
      <View style={styles.questionContainer}>
        <Text style={styles.progress}>
          Question {currentQuestion + 1} of {questions.length}
        </Text>
        
        <Text style={styles.question}>{question.question}</Text>
        
        <View style={styles.optionsContainer}>
          {question.options.map((option, index) => (
            <TouchableOpacity
              key={index}
              style={[
                styles.option,
                answers[currentQuestion] === index && styles.selectedOption
              ]}
              onPress={() => handleAnswer(index)}
            >
              <Text style={[
                styles.optionText,
                answers[currentQuestion] === index && styles.selectedOptionText
              ]}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    );
  };

  const renderResults = () => {
    const correctAnswers = answers.reduce((count, answer, index) => {
      return count + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);
    
    const score = Math.round((correctAnswers / questions.length) * 100);

    return (
      <View style={styles.resultsContainer}>
        <Text style={styles.scoreText}>Your Score: {score}%</Text>
        
        <ScrollView style={styles.reviewContainer}>
          {questions.map((question, index) => (
            <View key={index} style={styles.reviewItem}>
              <Text style={styles.reviewQuestion}>{question.question}</Text>
              <Text style={[
                styles.reviewAnswer,
                answers[index] === question.correctAnswer
                  ? styles.correctAnswer
                  : styles.wrongAnswer
              ]}>
                Your answer: {question.options[answers[index]]}
                {answers[index] !== question.correctAnswer && (
                  <Text style={styles.correctAnswerText}>
                    {'\nCorrect answer: '}{question.options[question.correctAnswer]}
                  </Text>
                )}
              </Text>
            </View>
          ))}
        </ScrollView>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={resetQuiz}
        >
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Knowledge Check</Text>
      {showResults ? renderResults() : renderQuestion()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#1a73e8',
  },
  questionContainer: {
    marginBottom: 20,
  },
  progress: {
    fontSize: 14,
    color: '#666',
    marginBottom: 10,
  },
  question: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 20,
    lineHeight: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  option: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f8f9fa',
  },
  selectedOption: {
    backgroundColor: '#1a73e8',
    borderColor: '#1a73e8',
  },
  optionText: {
    fontSize: 16,
    color: '#333',
  },
  selectedOptionText: {
    color: '#fff',
  },
  resultsContainer: {
    padding: 20,
  },
  scoreText: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a73e8',
  },
  reviewContainer: {
    maxHeight: 400,
  },
  reviewItem: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
  },
  reviewQuestion: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  reviewAnswer: {
    fontSize: 14,
    marginTop: 5,
  },
  correctAnswer: {
    color: '#28a745',
  },
  wrongAnswer: {
    color: '#dc3545',
  },
  correctAnswerText: {
    color: '#28a745',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: '#1a73e8',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default Quiz;