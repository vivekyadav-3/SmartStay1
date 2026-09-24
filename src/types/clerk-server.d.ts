declare module "@clerk/nextjs/server" {
  export function currentUser(): Promise<{
    id: string;
    firstName?: string | null;
    lastName?: string | null;
    emailAddresses: Array<{ emailAddress: string }>;
  } | null>;
  export function auth(): Promise<{ userId: string | null; sessionId?: string | null }>;
  export function clerkMiddleware(handler: (auth: any, req: any) => Promise<any> | any): any;
  export function createRouteMatcher(routes: string[]): (req: any) => boolean;
}
