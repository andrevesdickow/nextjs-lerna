import { createContext, ReactNode, useEffect, useState } from 'react'
import Router from 'next/router'
import { setCookie, parseCookies } from 'nookies'

import { recoverUserInformation, signInRequest } from '../api/auth'
import { api } from '../api/api'

type User = {
  name: string;
  email: string;
}

type SignInData = {
  email: string;
  password: string;
}

type AuthContextType = {
  isAuthenticated: boolean;
  user: User;
  signIn: (data: SignInData) => Promise<void>;
}

type AuthProviderProps = {
  children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextType)

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)

  const isAuthenticated = !!user

  useEffect(() => {
    const { 'next_js_lerna_token': token } = parseCookies()

    if (token) {
      recoverUserInformation(token)
        .then((response) => {
          setUser(response.user)
        })
    }
  }, [])

  async function signIn(data: SignInData) {
    const { token, user } = await signInRequest(data)

    setCookie(undefined, 'next_js_lerna_token', token, {
      maxAge: 60 * 60 * 1, // 1 hour
    })

    setUser(user)

    // seta o novo token
    api.defaults.headers['Authorization'] = `Bearer ${token}`

    // redireciona para a primeira página
    Router.replace('/dashboard')
  }

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        signIn
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}
