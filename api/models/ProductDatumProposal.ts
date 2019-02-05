import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import ProductDatum from './ProductDatum';

@Entity()
/**
 * verified === false
 * uniq(user, product, attribute)
 * C R ~U~ D
 */
class ProductDatumProposal extends ProductDatum {
    @Column()
    public attribute!: string; // objid? todo: call attribute_id? / joins?
    public product!: string;
    // votes
    // comments
}

export default ProductDatumProposal;
