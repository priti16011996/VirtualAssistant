export const getCurrentUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password"); // Exclude password from the response
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching current user:", error);
    return res
      .status(500)
      .json({ message: "Something went wrong while fetching user data" });
  }
};
