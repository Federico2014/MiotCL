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

var PAIR = {
/* Line function */
	line: function(A,B,Qx,Qy)
	{
		var P=new ECP2();
		var a,b,c;
		var r=new FP12(1);
		P.copy(A);

		var ZZ=new FP2(P.getz()); //ZZ.copy(P.getz());
		ZZ.sqr();
		var D;
		if (A==B) D=A.dbl(); 
		else D=A.add(B);
		if (D<0) return r;
		var Z3=new FP2(A.getz()); //Z3.copy(A.getz());
		c=new FP4(0);
		var X,Y,T;
		if (D===0)
		{ /* Addition */
			X=new FP2(B.getx()); //X.copy(B.getx());
			Y=new FP2(B.gety()); //Y.copy(B.gety());
			T=new FP2(P.getz()); //T.copy(P.getz());

			T.mul(Y);
			ZZ.mul(T);

			var NY=new FP2(P.gety()); /*NY.copy(P.gety());*/ NY.neg();
			ZZ.add(NY);
			Z3.pmul(Qy);
			T.mul(P.getx());
			X.mul(NY);
			T.add(X);
			a=new FP4(Z3,T); //a.set(Z3,T);
			ZZ.neg();
			ZZ.pmul(Qx);
			b=new FP4(ZZ); //b.seta(ZZ);
		}
		else
		{ /* Doubling */
			X=new FP2(P.getx()); //X.copy(P.getx());
			Y=new FP2(P.gety()); //Y.copy(P.gety());
			T=new FP2(P.getx()); //T.copy(P.getx());
			T.sqr();
			T.imul(3);

			Y.sqr();
			Y.add(Y);
			Z3.mul(ZZ);
			Z3.pmul(Qy);

			X.mul(T);
			X.sub(Y);
			a=new FP4(Z3,X); //a.set(Z3,X);
			T.neg();
			ZZ.mul(T);

			ZZ.pmul(Qx);

			b=new FP4(ZZ); //b.seta(ZZ);
		}
		r.set(a,b,c);
		return r;		
	},

/* Optimal R-ate pairing */
	ate: function(P,Q)
	{
		var fa=new BIG(0); fa.rcopy(ROM.CURVE_Fra);
		var fb=new BIG(0); fb.rcopy(ROM.CURVE_Frb);
		var f=new FP2(fa,fb); //f.bset(fa,fb);
	
		var x=new BIG(0); x.rcopy(ROM.CURVE_Bnx);
		var n=new BIG(x); //n.copy(x);
		var K=new ECP2();
		var lv;
		n.pmul(6); n.dec(2); n.norm();
		P.affine();
		Q.affine();
		var Qx=new FP(Q.getx()); //Qx.copy(Q.getx());
		var Qy=new FP(Q.gety()); //Qy.copy(Q.gety());

		var A=new ECP2();
		var r=new FP12(1);

		A.copy(P);
		var nb=n.nbits();

		for (var i=nb-2;i>=1;i--)
		{
			lv=PAIR.line(A,A,Qx,Qy);

			r.smul(lv);

			if (n.bit(i)==1)
			{
				lv=PAIR.line(A,P,Qx,Qy);
				r.smul(lv);
			}
			r.sqr();
		}
		lv=PAIR.line(A,A,Qx,Qy);
		r.smul(lv);

/* R-ate fixup */
		r.conj();
		K.copy(P);
		K.frob(f);
		A.neg();
		lv=PAIR.line(A,K,Qx,Qy);
		r.smul(lv);
		K.frob(f);
		K.neg();
		lv=PAIR.line(A,K,Qx,Qy);
		r.smul(lv);

		return r;
	},

/* Optimal R-ate double pairing e(P,Q).e(R,S) */
	ate2: function(P,Q,R,S)
	{
		var fa=new BIG(0); fa.rcopy(ROM.CURVE_Fra);
		var fb=new BIG(0); fb.rcopy(ROM.CURVE_Frb);
		var f=new FP2(fa,fb); //f.bset(fa,fb);
		var x=new BIG(0); x.rcopy(ROM.CURVE_Bnx);

		var n=new BIG(x); //n.copy(x);
		var K=new ECP2();
		var lv;
		n.pmul(6); n.dec(2); n.norm();
		P.affine();
		Q.affine();
		R.affine();
		S.affine();

		var Qx=new FP(Q.getx()); //Qx.copy(Q.getx());
		var Qy=new FP(Q.gety()); //Qy.copy(Q.gety());

		var Sx=new FP(S.getx()); //Sx.copy(S.getx());
		var Sy=new FP(S.gety()); //Sy.copy(S.gety());

		var A=new ECP2();
		var B=new ECP2();
		var r=new FP12(1);

		A.copy(P);
		B.copy(R);
		var nb=n.nbits();

		for (var i=nb-2;i>=1;i--)
		{
			lv=PAIR.line(A,A,Qx,Qy);
			r.smul(lv);
			lv=PAIR.line(B,B,Sx,Sy);
			r.smul(lv);
			if (n.bit(i)==1)
			{
				lv=PAIR.line(A,P,Qx,Qy);
				r.smul(lv);
				lv=PAIR.line(B,R,Sx,Sy);
				r.smul(lv);
			}
			r.sqr();
		}

		lv=PAIR.line(A,A,Qx,Qy);
		r.smul(lv);

		lv=PAIR.line(B,B,Sx,Sy);
		r.smul(lv);

		
/* R-ate fixup */
		r.conj();

		K.copy(P);
		K.frob(f);
		A.neg();
		lv=PAIR.line(A,K,Qx,Qy);
		r.smul(lv);
		K.frob(f);
		K.neg();
		lv=PAIR.line(A,K,Qx,Qy);
		r.smul(lv);

		K.copy(R);
		K.frob(f);
		B.neg();
		lv=PAIR.line(B,K,Sx,Sy);
		r.smul(lv);
		K.frob(f);
		K.neg();
		lv=PAIR.line(B,K,Sx,Sy);
		r.smul(lv);

		return r;
	},

/* final exponentiation - keep separate for multi-pairings and to avoid thrashing stack */
	fexp: function(m)
	{
		var fa=new BIG(0); fa.rcopy(ROM.CURVE_Fra);
		var fb=new BIG(0); fb.rcopy(ROM.CURVE_Frb);
		var f=new FP2(fa,fb);
		var x=new BIG(0); x.rcopy(ROM.CURVE_Bnx);

		var r=new FP12(m); //r.copy(m);
		var x0,x1,x2,x3,x4,x5;
	
/* Easy part of final exp */
		var lv=new FP12(r); //lv.copy(r);
		lv.inverse();
		r.conj();
		r.mul(lv);
		lv.copy(r);
		r.frob(f);	
		r.frob(f);
		r.mul(lv);

/* Hard part of final exp */
		lv.copy(r);
		lv.frob(f);
		x0=new FP12(lv); //x0.copy(lv);
		x0.frob(f);
		lv.mul(r);
		x0.mul(lv);
		x0.frob(f);
		x1=new FP12(r); //x1.copy(r);
		x1.conj();

		x4=r.pow(x);

		x3=new FP12(x4); //x3.copy(x4);
		x3.frob(f);
		x2=x4.pow(x);

		x5=new FP12(x2); /*x5.copy(x2);*/  x5.conj();
		lv=x2.pow(x);

		x2.frob(f);
		r.copy(x2); r.conj();

		x4.mul(r);
		x2.frob(f);

		r.copy(lv);
		r.frob(f);
		lv.mul(r);

		lv.usqr();
		lv.mul(x4);
		lv.mul(x5);
		r.copy(x3);
		r.mul(x5);
		r.mul(lv);
		lv.mul(x2);
		r.usqr();
		r.mul(lv);
		r.usqr();
		lv.copy(r);
		lv.mul(x1);
		r.mul(x0);
		lv.usqr();
		r.mul(lv);
		r.reduce();
		return r;
	}
};

/* GLV method */
PAIR.glv= function(e)
{
	var i,j;
	var t=new BIG(0);
	var q=new BIG(0); q.rcopy(ROM.CURVE_Order);
	var u=[];
	var v=[];
	for (i=0;i<2;i++)
	{
		t.rcopy(ROM.CURVE_W[i]);
		var d=BIG.mul(t,e);
		v[i]=new BIG(d.div(q));
		u[i]=new BIG(0);
	}
	u[0].copy(e);
	for (i=0;i<2;i++)
		for (j=0;j<2;j++)
		{
			t.rcopy(ROM.CURVE_SB[j][i]);
			t.copy(BIG.modmul(v[j],t,q));
			u[i].add(q);
			u[i].sub(t);
			u[i].mod(q);
		}
	return u;
};

/* Galbraith & Scott Method */
PAIR.gs= function(e)
{
	var i,j;
	var t=new BIG(0);
	var q=new BIG(0); q.rcopy(ROM.CURVE_Order);
	var u=[];
	var v=[];

	for (i=0;i<4;i++)
	{
		t.rcopy(ROM.CURVE_WB[i]);
		var d=BIG.mul(t,e);
		v[i]=new BIG(d.div(q));
		u[i]=new BIG(0);
	}

	u[0].copy(e);
	for (i=0;i<4;i++)
		for (j=0;j<4;j++)
		{
			t.rcopy(ROM.CURVE_BB[j][i]);
			t.copy(BIG.modmul(v[j],t,q));
			u[i].add(q);
			u[i].sub(t);
			u[i].mod(q);
		}
	return u;
};	

/* Multiply P by e in group G1 */
PAIR.G1mul= function(P,e)
{
	var R;
	if (ROM.USE_GLV)
	{
		P.affine();
		R=new ECP();
		R.copy(P);
		var np,nn;
		var Q=new ECP();
		Q.copy(P);
		var q=new BIG(0); q.rcopy(ROM.CURVE_Order);
		var bcru=new BIG(0); bcru.rcopy(ROM.CURVE_Cru);
		var cru=new FP(bcru);
		var t=new BIG(0);
		var u=PAIR.glv(e);
		Q.getx().mul(cru);

		np=u[0].nbits();
		t.copy(BIG.modneg(u[0],q));
		nn=t.nbits();
		if (nn<np)
		{
			u[0].copy(t);
			R.neg();
		}

		np=u[1].nbits();
		t.copy(BIG.modneg(u[1],q));
		nn=t.nbits();
		if (nn<np)
		{
			u[1].copy(t);
			Q.neg();
		}

		R=R.mul2(u[0],Q,u[1]);
			
	}
	else
	{
		R=P.mul(e);
	}
	return R;
};

/* Multiply P by e in group G2 */
PAIR.G2mul= function(P,e)
{
	var R;
	if (ROM.USE_GS_G2)
	{
		var Q=[];
		var fa=new BIG(0); fa.rcopy(ROM.CURVE_Fra);
		var fb=new BIG(0); fb.rcopy(ROM.CURVE_Frb);
		var f=new FP2(fa,fb); //f.bset(fa,fb);
		var q=new BIG(0); q.rcopy(ROM.CURVE_Order);

		var u=PAIR.gs(e);
		var t=new BIG(0);
		var i,np,nn;
		P.affine();
		Q[0]=new ECP2(); Q[0].copy(P);
		for (i=1;i<4;i++)
		{
			Q[i]=new ECP2(); Q[i].copy(Q[i-1]);
			Q[i].frob(f);
		}

		for (i=0;i<4;i++)
		{
			np=u[i].nbits();
			t.copy(BIG.modneg(u[i],q));
			nn=t.nbits();
			if (nn<np)
			{
				u[i].copy(t);
				Q[i].neg();
			}
		}

		R=ECP2.mul4(Q,u);
	}
	else
	{
		R=P.mul(e);
	}
	return R;
};

/* Note that this method requires a lot of RAM! Better to use compressed XTR method, see FP4.js */
PAIR.GTpow= function(d,e)
{
	var r;
	if (ROM.USE_GS_GT)
	{
		var g=[];
		var fa=new BIG(0); fa.rcopy(ROM.CURVE_Fra);
		var fb=new BIG(0); fb.rcopy(ROM.CURVE_Frb);
		var f=new FP2(fa,fb);
		var q=new BIG(0); q.rcopy(ROM.CURVE_Order);
		var t=new BIG(0);
		var i,np,nn;
		var u=PAIR.gs(e);

		g[0]=new FP12(d);
		for (i=1;i<4;i++)
		{
			g[i]=new FP12(0); g[i].copy(g[i-1]);
			g[i].frob(f);
		}
		for (i=0;i<4;i++)
		{
			np=u[i].nbits();
			t.copy(BIG.modneg(u[i],q));
			nn=t.nbits();
			if (nn<np)
			{
				u[i].copy(t);
				g[i].conj();
			}
		}
		r=FP12.pow4(g,u);
	}
	else
	{
		r=d.pow(e);
	}
	return r;
};

/* test group membership */
/* with GT-Strong curve, now only check that m!=1, conj(m)*m==1, and m.m^{p^4}=m^{p^2} */
PAIR.GTmember= function(m)
{
	if (m.isunity()) return false;
	var r=new FP12(m);
	r.conj();
	r.mul(m);
	if (!r.isunity()) return false;

	var fa=new BIG(0); fa.rcopy(ROM.CURVE_Fra);
	var fb=new BIG(0); fb.rcopy(ROM.CURVE_Frb);
	var f=new FP2(fa,fb); //f.bset(fa,fb);

	r.copy(m); r.frob(f); r.frob(f);
	var w=new FP12(r); w.frob(f); w.frob(f);
	w.mul(m);
	if (!ROM.GT_STRONG)
	{
		if (!w.equals(r)) return false;
		var x=new BIG(0); x.rcopy(ROM.CURVE_Bnx);
		r.copy(m); w=r.pow(x); w=w.pow(x);
		r.copy(w); r.sqr(); r.mul(w); r.sqr();
		w.copy(m); w.frob(f);
	}
	return w.equals(r);
};
