const { text } = require("body-parser");
const puppeteer = require("puppeteer");
const iPad = puppeteer.devices["iPad Pro 11"];

module.exports = {
  scrapGag: async function (req, res) {
    const urlGagId = req.params.gagLink;
    const urlGag = `https://9gag.com/gag/${urlGagId}`
    console.log("url=", urlGag);
    console.log("urlId=", urlGagId);
    const urlGagTest = "https://9gag.com/gag/aE8qLK9";
    console.log(urlGag);
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Browser ok');
    await page.emulate(iPad);
    const delay = (ms) => new Promise((res) => setTimeout(res, ms));
    await page.goto(urlGag);
    console.log('Page ok');
    await delay(3500);

    const attachementSrc = await page.evaluate(() => {
      //let buttonCookies = document.querySelector(".css-1k47zha");
      //buttonCookies.click();
      let myImg = document.querySelector("div.image-post picture img")?.src;
      imgSrc = myImg;
      return myImg;
    });
    console.log('imgSrc ok');
    
    await browser.close();
    console.log('Browser close ok');
    console.log('src=', attachementSrc);
    return res.status(201).json(attachementSrc);;
  },
};





const scrapGg = async (urlGag) => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.emulate(iPad);
  const delay = (ms) => new Promise((res) => setTimeout(res, ms));
  await page.goto(urlGag);
  await delay(3500);

  const imageSrc = await page.evaluate(() => {
    //let buttonCookies = document.querySelector(".css-1k47zha");
    //buttonCookies.click();
    let myImg = document.querySelector("div.image-post picture img")?.src;
    imgSrc = myImg;
    return myImg;
  });
  const imgPage = await browser.newPage();
  await imgPage.emulate(iPad);
  await imgPage.goto(imageSrc);
  await imgPage.screenshot({
    path: "../images/screen.png",
  });
  console.log("imgSrc=", imageSrc);
  await browser.close();
  return imageSrc;
};

