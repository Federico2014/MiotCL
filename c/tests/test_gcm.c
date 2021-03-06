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

#include <stdlib.h> 
#include <string.h>
#include "miotcl.h"
#include "sok.h"
#include "utils.h"


int main()
{
  char* KT="feffe9928665731c6d6a8f9467308308";
  char* MT="d9313225f88406e5a55909c5aff5269a86a7a9531534f7da2e4c303d8a318a721c3c0c95956809532fcf0e2449a6b525b16aedf5aa0de657ba637b39";
  char* HT="feedfacedeadbeeffeedfacedeadbeefabaddad2";
  char* NT="9313225df88406e555909c5aff5269aa6a7a9538534f7da1e4c303d2a318a728c3c0c95156809539fcf0e2429a6b525416aedbf5a0de6a57a637b39b";
  // Tag should be 619cc5aefffe0bfa462af43c1699d050

  int lenM=strlen(MT)/2;
  int lenH=strlen(HT)/2;
  int lenK=strlen(KT)/2;
  int lenIV=strlen(NT)/2;

  char t1[16];  // Tag
  char t2[16];  // Tag
  char k[16];   // AES Key
  char h[64];   // Header - to be included in Authentication, but not encrypted
  char iv[100]; // IV - Initialisation vector
  char m[100];  // Plaintext to be encrypted/authenticated
  char c[100];  // Ciphertext
  char p[100];  // Recovered Plaintext 
  octet T1={sizeof(t1),sizeof(t1),t1};
  octet T2={sizeof(t2),sizeof(t2),t2};
  octet K={0,sizeof(k),k};
  octet H={0,sizeof(h),h};
  octet IV={0,sizeof(iv),iv};
  octet M={0,sizeof(m),m};
  octet C={0,sizeof(c),c};
  octet P={0,sizeof(p),p};
  M.len=lenM;
  K.len=lenK;
  H.len=lenH;
  IV.len=lenIV;

  hex2bytes(MT, m);
  hex2bytes(HT, h);
  hex2bytes(NT, iv);
  hex2bytes(KT, k);

  printf("Plaintext: ");
  OCT_output(&M);
  printf("\n");

  AES_GCM_ENCRYPT(&K, &IV, &H, &M, &C, &T1);

  printf("Ciphertext: ");
  OCT_output(&C);
  printf("\n");
  
  printf("Encryption Tag: ");
  OCT_output(&T1);
  printf("\n");

  AES_GCM_DECRYPT(&K, &IV, &H, &C, &P, &T2);

  printf("Plaintext: ");
  OCT_output(&P);
  printf("\n");

  printf("Decryption Tag: "); 
  OCT_output(&T2);
  printf("\n");

  if (!OCT_comp(&M,&P))
    {
      printf("FAILURE Decryption\n");
      return 1;
    }

  if (!OCT_comp(&T1,&T2))
    {
      printf("FAILURE TAG mismatch\n");
      return 1;
    }

  printf("SUCCESS\n");
  return 0;
}

