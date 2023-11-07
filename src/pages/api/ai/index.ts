import type { NextApiRequest, NextApiResponse } from 'next'
import getPrediction from 'src/api/ai/getPrediction'

async function handler(req: NextApiRequest, res: NextApiResponse) {
    switch (req.method) {
        case 'POST':
        return await getPrediction(req, res)
        default:
        return res.status(405).json({
            message: `${req.method} method not allowed`,
            success: false,
        })
    }
}

export default handler
