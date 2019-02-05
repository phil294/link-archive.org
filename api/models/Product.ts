import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import PrimaryProductDatum from './PrimaryProductDatum';

interface IPrimaryProductData {
    [attribute_id: string]: PrimaryProductDatum;
}

@Entity()
class Product extends BaseEntity {
    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    public type!: string; // objectid?
    @Column()
    public name!: string; // required todo
    @Column()
    public verified: boolean = false; // public .. ? todo
    /** {attribute_id: datum} */
    @Column()
    public data!: IPrimaryProductData;
}

export default Product;
