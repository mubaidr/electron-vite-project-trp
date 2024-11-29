import puppeteer from "puppeteer";

export async function getRedirects(urls: string[]) {
  try {
    console.log({ urls });

    const browser = await puppeteer.launch({
      headless: false, // Change to `true` for headless mode
    });

    const redirects = await Promise.all(
      urls.map(async (url) => {
        const context = await browser.createBrowserContext();
        const page = await context.newPage();

        let redirectChain: Array<{ url: string; status?: number }> = [];

        try {
          const response = await page.goto(url, {
            timeout: 120 * 1000,
            waitUntil: "networkidle2", // Wait for the network to stabilize
          });

          // Retrieve the redirect chain
          const chain = response?.request().redirectChain() || [];
          redirectChain = chain.map((redirect) => ({
            url: redirect.url(),
            status: redirect.response()?.status(),
          }));

          // Add the final URL and its status
          redirectChain.push({
            url: response?.url() || url,
            status: response?.status(),
          });

          console.log(`Redirect chain for ${url}:`, redirectChain);
        } catch (error) {
          console.error(`Failed to process URL: ${url}`, error);
        } finally {
          // Cleanup to avoid memory leaks
          await context.close();
        }

        return {
          url,
          redirectChain,
        };
      })
    );

    await browser.close();
    return redirects;
  } catch (error) {
    console.error("Error while processing redirects:", error);
    return [];
  }
}
