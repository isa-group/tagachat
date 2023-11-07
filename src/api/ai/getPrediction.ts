import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";


async function getPrediction(req: NextApiRequest, res: NextApiResponse){
    
    //Fetch data from OpenAI API fine-tuned model
    let parsed_prompt = [
        {"role": "system", "content": "Esto es una convesaci\u00f3n entre usuarios de un chat, tu objetivo es saber si es S  U  D  SU  ACK  M  QYN  AYN  QWH  AWH  FP  FNON  O, tambi\u00e9n si es formal o informal. \u00danicamente devolver\u00e1s la clasificaci\u00f3n del mensaje sin explicar el por qu\u00e9. un ejemplo de mensaje devuelto es: la probabilidad de que sea formal y la probabilidad de que sea alguno de S	U	D	SU	ACK	M	QYN	AYN	QWH	AWH	FP	FNON	O . Obligatoriamente ninguno puede ser 1, todos tienen que partir desded 0.01, En caso de no saber la clasificaci\u00f3n, intentas adivinarlo."},
        {
          "role": "user",
          "content": req.body.prompt
        }
      ]

    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
        "messages": parsed_prompt,
        "model": "ft:gpt-3.5-turbo-0613:personal::8Du3hP16",
        "temperature": 0.9,
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