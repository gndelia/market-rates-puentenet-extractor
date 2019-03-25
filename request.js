// maintain cookies, because the servlet from puente.net uses cookies to store the information of the stock to retrieve
const request = require('request').defaults({ jar: true });

module.exports = url => {
    return new Promise((resolve, reject) => {
        request(`https://www.puentenet.com/puente/researchAction${url}`, (error, response) => {
            if (error) {
                return reject(error);
            }
            resolve(response);
        });
    });
};