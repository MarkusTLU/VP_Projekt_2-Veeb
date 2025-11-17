const mysql = require("mysql2/promise");
const fs = require("fs").promises;
const dbInfo = require("../../../vp2025config");

const dbConfmarkusp = {
	host: dbInfo.configData.host,
	user: dbInfo.configData.user,
	password: dbInfo.configData.passWord,
	database: dbInfo.configData.dataBase
};

//@desc Home page for news.
//@route GET /uudised
//@access public


const uudisedHomePage = (req, res)=>{
    res.render("uudised")
};

//@desc Home page for news
//@route GET /uudised
//@access public

const uudisedAll = async (req, res)=>{
	let conn;
	try {
		conn= await mysql.createConnection(dbConfmarkusp);
		let sqlReq = "SELECT news_title, news_content, news_photo, news_photo_alt, added FROM news WHERE expire > ?";
		const currentDate = new Date();
		const [rows, fields] = await conn.execute(sqlReq, [currentDate]);
		console.log(rows);
		console.log(fields)
		let newsData = [];
		for (let i = 0; i < rows.length; i ++) {
			let altText = "Uudisepilt";
			if (rows[i].altText !=""){
				altText = rows[i].news_photo_alt;
			}
			newsData.push({data: rows [i], src: rows [i].news_photo, alt: altText});
		}
		res.render("uudised_all", {newsData: newsData, imagehref: "/gallery/news/"});
	}
	catch(err){
		console.log(err);
		res.render("uudised_all", {newsData: [], imagehref: "/gallery/news/"});
	}
	finally {
		if(conn){
			await conn.end();
			console.log("Andmebaasi ühendus suletud!");
		}
	}

}

const uudisedAdd = (req, res)=>{
    res.render("uudised_add", {notice: "Ootan sisestust"});
};

const uudisedAddPost = async (req, res)=>{
	console.log("string")
	console.log(req.file)
	let conn;
	let sqlReq = "INSERT INTO `news` (news_title, news_content, news_photo, news_photo_alt, expire, userid) VALUES (?,?,?,?,?,?)";
	if(!req.body.newsTitle || !req.body.newsSubmit || !req.body.expiredInput || !req.body.userId){
		res.render("uudised_add", {notice: "Andmed on vigased!"});
		return;
	}
	try {
		const fileName = "vp_" + Date.now() + ".jpg";
		console.log(fileName)
		await fs.rename(req.file.path, req.file.destination + fileName);
		
		//loon normaalmöödus foto (800x600)
		await sharp(req.file.destination + fileName).composite([{ input:"./public/gallery/watermark/vp_logo_small.png", gravity: 'southeast' }]).resize(800,600).jpeg({quality: 90}).toFile("./public/gallery/news/" + fileName);
		conn = await mysql.createConnection(dbConfmarkusp);
		console.log("Andmebaasi �hendus loodud!");
		const [result] = await conn.execute(sqlReq, [req.body.newsTitle, req.body.newsSubmit, req.body.photoInput, req.body.altInput, req.body.expiredInput, req.body.userId]);
		console.log("Salvestati kirje id: " + result.insertID);
		res.render("uudised_add", {notice: "Andmed edukalt salvestatud!"});
	}
	catch(err) {
		console.log("Viga: " + err);
		res.render("uudised_add", {notice: "Tekkis tehniline viga: "});
	}
	finally {
		if(conn) {
			await conn.end();
			console.log("Andmebaasi �hendus suletud!");
		}
	}
	
};

module.exports = {
	uudisedAll,
	uudisedHomePage,
	uudisedAdd,
	uudisedAddPost
};