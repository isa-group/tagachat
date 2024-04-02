import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'
import getPrediction from 'src/api/ai/getPrediction'
import isPredicted from 'src/api/ai/isPredicted'

async function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
        return await isPredicted(req, res)
        default:
        return res.status(405).json({
            message: `${req.method} method not allowed`,
            success: false,
        })
    }
}

export default handler
