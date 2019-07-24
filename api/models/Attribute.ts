import { IsBoolean, IsDefined, IsIn, IsInt, IsMongoId, IsNumber, IsString, Length, Max, Min, validateOrReject } from 'class-validator';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

// todo ... ways to prevent the duplicate declarations here?
export type AttributeType = string | number | boolean;
export type AttributeTypeType = 'string' | 'number' | 'boolean';
export const attributeTypeTypes: AttributeTypeType[] = ['string', 'number', 'boolean'];

@Entity()
class Attribute extends BaseEntity {
    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    @Length(3, 20)
    public subject!: string; // objectid?
    @Column()
    @IsBoolean()
    public verified: boolean = false;
    @Column()
    @IsInt()
    @Min(0)
    @Max(100)
    public interest: number = 0;
    @Column()
    @Length(1, 20)
    public name!: string;
    @Column()
    @Length(0, 255)
    public description!: string;
    @Column()
    @Length(1, 20)
    public unit!: string;
    @Column()
    @IsIn(attributeTypeTypes)
    public type!: AttributeTypeType;
    @Column()
    @IsNumber()
    // fixme: validation: int if not this.float
    public min!: number;
    @Column()
    @IsNumber()
    // fixme: validation: int if not this.float
    public max!: number;
    @Column()
    @IsBoolean()
    public float!: boolean;

    public constructor(init: Partial<Attribute>) {
        super();
        Object.assign(this, init);
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async validate() {
        await validateOrReject(this, { validationError: { target: false } });
    }
}

export default Attribute;
