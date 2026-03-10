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
Deno.serve((req) => {
  if (req.method === "GET" && new URL(req.url).pathname === "/category") {
    return new Response(JSON.stringify(categories), {
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
