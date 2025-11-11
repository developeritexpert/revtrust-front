import fs from "fs";
import path from "path";

export async function GET() {
  // 1. Read JS source file
  const filePath = path.join(process.cwd(), "lib", "review-widget.js");
  let js = fs.readFileSync(filePath, "utf-8");

  // 2. Replace placeholder with real token
  const token = process.env.NEXT_PUBLIC_UNIVERSAL_ADMIN_TOKEN || "";
  js = js.replace(/__WIDGET_TOKEN__/g, token);

  // 3. Serve as JavaScript
  return new Response(js, {
    headers: { "Content-Type": "application/javascript" },
  });
}
