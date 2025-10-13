import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    
    // Пробуем получить токен из разных источников
    const token = this.extractTokenFromHeader(request) || this.extractTokenFromCookie(request);
    
    if (!token) {
      throw new UnauthorizedException('Токен не найден');
    }
    
    try {
      // Проверяем и декодируем JWT токен
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.JWT_SECRET || 'supersecret' // Укажите ваш секретный ключ
      });
      
      // Добавляем payload в объект запроса для использования в контроллерах
      request.user = payload;
      
      return true;
    } catch (error) {
      console.error('JWT verification error:', error);
      throw new UnauthorizedException('Неверный или просроченный токен');
    }
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }

  private extractTokenFromCookie(request: Request): string | undefined {
    // Проверяем различные возможные названия кук
    return request.cookies?.jwt || 
           request.cookies?.token ||
           request.cookies?.access_token;
  }
}