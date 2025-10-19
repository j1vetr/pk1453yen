import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { renderHTMLWithMeta } from "./ssr";
import path from "path";
import fs from "fs";

const app = express();

// Trust proxy for production (Nginx reverse proxy)
if (process.env.NODE_ENV === 'production') {
  app.set('trust proxy', 1);
}

// Simple log function (no Vite dependency)
function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });
  console.log(`${formattedTime} [${source}] ${message}`);
}

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  // 301 Redirect for old URL structure: /{il}/{ilce}/{mahalle}/{pk}/ -> /{il}/{ilce}/{mahalle}/
  app.use((req, res, next) => {
    const urlParts = req.path.split('/').filter(Boolean);
    
    // Check if this is the old URL format: 4 parts where last part is a 5-digit postal code
    if (urlParts.length === 4 && /^\d{5}$/.test(urlParts[3])) {
      const newUrl = `/${urlParts[0]}/${urlParts[1]}/${urlParts[2]}/`;
      return res.redirect(301, newUrl);
    }
    
    next();
  });

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    // Development: Setup Vite AND SSR for rendering content
    const vite = await import('vite');
    const viteDevServer = await vite.createServer({
      server: { 
        middlewareMode: true,
        allowedHosts: true
      },
      appType: 'custom',
    });
    
    app.use(viteDevServer.middlewares);
    
    // Development SSR: Serve HTML with dynamic meta tags and rendered content
    app.use("*", async (req, res, next) => {
      const url = req.originalUrl;
      
      try {
        // Check if this is an API route
        if (url.startsWith('/api')) {
          return next();
        }
        
        const templatePath = path.resolve(import.meta.dirname, "..", "client", "index.html");
        
        // Check if this is a static file request (has extension and not .html)
        if (req.path.includes('.') && !req.path.endsWith('.html')) {
          return next();
        }
        
        await renderHTMLWithMeta(req, res, templatePath);
      } catch (e: any) {
        viteDevServer.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    // Production: Serve static files (but not index.html - SSR will handle that)
    const distPath = path.resolve(import.meta.dirname, "public");
    app.use(express.static(distPath, { index: false }));
    
    // SSR: Serve HTML with dynamic meta tags for all routes
    app.use("*", async (req, res) => {
      const templatePath = path.resolve(distPath, "index.html");
      
      // Check if this is a static file request (has extension)
      if (req.path.includes('.')) {
        // Let it 404 naturally
        return res.status(404).send('Not Found');
      }
      
      await renderHTMLWithMeta(req, res, templatePath);
    });
  }

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
