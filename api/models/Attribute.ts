import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class Attribute extends BaseEntity {
    @ObjectIdColumn()
    public id!: ObjectID;
    @Column()
    public type!: string; // objectid?
    @Column()
    public name!: string; // required todo
    @Column()
    public verified: boolean = false;
    @Column()
    public interest: number = 0;
}

export default Attribute;
