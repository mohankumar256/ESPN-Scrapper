const request = require("request");
const cheerio = require("cheerio");
const fs=require("fs")
const path=require("path")
const xlsx=require("xlsx")



function getInfofromMatch(url) {
    // console.log("from all scorecarc.js"+"   "+  url);
    request(url, cb);

}

function cb(err, res, html) {
    if (err) {
        console.log(err);
    } else {
        matchdetail(html);
    }
}

function matchdetail(html) {
    let selecTool = cheerio.load(html)
    // load html of all match
    // console.log(selecTool.text());
    let descArray = selecTool(".match-header-info.match-info-MATCH")

    // task1 : venue and date of the match  

    // console.log(descArray.text());
    let desc = (descArray.text().split(","));
    // console.log(desc);
    let dateofMatch = desc[2];
    let placeOfthematch = desc[1]
    console.log(dateofMatch);
    console.log(placeOfthematch);

    // task 2:- teams name
    let teamNamearray = selecTool(".name-detail>.name-link")

    let team1 = selecTool(teamNamearray[0]).text()
    let team2 = selecTool(teamNamearray[1]).text()
    console.log(team1);
    console.log(team2);


    // task 3 :- result of match who is win or loss
    let resultofMatch = selecTool(".match-info.match-info-MATCH.match-info-MATCH-half-width>.status-text")
    let matchResult=(resultofMatch.text());
    // console.log(resultofMatch.text());
    console.log(matchResult);

    // task 5  team detail
    let allbatsmanRun = selecTool(".table.batsman>tbody")
    // console.table(allbatsmanRun.html());
    // console.log(allbatsmanRun.length);
    let htmlString = "";

    for (let i = 0; i < allbatsmanRun.length; i++) {
        htmlString += selecTool(allbatsmanRun[i]).html();

        let allRows = selecTool(allbatsmanRun[i]).find("tr");
        for (let i = 0; i < allRows.length; i++) {

            let row = selecTool(allRows[i]);
            let firstColmnOfRow = row.find("td")[0];
            if (selecTool(firstColmnOfRow).hasClass("batsman-cell")) {

                let playerName = selecTool(row.find("td")[0]).text().trim();
                // console.log(playerName);
                let runs = selecTool(row.find("td")[2]).text();
                let balls = selecTool(row.find("td")[3]).text();
                let numberOf4 = selecTool(row.find("td")[5]).text();
                let numberOf6 = selecTool(row.find("td")[6]).text();
                let sr = selecTool(row.find("td")[7]).text();

                // console.log(playerName);
                // console.log(runs);
                // console.log(`${playerName} | ${runs}`);

                console.log(
                    `playerName -> ${playerName} runsScored ->  ${runs} ballsPlayed ->  ${balls} numbOfFours -> ${numberOf4} numbOfSixes -> ${numberOf6}  strikeRate-> ${sr}`
                );
                // let iplteamPath=path.join(__dirname,"ipl",team1)
                // if(!fs.existsSync(iplteamPath)){
                //     fs.mkdirSync(iplteamPath)
                // }else{
                //     // console.log("already exist");
                // }
                processInformation(dateofMatch,placeOfthematch,matchResult,team1,team2,playerName,runs,balls,numberOf4,numberOf6,sr);
            }


        }
        // console.log(allRows.length);


        function processInformation(dateofMatch,placeOfthematch,matchResult,team1,team2,playerName,runs,balls,numberOf4,numberOf6,sr){
            let iplteamPath=path.join(__dirname,"ipl",team1)
                if(!fs.existsSync(iplteamPath)){
                    fs.mkdirSync(iplteamPath)
                }
            let playerpath=path.join(iplteamPath,playerName+".xlsx")
            let content=excelReader(playerpath,playerName)

            let playerObj={
                dateofMatch,
                placeOfthematch,
                matchResult,
                team1,
                team2,
                playerName,
                runs,
                balls,
                numberOf4,
                numberOf6,
                sr
            };
            
            content.push(playerObj)
            excelWriter(playerpath,content,playerName);


        }


    }
    function excelReader(playerpath,sheetName){
        if(!fs.existsSync(playerpath)){
            return [];
        }
        let workBook=xlsx.readFile(playerpath)
        let exceldata=workBook.Sheets[sheetName]
        let playerObj=xlsx.utils.sheet_to_json(exceldata)
        return playerObj;
    }
    // console.log(htmlString);
}

function excelWriter(playerpath,Jsondata,sheetName){
    // create a new sheetName
    let newworkbook=xlsx.utils.book_new();
    // Converts an array of JS objects to a worksheet.
    let newworksheet=xlsx.utils.json_to_sheet(Jsondata);
    // it  Appends a worksheet to a workbook
    xlsx.utils.book_append_sheet(newworkbook,newworksheet,sheetName)
    xlsx.writeFile(newworkbook,playerpath)
    

}


module.exports = {
    getInfofromMatch: getInfofromMatch,

}