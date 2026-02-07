import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { darkTheme } from '../configs/theme.css'
import { AiProvider } from '../features/ai/stores/aiStore'
import { ConnectionsProvider } from '../features/connections/stores/connectionsStore'
import { EditorProvider } from '../features/editor/stores/editorStore'
import { SchemaProvider, useSchemaStore } from '../features/schema/stores/schemaStore'
import { ResultsProvider } from '../features/results/stores/resultsStore'
import { ConnectionList } from '../features/connections/components/ConnectionList'
import { AppLayout } from './AppLayout'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
})

function AppContent() {
  const { connection } = useSchemaStore()

  if (!connection) {
    return <ConnectionList />
  }

  return <AppLayout />
}

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SchemaProvider>
        <AiProvider>
          <ConnectionsProvider>
            <EditorProvider>
              <ResultsProvider>
                <div className={darkTheme}>
                  <AppContent />
                </div>
              </ResultsProvider>
            </EditorProvider>
          </ConnectionsProvider>
        </AiProvider>
      </SchemaProvider>
    </QueryClientProvider>
  )
}
