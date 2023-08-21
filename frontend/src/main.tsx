import React from 'react'
import ReactDOM from 'react-dom/client'
import MyRoutes from './routes'
import { ReactQueryDevtools } from 'react-query/devtools'
import {
  QueryClient,
  QueryClientProvider,
} from 'react-query'
import { ObservedQueryProvider } from './hooks/useObservedQuery'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(

  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <ObservedQueryProvider>
        <ReactQueryDevtools initialIsOpen={false} />
        <MyRoutes />
      </ObservedQueryProvider>
    </QueryClientProvider>
  </React.StrictMode>,
)
