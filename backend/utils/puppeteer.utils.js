const { text } = require("body-parser");
const puppeteer = require("puppeteer");
const iPad = puppeteer.devices["iPad Pro 11"];

module.exports = {
  scrapGag: async function (req, res) {
    const urlGagId = req.params.gagLink;
    const urlGag = `https://9gag.com/gag/${urlGagId}`;
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    console.log('Browser ok');
    await page.emulate(iPad);
    await page.goto(urlGag);
    console.log('Page ok');
    

    const attachementSrc = await page.evaluate(() => {
      let myImg = document.querySelector("div.post-container > div > a > div.post-view > picture > img")?.src;
      let myGif = document.querySelectorAll("div.post-container > div > a > div.post-view > video > source")[0]?.src;   //probleme sur quelques video/gif 
      
      if(myImg){
        return myImg;
      }else{
        return myGif;
      }
    });

    console.log('imgSrc ok');
    
    await browser.close();
    console.log('Browser close ok');
    console.log('src=', attachementSrc);
    return res.status(201).json(attachementSrc);;
  },
};



