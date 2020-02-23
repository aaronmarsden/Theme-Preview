var express = require("express"), 
    app = express(),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose");
    passport = require("passport");
    LocalStrategy = require("passport-local");
    User = require("./models/user");
    methodOverride = require("method-override");
    indexRoutes = require("./routes/index");
    Project = require("./models/project");
    Template = require("./models/template");
    multer = require("multer");
    path = require('path');
    storage = multer.diskStorage({
        destination: './public/uploads/', 
        filename: function(req, file, cb) {
            cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
        }
    });
    upload = multer({
        storage: storage
    });

mongoose.connect("mongodb://localhost:27017/wordpressThemePreview", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.json({limit: '900mb'}));
app.use(bodyParser.urlencoded({extended: true, parameterLimit:50000000}));
app.use(express.static(__dirname + "/public"));
app.use(express.static(__dirname + "/views"));
app.use(methodOverride("_method"));

app.use(require("express-session")({
    secret: "Something",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    next();
});

app.use("/", indexRoutes);

app.get("/:userid/projects", isLoggedIn, function(req, res) {
    User.findById(req.user._id, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            Template.find({}, function(err, foundTemplates) {
                if (err) {
                    console.log(err);
                } else {
                    res.render("projects.ejs", {user: user, templates: foundTemplates});
                }
            })
        }
    })
});


app.post("/:userid/projects", upload.single('projectLogo'), function(req, res) {
    User.findById(req.params.userid, function(err, user) {
        if (err) {
            console.log(err);
        } else {
            // May break if I move to AWS and they're on Linux
            let fileUrl = req.file.path.replace(/\\/g, "/").substring("public".length);
            Template.find({name: req.body.template}, function(err, foundTemplate) {
                if (err) {
                    console.log(err);
                } else {
                    // If bugs appear with finding templates, look here. I don't think it will cause bugs if the templates all have diff. name sbut who knows
                    Project.create({
                        name: req.body.project.name,
                        logo: fileUrl,
                        colorOne: req.body.project.colorOne,
                        colorTwo: req.body.project.colorTwo,
                        colorThree: req.body.project.colorThree,
                        template: foundTemplate[0].name,
                        body: foundTemplate[0].body
                    }, function(err, createdProject) {
                        if (err) {
                            console.log(err);
                        } else {
                            console.log(createdProject);
                            user.projects.push(createdProject);
                            user.save();
                            res.redirect("/" + user._id + "/projects/" + createdProject._id + "/edit");
                        }
                    })
                }
            })
        }
    })
});

app.get("/:userid/projects/:projectid/edit", function(req, res) {
    User.findById(req.params.userid, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            Project.findById(req.params.projectid, function(err, foundProject) {
                if (err) {
                    console.log(err);
                } else {
                    Template.find({name: foundProject.template}, function(err, foundTemplate) {
                        if (err) {
                            console.log(err);
                        } else {
                            res.render("editor.ejs", {user: foundUser, project: foundProject, template: foundTemplate});
                        }
                    })
                }
            })
        }
    });
});

app.get("/templates/new", function(req, res) {
    res.render("createtemplate.ejs");
});

app.post("/templates", upload.single('previewImage'), function(req, res) {
    let fileUrl = req.file.path.replace(/\\/g, "/").substring("public".length);
    Template.create({
        name: req.body.name,
        description: req.body.description,
        previewImage: fileUrl,
        body: req.body.body
    }, function(err, createdTemplate) {
        if (err) {
            console.log(err);
        } else {
            console.log(createdTemplate);
            res.redirect("/templates/new");
        }
    })
});

app.get("/editor", isLoggedIn, function(req, res) {
    res.render("editor.ejs");
});

// May need to make this a "PUT" request in the future.

app.put("/saveproject", function(req, res) {
    Project.findByIdAndUpdate(req.body.project._id, {body: req.body.htmlToSave}, function(err, updatedProject) {
        if (err) {
            console.log(err);
        } else {
            console.log("success");
        }
    })
});

app.post("/api/5de3fe3ee6d91e11e0dd06c8/imageUpload", upload.fields([{name: "logoImage"}, {name: "backgroundImage"}]), function(req, res) {
    req.files.logoImage ? req.files.logoImage[0].path = req.files.logoImage[0].path.replace(/\\/g, "/").substring("public".length) : null;
    req.files.backgroundImage ? req.files.backgroundImage[0].path = req.files.backgroundImage[0].path.replace(/\\/g, "/").substring("public".length) : null;
    console.log(req.files);
    res.status(200).send({files: req.files});
});

app.get("/createnewtemplate", isLoggedIn, function(req, res) {
    User.find(req.user._id, function(err, foundUser) {
        if (err) {
            console.log(err);
        } else {
            res.render("templateOne.ejs", {user: foundUser});
        }
    })
}); 

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        next();
    } else {
        res.redirect("/login");
    }
}

app.listen(process.env.PORT || 3000, function(){
    console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});