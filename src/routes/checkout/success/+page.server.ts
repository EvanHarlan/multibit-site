import { SECRET_STRIPE_KEY } from '$env/static/private';
import { error, redirect } from '@sveltejs/kit';
import Stripe from 'stripe';
import { createHmac, randomBytes } from 'crypto';
import type { PageServerLoad } from './$types';

const stripe = new Stripe(SECRET_STRIPE_KEY);

// In-memory store for one-time token generation (resets on server restart)
const processedSessions = new Map<string, { token: string; timestamp: number }>();

// Create a signed download token that expires
function createDownloadToken(sessionId: string, productType: string): string {
	const expires = Date.now() + 48 * 60 * 60 * 1000; // 48 hours
	const nonce = randomBytes(16).toString('hex'); // Add randomness
	const data = `${sessionId}:${productType}:${expires}:${nonce}`;
	const signature = createHmac('sha256', SECRET_STRIPE_KEY).update(data).digest('hex');
	return Buffer.from(`${data}:${signature}`).toString('base64url');
}

// Clean up old processed sessions periodically
function cleanupProcessedSessions() {
	const now = Date.now();
	const maxAge = 48 * 60 * 60 * 1000; // 48 hours

	for (const [sessionId, data] of processedSessions.entries()) {
		if (now - data.timestamp > maxAge) {
			processedSessions.delete(sessionId);
		}
	}
}

export const load: PageServerLoad = async ({ url }) => {
	const sessionId = url.searchParams.get('session_id');
	const token = url.searchParams.get('token');

	// If we already have a token, just display the page
	if (token) {
		// Verify token is valid format (don't need to verify signature here)
		try {
			const decoded = Buffer.from(token, 'base64url').toString('utf-8');
			const parts = decoded.split(':');
			if (parts.length === 5) {
				return {
					productType: parts[1],
					customerEmail: null, // We don't store email in token
					downloadToken: token
				};
			}
		} catch (e) {
			throw error(400, 'Invalid token');
		}
	}

	// If we have a session_id, process it (first time visit from Stripe)
	if (sessionId) {
		// Check if we already processed this session
		const existing = processedSessions.get(sessionId);
		if (existing) {
			// Already processed - redirect to token-based URL to hide session_id
			throw redirect(303, `/checkout/success?token=${existing.token}`);
		}

		// Verify the session with Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		// Check if payment was successful
		if (session.payment_status !== 'paid') {
			throw error(400, 'Payment not completed');
		}

		const productType = session.metadata?.product_type || 'lifetime';

		// Create a secure, time-limited download token (only once)
		const downloadToken = createDownloadToken(session.id, productType);

		// Store that we've processed this session
		processedSessions.set(sessionId, {
			token: downloadToken,
			timestamp: Date.now()
		});

		// Clean up old entries
		if (Math.random() < 0.1) cleanupProcessedSessions();

		// Redirect to hide the session_id from URL
		throw redirect(303, `/checkout/success?token=${downloadToken}`);
	}

	throw error(400, 'Missing parameters');
};
