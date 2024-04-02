import { NextApiRequest,NextApiResponse } from "next";
import clientPromise from 'src/lib/mongodb'


async function listPredicted(req: NextApiRequest, res: NextApiResponse) {

    try {

        const client = await clientPromise
        const db = client.db()
        const {session} = req.query

        const predicted = (await db.collection('ai').find({session}).toArray()).map((item) => {
            return {
                room: item.room,
                block: item.block,
            }
        }
        )

        //predicted, get only room and block dinstinct

        const uniquePredicted = predicted.filter((v,i,a) => a.findIndex(t => (t.room === v.room && t.block === v.block)) === i)



        return res.status(200).json({
            success: true,
            predicted: uniquePredicted
        })


    }catch(error) {
        return res.status(500).json({
            success: false,
        })
    }

}

export default listPredicted;