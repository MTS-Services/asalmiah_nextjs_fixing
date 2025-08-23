## These are the points to be included and should be checked before releasing a project:

# Common

    - Clean and separate routing.
    - Check htaccess Rules.
    - Check Access Rules.
    - Check isAllowed Function.
    - Declare secret keys in .env files.
    - Encode consoles and content (security issue- hacking).
    - In every folder of root of project except themes and assets.
    - Make a global function for error handling of callbacks.
    - Make separate folder (example: utils ) for constant files and other reusables.
    - No hard codes.
    - Password should not be stored in any way
    - Password Strong Validation
    - Remove consoles
    - Remove Commented Code
    - Remove Extra Files/modules and uninstall unused modules
    - Tokenization.
    - Use ‘use strict’.
    - Use same formator for backend and frontend (eg. Prettier)

# Frontend

    - Remove css and js libraries if not required.
    - Remove unnecessary libraries (third party libraries)
    - Remove all the console error 
    - Use guard for front end to prevent access by non-authorized user ( front end).
    - URL Manager.
    - Use lazy loading for modules

# Backend

    - Log error to Admin.
    - Schema.
    - Validations with schema.
