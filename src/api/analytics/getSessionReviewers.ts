import clientPromise from 'src/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import { convertData, streamSessionData } from 'src/utils/downloadSessionData'
import { IRoom } from 'src/types/room.type'
import calculateRoomPercentage from 'src/utils/calculateRoomPercentage'

async function getSessionReviewers(req: NextApiRequest, res: NextApiResponse) {
    let { sessionName } = req.query


    if (!sessionName) throw new Error('no session id was provided')
    if (Array.isArray(sessionName)) sessionName = sessionName.join('')

    const client = await clientPromise
    const db = client.db()
    const rooms = await db
      .collection('rooms')
      .find({
        sessionName,
      })
      .toArray()
      
      const nr = rooms.map((room) => {
            const {sessionName, roomCode, messages, _id, participant1Code, participant2Code } = room
            const id = _id.toString()
            return {
                roomId: roomCode,
                blocks: [1,2].map((block) => {
                    const percentages = calculateRoomPercentage(messages, block as unknown as 1 | 2)
                    return {
                        blockId: block,
                        reviewers: percentages.map((percentage) => {
                            return {
                                reviewer: percentage.reviewer,
                                percentage: percentage.percentage
                            }
                        })
                    }
                }
                )

            }
        }
        )


        if (!nr || nr.length === 0) {
            return res.status(404).json({
                message: 'No rooms found',
                success: false,
            })
        }else{
            return res.status(200).json(nr)
        }
        
}

export default getSessionReviewers
