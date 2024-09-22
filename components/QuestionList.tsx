import React, { useEffect, useState } from 'react'
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
import { useUser } from '@clerk/clerk-expo'
import canSave from '@/lib/utils'
import SyntaxHighlighter from './SyntaxHighlighter'
import { Toast } from 'toastify-react-native'
import { useTheme } from './ThemeProvider'
import { useGetResults } from '@/hooks/useGetResults'
import { useCreateResult } from '@/hooks/useCreateResult'
import { useUpdateResult } from '@/hooks/useUpdateResult'
import { Id } from '@/convex/_generated/dataModel'

type Props = {
  questions: TQuestions
  setGameStarted: (v: boolean) => void
}

export default function QuestionList({ questions, setGameStarted }: Props) {
  const [userAnswers, setUserAnswers] = useState<
    Record<number, { selectedAnswerIndex: number; correct: boolean }>
  >({})
  const [gameFinished, setGameFinished] = useState(false)
  const [loading, setLoading] = useState(false)
  const [savingEnabledOrResultId, setSavingEnabledOrResultId] = useState<
    boolean | string
  >(false)

  const { user, isSignedIn } = useUser()
  const { data: results } = useGetResults()
  const { mutate: createResult } = useCreateResult()
  const { mutate: updateResult } = useUpdateResult()

  const { theme } = useTheme()

  useEffect(() => {
    setLoading(true)
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
    setUserAnswers(newAnswers)
    setLoading(false)
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
    setLoading(false)
    setGameStarted(false)
  }

  const finishGame = async () => {
    if (gameFinished) {
      return resetGame()
    }
    setGameFinished(true)
    const canSaveOrResultId = await canSave(results, correctAnswerCount)
    if (canSaveOrResultId) {
      setSavingEnabledOrResultId(canSaveOrResultId)
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
    if (!isSignedIn || !savingEnabledOrResultId) return
    setLoading(true)
    const userName =
      user.fullName || `${user.firstName} ${user.lastName}`.trim()
    let resultId: Id<'results'> | undefined
    if (typeof savingEnabledOrResultId === 'string') {
      resultId = await updateResult({
        id: savingEnabledOrResultId as Id<'results'>,
        userName,
        questionCount: questions.length,
        correctAnswerCount: correctAnswerCount,
        correctAnswerPercent: correctAnswerPercent,
      })
    } else {
      resultId = await createResult({
        userName,
        questionCount: questions.length,
        correctAnswerCount: correctAnswerCount,
        correctAnswerPercent: correctAnswerPercent,
      })
    }
    if (!resultId) {
      setLoading(false)
      Toast.error('При сохранении результата возникла ошибка.', 'center')
      return
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
          loading={loading}
          disabled={loading}
          buttonColor={
            theme === 'light' ? MD2Colors.blue600 : MD2Colors.blue400
          }
          icon={gameFinished ? 'flag-checkered' : 'check'}
        >
          {gameFinished ? 'Завершить' : 'Проверить'}
        </Button>
        {gameFinished && isSignedIn && savingEnabledOrResultId && (
          <Button
            onPress={handleSaveResult}
            mode='contained'
            loading={loading}
            disabled={loading}
            buttonColor={
              theme === 'light' ? MD2Colors.green600 : MD2Colors.green400
            }
            icon='content-save'
          >
            Сохранить
          </Button>
        )}
      </ThemedView>
      {gameFinished && (
        <ThemedView>
          <ThemedText type='subtitle' style={{ color, textAlign: 'center' }}>
            Правильных ответов:
          </ThemedText>
          <ThemedText type='subtitle' style={{ color, textAlign: 'center' }}>
            {correctAnswerCount} из {questions.length} ({correctAnswerPercent}
            %).
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
                <List.Accordion title='Ответ и объяснение' expanded>
                  <ThemedView
                    style={{
                      gap: 8,
                    }}
                  >
                    <ThemedText style={{ color: 'green' }}>
                      Правильный ответ: {answers[correctAnswerIndex]}
                    </ThemedText>
                    <ThemedText
                      style={{
                        color: '#eee',
                        backgroundColor: '#222',
                        padding: 16,
                      }}
                    >
                      {explanation}
                    </ThemedText>
                  </ThemedView>
                </List.Accordion>
              )}
            </ThemedView>
          )
        })}
      </ThemedView>
      {gameFinished && (
        <ThemedView>
          <ThemedText type='subtitle' style={{ color, textAlign: 'center' }}>
            Правильных ответов:
          </ThemedText>
          <ThemedText type='subtitle' style={{ color, textAlign: 'center' }}>
            {correctAnswerCount} из {questions.length} ({correctAnswerPercent}
            %).
          </ThemedText>
        </ThemedView>
      )}
      <ThemedView style={{ display: 'flex', flexDirection: 'row', gap: 16 }}>
        <Button
          onPress={finishGame}
          mode='contained'
          loading={loading}
          disabled={loading}
          buttonColor={
            theme === 'light' ? MD2Colors.blue600 : MD2Colors.blue400
          }
          icon={gameFinished ? 'flag-checkered' : 'check'}
        >
          {gameFinished ? 'Завершить' : 'Проверить'}
        </Button>
        {gameFinished && isSignedIn && savingEnabledOrResultId && (
          <Button
            onPress={handleSaveResult}
            mode='contained'
            loading={loading}
            disabled={loading}
            buttonColor={
              theme === 'light' ? MD2Colors.green600 : MD2Colors.green400
            }
            icon='content-save'
          >
            Сохранить
          </Button>
        )}
      </ThemedView>
    </ThemedView>
  )
}
