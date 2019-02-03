import { decode, encode } from 'jwt-simple';
import { User } from '../models/User';

class TokenService {
    private token_secret: string;
    constructor(token_secret: string) {
        this.token_secret = token_secret;
    }
    /** validates or throws, and returns queried/created user from db */
    public async to_user(token: string): Promise<User> {
        const payload: any = decode(token, this.token_secret);
        return User.find_one_or_create(payload);
    }
    /** create a never-expering token. no validity checks here for custom_data. todo? */
    public create(custom_data: any): string {
        const payload = {
            iat: Date.now() / 1000,
            ...custom_data,
        };
        return encode(payload, this.token_secret);
    }
}

export default TokenService;
