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

const filmPosition = async (req, res)=>{
	const sqlReq = "SELECT * FROM position";
	conn = await mysql.createConnection(dbConfmarkusp);
	const [result] = await conn.execute(sqlReq);
	if(conn) {
			await conn.end()};
	res.render("ametinimetused", {positionList: result})
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

const filmPositionAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO `position` (position_name, description) VALUES (?,?)";
	if(!req.body.positionDescriptionInput || !req.body.jobTitle){
		res.render("ametinimetused_add", {notice: "Andmed on vigased!"});
		return;
	}
		try {
			conn = await mysql.createConnection(dbConfmarkusp);
			console.log("Andmebaasi �hendus loodud!");
			const [result] = await conn.execute(sqlReq, [req.body.jobTitle, req.body.positionDescriptionInput]);
			console.log("Salvestati kirje id: " + result.insertID);
			res.render("ametinimetused_add", {notice: "Andmed edukalt salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("ametinimetused_add", {notice: "Tekkis tehniline viga: "});
		}
		finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
	}
};

const eestifilmAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO `movie` (title, production_year, duration, description) VALUES (?,?,?,?)";
	if(!req.body.titleInput || !req.body.productionYearInput || !req.body.durationInput || req.body.descriptionInput){
		res.render("eestifilm_add", {notice: "Andmed on vigased!"});
		return;
	}
		try {
			conn = await mysql.createConnection(dbConfmarkusp);
			console.log("Andmebaasi �hendus loodud!");
			const [result] = await conn.execute(sqlReq, [req.body.titleInput, req.body.productionYearInput, req.body.durationInput, req.body.descriptionInput]);
			console.log("Salvestati kirje id: " + result.insertID);
			res.render("eestifilm_add", {notice: "Andmed edukalt salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("eestifilm_add", {notice: "Tekkis tehniline viga: "});
		}
		finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
		}
	
};

const eestifilmAdd = (req, res)=>{
    res.render("eestifilm_add", {notice: "Ootan sisestust"});
};

const seosedAdd = async (req, res)=>{
	let conn;
	const personReq = "SELECT * FROM `person`";
	const movieReq = "SELECT * FROM `movie`";
	const positionReq = "SELECT * FROM `position`";
	try {
			conn = await mysql.createConnection(dbConfmarkusp);
			console.log("Andmebaasi �hendus loodud!");
			const [personresult] = await conn.execute(personReq);
			const [movieresult] = await conn.execute(movieReq);
			const [positionresult] = await conn.execute(positionReq);
			console.log(personresult)
			res.render("seosed", {personList: personresult, movieList: movieresult, positionList: positionresult});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("seosed", {notice: "Tekkis tehniline viga: "});
		}
		finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
		}
}
const seosedAddPost = async (req, res)=>{
	let conn;
	let sqlReq = "INSERT INTO `person_movie_position` (person_id, movie_id, position_id) VALUES (?,?,?)";
	if(!req.body.personSelect || !req.body.movieSelect || !req.body.positionSelect){
		res.render("seosed", {notice: "Andmed on vigased!"});
		return;
	}
		try {
			conn = await mysql.createConnection(dbConfmarkusp);
			console.log("Andmebaasi �hendus loodud!");
			const [result] = await conn.execute(sqlReq, [req.body.personSelect, req.body.movieSelect, req.body.positionSelect]);
			console.log("Salvestati kirje id: " + result.insertID);
			res.render("eestifilm", {notice: "Andmed edukalt salvestatud!"});
		}
		catch(err) {
			console.log("Viga: " + err);
			res.render("eestifilm", {notice: "Tekkis tehniline viga: "});
		}
		finally {
			if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
	}
}

module.exports = {
	filmHomePage,
	filmPeople,
	filmPeopleAdd,
	filmPeopleAddPost,
	filmPosition,
	filmPositionAdd,
	filmPositionAddPost,
	eestifilmAdd,
	eestifilmAddPost,
	seosedAdd,
	seosedAddPost
};