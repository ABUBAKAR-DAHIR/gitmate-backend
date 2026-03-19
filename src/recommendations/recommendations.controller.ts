import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { RecommendationsService } from './recommendations.service';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@Controller('recommendations')
export class RecommendationsController {
    constructor(private readonly recommendationsService: RecommendationsService){}

    @Get()
    @UseGuards(JwtAuthGuard)
    asyncgetRecommendations(@Req() req: any, @Query('limit') limit: string ){
        const topN = limit ? parseInt(limit) : 5;
        return this.recommendationsService.getTopMatches(req.user.id, topN)
    }

    @Get(':id')
    async getRecommendationForUser(@Param("id") userId: string, @Query("limit") limit: string){
        const topN = limit ? parseInt(limit) : 5;
        return this.recommendationsService.getTopMatches(userId, topN)
    }
}
