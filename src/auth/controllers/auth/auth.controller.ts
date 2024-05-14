import { Body, Controller, Get, HttpException, HttpStatus, Post, Query, Render, Request, Response, UseGuards, Redirect, HttpCode, Session, ValidationPipe, Param, Put, UploadedFiles, UploadedFile, UseInterceptors, Req, Res } from '@nestjs/common';

import { ApiTags, ApiBearerAuth, ApiConsumes } from '@nestjs/swagger';
import { CreateUserDto } from '../../dto/createUser.dto';
import { LoginDto } from '../../dto/login.dto';
import { AuthService } from '../../services/auth/auth.service';
import { AuthGuard } from '@nestjs/passport';
import { EmailVerificationDto } from '../../dto/emailVerification.dto';
import { MailService } from '../../../mail/mail.service';
import { ForgotPasswordLinkDto } from '../../dto/forgotPassword.dto';
import { completeProfileDto } from '../../dto/completeProfile.dto';
import { GuestLoginDto } from '../../../auth/dto/guestLogin.dto';
// import * as cookieParser from 'cookie-parser';
import { PhoneNumberDto } from '../../../auth/dto/phoneNumber.dto';
import { UpdateProfileDto } from '../../../auth/dto/updateProfile.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Express } from 'express'
import { DocType } from '../../../auth/dto/userDoc.dto';
import path, { join } from 'path';
import { OrdersService } from '../../../orders/orders.service';
import * as fs from 'fs';
import 'path';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private mailService: MailService,

  ) { }


  @Post('register')
  async register(@Body() createUserDto: CreateUserDto) {
    try {
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      const user = await this.authService.createUser({
        ...createUserDto,
        token,
      });
      await this.mailService.sendUserConfirmation(user, token);
      return user;
    } catch (error) {
      switch (error.status) {
        case 422:
          throw new HttpException(
            {
              statusCode: 422,
              message: ['Email already taken'],
              data: []
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            {
              statusCode: 500,
              message: ['Internal server error'],
              data: []
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }

  @Post('register-web')
  @HttpCode(201)
  async registerWeb(@Body() createUserDto: CreateUserDto) {
    try {
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      const user = await this.authService.createUser({
        ...createUserDto,
        token,
      });
      // const token = user.id;
      await this.mailService.sendUserConfirmation(user, token);

      // if (user?.firstName != null) {
      //   Redirect('/api/auth/signup-success');
      // }

      console.log(user);
      const res = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      };

      return {
        status: "ok"
      }

    } catch (error) {
      switch (error.response.statusCode) {
        case '422':
          throw new HttpException(
            {
              statusCode: 422,
              message: 'Email already taken',
              data: []
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            {
              statusCode: 500,
              message: ['Internal server error'],
              data: []
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }


  @Post('guest-login')
  async guestLogin(@Body() guestLoginDto: GuestLoginDto) {
    try {
      const token = Math.floor(1000 + Math.random() * 9000).toString();
      const deviceId = guestLoginDto.deviceId;
      const firstName = 'guest'
      const lastName = 'user'
      const email = deviceId + '@yopmail.com';

      const user = await this.authService.createLoginGuest({
        deviceId,
        email,
        firstName,
        lastName,
        token,
      });

      return user;
    } catch (error) {
      switch (error.status) {
        case 422:
          throw new HttpException(
            {
              statusCode: 422,
              message: ['Email already taken'],
              data: []
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            {
              statusCode: 500,
              message: ['Internal server error'],
              data: []
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }
  }


  @Get('signup-view')
  @Render('signUp') // Specify the template name (without .hbs extension)
  getSignUp() {
    return {}; // Pass data to the template
  }


  @Get('signup-success')
  @Render('signUpSuccess') // Specify the success template name (without .hbs extension)
  getSignUpSuccess() {
    return {}; // No data needs to be passed to the template
  }

  @Get('login-page')
  @Render('login') // Specify the success template name (without .hbs extension)
  loginPage() {
    return {}; // No data needs to be passed to the template
  }



  @Post('login')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard('local'))
  async login(@Body() data: LoginDto, @Request() req, @Session() session: Record<string, any>) {
    try {
      const result = await this.authService.login(req.user);
      // Store tokens in session (you can also use cookies or local storage)
      session.accessToken = result.accessToken;
      session.refreshToken = result.refreshToken;
      console.log(session);

      return result;
    } catch (error) {
      switch (error.status) {
        case 404:
          throw new HttpException(
            {
              statusCode: 404,
              message: ['No user found with this email!'],
              data: []
            },
            HttpStatus.BAD_REQUEST,
          );
        case 401:
          throw new HttpException(
            {
              statusCode: 401,
              message: ['Please check your login credentials'],
              data: []
            },
            HttpStatus.BAD_REQUEST,
          );

        default:
          throw new HttpException(
            {
              statusCode: 500,
              message: ['Internal server error'],
              data: []
            },
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
      }
    }

  }


  @Get('confirm')
  async confirmEmail(@Query() query: EmailVerificationDto) {
    const isVerified = await this.authService.verify(query.token);
    if (!!isVerified) {
      return '<h1>Email Verified Successfully, You can login with your credentials</h1>';
    }
    return '<h1>Something went wrong, Please try again.</h1>';
  }

  @Post('forgotPassword')
  async forgotPassword(@Body() data: ForgotPasswordLinkDto) {
    return this.authService.forgotPassword(data);
  }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Get('profile')
  async getClientProfile(@Request() req) {
    return await this.authService.getProfile(req.user.id);
  }

  @Get('logout')
  logout(@Session() session: Record<string, any>) {
    // Clear session data
    session.accessToken = null;
    session.refreshToken = null;

    return { message: 'Logged out successfully' };
  }

  // @ValidationPipe()
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post('complete-profile')
  async completeProfile(@Body() userInfo: completeProfileDto, @Request() req) {
    console.log(userInfo)
    let userId = { userId: req.user.id };
    return await this.authService.completeProfile(userInfo, userId)
  }


  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  // @Put('update-profile:id')
  // async updateProfile(@Body() userInfo: UpdateProfileDto, @Request() req) {

  //   let userId = { userId: req.user.id };
  //   console.log(userInfo);
  //   return await this.authService.updateProfile(userId, userInfo);

  // }


  @Post('verify-sms')
  async verifySms(phoneNumber: PhoneNumberDto) {
    console.log(phoneNumber);
    return await this.authService.smsVerification(phoneNumber.phoneNumber);
  }


  // @UseGuards(AuthGuard('jwt'))
  // @ApiBearerAuth('access-token')
  // @Post('doc-upload')
  // @UseInterceptors(FileInterceptor('file'))
  // async uploadFile(@UploadedFile() file: Express.Multer.File, @Request() req, @Body() doctype: DocType,) {
  //   console.log(file);
  //   // let user = {userId:req.user.id};
  //   // return await this.authService.handleFile(file, user, doctype)
  //   const user = { userId: req.user.id };
  //   const savedFileInfo = await this.authService.handleFile(file, user, doctype);

  //   // Move the uploaded file to the permanent storage location
  //   const permanentStoragePath = `${process.env.STATIC_PATH}/docs`; // Change to your desired storage path
  //   const newFilePath = path.join(permanentStoragePath, savedFileInfo.original_name 
  //     // + path.extname(file.originalname)
  //     );
      
  //   try {
  //     const finalPath = fs.renameSync(file.path, newFilePath); // Move the file
  //     // console.log(finalPath)
  //     // return finalPath;
  //   } catch (err) {
  //     console.error('Error moving the file:', err);
  //     // Handle the error appropriately
  //   }
  //   return `${process.env.RES_PATH}/${file.originalname}`;
    
    
  // }

  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  @Post('doc-upload')
  @UseInterceptors(FilesInterceptor('files', 2)) // Limit to a maximum of 2 files
  async uploadFiles(@UploadedFiles() files: Array<Express.Multer.File>, @Request() req, @Body() doctype: DocType) {
    const user = { userId: req.user.id };
    const fileUrls = [];
    await this.authService.deleteFiles(user);

    // Move and process each file
    for (const file of files) {
      const savedFileInfo = await this.authService.handleFile(file, user, doctype);

      // Move the uploaded file to the permanent storage location
      const permanentStoragePath = `${process.env.STATIC_PATH}/docs`; // Change to your desired storage path
      const newFilePath = path.join(permanentStoragePath, savedFileInfo.original_name);

      try {
        fs.renameSync(file.path, newFilePath); // Move the file
        const fileUrl = `${process.env.RES_PATH}/${file.originalname}`;
        fileUrls.push(fileUrl);
      } catch (err) {
        console.error('Error moving the file:', err);
        // Handle the error appropriately
      }
    }

    return fileUrls;
  }

  @Get('verified-documents')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth('access-token')
  async verifiedDocyuments(@Request() req) {
    return await this.authService.getDocuments(req.user.id)
  }



  @Get('certificates/:picture_path')
  getProfileImage(@Param('picture_path') picture_path, @Response() res: any) {
     const filePath = join(__dirname, '../../../../docs');
     res.sendFile(picture_path, { root: filePath });
    }


  
  }






