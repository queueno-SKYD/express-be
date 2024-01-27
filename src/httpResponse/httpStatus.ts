interface IStatus {
  code: number;
  status: string;
}

interface IHttpStatus {
  OK: IStatus;
  CREATED: IStatus;
  NO_CONTENT: IStatus;
  BAD_REQUEST: IStatus;
  NOT_FOUND: IStatus;
  INTERNAL_SERVER_ERROR: IStatus;
  WARNING: IStatus;
}

const HttpStatus: IHttpStatus = {
  OK: {code: 200, status: "OK"},
  CREATED: {code: 200, status: "CREATED"},
  NO_CONTENT: {code: 200, status: "NO_CONTENT"},
  BAD_REQUEST: {code: 200, status: "BAD_REQUEST"},
  NOT_FOUND: {code: 200, status: "NOT_FOUND"},
  INTERNAL_SERVER_ERROR: {code: 200, status: "INTERNAL_SERVER_ERROR"},
  WARNING: {code: 200, status: "WARNING"}
}

export default HttpStatus;
