// import Mail from '@ioc:Adonis/Addons/Mail'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import LoginValidator from '../Validators/LoginValidator'

export default class LoginController {
  public async index(ctx: HttpContextContract) {
    try {
      await ctx.request.validate(LoginValidator)

      const { email, password } = ctx.request.only(['email', 'password'])

      const token = await ctx.auth.use('api').attempt(email, password)

      // await Mail.use('smtp').send((message) => {
      //   message
      //     .from('noreply@dickow.me')
      //     .to(email)
      //     .subject('Welcome Onboard!')
      //     .htmlView('emails/welcome', {
      //       user: { fullName: email },
      //       url: 'https://dickow.me',
      //     })
      // })

      return token
    } catch (e) {
      return ctx.response
        .status(500)
        .send({
          messages: e.messages,
        })
    }
  }
}
