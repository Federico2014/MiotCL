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

/**
 * @file ecdh.h
 * @author Mike Scott and Kealan McCusker
 * @date 2nd June 2015
 * @brief ECDH Header file for implementation of standard EC protocols
 *
 * declares functions
 * 
 */

#ifndef ECDH_H
#define ECDH_H

#include "miotcl.h"

#define EAS 16 /**< Symmetric Key size - 128 bits */
#define EGS 32 /**< ECC Group Size */
#define EFS 32 /**< ECC Field Size */

#define ECDH_OK                     0     /**< Function completed without error */
/*#define ECDH_DOMAIN_ERROR          -1*/
#define ECDH_INVALID_PUBLIC_KEY    -2	/**< Public Key is Invalid */
#define ECDH_ERROR                 -3	/**< ECDH Internal Error */
#define ECDH_INVALID               -4	/**< ECDH Internal Error */
/*#define ECDH_DOMAIN_NOT_FOUND      -5
#define ECDH_OUT_OF_MEMORY         -6
#define ECDH_DIV_BY_ZERO           -7
#define ECDH_BAD_ASSUMPTION        -8*/

/* ECDH Auxiliary Functions */

/**	@brief Initialise a random number generator
 *
	@param R is a pointer to a cryptographically secure random number generator
	@param S is an input truly random seed value
 */
extern void CREATE_CSPRNG(csprng *R,octet *S);
/**	@brief Kill a random number generator
 *
	Deletes all internal state
	@param R is a pointer to a cryptographically secure random number generator
 */
extern void KILL_CSPRNG(csprng *R);
/**	@brief hash an octet into another octet
 *
	@param I input octet
	@param O output octet - H(I)
 */
extern void HASH(octet *I,octet *O);
/**	@brief HMAC of message M using key K to create tag of length len in octet tag
 *
	IEEE-1363 MAC1 function. Uses SHA256 internally.
	@param M input message octet
	@param K input encryption key
	@param len is output desired length of HMAC tag
	@param tag is the output HMAC
	@return 0 for bad parameters, else 1
 */
extern int HMAC(octet *M,octet *K,int len,octet *tag);

/*extern void KDF1(octet *,int,octet *);*/

/**	@brief Key Derivation Function - generates key K from inputs Z and P
 *
	IEEE-1363 KDF2 Key Derivation Function. Uses SHA256 internally.
	@param Z input octet
	@param P input key derivation parameters - can be NULL
	@param len is output desired length of key
	@param K is the derived key
 */
extern void KDF2(octet *Z,octet *P,int len,octet *K);
/**	@brief Password Based Key Derivation Function - generates key K from password, salt and repeat counter
 *
	PBKDF2 Password Based Key Derivation Function. Uses SHA256 internally.
	@param P input password
	@param S input salt
	@param rep Number of times to be iterated.
	@param len is output desired length of key
	@param K is the derived key
 */
extern void PBKDF2(octet *P,octet *S,int rep,int len,octet *K);
/**	@brief AES encrypts a plaintext to a ciphtertext
 *
	IEEE-1363 AES_CBC_IV0_ENCRYPT function. Encrypts in CBC mode with a zero IV, padding as necessary to create a full final block.
	@param K AES key
	@param P input plaintext octet
	@param C output ciphertext octet
 */
extern void AES_CBC_IV0_ENCRYPT(octet *K,octet *P,octet *C);
/**	@brief AES encrypts a plaintext to a ciphtertext
 *
	IEEE-1363 AES_CBC_IV0_DECRYPT function. Decrypts in CBC mode with a zero IV.
	@param K AES key
	@param C input ciphertext octet
	@param P output plaintext octet
	@return 0 if bad input, else 1
 */
extern int AES_CBC_IV0_DECRYPT(octet *K,octet *C,octet *P);

/* ECDH primitives - support functions */
/**	@brief Generate an ECC public/private key pair
 *
	@param R is a pointer to a cryptographically secure random number generator
	@param s the private key, an output internally randomly generated if R!=NULL, otherwise must be provided as an input
	@param W the output public key, which is s.G, where G is a fixed generator
	@return 0 or an error code
 */
extern int  ECP_KEY_PAIR_GENERATE(csprng *R,octet *s,octet *W);
/**	@brief Validate an ECC public key
 *
	@param f if = 0 just does some simple checks, else tests that W is of the correct order
	@param W the input public key to be validated
	@return 0 if public key is OK, or an error code
 */
extern int  ECP_PUBLIC_KEY_VALIDATE(int f,octet *W);

/* ECDH primitives */

/**	@brief Generate Diffie-Hellman shared key
 *
	IEEE-1363 Diffie-Hellman shared secret calculation
	@param s is the input private key,
	@param W the input public key of the other party
	@param K the output shared key, in fact the x-coordinate of s.W
	@return 0 or an error code
 */
extern int ECPSVDP_DH(octet *s,octet *W,octet *K);
/*extern int ECPSVDP_DHC(octet *,octet *,int,octet *);*/

/*#if CURVETYPE!=MONTGOMERY */
/* ECIES functions */
/**	@brief ECIES Encryption
 *
	IEEE-1363 ECIES Encryption
	@param P1 input Key Derivation parameters
	@param P2 input Encoding parameters
	@param R is a pointer to a cryptographically secure random number generator
	@param W the input public key of the recieving party
	@param M is the plaintext message to be encrypted
	@param len the length of the HMAC tag
	@param V component of the output ciphertext
	@param C the output ciphertext
	@param T the output HMAC tag, part of the ciphertext
 */
extern void ECP_ECIES_ENCRYPT(octet *P1,octet *P2,csprng *R,octet *W,octet *M,int len,octet *V,octet *C,octet *T);
/**	@brief ECIES Decryption
 *
	IEEE-1363 ECIES Decryption
	@param P1 input Key Derivation parameters
	@param P2 input Encoding parameters
	@param V component of the input ciphertext
	@param C the input ciphertext
	@param T the input HMAC tag, part of the ciphertext
	@param U the input private key for decryption
	@param M the output plaintext message
	@return 1 if successful, else 0
 */
extern int ECP_ECIES_DECRYPT(octet *P1,octet *P2,octet *V,octet *C,octet *T,octet *U,octet *M);

/* ECDSA functions */
/**	@brief ECDSA Signature
 *
	IEEE-1363 ECDSA Signature
	@param R is a pointer to a cryptographically secure random number generator
	@param s the input private signing key
	@param M the input message to be signed
	@param c component of the output signature
	@param d component of the output signature

 */
extern int ECPSP_DSA(csprng *R,octet *s,octet *M,octet *c,octet *d);
/**	@brief ECDSA Signature Verification
 *
	IEEE-1363 ECDSA Signature Verification
	@param W the input public key
	@param M the input message
	@param c component of the input signature
	@param d component of the input signature
	@return 0 or an error code
 */
extern int ECPVP_DSA(octet *W,octet *M,octet *c,octet *d);
/*#endif*/

#endif

