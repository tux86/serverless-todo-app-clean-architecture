import { inject, injectable } from 'inversify'

import { GetUser } from '@/application/usecases/user/get-user'
import { User } from '@/domain/models/user'
import { TYPES } from '@/ioc/types'
import { ErrorInterceptor } from '@/presentation/interceptors/error.interceptor'
import { WithInterceptor } from '@/presentation/interceptors/interceptor'
import { Controller } from '@/presentation/protocols/controller'
import { IHttpRequest } from '@/presentation/protocols/http-request'
import { IHttpResponse, SuccessHttpResponse } from '@/presentation/protocols/http-response'

@injectable()
export class GetUserController implements Controller<User | never> {
  constructor(@inject(TYPES.GetUser) readonly getUser: GetUser) {}

  @WithInterceptor(new ErrorInterceptor())
  async handleRequest(request: IHttpRequest<{ userId: string }>): Promise<IHttpResponse<User>> {
    const user = await this.getUser.execute(request.params.userId)
    return new SuccessHttpResponse(user)
  }
}
