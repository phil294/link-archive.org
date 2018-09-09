import { decode, encode } from 'jwt-simple';
import { User } from '../models/User';

class TokenService {
    private tokenSecret: string;
    constructor(tokenSecret: string) {
        this.tokenSecret = tokenSecret;
    }
    /** validates or throws, and returns queried/created user from db */
    public async toUser(token: string): Promise<User> {
        const payload: User = decode(token, this.tokenSecret);
        return User.findOneOrCreate(payload);
    }
    /** create a never-expering token. no validity checks here for customData. todo? */
    public create(customData: any): string {
        const payload = {
            iat: Date.now() / 1000,
            ...customData,
        };
        return encode(payload, this.tokenSecret);
    }
}

export default TokenService;
