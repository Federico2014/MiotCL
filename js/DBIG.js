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

/* MiotCL double length DBIG number class */ 

/* constructor */
var DBIG = function(x) {
	this.w=[];
	this.zero();
	this.w[0]=x;
};

DBIG.prototype={

/* set this=0 */
	zero: function()
	{
		for (var i=0;i<ROM.DNLEN;i++) this.w[i]=0;
		return this;
	},

/* set this=b */
	copy: function(b)
	{
		for (var i=0;i<ROM.DNLEN;i++) this.w[i]=b.w[i];
		return this;
	},


/* copy from BIG */
	hcopy: function(b)
	{
		var i;
		for (i=0;i<ROM.NLEN;i++) this.w[i]=b.w[i];
		for (i=ROM.NLEN;i<ROM.DNLEN;i++) this.w[i]=0;
		return this;
	},

/* normalise this */
	norm: function()
	{
		var d,carry=0;
		for (var i=0;i<ROM.DNLEN-1;i++)
		{
			d=this.w[i]+carry;
			this.w[i]=d&ROM.MASK;
			carry=d>>ROM.BASEBITS;
		}
		this.w[ROM.DNLEN-1]=(this.w[ROM.DNLEN-1]+carry);
		return this;
	},

/* set this[i]+=x*y+c, and return high part */
	muladd: function(x,y,c,i)
	{
		var prod=x*y+c+this.w[i];
		this.w[i]=prod&ROM.MASK;
		return ((prod-this.w[i])*ROM.MODINV);
	},

/* shift this right by k bits */
	shr: function(k) 
	{
		var i,n=k%ROM.BASEBITS;
		var m=Math.floor(k/ROM.BASEBITS);	
		for (i=0;i<ROM.DNLEN-m-1;i++)
			this.w[i]=(this.w[m+i]>>n)|((this.w[m+i+1]<<(ROM.BASEBITS-n))&ROM.MASK);
		this.w[ROM.DNLEN-m-1]=this.w[ROM.DNLEN-1]>>n;
		for (i=ROM.DNLEN-m;i<ROM.DNLEN;i++) this.w[i]=0;
		return this;
	},

/* shift this left by k bits */
	shl: function(k) 
	{
		var i,n=k%ROM.BASEBITS;
		var m=Math.floor(k/ROM.BASEBITS);

		this.w[ROM.DNLEN-1]=((this.w[ROM.DNLEN-1-m]<<n))|(this.w[ROM.DNLEN-m-2]>>(ROM.BASEBITS-n));
		for (i=ROM.DNLEN-2;i>m;i--)
			this.w[i]=((this.w[i-m]<<n)&ROM.MASK)|(this.w[i-m-1]>>(ROM.BASEBITS-n));
		this.w[m]=(this.w[0]<<n)&ROM.MASK; 
		for (i=0;i<m;i++) this.w[i]=0;
		return this;
	},

/* this+=x */
	add: function(x) 
	{
		for (var i=0;i<ROM.DNLEN;i++)
			this.w[i]+=x.w[i];	
	},

/* this-=x */
	sub: function(x) 
	{
		for (var i=0;i<ROM.DNLEN;i++)
			this.w[i]-=x.w[i];
	},

/* return number of bits in this */
	nbits: function()
	{
		var bts,k=ROM.DNLEN-1;
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

		for (var i=len-1;i>=0;i--)
		{
			b=new DBIG(0);
			b.copy(this);
			b.shr(i*4);
			s+=(b.w[0]&15).toString(16);
		}
		return s;
	},

/* reduces this DBIG mod a BIG, and returns the BIG */
	mod: function(c)
	{
		var k=0;  
		this.norm();
		var m=new DBIG(0);
		m.hcopy(c);
		var r=new BIG(0);
		r.hcopy(this);

		if (DBIG.comp(this,m)<0) return r;

		do
		{
			m.shl(1);
			k++;
		}
		while (DBIG.comp(this,m)>=0);

		while (k>0)
		{
			m.shr(1);
			if (DBIG.comp(this,m)>=0)
			{
				this.sub(m);
				this.norm();
			}
			k--;
		}

		r.hcopy(this);
		return r;
	},

/* this/=c */
	div: function(c)
	{
		var k=0;
		var m=new DBIG(0); m.hcopy(c);
		var a=new BIG(0);
		var e=new BIG(1);
		this.norm();

		while (DBIG.comp(this,m)>=0)
		{
			e.fshl(1);
			m.shl(1);
			k++;
		}

		while (k>0)
		{
			m.shr(1);
			e.shr(1);
			if (DBIG.comp(this,m)>0)
			{
				a.add(e);
				a.norm();
				this.sub(m);
				this.norm();
			}
			k--;
		}
		return a;
	},

/* split this DBIG at position n, return higher half, keep lower half */
	split: function(n)
	{
		var t=new BIG(0);
		var nw,m=n%ROM.BASEBITS;
		var carry=this.w[ROM.DNLEN-1]<<(ROM.BASEBITS-m);

	
		for (var i=ROM.DNLEN-2;i>=ROM.NLEN-1;i--)
		{
			nw=(this.w[i]>>m)|carry;
			carry=(this.w[i]<<(ROM.BASEBITS-m))&ROM.MASK;
			t.w[i-ROM.NLEN+1]=nw;
		}
		this.w[ROM.NLEN-1]&=((1<<m)-1);

		return t;
	}

};

/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
DBIG.comp=function(a,b)
{
	for (var i=ROM.DNLEN-1;i>=0;i--)
	{
		if (a.w[i]==b.w[i]) continue;
		if (a.w[i]>b.w[i]) return 1;
		else  return -1;
	}
	return 0;
};
