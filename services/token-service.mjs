import jwt from 'jwt-simple';
import { User } from '../models/user.mjs';

class TokenService {
    constructor(tokenSecret) {
        this.tokenSecret = tokenSecret;
    }
    /** valid or invalid token input, returns queried/created user from db */
    async toUser(token) {
        let decoded;
        try {
            decoded = jwt.decode(token, this.tokenSecret);
        } catch (error) {
            throw error;
        }
        let user;
        // google, fb, .. account
        if (decoded.externalType) {
            user = await User.findOne({
                externalType: decoded.externalType,
                externalIdentifier: decoded.externalIdentifier,
            });
        // local email account
        } else if (decoded.email) {
            user = await User.findOne({
                email: decoded.email,
            });
        } else {
            throw new Error('invalid token'); // todo not necessary? check  happens in user mongoose class
        }
        if (!user) {
            // this is a first valid token login. create account
            user = await (new User(decoded)).save();
        }
        return user;
    }
    /** no validity checks here */
    create(customData) {
        const payload = {
            iat: Date.now() / 1000,
            ...customData,
        };
        return jwt.encode(payload, this.tokenSecret);
    }
}

export default TokenService;
