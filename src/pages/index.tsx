import type { NextPage } from 'next'
import Head from 'next/head'
import { Heading } from '@chakra-ui/react'

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>tag-a-chat</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Heading p={10}>Homepage</Heading>
    </>
  )
}

export default Home
