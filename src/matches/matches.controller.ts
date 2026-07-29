import { Controller, Post } from '@nestjs/common';

@Controller('matches')
export class MatchesController {
    @Post()
    async createMatch(){
        return {success: true}
    }
}
