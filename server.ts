import { serveDir } from "@std/http";

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

Deno.serve((req) => {
  const url = new URL(req.url);

  if (req.method === "GET" && url.pathname === "/category") {
    return new Response(JSON.stringify(categories), {
      headers: { "Content-Type": "application/json" },
    });
  }

  if (req.method === "GET" && url.pathname === "/thread/list") {
    return new Response(JSON.stringify(threads), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
