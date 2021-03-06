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

/* MiotCL BIG number class */

/* General purpose Constructor */
var BIG = function(x) {
	this.w=new Array(ROM.NLEN);
	switch (typeof(x))
	{
	case "object":
		this.copy(x);
		break;
	case "number":
		this.zero();
		this.w[0]=x;
		break;
	default:
		this.zero();
	}
};

BIG.prototype={
/* set to zero */
	zero: function()
	{
		for (var i=0;i<ROM.NLEN;i++) this.w[i]=0;
		return this;
	},
/* set to one */
	one: function()
	{
		this.w[0]=1;
		for (var i=1;i<ROM.NLEN;i++) this.w[i]=0;
		return this;
	},

	get: function(i)
	{
		return this.w[i];
	},

	set: function(i,x)
	{
		this.w[i]=x;
	},
/* test for zero */
	iszilch: function()
	{
		for (var i=0;i<ROM.NLEN;i++)
			if (this.w[i]!==0) return false;
		return true; 
	},
/* test for unity */
	isunity: function()
	{
		for (var i=1;i<ROM.NLEN;i++)
			if (this.w[i]!==0) return false;
		if (this.w[0]!=1) return false;
		return true;
	},

/* Conditional swap of two bigs depending on d using XOR - no branches */
	cswap: function(b,d)
	{
		var i;
		var t,c=d;
		c=~(c-1);

		for (i=0;i<ROM.NLEN;i++)
		{
			t=c&(this.w[i]^b.w[i]);
			this.w[i]^=t;
			b.w[i]^=t;
		}
	},

/* Conditional move of big depending on d using XOR - no branches */
	cmove: function(b,d)
	{
		var i;
		var t,c=d;
		c=~(c-1);

		for (i=0;i<ROM.NLEN;i++)
		{
			this.w[i]^=(this.w[i]^b.w[i])&c;
		}
	},

/* copy from another BIG */
	copy: function(y)
	{
		for (var i=0;i<ROM.NLEN;i++)
			this.w[i]=y.w[i];
		return this;
	},
/* copy from bottom half of DBIG */
	hcopy: function(y)
	{
		for (var i=0;i<ROM.NLEN;i++)
			this.w[i]=y.w[i];
		return this;
	},
/* copy from ROM */
	rcopy: function(y)
	{
		for (var i=0;i<ROM.NLEN;i++)
			this.w[i]=y[i];
		return this;
	},

	xortop: function(x)
	{
		this.w[ROM.NLEN-1]^=x;
	},

	ortop: function(x)
	{
		this.w[ROM.NLEN-1]|=x;
	},

/* normalise BIG - force all digits < 2^BASEBITS */
	norm: function()
	{
		var d,carry=0;
		for (var i=0;i<ROM.NLEN-1;i++)
		{
			d=this.w[i]+carry;
			this.w[i]=d&ROM.MASK;
			carry=d>>ROM.BASEBITS;
		}
		this.w[ROM.NLEN-1]=(this.w[ROM.NLEN-1]+carry);

		return (this.w[ROM.NLEN-1]>>((8*ROM.MODBYTES)%ROM.BASEBITS));  

	},
/* quick shift right by less than a word */
	fshr: function(k)
	{
		var r=this.w[0]&((1<<k)-1); /* shifted out part */
		for (var i=0;i<ROM.NLEN-1;i++)
			this.w[i]=(this.w[i]>>k)|((this.w[i+1]<<(ROM.BASEBITS-k))&ROM.MASK);
		this.w[ROM.NLEN-1]=this.w[ROM.NLEN-1]>>k;
		return r;
	},
/* General shift right by k bits */
	shr: function(k)
	{
		var n=k%ROM.BASEBITS;
		var m=Math.floor(k/ROM.BASEBITS);	
		for (var i=0;i<ROM.NLEN-m-1;i++)
			this.w[i]=(this.w[m+i]>>n)|((this.w[m+i+1]<<(ROM.BASEBITS-n))&ROM.MASK);
		this.w[ROM.NLEN-m-1]=this.w[ROM.NLEN-1]>>n;
		for (i=ROM.NLEN-m;i<ROM.NLEN;i++) this.w[i]=0;
		return this;
	},
/* quick shift left by less than a word */
	fshl: function(k)
	{
		this.w[ROM.NLEN-1]=((this.w[ROM.NLEN-1]<<k))|(this.w[ROM.NLEN-2]>>(ROM.BASEBITS-k));
		for (var i=ROM.NLEN-2;i>0;i--)
			this.w[i]=((this.w[i]<<k)&ROM.MASK)|(this.w[i-1]>>(ROM.BASEBITS-k));
		this.w[0]=(this.w[0]<<k)&ROM.MASK; 

		return (this.w[ROM.NLEN-1]>>((8*ROM.MODBYTES)%ROM.BASEBITS)); /* return excess - only used in FF.java */
	},
/* General shift left by k bits */
	shl: function(k)
	{
		var i,n=k%ROM.BASEBITS;
		var m=Math.floor(k/ROM.BASEBITS);

		this.w[ROM.NLEN-1]=((this.w[ROM.NLEN-1-m]<<n))|(this.w[ROM.NLEN-m-2]>>(ROM.BASEBITS-n));
		for (i=ROM.NLEN-2;i>m;i--)
			this.w[i]=((this.w[i-m]<<n)&ROM.MASK)|(this.w[i-m-1]>>(ROM.BASEBITS-n));
		this.w[m]=(this.w[0]<<n)&ROM.MASK; 
		for (i=0;i<m;i++) this.w[i]=0;
		return this;
	},
/* return length in bits */
	nbits: function()
	{
		var bts,k=ROM.NLEN-1;
		var c;
		this.norm();
		while (k>=0 && this.w[k]===0) k--;
		if (k<0) return 0;
		bts=ROM.BASEBITS*k;
		c=this.w[k];
		while (c!==0) {c=Math.floor(c/2); bts++;}
		return bts;
	},
/* convert this to string */
	toString: function()
	{
		var b;
		var s="";
		var len=this.nbits();
		if (len%4===0) len=Math.floor(len/4);
		else {len=Math.floor(len/4); len++;}
		if (len<ROM.MODBYTES*2) len=ROM.MODBYTES*2;
		for (var i=len-1;i>=0;i--)
		{
			b=new BIG(0);
			b.copy(this);
			b.shr(i*4);
			s+=(b.w[0]&15).toString(16);
		}
		return s;
	},
/* this+=y */
	add: function(y)
	{
		for (var i=0;i<ROM.NLEN;i++) this.w[i]+=y.w[i];
		return this;
	},
/* return this+x */
	plus: function(x) 
	{
		var s=new BIG(0);
		for (var i=0;i<ROM.NLEN;i++)
			s.w[i]=this.w[i]+x.w[i];	
		return s;
	},
/* this+=i, where i is int */
	inc: function(i)
	{
		this.norm();
		this.w[0]+=i;
		return this;
	},
/* this-=y */
	sub: function(y)
	{
		for (var i=0;i<ROM.NLEN;i++) this.w[i]-=y.w[i];
		return this;
	},

/* reverse subtract this=x-this */
	rsub: function(x) 
	{
		for (var i=0;i<ROM.NLEN;i++)
			this.w[i]=x.w[i]-this.w[i];
		return this;
	},
/* this-=i, where i is int */
	dec: function(i)
	{
		this.norm();
		this.w[0]-=i;
		return this;
	},
/* return this-x */
	minus: function(x) {
		var d=new BIG(0);
		for (var i=0;i<ROM.NLEN;i++)
			d.w[i]=this.w[i]-x.w[i];
		return d;
	},
/* multiply by small integer */
	imul: function(c)
	{
		for (var i=0;i<ROM.NLEN;i++) this.w[i]*=c;
		return this;
	},
/* convert this BIG to byte array */
	tobytearray: function(b,n)
	{
		this.norm();
		var c=new BIG(0);
		c.copy(this);

		for (var i=ROM.MODBYTES-1;i>=0;i--)
		{
			b[i+n]=c.w[0]&0xff;
			c.fshr(8);
		}
		return this;
	},
/* convert this to byte array */
	toBytes: function(b)
	{
		this.tobytearray(b,0);
	},

/* set this[i]+=x*y+c, and return high part */
	muladd: function(x,y,c,i)
	{
		var prod=x*y+c+this.w[i];
		this.w[i]=prod&ROM.MASK;
		return ((prod-this.w[i])*ROM.MODINV);
	},
/* multiply by larger int */
	pmul: function(c)
	{
		var ak,carry=0;
		this.norm();
		for (var i=0;i<ROM.NLEN;i++)
		{
			ak=this.w[i];
			this.w[i]=0;
			carry=this.muladd(ak,c,carry,i);
		}
		return carry;
	},
/* multiply by still larger int - results requires a DBIG */
	pxmul: function(c)
	{
		var m=new DBIG(0);	
		var carry=0;
		for (var j=0;j<ROM.NLEN;j++)
			carry=m.muladd(this.w[j],c,carry,j);
		m.w[ROM.NLEN]=carry;		
		return m;
	},
/* divide by 4 */
	div3: function()
	{	
		var ak,base,carry=0;
		this.norm();
		base=(1<<ROM.BASEBITS);
		for (var i=ROM.NLEN-1;i>=0;i--)
		{
			ak=(carry*base+this.w[i]);
			this.w[i]=Math.floor(ak/3);
			carry=ak%3;
		}
		return carry;
	},

/* set x = x mod 2^m */
	mod2m: function(m)
	{
		var i,wd,bt;
		var msk;
		wd=Math.floor(m/ROM.BASEBITS);
		bt=m%ROM.BASEBITS;
		msk=(1<<bt)-1;
		this.w[wd]&=msk;
		for (i=wd+1;i<ROM.NLEN;i++) this.w[i]=0;
	},

/* a=1/a mod 2^256. This is very fast! */
	invmod2m: function()
	{
		var U=new BIG(0);
		var t1=new BIG(0);
		var t2=new BIG(0);
		var b=new BIG(0);
		var c=new BIG(0);

		U.inc(BIG.invmod256(this.lastbits(8)));

		for (var i=8;i<256;i<<=1)
		{
			b.copy(this); b.mod2m(i);
			t1=BIG.smul(U,b); t1.shr(i);
			c.copy(this); c.shr(i); c.mod2m(i);

			t2=BIG.smul(U,c); t2.mod2m(i);
			t1.add(t2);
			b=BIG.smul(t1,U); t1.copy(b);
			t1.mod2m(i);

			t2.one(); t2.shl(i); t1.rsub(t2); t1.norm();
			t1.shl(i);
			U.add(t1);
		}
		this.copy(U);
	},

/* reduce this mod m */
	mod: function(m)
	{
		var k=0;  

		this.norm();
		if (BIG.comp(this,m)<0) return;
		do
		{
			m.fshl(1);
			k++;
		} while (BIG.comp(this,m)>=0);

		while (k>0)
		{
			m.fshr(1);
			if (BIG.comp(this,m)>=0)
			{
				this.sub(m);
				this.norm();
			}
			k--;
		}
	},
/* this/=m */
	div: function(m)
	{
		var k=0;
		this.norm();
		var e=new BIG(1);
		var b=new BIG(0);
		b.copy(this);
		this.zero();

		while (BIG.comp(b,m)>=0)
		{
			e.fshl(1);
			m.fshl(1);
			k++;
		}

		while (k>0)
		{
			m.fshr(1);
			e.fshr(1);
			if (BIG.comp(b,m)>=0)
			{
				this.add(e);
				this.norm();
				b.sub(m);
				b.norm();
			}
			k--;
		}
	},
/* return parity of this */
	parity: function()
	{
		return this.w[0]%2;
	},
/* return n-th bit of this */
	bit: function(n)
	{
		if ((this.w[Math.floor(n/ROM.BASEBITS)]&(1<<(n%ROM.BASEBITS)))>0) return 1;
		else return 0;
	},
/* return last n bits of this */
	lastbits: function(n)
	{
		var msk=(1<<n)-1;
		this.norm();
		return (this.w[0])&msk;
	},
/* Jacobi Symbol (this/p). Returns 0, 1 or -1 */
	jacobi: function(p)
	{
		var n8,k,m=0;
		var t=new BIG(0);
		var x=new BIG(0);
		var n=new BIG(0);
		var zilch=new BIG(0);
		var one=new BIG(1);
		if (p.parity()===0 || BIG.comp(this,zilch)===0 || BIG.comp(p,one)<=0) return 0;
		this.norm();
		x.copy(this);
		n.copy(p);
		x.mod(p);

		while (BIG.comp(n,one)>0)
		{
			if (BIG.comp(x,zilch)===0) return 0;
			n8=n.lastbits(3);
			k=0;
			while (x.parity()===0)
			{
				k++;
				x.shr(1);
			}
			if (k%2==1) m+=(n8*n8-1)/8;
			m+=(n8-1)*(x.lastbits(2)-1)/4;
			t.copy(n);
			t.mod(x);
			n.copy(x);
			x.copy(t);
			m%=2;

		}
		if (m===0) return 1;
		else return -1;
	},
/* this=1/this mod p. Binary method */
	invmodp: function(p)
	{
		this.mod(p);
		var u=new BIG(0);
		u.copy(this);
		var v=new BIG(0);
		v.copy(p);
		var x1=new BIG(1);
		var x2=new BIG(0);
		var t=new BIG(0);
		var one=new BIG(1);

		while (BIG.comp(u,one)!==0 && BIG.comp(v,one)!==0)
		{
			while (u.parity()===0)
			{
				u.shr(1);
				if (x1.parity()!==0)
				{
					x1.add(p);
					x1.norm();
				}
				x1.shr(1);
			}
			while (v.parity()===0)
			{
				v.shr(1);
				if (x2.parity()!==0)
				{
					x2.add(p);
					x2.norm();
				}
				x2.shr(1);
			}
			if (BIG.comp(u,v)>=0)
			{
				u.sub(v);
				u.norm();
				if (BIG.comp(x1,x2)>=0) x1.sub(x2);
				else
				{
					t.copy(p);
					t.sub(x2);
					x1.add(t);
				}
				x1.norm();
			}
			else
			{
				v.sub(u);
				v.norm();
				if (BIG.comp(x2,x1)>=0) x2.sub(x1);
				else
				{
					t.copy(p);
					t.sub(x1);
					x2.add(t);
				}
				x2.norm();
			}
		}
		if (BIG.comp(u,one)===0) this.copy(x1);
		else this.copy(x2);
	},
/* return this^e mod m */
	powmod:function(e,m)
	{
		var bt;
		this.norm();
		e.norm();
		var a=new BIG(1);
		var z=new BIG(0);
		z.copy(e);
		var s=new BIG(0);
		s.copy(this);
		var i=0;
		while (true)
		{
			i++;
			bt=z.parity();
			z.fshr(1);
			if (bt==1) a=BIG.modmul(a,s,m);
//ROM.debug=false;
			if (z.iszilch()) break;
			s=BIG.modsqr(s,m);
		}
		return a;
	}

};
/* convert from byte array to BIG */
BIG.frombytearray=function(b,n)
{
	var m=new BIG(0);

	for (var i=0;i<ROM.MODBYTES;i++)
	{
		m.fshl(8); m.w[0]+=b[i+n]&0xff;
		//m.inc(b[i]&0xff);
	}
	return m; 
};

BIG.fromBytes=function(b)
{
	return BIG.frombytearray(b,0);
};

/* return a*b where product fits a BIG */
BIG.smul=function(a,b)
{
	var carry;
	var c=new BIG(0);
	for (var i=0;i<ROM.NLEN;i++)
	{
		carry=0;
		for (var j=0;j<ROM.NLEN;j++)
			if (i+j<ROM.NLEN) carry=c.muladd(a.w[i],b.w[j],carry,i+j);
	}
	return c;
};
/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
BIG.comp=function(a,b)
{
	for (var i=ROM.NLEN-1;i>=0;i--)
	{
		if (a.w[i]==b.w[i]) continue;
		if (a.w[i]>b.w[i]) return 1;
		else  return -1;
	}
	return 0;
};

/* get 8*MODBYTES size random number */
BIG.random=function(rng)
{
	var m=new BIG(0);
	var i,b,j=0,r=0;

/* generate random BIG */ 
	for (i=0;i<8*ROM.MODBYTES;i++)   
	{
		if (j===0) r=rng.getByte();
		else r>>=1;

		b=r&1;
		m.shl(1); m.w[0]+=b;// m.inc(b);
		j++; j&=7; 
	}
	return m;
};

/* Create random BIG in portable way, one bit at a time */
BIG.randomnum=function(q,rng)
{
	var d=new DBIG(0);
	var i,b,j=0,r=0;
	for (i=0;i<2*ROM.MODBITS;i++)
	{
		if (j===0) r=rng.getByte();
		else r>>=1;

		b=r&1;
		d.shl(1); d.w[0]+=b; 
		j++; j&=7;
	}

	var m=d.mod(q);

	return m;
};

/* return NAF value as +/- 1, 3 or 5. x and x3 should be normed. 
nbs is number of bits processed, and nzs is number of trailing 0s detected */
BIG.nafbits=function(x,x3,i)
{
	var n=[];
	var nb=x3.bit(i)-x.bit(i);
	var j;
	n[1]=1;
	n[0]=0;
	if (nb===0) {n[0]=0; return n;}
	if (i===0) {n[0]=nb; return n;}
	if (nb>0) n[0]=1;
	else      n[0]=(-1);

	for (j=i-1;j>0;j--)
	{
		n[1]++;
		n[0]*=2;
		nb=x3.bit(j)-x.bit(j);
		if (nb>0) n[0]+=1;
		if (nb<0) n[0]-=1;
		if (n[0]>5 || n[0]<-5) break;
	}

	if (n[0]%2!==0 && j!==0)
	{ /* backtrack */
		if (nb>0) n[0]=(n[0]-1)/2;
		if (nb<0) n[0]=(n[0]+1)/2;
		n[1]--;
	}
	while (n[0]%2===0)
	{ /* remove trailing zeros */
		n[0]/=2;
		n[2]++;
		n[1]--;
	}
	return n;
};

/* return a*b as DBIG */
BIG.mul=function(a,b)
{
	var n,c=new DBIG(0);
	a.norm();
	b.norm();

	c.w[0]=a.w[0]*b.w[0];
	c.w[1]=a.w[1]*b.w[0]+a.w[0]*b.w[1];
	c.w[2]=a.w[2]*b.w[0]+a.w[1]*b.w[1]+a.w[0]*b.w[2];
	c.w[3]=a.w[3]*b.w[0]+a.w[2]*b.w[1]+a.w[1]*b.w[2]+a.w[0]*b.w[3];
	c.w[4]=a.w[4]*b.w[0]+a.w[3]*b.w[1]+a.w[2]*b.w[2]+a.w[1]*b.w[3]+a.w[0]*b.w[4];
	c.w[5]=a.w[5]*b.w[0]+a.w[4]*b.w[1]+a.w[3]*b.w[2]+a.w[2]*b.w[3]+a.w[1]*b.w[4]+a.w[0]*b.w[5];
	c.w[6]=a.w[6]*b.w[0]+a.w[5]*b.w[1]+a.w[4]*b.w[2]+a.w[3]*b.w[3]+a.w[2]*b.w[4]+a.w[1]*b.w[5]+a.w[0]*b.w[6];
	c.w[7]=a.w[7]*b.w[0]+a.w[6]*b.w[1]+a.w[5]*b.w[2]+a.w[4]*b.w[3]+a.w[3]*b.w[4]+a.w[2]*b.w[5]+a.w[1]*b.w[6]+a.w[0]*b.w[7];
	c.w[8]=a.w[8]*b.w[0]+a.w[7]*b.w[1]+a.w[6]*b.w[2]+a.w[5]*b.w[3]+a.w[4]*b.w[4]+a.w[3]*b.w[5]+a.w[2]*b.w[6]+a.w[1]*b.w[7]+a.w[0]*b.w[8];
	c.w[9]=a.w[9]*b.w[0]+a.w[8]*b.w[1]+a.w[7]*b.w[2]+a.w[6]*b.w[3]+a.w[5]*b.w[4]+a.w[4]*b.w[5]+a.w[3]*b.w[6]+a.w[2]*b.w[7]+a.w[1]*b.w[8]+a.w[0]*b.w[9];
	c.w[10]=a.w[10]*b.w[0]+a.w[9]*b.w[1]+a.w[8]*b.w[2]+a.w[7]*b.w[3]+a.w[6]*b.w[4]+a.w[5]*b.w[5]+a.w[4]*b.w[6]+a.w[3]*b.w[7]+a.w[2]*b.w[8]+a.w[1]*b.w[9]+a.w[0]*b.w[10];

	c.w[11]=a.w[10]*b.w[1]+a.w[9]*b.w[2]+a.w[8]*b.w[3]+a.w[7]*b.w[4]+a.w[6]*b.w[5]+a.w[5]*b.w[6]+a.w[4]*b.w[7]+a.w[3]*b.w[8]+a.w[2]*b.w[9]+a.w[1]*b.w[10];
	c.w[12]= a.w[10]*b.w[2]+a.w[9]*b.w[3]+a.w[8]*b.w[4]+a.w[7]*b.w[5]+a.w[6]*b.w[6]+a.w[5]*b.w[7]+a.w[4]*b.w[8]+a.w[3]*b.w[9]+a.w[2]*b.w[10];
	c.w[13]= a.w[10]*b.w[3]+a.w[9]*b.w[4]+a.w[8]*b.w[5]+a.w[7]*b.w[6]+a.w[6]*b.w[7]+a.w[5]*b.w[8]+a.w[4]*b.w[9]+a.w[3]*b.w[10];  
	c.w[14]= a.w[10]*b.w[4]+a.w[9]*b.w[5]+a.w[8]*b.w[6]+a.w[7]*b.w[7]+a.w[6]*b.w[8]+a.w[5]*b.w[9]+a.w[4]*b.w[10];
	c.w[15]= a.w[10]*b.w[5]+a.w[9]*b.w[6]+a.w[8]*b.w[7]+a.w[7]*b.w[8]+a.w[6]*b.w[9]+a.w[5]*b.w[10];
	c.w[16]= a.w[10]*b.w[6]+a.w[9]*b.w[7]+a.w[8]*b.w[8]+a.w[7]*b.w[9]+a.w[6]*b.w[10];
	c.w[17]= a.w[10]*b.w[7]+a.w[9]*b.w[8]+a.w[8]*b.w[9]+a.w[7]*b.w[10];
	c.w[18]= a.w[10]*b.w[8]+a.w[9]*b.w[9]+a.w[8]*b.w[10];
	c.w[19]= a.w[10]*b.w[9]+a.w[9]*b.w[10];
	c.w[20]= a.w[10]*b.w[10];
//	for (var j=9;j<ROM.NLEN;j++)
//	{
//		t=0; for (var i=0;i<=j;i++) t+=a.w[j-i]*b.w[i];
//		c.w[j]=t;
//	}
//	for (var j=ROM.NLEN;j<ROM.DNLEN-2;j++)
//	{
//		t=0; for (var i=j-ROM.NLEN+1;i<ROM.NLEN;i++) t+=a.w[j-i]*b.w[i];
//		c.w[j]=t; 
//	}
//	t=a.w[ROM.NLEN-1]*b.w[ROM.NLEN-1];
//	c.w[ROM.DNLEN-2]=t;
	var co=0;
	for (var i=0;i<ROM.DNLEN-1;i++)
	{
		n=c.w[i]+co;
		c.w[i]=n&ROM.MASK;
		co=(n-c.w[i])*ROM.MODINV;
	}
	c.w[ROM.DNLEN-1]=co;

	return c;
};

/* return a^2 as DBIG */
BIG.sqr=function(a)
{
	var n,c=new DBIG(0);
	a.norm();

	c.w[0]=a.w[0]*a.w[0];
	c.w[1]=2*(a.w[1]*a.w[0]);
	c.w[2]=2*(a.w[2]*a.w[0])+a.w[1]*a.w[1]; 
	c.w[3]=2*(a.w[3]*a.w[0]+a.w[2]*a.w[1]);
	c.w[4]=2*(a.w[4]*a.w[0]+a.w[3]*a.w[1])+a.w[2]*a.w[2];
	c.w[5]=2*(a.w[5]*a.w[0]+a.w[4]*a.w[1]+a.w[3]*a.w[2]);
	c.w[6]=2*(a.w[6]*a.w[0]+a.w[5]*a.w[1]+a.w[4]*a.w[2])+a.w[3]*a.w[3];
	c.w[7]=2*(a.w[7]*a.w[0]+a.w[6]*a.w[1]+a.w[5]*a.w[2]+a.w[4]*a.w[3]);
	c.w[8]=2*(a.w[8]*a.w[0]+a.w[7]*a.w[1]+a.w[6]*a.w[2]+a.w[5]*a.w[3])+a.w[4]*a.w[4];
	c.w[9]=2*(a.w[9]*a.w[0]+a.w[8]*a.w[1]+a.w[7]*a.w[2]+a.w[6]*a.w[3]+a.w[5]*a.w[4]);
	c.w[10]=2*(a.w[10]*a.w[0]+a.w[9]*a.w[1]+a.w[8]*a.w[2]+a.w[7]*a.w[3]+a.w[6]*a.w[4])+a.w[5]*a.w[5];

	c.w[11]=2*(a.w[10]*a.w[1]+a.w[9]*a.w[2]+a.w[8]*a.w[3]+a.w[7]*a.w[4]+a.w[6]*a.w[5]);
	c.w[12]=2*(a.w[10]*a.w[2]+a.w[9]*a.w[3]+a.w[8]*a.w[4]+a.w[7]*a.w[5])+a.w[6]*a.w[6];
	c.w[13]=2*(a.w[10]*a.w[3]+a.w[9]*a.w[4]+a.w[8]*a.w[5]+a.w[7]*a.w[6]);
	c.w[14]=2*(a.w[10]*a.w[4]+a.w[9]*a.w[5]+a.w[8]*a.w[6])+a.w[7]*a.w[7];
	c.w[15]=2*(a.w[10]*a.w[5]+a.w[9]*a.w[6]+a.w[8]*a.w[7]);
	c.w[16]=2*(a.w[10]*a.w[6]+a.w[9]*a.w[7])+a.w[8]*a.w[8];
	c.w[17]=2*(a.w[10]*a.w[7]+a.w[9]*a.w[8]);
	c.w[18]=2*(a.w[10]*a.w[8])+a.w[9]*a.w[9];
	c.w[19]=2*(a.w[10]*a.w[9]);
	c.w[20]= a.w[10]*a.w[10];
/*
	c.w[0]=a.w[0]*a.w[0];
	t=a.w[1]*a.w[0]; t+=t; c.w[1]=t;
	for (j=2;j<ROM.NLEN-1;j+=2)
	{
		t=a.w[j]*a.w[0]; for (var i=1;i<(j+1)>>1;i++) t+=a.w[j-i]*a.w[i]; t+=t; t+=a.w[j>>1]*a.w[j>>1];
		c.w[j]=t;
		t=a.w[j+1]*a.w[0]; for (var i=1;i<(j+2)>>1;i++) t+=a.w[j+1-i]*a.w[i]; t+=t;
		c.w[j+1]=t;
	}	
	j=ROM.NLEN-1;
	t=a.w[j]*a.w[0]; for (var i=1;i<(j+1)>>1;i++) t+=a.w[j-i]*a.w[i]; t+=t; t+=a.w[j>>1]*a.w[j>>1];
	c.w[j]=t;

	j=ROM.NLEN;
	t=a.w[ROM.NLEN-1]*a.w[j-ROM.NLEN+1]; for (var i=j-ROM.NLEN+2;i<(j+1)>>1;i++) t+=a.w[j-i]*a.w[i]; t+=t; 
	c.w[j]=t;
	for (j=ROM.NLEN+1;j<ROM.DNLEN-2;j+=2)
	{
		t=a.w[ROM.NLEN-1]*a.w[j-ROM.NLEN+1]; for (var i=j-ROM.NLEN+2;i<(j+1)>>1;i++) t+=a.w[j-i]*a.w[i]; t+=t; t+=a.w[j>>1]*a.w[j>>1];
		c.w[j]=t;
		t=a.w[ROM.NLEN-1]*a.w[j-ROM.NLEN+2]; for (var i=j-ROM.NLEN+3;i<(j+2)>>1;i++) t+=a.w[j+1-i]*a.w[i]; t+=t; 
		c.w[j+1]=t;
	}

	t=a.w[ROM.NLEN-1]*a.w[ROM.NLEN-1];
	c.w[ROM.DNLEN-2]=t;
*/
	var co=0;
	for (var i=0;i<ROM.DNLEN-1;i++)
	{
		n=c.w[i]+co;
		c.w[i]=n&ROM.MASK;
		co=(n-c.w[i])*ROM.MODINV;
	}
	c.w[ROM.DNLEN-1]=co;

	return c;
};

/* reduce a DBIG to a BIG using a "special" modulus */
BIG.mod=function(d)
{
	var i,j,b=new BIG(0);
	if (ROM.MODTYPE==ROM.PSEUDO_MERSENNE)
	{
		var v,tw;
		var t=d.split(ROM.MODBITS);
		b.hcopy(d);

		v=t.pmul(ROM.MConst);
		tw=t.w[ROM.NLEN-1];
		t.w[ROM.NLEN-1]&=ROM.TMASK;
		t.inc(ROM.MConst*((tw>>ROM.TBITS)+(v<<(ROM.BASEBITS-ROM.TBITS))));
		b.add(t);
	}
	
	if (ROM.MODTYPE==ROM.MONTGOMERY_FRIENDLY)
	{
		for (i=0;i<ROM.NLEN;i++)
			d.w[ROM.NLEN+i]+=d.muladd(d.w[i],ROM.MConst-1,d.w[i],ROM.NLEN+i-1);
		for (i=0;i<ROM.NLEN;i++)
			b.w[i]=d.w[ROM.NLEN+i];
	}

	if (ROM.MODTYPE==ROM.NOT_SPECIAL)
	{
		var md=new BIG(0);
		md.rcopy(ROM.Modulus);
		var sum;

		sum=d.w[0];
		for (j=0;j<ROM.NLEN;j++)
		{
			for (i=0;i<j;i++) sum+=d.w[i]*md.w[j-i];
			d.w[j]=((sum&ROM.MASK)*ROM.MConst)&ROM.MASK; sum+=d.w[j]*md.w[0];
			sum=d.w[j+1]+(sum*ROM.MODINV);
		}
		for (j=ROM.NLEN;j<ROM.DNLEN-2;j++)
		{
			for (i=j-ROM.NLEN+1;i<ROM.NLEN;i++) sum+=d.w[i]*md.w[j-i];
			d.w[j]=sum&ROM.MASK;
			sum=d.w[j+1]+((sum-d.w[j])*ROM.MODINV);
		}

		sum+=d.w[ROM.NLEN-1]*md.w[ROM.NLEN-1];
		d.w[ROM.DNLEN-2]=sum&ROM.MASK;
		sum=d.w[ROM.DNLEN-1]+((sum-d.w[ROM.DNLEN-2])*ROM.MODINV);
		d.w[ROM.DNLEN-1]=sum&ROM.MASK;

		for (i=0;i<ROM.NLEN;i++)
			b.w[i]=d.w[ROM.NLEN+i];
	}
	b.norm();
	return b;
};

/* return a*b mod m */
BIG.modmul=function(a,b,m)
{
	a.mod(m);
	b.mod(m);
	var d=BIG.mul(a,b);
	return d.mod(m);
};

/* return a^2 mod m */
BIG.modsqr=function(a,m)
{
	a.mod(m);
	var d=BIG.sqr(a);
	return d.mod(m);
};

/* return -a mod m */
BIG.modneg=function(a,m)
{
	a.mod(m);
	return m.minus(a);
};

/* calculate Field Excess */
BIG.EXCESS=function(a)
{
	return ((a.w[ROM.NLEN-1]&ROM.OMASK)>>(ROM.MODBITS%ROM.BASEBITS));
};

/* Arazi and Qi inversion mod 256 */
BIG.invmod256=function(a)
{
	var U,t1,t2,b,c;
	t1=0;
	c=(a>>1)&1;  
	t1+=c;
	t1&=1;
	t1=2-t1;
	t1<<=1;
	U=t1+1;

// i=2
	b=a&3;
	t1=U*b; t1>>=2;
	c=(a>>2)&3;
	t2=(U*c)&3;
	t1+=t2;
	t1*=U; t1&=3;
	t1=4-t1;
	t1<<=2;
	U+=t1;

// i=4
	b=a&15;
	t1=U*b; t1>>=4;
	c=(a>>4)&15;
	t2=(U*c)&15;
	t1+=t2;
	t1*=U; t1&=15;
	t1=16-t1;
	t1<<=4;
	U+=t1;

	return U;
};

