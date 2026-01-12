const { check, validationResult } = require("express-validator");
const Users = require("../Model/users");
const bcrypt = require("bcryptjs");
const logActivity = require("../utils/activityLogger");

exports.getLogin = (req, resp, next) => {
  resp.render("Auth/login", {
    title: "airbnb-login",
    currentPage: "login",
    isLoggedIn: false,
    errors: req.session.errors || [],
    oldInput: { email: "" },
    user: {},
  });
};

exports.postLogin = async (req, resp, next) => {
  try {
    const { email, password } = req.body;

    // 1️⃣ Basic validation
    if (!email || !password) {
      return resp.status(422).render("Auth/login", {
        title: "login page",
        currentPage: "login",
        isLoggedIn: false,
        isBlocked:user.isBlocked,
        errors: ["Email and password are required"],
        oldInput: { email },
      });
    }

    const user = await Users.findOne({ email });

    if (!user) {
      return resp.status(422).render("Auth/login", {
        title: "login page",
        currentPage: "login",
        isLoggedIn: false,
        isBlocked:user.isBlocked,
        errors: ["Invalid email"],
        oldInput: { email },
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return resp.status(422).render("Auth/login", {
        title: "login page",
        currentPage: "login",
        isLoggedIn: false,
        errors: ["Invalid password"],
        oldInput: { email },
      });
    }

    req.session.isLoggedIn = true;
    req.session.user = {
      id: user._id.toString(),
      email: user.email,
      role: user.role,
      phone: user.phone,
      isBlocked:user.isBlocked,
      firstName: user.firstName,
      lastName: user.lastName,
    };
    await logActivity({
      actorType: user.role === "admin" ? "admin" : "user",
      actorId: user._id,
      action: "USER_LOGIN",
      description: "User logged in",
    });

    await req.session.save();
    if (user.role === "user") {
      return resp.redirect("/home-list");
    } else if (user.role === "admin") {
      return resp.redirect("admin/home-list");
    } else {
      return resp.redirect("/");
    }
  } catch (err) {
    console.error(err);

    return resp.status(500).render("Auth/login", {
      title: "login page",
      currentPage: "login",
      isLoggedIn: false,
      errors: ["Something went wrong. Please try again later."],
      oldInput: { email: req.body.email },
    });
  }
};

exports.postLogout = async (req, res) => {
  try {
    if (req.session.user) {
      await logActivity({
        actorType: req.session.user.role,
        actorId: req.session.user.id,
        action: "USER_LOGOUT",
        description: "User logged out",
      });
    }

    req.session.destroy(() => {
      res.redirect("/");
    });
  } catch (err) {
    console.error("Logout error:", err);
    res.redirect("/");
  }
};


exports.getRegister = (req, resp, next) => {
  resp.render("Auth/register", {
    title: "airbnb-register",
    currentPage: "register",
    isLoggedIn: false,
    errors: [],
    oldInput: {
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      password: "",
      role: "",
      user: {},
    },
  });
};
exports.postRegister = [
  // First name validation
  check("firstName")
    .trim()
    .isLength({ min: 2 })
    .withMessage("First name must be at least 2 characters")
    .matches(/^[a-zA-Z\s]+$/)
    .withMessage("First name can only contain letters"),

  // Last name
  check("lastName")
    .matches(/^[a-zA-Z\s]*$/)
    .withMessage("Last name can only contain letters"),

  // Phone number validation
  check("phone")
    .trim()
    .notEmpty()
    .withMessage("Mobile number is required")
    .isLength({ min: 10, max: 10 })
    .withMessage("Mobile number must be exactly 10 digits")
    .isNumeric()
    .withMessage("Mobile number must contain only digits"),

  // Email validation
  check("email")
    .isEmail()
    .withMessage("Please enter a valid email")
    .normalizeEmail(),
  //Password validate
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 character long")
    .matches(/[a-z]/)
    .withMessage("password must contain at least one lower alphabet")
    .matches(/[A-Z]/)
    .withMessage("password must contain at least one upper alphabet")
    .matches(/[!@#$%^&*()_+|}{><?~}]/)
    .withMessage("Password must contain at least one special character")
    .trim(),
  // confirmPassword
  check("confirmPassword")
    .trim()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
  // Role Validate
  check("role")
    .notEmpty()
    .withMessage("User type is required")
    .isIn(["user", "admin"])
    .withMessage("Invalid user type"),
  // termsAccepted
  check("termsAccepted")
    .notEmpty()
    .withMessage("you must accept terms and condition")
    .custom((value) => {
      if (value !== "on") {
        throw new Error("you must accept terms and condition");
      }
      return true;
    }),

  // ===== CONTROLLER =====
  async (req, res) => {
    try {
      const { firstName, lastName, phone, email, password, role } = req.body;
      const errors = validationResult(req);

      if (!errors.isEmpty()) {
        return res.status(422).render("Auth/register", {
          title: "register",
          currentPage: "register",
          isLoggedIn: false,
          errors: errors.array().map((err) => err.msg),
          oldInput: { firstName, lastName, phone, email, password, role },
          user: {},
        });
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new Users({
        firstName,
        lastName,
        phone,
        email,
        password: hashedPassword,
        role,
      });

      const result = await user.save();

      // ✅ ACTIVITY LOG (correct place)
      await logActivity({
        actorType: role === "admin" ? "admin" : "user",
        actorId: result._id,
        action: "USER_REGISTER",
        description: "New user registered",
      });

      return res.redirect("/login");
    } catch (err) {
      console.error("Error while registering user:", err);
      return res.status(422).render("Auth/register", {
        title: "register",
        currentPage: "register",
        isLoggedIn: false,
        errors: [err.message],
        oldInput: req.body,
        user: {},
      });
    }
  },
];
