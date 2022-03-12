import type { NextPage } from 'next'
import Head from 'next/head'
import { Heading } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Tagachat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading>Hi there</Heading>
    </>
  )
}

export default Home
