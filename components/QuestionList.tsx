import React from 'react'
import { ThemedText } from './ThemedText'
import type { TQuestions } from '@/types'
import { ThemedView } from './ThemedView'
import {
  Button,
  HelperText,
  List,
  MD2Colors,
  RadioButton,
} from 'react-native-paper'
import { useAsyncStorage } from '@/hooks/useAsyncStorage'
import { useUser } from '@clerk/clerk-expo'
import canSave from '@/lib/utils'
import { saveResult } from '@/actions/result'
import SyntaxHighlighter from './SyntaxHighlighter'
import { Toast } from 'toastify-react-native'

type Props = {
  questions: TQuestions
  setGameStarted: (v: boolean) => void
}

export default function QuestionList({ questions, setGameStarted }: Props) {
  const [userAnswers, setUserAnswers] = useAsyncStorage<
    Record<number, { selectedAnswerIndex: number; correct: boolean }>
  >('javascript-question-expo:userAnswers', {})
  const [gameFinished, setGameFinished] = useAsyncStorage(
    'javascript-question-expo:gameFinished',
    false,
  )
  const [loading, setLoading] = React.useState(false)
  const [savingEnabledOrWorseResultId, setSavingEnabledOrWorseResultId] =
    React.useState<boolean | string>(false)

  const { user, isSignedIn } = useUser()

  React.useEffect(() => {
    let timeoutId: NodeJS.Timeout
    const newAnswers: Record<
      number,
      { selectedAnswerIndex: number; correct: boolean }
    > = {}
    for (let i = 0; i < questions.length; i++) {
      newAnswers[i] = {
        selectedAnswerIndex: 0,
        correct: questions[i].correctAnswerIndex === 0,
      }
    }
    setLoading(true)
    timeoutId = setTimeout(() => {
      setLoading(false)
      setUserAnswers(newAnswers)
      clearTimeout(timeoutId)
    }, 2000)

    return () => {
      clearTimeout(timeoutId)
    }
  }, [questions])

  const handleChange = (
    i: number,
    selectedAnswerIndex: number,
    correctAnswerIndex: number,
  ) => {
    const newAnswers = { ...userAnswers }
    if (newAnswers) {
      newAnswers[i] = {
        selectedAnswerIndex,
        correct: selectedAnswerIndex === correctAnswerIndex,
      }
      setUserAnswers(newAnswers)
    }
  }

  const resetGame = () => {
    setLoading(true)
    setGameFinished(false)
    setUserAnswers({})
    const timeoutId = setTimeout(() => {
      setLoading(false)
      setGameStarted(false)
      clearTimeout(timeoutId)
    }, 2000)
  }

  const finishGame = async () => {
    if (gameFinished) {
      return resetGame()
    }
    setGameFinished(true)
    const canSaveOrWorseResultId = await canSave({
      question_count: questions.length,
      correct_answer_percent: correctAnswerPercent,
    })
    if (canSaveOrWorseResultId) {
      setSavingEnabledOrWorseResultId(canSaveOrWorseResultId)
    }
  }

  const correctAnswerCount = Object.values(userAnswers || {}).filter(
    ({ correct }) => correct,
  ).length
  const correctAnswerPercent = Math.round(
    (100 * correctAnswerCount) / questions.length,
  )
  const color =
    correctAnswerPercent < 50 ? 'red' : correctAnswerPercent > 75 ? 'green' : ''

  const handleSaveResult = async () => {
    if (!isSignedIn || !savingEnabledOrWorseResultId) return
    setLoading(true)
    const result = await saveResult(
      {
        user_id: user.id,
        user_name: user.fullName || `${user.firstName} ${user.lastName}`.trim(),
        question_count: questions.length,
        correct_answer_count: correctAnswerCount,
        correct_answer_percent: correctAnswerPercent,
      },
      savingEnabledOrWorseResultId,
    )
    if (!result) {
      setLoading(false)
      return Toast.error('При сохранении результата возникла ошибка.', 'center')
    }
    Toast.success('Результат сохранен.')
    const timeoutId = setTimeout(() => {
      setLoading(false)
      resetGame()
      clearTimeout(timeoutId)
    }, 3000)
  }

  return (
    <ThemedView
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: 16,
        alignItems: 'center',
      }}
    >
      <ThemedText type='subtitle'>Вопросы</ThemedText>
      <ThemedView style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Button
          onPress={finishGame}
          mode='contained'
          disabled={loading}
          buttonColor={MD2Colors.blue600}
          icon={gameFinished ? 'flag-checkered' : 'check'}
        >
          {gameFinished ? 'Завершить' : 'Проверить'}
        </Button>
        {gameFinished && isSignedIn && savingEnabledOrWorseResultId && (
          <Button
            onPress={handleSaveResult}
            mode='contained'
            disabled={loading}
            buttonColor={MD2Colors.green600}
            icon='content-save'
          >
            Сохранить
          </Button>
        )}
      </ThemedView>
      {gameFinished && (
        <ThemedView>
          <ThemedText type='subtitle' style={{ color, textAlign: 'center' }}>
            Правильных ответов: {correctAnswerPercent}%
          </ThemedText>
          <ThemedText type='subtitle' style={{ color, textAlign: 'center' }}>
            ({correctAnswerCount} из {questions.length}
            ).
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          gap: 24,
        }}
      >
        {questions.map((q, i) => {
          const { question, answers, correctAnswerIndex, explanation } = q

          const selectedAnswerIndex =
            (userAnswers && userAnswers[i]?.selectedAnswerIndex) || 0
          const isError =
            gameFinished && selectedAnswerIndex !== correctAnswerIndex

          return (
            <ThemedView
              key={`question-${i}`}
              style={{ display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <ThemedText type='subtitle'>Вопрос {i + 1}</ThemedText>
              <SyntaxHighlighter code={question} />
              <ThemedView>
                <RadioButton.Group
                  value={String(selectedAnswerIndex)}
                  onValueChange={(v) => {
                    handleChange(i, Number(v), correctAnswerIndex)
                  }}
                >
                  {answers.map((a, j) => {
                    return (
                      <RadioButton.Item
                        key={`question-${i}-answer-${j}`}
                        value={String(j)}
                        label={a}
                        position='leading'
                        labelStyle={{
                          textAlign: 'left',
                        }}
                        disabled={gameFinished}
                      />
                    )
                  })}
                </RadioButton.Group>
                {isError && (
                  <HelperText type='error'>
                    Вы выбрали неправильный ответ.
                  </HelperText>
                )}
              </ThemedView>
              {isError && (
                <List.Accordion title='Ответ и объяснение'>
                  <ThemedView
                    style={{
                      gap: 8,
                    }}
                  >
                    <ThemedText style={{ color: 'green' }}>
                      Правильный ответ: {answers[correctAnswerIndex]}
                    </ThemedText>
                    <SyntaxHighlighter code={explanation} />
                  </ThemedView>
                </List.Accordion>
              )}
            </ThemedView>
          )
        })}
      </ThemedView>
      {gameFinished && (
        <ThemedText type='subtitle' style={{ color }}>
          Правильных ответов: {correctAnswerPercent}% ({correctAnswerCount} из{' '}
          {questions.length}).
        </ThemedText>
      )}
      <ThemedView style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Button
          onPress={finishGame}
          mode='contained'
          disabled={loading}
          buttonColor={MD2Colors.blue600}
          icon={gameFinished ? 'flag-checkered' : 'check'}
        >
          {gameFinished ? 'Завершить' : 'Проверить'}
        </Button>
        {gameFinished && isSignedIn && savingEnabledOrWorseResultId && (
          <Button
            onPress={handleSaveResult}
            mode='contained'
            disabled={loading}
            buttonColor={MD2Colors.green600}
            icon='content-save'
          >
            Сохранить
          </Button>
        )}
      </ThemedView>
    </ThemedView>
  )
}
