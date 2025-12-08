import { SECRET_STRIPE_KEY } from '$env/static/private';
import { PUBLIC_FRONTEND_URL } from '$env/static/public';
import { json } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(SECRET_STRIPE_KEY);

export async function POST({ request }) {
	const { priceId, mode } = await request.json();

	const session = await stripe.checkout.sessions.create({
		payment_method_types: ['card'],
		line_items: [
			{
				price: priceId,
				quantity: 1
			}
		],
		mode,
		// Include session_id in success URL for verification
		success_url: `${PUBLIC_FRONTEND_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
		cancel_url: `${PUBLIC_FRONTEND_URL}/checkout/failure`,
		// Add metadata to identify product
		metadata: {
			product_type: mode === 'subscription' ? 'monthly' : 'lifetime'
		}
	});

	return json({ url: session.url });
}
