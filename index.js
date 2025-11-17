const express = require("express");
const fs = require("fs");
const bodyParser = require("body-parser");
const dateEt = require("./src/dateTimeET");
const textRef = "public/txt/vanasonad.txt";
const visitRef = "public/txt/visitlog.txt";
const app = express();
const mysql = require("mysql2/promise");
const dbInfo = require("../../vp2025config");

const dbConfmarkusp = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

app.set("view engine", "ejs");
app.use(express.static("public"));
//kui vormist tuleb vaid tekst, siis false, kui muud ka, siis true
app.use(bodyParser.urlencoded({extended: true}));

app.get("/", async (req, res)=>{
	let conn;
	const sqlReq = "SELECT filename, alttext FROM galleryphotos WHERE id=(SELECT MAX(id) FROM galleryphotos WHERE privacy=? AND deleted IS NULL)";
	try {
		conn = await mysql.createConnection(dbConfmarkusp);
		console.log("Andmebaasi �hendus loodud!");
		const [result] = await conn.execute(sqlReq, [3]);
		if(result.length == 0){
			res.render("index", {pilt_avalehel: "", pildi_tekst: "Pilti ei ole veel lisatud."})
		}
		else {
			const filepath = "/gallery/normal/" + result[0].filename
			res.render("index", {pilt_avalehel: filepath, pildi_tekst: result[0].alttext})
		}
	}
	catch(err) {
		console.log("Viga: " + err);
	}
	finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
	}
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

//Fotogalerii marsruudid
const photogalleryRoutes = require("./routes/photogalleryRoutes");
app.use("/photogallery", photogalleryRoutes);

//Uudiste marsruudid
const uudisedRoutes = require("./routes/uudisedRoutes");
app.use("/uudised", uudisedRoutes);


app.listen(5306);
