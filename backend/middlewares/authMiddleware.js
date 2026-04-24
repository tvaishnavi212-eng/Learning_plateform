import { clerkClient } from "@clerk/express";

// Middleware (Protect Educator Route)
export const protectEducator = async (req, res, next) => {
  try {
    console.log("AUTH DATA:", req.auth);

    const { userId } = req.auth();

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized - No userId",
      });
    }

    const user = await clerkClient.users.getUser(userId);

    if (user.publicMetadata.role !== "educator") {
      return res.status(403).json({
        success: false,
        message: "Unauthorized Access - Not Educator",
      });
    }

    next(); // ✅ VERY IMPORTANT
  } catch (error) {
    console.error("❌ Middleware Error:", error.message);

    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
