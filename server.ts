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
  likeCount: number; // いいねの数
};

const threadList = new Map<number, ThreadList>([
  [1, {
    threads: [
      {
        threadId: 1,
        name: "テスト1",
        title: "テスト1のタイトル",
        replyCount: 2,
      },
      {
        threadId: 2,
        name: "テスト2",
        title: "テスト2のタイトル",
        replyCount: 2,
      },
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
      { name: "ユーザー1", content: "テスト1の返信1", likeCount: 0 },
      { name: "ユーザー2", content: "テスト1の返信2", likeCount: 0 },
    ],
  }],
  [2, {
    threadId: 2,
    name: "テスト2",
    title: "テスト2のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー3", content: "テスト2の返信1", likeCount: 0 },
      { name: "ユーザー4", content: "テスト2の返信2", likeCount: 0 },
    ],
  }],
  [3, {
    threadId: 3,
    name: "研究1",
    title: "研究1のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー5", content: "研究1の返信1", likeCount: 0 },
      { name: "ユーザー6", content: "研究1の返信2", likeCount: 0 },
    ],
  }],
  [4, {
    threadId: 4,
    name: "研究2",
    title: "研究2のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー7", content: "研究2の返信1", likeCount: 0 },
      { name: "ユーザー8", content: "研究2の返信2", likeCount: 0 },
    ],
  }],
  [5, {
    threadId: 5,
    name: "仕事1",
    title: "仕事1のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー9", content: "仕事1の返信1", likeCount: 0 },
      { name: "ユーザー10", content: "仕事1の返信2", likeCount: 0 },
    ],
  }],
  [6, {
    threadId: 6,
    name: "仕事2",
    title: "仕事2のタイトル",
    replyCount: 2,
    reply: [
      { name: "ユーザー11", content: "仕事2の返信1", likeCount: 0 },
      { name: "ユーザー12", content: "仕事2の返信2", likeCount: 0 },
    ],
  }],
]);

const kv = await Deno.openKv();

// カテゴリーごとにスレッドリストをkvに保存
for (const [categoryId, threadListData] of threadList.entries()) {
  await kv.set(["category", categoryId], threadListData);
}

// スレッドIDごとにスレッド内容をkvに保存
for (const [threadId, threadContent] of threadContents.entries()) {
  await kv.set(["thread", threadId], threadContent);
}

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

    // kvからカテゴリーIDに対応するスレッドリストを取得
    const threadListResult = await kv.get(["category", Number(categoryId)]);
    if (!threadListResult.value) {
      return new Response(JSON.stringify({ error: "Category not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(threadListResult.value), {
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
    thread.reply.push({ name, content, likeCount: 0 });
    thread.replyCount++;

    // サマリー側のカウントも更新
    for (const categoryThreads of threadList.values()) {
      const summary = categoryThreads.threads.find((t) =>
        t.threadId === Number(threadId)
      );
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
      const { threadId, replyIndex, action } = body;

      if (threadId === undefined || replyIndex === undefined || !action) {
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
      if (reply.likeCount === undefined) {
        reply.likeCount = 0;
      }

      if (action === "add") {
        reply.likeCount++;
      } else if (action === "remove") {
        reply.likeCount = Math.max(0, reply.likeCount - 1); // 0未満にならないように
      } else {
        return new Response(JSON.stringify({ error: "Invalid action" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      return new Response(
        JSON.stringify({
          success: true,
          likeCount: reply.likeCount,
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
