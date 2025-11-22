export const validateUser = async (req, res, next) => {
    res.status(200).json({
      data: {
        success: true,
        message: "User is valid",
        user: {
            id: req.user.id,
            email: req.user.email,
        },
      },
    });
}