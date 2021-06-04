import { useContext, useEffect } from "react"
import { GetServerSideProps } from "next"
import Head from "next/head"
import { parseCookies } from 'nookies'
import { api } from "./api/api"
import { AuthContext } from "./contexts/AuthContext"
import { getApiClient } from "./api/axios"

export default function Dashboard() {
  const { user } = useContext(AuthContext)

  useEffect(() => {
    api.get('/users')
  }, [])

  return (
    <div>
      <Head>
        <title>Dashboard</title>
      </Head>

      <h3>Olá, {user?.name}</h3>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const apiClient = getApiClient(ctx)
  const { 'next_js_lerna_token': token } = parseCookies(ctx)

  if (!token) {
    return {
      redirect: {
        destination: '/',
        permanent: false
      }
    }
  }

  await apiClient.get('/users')

  return {
    props: {}
  }
}
