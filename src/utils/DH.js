function DH() {
    let eccrypto = require("eccrypto")
    let crypto = require('crypto')

    let privateKeyA = eccrypto.generatePrivate();
    let publicKeyA = eccrypto.getPublic(privateKeyA);
    let privateKeyB = eccrypto.generatePrivate();
    let publicKeyB = eccrypto.getPublic(privateKeyB);
    /*
    eccrypto.derive(privateKeyA, publicKeyB).then(function(sharedKey1) {
        eccrypto.derive(privateKeyB, publicKeyA).then(function(sharedKey2) {
            console.log("Both shared keys are equal:", sharedKey1, sharedKey2);
        });
    });
    * */

    console.log(typeof (eccrypto.derive(privateKeyA, publicKeyB)))
    eccrypto.derive(privateKeyA, publicKeyB).then(x1 =>
        console.log(JSON.stringify(x1)))
//console.log(JSON.parse(JSON.stringify(eccrypto.derive(privateKeyA, publicKeyB))))
    eccrypto.derive(privateKeyA, publicKeyB).then(x1 =>
        console.log(JSON.parse(JSON.stringify(x1))))

    let hash = crypto.createHash('md5')
    hash.update('Hello world!');
    console.log(hash.digest('hex'));
}

export {DH}