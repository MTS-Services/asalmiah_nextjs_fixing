## License

**www.toxsl.in**

## Authors

@copyright : ToXSL Technologies Pvt. Ltd.

@author : Shiv Charan Panjeta

All Rights Reserved.
Proprietary and confidential : All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.



# Node

Node version used v20.11.0

The Administration Menu module displays the entire administrative menu tree

# Backend

**_Requirements_**
MongoDB 7.0

_Node Js_

installation link: https://nodejs.org/en/download/package-manager/

After installing node.js verify and check the installed version.

Also, check the npm version

**MongoDB**
Installation link: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-ubuntu/

Start MongoDB: sudo service mongod start.
Stop MongoDB: sudo service mongod stop

### Directory Structure

```
/app/        all controllers and models paths and application configuration

```

## To create an admin, run following command :

`npm run createAdmin`

## Admin credentials :

`email : admin@toxsl.in`
`password : Admin@2135`

## To create an swagger routes, run following command :

`npm run gen-doc`

## swagger url-

http://localhost:2136/api/api-doc

## Usage

Once setup is done you need to follow the final setup with the installer .
make sure you give READ/WRITE permission to your folder.

## Development server for back end

Run `npm install` for install packages
Run `npm start` for a dev server. Navigate to `http://localhost:2136/api`. The app will automatically reload if you change any of the source files.

### Coding Guidelines

NOTE: Refer the [Coding Guidelines] (http://192.168.10.23/node/offarat-node-2135-/blob/master/backend/docs/codingGuidelines.md) for details on all the security concerns and other important parameters of the project before its actual releasing.

### MongoDB Guidelines

NOTE: Refer the [MongoDB Guidelines] (http://192.168.10.23/node/offarat-node-2135-/blob/master/backend/docs/mongoDBGuidelines.md) for all the necessary details to be checked before creating a database and other important parameters of the project before its actual releasing.

### Follow these commands for RUN with docker

#### Build the docker images with no cache

```bash
sudo docker-compose build --no-cache
```

### To install production ready containers

```bash
sudo docker-compose up -d --remove-orphans
```

Or

```bash
sudo docker-compose up
```

(for check run time logs)

Output : localhost : PORT_NUMBER

Note - for URL route > we need to add > nginx.conf file
