import { getAllResults } from '@/actions/result'
import { Result } from '../types'

export function shuffle<T>(arr: T[]) {
  let l = arr.length
  while (l) {
    const i = Math.floor(Math.random() * l--)
    ;[arr[l], arr[i]] = [arr[i], arr[l]]
  }
  return arr
}

export default async function canSave(
  resultData: Pick<Result, 'question_count' | 'correct_answer_percent'>,
) {
  try {
    const results = await getAllResults()
    if (!results || results.length < 100) {
      return true
    }

    const worseResult = results[results.length - 1]

    if (
      resultData.question_count >= worseResult.question_count &&
      resultData.correct_answer_percent >= worseResult.correct_answer_percent
    ) {
      return worseResult.id
    }

    return false
  } catch (e) {
    console.error(e)
  }
  return false
}
