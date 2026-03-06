import axios from "axios"
import redisClient from "@repo/redis-config/redisClient"
import { STREAM_ID as JOB_STREAM_ID, } from "@repo/redis-config/STREAM"
import client from "@repo/db"

const GOOGLE_CHAT_CONSUMERGROUP_ID = "google-chat"

interface googleWebhookConfig {
    SPACE_ID : string,
    KEY : string ,
    TOKEN : string
}

export async  function webhook({SPACE_ID , KEY , TOKEN } : googleWebhookConfig ,  data : string  ){
  const url = `https://chat.googleapis.com/v1/spaces/${SPACE_ID}/messages?key=${KEY}&token=${TOKEN}`
  const response = await  axios({
    url : url,
    method : "POST",
    headers :{"Content-Type": "application/json; charset=UTF-8"},
    data : {
        text : data
    } 
  })

  return response;
}







async function Main() {
  const WorkerId = 1;
    // await redisClient.xGroupCreate(JOB_STREAM_ID , GOOGLE_CHAT_CONSUMERGROUP_ID , '$' ,  { MKSTREAM : true });

  while(1){
    const response = await redisClient.xReadGroup(
      GOOGLE_CHAT_CONSUMERGROUP_ID,  `Worker-${WorkerId}` , {
        key : JOB_STREAM_ID,
        id : ">"
      }, {
        COUNT : 1,
        BLOCK : 5000
      }
    )

    if(!response) continue;

    // push the notication of pending
   //@ts-expect-error
   // iterate through all the space get all the keys and call the function send the message
    console.log((response[0].messages));
    const chatResponse =  await  webhook({SPACE_ID : "AAQAofdmP3Y" , KEY :  "AIzaSyDdI0hCZtE6vySjMm-WEfRq3CPzqKqqsHI"  , TOKEN : "OMgVXGO2PhRkH_rz-Fi6wSrDJ842gob_-rcrBN_Lcv4" }  , JSON.stringify(response))

    // push the notification of sucess

    if(chatResponse.status == 200) {
      // shoudl we acknowledge
    }


  

  }
}

Main();