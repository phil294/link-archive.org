import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import ProductDatum from './ProductDatum';

@Entity()
class PrimaryProductDatum extends ProductDatum {
    @Column()
    public verified: boolean = false;
}

export default PrimaryProductDatum;
