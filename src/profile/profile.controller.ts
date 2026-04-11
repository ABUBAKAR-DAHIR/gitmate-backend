import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {

    constructor(private readonly profileService: ProfileService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    async upsertProfile(@Req() req: any, @Body() body: any){
        const prof = await this.profileService.createOrUpdateProfile(req.user.id, body);

        return {success: true, data: prof}
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getProfile(@Req() req){
        return this.profileService.getProfile(req.user)
    }
}
