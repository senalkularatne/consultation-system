var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    methodOverride  = require("method-override"),
    User            = require("./models/user"),
    Doctor          = require("./models/doctor"),
    Discussion      = require("./models/discussion"),
    Appointment     = require("./models/appointment"),
    Comment         = require("./models/comment"),
    Reply           = require("./models/reply"),
    seedDB          = require("./seeds"),
    flash           = require("connect-flash");
    // multer          = require('multer'),
    // upload          = multer({limits: {fileSize: 2000000 },dest:'/uploads/'});

//REQUIRING ROUTES
var commentRoute         = require("./routes/comments"),
    replyRoute           = require("./routes/reply"),
    discussionsRoute     = require("./routes/discussions"),
    appointmentRoute     = require("./routes/appointment"),
    indexRoute           = require("./routes/index"),
    patientRoute         = require("./routes/patients"),
    adminRoute           = require("./routes/admins"),
    doctorRoute          = require("./routes/doctors");
    
mongoose.connect("mongodb://localhost/online_consult_system",{useMongoClient: true});
app.use(bodyParser.urlencoded({extended: true}));
mongoose.Promise = global.Promise; 
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
app.locals.moment = require('moment');
//seedDB();

//passport config
app.use(require("express-session")({
    secret: "John wick is amazing",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use(function(req, res, next){
    //pass req.user to every template 
    res.locals.currentUser = req.user;
    res.locals.currentDoctor= req.doctor;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();//to ensure that it doesnt stop and moves on to the next
}); //own middleware for req.user

app.use("/", indexRoute);
app.use("/discussions",discussionsRoute);
app.use("/appointment",appointmentRoute);
app.use("/discussions/:id/comments",commentRoute);
app.use("/appointment/:id/reply",replyRoute);
app.use("/patients", patientRoute);
app.use("/admins", adminRoute);
app.use("/doctors", doctorRoute);

app.listen(3000, function() {
   console.log("OSC Server Started-------------") ;
});