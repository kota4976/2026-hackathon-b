import { count, countReset } from "node:console";
import { threadId } from "node:worker_threads";

const threads=[
    {
    threadId:"ああああ",
    name:"いいいい",
    title:"うううう",
    count:2
},{
     threadId:"eeee",
    name:"oooo",
    title:"12支",
    count:5
}
];
Deno.serve((req) => {
    const url = new URL(req.url);

    if(req.method === "GET" && url.pathname === "/thread/list/"){
        return new Response(JSON.stringify(threads),{
            status:200,
            headers:{
                "Content-Type":"application/json","Access-Control-Allow-Origin":"*",
            },
        });
    }
    return new Response("Not Found",{status : 404});
}
);
