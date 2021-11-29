import { IsString, MaxLength } from 'class-validator'

/** The database representation of a managed hard disk file.
 * Not an entity - currently only used within `simple-json` array */
export class ModelFile {
	@IsString()
	@MaxLength(255)
	path!: string

	@IsString()
	@MaxLength(255)
	name!: string

	constructor(props: ModelFile) {
		this.path = props.path
		this.name = props.name
	}
}