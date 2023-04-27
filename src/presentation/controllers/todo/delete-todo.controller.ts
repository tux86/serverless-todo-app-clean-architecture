import { inject, injectable } from 'inversify'

import { DeleteTodo } from '@/application/usecases/todo/delete-todo'
import { Todo } from '@/domain/models/todo'
import { Logger } from '@/infrastructure/helpers/Logger'
import { TYPES } from '@/ioc/types'
import { ErrorInterceptor } from '@/presentation/interceptors/error.interceptor'
import { WithInterceptor } from '@/presentation/interceptors/interceptor'
import { Controller } from '@/presentation/protocols/controller'
import { IHttpRequest } from '@/presentation/protocols/http-request'
import { DeletedHttpResponse, IHttpResponse } from '@/presentation/protocols/http-response'

const logger = Logger.getInstance()

@injectable()
export class DeleteTodoController implements Controller<Todo | never> {
  constructor(@inject(TYPES.DeleteTodo) readonly deleteTodo: DeleteTodo) {
    logger.debug(`------------------- initializing ${this.constructor.name} -------------------`)
  }

  @WithInterceptor(new ErrorInterceptor())
  async handleRequest(request: IHttpRequest<{ todoId: string }>): Promise<IHttpResponse<Todo>> {
    await this.deleteTodo.execute(request.params.todoId)
    return new DeletedHttpResponse()
  }
}
