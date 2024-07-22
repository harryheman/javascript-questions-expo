import { initialQuestionsCountValue } from '@/app/(tabs)'
import React from 'react'
import { ThemedView } from './ThemedView'
import { ThemedText } from './ThemedText'
import { PaperSelect } from 'react-native-paper-select'
import { Button, MD2Colors } from 'react-native-paper'

type Props = {
  questionCount: typeof initialQuestionsCountValue
  setQuestionCount: React.Dispatch<
    React.SetStateAction<typeof initialQuestionsCountValue>
  >
  setGameStarted: React.Dispatch<React.SetStateAction<boolean>>
}

export default function WelcomeScreen({
  questionCount,
  setQuestionCount,
  setGameStarted,
}: Props) {
  return (
    <ThemedView
      style={{
        marginTop: 32,
        gap: 16,
        alignItems: 'center',
      }}
    >
      <ThemedText type='title' style={{ textAlign: 'center' }}>
        Добро пожаловать в игру "JavaScript Questions"!
      </ThemedText>
      <ThemedText type='subtitle' style={{ textAlign: 'center' }}>
        Готов ли ты проверить свои знания JavaScript и доказать всем, что ты -
        настоящий JS-ниндзя?
      </ThemedText>
      <ThemedView style={{ width: 250 }}>
        <PaperSelect
          label='Количество вопросов'
          value={questionCount.value}
          onSelection={(item) =>
            setQuestionCount({
              ...questionCount,
              value: item.text,
              selectedList: item.selectedList,
              error: '',
            })
          }
          textInputMode='outlined'
          arrayList={questionCount.list}
          selectedArrayList={questionCount.selectedList}
          errorText={questionCount.error}
          multiEnable={false}
          searchText='Поиск...'
          dialogDoneButtonText='Выбрать'
          dialogCloseButtonText='Отмена'
        />
      </ThemedView>
      <Button
        onPress={() => setGameStarted(true)}
        icon='gamepad'
        mode='contained'
        buttonColor={MD2Colors.green600}
      >
        Играть
      </Button>
    </ThemedView>
  )
}
