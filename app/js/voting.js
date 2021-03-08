import $ from "jquery";

$(document).ready(function(){

    let filmsSelect = [];
    let countclick = 5;

    $.getJSON("../json/movies.json", function(data){
        
        let nbRoll;

        for(let i=0;i<6;i++){
            createElements(data);

        }

        $(".reroll button").click(function(evt){
            countclick--;

            $(".select").each(function(){
                filmsSelect.push({
                    titre : $(this).children("h3").text(),
                    img : $(this).children("img").attr("src")
                });
            });

            console.log(filmsSelect);
            

            $(".div").remove();
            nbRoll = $(".select").length;
            console.log(nbRoll);


            if(countclick>0){
                for(let i=0;i<6;i++){
                
                    createElements(data);
    
                }
            }else{
                $(".div").remove();
                $(".reroll button").remove();
                getResult(data);
            }
            
        });

        

    });

    
function createElements(evt){
    let div = $("<div></div>");
    let titre = $("<h3></h3>");
    let img = $("<img />");
    let button = $("<button></button>");
    let span = $("<span></span>");
    
    

    let random = Math.floor(Math.random() * evt.length);
    
    
    div.addClass("div");
    img.addClass("img");
    titre.addClass("h3");
    button.addClass("button");
    
    img.attr("src",evt[random]["poster"]);
    img.attr("data-id",evt[random]);
    titre.text(evt[random]["title"]);
    span.text("i");
           
    button.append(span);
    div.append(img);
    div.append(titre);
    div.append(button);
    
    $(".container-films").append(div);

    div.click(function(){
        $(this).toggleClass("select");
    });

    button.click(function(){
        let div2 = $("<div></div>");
        let p = $("<p></p>");
        $(this).toggleClass("button-select");

        if($(this).children(span).text() == "i"){
            $(this).children(span).text("X");
            p.text(evt[random]["overview"]);

            p.addClass("p");
            div2.addClass("div2");

            div2.append(p);
            div.append(div2);
            div.append($(this));
        }else{
            $(this).children(span).text("i");
            $(this).parent().children(".div2").remove();
        }
    });
}

function getResult(evt){
    let divPrincipale = $("<div></div>");
    let h1 = $("<h1></h1>");


    h1.text("Voici les films que vous avez sélectionnés !");
    divPrincipale.addClass("divPrincipale");

    console.log(filmsSelect.length);

    for(let y=0;y<filmsSelect.length;y++){

            
    let div = $("<div></div>");
    let titre = $("<h3></h3>");
    let img = $("<img />");

            div.addClass("div");
            img.addClass("img");
            titre.addClass("h3");

            let filmTitre = filmsSelect[y]["titre"];
            let filmPoster = filmsSelect[y]["img"];
    
            img.attr("src",filmPoster);
            titre.text(filmTitre);
                
            div.append(img);
            div.append(titre);

            divPrincipale.append(div);

    }

    divPrincipale.prepend(h1);
    $(".container-films").prepend(divPrincipale);
}

});