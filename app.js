require('dotenv').config()
const Koa = require('koa');
const Router = require('koa-router');
const axios = require('axios');
const querystring = require('querystring');

const app = new Koa();

const router = new Router();

router
    .get('/ping', (ctx, next) => {
        // ctx.body = 'Hello World!';
        axios.get('https://api.sms.dialy.net/customerMessaging/SendSMS', querystring.stringify({
            User: 'test',
            Password: 'test',
            Phone: '212600000000',
            Text: 'hello',
            From: 'DIALY',
            Operator: 'IAM',
            dlrUrl: 'https://api.sms.dialy.net',
        }))
            .then((response) => {
                // handle success
                
                console.log(response);
                ctx.body = response;
            })
            .catch((error) => {
                // handle error
                console.log(error);
            })
            .then(function () {
                // always executed
                // callback
            });
    })
    // .post('/ping', (ctx, next) => {

    // });
app
    .use(router.routes())
    .use(router.allowedMethods());

app.listen(process.env.PORT || 3000, () => console.log('Koa is listening to http://ip:3000'));