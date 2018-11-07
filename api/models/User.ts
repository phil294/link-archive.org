import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

enum ExternalType {
    GOOGLE,
    FACEBOOK,
}

@Entity()
class User extends BaseEntity {
    public static async findOneOrCreate(payload: any) {
        let userOptional: User | undefined;
        // external
        if (payload.externalType && payload.externalIdentifier) {
            userOptional = await User.findOne({
                externalIdentifier: payload.externalIdentifier,
                externalType: payload.externalType,
            });
        // local (email)
        } else if (payload.email) {
            userOptional = await User.findOne({
                email: payload.email,
            });
        } else {
            throw new Error(`${INTERNAL_SERVER_ERROR}`); // 'payload not identifiable' todo can this ever happen? would mean an invalid token generation somewhere
        }
        let user: User;
        if (!userOptional) {
            // this is a first valid token login. create account
            user = Object.assign(new User(), payload);
            await user.save();
        } else {
            user = userOptional;
            if (payload.iat < user.minIat) {
                // minIat had been set to disallow the given token -> All tokens had been invalidated -> Expired -> Unauthorized
                throw new Error(`${UNAUTHORIZED}`);
            }
        }
        return user;
    }

    @ObjectIdColumn()
    public id!: ObjectID;
    @Column()
    public email: string | undefined;
    @Column()
    public externalType: ExternalType | undefined;
    @Column()
    public externalIdentifier: string | undefined;
    @Column()
    public name: string | undefined;
    @Column()
    public picture: string | undefined;
    @Column()
    public minIat: number = 0;

}

export { User, ExternalType };
