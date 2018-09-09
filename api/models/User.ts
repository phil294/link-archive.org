import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

enum ExternalType {
    GOOGLE,
    FACEBOOK,
}

@Entity()
class User extends BaseEntity {
    public static async findOneOrCreate(payload: User) {
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
            throw new Error('payload not identifiable'); // todo can this ever happen? would mean an invalid token generation somewhere
        }
        let user: User;
        if (!userOptional) {
            // this is a first valid token login. create account
            user = await payload.save();
        } else {
            user = userOptional;
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

}

export { User, ExternalType };
