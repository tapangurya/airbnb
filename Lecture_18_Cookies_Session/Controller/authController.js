console.log("I am Auth controller called controller");

exports.getLogin = (req, resp, next) => {
  resp.render("Auth/login", {
    title: "airbnb-login",
    currentPage: "login",
    isLoggedIn:false,
  });
};

exports.postLogin = (req, resp, next) => {
  const { email, password } = req.body;
  resp.cookie('isLoggedIn',true);
  resp.redirect('/');
};

exports.postLogout = (req, resp, next) => {
  const { email, password } = req.body;
  resp.cookie('isLoggedIn',false);
  resp.redirect('/');
};

exports.getRegister = (req, resp, next) => {
  resp.render("Auth/register", {
    title: "airbnb-register",
    currentPage: "register",
     isLoggedIn:req.isLoggedIn,
  });
};
exports.postRegister = (req, resp, next) => {
  const { name, phone, email, password } = req.body;
  console.log(
    "Full name:\n",
    name,
    "\nPhone number: \n",
    phone,
    "\nEmail is: \n",
    email,
    "\nPassword is :\n",
    password
  );
};
