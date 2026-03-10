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
  reply: Reply[];
};

type Reply = {
  name: string;
  content: string;
};

// カテゴリーごとのスレッドを管理するMap
const threads = new Map<number, Threads>();
threads.set(1, {
  threads: [
    {
      threadId: 1,
      name: "テスト1",
      title: "テスト1のタイトル",
      reply: [
        { name: "ユーザー1", content: "テスト1の返信1" },
        { name: "ユーザー2", content: "テスト1の返信2" },
      ],
    },
    {
      threadId: 2,
      name: "テスト2",
      title: "テスト2のタイトル",
      reply: [
        { name: "ユーザー3", content: "テスト2の返信1" },
        { name: "ユーザー4", content: "テスト2の返信2" },
      ],
    },
  ],
});
threads.set(2, {
  threads: [
    {
      threadId: 3,
      name: "研究1",
      title: "研究1のタイトル",
      reply: [
        { name: "ユーザー5", content: "研究1の返信1" },
        { name: "ユーザー6", content: "研究1の返信2" },
      ],
    },
    {
      threadId: 4,
      name: "研究2",
      title: "研究2のタイトル",
      reply: [
        { name: "ユーザー7", content: "研究2の返信1" },
        { name: "ユーザー8", content: "研究2の返信2" },
      ],
    },
  ],
});
threads.set(3, {
  threads: [
    {
      threadId: 5,
      name: "仕事1",
      title: "仕事1のタイトル",
      reply: [
        { name: "ユーザー9", content: "仕事1の返信1" },
        { name: "ユーザー10", content: "仕事1の返信2" },
      ],
    },
    {
      threadId: 6,
      name: "仕事2",
      title: "仕事2のタイトル",
      reply: [
        { name: "ユーザー11", content: "仕事2の返信1" },
        { name: "ユーザー12", content: "仕事2の返信2" },
      ],
    },
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
    const categoryId = url.searchParams.get("categoryId");
    if (!categoryId) {
      return new Response(JSON.stringify({ error: "categoryId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const threadsInCategory = threads.get(Number(categoryId)) ||
      { threads: [] };
    return new Response(JSON.stringify(threadsInCategory), {
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
