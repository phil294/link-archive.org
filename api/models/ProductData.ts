import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
class ProductData extends BaseEntity {
    @Column()
    public verified: boolean = false;
    @Column()
    public value!: string | number | boolean;
}

export default ProductData;
