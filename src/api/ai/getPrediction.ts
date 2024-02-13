import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";


async function getPrediction(req: NextApiRequest, res: NextApiResponse){
    
    //Fetch data from OpenAI API fine-tuned model
    let parsed_prompt = [
        {"role": "system", "content": "Valid JSON indicating if the message is S  U  D  SU  ACK  M  QYN  AYN  QWH  AWH  FP  FNON  O, formal or informal"},
        {
            "role": "assistant",
            "content": "{\"S\": 50,\"U\": 50,\"D\": 0,\"SU\": 0,\"ACK\": 0,\"M\": 0,\"QYN\": 0,\"AYN\": 0,\"QWH\": 0,\"AWH\": 0,\"FP\": 0,\"FNON\": 0,\"O\": 0, \"formal\": false, \"informal\": true}"
        },
        {
          "role": "user",
          "content": req.body.prompt
        }
      ]
      return res.status(200).json(true)
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        "messages": parsed_prompt,
        "model": "ft:gpt-3.5-turbo-1106:personal::8OOlkVua",
        "response_format": {type: "json_object"},
    }, {
        headers: {
            'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
            'Content-Type': 'application/json'
        }
    })

    if(response.status === 200){
        return res.status(200).json(response.data)
    }else{
        return res.status(500).json(response.data)
    }

}

export default getPrediction;