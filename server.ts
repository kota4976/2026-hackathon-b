import { serveDir } from "@std/http";

type Category = {
  categoryId: number;
  name: string;
};

const categories: Category[] = [
  { categoryId: 1, name: "テスト" },
  { categoryId: 2, name: "研究" },
  { categoryId: 3, name: "仕事" },
  { categoryId: 4, name: "趣味" },
  { categoryId: 5, name: "スポーツ" },
  { categoryId: 6, name: "税金" },
  { categoryId: 7, name: "政治" },
  { categoryId: 8, name: "経済" },
  { categoryId: 9, name: "社会" },
  { categoryId: 10, name: "日常" },
  { categoryId: 11, name: "健康" },
  { categoryId: 12, name: "学校" },
  { categoryId: 13, name: "恋愛" },
  { categoryId: 14, name: "人間関係" },
  { categoryId: 15, name: "その他" },
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

const kv = await Deno.openKv();

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
    // カテゴリーが見つからない場合は空のスレッドリストを返す
    if (!threadListResult.value) {
      // kvを初期化して空のスレッドリストを保存する
      const emptyThreadList: ThreadList = { threads: [] };
      await kv.set(["category", Number(categoryId)], emptyThreadList);
      return new Response(JSON.stringify({ threads: [] }), {
        status: 200,
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

    // kvからスレッドIDに対応するスレッド内容を取得
    const threadContentResult = await kv.get(["thread", Number(threadId)]);
    if (!threadContentResult.value) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify(threadContentResult.value), {
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
      // kvに新しいスレッドを保存
      const newThread: Thread = {
        threadId: newThreadId,
        name,
        title,
        replyCount: 0,
        reply: [],
      };
      await kv.set(["thread", newThreadId], newThread);

      // カテゴリーのスレッドリストを更新
      // カテゴリーIDに対応するスレッドリストをkvから取得
      const threadListResult = await kv.get(["category", Number(categoryId)]);
      if (!threadListResult.value) {
        return new Response(JSON.stringify({ error: "Category not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      // 取得したスレッドリストに新しいスレッドを追加して保存
      const categoryThreadList = threadListResult.value as ThreadList;
      categoryThreadList.threads.push({
        threadId: newThreadId,
        name,
        title,
        replyCount: 0,
      });
      await kv.set(["category", Number(categoryId)], categoryThreadList);

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

    // kvに返信内容を保存
    const threadContentResult = await kv.get(["thread", Number(threadId)]);
    if (!threadContentResult.value) {
      return new Response(JSON.stringify({ error: "Thread not found" }), {
        status: 404,
        headers: { "Content-Type": "application/json" },
      });
    }

    const thread = threadContentResult.value as Thread;
    thread.reply.push({ name, content, likeCount: 0 });
    thread.replyCount++;

    // 更新したスレッド内容をkvに保存
    await kv.set(["thread", Number(threadId)], thread);

    // サマリー側のカウントも更新 (kvから直接読み書きする)
    for (const category of categories) {
      const categoryListResult = await kv.get([
        "category",
        category.categoryId,
      ]);
      if (!categoryListResult.value) continue;
      const categoryThreadList = categoryListResult.value as ThreadList;
      const summary = categoryThreadList.threads.find((t) =>
        t.threadId === Number(threadId)
      );
      if (summary) {
        summary.replyCount++;
        await kv.set(["category", category.categoryId], categoryThreadList);
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

      // いいねの切り替えは、スレッド内容をkvから取得して行う
      const threadContentResult = await kv.get(["thread", Number(threadId)]);
      if (!threadContentResult.value) {
        return new Response(JSON.stringify({ error: "Thread not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }
      const thread = threadContentResult.value as Thread;
      const reply = thread.reply[Number(replyIndex)];
      if (!reply) {
        return new Response(JSON.stringify({ error: "Reply not found" }), {
          status: 404,
          headers: { "Content-Type": "application/json" },
        });
      }

      // いいね状態の切り替え
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

      // 更新したスレッド内容をkvに保存
      await kv.set(["thread", Number(threadId)], thread);

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
