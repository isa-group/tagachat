import type { NextApiRequest, NextApiResponse } from 'next'
import { getErrorMessage } from 'src/utils/getErrorMessage'
import axios from 'axios'
async function fetchSessionData(req: NextApiRequest, res: NextApiResponse) {
    //axios get to https://twincode.herokuapp.com/sessions
    try {
        const response = await axios.get(process.env.TWINCODE_URL + '/api/v1/standard/'+ req.query.sessionName, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': process.env.TWINCODE_API_KEY as string,
            },
        })
        const data = response.data

        //get only name from the data
        return res.status(200).json(data)
    } catch (error: any) {
        return res.status(500).json({
            message: error.response.data.error,
            success: false,
        })
    }
}

export default fetchSessionData
