import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ request }) => {
	// log all headers
	console.log(...request.headers);

	// create a JSON Response using a header we received
	return json(
		{
			// retrieve a specific header
			userAgent: request.headers.get('user-agent'),
		},
		{
			// set a header on the response
			headers: { 'x-custom-header': 'potato' },
		},
	);
};