const bcrypt = require("bcryptjs");
const { check, validationResult } = require("express-validator");
const SuperAdmin = require("../Model/superAdmin");
const logActivity = require("../utils/activityLogger");


/* ===================== LOGIN ===================== */
exports.getIndex = (req, res) => {
  res.render("SuperAdmin/index", {
    title: "Super Admin Login",
    currentPage: "superAdmin-login",
    isSuperAdminLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.getLogin = (req, res) => {
  res.render("SuperAdmin/super-login", {
    title: "Super Admin Login",
    currentPage: "superAdmin-login",
    isSuperAdminLoggedIn: false,
    errors: [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.postLogin = async (req, res) => {
  const { email, password } = req.body;

  try {
    if (!email || !password) {
      return res.status(422).render("SuperAdmin/super-login", {
        title: "Super Admin Login",
        currentPage: "superAdmin-login",
        isSuperAdminLoggedIn : false,
        errors: ["Email and password are required"],
        oldInput: { email },
        user: {},
      });
    }

    const superAdmin = await SuperAdmin.findOne({ email });

    if (!superAdmin || !superAdmin.isActive) {
      return res.status(422).render("SuperAdmin/super-login", {
        title: "Super Admin Login",
        currentPage: "superAdmin-login",
        isSuperAdminLoggedIn : false,
        errors: ["Invalid credentials"],
        oldInput: { email },
        user: {},
      });
    }

    const isMatch = await bcrypt.compare(password, superAdmin.password);

    if (!isMatch) {
      return res.status(422).render("SuperAdmin/super-login", {
        title: "Super Admin Login",
        currentPage: "superAdmin-login",
        isSuperAdminLoggedIn: false,
        errors: ["Invalid credentials"],
        oldInput: { email },
        user: {},
      });
    }
    
    req.session.isSuperAdminLoggedIn = true;
    req.session.superAdmin = {
      id: superAdmin._id.toString(),
      email: superAdmin.email,
      firstName: superAdmin.firstName,
      lastName: superAdmin.lastName,

    };

    await req.session.save();
    await logActivity({
      actorType: "superadmin",
      actorId: superAdmin._id,
      action: "SUPERADMIN_LOGIN",
      description: "Super Admin logged in",
    });

    return res.redirect("/SuperAdmin/dashboard"); // 👉 index.ejs
  } catch (err) {
    console.error(err);
    return res.status(500).render("SuperAdmin/super-login", {
      title: "Super Admin Login",
      currentPage: "superAdmin-login",
      isSuperAdminLoggedIn : false,
      errors: ["Something went wrong"],
      oldInput: { email },
      user: {},
    });
  }
};

/* ===================== LOGOUT ===================== */

exports.postLogout = async (req, res) => {
  if (req.session.superAdmin) {
    await logActivity({
      actorType: "superadmin",
      actorId: req.session.superAdmin.id,
      action: "SUPERADMIN_LOGOUT",
      description: "Super Admin logged out",
    });
  }

  req.session.destroy(() => {
    res.redirect("/SuperAdmin/super-login");
  });
};


/* ===================== REGISTER ===================== */

exports.getRegister = (req, res) => {
  res.render("SuperAdmin/super-signup", {
    title: "Super Admin Register",
    currentPage: "superAdmin-register",
    isSuperAdminLoggedIn : false,
    errors: [],
    oldInput: {},
    user: {},
  });
};

exports.postRegister = [
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters"),

  check("email").isEmail().withMessage("Invalid email").normalizeEmail(),

  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters"),

  async (req, res) => {
    const errors = validationResult(req);
    const { firstName, lastName, email, password } = req.body;

    if (!errors.isEmpty()) {
      return res.status(422).render("SuperAdmin/super-signup", {
        title: "Super Admin Register",
        currentPage: "superAdmin-register",
        isSuperAdminLoggedIn : false,
        errors: errors.array().map((e) => e.msg),
        oldInput: { firstName, lastName, email },
        user: {},
      });
    }

    try {
      const existing = await SuperAdmin.findOne({ email });
      if (existing) {
        return res.status(422).render("SuperAdmin/super-signup", {
          title: "Super Admin Register",
          currentPage: "superAdmin-register",
          isSuperAdminLoggedIn : false,
          errors: ["Email already exists"],
          oldInput: { firstName, lastName, email },
          user: {},
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const superAdmin = new SuperAdmin({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });

      await superAdmin.save();
      return res.redirect("/superadmin/super-login");
    } catch (err) {
      console.error(err);
      return res.status(500).render("SuperAdmin/super-signup", {
        title: "Super Admin Register",
        currentPage: "superAdmin-register",
        isSuperAdminLoggedIn : false,
        errors: ["Registration failed"],
        oldInput: { firstName, lastName, email },
        user: {},
      });
    }
  },
];
//! ==================================================================
