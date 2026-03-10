import { serveDir } from "@std/http";
import { appendFile } from "node:fs";

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

Deno.serve(async (req) => {
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

  if (req.method === "GET" && url.pathname === "/thread/contents") {
    const threadId = url.searchParams.get("threadId");
    if (!threadId) {
      return new Response(JSON.stringify({ error: "threadId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    let threadContent: Thread | null = null;
    for (const threadsInCategory of threads.values()) {
      // スレッドIDに一致するスレッドを探す
      const thread = threadsInCategory.threads.find(
        (t) => t.threadId === Number(threadId),
      );
      if (thread) {
        threadContent = thread;
        break;
      }
    }

    // スレッドが見つからない場合は404エラー
    if (!threadContent) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(threadContent), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
  //スレッドの作成
  if (req.method === "POST" && url.pathname === "/thread") {
    try {
      const body = await req.json();
      const { name, title, categoryId } = body;
      //簡易チェック
      if (!name || !title || !categoryId) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }
      const newThread: Thread = {
        threadId: Date.now(),
        name,
        title,
        reply: [],
      };

      threads.get(categoryId)?.threads.push(newThread);

      return new Response(JSON.stringify(newThread), {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
  if (req.method === "POST" && url.pathname === "/thread/reply") {
    const threadId = url.searchParams.get("threadId");
    if (!threadId) {
      return new Response(JSON.stringify({ error: "threadId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { name, content } = body;
    if (!name || !content) {
      return new Response(
        JSON.stringify({ error: "名前と内容は必須です" }),
        { status: 400, headers: { "Content-Type": "application/json" } },
      );
    }

    // スレッドIDに一致するスレッドを探して返信を追加
    for (const threadsInCategory of threads.values()) {
      const thread = threadsInCategory.threads.find(
        (t) => t.threadId === Number(threadId),
      );

      // スレッドが見つかった場合は返信を追加
      if (thread) {
        thread.reply.push({ name, content });
        return new Response(
          JSON.stringify({
            success: true,
            message: "リプライを保存しました",
            data: { threadId, name, content },
          }),
          { status: 200, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    // スレッドが見つからない場合は404エラー
    return new Response(JSON.stringify({ error: "Thread not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }
  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
