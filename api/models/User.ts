import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

enum ExternalType {
    GOOGLE,
    FACEBOOK,
}

@Entity()
class User extends BaseEntity {
    public static ADMIN_ID = 1;
    public static async find_one_or_create(payload: any) {
        let user_optional: User | undefined;
        // external
        if (payload.external_type && payload.external_identifier) {
            user_optional = await User.findOne({
                external_identifier: payload.external_identifier,
                external_type: payload.external_type,
            });
        // local (email)
        } else if (payload.email) {
            user_optional = await User.findOne({
                email: payload.email,
            });
        } else {
            throw new Error(`${INTERNAL_SERVER_ERROR}`); // 'payload not identifiable' todo can this ever happen? would mean an invalid token generation somewhere
        }
        let user: User;
        if (!user_optional) {
            // this is a first valid token login. create account
            user = Object.assign(new User(), payload);
            await user.save();
        } else {
            user = user_optional;
            if (payload.iat < user.min_iat) {
                // min_iat had been set to disallow the given token -> All tokens had been invalidated -> Expired -> Unauthorized
                throw new Error('The token expired');
            }
        }
        return user;
    }

    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    public email: string | undefined;
    @Column()
    public external_type: ExternalType | undefined;
    @Column()
    public external_identifier: string | undefined;
    @Column()
    public name: string | undefined;
    @Column()
    public picture: string | undefined;
    @Column()
    public min_iat: number = 0;

}

export { User, ExternalType };
