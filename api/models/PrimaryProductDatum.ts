import { IsBoolean, validateOrReject } from 'class-validator';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { AttributeType } from './Attribute';
import ProductDatum from './ProductDatum';

@Entity()
class PrimaryProductDatum<T extends AttributeType> extends ProductDatum<T> {
    @Column()
    @IsBoolean()
    public verified: boolean = false;

    public constructor(init: Partial<PrimaryProductDatum<T>>) {
        super();
        Object.assign(this, init);
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async validate() {
        await validateOrReject(this, { validationError: { target: false } });
    }
}

export default PrimaryProductDatum;
