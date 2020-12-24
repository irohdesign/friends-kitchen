const puppeteer = require("puppeteer");
const fs = require('fs');

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  const url = 'https://www.bingingwithbabish.com/recipes/2017/5/4/pollo-a-la-plancha';

  await page.goto(url);

  // title of page/recipe
  const pageTitle = await page.evaluate(() => document.querySelector('h1.page-title').textContent.trim());

  // all ingredients listed
  const allIngredients = await page.evaluate(() =>
    // list the ingredients in the ul
    Array.from(document
      .querySelectorAll('div.sqs-col-5 li p'))
      .map(item => item.textContent)
  );

  // banner-image
  const imgSrc = await page.evaluate(() => 
    document.querySelector('div.banner-image img').src
  );

  // cooking directions
  const method = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.sqs-col-7 ol li p')).map(step => (step.innerText))
  );

  // put together
  let recipe = {
    'title': pageTitle,
    'all_ingredients': allIngredients,
    'method': method,
    'attempted': false,
    'img_src': imgSrc,
    'original_page': url
    // 'sub_lists': subLists
  }

  await fs.writeFile(`recipes.json`, JSON.stringify(recipe, null, 2), function (error) {
    if (error) {
      console.log(error);
      console.log("something went wrong");
    } else {
      console.log("successful writing");
    }
  });

  await browser.close();
})();