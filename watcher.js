var {exec} = require("child_process")


var handler = function(err, stdout, stderr){
	if(err){
		console.log("command failed")
	}
	console.log(stdout)
	console.log(stderr)
}


exec("pug -w . -o . -P", handler)
exec("stylus -w . --out .", handler)


