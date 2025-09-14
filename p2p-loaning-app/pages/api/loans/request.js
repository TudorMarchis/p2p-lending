import { authenticate } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const user = authenticate(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });
    const { amount, purpose } = req.body;
    if (!amount || !purpose) return res.status(400).json({ error: 'Missing fields' });
    const loan = await prisma.loan.create({
        data: {
            amount: parseFloat(amount),
            purpose,
            status: 'pending',
            userId: user.id,
        },
    });
    res.status(201).json({ loan });
}
