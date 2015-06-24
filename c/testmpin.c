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


/* test driver and function exerciser for MPIN Functions */
/* Version 3.0 - supports Time Permits */

/* gcc -std=c99 -O3 testmpin.c mpin.c miotcl.a -o testmpin.exe */

/* Build executible after installation:
   gcc -std=c99 -O3 testmpin.c -lmiotcl -lmpin -I/usr/local/include/miotcl/ -o testmpin.exe */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "mpin.h"

#define PERMITS  /* for time permits ON or OFF */
#define PINERROR /* For PIN ERROR detection ON or OFF */
//#define FULL     /* for M-Pin Full or M-Pin regular */
//#define SINGLE_PASS /* SINGLE PASS M-Pin */

int main()
{
  int i,pin,rtn,err,timeValue;
#ifdef PERMITS
  int date=today();
#else
  int date=0;
#endif
  unsigned long ran;
  char x[PGS],s[PGS],y[PGS],client_id[100],raw[100],sst[4*PFS],token[2*PFS+1],sec[2*PFS+1],permit[2*PFS+1],xcid[2*PFS+1],xid[2*PFS+1],e[12*PFS],f[12*PFS];
  char hcid[HASH_BYTES],hid[2*PFS+1],htid[2*PFS+1];
#ifdef FULL
  char r[PGS],z[2*PFS+1],w[PGS],t[2*PFS+1];
  char g1[12*PFS],g2[12*PFS];
  char ck[PAS],sk[PAS];
#endif
  octet S={0,sizeof(s),s};
  octet X={0,sizeof(x),x};
  octet Y={0,sizeof(y),y};
  octet RAW={0,sizeof(raw),raw};
  octet CLIENT_ID={0,sizeof(client_id),client_id};
  octet SST={0,sizeof(sst),sst};
  octet TOKEN={0,sizeof(token),token};
  octet SEC={0,sizeof(sec),sec};
  octet PERMIT={0,sizeof(permit),permit};
  octet xCID={0,sizeof(xcid),xcid};
  octet xID={0,sizeof(xid),xid};
  octet HCID={0,sizeof(hcid),hcid};
  octet HID={0,sizeof(hid),hid};
  octet HTID={0,sizeof(htid),htid};
  octet E={0,sizeof(e),e};
  octet F={0,sizeof(f),f};
#ifdef FULL
  octet R={0,sizeof(r),r};
  octet Z={0,sizeof(z),z};
  octet W={0,sizeof(w),w};
  octet T={0,sizeof(t),t};
  octet G1={0,sizeof(g1),g1};
  octet G2={0,sizeof(g2),g2};
  octet SK={0,sizeof(sk),sk};
  octet CK={0,sizeof(ck),ck};
#endif
  octet *pxID,*pxCID,*pHID,*pHTID,*pE,*pF,*pPERMIT,*prHID;
	
  /* Crypto Strong RNG */
  csprng RNG;                
  /* fake random seed source */
  time((time_t *)&ran);
  RAW.len=100;
  RAW.val[0]=ran;
  RAW.val[1]=ran>>8;
  RAW.val[2]=ran>>16;
  RAW.val[3]=ran>>24;
  for (i=4;i<100;i++) RAW.val[i]=i+1;    
	
  /* initialise strong RNG */
  CREATE_CSPRNG(&RNG,&RAW);   

  /* Trusted Authority set-up */
  MPIN_RANDOM_GENERATE(&RNG,&S);
  printf("Master Secret= "); OCT_output(&S);

  /* Create Client Identity */
  OCT_jstring(&CLIENT_ID,"testUser@certivox.com");
  MPIN_HASH_ID(&CLIENT_ID,&HCID);  /* Either Client or TA calculates Hash(ID) - you decide! */
  printf("Client ID= "); OCT_output_string(&CLIENT_ID); printf("\n");

  /* Client and Server are issued secrets by DTA */
  MPIN_GET_SERVER_SECRET(&S,&SST);
  printf("Server Secret= "); OCT_output(&SST);
  
  MPIN_GET_CLIENT_SECRET(&S,&HCID,&TOKEN);     
  printf("Client Secret= "); OCT_output(&TOKEN);

  /* Client extracts PIN from secret to create Token */
  pin=1234;
  printf("Client extracts PIN= %d\n",pin);
  MPIN_EXTRACT_PIN(&CLIENT_ID,pin,&TOKEN);
  printf("Client Token= "); OCT_output(&TOKEN);

#ifdef FULL
  MPIN_PRECOMPUTE(&TOKEN,&HCID,&G1,&G2);
#endif

#ifdef PERMITS
  /* Client gets "Time Permit" from DTA */
  printf("Client gets Time Permit\n");

  MPIN_GET_CLIENT_PERMIT(date,&S,&HCID,&PERMIT);
  printf("Time Permit= "); OCT_output(&PERMIT);

  /* This encoding makes Time permit look random */
  if (MPIN_ENCODING(&RNG,&PERMIT)!=0) printf("Encoding error\n");
  /* printf("Encoded Time Permit= "); OCT_output(&PERMIT); */
  if (MPIN_DECODING(&PERMIT)!=0) printf("Decoding error\n");
  /* printf("Decoded Time Permit= "); OCT_output(&PERMIT); */
#endif

  /* MPin Protocol */

  /* Client enters PIN */ 
  printf("\nPIN= "); 
  if(scanf("%d",&pin)){}; 
  /* to avoid silly compile error */
  getchar();

  /* Set date=0 and PERMIT=NULL if time permits not in use

  Client First pass: Inputs CLIENT_ID, optional RNG, pin, TOKEN and PERMIT. Output xID = x.H(CLIENT_ID) and re-combined secret SEC
  If PERMITS are is use, then date!=0 and PERMIT is added to secret and xCID = x.(H(CLIENT_ID)+H(date|H(CLIENT_ID)))
  Random value x is supplied externally if RNG=NULL, otherwise generated and passed out by RNG
  
  IMPORTANT: To save space and time..
  If Time Permits OFF set xCID = NULL, HTID=NULL and use xID and HID only
  If Time permits are ON, AND pin error detection is required then all of xID, xCID, HID and HTID are required
  If Time permits are ON, AND pin error detection is NOT required, set xID=NULL, HID=NULL and use xCID and HTID only.
  
  */

  pxID=&xID;
  pxCID=&xCID;
  pHID=&HID;
  pHTID=&HTID;
  pE=&E;
  pF=&F;
  pPERMIT=&PERMIT;
  
#ifdef PERMITS
  prHID=pHTID;
#ifndef PINERROR
   pxID=NULL;
   pHID=NULL;
#endif
#else
   prHID=pHID;
   pPERMIT=NULL;
   pxCID=NULL;
   pHTID=NULL;
#endif
#ifndef PINERROR
   pE=NULL;
   pF=NULL;
#endif

#ifdef SINGLE_PASS
  printf("MPIN Single Pass\n");
  timeValue = MPIN_GET_TIME();
  rtn=MPIN_CLIENT(date,&CLIENT_ID,&RNG,&X,pin,&TOKEN,&SEC,pxID,pxCID,pPERMIT,timeValue,&Y);
  if (rtn != 0)
  {
    printf("MPIN_CLIENT ERROR %d\n", rtn);
    return 1;
  }

#ifdef FULL
  MPIN_HASH_ID(&CLIENT_ID,&HCID); 
  MPIN_GET_G1_MULTIPLE(&RNG,1,&R,&HCID,&Z);  /* Also Send Z=r.ID to Server, remember random r */
#endif


  rtn=MPIN_SERVER(date,pHID,pHTID,&Y,&SST,pxID,pxCID,&SEC,pE,pF,&CLIENT_ID,timeValue);
  if (rtn != 0)
  {
    printf("MPIN_SERVER ERROR %d\n", rtn);
  }


#ifdef FULL
  MPIN_GET_G1_MULTIPLE(&RNG,0,&W,prHID,&T);  /* Also send T=w.ID to client, remember random w  */
#endif

#else // SINGLE_PASS
  printf("MPIN Multi Pass\n");
  if (MPIN_CLIENT_1(date,&CLIENT_ID,&RNG,&X,pin,&TOKEN,&SEC,pxID,pxCID,pPERMIT)!=0)
  {
    printf("Error from Client side - First Pass\n");
    return 0;
  }

  /* Send U=x.ID to server, and recreate secret from token and pin */

#ifdef FULL
  MPIN_HASH_ID(&CLIENT_ID,&HCID); 
  MPIN_GET_G1_MULTIPLE(&RNG,1,&R,&HCID,&Z);  /* Also Send Z=r.ID to Server, remember random r */
#endif

  /* Server calculates H(ID) and H(ID)+H(T|H(ID)) (if time permits enabled), and maps them to points on the curve HID and HTID resp. */
  MPIN_SERVER_1(date,&CLIENT_ID,pHID,pHTID);

  /* Server generates Random number Y and sends it to Client */
  MPIN_RANDOM_GENERATE(&RNG,&Y);

#ifdef FULL
  MPIN_GET_G1_MULTIPLE(&RNG,0,&W,prHID,&T);  /* Also send T=w.ID to client, remember random w  */
#endif

  /* Client Second Pass: Inputs Client secret SEC, x and y. Outputs -(x+y)*SEC */
  if (MPIN_CLIENT_2(&X,&Y,&SEC)!=0)
  {
    printf("Error from Client side - Second Pass\n");
    return 1;
  }	

  /* Server Second phase. Inputs hashed client id, random Y, -(x+y)*SEC, xID and xCID and Server secret SST. E and F help kangaroos to find error. */
  /* If PIN error not required, set E and F = NULL */
  rtn=MPIN_SERVER_2(date,pHID,pHTID,&Y,&SST,pxID,pxCID,&SEC,pE,pF);
#endif // SINGLE_PASS

  if (rtn!=0)
    {
      printf("Server says - Bad Pin. I don't know you. Feck off.\n");
#ifdef PINERROR

      err=MPIN_KANGAROO(&E,&F);
      if (err) printf("(Client PIN is out by %d)\n",err); 

#endif
      return 1;
    }
  else
    {
      printf("Server says - PIN is good! You really are "); OCT_output_string(&CLIENT_ID); printf(".\n");
    } 

#ifdef FULL
  MPIN_CLIENT_KEY(&G1,&G2,pin,&R,&X,&T,&CK);
  printf("Client Key = "); OCT_output(&CK); 

  MPIN_SERVER_KEY(&Z,&SST,&W,pxID,pxCID,&SK);
  printf("Server Key = "); OCT_output(&SK); 
#endif
  return 0;
}