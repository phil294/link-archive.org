import express from 'express'
import user_secured from '../user-secured'
import { User } from '../models/User'

const user_router = express.Router()
user_router.patch('/', user_secured, async (req, res) => {
	const user: User = res.locals.user;
	[
		'min_iat', // If set, this will lead to the invalidation of all tokens prior to the date
	].forEach((prop) => {
		if (req.body[prop] !== undefined)
		// @ts-ignore
			user[prop] = req.body[prop]
	})
	await user.save()
	res.send(user)
})

user_router.delete('/', user_secured, async (req, res) => {
	const user: User = res.locals.user
	await user.remove()
	res.send(user)
})

export default user_router
