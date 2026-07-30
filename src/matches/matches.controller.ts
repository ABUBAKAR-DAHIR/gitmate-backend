import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';
import { MatchesService } from './matches.service';
import { CreateMatchDto } from './dto/create-match/create-match';

@Controller('matches')
export class MatchesController {
    constructor(private readonly matchesService: MatchesService){}

    @Post()
    @UseGuards(JwtAuthGuard)
    async createMatch(@Req() req: any, @Body() createMatchDto: CreateMatchDto){
        return this.matchesService.createMatch(
            req.user.id, createMatchDto.userId
        )
    }
    
    @Get()
    @UseGuards(JwtAuthGuard)
    async getMyMatches(@Req() req: any) {
      return this.matchesService.getMyMatches(
        req.user.id,
      );
    }

    @Get('recent')
    @UseGuards(JwtAuthGuard)
    async getRecentMatches(@Req() req: any) {
    return this.matchesService.getRecentMatches(
        req.user.id,
    );
    }
}
