import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import clientPromise from "src/lib/mongodb";
import makePrediction from "./makePrediction";
async function getPrediction(req: NextApiRequest, res: NextApiResponse){
    
    //Fetch data from OpenAI API fine-tuned model
    const client = await clientPromise
    const db = client.db()
    const {session, room, block} = req.query
    const isPredicted = await db.collection('ai').findOne({session, room, block})
    if(isPredicted){
        //return the prediction
        const prediction = await db.collection('ai').findOne({session,
            room, block})
        return res.status(200).json({
            prediction
        })
    }else{
        //get the messages from the room
        let messages = await db.collection('rooms').find({
            sessionName: session,
            roomCode: parseInt(room as string)
        }).toArray()
        const messagesArray = messages[0].messages
        //make the prediction
        //Intialize the prediction in the database with an Status of Processing
        await db.collection('ai').insertOne({
            session,
            room,
            block,
            prediction: {
                status: 'PROCESSING',
            }
        })
        let resolvedRequests = 0
        for(let i = 0; i < messagesArray.length; i++){
            let message = messagesArray[i]

            //skip the empty messages
            if(!message.message) continue
            let parsed_prompt = [
                {"role": "system", "content": "Valid JSON indicating if the message is S  U  D  SU  ACK  M  QYN  AYN  QWH  AWH  FP  FNON  O, formal or informal"},
                {
                    "role": "assistant",
                    "content": "{\"S\": 50,\"U\": 50,\"D\": 0,\"SU\": 0,\"ACK\": 0,\"M\": 0,\"QYN\": 0,\"AYN\": 0,\"QWH\": 0,\"AWH\": 0,\"FP\": 0,\"FNON\": 0,\"O\": 0, \"formal\": false, \"informal\": true}"
                },
                {
                  "role": "user",
                  "content": message.message
                }
              ]
              /**
               * Room 101
Block 1

ID: 29615

ID: 896761
               */
              fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    "messages": parsed_prompt,
                    "model": "ft:gpt-3.5-turbo-1106:personal::8OOlkVua",
                    "response_format": {type: "json_object"},
                })
            }).then(async (response) => {

                const data = await response.json()
                resolvedRequests++;

                await db.collection('ai').updateOne({
                    session,
                    room,
                    block
                },{
                    //update status to a percentage of completion
                    $set: {
                        'prediction.status': `${(resolvedRequests/messagesArray.length) * 100}`
                    },

                    $push: {
                        'prediction.messages': {
                            message: message.message,
                            prediction: data,
                            id: message.id
                        }
                    }
                })
                
            }
            )


        }

        //update the prediction status to DONE

        //return the prediction
        const prediction = await db.collection('ai').findOne({session, room, block})
        return res.status(200).json({
            prediction
        })
    }
}

export default getPrediction;