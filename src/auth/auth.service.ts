import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  generateToken(user: User) {
    return this.jwtService.sign({
      id: user.id,
      email: user.email,
    });
  }

  getMe(req: any) {
    return {
      isLoggedIn: true,
      user: req.user,
    };
  }

  async validateOrCreateUser(profile: any) {
    const provider = profile.provider;
    const providerId = profile.providerId;

    const email = profile.email || null;

    const name =
      profile.displayName ||
      profile.username ||
      `${profile.firstName || ''} ${profile.lastName || ''}`.trim() ||
      null;

    const displayName =
      name?.split(/\s+/)[0] || 'User';

    const image = profile.picture || null;

    /*
     * 1. Check whether this OAuth account already exists.
     */
    const existingAccount =
      await this.prisma.account.findUnique({
        where: {
          provider_providerId: {
            provider,
            providerId,
          },
        },
        include: {
          user: true,
        },
      });

    /*
     * Account already exists.
     *
     * IMPORTANT:
     * Update the OAuth tokens because the provider may
     * return a new access token.
     */
    if (existingAccount) {
      await this.prisma.account.update({
        where: {
          id: existingAccount.id,
        },
        data: {
          accessToken: profile.accessToken || undefined,
          refreshToken: profile.refreshToken || undefined,
        },
      });

      /*
       * Optionally update the user's profile information
       * from the OAuth provider as well.
       */
      await this.prisma.user.update({
        where: {
          id: existingAccount.user.id,
        },
        data: {
          name: displayName,
          image,
        },
      });

      return existingAccount.user;
    }

    /*
     * 2. Try to find an existing user with the same email.
     *
     * This is important for your Google → GitHub sync flow.
     *
     * Example:
     *
     * User already exists through Google
     *          ↓
     * User clicks "Sync GitHub"
     *          ↓
     * GitHub OAuth
     *          ↓
     * Same email
     *          ↓
     * We link GitHub to the existing User
     */
    let user: User | null = null;

    if (email) {
      user = await this.prisma.user.findUnique({
        where: {
          email,
        },
      });
    }

    /*
     * 3. Create the user if one doesn't exist.
     */
    if (!user) {
      if (!email) {
        throw new Error(
          'OAuth provider did not provide an email address',
        );
      }

      user = await this.prisma.user.create({
        data: {
          email,
          name: displayName,
          image,
        },
      });
    }

    /*
     * 4. Create the OAuth account AND save the tokens.
     */
    await this.prisma.account.create({
      data: {
        provider,
        providerId,
        userId: user.id,

        accessToken: profile.accessToken || null,
        refreshToken: profile.refreshToken || null,
      },
    });

    return user;
  }
}