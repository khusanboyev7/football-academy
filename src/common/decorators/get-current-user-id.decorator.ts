import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { JwtPayload } from "../types";

export const GetCurrentUserId = createParamDecorator(
  (_: unknown, context: ExecutionContext): number => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayload;

    if (!user) {
      throw new ForbiddenException("Token noto‘g‘ri yoki mavjud emas");
    }

    return user.id;
  }
);
