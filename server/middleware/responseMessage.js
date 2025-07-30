module.exports = {
    GENERAL_MESSAGE: (name) => {
      return name;
    },
    ALREADY_EXISTS: (name) => {
      return name + " already exists";
    },
    NOT_EXISTS: (name) => {
      return name + " doesnot exist";
    },
    INVALID: (name) => {
      return "Invalid " + name;
    },
    SUCCESS: (name) => {
      return name + " success";
    },
    DELETE_SUCCESS: (name) => {
      return name + " deleted successfully";
    },
    ACTIVATE_SUCCESS: (name) => {
      return name + " activated successfully";
    },
    NOT_FOUND: (name) => {
      return name + " not found";
    },
    FOUND: (name) => {
      return name + " found";
    },
    ADD_SUCCESS: (name) => {
      return name + " added successfully";
    },
    ADD_FAILED: (name) => {
      return "Failed to added " + name;
    },
    FOUND_SUCCESS: (name) => {
      return name + " found successfully";
    },
    UPDATE_SUCCESS: (name) => {
      return name + " updated successfully";
    },
    UPDATE_FAILED: (name) => {
      return "Failed to updated " + name;
    },
    SOMETHING_WRONG: 'Something went wrong'
  };
  