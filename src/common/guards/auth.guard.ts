import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from '../../DB/models/user.model.js';
import { Model } from 'mongoose';
import { Request } from 'express';
import { RoleEnum } from '../enums/user.enum.js';
import { TokenService } from '../services/token.service.js';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly _tokenService: TokenService,
    @InjectModel(User.name) private readonly _userModel: Model<HUserDocument>,
  ) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const authHeader = request.headers.authorization;
    if (!authHeader)
      throw new UnauthorizedException('Authorization header is missing');
    const [roleSchema, token] = authHeader.split(' ');
    if (
      !token ||
      (roleSchema.toUpperCase() !== RoleEnum.USER &&
        roleSchema.toUpperCase() !== RoleEnum.ADMIN)
    )
      throw new UnauthorizedException('Invalid Aithorization');

    const payload = await this._tokenService.verifyToken(token, roleSchema);
    const userDoc = await this._userModel
      .findById(payload.sub)
      .select('-password');
    if (!userDoc)
      throw new UnauthorizedException(
        'User account nlonger exists in the system',
      );
    request['user'] = userDoc;

    return true;
  }
}
