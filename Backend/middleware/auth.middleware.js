exports.isSuperAdmin = (req, res, next) => {
  const user = req.user;
  if (user && user.role === "superadmin") {
    next();
  } else {
    return res.status(403).json({ message: "Access denied" });
  }
};
