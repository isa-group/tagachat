import type { NextPage } from 'next'
import Head from 'next/head'
import SessionList from 'src/components/sessions/SessionList'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>tag-a-chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <SessionList />
    </>
  )
}

export default Home
