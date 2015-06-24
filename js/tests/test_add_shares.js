/*
Copyright 2015 CertiVox UK Ltd

This file is part of The CertiVox MIRACL IOT Crypto SDK (MiotCL)

MiotCL is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

MiotCL is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with MiotCL.  If not, see <http://www.gnu.org/licenses/>.

You can be released from the requirements of the license by purchasing 
a commercial license.
*/

console.log("Testing addition of shares");
var WebSocket = require('ws');
var assert = require('assert');
var http = require('http');
var fs = require('fs');
var crypto = require('crypto');

// Javascript files from the PIN pad  are included here:
eval(fs.readFileSync('../DBIG.js')+'');
eval(fs.readFileSync('../BIG.js')+'');
eval(fs.readFileSync('../FP.js')+'');
eval(fs.readFileSync('../ROM.js')+'');
eval(fs.readFileSync('../HASH.js')+'');
eval(fs.readFileSync('../RAND.js')+'');
eval(fs.readFileSync('../AES.js')+'');
eval(fs.readFileSync('../GCM.js')+'');
eval(fs.readFileSync('../ECP.js')+'');
eval(fs.readFileSync('../FP2.js')+'');
eval(fs.readFileSync('../ECP2.js')+'');
eval(fs.readFileSync('../FP4.js')+'');
eval(fs.readFileSync('../FP12.js')+'');
eval(fs.readFileSync('../PAIR.js')+'');
eval(fs.readFileSync('./MPIN.js')+'');
eval(fs.readFileSync('../MPINAuth.js')+'');

// Configuration file
eval(fs.readFileSync('./config.js')+''); 

// Load test vectors
var vectors = require('./testVectors.json');

// Turn on DEBUG mode in MPINAuth
MPINAuth.DEBUG = DEBUG;
  
for(var vector in vectors)
  {
    console.log("Test "+vectors[vector].test_no);
    // Client secrets
    if (DEBUG){console.log("CS1 "+vectors[vector].CS1);}
    if (DEBUG){console.log("CS2 "+vectors[vector].CS2);}
    if (DEBUG){console.log("CLIENT_SECRET "+vectors[vector].CLIENT_SECRET);}
    var client_secret = MPINAuth.addShares(vectors[vector].CS1, vectors[vector].CS2);
    if (DEBUG){console.log("client_secret "+client_secret);}
    try
      {
        assert.equal(client_secret, vectors[vector].CLIENT_SECRET, "Client Secret Addition failed");      
      }
    catch(err)
      {
        txt="Error description: " + err.message;
        console.error(txt);    
        console.log("TEST FAILED");
        return;
      }
    // Time permits
    if (DEBUG){console.log("TP1 "+vectors[vector].TP1);}
    if (DEBUG){console.log("TP2 "+vectors[vector].TP2);}
    if (DEBUG){console.log("TIME_PERMIT "+vectors[vector].TIME_PERMIT);}
    var time_permit = MPINAuth.addShares(vectors[vector].TP1, vectors[vector].TP2);
    if (DEBUG){console.log("time_permit "+time_permit);}
    try
      {
        assert.equal(time_permit, vectors[vector].TIME_PERMIT, "Time Permit Addition failed");
      }
    catch(err)
      {
        txt="Error description: " + err.message;
        console.error(txt);    
        console.log("TEST FAILED");
        return;
      }
  }
console.log("TEST PASSED");
