import {
    Injectable,
  } from '@nestjs/common';
  
  import { PrismaService } from 'src/prisma/prisma.service';
  
  interface GithubRepository {
    id: number;
    name: string;
    full_name: string;
    description: string | null;
    html_url: string;
    stargazers_count: number;
    language: string | null;
    private: boolean;
    fork: boolean;
  }
  
  interface GithubCommit {
    sha: string;
  
    commit: {
      author: {
        name: string;
        email: string;
        date: string;
      } | null;
    };
  }
  
  @Injectable()
  export class ProjectsService {
    constructor(
      private readonly prisma: PrismaService,
    ) {}
  
    async getGithubProjects(userId: string) {
      /*
       * Find the GitHub account belonging to
       * the currently authenticated Gitmate user.
       */
      const githubAccount =
        await this.prisma.account.findFirst({
          where: {
            userId,
            provider: 'github',
          },
        });
  
      /*
       * User has not connected GitHub.
       */
      if (
        !githubAccount ||
        !githubAccount.accessToken
      ) {
        return {
          success: true,
          synced: false,
  
          projects: [],
  
          stats: {
            commits: 0,
            contributions: 0,
          },
        };
      }
  
      const accessToken =
        githubAccount.accessToken;
  
      try {
        /*
         * ==============================
         * GET GITHUB REPOSITORIES
         * ==============================
         */
  
        const repositoriesResponse =
          await fetch(
            'https://api.github.com/user/repos?per_page=100&sort=updated',
            {
              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
  
                Accept:
                  'application/vnd.github+json',
  
                'X-GitHub-Api-Version':
                  '2022-11-28',
              },
            },
          );
  
        if (!repositoriesResponse.ok) {
          const error =
            await repositoriesResponse.text();
  
          console.error(
            'GitHub repositories request failed:',
            repositoriesResponse.status,
            error,
          );
  
          return {
            success: false,
            synced: false,
  
            projects: [],
  
            stats: {
              commits: 0,
              contributions: 0,
            },
          };
        }
  
        const repositories =
          (await repositoriesResponse.json()) as GithubRepository[];
  
        /*
         * ==============================
         * FORMAT PROJECTS
         * ==============================
         */
  
        const projects =
          repositories
            .filter(
              (repo) => !repo.fork,
            )
            .map((repo) => ({
              id: repo.id.toString(),
  
              name: repo.name,
  
              description:
                repo.description,
  
              htmlUrl:
                repo.html_url,
  
              stars:
                repo.stargazers_count,
  
              language:
                repo.language,
            }));
  
        /*
         * ==============================
         * GET GITHUB USER
         * ==============================
         */
  
        const userResponse =
          await fetch(
            'https://api.github.com/user',
            {
              headers: {
                Authorization:
                  `Bearer ${accessToken}`,
  
                Accept:
                  'application/vnd.github+json',
  
                'X-GitHub-Api-Version':
                  '2022-11-28',
              },
            },
          );
  
        let username: string | null =
          null;
  
        if (userResponse.ok) {
          const githubUser =
            await userResponse.json();
  
          username =
            githubUser.login;
        }
  
        /*
         * ==============================
         * COUNT COMMITS
         * ==============================
         */
  
        let totalCommits = 0;
  
        if (username) {
          for (
            const repository of repositories
          ) {
            /*
             * Ignore forks.
             */
            if (repository.fork) {
              continue;
            }
  
            const commitsUrl =
              `https://api.github.com/repos/` +
              `${repository.full_name}/commits` +
              `?author=${encodeURIComponent(username)}` +
              `&per_page=100`;
  
            const commitsResponse =
              await fetch(
                commitsUrl,
                {
                  headers: {
                    Authorization:
                      `Bearer ${accessToken}`,
  
                    Accept:
                      'application/vnd.github+json',
  
                    'X-GitHub-Api-Version':
                      '2022-11-28',
                  },
                },
              );
  
            if (!commitsResponse.ok) {
              continue;
            }
  
            const commits =
              (await commitsResponse.json()) as GithubCommit[];
  
            totalCommits +=
              commits.length;
          }
        }
  
        /*
         * GitHub's contribution graph isn't
         * available through this REST endpoint.
         *
         * For now, use commits as contributions.
         */
        const contributions =
          totalCommits;
  
        /*
         * ==============================
         * RESPONSE
         * ==============================
         */
  
        return {
          success: true,
  
          synced: true,
  
          projects,
  
          stats: {
            commits: totalCommits,
  
            contributions,
          },
        };
      } catch (error) {
        console.error(
          'Failed to fetch GitHub projects:',
          error,
        );
  
        return {
          success: false,
  
          synced: false,
  
          projects: [],
  
          stats: {
            commits: 0,
  
            contributions: 0,
          },
        };
      }
    }
  }