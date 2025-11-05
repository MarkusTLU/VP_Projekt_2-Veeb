const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const dateEt = require("./src/dateTimeET");
const textRef = "public/txt/vanasonad.txt";
const visitRef = "public/txt/visitlog.txt";
const app = express();
app.set("view engine", "ejs");
app.use(express.static("public"));
//kui vormist tuleb vaid tekst, siis false, kui muud ka, siis true
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", (req, res)=>{
    res.render("index")
});

app.get("/timenow", (req, res)=>{
    res.render("timenow", {wd: dateEt.weekDay(), date: dateEt.longDate()})
});

app.get("/vanasonad", (req, res)=>{
    fs.readFile(textRef, "utf8", (err, data)=>{
        if(err){
            res.render("genericlist", {h2: "Vanasonad", listData: ["Vabandame ühtki vanasõna ei leitud"]});
        }
        else{
            res.render("genericlist", {h2: "Vanasonad", listData: data.split(";")});
        }
    });
});
app.get("/regvisit", (req, res)=>{
    res.render("regvisit")
});

app.post("/regvisit", (req, res)=>{
    console.log(req.body);
	fs.open("public/txt/visitlog.txt", "a", (err, file)=>{
		if(err){
			throw(err);
		}
		else {
			var nimi = req.body.firstNameInput + " " + req.body.lastNameInput + ", " + dateEt.longDate() + " " + dateEt.time() +";"
			fs.appendFile("public/txt/visitlog.txt", nimi, (err)=>{
				if(err){
					throw(err);
				}
				else {
					console.log("Salvestatud!");
					res.render("confirmation", {firstName: req.body.firstNameInput, lastName: req.body.lastNameInput});
				}
			});
		}
	});
});
app.get("/visitlog", (req, res)=>{
	fs.readFile(visitRef, "utf8", (err, data)=>{
		res.render("visitlog", {h2: "visitlog", listData: data.split(";")});
})});


//Eesti filmi marsruudid
const eestifilmRouter = require("./routes/eestifilmRoutes");
app.use("/eestifilm", eestifilmRouter);


//Galeriipildi üleslaadimise marsruudid
const galleryphotouploadRoutes = require("./routes/galleryphotouploadRoutes");
app.use("/galleryphotoupload", galleryphotouploadRoutes);


app.listen(5306);
