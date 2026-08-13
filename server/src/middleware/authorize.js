/**
 * Restricts a route to specific roles. Use after `protect`.
 *   router.get("/admin/stuff", protect, authorize("admin"), handler)
 */
export function authorize(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      res.status(403);
      throw new Error(`Role '${req.user?.role || "unknown"}' is not permitted to access this resource`);
    }
    next();
  };
}
