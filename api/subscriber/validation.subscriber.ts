import { validate, ValidationError } from 'class-validator'
import { BaseEntity, EntitySubscriberInterface, EventSubscriber, InsertEvent, ObjectLiteral, UpdateEvent } from 'typeorm'

export function do_validate(entity: ObjectLiteral): Promise<ValidationError[]> {
	return validate(entity, {
		validationError: {
			target: false,
		},
		whitelist: true,
		forbidNonWhitelisted: true,
	})
}

@EventSubscriber()
export class PostSubscriber implements EntitySubscriberInterface {

	/**
     * Called before entity insertion.
     */
	public async beforeInsert(event: InsertEvent<any>): Promise<void> {
		await this._validate_or_reject(event.entity)
	}

	public async beforeUpdate(event: UpdateEvent<any>): Promise<void> {
		await this._validate_or_reject(event.entity)
	}

	private async _validate_or_reject(entity?: ObjectLiteral): Promise<void> {
		if(!entity)
			return Promise.resolve(console.warn("entity missing for validation"))
		const errors = await do_validate(entity)
		if(errors.length)
			return Promise.reject(errors)
	}
}
