import { v4 as uuid } from 'uuid'

type SignInRequestData = {
  email: string;
  password: string;
}

const delay = (amount = 750) => new Promise(resolve => setTimeout(resolve, amount))

export async function signInRequest(data: SignInRequestData) {
  await delay()

  return {
    token: uuid(),
    user: {
      name: 'Andrêves Dickow',
      email: data.email
    }
  }
}

export async function recoverUserInformation(token: string) {
  await delay()

  return {
    token,
    user: {
      name: 'Andrêves Dickow',
      email: 'andreves@dickow.me'
    }
  }
}
