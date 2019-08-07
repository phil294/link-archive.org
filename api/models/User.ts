import { IsEmail, IsInt, IsOptional, IsString, Min, validateOrReject } from 'class-validator';
import { INTERNAL_SERVER_ERROR, UNAUTHORIZED } from 'http-status-codes';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

enum ExternalType {
    GOOGLE,
    FACEBOOK,
}

@Entity()
class User extends BaseEntity {
    public static ADMIN_ID = 1;
    public static async find_one_or_create(payload: any) { // fixme why any? this is used in user constructor
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
            user = new User(payload);
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
    @IsOptional()
    public _id!: ObjectID;
    @Column()
    @IsEmail()
    public email: string | undefined;
    @Column()
    @Min(0)
    @IsInt()
    @IsOptional()
    public external_type: ExternalType | undefined;
    @Column()
    @IsString()
    @IsOptional()
    public external_identifier: string | undefined;
    @Column()
    @IsString()
    @IsOptional()
    public name: string | undefined;
    @Column()
    @IsString()
    @IsOptional()
    public picture: string | undefined;
    @Column()
    @IsInt()
    @IsOptional()
    public min_iat: number = 0;

    public constructor(init: Partial<User>) {
        super();
        Object.assign(this, init);
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async validate() {
        await validateOrReject(this, { validationError: { target: false }, whitelist: true, forbidNonWhitelisted: true });
    }
}

export { User, ExternalType };
