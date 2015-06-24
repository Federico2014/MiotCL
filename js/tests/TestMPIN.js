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

console.log("JavaScript Test MPIN Example");
var fs = require('fs');

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
eval(fs.readFileSync('../MPIN.js')+'');

var i,res;
var result;

var EGS=MPIN.EGS;
var EFS=MPIN.EFS;
var EAS=16;

var rng=new RAND();
rng.clean();

var RAW=[];
for (i=0;i<100;i++) RAW[i]=i;
rng.seed(100,RAW);

var G1S=2*EFS+1; /* Group 1 Size */
var G2S=4*EFS; /* Group 2 Size */

var S=[];
var SST=[];
var TOKEN = [];
var TOKEN_bytes = [];
var PERMIT = [];
var SEC = [];
var U = [];
var UT = [];
var X= [];
var Y= [];
var E=[];
var F=[];
var HID= [];
var HTID = [];

var PIN_setup = 1234
var PIN_authenticate = 1234


/* Trusted Authority set-up */
MPIN.RANDOM_GENERATE(rng,S);
console.log("Master Secret s: 0x"+MPIN.bytestostring(S));

var IDstr = "testUser@certivox.com";
var CLIENT_ID = MPIN.stringtobytes(IDstr);   
var hash_CLIENT_ID=[];
var hash_CLIENT_ID = MPIN.HASH_ID(CLIENT_ID)

/* Client and Server are issued secrets by DTA */
MPIN.GET_SERVER_SECRET(S,SST);
console.log("Server Secret SS: 0x"+MPIN.bytestostring(SST));

MPIN.GET_CLIENT_SECRET(S,hash_CLIENT_ID,TOKEN);
console.log("Client Secret CS: 0x"+MPIN.bytestostring(TOKEN));     
	
/* Client extracts PIN from secret to create Token */
var rtn=MPIN.EXTRACT_PIN(CLIENT_ID,PIN_setup,TOKEN);
if (rtn != 0)
	console.log("Failed to extract PIN ");  

TOKEN_hex=MPIN.bytestostring(TOKEN)
console.log("Client Token TK: 0x"+TOKEN_hex);        

var date=MPIN.today();

/* Get "Time Token" permit from DTA */ 	
MPIN.GET_CLIENT_PERMIT(date,S,hash_CLIENT_ID,PERMIT);
console.log("Time Permit TP: 0x"+MPIN.bytestostring(PERMIT));   

/* Elligator squared */
// MPIN.ENCODING(rng,PERMIT);
// console.log("Encoded Time Permit TP: 0x"+MPIN.bytestostring(PERMIT));   
// MPIN.DECODING(PERMIT);
// console.log("Decoded Time Permit TP: 0x"+MPIN.bytestostring(PERMIT));   


/* Set date=0 and PERMIT=NULL if time permits not in use

Client First pass: Inputs CLIENT_ID, optional RNG, PIN_authenicate, TOKEN and PERMIT. Output x.H(CLIENT_ID) and re-combined secret SEC
If PERMITS are is use, then date!=0 and PERMIT is added to secret and UT = x.(H(CLIENT_ID)+H_T(date|CLIENT_ID))
Random value x is supplied externally if RNG=NULL, otherwise generated and passed out by RNG

Note that if Time Permits are in use U is *only* required to help calculate the PIN error. So if PIN error is
not of interest, it could be set to NULL.

*/
rtn=MPIN.CLIENT_1(date,CLIENT_ID,rng,X,PIN_authenticate,TOKEN,SEC,U,UT,PERMIT);

if (rtn != 0)
	console.log("FAILURE: CLIENT_1 rtn: " + rtn);   

/* Server calculates H(ID) and H(T|H(ID)) (if time permits enabled), and maps them to points on the curve HID and HTID resp. */
MPIN.SERVER_1(date,CLIENT_ID,HID,HTID);

/* Server generates Random number Y and sends it to Client */
MPIN.RANDOM_GENERATE(rng,Y);

/* Client Second Pass: Inputs Client secret SEC, x and y. Outputs -(x+y)*SEC */
rtn=MPIN.CLIENT_2(X,Y,SEC);
if (rtn != 0)
	console.log("FAILURE: CLIENT_2 rtn: " + rtn);  

/* Server Second pass. Inputs client id, random Y, -(x+y)*SEC, U and UT and Server secret SST. E and F help kangaroos to find error. */
/* If PIN error not required, set U, E and F = NULL */
rtn=MPIN.SERVER_2(date,HID,HTID,Y,SST,U,UT,SEC,E,F);
if (rtn != 0)
  console.log("FAILURE: SERVER_2 rtn: " + rtn);

if (rtn != 0)
{
	console.log("Server Error:"); 
	var err=MPIN.KANGAROO(E,F);
	if (err==0) console.log("Client probably does not have a valid Token!"); 
	else console.log("(Client PIN is out by "+err);
}
else console.log("Server says - PIN is good! You really are "+IDstr); 
