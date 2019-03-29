// maintain cookies, because the servlet from puente.net uses cookies to store the information of the stock to retrieve
module.exports = () => {
    const request = require('request');
    let jar = request.jar();
    return url => {
        return new Promise((resolve, reject) => {
            let completeUrl = `https://www.puentenet.com/puente/researchAction${url}`;
            request({ url: completeUrl, jar, timeout: 60000 }, (error, response) => {
                if (error) {
                    console.log(completeUrl);
                    return reject(error);
                }
                resolve(response);
            });
        });
    };
};