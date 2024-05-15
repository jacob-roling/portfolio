import sirv from "sirv";
import { fileURLToPath } from "node:url";
import { execSync } from "child_process";

/**
 *  @return {import("astro").AstroIntegration}
 */
export default function pagefind() {
  let outDir;
  return {
    name: "pagefind",
    hooks: {
      "astro:config:done": ({ config }) => {
        outDir = fileURLToPath(config.outDir + "client");
      },
      "astro:server:setup": ({ server }) => {
        const serve = sirv(outDir, {
          dev: true,
          etag: true,
        });

        server.middlewares.use((req, res, next) => {
          if (req.url.startsWith("/pagefind/")) {
            serve(req, res, next);
          } else {
            next();
          }
        });
      },
      "astro:build:done": ({ logger }) => {
        const cmd = `pnpx pagefind --site "${outDir}"`;
        execSync(cmd, {
          stdio: [process.stdin, process.stdout, process.stderr],
        });
      },
    },
  };
}
