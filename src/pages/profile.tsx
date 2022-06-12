import { getSession } from 'next-auth/react'
import UserProfile from 'src/components/profile/UserProfile'

const ProfilePage = () => {
  return <UserProfile />
}

export async function getServerSideProps(context: { req: any }) {
  const session = await getSession({ req: context.req })

  if (!session) {
    return {
      redirect: {
        destination: '/login',
        permanent: false,
      },
    }
  }

  return {
    props: { session },
  }
}

export default ProfilePage
