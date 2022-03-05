
const request =require('request')
const cheerio = require('cheerio')

const scorecardobj = require('./scoreCard')



function getAllMatchesLink(uri){
    request(uri,function(err,response,html){
        if(err){
            console.log(err)
        }
        else{
            extractAllLink(html)
        }
    })

}

function extractAllLink(html){
    let $ = cheerio.load(html)

    let scoreCrdArr = $('a[data-hover="Scorecard"]')

    for(let i= 0; i<scoreCrdArr.length;i++){
        let link = $(scoreCrdArr[i]).attr('href')
        let fulllink = 'https://www.espncricinfo.com'+link
        
        scorecardobj.ps(fulllink)
    
        
           


    }
}

module.exports ={
    getAllMatch :getAllMatchesLink
}