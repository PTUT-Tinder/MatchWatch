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
    

    let random = Math.floor(Math.random() * evt.length);
    
    
    div.addClass("div");
    img.addClass("img");
    titre.addClass("h3");
    
    img.attr("src",evt[random]["poster"]);
    img.attr("data-id",evt[random]);
    titre.text(evt[random]["title"]);
                
    div.append(img);
    div.append(titre);
    
    
    $(".container-films").append(div);

    div.click(function(evt){
        $(this).toggleClass("select");
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