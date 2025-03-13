exports.success = (res, data, message = "Success") => {
    res.json({ status: "success", message, data });
  };
  
  exports.error = (res, message = "Something went wrong", code = 500) => {
    res.status(code).json({ status: "error", message });
  };
  