// const url =
//  'https://www.espncricinfo.com//series/ipl-2020-21-1210595/mumbai-indians-vs-chennai-super-kings-1st-match-1216492/full-scorecard'
const request = require('request')
const cheerio = require('cheerio')
const path = require('path')
const fs = require('fs')

const xlsx  =require('xlsx')

function processScoreCard(url) {
    request(url, cb)
}


// as per as  request  module we need three parameter 
function cb(err, response, html) {
    if (err) {
        console.log(err)
    }
    else {
        ectractMatchDetails(html)
    }
}

function ectractMatchDetails(html) {
    let $ = cheerio.load(html)

    let descString = $('.header-info .description')

    let descStringArr = descString.text().split(',');
    let venue = descStringArr[1].trim()
    let date = descStringArr[2].trim()
    let result = $('.match-info.match-info-MATCH.match-info-MATCH-half-width .status-text').text()
    console.log(venue)
    console.log(date)
    console.log(result)

    let innings = $('.card.content-block.match-scorecard-table .Collapsible')

    let htmlString = ''

    for (let i = 0; i < innings.length; i++) {
        htmlString += $(innings[i]).html()
        let teamName = $(innings[i]).find('h5').text()
        teamName = teamName.split('INNINGS')[0].trim()
        let opponentIndex = i == 0 ? 1 : 0
        let opponentName = $(innings[opponentIndex]).find('h5').text();
        opponentName = opponentName.split('INNINGS')[0].trim()

        let cInning = $(innings[i]);

        let allRows = cInning.find('.table.batsman tbody tr')


        for (let j = 0; j < allRows.length; j++) {
            let allCols = $(allRows[j]).find("td");
            let isWorthy = $(allCols[0]).hasClass("batsman-cell");

            if (isWorthy == true) {
                let playerName = $(allCols[0]).text().trim();

                let runs = $(allCols[2]).text().trim();
                let balls = $(allCols[3]).text().trim();
                let fours = $(allCols[5]).text().trim();
                let sixes = $(allCols[6]).text().trim();
                let STR = $(allCols[7]).text().trim();


                console.log(`${playerName} | ${runs} |${balls} | ${fours} | ${sixes} | ${STR}`);
                // Templet Literal 

                processPlayer(teamName, opponentName, playerName, runs, fours, sixes, STR, venue, date, result)
            }

        }


        console.log('--------------------------------------------------------------------------------------------------------')
    }



}

function processPlayer(teamName, opponentName, playerName, runs, fours, sixes, STR, venue, date, result) {
    let teamPath = path.join(__dirname, "IPL", teamName)
    dirCreator(teamPath)
let filePath =path.join(teamPath,playerName+ '.xlsx')

let content = excelReader(filePath,playerName);

let playerObj = {
    playerName,
    teamName,
    opponentName,
    runs,
    fours,
    sixes,
    STR,
    venue,
    date,
    result,
  };
  content.push(playerObj)

excelWriter(filePath,playerName,content)

}
function dirCreator(filePath) {
    if (fs.existsSync(filePath) == false) {
        fs.mkdirSync(filePath)
    }
}

function excelWriter(filename,sheetName,jsonData){

    let newWB = xlsx.utils.book_new();
// Creating a new WorkBook
let newWS = xlsx.utils.json_to_sheet(jsonData);
// Json is converted to sheet format (rows and cols)
xlsx.utils.book_append_sheet(newWB, newWS, sheetName);

xlsx.writeFile(newWB, filename);

}

function excelReader(filename,sheetName){
    if(fs.existsSync(filename)==false){
        return []
    }
    let wb = xlsx.readFile(filename);

let excelData = wb.Sheets[sheetName];
let ans = xlsx.utils.sheet_to_json(excelData);
  return ans
}


module.exports = {
    ps: processScoreCard
}