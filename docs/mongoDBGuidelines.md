# MongoDB Guidelines

### Following points to be kept in mind before creating a database

1.  Name for the database **should not be** random name, it should be related to project name
2.  Field names must be in **British English**
3.  Field names must be in **lowerCamelCase**
4.  Field names must be singular
5.  Field names should not be any reserved keywords
6.  Field names for required values must not be null
7.  DataType for field names must be set correctly
8.  Set default value for field names that store enum values
9.  Always set a field for **state** that stores enum value for Active and Inactive state
10. Add timestamps in schema

###### Good field names:

firstName
lastName
customerId

###### Bad field names:

FirstName
FIRSTNAME
first_name
First_Name

#### Foreign keys
Fields that reference other collections **MUST** have a foreign key in relation to that other collection 

