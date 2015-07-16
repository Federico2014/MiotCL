//
//  TestECDH.swift
//  miot2
//
//  Created by Michael Scott on 02/07/2015.
//  Copyright (c) 2015 Michael Scott. All rights reserved.
//

import Foundation
import clint

public func TestECDH()
{
    var pp=String("M0ng00se");
    
    let EGS=ECDH.EGS
    let EFS=ECDH.EFS
    let EAS=AES.KS
    
    var S1=[UInt8](count:EGS,repeatedValue:0)
    var W0=[UInt8](count:2*EFS+1,repeatedValue:0)
    var W1=[UInt8](count:2*EFS+1,repeatedValue:0)
    var Z0=[UInt8](count:EFS,repeatedValue:0)
    var Z1=[UInt8](count:EFS,repeatedValue:0)
    var RAW=[UInt8](count:100,repeatedValue:0)
    var SALT=[UInt8](count:8,repeatedValue:0)
    var P1=[UInt8](count:3,repeatedValue:0)
    var P2=[UInt8](count:4,repeatedValue:0)
    var V=[UInt8](count:2*EFS+1,repeatedValue:0)
    var M=[UInt8](count:17,repeatedValue:0)
    var T=[UInt8](count:12,repeatedValue:0)
    var CS=[UInt8](count:EGS,repeatedValue:0)
    var DS=[UInt8](count:EGS,repeatedValue:0)
    
    var rng=RAND()
    
    rng.clean();
    for var i=0;i<100;i++ {RAW[i]=UInt8(i&0xff)}
    
    rng.seed(100,RAW)
    
    
    for var i=0;i<8;i++ {SALT[i]=UInt8(i+1)}  // set Salt
    
    println("Alice's Passphrase= "+pp)
    var PW=[UInt8](pp.utf8)
    
    /* private key S0 of size EGS bytes derived from Password and Salt */
    
    var S0=ECDH.PBKDF2(PW,SALT,1000,EGS)
    print("Alice's private key= 0x"); ECDH.printBinary(S0)
    
    /* Generate Key pair S/W */
    ECDH.KEY_PAIR_GENERATE(nil,&S0,&W0);
    
    print("Alice's public key= 0x"); ECDH.printBinary(W0)
    
    var res=ECDH.PUBLIC_KEY_VALIDATE(true,W0);

    if res != 0
    {
        println("ECP Public Key is invalid!");
        return;
    }
    
    /* Random private key for other party */
    ECDH.KEY_PAIR_GENERATE(rng,&S1,&W1)
    
    print("Servers private key= 0x"); ECDH.printBinary(S1)
    
    print("Servers public key= 0x"); ECDH.printBinary(W1);
    
    res=ECDH.PUBLIC_KEY_VALIDATE(true,W1)
    if res != 0
    {
        println("ECP Public Key is invalid!")
        return
    }
    
    /* Calculate common key using DH - IEEE 1363 method */
    
    ECDH.ECPSVDP_DH(S0,W1,&Z0)
    ECDH.ECPSVDP_DH(S1,W0,&Z1)
    
    var same=true
    for var i=0;i<EFS;i++
    {
        if Z0[i] != Z1[i] {same=false}
    }
    
    if (!same)
    {
        println("*** ECPSVDP-DH Failed")
        return
    }
    
    var KEY=ECDH.KDF1(Z0,EAS)
    
    print("Alice's DH Key=  0x"); ECDH.printBinary(KEY)
    print("Servers DH Key=  0x"); ECDH.printBinary(KEY)

    println("Testing ECIES")
    
    P1[0]=0x0; P1[1]=0x1; P1[2]=0x2
    P2[0]=0x0; P2[1]=0x1; P2[2]=0x2; P2[3]=0x3
    
    for var i=0;i<=16;i++ {M[i]=UInt8(i&0xff)}
    
    var C=ECDH.ECIES_ENCRYPT(P1,P2,rng,W1,M,&V,&T)

    println("Ciphertext= ")
    print("V= 0x"); ECDH.printBinary(V)
    print("C= 0x"); ECDH.printBinary(C)
    print("T= 0x"); ECDH.printBinary(T)

    M=ECDH.ECIES_DECRYPT(P1,P2,V,C,T,S1)
    if M.count==0
    {
        println("*** ECIES Decryption Failed\n")
        return
    }
    else {println("Decryption succeeded")}
    
    print("Message is 0x"); ECDH.printBinary(M)
    
    println("Testing ECDSA")

    if ECDH.ECPSP_DSA(rng,S0,M,&CS,&DS) != 0
    {
        println("***ECDSA Signature Failed")
        return
    }
    println("Signature= ")
    print("C= 0x"); ECDH.printBinary(CS)
    print("D= 0x"); ECDH.printBinary(DS)
    
    if ECDH.ECPVP_DSA(W0,M,CS,DS) != 0
    {
        println("***ECDSA Verification Failed")
        return
    }
    else {println("ECDSA Signature/Verification succeeded ")}

}

TestECDH()
