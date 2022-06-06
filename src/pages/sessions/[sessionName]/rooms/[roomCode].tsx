import Head from 'next/head'
import Room from 'src/components/rooms/Room'

const RoomPage = () => {
  return (
    <>
      <Head>
        <title>Room | tag-a-chat</title>
      </Head>
      <Room />
    </>
  )
}

export default RoomPage
