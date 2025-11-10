import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, JwtFromRequestFunction, Strategy } from "passport-jwt";
import { Request } from "express";
import { JwtPayload } from "../types";

export const cookieExtractor: JwtFromRequestFunction = (req: Request) => {
  if (req && req.cookies) {
    return req.cookies["refreshToken"];
  }
  return null;
};

@Injectable()
export class RefreshtokenCookieStrategy extends PassportStrategy(
  Strategy,
  "refresh-jwt"
) {
  constructor() {
    super({
      jwtFromRequest: cookieExtractor, 
      secretOrKey: process.env.REFRESH_TOKEN_KEY!,
      passReqToCallback: true,
    });
  }

  validate(req: Request, payload: JwtPayload): JwtPayload {
    console.log("request headers:", req.headers);
    console.log("payload:", payload);

    return payload; 
  }
}
