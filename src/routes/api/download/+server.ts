import { SECRET_STRIPE_KEY } from '$env/static/private';
import { error } from '@sveltejs/kit';
import Stripe from 'stripe';
import { createHmac } from 'crypto';
import { readFile } from 'fs/promises';
import { join } from 'path';
import type { RequestHandler } from './$types';

const stripe = new Stripe(SECRET_STRIPE_KEY);

// In-memory download tracking (resets on server restart)
const downloadCounts = new Map<string, number>();
const MAX_DOWNLOADS_PER_SESSION = 3;

// Track downloads per session (total, not per time window)
function checkDownloadLimit(sessionId: string): { allowed: boolean; remaining: number } {
	const currentCount = downloadCounts.get(sessionId) || 0;

	if (currentCount >= MAX_DOWNLOADS_PER_SESSION) {
		return { allowed: false, remaining: 0 };
	}

	// Increment download count
	downloadCounts.set(sessionId, currentCount + 1);

	return {
		allowed: true,
		remaining: MAX_DOWNLOADS_PER_SESSION - (currentCount + 1)
	};
}

// Verify and decode the download token
function verifyDownloadToken(token: string): {
	sessionId: string;
	productType: string;
	valid: boolean;
	reason?: string;
} {
	try {
		const decoded = Buffer.from(token, 'base64url').toString('utf-8');
		const [sessionId, productType, expiresStr, nonce, signature] = decoded.split(':');

		if (!sessionId || !productType || !expiresStr || !nonce || !signature) {
			return { sessionId: '', productType: '', valid: false, reason: 'Invalid token format' };
		}

		// Verify signature
		const data = `${sessionId}:${productType}:${expiresStr}:${nonce}`;
		const expectedSignature = createHmac('sha256', SECRET_STRIPE_KEY).update(data).digest('hex');

		if (signature !== expectedSignature) {
			return { sessionId: '', productType: '', valid: false, reason: 'Invalid signature' };
		}

		// Check expiration
		const expires = parseInt(expiresStr);
		if (Date.now() > expires) {
			return { sessionId: '', productType: '', valid: false, reason: 'Token expired' };
		}

		return { sessionId, productType, valid: true };
	} catch (err) {
		console.error('Token parsing error:', err);
		return { sessionId: '', productType: '', valid: false, reason: 'Token parsing error' };
	}
}

export const GET: RequestHandler = async ({ url }) => {
	const token = url.searchParams.get('token');

	if (!token) {
		throw error(400, 'Missing download token');
	}

	// Verify the token
	const { sessionId, productType, valid, reason } = verifyDownloadToken(token);

	if (!valid) {
		console.error('Invalid token:', reason);
		throw error(403, reason || 'Invalid or expired download link');
	}

	// Check download limit (3 total downloads per session)
	const { allowed, remaining } = checkDownloadLimit(sessionId);

	if (!allowed) {
		console.error('Download limit exceeded for session:', sessionId);
		throw error(
			429,
			'Download limit reached. You have used all 3 allowed downloads for this purchase.'
		);
	}

	try {
		// Verify the session is still valid with Stripe
		const session = await stripe.checkout.sessions.retrieve(sessionId);

		if (session.payment_status !== 'paid') {
			throw error(403, 'Payment not completed');
		}

		// Determine which file to serve
		const filename = productType === 'lifetime' ? 'lifetime-product.txt' : 'monthly-product.txt';

		// Read the file from static folder
		const filePath = join(process.cwd(), 'static', filename);
		const fileBuffer = await readFile(filePath);

		// Determine content type
		let contentType = 'application/pdf';
		if (filename.endsWith('.zip')) {
			contentType = 'application/zip';
		} else if (filename.endsWith('.txt')) {
			contentType = 'text/plain';
		}

		console.log(
			`Download successful - Session: ${sessionId}, Product: ${productType}, Remaining: ${remaining}`
		);

		// Return the file as a download
		return new Response(fileBuffer, {
			headers: {
				'Content-Type': contentType,
				'Content-Disposition': `attachment; filename="${filename}"`,
				'Content-Length': fileBuffer.length.toString(),
				'Cache-Control': 'no-store, no-cache, must-revalidate',
				'X-Downloads-Remaining': remaining.toString()
			}
		});
	} catch (err) {
		console.error('Download error:', err);
		throw error(500, 'Failed to process download');
	}
};
