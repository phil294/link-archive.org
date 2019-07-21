import { BaseEntity, Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity()
class Attribute extends BaseEntity {
    @ObjectIdColumn()
    public _id!: ObjectID;
    @Column()
    public subject!: string; // objectid?
    @Column()
    public name!: string; // required todo
    @Column()
    public verified: boolean = false;
    @Column()
    public interest: number = 0;
    @Column()
    public unit!: string;
    @Column()
    public type!: string;
}

export default Attribute;
