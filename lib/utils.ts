import { Doc } from '@/convex/_generated/dataModel'

export function shuffle<T>(arr: T[]) {
  let l = arr.length
  while (l) {
    const i = Math.floor(Math.random() * l--)
    ;[arr[l], arr[i]] = [arr[i], arr[l]]
  }
  return arr
}

export default async function canSave(
  results: Doc<'results'>[],
  correctAnswerCount: number,
) {
  if (!results || results.length < 100) {
    return true
  }

  // Находим худший результат
  const worstResult = results[results.length - 1]

  if (correctAnswerCount >= worstResult.correctAnswerCount) {
    return worstResult._id
  }

  // Находим результат с равным количеством правильных ответов
  const sameResult = results.find(
    (i) => i.correctAnswerCount === correctAnswerCount,
  )
  if (sameResult) {
    return sameResult._id
  }

  return false
}
