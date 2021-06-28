import '../styles/globals.css'
import { useState } from 'react'
import { QueryClient, QueryClientProvider } from 'react-query'
import { ReactQueryDevtools } from 'react-query/devtools'
import { AppProps } from 'next/app'
import { useUserChanged } from '../hooks/useUserChanged'
import { Provider } from 'react-redux'
import { Hydrate } from 'react-query/hydration'

function MyApp({ Component, pageProps }: AppProps) {
  useUserChanged()

  return <Component {...pageProps} />
}

export default MyApp
