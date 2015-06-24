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

public class DBIG {
	protected long[] w=new long[ROM.DNLEN];

/* Constructors */
	public DBIG(int x)
	{
		w[0]=x;
		for (int i=1;i<ROM.DNLEN;i++)
			w[i]=0;
	}

	public DBIG(DBIG x)
	{
		for (int i=0;i<ROM.DNLEN;i++)
			w[i]=x.w[i];
	}

	public DBIG(BIG x)
	{
		for (int i=0;i<ROM.NLEN-1;i++)
			w[i]=x.get(i);

		w[ROM.NLEN-1]=x.get(ROM.NLEN-1)&ROM.MASK; /* top word normalized */
		w[ROM.NLEN]=x.get(ROM.NLEN-1)>>ROM.BASEBITS;

		for (int i=ROM.NLEN+1;i<ROM.DNLEN;i++) w[i]=0;
	}

/* get and set digits of this */
	public long get(int i)
	{
		return w[i]; 
	}

	public void set(int i,long x)
	{
		w[i]=x;
	}

	public void inc(int i,long x)
	{
		w[i]+=x;
	}

/* test this=0? */
	public boolean iszilch() {
		for (int i=0;i<ROM.DNLEN;i++)
			if (w[i]!=0) return false;
		return true; 
	}

/* normalise this */
	public void norm() {
		long d,carry=0;
		for (int i=0;i<ROM.DNLEN-1;i++)
		{
			d=w[i]+carry;
			w[i]=d&ROM.MASK;
			carry=d>>ROM.BASEBITS;
		}
		w[ROM.DNLEN-1]=(w[ROM.DNLEN-1]+carry);
	}

/* shift this right by k bits */
	public void shr(int k) {
		int n=k%ROM.BASEBITS;
		int m=k/ROM.BASEBITS;	
		for (int i=0;i<ROM.DNLEN-m-1;i++)
			w[i]=(w[m+i]>>n)|((w[m+i+1]<<(ROM.BASEBITS-n))&ROM.MASK);
		w[ROM.DNLEN-m-1]=w[ROM.DNLEN-1]>>n;
		for (int i=ROM.DNLEN-m;i<ROM.DNLEN;i++) w[i]=0;
	}

/* shift this left by k bits */
	public void shl(int k) {
		int n=k%ROM.BASEBITS;
		int m=k/ROM.BASEBITS;

		w[ROM.DNLEN-1]=((w[ROM.DNLEN-1-m]<<n))|(w[ROM.DNLEN-m-2]>>(ROM.BASEBITS-n));
		for (int i=ROM.DNLEN-2;i>m;i--)
			w[i]=((w[i-m]<<n)&ROM.MASK)|(w[i-m-1]>>(ROM.BASEBITS-n));
		w[m]=(w[0]<<n)&ROM.MASK; 
		for (int i=0;i<m;i++) w[i]=0;
	}

/* return number of bits in this */
	public int nbits() {
		int bts,k=ROM.DNLEN-1;
		long c;
		norm();
		while (w[k]==0 && k>=0) k--;
		if (k<0) return 0;
		bts=ROM.BASEBITS*k;
		c=w[k];
		while (c!=0) {c/=2; bts++;}
		return bts;
	}

/* convert this to string */
	public String toString() {
		DBIG b;
		String s="";
		int len=nbits();
		if (len%4==0) len>>=2; //len/=4;
		else {len>>=2; len++;}

		for (int i=len-1;i>=0;i--)
		{
			b=new DBIG(this);
			b.shr(i*4);
			s+=Long.toHexString(b.w[0]&15);
		}
		return s;
	}

/* return this+x */
/*
	public DBIG plus(DBIG x) {
		DBIG s=new DBIG(0);
		for (int i=0;i<ROM.DNLEN;i++)
			s.w[i]=w[i]+x.w[i];	
		return s;
	}
*/
/* return this-x */
/*
	public DBIG minus(DBIG x) {
		DBIG d=new DBIG(0);
		for (int i=0;i<ROM.DNLEN;i++)
			d.w[i]=w[i]-x.w[i];
		return d;
	}
*/
/* this+=x */
	public void add(DBIG x) {
		for (int i=0;i<ROM.DNLEN;i++)
			w[i]+=x.w[i];	
	}

/* this-=x */
	public void sub(DBIG x) {
		for (int i=0;i<ROM.DNLEN;i++)
			w[i]-=x.w[i];
	}

/* set this[i]+=x*y+c, and return high part */
/* This is time critical */
/* What if you knew the bottom half in advance ?? */
	public long muladd(long a,long b,long c,int i)
	{
		long x0,x1,y0,y1;
		x0=a&ROM.HMASK;
		x1=(a>>ROM.HBITS);
		y0=b&ROM.HMASK;
		y1=(b>>ROM.HBITS);
		long bot=x0*y0;
		long top=x1*y1;
		long mid=x0*y1+x1*y0;
		x0=mid&ROM.HMASK;
		x1=(mid>>ROM.HBITS);
		bot+=x0<<ROM.HBITS; bot+=c; bot+=w[i];
		top+=x1;
		long carry=bot>>ROM.BASEBITS;
		bot&=ROM.MASK;
		top+=carry;
		w[i]=bot;
		return top;
	}

/* Compare a and b, return 0 if a==b, -1 if a<b, +1 if a>b. Inputs must be normalised */
	public static int comp(DBIG a,DBIG b)
	{
		for (int i=ROM.DNLEN-1;i>=0;i--)
		{
			if (a.w[i]==b.w[i]) continue;
			if (a.w[i]>b.w[i]) return 1;
			else  return -1;
		}
		return 0;
	}

/* reduces this DBIG mod a BIG, and returns the BIG */
	public BIG mod(BIG c)
	{
		int k=0;  
		norm();
		DBIG m=new DBIG(c);

		if (comp(this,m)<0) return new BIG(this);
		
		do
		{
			m.shl(1);
			k++;
		}
		while (comp(this,m)>=0);

		while (k>0)
		{
			m.shr(1);
			if (comp(this,m)>=0)
			{
				sub(m);
				norm();
			}
			k--;
		}
		return new BIG(this);
	}

/* reduces this DBIG mod a DBIG in place */
/*	public void mod(DBIG m)
	{
		int k=0;
		if (comp(this,m)<0) return;

		do
		{
			m.shl(1);
			k++;
		}
		while (comp(this,m)>=0);

		while (k>0)
		{
			m.shr(1);
			if (comp(this,m)>=0)
			{
				sub(m);
				norm();
			}
			k--;
		}
		return;

	}*/

/* return this/c */
	public BIG div(BIG c)
	{
		int k=0;
		DBIG m=new DBIG(c);
		BIG a=new BIG(0);
		BIG e=new BIG(1);
		norm();

		while (comp(this,m)>=0)
		{
			e.fshl(1);
			m.shl(1);
			k++;
		}

		while (k>0)
		{
			m.shr(1);
			e.shr(1);
			if (comp(this,m)>0)
			{
				a.add(e);
				a.norm();
				sub(m);
				norm();
			}
			k--;
		}
		return a;
	}

/* split DBIG at position n, return higher half, keep lower half */
	public BIG split(int n)
	{
		BIG t=new BIG(0);
		int m=n%ROM.BASEBITS;
		long nw,carry=w[ROM.DNLEN-1]<<(ROM.BASEBITS-m);

		for (int i=ROM.DNLEN-2;i>=ROM.NLEN-1;i--)
		{
			nw=(w[i]>>m)|carry;
			carry=(w[i]<<(ROM.BASEBITS-m))&ROM.MASK;
			t.set(i-ROM.NLEN+1,nw);
		}
		w[ROM.NLEN-1]&=(((long)1<<m)-1);
		return t;
	}
}
