import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {SessionProvider} from 'next-auth/react'



function MyApp({ Component, pageProps }: AppProps) {
  const {session} : any  = pageProps
  return( 
    
    <SessionProvider  session={session}>
  <Component className="scroll-smooth" {...pageProps} />
  </SessionProvider>
  
  )
}

export default MyApp
