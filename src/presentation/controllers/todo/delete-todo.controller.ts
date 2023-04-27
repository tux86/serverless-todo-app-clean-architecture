import { DeleteTodo } from '@/application/usecases/todo/delete-todo'
import { Todo } from '@/domain/models/todo'
import { ErrorInterceptor } from '@/presentation/interceptors/error.interceptor'
import { WithInterceptor } from '@/presentation/interceptors/interceptor'
import { Controller } from '@/presentation/protocols/controller'
import { IHttpRequest } from '@/presentation/protocols/http-request'
import { DeletedHttpResponse, IHttpResponse } from '@/presentation/protocols/http-response'

export class DeleteTodoController implements Controller<Todo | never> {
  constructor(readonly deleteTodo: DeleteTodo) {}

  @WithInterceptor(new ErrorInterceptor())
  async handleRequest(request: IHttpRequest<{ todoId: string }>): Promise<IHttpResponse<Todo>> {
    await this.deleteTodo.execute(request.params.todoId)
    return new DeletedHttpResponse()
  }
}
