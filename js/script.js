
function loadData() {

    var $body = $('body');
    var $wikiElem = $('#wikipedia-links');
    var $nytHeaderElem = $('#nytimes-header');
    var $nytElem = $('#nytimes-articles');
    var $greeting = $('#greeting');

    // clear out old data before new request
    $wikiElem.text("");
    $nytElem.text("");

    // load streetview
    var city = $('#city').val()
    var street = $('#street').val()

    var str = '<img class="bgimg" src="http://maps.googleapis.com/maps/api/streetview?size=600x300&location=%s, %c">'
    var string = str.replace('%s',street)
    var stringg = string.replace('%c',city)

    //console.log(stringg)
    // YOUR CODE GOES HERE!
    $greeting.text('so you wanna live ' + street + ', ' + city + '?')
    $body.append(stringg);

    var url = "https://api.nytimes.com/svc/search/v2/articlesearch.json";
    url += '?' + $.param({
      'api-key': "992dabd260ab48fd98b52d6ee986d8a0",
      'q': city
    });

    $.getJSON(url,function(data){
        $nytHeaderElem.text('NYT articles about ' + city)

        var articles = data.response.docs.map(function (x){
            var str = '<li class="article">%s</li>'
            var obj = '<a href =' + `'` + x.web_url + `'>`+ x.headline.main+'</a>'
                    +'<p>' + x.snippet + '</p>'
            var strr = str.replace('%s',obj)
            return strr
        })
        $('#nytimes-articles').append(articles)
    }).fail(function(){
        $nytHeaderElem.text('NYT articles cannot be found')
    })

    var wikiRequestTimeout = setTimeout(function(){
        $wikiElem.text('API Call Failed');
    },5000)

    $.ajax({
        url: "https://en.wikipedia.org/w/api.php?action=opensearch&search="
        +city + '&format=json&callback=wikiCallback',
        dataType: 'jsonp',
        success: function(data){
            console.log(data)
            var links = [];
            for(var x = 0 ; x < 10; x++){
                var str = '<li><a href="'+ data[3][x] + '">' +
                data[1][x]+'</a></li>'
                links.push(str)
            }


            $('#wikipedia-links').append(links)
            clearTimeout(wikiRequestTimeout)
        }
    })

    return false;
};

$('#form-container').submit(loadData);
