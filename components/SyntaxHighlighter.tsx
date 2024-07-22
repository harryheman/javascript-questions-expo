import React from 'react'
import { StyleSheet } from 'react-native'
import CodeHighlighter from 'react-native-code-highlighter'
import { atomOneDarkReasonable } from 'react-syntax-highlighter/dist/esm/styles/hljs'

type Props = {
  code: string
}

export default function HighlightComponent({ code }: Props) {
  return (
    <CodeHighlighter
      hljsStyle={atomOneDarkReasonable}
      scrollViewProps={{
        contentContainerStyle: styles.codeContainer,
      }}
      textStyle={styles.text}
      language='javascript'
      wrapLongLines
      lineProps={{ style: { wordBreak: 'break-all', whiteSpace: 'pre-wrap' } }}
    >
      {code}
    </CodeHighlighter>
  )
}

const styles = StyleSheet.create({
  codeContainer: {
    padding: 16,
    minWidth: '100%',
  },
  text: {
    fontSize: 16,
  },
})
