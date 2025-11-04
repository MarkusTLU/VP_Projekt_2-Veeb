const mysql = require("mysql2/promise");
const dbInfo = require("../../../vp2025config");

const dbConfmarkusp = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for Estonian movie section.
//@route GET /eestifilm
//@access public


const filmHomePage = (req, res)=>{
    res.render("eestifilm")
};

//@desc Page for people involved in Estonian movie industry.
//@route GET /eestifilm/filmiinimesed
//@access public

const filmPeople = async (req, res)=>{
	let conn; 
	const sqlReq = "SELECT * FROM person";
	try {
		conn = await mysql.createConnection(dbConfmarkusp);
		console.log("Andmebaasi �hendus loodud!");
		const [rows, fields] = await conn.execute(sqlReq);
		res.render("filmiinimesed", {personList: rows});
	}
	catch(err) {
		console.log("Viga: " + err)
		res.render("filmiinimesed", {personList: []});
	}
	finally {
		if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
	}
};

//@desc Page for adding people involved in Estonian movie industry.
//@route GET /eestifilm/filmiinimesed_add
//@access public

const filmPeopleAdd = (req, res)=>{
    res.render("filmiinimesed_add", {notice: "Ootan sisestust"});
};

//@desc Page for submitting people involved in Estonian movie industry.
//@route POST /eestifilm/filmiinimesed_add
//@access public

const filmPeopleAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO `person` (first_name, last_name, born, deceased) VALUES (?,?,?,?)";
	if(!req.body.firstNameInput || !req.body.lastNameInput || !req.body.bornInput || req.body.bornInput > new Date()){
		res.render("filmiinimesed_add", {notice: "Andmed on vigased!"});
		return;
	}
		try {
			conn = await mysql.createConnection(dbConfmarkusp);
			console.log("Andmebaasi �hendus loodud!");
			let deceasedDate = null;
			if(req.body.deceasedInput != ""){
				deceasedDate = req.body.deceasedInput;
			}
			const [result] = await conn.execute(sqlReq, [req.body.firstNameInput, req.body.lastNameInput, req.body.bornInput, deceasedDate]);
			console.log("Salvestati kirje id: " + result.insertID);
			res.render("filmiinimesed_add", {notice: "Andmed edukalt salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("filmiinimesed_add", {notice: "Tekkis tehniline viga: "});
		}
		finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
		}
	
};

//@desc Page for professions involved in movie industry.
//@route GET /eestifilm/ametinimetused
//@access public

const filmPosition = (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn.execute(sqlReq, (err, sqlRes)=>{
		if(err){
			console.log(err);
			res.render("ametinimetused", {positionList: []});
		}
		else {
			console.log(sqlRes);
			res.render("ametinimetused", {positionList: sqlRes});
		}
		
	});
};

//@desc Page for professions involved in movie industry.
//@route GET /eestifilm/ametinimetused_add
//@access public

const filmPositionAdd = (req, res)=>{
	res.render("ametinimetused_add", {notice: "Ootan sisestust!"});
};

//@desc Page for professions involved in movie industry.
//@route POST /eestifilm/ametinimetused_add
//@access public

const filmPositionAddPost = (req, res)=>{
	console.log(req.body);
	if(!req.body.positionNameInput){
		res.render("ametinimetused_add", {notice: "Palun kirjuta ameti nimetus!"});
	}
	else {
		let positionDescription = null;
		if(req.body.positionDescriptionInput != ""){
			positionDescription = req.body.positionDescriptionInput;
		}
		let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
		conn.execute(sqlReq, [req.body.positionNameInput, positionDescription], (err, sqlRes)=>{
			if(err){
				res.render("ametinimetused_add", {notice: "Tekkis tehniline viga:" + err});
			}
			else {
				res.redirect("/eestifilm/ametinimetused");
			}
		});
	}
};

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost
};