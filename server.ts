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
  replyCount: number;
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
  replyCount: number;
  reply: Reply[];
};

type Reply = {
  name: string;
  content: string;
  likedBy?: string[]; // いいねしたユーザーの名前の配列
};

const threadList = new Map<number, ThreadList>([
  [1, {
    threads: [
      { threadId: 1, name: "テスト1", title: "テスト1のタイトル", replyCount: 2 },
      { threadId: 2, name: "テスト2", title: "テスト2のタイトル", replyCount: 2 },
    ],
  }],
  [2, {
    threads: [
      { threadId: 3, name: "研究1", title: "研究1のタイトル", replyCount: 2 },
      { threadId: 4, name: "研究2", title: "研究2のタイトル", replyCount: 2 },
    ],
  }],
  [3, {
    threads: [
      { threadId: 5, name: "仕事1", title: "仕事1のタイトル", replyCount: 2 },
      { threadId: 6, name: "仕事2", title: "仕事2のタイトル", replyCount: 2 },
    ],
  }],
]);

// スレッドIDごとの内容を管理するMap
const threadContents = new Map<number, Thread>([
  [1, {
    threadId: 1,
    name: "テスト1",
    title: "テスト1のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー1", content: "テスト1の返信1", likedBy: [] },
      { name: "ユーザー2", content: "テスト1の返信2", likedBy: [] },
    ],
  }],
  [2, {
    threadId: 2,
    name: "テスト2",
    title: "テスト2のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー3", content: "テスト2の返信1", likedBy: [] },
      { name: "ユーザー4", content: "テスト2の返信2", likedBy: [] },
    ],
  }],
  [3, {
    threadId: 3,
    name: "研究1",
    title: "研究1のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー5", content: "研究1の返信1", likedBy: [] },
      { name: "ユーザー6", content: "研究1の返信2", likedBy: [] },
    ],
  }],
  [4, {
    threadId: 4,
    name: "研究2",
    title: "研究2のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー7", content: "研究2の返信1", likedBy: [] },
      { name: "ユーザー8", content: "研究2の返信2", likedBy: [] },
    ],
  }],
  [5, {
    threadId: 5,
    name: "仕事1",
    title: "仕事1のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー9", content: "仕事1の返信1", likedBy: [] },
      { name: "ユーザー10", content: "仕事1の返信2", likedBy: [] },
    ],
  }],
  [6, {
    threadId: 6,
    name: "仕事2",
    title: "仕事2のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー11", content: "仕事2の返信1", likedBy: [] },
      { name: "ユーザー12", content: "仕事2の返信2", likedBy: [] },
    ],
  }],
]);

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
        replyCount: 0,
      });
      threadContents.set(newThreadId, {
        threadId: newThreadId,
        name: name,
        title: title,
        replyCount: 0,
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

    // 返信を追加し、カウントをアップ
    thread.reply.push({ name, content, likedBy: [] });
    thread.replyCount++;

    // サマリー側のカウントも更新
    for (const categoryThreads of threadList.values()) {
      const summary = categoryThreads.threads.find(t => t.threadId === Number(threadId));
      if (summary) {
        summary.replyCount++;
        break;
      }
    }

    return new Response(
      JSON.stringify({
        success: true,
        message: "返信を保存しました",
      }),
      { status: 200, headers: { "Content-Type": "application/json" } },
    );
  }

  // 返信へのいいね切り替え
  if (req.method === "POST" && url.pathname === "/thread/reply/like") {
    try {
      const body = await req.json();
      const { threadId, replyIndex, name } = body;

      if (threadId === undefined || replyIndex === undefined || !name) {
        return new Response(JSON.stringify({ error: "Missing fields" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      const thread = threadContents.get(Number(threadId));
      if (!thread) {
        return new Response(JSON.stringify({ error: "Thread not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      const reply = thread.reply[Number(replyIndex)];
      if (!reply) {
        return new Response(JSON.stringify({ error: "Reply not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // いいね状態の切り替え
      if (!reply.likedBy) {
        reply.likedBy = [];
      }
      const userIndex = reply.likedBy.indexOf(name);
      if (userIndex === -1) {
        // いいねを追加
        reply.likedBy.push(name);
      } else {
        // いいねを削除
        reply.likedBy.splice(userIndex, 1);
      }

      return new Response(
        JSON.stringify({
          success: true,
          likedBy: reply.likedBy,
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

  return serveDir(req, {
    fsRoot: "./public",
    urlRoot: "",
    showDirListing: true,
    enableCors: true,
  });
});
