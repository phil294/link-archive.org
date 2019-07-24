import { validateOrReject } from 'class-validator';
import { BaseEntity, BeforeInsert, BeforeUpdate, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import { AttributeType } from './Attribute';
import ProductDatum from './ProductDatum';

/**
 * verified === false
 * uniq(user, product, attribute)
 * C R ~U~ D
 */
@Entity()
class ProductDatumProposal<T extends AttributeType> extends ProductDatum<T> {
    @Column()
    public attribute!: string; // objid? todo: call attribute_id? / joins? / valid
    public product!: string; // todo ^
    // votes
    // comments

    public constructor(init: Partial<ProductDatumProposal<T>>) {
        super();
        Object.assign(this, init);
    }

    @BeforeInsert()
    @BeforeUpdate()
    public async validate() {
        await validateOrReject(this, { validationError: { target: false } });
    }
}

export default ProductDatumProposal;
