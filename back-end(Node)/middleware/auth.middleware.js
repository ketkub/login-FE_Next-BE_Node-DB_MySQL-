import jwt from "jsonwebtoken";

export const verifyToken = (req, res, next) => {
    const token = req.headers["authorization"]?.split(" ")[1] ;
    if(!token)
    {
        return res.status(401).json({ message: "Unauthorized" });
    }

    try{
        const decoded = jwt.verify(token, "Test_Key");
        req.userId = decoded.userId;
        next();
    }catch(error){
        res.status(401).json({ message: "Unauthorized" });
    }

};