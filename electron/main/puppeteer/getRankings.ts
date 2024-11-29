import puppeteer from "puppeteer";

export async function getRankings(domain: string, keywords: string[]) {
  console.log({ domain, keywords });
  try {
    let browser = await puppeteer.launch({
      headless: true,
    });

    let res = keywords.map(async (keyword) => {
      console.log(`Search keyword: ${keyword}`);
      await new Promise((resolve) => setTimeout(resolve, 2000));
      let context = await browser.createBrowserContext();
      let page = await context.newPage();

      let searchURL = `https://www.google.com/search?q=${keyword}`;
      await page.goto(searchURL, { waitUntil: "domcontentloaded" });
      let foundedResultsLength = 0;
      let results = [];

      async function getRanking() {
        results = await page.$eval(`body`, async () => {
          let els = [...document.querySelectorAll(`a[jsname="UWckNb"]`)];
          let anchors = els.map(
            (el) =>
              el?.parentElement?.parentElement?.parentElement?.parentElement
                ?.parentElement?.parentElement
          );
          anchors = anchors.filter(
            (anchor) =>
              anchor &&
              anchor.querySelector("a")?.href &&
              !anchor.querySelector(`div[jscontroller="xfmZMb"]`) &&
              !anchor.closest(`div[jscontroller="xfmZMb"]`) &&
              !anchor.querySelector(`div[data-initq]`) &&
              !anchor.closest(`[jsmodel="QPRQHf"]`) &&
              !anchor.closest(`[id="bres"]`) &&
              !anchor.closest(`[id="bottomads"]`) &&
              !anchor.querySelector(`[id="bottomads"]`) &&
              !anchor.closest(`[id="tvcap"]`) &&
              !anchor.querySelector(`[id="tvcap"]`) &&
              !anchor.closest(`[id="tads"]`) &&
              !anchor.querySelector(`[id="tads"]`)
          );

          let positionZero = document.querySelector(`.xpdopen `) as HTMLElement;
          if (
            positionZero &&
            positionZero.classList.value.split(" ").length == 1
          ) {
            anchors = [positionZero, ...anchors.slice(1)];
          }
          return anchors.map((anchor) => anchor?.querySelector("a")?.href);
        });

        foundedResultsLength += results.length;
        let ranking = results.findIndex((e) => e?.includes(domain));

        // if not found goto next page
        if ((!ranking || ranking == -1) && foundedResultsLength < 100) {
          await new Promise((resolve) => setTimeout(resolve, 2000));

          await page.click(`div[role="navigation"] a[id="pnnext"]`);
          await page.waitForNavigation({ waitUntil: "domcontentloaded" });
          return await getRanking();
        }
        return ranking || -1;
      }

      let ranking = await getRanking();
      await context.close();
      return ranking;
    });
    let results = await Promise.all(res);
    await browser.close();
    return results;
  } catch (error) {
    console.log({ error });
  }
}
