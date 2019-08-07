import { decode, encode } from 'jwt-simple';

class TokenService {
    private token_secret: string;
    constructor(token_secret: string) {
        this.token_secret = token_secret;
    }
    /** validates or throws */
    public async decode(token: string): Promise<any> {
        const payload: any = decode(token, this.token_secret);
        if (!payload.email)
            throw new Error('Email missing');
        return payload;
    }
    /** create a never-expering token. no validity checks here for custom_data. todo? */
    public create(user_data: Partial<User>): string { // TODO: type is User plus iat plus..?
        const payload = {
            iat: Date.now() / 1000,
            user: user_data,
        };
        return encode(payload, this.token_secret);
    }
}

export default TokenService;
