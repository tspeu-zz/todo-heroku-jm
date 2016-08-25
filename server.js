var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var mongodb = require('mongodb'),
	mongoClient = mongodb.MongoClient,
	ObjectID = mongodb.ObjectID, // Used in API endpoints
	db; // We'll initialize connection below

app.use(bodyParser.json());
app.set('port', process.env.PORT || 8080);
app.use(cors()); // CORS (Cross-Origin Resource Sharing) headers to support Cross-site HTTP requests
app.use(express.static("www")); // Our Ionic app build is in the www folder (kept up-to-date by the Ionic CLI using 'ionic serve')


var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://heroku_jz5zgj2w:rqefbaeu2pc5lavhjipp1d9mno@ds017165.mlab.com:17165/heroku_jz5zgj2w';
//var MONGODB_URI = process.env.MONGODB_URI; mongodb://heroku_jz5zgj2w:rqefbaeu2pc5lavhjipp1d9mno@ds017165.mlab.com:17165/heroku_jz5zgj2w
// Initialize database connection and then start the server.
mongoClient.connect(MONGODB_URI, function (err, database) {
	if (err) {
		process.exit(1);
	}

	db = database; // Our database object from mLab

	console.log("Database connection ready");

	// Initialize the app.
	app.listen(app.get('port'), function () {
		console.log("You're a wizard, Harry. I'm a what? Yes, a wizard, on port", app.get('port'));
	});
});

// Todo API Routes Will Go Below
app.get("/api/jobs", function (req, res) {
	db.collection("jobs").find({}).toArray(function (err, docs) {
		if (err) {
			handleError(res, err.message, "Failed to get jobs");
		} else {
			res.status(200).json(docs);
		}
	});
});

// POST: create a new todo
app.post("/api/jobs", function (req, res) {
	var newJob = {
		jobid: req.body.jobid,
		manager: req.body.manager,
		brand: req.body.brand,
		type: req.body.type,
		client: req.body.client,
		status: req.body.status,
		store: req.body.store,
		isComplete: false
	}

	db.collection("jobs").insertOne(newJob, function (err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to add jobs");
		} else {
			res.status(201).json(doc.ops[0]);
		}
	});
});


/*
 *  Endpoint "/api/todos/:id"
 */

// GET: retrieve a todo by id -- Note, not used on front-end
app.get("/api/jobs/:id", function (req, res) {
	db.collection("jobs").findOne({
		_id: new ObjectID(req.params.id)
	}, function (err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to get job by _id");
		} else {
			res.status(200).json(doc);
		}
	});
});

// PUT: update a todo by id
app.put("/api/jobs/:id", function (req, res) {
	var updateTodo = req.body;
	delete updateTodo._id;

	db.collection("jobs").updateOne({
		_id: new ObjectID(req.params.id)
	}, updateTodo, function (err, doc) {
		if (err) {
			handleError(res, err.message, "Failed to update jobs");
		} else {
			res.status(204).end();
		}
	});
});

// DELETE: delete a todo by id
app.delete("/api/jobs/:id", function (req, res) {
	db.collection("jobs").deleteOne({
		_id: new ObjectID(req.params.id)
	}, function (err, result) {
		if (err) {
			handleError(res, err.message, "Failed to delete jobs");
		} else {
			res.status(204).end();
		}
	});
});

// Error handler for the api
function handleError(res, reason, message, code) {
	console.log("API Error: " + reason);
	res.status(code || 500).json({
		"Error": message
	});
}