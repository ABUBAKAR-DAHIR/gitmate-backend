import { Injectable } from '@nestjs/common'
import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: process.env.GOOGLE_CALLBACK_URL!,
      scope: ['email', 'profile'],
    })
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
  ) {
    const {id, name, emails, photos, displayName } = profile

    const user = {
      provider: "google",
      providerId: id,
      email: emails?.[0].value || null,
      firstName: name?.givenName || "",
      lastName: name?.familyName || "",
      picture: photos?.[0].value || "",
      displayName,
      accessToken,
      refreshToken
    }

    return user
  }
}