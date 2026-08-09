import { Body, Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {

    constructor(private readonly profileService: ProfileService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    async upsertProfile(@Req() req: any, @Body() body: any){
        const profile = await this.profileService.createOrUpdateProfile(req.user.id, body);

        return {success: true, data: profile}
    }

    @UseGuards(JwtAuthGuard)
    @Get()
    getProfile(@Req() req){
        return this.profileService.getProfile(req.user.id)
    }
    
    @Get(":id")
    getOthersProfile(@Param('id') id: string){
        return this.profileService.getProfile(id)
    }
    
    @UseGuards(JwtAuthGuard)
    @Get("/similar")
    getSimilarProfiles(@Req() req){
        return this.profileService.getSimilarProfiles(req.user)
    }
}
