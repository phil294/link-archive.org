import { NextFunction, Request, Response } from 'express'

export default async (req: Request, res: Response, next: NextFunction) => {
	res.locals.app_version = req.headers['x-app-version']
	return next()
}
