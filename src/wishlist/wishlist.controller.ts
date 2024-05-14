import { Controller, Get, Post, Body, UseGuards, Param, Delete, Request, HttpException, HttpStatus, Query } from '@nestjs/common';
import { WishlistService } from './wishlist.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles/roles.decorator';
import { RoleGuard } from '../auth/role/role.guard';
import { RemoveWishlistDto } from './dto/remove-wishlist.dto';
@ApiTags('Wishlist')
@Controller('wishlist')
export class WishlistController {
  constructor(private readonly wishlistService: WishlistService) { }

  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Post()
  async create(@Body() createWishlistDto: CreateWishlistDto, @Request() req) {
    try {
      return await this.wishlistService.create(createWishlistDto, req.user.id);
    } catch (error) {
      switch (error.status) {
        case 422:
          throw new HttpException(
            {
              statusCode: 422,
              message: ['A wishlist item with this symbol already exists.'],
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


  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get()
  findAll(@Request() req) {
    return this.wishlistService.findAll(req.user.id);
  }



  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.wishlistService.remove(id);
  }


  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Post('remove-bulk')
  removeInBulk(@Body() removeWishlistDto: RemoveWishlistDto) {
    const { ids } = removeWishlistDto;
    return this.wishlistService.removeMultiple(ids);
  }


  @Roles('customer')
  @UseGuards(AuthGuard('jwt'), RoleGuard)
  @ApiBearerAuth('access-token')
  @Get('symbols')
  getSymbols(@Query('type') type: number, @Request() req) {
    // 0=>forex, 1=> Indices, 2=>Metals
    const symbols = this.wishlistService.getSymbols(type, req.user.id);
    return symbols;

  }
}
