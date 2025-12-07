// define function that should handle given request
// name depending on the request to handle

import { SECRET_STRIPE_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

// creating a new stripe instance (Takes stripe secret key)
const stripe = new Stripe(SECRET_STRIPE_KEY);

// the function takes some kind of event and can destructure off it
export async function POST({ request }) {
	const { priceId, mode } = await request.json();

	// creating checkout session through stripe (where users pay)
	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode,
		success_url: `${PUBLIC_FRONTEND_URL}/checkout/success`,
		cancel_url: `${PUBLIC_FRONTEND_URL}/checkout/failure`
	});

	// Return the session URL instead of sessionId
	return json({ url: session.url });
}
