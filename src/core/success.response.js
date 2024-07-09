const { StatusCodes, ReasonPhrases } = require("../utils/httpStatusCode");

class SuccessResponse {
  constructor({
    message,
    reasonStatus = ReasonPhrases.OK,
    statusCode = StatusCodes.OK,
    metadata = {},
  }) {
    (this.message = !message ? reasonStatus : message),
      (this.status = statusCode);
    this.metadata = metadata;
  }
  send(res, headers = {}) {
    return res.status(this.status).json(this);
  }
}

class OK extends SuccessResponse {
  constructor({ message, metadata }) {
    super({ message, metadata });
  }
}

class CREATED extends SuccessResponse {
  constructor({
    message,
    options = {},
    statusCode = StatusCodes.CREATED,
    reasonStatus = ReasonPhrases.CREATED,
    metadata,
  }) {
    super({ message, metadata });
    this.options = options;
  }
}

module.exports = {
  OK,
  CREATED,
  SuccessResponse,
};
