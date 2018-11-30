import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class ProductDatum extends BaseEntity {
    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    public user!: string; // objid?
    @Column()
    public value!: string | number | boolean;
    @Column()
    public source!: string; // todo: collaborative array
}

export default ProductDatum;
