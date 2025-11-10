import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { Request } from "express";

interface RequestWithUser extends Request {
  user?: any;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly jwtService: JwtService) {}

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const authHeader = req.headers["authorization"];
    if (!authHeader) throw new UnauthorizedException("Token topilmadi");

    const token = authHeader.split(" ")[1]; // "Bearer <token>"
    if (!token) throw new UnauthorizedException("Token noto‘g‘ri");

    try {
      const payload = this.jwtService.verify(token, {
        secret: process.env.ACCESS_TOKEN_KEY,
      });
      req.user = payload;
      return true;
    } catch (err) {
      throw new UnauthorizedException("Token noto‘g‘ri yoki muddati tugagan");
    }
  }
}
