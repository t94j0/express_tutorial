/*
	If you are reviewing code, start at server.js then come here.
	Please take a second on each of the pages to read the comments, they are important.

	The main thing about the routes page is that each time you render a new page,
	it must have a users object passed into the route, because the navbar relies on the user object

	Normally when adding a new route, you will use 
	if(req.isAuthenticated())
		res.render('name_of_file', {user:req.user});
	else
		res.render('name_of_file', {user:null});

	I'd like to get away from this somehow, but it will probably not happen
	 unless I can find a good way to do it without breaking everything
*/



var fs = require('fs');
//This takes all the files in this folder and makes them available to the routes.
module.exports = function(app, passport) {
    fs.readdirSync(__dirname).forEach(function(file) {
    	//This just makes sure that the files have .js and isn't index.js
        if (file === "index.js" || file.substr(file.lastIndexOf('.') + 1) !== 'js')
            return;
        var name = file.substr(0, file.indexOf('.'));
        //Make sure that each file in this folder has a header for app and passport.
        //Example: module.exports = function(app, passport) {};
        require('./' + name)(app, passport);
    });
}
