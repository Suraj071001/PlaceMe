declare module "puppeteer" {
  interface LaunchOptions {
    headless?: boolean;
    args?: string[];
  }
  interface Browser {
    newPage(): Promise<Page>;
    close(): Promise<void>;
  }
  interface Page {
    setContent(html: string, options?: { waitUntil?: string }): Promise<void>;
    pdf(options?: { format?: string; printBackground?: boolean; margin?: object }): Promise<Buffer>;
  }
  export function launch(options?: LaunchOptions): Promise<Browser>;
}
