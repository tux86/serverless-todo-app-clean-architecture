import { inject, injectable } from 'inversify'

import { UpdateTodoInput } from '@/application/dtos/todo/update-todo-input'
import { UpdateTodo } from '@/application/usecases/todo/update-todo'
import { Todo } from '@/domain/models/todo'
import { TYPES } from '@/ioc/types'
import { ErrorInterceptor } from '@/presentation/interceptors/error.interceptor'
import { Controller } from '@/presentation/interfaces/controller'
import { WithInterceptor } from '@/presentation/interfaces/interceptor'
import { IHttpRequest } from '@/presentation/protocols/http-request'
import { IHttpResponse, UpdatedHttpResponse } from '@/presentation/protocols/http-response'

@injectable()
export class UpdateTodoController implements Controller<Todo | never> {
  constructor(@inject(TYPES.UpdateTodo) readonly updateTodo: UpdateTodo) {}

  @WithInterceptor(new ErrorInterceptor())
  async handleRequest(request: IHttpRequest<UpdateTodoInput, { todoId: string }>): Promise<IHttpResponse<Todo>> {
    const input = request.body
    const { todoId } = request.query
    const todo = await this.updateTodo.execute({ todoId, ...input })
    return new UpdatedHttpResponse(todo)
  }
}
