import { inject, injectable } from 'inversify'

import { DeleteUser } from '@/application/usecases/user/delete-user'
import { TYPES } from '@/ioc/types'
import { ErrorInterceptor } from '@/presentation/interceptors/error.interceptor'
import { Controller } from '@/presentation/interfaces/controller'
import { WithInterceptor } from '@/presentation/interfaces/interceptor'
import { IHttpRequest } from '@/presentation/protocols/http-request'
import { DeletedHttpResponse, IHttpResponse } from '@/presentation/protocols/http-response'

@injectable()
export class DeleteUserController implements Controller<void | never> {
  constructor(@inject(TYPES.DeleteUser) readonly deleteUser: DeleteUser) {}

  @WithInterceptor(new ErrorInterceptor())
  async handleRequest(request: IHttpRequest<{ userId: string }>): Promise<IHttpResponse<void>> {
    await this.deleteUser.execute(request.params.userId)
    return new DeletedHttpResponse()
  }
}
