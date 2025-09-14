import { authenticate } from '../../../lib/auth';
import prisma from '../../../lib/prisma';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).end();
    const { token, loanId } = req.body;
    const user = authenticate(token);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    // Find the loan in the database
    const loan = await prisma.loan.findUnique({ where: { id: loanId } });
    if (!loan) return res.status(404).json({ error: 'Loan not found' });

    // Update the loan as funded
    const updatedLoan = await prisma.loan.update({
        where: { id: loanId },
        data: {
            status: 'funded',
            lenderId: user.id,
        },
    });

    res.status(200).json({ loan: updatedLoan });
}