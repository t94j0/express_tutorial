var express = require(),
    app = express();

app.get("/", function(req, res){
	res.send(200);
});

app.listen(8080);
