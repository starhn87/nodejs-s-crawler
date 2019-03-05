var client = require('cheerio-httpcli');
var fs = require('fs');

let url = "https://ridibooks.com/category/books/100?page=";
let base_url="https://ridibooks.com";

var dataArr=[];
var path='output.json';

for(var num=1;num<=3;num++){
    client.fetch(url+num, {}, function(err,$,res){
        var list = $(".book_macro_110");
        list.each(async function(){
            var arr=[];
            for(var i=0;i<$(this).find('.js_author_detail_link').length;i++){
                arr.push($(this).find('.js_author_detail_link').eq(i).text());
            }

            if($(this).find(".price .museo_sans").length > 1){
                var pr = {
                    "대여": removeComma($(this).find(".price .museo_sans").eq(0).text()),
                    "구매": removeComma($(this).find(".price .museo_sans").eq(1).text())
                }
            }
            else
                var pr = removeComma($(this).find(".price .museo_sans").text());

            var data={
                id: $(this).find(".book_thumbnail_wrapper").attr('data-book_id_for_tracking'),
                url: base_url+$(this).find(".thumbnail_btn").attr('href'),
                title: $(this).find(".title_text").text().trim(),
                writers: arr,
                price: pr,
            }

            dataArr.push(data);
            fs.writeFile(path, JSON.stringify(dataArr,null,4), function(err, result){
                if(err) throw err;
            });
        })
            
    });
}

function removeComma(str){

	n = parseInt(str.replace(/,/g,""));

	return n;

}
