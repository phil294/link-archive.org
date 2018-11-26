import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import ProductDatum from './ProductDatum';

interface IProductData {
    [attributeId: string]: ProductDatum[];
}

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
    /** {attributeId: datum} */
    @Column(() => ProductDatum)
    public data!: IProductData;
}

export default Product;
