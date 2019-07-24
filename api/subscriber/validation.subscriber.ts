import { EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm';

@EventSubscriber() // FIXME should work (?) but doesnt. manual injections into the entities for now. revise this
export class PostSubscriber implements EntitySubscriberInterface {

    /**
     * Called before entity insertion.
     */
    public beforeInsert(event: InsertEvent<any>) {
        console.log(`BEFORE ENTITY INSERTED: `, event.entity);
        // validation...
    }

    public beforeUpdate(event: UpdateEvent<any>) {
        console.log('before entity update');
        console.log(event.entity);
        // ...
    }
}
