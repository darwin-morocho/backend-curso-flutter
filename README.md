
Node.js backend with express  for the  course `Experto en flutter`

## **Local deploy**

1. Create the `.env` file inside the root folder and define 
```
MONGO = mongodb://darwinmorocho:r2dDvI8IuU@ds259787.mlab.com:59787/curso-flutter
SECRET = SqHgGGHfMixctTbT33t92hIhQM3ZiGPnc0mnoiC
```
This project use mlab as mongodb host don't use these credentials in production.

2.  Next install the dependencies running `npm install`

3. Run the project with `npm run dev`

By default the server is runnnig on PORT `5000`

Check the api docs http://localhost:5000/api/v1/docs