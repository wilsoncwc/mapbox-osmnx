import { ChakraProvider } from '@chakra-ui/react'
import '../src/styles/globals.css'
import 'nprogress/nprogress.css'
import dynamic from 'next/dynamic'
import type { AppProps } from 'next/app'

const TopProgressBar = dynamic(
  () => {
    return import('../src/components/TopProgressBar')
  },
  { ssr: false },
)

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ChakraProvider>
      <TopProgressBar />
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
