import { defineConfig } from "@solidjs/start/config";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  middleware: "src/middleware/index.ts",
  vite: {
    ssr: { external: ["drizzle-orm"] },
    plugins: [tailwindcss()],
  },
});
