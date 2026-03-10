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

type Threads = {
  threads: Thread[];
};

type Thread = {
  threadId: number;
  name: string;
  title: string;
};

// カテゴリーごとのスレッドを管理するMap
const threads = new Map<number, Threads>();
threads.set(1, {
  threads: [
    {
      threadId: 1,
      name: "テスト1",
      title: "テスト1のタイトル",
    },
    {
      threadId: 2,
      name: "テスト2",
      title: "テスト2のタイトル",
    },
  ],
});
threads.set(2, {
  threads: [
    { threadId: 3, name: "研究1", title: "研究1のタイトル" },
    { threadId: 4, name: "研究2", title: "研究2のタイトル" },
  ],
});
threads.set(3, {
  threads: [
    { threadId: 5, name: "仕事1", title: "仕事1のタイトル" },
    { threadId: 6, name: "仕事2", title: "仕事2のタイトル" },
  ],
});

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
