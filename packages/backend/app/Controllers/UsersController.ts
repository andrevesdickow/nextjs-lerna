import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import { get, isEmpty } from 'lodash'

import ReturnMessage, { StatusCode, TypeMessage } from '../Models/Dto/ReturnMessage'
import Users from '../Models/Users'
import UserValidator from '../Validators/UserValidator'

export default class UsersController {
  public async index(): Promise<ReturnMessage> {
    const all = await Users.all()

    return {
      response: all,
      success: true,
    }
  }

  public async create(ctx: HttpContextContract): Promise<ReturnMessage> {
    try {
      await ctx.request.validate(UserValidator)

      const { email, password } = ctx.request.only(['email', 'password'])

      const user = await Users.create({
        email,
        password,
      })

      return {
        response: user,
        success: true,
        messages: [{
          message: 'Usuário criado com sucesso',
          type: TypeMessage.Success,
          code: StatusCode.OK,
        }],
      }
    } catch (error) {
      return {
        response: null,
        success: false,
        messages: [{
          message: get(error, 'message', 'Falha ao criar usuário'),
          type: TypeMessage.Error,
          code: StatusCode.BusinessException,
        }],
      }
    }
  }

  public async update(ctx: HttpContextContract): Promise<ReturnMessage> {
    try {
      const id = ctx.request.param('id')
      const { email } = ctx.request.only(['email', 'password'])

      const user = await Users
        .query()
        .where('id', id)
        .update({ email })

      return {
        response: user,
        success: true,
        messages: [{
          message: 'Usuário editado com sucesso',
          type: TypeMessage.Success,
          code: StatusCode.OK,
        }],
      }
    } catch (error) {
      return {
        response: null,
        success: false,
        messages: [{
          message: get(error, 'message', 'Falha ao deletar usuário'),
          type: TypeMessage.Error,
          code: StatusCode.BusinessException,
        }],
      }
    }
  }

  public async delete(ctx: HttpContextContract): Promise<ReturnMessage> {
    try {
      const id = ctx.request.param('id')
      const user = await Users.findOrFail(id)

      if (isEmpty(user)) {
        return {
          response: null,
          success: false,
          messages: [{
            message: 'Usuário não encontrado.',
            type: TypeMessage.Error,
            code: StatusCode.NotFound,
          }],
        }
      }

      await user?.delete()

      return {
        response: user,
        success: true,
        messages: [{
          message: 'Usuário deletado com sucesso',
          type: TypeMessage.Success,
          code: StatusCode.OK,
        }],
      }
    } catch (error) {
      return {
        response: null,
        success: false,
        messages: [{
          message: get(error, 'message', 'Falha ao deletar usuário'),
          type: TypeMessage.Error,
          code: StatusCode.BusinessException,
        }],
      }
    }
  }
}
