import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';
import PrimaryProductDatum from './PrimaryProductDatum';

interface IPrimaryProductData {
    [attributeId: string]: PrimaryProductDatum;
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
    /** {attributeId: datum} */
    @Column()
    public data!: IPrimaryProductData;
}

export default Product;
