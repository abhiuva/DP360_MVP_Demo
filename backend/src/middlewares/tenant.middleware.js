exports.ensureTenant = (req, res, next) => {
  try {
    const tenantId = req.user?.tenant_id ?? null;
    if (!tenantId || Number.isNaN(Number(tenantId))) {
      return res.status(401).json({ success: false, message: "Tenant is missing from session." });
    }
    req.tenantId = Number(tenantId);
    next();
  } catch (err) {
    console.error("ensureTenant error:", err);
    return res.status(500).json({ success: false, message: "Unable to resolve tenant." });
  }
};
