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

/* test driver and function exerciser for ECDH/ECIES/ECDSA API Functions */

#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <time.h>
#include "ecdh.h"

int main()
{   
  int i,j=0,res;
  int result;
  unsigned long ran;
  char *pp="M0ng00se";
  /* These octets are automatically protected against buffer overflow attacks */
  /* Note salt must be big enough to include an appended word */
  /* Note ECIES ciphertext C must be big enough to include at least 1 appended block */
  /* Recall EFS is field size in bytes. So EFS=32 for 256-bit curve */
  char s0[EGS],s1[EGS],w0[2*EFS+1],w1[2*EFS+1],z0[EFS],z1[EFS],raw[100],key[EAS],salt[32],pw[20],p1[30],p2[30],v[2*EFS+1],m[32],c[64],t[32],cs[EGS],ds[EGS];
  octet S0={0,sizeof(s0),s0};
  octet S1={0,sizeof(s1),s1};
  octet W0={0,sizeof(w0),w0};
  octet W1={0,sizeof(w1),w1};
  octet Z0={0,sizeof(z0),z0};
  octet Z1={0,sizeof(z1),z1};
  octet RAW={0,sizeof(raw),raw};
  octet KEY={0,sizeof(key),key};
  octet SALT={0,sizeof(salt),salt};
  octet PW={0,sizeof(pw),pw};
  octet P1={0,sizeof(p1),p1};
  octet P2={0,sizeof(p2),p2};
  octet V={0,sizeof(v),v};
  octet M={0,sizeof(m),m};
  octet C={0,sizeof(c),c};
  octet T={0,sizeof(t),t};
  octet CS={0,sizeof(cs),cs};
  octet DS={0,sizeof(ds),ds};

  /* Crypto Strong RNG */
  csprng RNG;                  				  
  time((time_t *)&ran);
  /* fake random seed source */
  RAW.len=100;		
  RAW.val[0]=ran;
  RAW.val[1]=ran>>8;
  RAW.val[2]=ran>>16;
  RAW.val[3]=ran>>24;
  for (i=0;i<100;i++) RAW.val[i]=i;
  /* initialise strong RNG */
  CREATE_CSPRNG(&RNG,&RAW);   

  SALT.len=8;
  for (i=0;i<8;i++) SALT.val[i]=i+1;  // set Salt

  printf("Alice's Passphrase= %s\n",pp);

  OCT_empty(&PW);
  OCT_jstring(&PW,pp);   // set Password from string

  /* private key S0 of size EGS bytes derived from Password and Salt */
  PBKDF2(&PW,&SALT,1000,EGS,&S0);
  printf("Alices private key= 0x"); OCT_output(&S0);

  /* Generate Key pair S/W */
  ECP_KEY_PAIR_GENERATE(NULL,&S0,&W0); 

  res=ECP_PUBLIC_KEY_VALIDATE(1,&W0);
  if (res!=0)
  {
    printf("ECP Public Key is invalid!\n");
    return 1;
  }

  printf("Alice's public key= 0x");  OCT_output(&W0);

  /* Random private key for other party */
  ECP_KEY_PAIR_GENERATE(&RNG,&S1,&W1);
  res=ECP_PUBLIC_KEY_VALIDATE(1,&W1);
  if (res!=0)
  {
    printf("ECP Public Key is invalid!\n");
    return 1;
  }
  printf("Servers private key= 0x");  OCT_output(&S1);
  printf("Servers public key= 0x");   OCT_output(&W1);

  /* Calculate common key using DH - IEEE 1363 method */
  ECPSVDP_DH(&S0,&W1,&Z0);
  ECPSVDP_DH(&S1,&W0,&Z1);
  
  if (!OCT_comp(&Z0,&Z1))
  {
    printf("*** ECPSVDP-DH Failed\n");
    return 0;
  }

  KDF2(&Z0,NULL,EAS,&KEY);

  printf("Alice's DH Key=  0x"); OCT_output(&KEY);
  printf("Servers DH Key=  0x"); OCT_output(&KEY);

  printf("Testing ECIES\n");

  P1.len=3; P1.val[0]=0x0; P1.val[1]=0x1; P1.val[2]=0x2; 
  P2.len=4; P2.val[0]=0x0; P2.val[1]=0x1; P2.val[2]=0x2; P2.val[3]=0x3; 

  M.len=17;
  for (i=0;i<=16;i++) M.val[i]=i; 

  ECP_ECIES_ENCRYPT(&P1,&P2,&RNG,&W1,&M,12,&V,&C,&T);

  printf("Ciphertext= \n"); 
  printf("V= 0x"); OCT_output(&V);
  printf("C= 0x"); OCT_output(&C);
  printf("T= 0x"); OCT_output(&T);

  if (!ECP_ECIES_DECRYPT(&P1,&P2,&V,&C,&T,&S1,&M))
  {
    printf("*** ECIES Decryption Failed\n");
    return 1;
  }
  else printf("Decryption succeeded\n");

  printf("Message is 0x"); OCT_output(&M);

  printf("Testing ECDSA\n");

  if (ECPSP_DSA(&RNG,&S0,&M,&CS,&DS)!=0)
  {
    printf("***ECDSA Signature Failed\n");
    return 1;
  }

  printf("Signature C = 0x"); OCT_output(&CS);
  printf("Signature D = 0x"); OCT_output(&DS);

  if (ECPVP_DSA(&W0,&M,&CS,&DS)!=0)
  {
    printf("***ECDSA Verification Failed\n");
    return 1;
  }
  else printf("ECDSA Signature/Verification succeeded %d\n",j);

  KILL_CSPRNG(&RNG);

  printf("SUCCESS\n");
  return 0;
}

