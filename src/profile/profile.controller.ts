import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {

    constructor(private readonly profileService: ProfileService){}


    @UseGuards(JwtAuthGuard)
    @Post()
    async upsertProfile(@Req() req: any, @Body() body: any, @Res() res){
        const prof = await this.profileService.createOrUpdateProfile(req.user.id, body);

        res.json({sucess: true, data: prof})
    }
}
