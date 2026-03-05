const JWT_SECRET = process.env.JWT_SECRET;

if(!JWT_SECRET) throw new Error("Provide Jwt secret");

export  default JWT_SECRET;