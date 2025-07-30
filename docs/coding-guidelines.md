# Coding Style Guidelines

# Formatting

- Indentation :

  - Use four spaces.

- Newlines :

  - Use UNIX - style newlines(\n), and a newline character as the last character of a file.Windows - style newlines(\r\ n) are forbidden inside any repository.

- No trailing white space :

  - Clean up any trailing white space in your JS files.

- Use semicolons :

  - Usage of semicolons is a core value.

- 80 characters per line :

  - Limit your lines to 80 characters.

- single quotes :
  - Use single quotes, unless you are writing JSON.This helps you separate your objects’ strings from normal strings. Example: var fruit = ‘mango’
- Opening braces :
  - Opening braces should be on the same line

# Varibale Declaration :

- Declare one variable per var statement
- make use of let var and const as required

# Naming Conventions

- Use lowerCamelCase for variables, properties and function names : Variables, properties and function names should use lowerCamelCase.They should also be descriptive.Single character variables and uncommon abbreviations should generally be avoided.
- Use UpperCamelCase for class names : Class names should be capitalized using UpperCamelCase. example: BankAccount

- Use UPPERCASE for Constants : Constants should be declared as regular variables or static class properties, using all uppercase letters

# Variables

- Object / Array creation : Always quote only keys in arrays and objects

# Conditionals

- Use the === operator
- Use descriptive conditions : Any non - trivial conditions should be assigned to a descriptively named variable or function

# Functions

- Write small functions : Keep your functions short.
- Return early from functions : To avoid deep nesting of if - statements, always return a function’ s value as early as possible.

* Method chaining : One method per line should be used. Example:

# Comments

- Use slashes for comments
  Use slashes
  for both single line and multi line comments.

# Error handling

- Operational errors
- Programmer errors

# Miscellaneous

- Requires at top : Always put requires at top of file to clearly illustrate a file’ s dependencies.
