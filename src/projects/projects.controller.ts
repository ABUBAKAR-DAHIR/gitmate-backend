import { Controller, Get, Req, UseGuards, } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt.guard';

@Controller('projects')
export class ProjectsController {
    constructor(
    private readonly projectsService: ProjectsService,
    ) {}

    @Get('github')
    @UseGuards(JwtAuthGuard)
    async getGithubProjects(@Req() req: any) {
    console.log('PROJECTS REQ.USER:', req.user);

    if (!req.user) {
        return {
        success: false,
        synced: false,
        message: 'User not authenticated',
        projects: [],
        stats: {
            commits: 0,
            contributions: 0,
        },
        };
    }

    return this.projectsService.getGithubProjects(
        req.user.id,
    );
    }
}