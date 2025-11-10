import {
  createParamDecorator,
  ExecutionContext,
  ForbiddenException,
} from "@nestjs/common";
import { JwtPayload, JwtPayloadWithRefreshToken } from "../types";

export const GetCurrentUser = createParamDecorator(
  (
    data: keyof JwtPayloadWithRefreshToken | undefined,
    context: ExecutionContext
  ) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user as JwtPayloadWithRefreshToken;

    if (!user) {
      throw new ForbiddenException("Token noto‘g‘ri yoki mavjud emas");
    }

    if (!data) {
      return user;
    }

    return user[data];
  }
);
