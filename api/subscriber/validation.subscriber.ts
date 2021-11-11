import { validateOrReject } from 'class-validator'
import { BaseEntity, EntitySubscriberInterface, EventSubscriber, InsertEvent, UpdateEvent } from 'typeorm'

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {

	public beforeInsert(event: InsertEvent<any>): Promise<void> {
		return this.validate(event.entity)
	}

	public beforeUpdate(event: UpdateEvent<any>): Promise<void> {
		return this.validate(event.entity)
	}

	private validate<E extends BaseEntity>(entity: E): Promise<void> {
		return validateOrReject(entity, {
			validationError: {
				target: false,
			},
			whitelist: true,
			forbidNonWhitelisted: true,
		})
	}
}
