export interface IRefeshToken {
  refreshToken: string;
}

export interface refreshTokenDecode extends JWT.JwtPayload {
  refreshToken: string;
  id: string;
}

export interface GenerateTokenInput {
  id: string;
}
