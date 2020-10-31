import { IsEmail, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

enum ExternalType {
    GOOGLE,
    FACEBOOK,
}

@Entity()
class User extends BaseEntity {
    // public static ADMIN_ID = 1; // TODO: change to is_admin field
    @ObjectIdColumn()
    @IsOptional()
    public _id!: ObjectID;
    @Column()
    @IsEmail()
    @IsOptional()
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
}

export { User, ExternalType };
