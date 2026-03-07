import { v4 as uuidv4 } from "uuid";

const requestIdMiddleware = (req, res, next) => {
  const requestId = uuidv4();

  req.id = requestId;

  res.setHeader("X-Request-Id", requestId);

  next();
};

export default requestIdMiddleware;