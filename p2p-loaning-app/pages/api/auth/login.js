import { loginUser } from '../../../lib/auth';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ error: 'Missing fields' });
    const result = await loginUser(email, password);
    if (!result) return res.status(401).json({ error: 'Invalid credentials' });
    res.status(200).json(result);
}
