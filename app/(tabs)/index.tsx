import AuthPanel from '@/components/AuthPanel'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import QuestionList from '@/components/QuestionList'
import WelcomeScreen from '@/components/WelcomeScreen'
import questions from '@/constants/questions'
import { useAsyncStorage } from '@/hooks/useAsyncStorage'
import { shuffle } from '@/lib/utils'
import type { ListItem } from 'react-native-paper-select/lib/typescript/interface/paperSelect.interface'

export const initialQuestionsCountValue = {
  value: '10',
  list: [
    { _id: '1', value: '10' },
    { _id: '2', value: '20' },
    { _id: '3', value: '30' },
    { _id: '4', value: '40' },
    { _id: '5', value: '50' },
    { _id: '6', value: '60' },
    { _id: '7', value: '70' },
    { _id: '8', value: '80' },
    { _id: '9', value: '90' },
    { _id: '10', value: '100' },
  ],
  selectedList: [] as ListItem[],
  error: '',
}

export default function HomeScreen() {
  const [questionCount, setQuestionCount] = useAsyncStorage(
    'javascript-question-expo:questionCount',
    initialQuestionsCountValue,
  )
  const [isGameStarted, setGameStarted] = useAsyncStorage(
    'javascript-question-expo:isGameStarted',
    false,
  )

  return (
    <ParallaxScrollView>
      <AuthPanel />

      {isGameStarted ? (
        <QuestionList
          questions={shuffle(questions).slice(0, +questionCount.value)}
          setGameStarted={setGameStarted}
        />
      ) : (
        <WelcomeScreen
          questionCount={questionCount}
          setQuestionCount={setQuestionCount}
          setGameStarted={setGameStarted}
        />
      )}
    </ParallaxScrollView>
  )
}
