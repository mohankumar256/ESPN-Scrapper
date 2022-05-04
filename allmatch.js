const request =require("request");
const cheerio=require("cheerio");
const matchInfo=require("./scoreCard")


function getallmatch(url){
    // console.log("from all match.js"+"   "+  url);
    request(url,cb);

}

function cb(err , res ,html){
    if(err){
        console.log(err);
    }else{
        extractscorelinkhtml(html);
    }
}

function extractscorelinkhtml(html){
        let selecTool=cheerio.load(html);
        let  scorecardlink=selecTool('a[data-hover="Scorecard"]')
        // console.log(scorecardlink.length);
        for(let i=0 ;i<scorecardlink.length ;i++){
            let allmatchlink=selecTool(scorecardlink[i]).attr("href")
            // console.log(allmatchlink);
            let fulllink="https://www.espncricinfo.com"+allmatchlink
            // console.log(fulllink);
            matchInfo.getInfofromMatch(fulllink)
            // break;
        }


        
}



module.exports={
    'getallmatch':getallmatch
}