let url="https://www.espncricinfo.com/series/ipl-2020-21-1210595"
const request =require("request");
const cheerio=require("cheerio");
const fs=require("fs")
const path=require("path")
let allmatchObj=require("./allmatch")

request(url,cb);

function cb(err , res ,html){
    if(err){
        console.log(err);
    }else{
        handlehtml(html);
    }
}



    let iplpath=path.join(__dirname,"ipl")
    if(!fs.existsSync(iplpath)){
        fs.mkdirSync(iplpath)
    }else{
        console.log("folder exist");
    }
    // console.log(iplpath);
    


// /series/ipl-2020-21-1210595/match-results'
function handlehtml(html){
        let selecTool=cheerio.load(html)
        // console.log(allhtml);
        let anchorelem=selecTool('a[data-hover="View All Results"]');
        // console.log(anchorelem);

        let relativelink=anchorelem.attr("href")
        // console.log(relativelink);
        let fullpath="https://www.espncricinfo.com/"+relativelink;
        // console.log(fullpath);
        allmatchObj.getallmatch(fullpath)
        
        
    
}