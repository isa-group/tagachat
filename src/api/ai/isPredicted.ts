import { NextApiRequest,NextApiResponse } from "next";
import clientPromise from 'src/lib/mongodb'


async function isPredicted(req: NextApiRequest, res: NextApiResponse) {

    try {

        const client = await clientPromise
        const db = client.db()
        const {session, room, block} = req.query
        const isPredicted = await db.collection('ai').findOne({session, room, block})
        if(isPredicted) {
            return res.status(200).json({
                success: true,
                isPredicted: true
            })
        } else {
            return res.status(200).json({
                success: true,
                isPredicted: false
            })
        }

    }catch(error) {
        return res.status(500).json({
            success: false,
        })
    }

}

export default isPredicted;