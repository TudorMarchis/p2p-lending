import { authenticate } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'No token' });
    const token = auth.split(' ')[1];
    const payload = authenticate(token);
    if (!payload) return res.status(401).json({ error: 'Invalid token' });
    const user = await prisma.user.findUnique({ where: { id: payload.id }, select: { id: true, email: true } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.status(200).json({ user });
}
