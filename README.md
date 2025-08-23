

## Authors

@copyright : ToXSL Technologies Pvt. Ltd. < www.toxsl.com >

@author    : Shiv Charan Panjeta < shiv@toxsl.com >
 
All Rights Reserved.
Proprietary and confidential :  All information contained here in is, and remains
the property of ToXSL Technologies Pvt. Ltd. and it's partners.
Unauthorized copying of this file, via any medium is strictly prohibited.



## Installation
```bash
    offarat-node-2135
    ├── docs
    └── installation.md
```

Install node modules with npm, open terminal in offarat-node-2135 directory

```bash
  npm install
```
    
## Environment Variables

To run this project, you will need to add the following environment variables to your .env file

`NEXT_PUBLIC_API = 'NEXT_PUBLIC_API'`
You can rename default.env to .env

## Run Locally

Clone the project

```bash
  git clone PROJECT_URL
```

Go to the project directory

```bash
  cd offarat-node-2135
  cd client
```

Install dependencies

```bash
  npm install
```
Create .env.development by remaning default.env.development

`NEXT_PUBLIC_API = 'NEXT_PUBLIC_API'`


> If there are any issues in connecting to backend you can directly paste your backend URL in Config file
```bash 
 offarat-node-2135
    ├── src
    ├── globals
    └── Config.js
```

Start the server

```bash
  npm run dev
```


## Deployment

To deploy this project run

```bash
  npm run deploy
```

## RUN PROJECT with DOCKER
 
```bash 
git clone PROJECT_URL
```

Rename `default.env` to `.env`

```bash
 npm install
```

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