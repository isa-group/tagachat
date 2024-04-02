import type { NextApiRequest, NextApiResponse } from 'next'
import { getSession } from 'next-auth/react'

import listPredicted from 'src/api/ai/listPredicted'

async function handler(req: NextApiRequest, res: NextApiResponse) {

    switch (req.method) {
        case 'GET':
        return await listPredicted(req, res)
        default:
        return res.status(405).json({
            message: `${req.method} method not allowed`,
            success: false,
        })
    }
}

export default handler
