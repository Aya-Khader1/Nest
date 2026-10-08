import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { HUserDocument, User } from '../DB/models/user.model.js';
import { Model } from 'mongoose';
import { CreateAuthDto } from './dto/create-auth.dto.js';
import { compareHash, hash } from '../common/security/hash.js';
import { MailService } from '../mail/mail.service.js';
import { VerifyEmailDto } from './dto/verify-email.dto.js';
import { ResendOtpDto } from './dto/resend-otp.dto .js';
import { LoginDto } from './dto/login.dto.js';
import { TokenService } from '../common/services/token.service.js';

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name) private readonly _userModel: Model<HUserDocument>,
    private readonly _mailService: MailService,
    private readonly _tokenService: TokenService,
  ) {}
  async register(createAuthDto: CreateAuthDto): Promise<HUserDocument> {
    const existingUser = await this._userModel.findOne({
      email: createAuthDto.email,
    });
    if (existingUser)
      throw new ConflictException(
        'An account with this email address already exists',
      );

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await hash(otp);
    const expiryTime = new Date();
    expiryTime.setMinutes(expiryTime.getMinutes() + 5);

    const newUser = new this._userModel({
      ...createAuthDto,
      confirmEmailOTP: hashedOtp,
      otpExpiresAt: expiryTime,
    });
    const savedUser = await newUser.save();

    await this._mailService.sendVerficationOtp(savedUser.email, otp);

    return savedUser;
  }
  async verifyEmail(
    verifyEmailDto: VerifyEmailDto,
  ): Promise<{ message: string }> {
    const user = await this._userModel.findOne({ email: verifyEmailDto.email });
    if (!user)
      throw new NotFoundException('No Account record match this email address');
    if (user.confirmEmail)
      throw new BadRequestException(
        'this email account has already been confirmed',
      );
    console.log(verifyEmailDto.otp);
    if (
      !user.confirmEmailOTP ||
      !(await compareHash(verifyEmailDto.otp, user.confirmEmailOTP))
    )
      throw new BadRequestException('This code provided in incorrect');

    if (new Date() > user.otpExpiresAt!)
      throw new BadRequestException(
        'this verfication code has expired,please sign up again',
      );
    user.confirmEmail = new Date();
    user.confirmEmailOTP = undefined;
    user.otpExpiresAt = undefined;
    await user.save();
    return { message: 'Your email address has been successfully verfied' };
  }
  async resendOtp(resendOtp: ResendOtpDto): Promise<{ message: string }> {
    const { email } = resendOtp;
    const user = await this._userModel.findOne({ email: resendOtp.email });
    if (!user)
      throw new NotFoundException('No Account record match this email address');
    if (user.confirmEmail)
      throw new BadRequestException(
        'this email account has already been confirmed',
      );
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const hashedOtp = await hash(otp);
    const newExpiryTime = new Date();
    newExpiryTime.setMinutes(newExpiryTime.getMinutes() + 5);

    user.confirmEmailOTP = hashedOtp;
    user.otpExpiresAt = newExpiryTime;
    return {
      message:
        'A fresh verification code has been successfully dispatched to your inbox',
    };
  }
  async login(loginDto: LoginDto): Promise<{ message: string; token: string }> {
    const { email, password } = loginDto;
    const user = await this._userModel.findOne({
      email,
      confirmEmail: { $exists: true },
    });
    console.log(user);
    if (!user) throw new NotFoundException('User Not Found');
    if (!compareHash(password, user.password))
      throw new BadRequestException('Invalid email or password');
    const token = await this._tokenService.generateToken(user._id, user.role);

    return {
      message: 'Done',
      token,
    };
  }
  async saveProfilePic(
    userId: string,
    filePath: string,
  ): Promise<HUserDocument> {
    const publicUrl = `http://127.0.0.1:3000/${filePath.replace(/\\/g, '/')}`;
    const updatedUser = await this._userModel.findByIdAndUpdate(
      userId,
      {
        profilePic: publicUrl,
      },
      {
        returnDocument: 'after',
      },
    );
    if (!updatedUser) throw new NotFoundException('User Account not found');
    return updatedUser;
  }
}
