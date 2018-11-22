import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class ProductDatum extends BaseEntity {
    @ObjectIdColumn()
    public id!: ObjectID;
    @Column()
    public verified: boolean = false;
    @Column()
    public value!: string | number | boolean;
}

export default ProductDatum;
