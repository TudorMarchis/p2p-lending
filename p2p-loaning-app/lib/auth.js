import { hash, compare } from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from './prisma';

export async function registerUser(email, password) {
    const hashedPassword = await hash(password, 10);
    const user = await prisma.user.create({
        data: { email, password: hashedPassword },
        select: { id: true, email: true }
    });
    return user;
}

export async function loginUser(email, password) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return null;
    const isValid = await compare(password, user.password);
    if (!isValid) return null;
    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET || 'secret', { expiresIn: '1d' });
    return { user: { id: user.id, email: user.email }, token };
}

export function authenticate(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET || 'secret');
    } catch {
        return null;
    }
}
