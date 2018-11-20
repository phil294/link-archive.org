import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class Product extends BaseEntity {
    @ObjectIdColumn()
    public id!: ObjectID;
    @Column()
    public name!: string; // required todo
    @Column()
    public verified: boolean = false;
}

export default Product;
