
app.get("/", function(req, res) {
    service.emit("GetCats")
        .on("CatNumbers", function (catNumbers) {
            res.send(catNumbers);
        })
        .on("NoCatsFound", function () {
            res.send("Unfortunately, we no cats have! :/");
        })
        .onTimeout(3000, function () {
            res.send("Didn't get response in 3 seconds");
        })
})

service.on("GetCats", function (event) {
    event.body;
    event.name;
    event.service;
    event.correlationId;
    event.parentId;

    event.throw("NoCatsError", "No cats found!");
    event.emit("CatNumbers", 15)
})


"CORRELATIONID.EVENT_NAME";
"*.EVENT_NAME"


function getCats(){
    var deferred = Q.defer();
    service.emit("GetCats").on("CatNumbers", (ev) => deferred.resolve(ev.body));
    return deferred.promise;
}


var edalib = require("edalib");

edalib("New service", function (service) {
    service.on();
})


var service = require("esticade")("CatService");

service.on();



