import $ from "jquery";

$(document).ready(function(){

    let filmsSelect = [];
    let countclick = 11;
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
      let genreSelect = [];
      let countdates=0;
      let dateSelect = [];
      let date = [
        "1970 and before",
        "1970 - 1980",
        "1980 - 1990",
        "1990 - 2000",
        "2000 - 2010",
        "2010 and after"
      ];

    $.getJSON("../json/movies.json", function(data){
        
        let nbRoll;

        for(let i=0;i<5;i++){
                createDates();            
        }

        $(".reroll button").click(function(evt){
            countclick--;

            $(".select").each(function(){
                if(countclick< 7){
                    filmsSelect.push({
                        titre : $(this).children("h3").text(),
                        img : $(this).children("img").attr("src")
                    });
                }else if(countclick<10){
                    genreSelect.push($(this).children().text());
                }else{
                    dateSelect.push($(this).children().text());
                    console.log(dateSelect);
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
                }else if(countclick<11){
                    createGenres(i);
                }else{
                    createDates();
                }
            }
            }else{
                $(".div").remove();
                $(".reroll button").remove();
                getResult(data);
            }
            
        });

        

    });

function createDates(evt){
    let div = $("<div></div>");
    let titre = $("<h3></h3>");

    div.addClass("div");
    titre.addClass("h3");

    div.append(titre);

    titre.text(date[countdates]);

    $(".container-films").append(div);

    div.click(function(){
        $(this).toggleClass("select");
    });

    countdates ++;
}

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
    let etoile = $("<img />");
    let button = $("<button></button>");
    let button2 = $("<button></button>");
    let span = $("<span></span>");
    
    let random = Math.floor(Math.random() * evt.length);
    console.log(evt[random].genres != null)
    for(let i=0;i<genreSelect.length;i++){
        if(evt[random].genres == null)
        {
            img.attr("src",evt[random]["poster"]);
                img.attr("data-id",evt[random]);
                titre.text(evt[random]["title"]);
            
        }else{
            while(!evt[random].genres.includes(genreSelect[i])){
                random = Math.floor(Math.random() * evt.length);
            };
            if(evt[random].genres.includes(genreSelect[i])){
                console.log(evt[random].genres);
                img.attr("src",evt[random]["poster"]);
                img.attr("data-id",evt[random]);
                titre.text(evt[random]["title"]);
            }
        }
        
    }
    
    div.addClass("div");
    img.addClass("img");
    titre.addClass("h3");
    button.addClass("button");
    button2.addClass("button2");

    span.text("i");
    etoile.attr("src", "../img/etoile.svg");
           
    button.append(span);
    button2.append(etoile);
    div.append(img);
    div.append(titre);
    div.append(button);
    div.append(button2);
    
    $(".container-films").append(div);

    div.click(function(){
        $(this).toggleClass("select");
    });

    button.click(function(){
        let div2 = $("<div></div>");
        let p = $("<p></p>");
        

        $(this).toggleClass("button-select");
        
        if($(this).parent().hasClass("select")){
            $(this).parent().removeClass("select");
        }else{
            $(this).parent().addClass("select");
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

    button2.click(function(){
        $(this).toggleClass("button-select");

        $(this).parent().toggleClass("watch-later");

        if($(this).parent().hasClass("select")){
            $(this).parent().removeClass("select");
        }else{
            $(this).parent().addClass("select");
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