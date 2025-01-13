import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';

@Injectable()
export class TypeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    if (request.path.includes('news')) {
      request.body.type = 'NEWS';
      request.body.status = 'ACTIVE';
      request.body.createdAt = new Date();
      request.body.updatedAt = new Date();
    } else if (request.path.includes('blogs')) {
      request.body.type = 'BLOGS';
      request.body.status = 'ACTIVE';
      request.body.createdAt = new Date();
      request.body.updatedAt = new Date();
    } else if (request.path.includes('articles')) {
      request.body.type = 'ARTICLES';
      request.body.status = 'ACTIVE';
      request.body.createdAt = new Date();
      request.body.updatedAt = new Date();
    }
    return true;
  }
}
