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

/* Fixed Data in ROM - Field and Curve parameters */

public class ROM
{
/* Don't Modify from here... */
	public static final int NOT_SPECIAL=0;
	public static final int PSEUDO_MERSENNE=1;
	public static final int MONTGOMERY_FRIENDLY=2;
	public static final int WEIERSTRASS=0;
	public static final int EDWARDS=1;
	public static final int MONTGOMERY=2;
/* ...to here */

/*** Enter Some Field details here  ***/
// BN Curve
	public static final int MODBITS=254; /* Number of bits in Modulus */
	public static final int MOD8=3;  /* Modulus mod 8 */
// Curve 25519
//	public static final int MODBITS=255; 
//	public static final int MOD8=5;  
// NIST256 or Brainpool
//	public static final int MODBITS=256; 
//	public static final int MOD8=7;  
// MF254 
//	public static final int MODBITS=254; 
//	public static final int MOD8=7;  
// MS255
//public static final int MODBITS= 255;
//public static final int MOD8= 3;
// MF256
//	public static final int MODBITS=256; 
//	public static final int MOD8=7;  
// MS256
//public static final int MODBITS= 256;
//public static final int MOD8= 3;
// ANSSI
// public static final int MODBITS= 256;
// public static final int MOD8= 3;

/* Don't Modify from here... */
	public static final int NLEN=9;
	public static final int CHUNK=32;
	public static final int DNLEN=2*NLEN;
	public static final int BASEBITS=29;
	public static final int MASK=(((int)1<<BASEBITS)-1);
	public static final int MODBYTES=32;
	public static final int NEXCESS =((int)1<<(CHUNK-BASEBITS-1));
	public static final int FEXCESS =((int)1<<(BASEBITS*NLEN-MODBITS)); 
	public static final int OMASK=(int)(-1)<<(MODBITS%BASEBITS);
	public static final int TBITS=MODBITS%BASEBITS; // Number of active bits in top word 
	public static final int TMASK=((int)1<<TBITS)-1;
/* ...to here */


/* Finite field support - for RSA, DH etc. */
	public static final int FF_BITS=2048; /* Finite Field Size in bits - must be 256.2^n */
	public static final int FFLEN=(FF_BITS/256);
	public static final int HFLEN=(FFLEN/2);  /* Useful for half-size RSA private key operations */


// START SPECIFY FIELD DETAILS HERE
//*********************************************************************************
// Curve25519 Modulus 
// 	public static final int MODTYPE=PSEUDO_MERSENNE;
//	public static final int[] Modulus={0x1FFFFFED,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
//	public static final int MConst=19;

// NIST-256 Modulus 
//	public static final int MODTYPE=NOT_SPECIAL;
//	public static final int[] Modulus={0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FF,0x0,0x0,0x40000,0x1FE00000,0xFFFFFF};
//	public static final int MConst=1;

// MF254 Modulus
//	public static final int MODTYPE=MONTGOMERY_FRIENDLY;
//	public static final int[] Modulus={0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3F80FF};
//	public static final int MConst=0x3F8100;

// MS255 Modulus
//public static final int MODTYPE= 1;
//public static final int[] Modulus= {0x1FFFFD03,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
//public static final int MConst=0x2FD;

// MS256 Modulus
//public static final int MODTYPE= 1;
//public static final int[] Modulus= {0x1FFFFF43,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFFFFF};
//public static final int MConst=0xBD;

// MF256 Modulus
//public static final int MODTYPE= 3;
//public static final int[] Modulus= {0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFA7FF};
//public static final int MConst=0xFFA800;

// Brainpool Modulus
//	public static final int MODTYPE= 0;
//	public static final int[] Modulus= {0x1F6E5377,0x9A40E8,0x9880A08,0x17EC47AA,0x18D726E3,0x5484EC1,0x6F0F998,0x1B743DD5,0xA9FB57};
//	public static final int MConst=0xEFD89B9;

// ANSSI Modulus
//  public static final int MODTYPE= 0;
//  public static final int[] Modulus= {0x186E9C03,0x7E79A9E,0x12329B7A,0x35B7957,0x435B396,0x16F46721,0x163C4049,0x1181675A,0xF1FD17};
//  public static final int MConst=0x164E1155;


// BNCX Curve Modulus
	public static final int MODTYPE=NOT_SPECIAL;
	public static final int[] Modulus= {0x1C1B55B3,0x13311F7A,0x24FB86F,0x1FADDC30,0x166D3243,0xFB23D31,0x836C2F7,0x10E05,0x240000};
	public static final int MConst=0x19789E85;

// BN Curve Modulus
//public static final int MODTYPE=NOT_SPECIAL;
//public static final int[] Modulus= {0x13,0x18000000,0x4E9,0x2000000,0x8612,0x6C00000,0x6E8D1,0x10480000,0x252364};
//public static final int MConst=0x179435E5;

// BNT Curve Modulus
//public static final int MODTYPE=NOT_SPECIAL;
//public static final int[] Modulus= {0xEB4A713,0x14EDDFF7,0x1D192EAF,0x14AAAC29,0xD5F06E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120};
//public static final int MConst=0x1914C4E5;

// BNT2 Curve Modulus
//	public static final int MODTYPE=NOT_SPECIAL;
//	public static final int[] Modulus= {0x1460A48B,0x596E15D,0x1C35947A,0x1F27C851,0x1D00081C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004};
//	public static final int MConst=0x6505CDD;

// START SPECIFY CURVE DETAILS HERE
//*********************************************************************************
// Original Curve25519 
// 	public static final int CURVETYPE=MONTGOMERY;
//	public static final int CURVE_A =486662;
//	public static final int[] CURVE_B = {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
//	public static final int[] CURVE_Order={0x1CF5D3ED,0x9318D2,0x1DE73596,0x1DF3BD45,0x14D,0x0,0x0,0x0,0x100000};
//	public static final int[] CURVE_Gx ={0x9,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//	public static final int[] CURVE_Gy ={0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used


// Ed25519 Curve 
//	public static final int CURVETYPE=EDWARDS;
//	public static final int CURVE_A = -1;
//	public static final int[] CURVE_B = {0x135978A3,0xF5A6E50,0x10762ADD,0x149A82,0x1E898007,0x3CBBBC,0x19CE331D,0x1DC56DFF,0x52036C};
//	public static final int[] CURVE_Order={0x1CF5D3ED,0x9318D2,0x1DE73596,0x1DF3BD45,0x14D,0x0,0x0,0x0,0x100000};
//	public static final int[] CURVE_Gx ={0xF25D51A,0xAB16B04,0x969ECB2,0x198EC12A,0xDC5C692,0x1118FEEB,0xFFB0293,0x1A79ADCA,0x216936};
//	public static final int[] CURVE_Gy={0x6666658,0x13333333,0x19999999,0xCCCCCCC,0x6666666,0x13333333,0x19999999,0xCCCCCCC,0x666666};

// WS25519 Curve
//	public static final int CURVETYPE=WEIERSTRASS;
//	public static final int CURVE_A = -3;
//	public static final int[] CURVE_B = {0x28,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//	public static final int[] CURVE_Order = {0x1728ACA1,0x8E7230C,0x10E8DCDB,0x1C1FC966,0x5D5,0x0,0x0,0x0,0x800000}; 
//	public static final int[] CURVE_Gx={0x14D8261F,0x23A9C3B,0x1E392613,0xE9D560D,0x19BD0F9A,0x1A9EF052,0xCFB499,0x4242BE1,0x67E3F5};
//	public static final int[] CURVE_Gy={0x1DEEF38,0x1A31963F,0x4871D5,0x16572E70,0x1DEA014C,0x1AE6A722,0x165D7907,0x1903CD0B,0x36856};

// NIST-256 Curve
//	public static final int CURVETYPE=WEIERSTRASS;
//	public static final int CURVE_A = -3;
//	public static final int[] CURVE_B={0x7D2604B,0x1E71E1F1,0x14EC3D8E,0x1A0D6198,0x86BC651,0x1EAABB4C,0xF9ECFAE,0x1B154752,0x5AC635};
//	public static final int[] CURVE_Order={0x1C632551,0x1DCE5617,0x5E7A13C,0xDF55B4E,0x1FFFFBCE,0x1FFFFFFF,0x3FFFF,0x1FE00000,0xFFFFFF}; 
//	public static final int[] CURVE_Gx={0x1898C296,0x509CA2E,0x1ACCE83D,0x6FB025B,0x40F2770,0x1372B1D2,0x91FE2F3,0x1E5C2588,0x6B17D1};
//	public static final int[] CURVE_Gy={0x17BF51F5,0x1DB20341,0xC57B3B2,0x1C66AED6,0x19E162BC,0x15A53E07,0x1E6E3B9F,0x1C5FC34F,0x4FE342};
//
// MF254 Modulus, Weierstrass Curve w-254-mont
//public static final int CURVETYPE= 0;
//public static final int CURVE_A = -3;
//public static final int[] CURVE_B = {0x1FFFD08D,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3F80FF};
//public static final int[] CURVE_Order={0xF8DF83F,0x1D20CE25,0x8DD701B,0x317D41B,0x1FFFFEB8,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3F80FF};
//public static final int[] CURVE_Gx ={0x2,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0x190D4EBC,0xB2EF9BF,0x14464C6B,0xE71C7F0,0x18AEBDFB,0xD3ADEBB,0x18052B85,0x1A6765CA,0x140E3F};

// MF254 Modulus, Edwards Curve ed-254-mont
//public static final int CURVETYPE= 1;
//public static final int CURVE_A = -1;
//public static final int[] CURVE_B = {0x367B,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Order={0x46E98C7,0x179E9FF6,0x158BEC3A,0xA60D917,0x1FFFFEB9,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFE03F};
//public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0xF2701E5,0x29687ED,0xC84861F,0x535081C,0x3F4E363,0x6A811B,0xCD65474,0x121AD498,0x19F0E6};

// MF254 Modulus, Montgomery Curve
// 	public static final int CURVETYPE=MONTGOMERY;
//	public static final int CURVE_A =-55790;
//	public static final int[] CURVE_B = {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
//	public static final int[] CURVE_Order={0x46E98C7,0x179E9FF6,0x158BEC3A,0xA60D917,0x1FFFFEB9,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFE03F};
//	public static final int[] CURVE_Gx ={0x3,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//	public static final int[] CURVE_Gy ={0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used

// MS255 Modulus, Weierstrass Curve
//public static final int CURVETYPE= 0;
//public static final int CURVE_A = -3;
//public static final int[] CURVE_B = {0x1FFFAB46,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
//public static final int[] CURVE_Order={0x1C594AEB,0x1C7D64C1,0x14ACF7EA,0x14705075,0x1FFFF864,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x7FFFFF};
//public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0x9CB44BA,0x199FFB3B,0x1F698345,0xD8F19BB,0x17D177DB,0x1FFCD97F,0xCE487A,0x181DB74F,0x6F7A6A};

// MS255 Modulus, Edwards Curve
//public static final int CURVETYPE= 1;
//public static final int CURVE_A = -1;
//public static final int[] CURVE_B = {0xEA97,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Order={0x436EB75,0x24E8F68,0x9A0CBAB,0x34F0BDB,0x1FFFFDCF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFF};
//public static final int[] CURVE_Gx ={0x4,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0x108736A0,0x11512ADE,0x1116916E,0x29715DA,0x47E5529,0x66EC706,0x1517B095,0xA694F76,0x26CB78};

// MS255 Modulus, Montgomery Curve
// 	public static final int CURVETYPE=MONTGOMERY;
//	public static final int CURVE_A =-240222;
//	public static final int[] CURVE_B = {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
//	public static final int[] CURVE_Order={0x436EB75,0x24E8F68,0x9A0CBAB,0x34F0BDB,0x1FFFFDCF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFF};
//	public static final int[] CURVE_Gx ={0x4,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//	public static final int[] CURVE_Gy ={0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used

// MS256, Weierstrass Curve
//public static final int CURVETYPE= 0;
//public static final int CURVE_A = -3;
//public static final int[] CURVE_B = {0x25581,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Order={0x751A825,0x559014A,0x9971808,0x1904EBD4,0x1FFFFE43,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFFFFF};
//public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0x2B56C77,0x1FA31836,0x253B042,0x185F26EB,0xDD6BD02,0x4B66777,0x1B5FF20B,0xA783C8C,0x696F18};

// MS256, Edwards Curve
//public static final int CURVETYPE= 1;
//public static final int CURVE_A = -1;
//public static final int[] CURVE_B = {0x3BEE,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Order={0x1122B4AD,0xDC27378,0x9AF1939,0x154AB5A1,0x1FFFFBE6,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FFFFF};
//public static final int[] CURVE_Gx ={0xD,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0x131CADBA,0x3FB7DA9,0x134C0FDC,0x14DAC704,0x46BFBE2,0x1859CFD0,0x1B6E8F4C,0x3C5424E,0x7D0AB4};

// MS256 Modulus, Montgomery Curve
// 	public static final int CURVETYPE=MONTGOMERY;
//	public static final int CURVE_A =-61370;
//	public static final int[] CURVE_B = {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
//  public static final int[] CURVE_Order={0x1122B4AD,0xDC27378,0x9AF1939,0x154AB5A1,0x1FFFFBE6,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FFFFF};
//	public static final int[] CURVE_Gx ={0xb,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//	public static final int[] CURVE_Gy ={0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used

// MF256 Modulus, Weierstrass Curve
//public static final int CURVETYPE= 0;
//public static final int CURVE_A = -3;
//public static final int[] CURVE_B = {0x14E6A,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Order={0x79857EB,0x8862F0D,0x1941D2E7,0x2EA27CD,0x1FFFFFC5,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0xFFA7FF};
//public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0xB724D2A,0x3CAA61,0x5371984,0x128FD71B,0x1AE28956,0x1D13091E,0x339EEAE,0x10F7C301,0x20887C};

// MF256, Edwards Curve
//public static final int CURVETYPE= 1;
//public static final int CURVE_A = -1;
//public static final int[] CURVE_B = {0x350A,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Order={0x18EC7BAB,0x16C976F6,0x19CCF259,0x9775F70,0x1FFFFB15,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FE9FF};
//public static final int[] CURVE_Gx ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//public static final int[] CURVE_Gy ={0x12F3C908,0xF553917,0x1FA9A35F,0xBCC91B,0x1AACA0C,0x1779ED96,0x156BABAF,0x1F1F1989,0xDAD8D4};

// MF256 Modulus, Montgomery Curve
// 	public static final int CURVETYPE=MONTGOMERY;
//	public static final int CURVE_A =-54314;
//	public static final int[] CURVE_B = {0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used
//  public static final int[] CURVE_Order={0x18EC7BAB,0x16C976F6,0x19CCF259,0x9775F70,0x1FFFFB15,0x1FFFFFFF,0x1FFFFFFF,0x1FFFFFFF,0x3FE9FF};
//	public static final int[] CURVE_Gx ={0x8,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
//	public static final int[] CURVE_Gy ={0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0}; // not used

// Brainpool
//	public static final int CURVETYPE= 0;
//	public static final int CURVE_A = -3;
//	public static final int[] CURVE_B = {0x1EE92B04,0x172C080F,0xBD2495A,0x7D7895E,0x176B7BF9,0x13B99E85,0x1A93F99A,0x18861B09,0x662C61};
//	public static final int[] CURVE_Order={0x174856A7,0xF07414,0x1869BDE4,0x12F5476A,0x18D718C3,0x5484EC1,0x6F0F998,0x1B743DD5,0xA9FB57};
//	public static final int[] CURVE_Gx ={0xE1305F4,0xD0C8AB1,0xBEF0ADE,0x28588F5,0x16149AFA,0x9D91D32,0x1EDDCC88,0x79839FC,0xA3E8EB};
//	public static final int[] CURVE_Gy ={0x1B25C9BE,0xD5F479A,0x1409C007,0x196DBC73,0x417E69B,0x1170A322,0x15B5FDEC,0x10468738,0x2D996C};

// ANSSI
//  public static final int CURVETYPE= 0;
//  public static final int CURVE_A = -3;
//  public static final int[] CURVE_B = {0x1B7BB73F,0x3AF6CB3,0xC68600C,0x181935C9,0xC00FDFE,0x1D3AA522,0x4C0352A,0x194A8515,0xEE353F};
//  public static final int[] CURVE_Order={0x6D655E1,0x1FEEA2CE,0x14AFE507,0x18CFC281,0x435B53D,0x16F46721,0x163C4049,0x1181675A,0xF1FD17};
//  public static final int[] CURVE_Gx ={0x198F5CFF,0x64BD16E,0x62DC059,0xFA5B95F,0x23958C2,0x1EA3A4EA,0x7ACC460,0x186AD827,0xB6B3D4};
//  public static final int[] CURVE_Gy ={0x14062CFB,0x188AD0AA,0x19327860,0x3860FD1,0xEF8C270,0x18F879F6,0x12447E49,0x1EF91640,0x6142E0};

// BNCX Curve 

	public static final int CURVETYPE=WEIERSTRASS;
	public static final int CURVE_A = 0;
	public static final int[] CURVE_B = {0x2,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Order={0x16EB1F6D,0x108E0531,0x1241B3AF,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000};
	public static final int[] CURVE_Bnx={0x3C012B1,0x0,0x10,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Cru={0x14235C97,0xF0498BC,0x1BE1D58C,0x1BBEC8E3,0x3F1440B,0x654,0x12000,0x0,0x0};
	public static final int[] CURVE_Fra={0x15C80EA3,0x1EC8419A,0x1CFE0856,0xEE64DE2,0x11898686,0x5C55653,0x592BF86,0x5F4C740,0x135908};
	public static final int[] CURVE_Frb={0x6534710,0x1468DDE0,0x551B018,0x10C78E4D,0x4E3ABBD,0x9ECE6DE,0x2A40371,0x1A0C46C5,0x10A6F7};
	public static final int[] CURVE_Pxa={0x4D2EC74,0x428E777,0xF89C9B0,0x190B7F40,0x14BBB907,0x12807AE1,0x958D62C,0x58E0A76,0x19682D};
	public static final int[] CURVE_Pxb={0xE29CFE1,0x1D2C7459,0x270C3D1,0x172F6184,0x19743F81,0x49BD474,0x192A8047,0x1D87C33E,0x1466B9};
	public static final int[] CURVE_Pya={0xF0BE09F,0x7DFE75E,0x1FB06CC3,0x3667B08,0xE209636,0x110ABED7,0xE376078,0x1B2E4665,0xA79ED};
	public static final int[] CURVE_Pyb={0x898EE9D,0xC825914,0x14BB7AFB,0xC9D4AD3,0x13461C28,0x122896C6,0x240D71B,0x73D9898,0x6160C};
	public static final int[] CURVE_Gx ={0x1C1B55B2,0x13311F7A,0x24FB86F,0x1FADDC30,0x166D3243,0xFB23D31,0x836C2F7,0x10E05,0x240000};
	public static final int[] CURVE_Gy ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[][] CURVE_W={{0x162FEB83,0x2A31A48,0x100E0480,0x16,0x600,0x0,0x0,0x0,0x0},{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0}};
	public static final int[][][] CURVE_SB={{{0x1DB010E4,0x2A31A48,0x100E04A0,0x16,0x600,0x0,0x0,0x0,0x0},{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xBB33EA,0xDEAEAE9,0x233AF2F,0x1FADDC03,0x166D2643,0xFB23D31,0x836C2F7,0x10E05,0x240000}}};
	public static final int[][] CURVE_WB={{0x167A84B0,0xE108C2,0x1004AC10,0x7,0x200,0x0,0x0,0x0,0x0},{0x1E220475,0x166FCCAD,0x129FE68D,0x1D29DB51,0x2A0DC07,0x438,0xC000,0x0,0x0},{0xF10B93,0x1B37E657,0x194FF34E,0x1E94EDA8,0x1506E03,0x21C,0x6000,0x0,0x0},{0x1DFAAA11,0xE108C2,0x1004AC30,0x7,0x200,0x0,0x0,0x0,0x0}};
	public static final int[][][] CURVE_BB={{{0x132B0CBD,0x108E0531,0x1241B39F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000},{0x132B0CBC,0x108E0531,0x1241B39F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000},{0x132B0CBC,0x108E0531,0x1241B39F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000},{0x7802562,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x132B0CBC,0x108E0531,0x1241B39F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000},{0x132B0CBD,0x108E0531,0x1241B39F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000},{0x132B0CBC,0x108E0531,0x1241B39F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000}},{{0x7802562,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x7802561,0x0,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x3C012B2,0x0,0x10,0x0,0x0,0x0,0x0,0x0,0x0},{0xF004AC2,0x0,0x40,0x0,0x0,0x0,0x0,0x0,0x0},{0xF6AFA0A,0x108E0531,0x1241B38F,0x1FADDC19,0x166D2C43,0xFB23D31,0x836C2F7,0x10E05,0x240000},{0x3C012B2,0x0,0x10,0x0,0x0,0x0,0x0,0x0,0x0}}};

	public static final boolean USE_GLV =true;
	public static final boolean USE_GS_G2 =true;
	public static final boolean USE_GS_GT =true;	
	public static final boolean GT_STRONG=true;

// BNT2 Curve
/*
	public static final int CURVETYPE=WEIERSTRASS;
	public static final int CURVE_A = 0;
	public static final int[] CURVE_B = {0x2,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Order={0x11AA2BF5,0x1FDB8D28,0xDCE0CF5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004};
	public static final int[] CURVE_Bnx={0x608205,0x1008,0x10,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[] CURVE_Cru={0x866BD33,0x1A813A22,0x591C3BE,0xAB6EE60,0x1ECF2367,0x361B0BD,0x12000,0x0,0x0};
	public static final int[] CURVE_Fra={0x13AEF062,0x1593464B,0x10EF3924,0x198D3667,0x17F195BB,0xFB3FD1,0xADAF429,0x11A53D19,0x124E0B};
	public static final int[] CURVE_Frb={0xB1B429,0x10039B12,0xB465B55,0x59A91EA,0x50E7261,0xF0C5DF3,0x1FDBE90F,0x1EA2E4D1,0x11B1F8};
	public static final int[] CURVE_Pxa={0x1F40A3C8,0x166491CC,0x19845E12,0xB9B49D2,0x161706B3,0xBBD82B4,0x18C609E7,0x19F2D278,0x16FC17};
	public static final int[] CURVE_Pxb={0x18549540,0x2ABD456,0x1D944184,0x16DEF7CD,0x1A95D17D,0x42B2C83,0x16427206,0x17AB2E,0x1EB5B5};
	public static final int[] CURVE_Pya={0x14220513,0x3DF6628,0x39CDEC5,0x894F10C,0x135F1268,0x1D28DC1C,0xAAA7537,0x130EC284,0x1E8EE4};
	public static final int[] CURVE_Pyb={0x177CE78E,0x1DC9947A,0x1BE95E07,0x1D6E8DC4,0x1FB8E27,0x1B549EDE,0xF6E8A75,0x19B75C67,0x23CEF4};	
	public static final int[] CURVE_Gx ={0x1460A48A,0x596E15D,0x1C35947A,0x1F27C851,0x1D00081C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004};
	public static final int[] CURVE_Gy ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
	public static final int[][] CURVE_W={{0x1347083,0x5BB1415,0xE678744,0xC0602,0x600,0x0,0x0,0x0,0x0},{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0}};
	public static final int[][][] CURVE_SB={{{0x1F5748C,0x5BB3425,0xE678764,0xC0602,0x600,0x0,0x0,0x0,0x0},{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x1075BB72,0x1A207913,0x1F6685B1,0x1F0FBC4C,0x1CFFFC1C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004}}};
	public static final int[][] CURVE_WB={{0xA70A224,0xC9396A4,0x1A228251,0x40200,0x200,0x0,0x0,0x0,0x0},{0x1030EF19,0xAD2B967,0xD50DC87,0x72CA2EC,0x148A1B9A,0x241207E,0xC000,0x0,0x0},{0x1848B88F,0x156964B7,0x6A86E4B,0x3965176,0xA450DCD,0x120903F,0x6000,0x0,0x0},{0xB31A62D,0xC93B6B4,0x1A228271,0x40200,0x200,0x0,0x0,0x0,0x0}};
	public static final int[][][] CURVE_BB={{{0x1149A9F1,0x1FDB7D20,0xDCE0CE5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004},{0x1149A9F0,0x1FDB7D20,0xDCE0CE5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004},{0x1149A9F0,0x1FDB7D20,0xDCE0CE5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004},{0xC1040A,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x1149A9F0,0x1FDB7D20,0xDCE0CE5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004},{0x1149A9F1,0x1FDB7D20,0xDCE0CE5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004},{0x1149A9F0,0x1FDB7D20,0xDCE0CE5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004}},{{0xC1040A,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xC10409,0x2010,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x608206,0x1008,0x10,0x0,0x0,0x0,0x0,0x0,0x0},{0x1820812,0x4020,0x40,0x0,0x0,0x0,0x0,0x0,0x0},{0x10E927EA,0x1FDB6D18,0xDCE0CD5,0x1F1BC24F,0x1D00021C,0x10079DC4,0xAB6DD38,0x104821EB,0x240004},{0x608206,0x1008,0x10,0x0,0x0,0x0,0x0,0x0,0x0}}};
*/

// BN Curve
/*
public static final int CURVETYPE=WEIERSTRASS;
public static final int CURVE_A = 0;
public static final int[] CURVE_B = {0x2,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
public static final int[] CURVE_Order={0xD,0x8000000,0x428,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364};
public static final int[] CURVE_Bnx={0x1,0x4000000,0x10,0x0,0x0,0x0,0x0,0x0,0x0};
public static final int[] CURVE_Cru={0x7,0xC000000,0x1B3,0x12000000,0x2490,0x11200000,0x126CD,0x0,0x0};
public static final int[] CURVE_Fra={0xF2A6DE9,0xBEF3603,0xFDDF0B8,0x12E9249A,0x953F850,0xDA85423,0x1232D926,0x32425CF,0x1B3776};
public static final int[] CURVE_Frb={0x10D5922A,0xC10C9FC,0x10221431,0xF16DB65,0x16AC8DC1,0x1917ABDC,0xDD40FAA,0xD23DA30,0x9EBEE};
public static final int[] CURVE_Pxa={0x15FD0CB4,0x1D5963C9,0x1F315F0A,0xBC633C9,0x1763B05A,0x1B927B6F,0x1FA8CD7E,0x1A9EABD4,0x95B04};
public static final int[] CURVE_Pxb={0x10962455,0x503E83C,0x9EA978E,0x1B0D7C7A,0x147F39D6,0x1FC4F02B,0x1ED2750A,0x14F81068,0x5D4D8};
public static final int[] CURVE_Pya={0x1A08A46C,0xD6E7343,0x290647E,0x105661D3,0xB1F1690,0xE261BC2,0x4FE85B4,0x17E4BCA6,0xABF2A};
public static final int[] CURVE_Pyb={0x5F306EC,0x16FC46A0,0x1744E839,0x9040ED5,0x19D6A5C0,0x138F23C0,0xAF6CE18,0x10FCCF3B,0x18769A};
public static final int[] CURVE_Gx ={0x12,0x18000000,0x4E9,0x2000000,0x8612,0x6C00000,0x6E8D1,0x10480000,0x252364};
public static final int[] CURVE_Gy ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
public static final int[][] CURVE_W={{0x3,0x0,0x81,0x3000000,0x618,0x0,0x0,0x0,0x0},{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0}};
public static final int[][][] CURVE_SB={{{0x4,0x8000000,0xA1,0x3000000,0x618,0x0,0x0,0x0,0x0},{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xA,0x8000000,0x3A7,0x1C000000,0x79E1,0x6C00000,0x6E8D1,0x10480000,0x252364}}};
public static final int[][] CURVE_WB={{0x0,0x4000000,0x10,0x1000000,0x208,0x0,0x0,0x0,0x0},{0x5,0x14000000,0x152,0xE000000,0x1C70,0xC00000,0xC489,0x0,0x0},{0x3,0xC000000,0xB1,0x7000000,0xE38,0x10600000,0x6244,0x0,0x0},{0x1,0xC000000,0x30,0x1000000,0x208,0x0,0x0,0x0,0x0}};
public static final int[][][] CURVE_BB={{{0xD,0x4000000,0x418,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364},{0xC,0x4000000,0x418,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364},{0xC,0x4000000,0x418,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364},{0x2,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xC,0x4000000,0x418,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364},{0xD,0x4000000,0x418,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364},{0xC,0x4000000,0x418,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364}},{{0x2,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x1,0x8000000,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x2,0x4000000,0x10,0x0,0x0,0x0,0x0,0x0,0x0},{0x2,0x10000000,0x40,0x0,0x0,0x0,0x0,0x0,0x0},{0xA,0x0,0x408,0x1F000000,0x7FF9,0x6C00000,0x6E8D1,0x10480000,0x252364},{0x2,0x4000000,0x10,0x0,0x0,0x0,0x0,0x0,0x0}}};

*/

// BNT Curve
/*
public static final int CURVETYPE=WEIERSTRASS;
public static final int CURVE_A = 0;
public static final int[] CURVE_B = {0x2,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
public static final int[] CURVE_Order={0xD30210D,0x13ABBBF4,0xCB2CD8E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120};
public static final int[] CURVE_Bnx={0x4081,0x40300,0x10,0x0,0x0,0x0,0x0,0x0,0x0};
public static final int[] CURVE_Cru={0xB4FCD87,0xF5A9EAD,0xEAC47EB,0x19054BE5,0x104C9764,0x18A3B28A,0x12006,0x0,0x0};
public static final int[] CURVE_Fra={0xDC80022,0xFAE8A75,0x1EB338D6,0x189209AD,0x13211BE6,0x4F8C850,0x10E53D94,0x12593778,0x1328A2};
public static final int[] CURVE_Frb={0xECA6F1,0x53F5582,0x1E65F5D9,0x1C18A27B,0x1A3DEB01,0x10A2832B,0x1456AA9A,0x9136B67,0x10D87E};
public static final int[] CURVE_Pxa={0x88E65BB,0x144C3F11,0xA98C4EF,0x18015A39,0x1548B7CC,0xA992820,0xE7AF301,0x19A09826,0x14483F};
public static final int[] CURVE_Pxb={0x8DBE2C0,0x133C4440,0x78D214E,0xAFFC3F0,0x51B57B9,0x285318D,0xC0B68FF,0x166709D8,0x87F46};
public static final int[] CURVE_Pya={0x20CA1D,0x101623F,0xE67CDB,0x19682CFD,0x19F72C94,0x14E372A1,0xF5D28B1,0x13820561,0x14E8C2};
public static final int[] CURVE_Pyb={0x116628F2,0x1EC21BE3,0xF2DF71A,0x144FC2CF,0x172681D0,0xC54163A,0xF47B7B0,0x148C48A9,0x17AFE2};
public static final int[] CURVE_Gx ={0xEB4A712,0x14EDDFF7,0x1D192EAF,0x14AAAC29,0xD5F06E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120};
public static final int[] CURVE_Gy ={0x1,0x0,0x0,0x0,0x0,0x0,0x0,0x0,0x0};
public static final int[][] CURVE_W={{0x1838403,0x1321803,0x106660E1,0x3024304,0x600,0x0,0x0,0x0,0x0},{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0}};
public static final int[][][] CURVE_SB={{{0x1840504,0x13A1E03,0x10666101,0x3024304,0x600,0x0,0x0,0x0,0x0},{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xBAC9D0A,0x1279A3F1,0x1C4C6CAD,0xEA62620,0xD5EFAE8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120}}};
public static final int[][] CURVE_WB={{0x80C080,0xB0A0301,0x10222030,0x100C101,0x200,0x0,0x0,0x0,0x0},{0x88C4A85,0x15A9C820,0x14B71B0D,0x1D5A5F46,0x158868ED,0x106D21B1,0xC004,0x0,0x0},{0x4464583,0x1AD6E590,0xA5B8D8E,0x1EAD2FA3,0x1AC43476,0x83690D8,0x6002,0x0,0x0},{0x814181,0xB120901,0x10222050,0x100C101,0x200,0x0,0x0,0x0,0x0}};
public static final int[][][] CURVE_BB={{{0xD2FE08D,0x13A7B8F4,0xCB2CD7E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120},{0xD2FE08C,0x13A7B8F4,0xCB2CD7E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120},{0xD2FE08C,0x13A7B8F4,0xCB2CD7E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120},{0x8102,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0xD2FE08C,0x13A7B8F4,0xCB2CD7E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120},{0xD2FE08D,0x13A7B8F4,0xCB2CD7E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120},{0xD2FE08C,0x13A7B8F4,0xCB2CD7E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120}},{{0x8102,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0},{0x8101,0x80600,0x20,0x0,0x0,0x0,0x0,0x0,0x0}},{{0x4082,0x40300,0x10,0x0,0x0,0x0,0x0,0x0,0x0},{0x10202,0x100C00,0x40,0x0,0x0,0x0,0x0,0x0,0x0},{0xD2FA00A,0x13A3B5F4,0xCB2CD6E,0x11A86925,0xD5F00E8,0x159B4B7C,0x53BE82E,0x1B6CA2E0,0x240120},{0x4082,0x40300,0x10,0x0,0x0,0x0,0x0,0x0,0x0}}};

*/
	//public static boolean debug=false;

}
