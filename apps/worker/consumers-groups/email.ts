import redisClient from "@repo/redis-config/redisClient";
import { STREAM_ID as JOB_STREAM_ID } from "@repo/redis-config/STREAM";
import client from "@repo/db";

const EMAIL_CONSUMERGROUP_ID = "email";


async function Main(){
    await redisClient.xGroupCreate(JOB_STREAM_ID, EMAIL_CONSUMERGROUP_ID, "$", {
    MKSTREAM: true,
    });


  while(1){

    const response = await redisClient.xReadGroup(EMAIL_CONSUMERGROUP_ID , 'Worker-1' , {
        key : JOB_STREAM_ID,
        id : ">"
    }, {
        COUNT : 1,
        BLOCK : 5000
        
    })

    if(!response) continue;

    // push to notification of pending 
    // access all the student mail here  for allowed batch put in array
    // send the mail to each person 
    // push to notication of sending staus complete 
    //ack the message id 


    console.log(response);

  }
}

Main();


import { Resend  } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

async function sendMessage (){
    const data = await resend.emails.send({
      from: 'placementcell@dsadev.me',
      to: ['rathornitesh1309@gmail.com'],
      subject: 'Hello World',
      text : "hello world "
    });

    console.log(data.data?.id)
}


sendMessage()