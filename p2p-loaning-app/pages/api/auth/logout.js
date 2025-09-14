export default function handler(req, res) {
    // For stateless JWT, logout is handled on client by deleting token
    res.status(200).json({ message: 'Logged out' });
}
