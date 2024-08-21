import { getAllResults } from '@/actions/result'
import AuthPanel from '@/components/AuthPanel'
import ParallaxScrollView from '@/components/ParallaxScrollView'
import { ThemedView } from '@/components/ThemedView'
import type { Results } from '@/types'
import React from 'react'
import { ScrollView } from 'react-native'
import { ActivityIndicator, DataTable, MD2Colors } from 'react-native-paper'
import { Row, Table } from 'react-native-table-component'

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

      <ScrollView horizontal>
        <ThemedView>
          <Table style={{ marginTop: 8 }}>
            <Row
              data={['Пользователь', 'Вопросы', 'Ответы', 'Процент', 'Дата']}
              widthArr={[120, 100, 80, 80, 180]}
              textStyle={{ paddingHorizontal: 8 }}
              style={{
                backgroundColor: MD2Colors.lightBlue200,
                paddingVertical: 8,
              }}
            />
          </Table>

          <ScrollView>
            <Table>
              {results.slice(from, to).map((item, index) => {
                const data = [
                  item.user_name,
                  item.question_count,
                  item.correct_answer_count,
                  item.correct_answer_percent,
                  new Date(item.created_at).toLocaleString(),
                ]
                return (
                  <Row
                    key={item.id}
                    data={data}
                    widthArr={[120, 100, 80, 80, 180]}
                    style={{
                      paddingVertical: 8,
                      backgroundColor:
                        index % 2 !== 0 ? MD2Colors.lightBlue100 : 'white',
                    }}
                    textStyle={{ paddingHorizontal: 8 }}
                  />
                )
              })}
            </Table>
          </ScrollView>
        </ThemedView>
      </ScrollView>
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
    </ParallaxScrollView>
  )
}
