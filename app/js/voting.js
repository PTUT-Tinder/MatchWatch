import $ from "jquery";

$(document).ready(function(){

    let filmsSelect = [];
    let countclick = 10;
    let genres = [
        'Action',
        'Comedy',
        'Fantasy',
        'Adventure',
        'Science Fiction',
        'Thriller',
        'Horror',
        'Animation',
        'Family',
        'Documentary',
        'Mystery',
        'Drama',
        'TV Movie',
        'Music',
        'Crime',
        'History',
        'Romance',
        'War',
        'Western',
        'No genre'
      ];
      let countgenre =0;
      let preSelectFilm = [];
      let genreSelect = [];

    $.getJSON("../json/movies.json", function(data){
        
        let nbRoll;

        for(let i=0;i<5;i++){
                createGenres(i);            
        }

        $(".reroll button").click(function(evt){
            countclick--;

            $(".select").each(function(){
                if(countclick< 7){
                    filmsSelect.push({
                        titre : $(this).children("h3").text(),
                        img : $(this).children("img").attr("src")
                    });
                }else{
                    genreSelect.push($(this).children().text());
                }
                
                
            });

            console.log(filmsSelect);
            console.log(genreSelect);
            

            $(".div").remove();
            nbRoll = $(".select").length;
            console.log(nbRoll);


            if(countclick>0){
                for(let i=0;i<5;i++){
                if(countclick< 7){
                    createElements(data);
                }else{
                    createGenres(i);
                }
            }
            }else{
                $(".div").remove();
                $(".reroll button").remove();
                getResult(data);
            }
            
        });

        

    });

function createGenres(evt){
    let div = $("<div></div>");
    let titre = $("<h3></h3>");

    div.addClass("div");
    titre.addClass("h3");

    div.append(titre);

        titre.text(genres[countgenre]);

    $(".container-films").append(div);

    div.click(function(){
        $(this).toggleClass("select");
    });
    countgenre ++;
}
    
function createElements(evt){
    let div = $("<div></div>");
    let titre = $("<h3></h3>");
    let img = $("<img />");
    let button = $("<button></button>");
    let span = $("<span></span>");
    
    let random = Math.floor(Math.random() * evt.length);
    
    for(let i=0;i<genreSelect.length;i++){
        if(evt[random].genres == null)
        {
            while(!evt[random].genres.includes(genreSelect[i])){
                random = Math.floor(Math.random() * evt.length);
            };
            if(evt[random].genres.includes(genreSelect[i])){
                console.log(evt[random].genres);
                img.attr("src",evt[random]["poster"]);
                img.attr("data-id",evt[random]);
                titre.text(evt[random]["title"]);
            }
        }else{
            console.log(evt[random].genres);
                img.attr("src",evt[random]["poster"]);
                img.attr("data-id",evt[random]);
                titre.text(evt[random]["title"]);
        }
        
    }
    
    div.addClass("div");
    img.addClass("img");
    titre.addClass("h3");
    button.addClass("button");
    
    
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
        
        if($(this).hasClass("select")){
            $(this).parent().addClass("select");
        }else{
            $(this).parent().removeClass("select");
        }

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

function match(e){
    let div = $("<div></div>");
    let img = $("<img/>");
    let h3 = $("<h3></h3>");

    let main = $("main");

    div.addClass("match");

    h3.text("It's a Match !");

    div.append(img);
    div.append(h3);

    main.prepend(div);
}

});