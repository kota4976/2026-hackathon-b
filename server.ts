import { serveDir } from "@std/http";

type Category = {
  categoryId: number;
  name: string;
};

const categories: Category[] = [
  { categoryId: 1, name: "テスト" },
  { categoryId: 2, name: "研究" },
  { categoryId: 3, name: "仕事" },
];

type ThreadSummary = {
  threadId: number;
  name: string;
  title: string;
};

type ThreadList = {
  threads: ThreadSummary[];
};

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

const threadList = new Map<number, ThreadList>([
  [1, {
    threads: [
      { threadId: 1, name: "テスト1", title: "テスト1のタイトル" },
      { threadId: 2, name: "テスト2", title: "テスト2のタイトル" },
    ],
  }],
  [2, {
    threads: [
      { threadId: 3, name: "研究1", title: "研究1のタイトル" },
      { threadId: 4, name: "研究2", title: "研究2のタイトル" },
    ],
  }],
  [3, {
    threads: [
      { threadId: 5, name: "仕事1", title: "仕事1のタイトル" },
      { threadId: 6, name: "仕事2", title: "仕事2のタイトル" },
    ],
  }],
]);

// スレッドIDごとの内容を管理するMap
const threadContents = new Map<number, Thread>([
  [1, {
    threadId: 1,
    name: "テスト1",
    title: "テスト1のタイトル",
    reply: [
      { name: "ユーザー1", content: "テスト1の返信1" },
      { name: "ユーザー2", content: "テスト1の返信2" },
    ],
  }],
  [2, {
    threadId: 2,
    name: "テスト2",
    title: "テスト2のタイトル",
    reply: [
      { name: "ユーザー3", content: "テスト2の返信1" },
      { name: "ユーザー4", content: "テスト2の返信2" },
    ],
  }],
  [3, {
    threadId: 3,
    name: "研究1",
    title: "研究1のタイトル",
    reply: [
      { name: "ユーザー5", content: "研究1の返信1" },
      { name: "ユーザー6", content: "研究1の返信2" },
    ],
  }],
  [4, {
    threadId: 4,
    name: "研究2",
    title: "研究2のタイトル",
    reply: [
      { name: "ユーザー7", content: "研究2の返信1" },
      { name: "ユーザー8", content: "研究2の返信2" },
    ],
  }],
  [5, {
    threadId: 5,
    name: "仕事1",
    title: "仕事1のタイトル",
    reply: [
      { name: "ユーザー9", content: "仕事1の返信1" },
      { name: "ユーザー10", content: "仕事1の返信2" },
    ],
  }],
  [6, {
    threadId: 6,
    name: "仕事2",
    title: "仕事2のタイトル",
    reply: [
      { name: "ユーザー11", content: "仕事2の返信1" },
      { name: "ユーザー12", content: "仕事2の返信2" },
    ],
  }],
]);

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

  if (req.method === "GET" && url.pathname === "/thread/list") {
    const categoryId = url.searchParams.get("categoryId");
    if (!categoryId) {
      return new Response(JSON.stringify({ error: "categoryId is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const threadListForCategory = threadList.get(Number(categoryId));
    if (!threadListForCategory) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(threadListForCategory), {
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

    const threadContent = threadContents.get(Number(threadId));
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

      const newThreadId = Date.now(); // 簡易的にスレッドIDを生成
      threadList.get(Number(categoryId))?.threads.push({
        threadId: newThreadId,
        name: name,
        title: title,
      });
      threadContents.set(newThreadId, {
        threadId: newThreadId,
        name: name,
        title: title,
        reply: [],
      });

      return new Response(
        JSON.stringify({
          success: true,
          message: "スレッドを保存しました",
        }),
        { status: 200, headers: { "Content-Type": "application/json" } },
      );
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

    const thread = threadContents.get(Number(threadId));
    // スレッドが存在しない場合はエラーを返す
    if (!thread) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    thread.reply.push({ name, content });

    return new Response(
      JSON.stringify({
        success: true,
        message: "返信を保存しました",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
