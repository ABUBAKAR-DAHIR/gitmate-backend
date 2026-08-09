import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';
export class GithubStrategy extends PassportStrategy(Strategy, "github"){
    constructor(){
        super({
            clientID: process.env.GITHUB_CLIENT_ID!,
            clientSecret: process.env.GITHUB_CLIENT_SECRET!,
            callbackURL: process.env.GITHUB_CALLBACK_URL!,
            scope: ["user:email", "read:user", "repo"]
        })
    }

    validate(accessToken: string, refreshToken: string, profile: Profile){
        const { id, username, displayName, emails, photos } = profile;

        const user = {
            provider: "github",
            providerId: id,
            githubId: id,
            username,
            displayName,
            email: emails?.[0]?.value,
            picture: photos?.[0]?.value,
            accessToken,
            refreshToken
        };

        return user;
    }
}