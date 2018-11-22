import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import ProductDatum from './ProductData';

@Entity()
class Product extends BaseEntity {
    @ObjectIdColumn()
    public id!: ObjectID;
    @Column()
    public type!: string; // objectid?
    @Column()
    public name!: string; // required todo
    @Column()
    public verified: boolean = false; // public .. ? todo
    @Column(() => ProductDatum)
    public data!: {string?: ProductDatum};
}

export default Product;
