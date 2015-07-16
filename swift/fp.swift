//
//  fp.swift
//  miot2
//
//  Created by Michael Scott on 20/06/2015.
//  Copyright (c) 2015 Michael Scott. All rights reserved.
//  Small Finite Field arithmetic
//  CLINT mod p functions
//

final class FP {
    var x:BIG
    static let p=BIG(ROM.Modulus)
/* convert to Montgomery n-residue form */
    func nres()
    {
        if ROM.MODTYPE != ROM.PSEUDO_MERSENNE
        {
            var d=DBIG(x)
            d.shl(ROM.NLEN*Int(ROM.BASEBITS))
            x.copy(d.mod(FP.p))
        }
    }
/* convert back to regular form */
    func redc() -> BIG
    {
        if ROM.MODTYPE != ROM.PSEUDO_MERSENNE
        {
            var d=DBIG(x)
            return BIG.mod(d)
        }
        else
        {
            var r=BIG(x)
            return r;
        }
    }
    
    init()
    {
        x=BIG(0)
    }
    init(_ a: Int32)
    {
        x=BIG(a)
        nres()
    }
    init(_ a: BIG)
    {
        x=BIG(a)
        nres()
    }
    init(_ a: FP)
    {
        x=BIG(a.x)
    }
    /* convert to string */
    func toString() -> String
    {
        var s=redc().toString();
        return s;
    }
    
    func toRawString() -> String
    {
        var s=x.toRawString();
        return s;
    }
/* reduce this mod Modulus */
    func reduce()
    {
        x.mod(FP.p)
    }
    
/* test this=0? */
    func iszilch() -> Bool
    {
        reduce();
        return x.iszilch()
    }
    
/* copy from FP b */
    func copy(b: FP)
    {
        x.copy(b.x);
    }
    
/* set this=0 */
    func zero()
    {
        x.zero();
    }
    
/* set this=1 */
    func one()
    {
        x.one(); nres()
    }
    
/* normalise this */
    func norm()
    {
        x.norm();
    }
/* swap FPs depending on d */
    func cswap(b: FP,_ d: Int32)
    {
        x.cswap(b.x,d)
    }
    
/* copy FPs depending on d */
    func cmove(b: FP,_ d:Int32)
    {
        x.cmove(b.x,d);
    }
/* this*=b mod Modulus */
    func mul(b: FP)
    {
        var ea=BIG.EXCESS(x)
        var eb=BIG.EXCESS(b.x)
    
        if (ea+1)*(eb+1)+1>=ROM.FEXCESS {reduce()}
    
        var d=BIG.mul(x,b.x)
        x.copy(BIG.mod(d))
    }
/* this = -this mod Modulus */
    func neg()
    {
        var m=BIG(FP.p);
    
        norm();
    
        var ov=BIG.EXCESS(x);
        var sb=1; while(ov != 0) {sb++;ov>>=1}
    
        m.fshl(sb)
        x.rsub(m)
    
        if BIG.EXCESS(x)>=ROM.FEXCESS {reduce()}
    }
    /* this*=c mod Modulus, where c is a small int */
    func imul(c: Int32)
    {
        var cc=c
        norm();
        var s=false
        if (cc<0)
        {
            cc = -cc
            s=true
        }
        var afx=(BIG.EXCESS(x)+1)*(cc+1)+1;
        if cc<ROM.NEXCESS && afx<ROM.FEXCESS
        {
            x.imul(cc);
        }
        else
        {
            if afx<ROM.FEXCESS {x.pmul(cc)}
            else
            {
				var d=x.pxmul(cc);
				x.copy(d.mod(FP.p));
            }
        }
        if s {neg()}
        norm();
    }
    
/* this*=this mod Modulus */
    func sqr()
    {
        var ea=BIG.EXCESS(x);
        if (ea+1)*(ea+1)+1>=ROM.FEXCESS {reduce()}
    
        var d=BIG.sqr(x);
        x.copy(BIG.mod(d));
    }
    
/* this+=b */
    func add(b: FP)
    {
        x.add(b.x);
        if BIG.EXCESS(x)+2>=ROM.FEXCESS {reduce()}
    }
/* this-=b */
    func sub(b: FP)
    {
        var n=FP(b)
        n.neg()
        self.add(n)
    }
/* this/=2 mod Modulus */
    func div2()
    {
        x.norm()
        if (x.parity()==0)
            {x.fshr(1)}
        else
        {
            x.add(FP.p)
            x.norm()
            x.fshr(1)
        }
    }
/* this=1/this mod Modulus */
    func inverse()
    {
        var r=redc()
        r.invmodp(FP.p)
        x.copy(r)
        nres()
    }
    
/* return TRUE if this==a */
    func equals(a: FP) -> Bool
    {
        a.reduce()
        reduce()
        if (BIG.comp(a.x,x)==0) {return true}
        return false;
    }
/* return this^e mod Modulus */
    func pow(e: BIG) -> FP
    {
        var r=FP(1)
        e.norm()
        x.norm()
        while (true)
        {
            var bt=e.parity()
            e.fshr(1)
            if bt==1 {r.mul(self)}
            if e.iszilch() {break}
            sqr();
        }
        r.x.mod(FP.p);
        return r;
    }
/* return sqrt(this) mod Modulus */
    func sqrt() -> FP
    {
        reduce();
        var b=BIG(FP.p)
        if (ROM.MOD8==5)
        {
            b.dec(5); b.norm(); b.shr(3)
            var i=FP(self); i.x.shl(1)
            var v=i.pow(b)
            i.mul(v); i.mul(v)
            i.x.dec(1)
            var r=FP(self)
            r.mul(v); r.mul(i)
            r.reduce()
            return r
        }
        else
        {
            b.inc(1); b.norm(); b.shr(2)
            return pow(b)
        }
    }
/* return jacobi symbol (this/Modulus) */
    func jacobi() -> Int
    {
        var w=redc()
        return w.jacobi(FP.p)
    }
    
}
