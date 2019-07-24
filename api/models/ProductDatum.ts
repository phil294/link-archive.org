import { IsIn, IsNotEmpty, IsNotIn, IsUrl, Length, validateOrReject } from 'class-validator';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { AttributeType } from './Attribute';

// todo prevent instantiation AND saving, only derived allowed
@Entity()
class ProductDatum<T extends AttributeType> extends BaseEntity {
    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    public user!: string; // objid or username? todo. + -> valid constraint
    @Column()
    @IsNotIn([undefined])
    public value!: T | null;
    @Column()
    @IsUrl()
    public source!: string; // todo: collaborative array (maybe)

    @BeforeInsert()
    @BeforeUpdate()
    public async validate() {
        await validateOrReject(this, { validationError: { target: false } });
    }
}

export default ProductDatum;
