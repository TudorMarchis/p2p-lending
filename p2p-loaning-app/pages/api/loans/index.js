import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'GET') return res.status(405).end();
    try {
        // Fetch all loans with status 'pending' (available for funding)
        const loans = await prisma.loan.findMany({
            where: { status: 'pending' },
            select: {
                id: true,
                amount: true,
                purpose: true,
                status: true,
                userId: true,
                lenderId: true,
                createdAt: true,
            },
            orderBy: { createdAt: 'desc' },
        });
        res.status(200).json({ loans });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}
