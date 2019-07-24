import { IsBoolean, Length, validate, validateOrReject } from 'class-validator';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { AttributeType } from './Attribute';
import PrimaryProductDatum from './PrimaryProductDatum';

interface IPrimaryProductData {
    [attribute_id: string]: PrimaryProductDatum<AttributeType>;
}

@Entity()
class Product extends BaseEntity {
    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    @Length(3, 20)
    public subject!: string; // objectid?
    @Column()
    @Length(3, 255) // todo revert to 1
    public name!: string;
    @Column()
    @IsBoolean()
    public verified: boolean = false;
    /** {attribute_id: datum} */
    @Column()
    public data!: IPrimaryProductData; // todo nested validation?

    public constructor(init: Partial<Product>) {
        super();
        Object.assign(this, init);
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async validate() {
        await validateOrReject(this, { validationError: { target: false } });
    }
}

export default Product;
