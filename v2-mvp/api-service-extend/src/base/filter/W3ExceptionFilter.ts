import {
    ExceptionFilter,
    Catch,
    ArgumentsHost,
    HttpException,
    HttpStatus,
} from '@nestjs/common';

@Catch()
export class W3ExceptionsFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse();
        const request = ctx.getRequest();

        let isHttpException = exception instanceof HttpException;

        if (!isHttpException) {
            console.error(`exception:`, exception);

            let status = HttpStatus.BAD_REQUEST;
            let json = {
                statusCode: status,
                message: exception.toString().replace('Error: ', '')
            }
            response.status(status).json(json);
        }
        else {
            let httpException = exception as HttpException
            response.status(httpException.getStatus()).json(httpException);
        }
    }
}
