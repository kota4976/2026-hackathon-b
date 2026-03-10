import { serveDir } from "@std/http";
import { json } from "node:stream/consumers";

type Category = {
  categoryId: number;
  name: string;
};

let categories: Category[] = [
  { categoryId: 1, name: "テスト" },
  { categoryId: 2, name: "研究" },
  { categoryId: 3, name: "仕事" },
];

const threads = [
  {
    threadId: "ああああ",
    name: "いいいい",
    title: "うううう",
    count: 2,
  },
  {
    threadId: "eeee",
    name: "oooo",
    title: "12支",
    count: 5,
  },
];

Deno.serve(async(req) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/category") {
    return new Response(JSON.stringify(categories), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "GET" && url.pathname === "/thread/list/") {
    return new Response(JSON.stringify(threads), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
    //スレッドの作成
  if(req.method === "POST" && url.pathname === "/thread"){
    try{
    const body = await req.json();
    const {name,title,content,categoryId}=body;
    //簡易チェック
    if(!name || !title || !content || !categoryId){
      return new Response(JSON.stringify({error:"Missing fields"}),{
        status:400,
        headers:{"Content-Type":"application/json"},
      });
    }
    const newThread = {
      threadId: Date.now().toString(),
      name,
      title,
      content,
      categoryId,
      count:0,
    };
    threads.push(newThread);

    return new Response(JSON.stringify({message:"Success",thread:newThread}),{
      status:201,
      headers:{"Content-Type":"application/json"},
    });
  }catch{
      return new Response(JSON.stringify({error:"Invalid JSON"}),{
      status:400,
      headers:{"Content-Type":"application/json"}, 
    });
  }}

  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
