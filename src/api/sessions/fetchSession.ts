import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import axios from 'axios'
async function fetchSessions(req: NextApiRequest, res: NextApiResponse) {
    //axios get to https://twincode.herokuapp.com/sessions
    try {
        const response = await axios.get( process.env.TWINCODE_URL +'/sessions', {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.TWINCODE_API_KEY as string,
            },
        })
        const data = response.data
        //get only name from the data
        const names = data.map((session: { name: String }) => session.name)
        return res.status(200).json({
            data: names,
            success: true,
        })
    } catch (error) {
        return res.status(500).json({
            message: getErrorMessage(error),
            success: false,
        })
    }
}

export default fetchSessions
