import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';
import { RegisterDto, ChangePasswordDto, ForgotPasswordDto, ResetPasswordDto, RefreshTokenDto, RegisterDtoAdmin, LoginDtoAdmin } from '../../../common/dto/auth.dto';
import { AuthResponse, AuthResponseAdmin, TokenResponse } from '../../../common/interfaces/auth.interface';
import * as bcrypt from 'bcrypt';
import { UserType } from 'src/common/enums/user-type.enum';

//import { MailService } from 'src/common/mail/mail.service';


@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private configService: ConfigService,
    //private mailService: MailService,
  ) { }

  async register(registerDto: RegisterDto): Promise<AuthResponse> {
    const { phoneNumber } = registerDto;

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { phoneNumber: phoneNumber },
    });

    let tokens = null;

    if (existingUser) {

      if (existingUser.role !== UserType.USER) {
        throw new ConflictException('User already exists with this phone number');
      }

      tokens = await this.generateTokens(existingUser);
      return {
        ...tokens,
        user: {
          id: existingUser.id,
          phoneNumber: existingUser.phoneNumber,
          userType: UserType.USER, // Assuming default user type is USER
        },
      };
    }

    // Create user
    const user = await this.prisma.user.create({
      data: {
        phoneNumber: registerDto.phoneNumber,
        role: UserType.USER,
      },
    });

    console.log('User created: ', user);

    // Generate tokens
    tokens = await this.generateTokens(user);

    // Send verification email
    // const verificationPhone = await this.sendVerificationEmail(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        phoneNumber: user.phoneNumber,
        userType: UserType.USER, // Assuming default user type is USER
      },
    };
  }

  async registerAdmin(registerDtoAdmin: RegisterDtoAdmin): Promise<AuthResponseAdmin> {
    const { email, password, userType = UserType.ADMIN } = registerDtoAdmin;

    if (userType !== UserType.ADMIN) {
      throw new BadRequestException('User type must be ADMIN');
    }

    // Check if user exists
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictException('Email already exists');
    }


    if (!password) {
      throw new BadRequestException('Password is required');
    }
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create user
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        firstName: registerDtoAdmin.firstName,
        lastName: registerDtoAdmin.lastName,
        phoneNumber: registerDtoAdmin.phoneNumber,
        role: userType,
      },
    });

    if (!user) {
      throw new BadRequestException('User registration failed');
    }
    // Generate tokens
    const tokens = await this.generateTokens(user);

    // Send verification email
    // const verificationMail = await this.sendVerificationEmail(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: UserType[user.role] as UserType,
        phoneNumber: user.phoneNumber ? user.phoneNumber : null, // Handle optional phone number
      },
    };
  }

  async login(loginDto: LoginDtoAdmin): Promise<AuthResponseAdmin> {
    const { email, password } = loginDto;

    // Find user
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

  
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (!user.password) {
      throw new UnauthorizedException('User does not have a password set');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    console.log('isPassword: ', user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.role !== UserType.ADMIN && user.role !== UserType.SUB_ADMIN) {
      throw new UnauthorizedException('Only admins can log in');
    }

    // Generate tokens
    const tokens = await this.generateTokens(user);

    return {
      ...tokens,
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        userType: UserType[user.role] as UserType,
      },
    };
  }

  async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<void> {
    const { currentPassword, newPassword } = changePasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.password) {
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Current password is incorrect');
      }
    }



    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await this.prisma.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });
  }

  async forgotPassword(forgotPasswordDto: ForgotPasswordDto): Promise<void> {
    const { email } = forgotPasswordDto;

    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new BadRequestException('If your email is registered, you will receive a password reset link');
    }

    const token = await this.generateResetPasswordToken(user);
    console.log(token)
    // await this.mailService.sendPasswordResetEmail(user.email, token);
  }

  async resetPassword(resetPasswordDto: ResetPasswordDto): Promise<void> {
    const { token, newPassword } = resetPasswordDto;

    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('jwt.secret'),
      });

      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });

      if (!user) {
        throw new BadRequestException('Invalid token');
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);

      await this.prisma.user.update({
        where: { id: user.id },
        data: { password: hashedPassword },
      });
    } catch (error) {
      throw new BadRequestException('Invalid or expired token');
    }
  }

  async refreshToken(refreshToken: RefreshTokenDto): Promise<TokenResponse> {
    try {
      const payload = await this.jwtService.verifyAsync(refreshToken.token, {
        secret: this.configService.get('jwt.secret'),
      });
      const user = await this.prisma.user.findUnique({
        where: { id: payload.sub },
      });
      if (!user) {
        throw new UnauthorizedException('User not found');
      }
      return this.generateTokens(user);
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired refresh token');
    }
  }

  private async generateTokens(user: any): Promise<TokenResponse> {

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
          phoneNumber: user.phoneNumber,
          userType: user.userType,
        },
        {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.accessTokenExpiration'),
        },
      ),
      this.jwtService.signAsync(
        {
          sub: user.id,
          email: user.email,
        },
        {
          secret: this.configService.get('jwt.secret'),
          expiresIn: this.configService.get('jwt.refreshTokenExpiration'),
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }

  private async generateResetPasswordToken(user: any): Promise<string> {
    return this.jwtService.signAsync(
      {
        sub: user.id,
        email: user.email,
      },
      {
        secret: this.configService.get('jwt.secret'),
        expiresIn: this.configService.get('jwt.resetPasswordExpiration'),
      },
    );
  }

  // private async sendVerificationEmail(user: any): Promise<void> {
  // private async sendVerificationEmail(user: any): Promise<any> {
  //   const token = await this.jwtService.signAsync(
  //     {
  //       sub: user.id,
  //       email: user.email,
  //     },
  //     {
  //       secret: this.configService.get('jwt.secret'),
  //       expiresIn: this.configService.get('jwt.verifyEmailExpiration'),
  //     },
  //   );
  //   return token;
  //   // await this.mailService.sendVerificationEmail(user.email, token);
  // }
} 