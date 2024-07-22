import { getAllResults } from '@/actions/result'
import AuthPanel from '@/components/AuthPanel'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedText } from '@/components/ThemedText'
import { ThemedView } from '@/components/ThemedView'
import type { Results } from '@/types'
import React from 'react'
import { ActivityIndicator, DataTable, MD2Colors } from 'react-native-paper'

const numberOfItemsPerPageList = [5, 10, 15, 20, 25, 30, 50, 100]

export default function TabTwoScreen() {
  const [page, setPage] = React.useState<number>(0)
  const [itemsPerPage, onItemsPerPageChange] = React.useState(
    numberOfItemsPerPageList[0],
  )
  const [results, setResults] = React.useState<Results | null>(null)

  React.useEffect(() => {
    getAllResults().then((results) => setResults(results || []))
  }, [])

  React.useEffect(() => {
    setPage(0)
  }, [itemsPerPage])

  if (!results) {
    return (
      <ParallaxScrollView>
        <ActivityIndicator
          size='large'
          animating={true}
          color={MD2Colors.indigo400}
        />
      </ParallaxScrollView>
    )
  }

  const from = page * itemsPerPage
  const to = Math.min((page + 1) * itemsPerPage, results.length)

  return (
    <ParallaxScrollView>
      <AuthPanel />

      <DataTable>
        <DataTable.Header>
          <DataTable.Title>Пользователь</DataTable.Title>
          <DataTable.Title numeric>Вопросы</DataTable.Title>
          <DataTable.Title numeric>Ответы</DataTable.Title>
          <DataTable.Title numeric>Процент</DataTable.Title>
        </DataTable.Header>

        {results.slice(from, to).map((item) => (
          <DataTable.Row key={item.id}>
            <DataTable.Cell>{item.user_name}</DataTable.Cell>
            <DataTable.Cell numeric>{item.question_count}</DataTable.Cell>
            <DataTable.Cell numeric>{item.correct_answer_count}</DataTable.Cell>
            <DataTable.Cell numeric>
              {item.correct_answer_percent}
            </DataTable.Cell>
          </DataTable.Row>
        ))}

        <DataTable.Pagination
          page={page}
          numberOfPages={Math.ceil(results.length / itemsPerPage)}
          onPageChange={(page) => setPage(page)}
          label={`${from + 1}-${to} из ${results.length}`}
          numberOfItemsPerPageList={numberOfItemsPerPageList}
          numberOfItemsPerPage={itemsPerPage}
          onItemsPerPageChange={onItemsPerPageChange}
          showFastPaginationControls
        />
      </DataTable>
    </ParallaxScrollView>
  )
}
