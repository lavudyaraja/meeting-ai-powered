// Type definitions for Deno globals to resolve TypeScript errors in local development
// These types are available in the Deno runtime but not in local TypeScript environments

declare global {
  interface Deno {
    env: {
      get(key: string): string | undefined;
    };
    serve(handler: (req: Request) => Response | Promise<Response>): void;
  }
  
  var Deno: Deno;
}

export {};