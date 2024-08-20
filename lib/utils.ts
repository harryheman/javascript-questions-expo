import { getAllResults } from '@/actions/result'

export function shuffle<T>(arr: T[]) {
  let l = arr.length
  while (l) {
    const i = Math.floor(Math.random() * l--)
    ;[arr[l], arr[i]] = [arr[i], arr[l]]
  }
  return arr
}

export default async function canSave(correctAnswerCount: number) {
  try {
    const results = await getAllResults()
    if (!results || results.length < 100) {
      return true
    }

    // Находим худший результат
    const worstResult = results[results.length - 1]

    if (correctAnswerCount >= worstResult.correct_answer_count) {
      return worstResult.id
    }

    // Находим результат с равным количеством правильных ответов
    const sameResult = results.find(
      (i) => i.correct_answer_count === correctAnswerCount,
    )
    if (sameResult) {
      return sameResult.id
    }
  } catch (e) {
    console.error(e)
  }

  return false
}
