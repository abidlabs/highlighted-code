class J {
  /**
  Get the line description around the given position.
  */
  lineAt(e) {
    if (e < 0 || e > this.length)
      throw new RangeError(`Invalid position ${e} in document of length ${this.length}`);
    return this.lineInner(e, !1, 1, 0);
  }
  /**
  Get the description for the given (1-based) line number.
  */
  line(e) {
    if (e < 1 || e > this.lines)
      throw new RangeError(`Invalid line number ${e} in ${this.lines}-line document`);
    return this.lineInner(e, !0, 1, 0);
  }
  /**
  Replace a range of the text with the given content.
  */
  replace(e, t, i) {
    [e, t] = Ai(this, e, t);
    let s = [];
    return this.decompose(
      0,
      e,
      s,
      2
      /* Open.To */
    ), i.length && i.decompose(
      0,
      i.length,
      s,
      3
      /* Open.To */
    ), this.decompose(
      t,
      this.length,
      s,
      1
      /* Open.From */
    ), tt.from(s, this.length - (t - e) + i.length);
  }
  /**
  Append another document to this one.
  */
  append(e) {
    return this.replace(this.length, this.length, e);
  }
  /**
  Retrieve the text between the given points.
  */
  slice(e, t = this.length) {
    [e, t] = Ai(this, e, t);
    let i = [];
    return this.decompose(e, t, i, 0), tt.from(i, t - e);
  }
  /**
  Test whether this text is equal to another instance.
  */
  eq(e) {
    if (e == this)
      return !0;
    if (e.length != this.length || e.lines != this.lines)
      return !1;
    let t = this.scanIdentical(e, 1), i = this.length - this.scanIdentical(e, -1), s = new en(this), r = new en(e);
    for (let o = t, l = t; ; ) {
      if (s.next(o), r.next(o), o = 0, s.lineBreak != r.lineBreak || s.done != r.done || s.value != r.value)
        return !1;
      if (l += s.value.length, s.done || l >= i)
        return !0;
    }
  }
  /**
  Iterate over the text. When `dir` is `-1`, iteration happens
  from end to start. This will return lines and the breaks between
  them as separate strings.
  */
  iter(e = 1) {
    return new en(this, e);
  }
  /**
  Iterate over a range of the text. When `from` > `to`, the
  iterator will run in reverse.
  */
  iterRange(e, t = this.length) {
    return new of(this, e, t);
  }
  /**
  Return a cursor that iterates over the given range of lines,
  _without_ returning the line breaks between, and yielding empty
  strings for empty lines.
  
  When `from` and `to` are given, they should be 1-based line numbers.
  */
  iterLines(e, t) {
    let i;
    if (e == null)
      i = this.iter();
    else {
      t == null && (t = this.lines + 1);
      let s = this.line(e).from;
      i = this.iterRange(s, Math.max(s, t == this.lines + 1 ? this.length : t <= 1 ? 0 : this.line(t - 1).to));
    }
    return new lf(i);
  }
  /**
  Return the document as a string, using newline characters to
  separate lines.
  */
  toString() {
    return this.sliceString(0);
  }
  /**
  Convert the document to an array of lines (which can be
  deserialized again via [`Text.of`](https://codemirror.net/6/docs/ref/#state.Text^of)).
  */
  toJSON() {
    let e = [];
    return this.flatten(e), e;
  }
  /**
  @internal
  */
  constructor() {
  }
  /**
  Create a `Text` instance for the given array of lines.
  */
  static of(e) {
    if (e.length == 0)
      throw new RangeError("A document must have at least one line");
    return e.length == 1 && !e[0] ? J.empty : e.length <= 32 ? new oe(e) : tt.from(oe.split(e, []));
  }
}
class oe extends J {
  constructor(e, t = yd(e)) {
    super(), this.text = e, this.length = t;
  }
  get lines() {
    return this.text.length;
  }
  get children() {
    return null;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.text[r], l = s + o.length;
      if ((t ? i : l) >= e)
        return new wd(s, l, i, o);
      s = l + 1, i++;
    }
  }
  decompose(e, t, i, s) {
    let r = e <= 0 && t >= this.length ? this : new oe(wl(this.text, e, t), Math.min(t, this.length) - Math.max(0, e));
    if (s & 1) {
      let o = i.pop(), l = ts(r.text, o.text.slice(), 0, r.length);
      if (l.length <= 32)
        i.push(new oe(l, o.length + r.length));
      else {
        let a = l.length >> 1;
        i.push(new oe(l.slice(0, a)), new oe(l.slice(a)));
      }
    } else
      i.push(r);
  }
  replace(e, t, i) {
    if (!(i instanceof oe))
      return super.replace(e, t, i);
    [e, t] = Ai(this, e, t);
    let s = ts(this.text, ts(i.text, wl(this.text, 0, e)), t), r = this.length + i.length - (t - e);
    return s.length <= 32 ? new oe(s, r) : tt.from(oe.split(s, []), r);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Ai(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r <= t && o < this.text.length; o++) {
      let l = this.text[o], a = r + l.length;
      r > e && o && (s += i), e < a && t > r && (s += l.slice(Math.max(0, e - r), t - r)), r = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.text)
      e.push(t);
  }
  scanIdentical() {
    return 0;
  }
  static split(e, t) {
    let i = [], s = -1;
    for (let r of e)
      i.push(r), s += r.length + 1, i.length == 32 && (t.push(new oe(i, s)), i = [], s = -1);
    return s > -1 && t.push(new oe(i, s)), t;
  }
}
class tt extends J {
  constructor(e, t) {
    super(), this.children = e, this.length = t, this.lines = 0;
    for (let i of e)
      this.lines += i.lines;
  }
  lineInner(e, t, i, s) {
    for (let r = 0; ; r++) {
      let o = this.children[r], l = s + o.length, a = i + o.lines - 1;
      if ((t ? a : l) >= e)
        return o.lineInner(e, t, i, s);
      s = l + 1, i = a + 1;
    }
  }
  decompose(e, t, i, s) {
    for (let r = 0, o = 0; o <= t && r < this.children.length; r++) {
      let l = this.children[r], a = o + l.length;
      if (e <= a && t >= o) {
        let h = s & ((o <= e ? 1 : 0) | (a >= t ? 2 : 0));
        o >= e && a <= t && !h ? i.push(l) : l.decompose(e - o, t - o, i, h);
      }
      o = a + 1;
    }
  }
  replace(e, t, i) {
    if ([e, t] = Ai(this, e, t), i.lines < this.lines)
      for (let s = 0, r = 0; s < this.children.length; s++) {
        let o = this.children[s], l = r + o.length;
        if (e >= r && t <= l) {
          let a = o.replace(e - r, t - r, i), h = this.lines - o.lines + a.lines;
          if (a.lines < h >> 5 - 1 && a.lines > h >> 5 + 1) {
            let f = this.children.slice();
            return f[s] = a, new tt(f, this.length - (t - e) + i.length);
          }
          return super.replace(r, l, a);
        }
        r = l + 1;
      }
    return super.replace(e, t, i);
  }
  sliceString(e, t = this.length, i = `
`) {
    [e, t] = Ai(this, e, t);
    let s = "";
    for (let r = 0, o = 0; r < this.children.length && o <= t; r++) {
      let l = this.children[r], a = o + l.length;
      o > e && r && (s += i), e < a && t > o && (s += l.sliceString(e - o, t - o, i)), o = a + 1;
    }
    return s;
  }
  flatten(e) {
    for (let t of this.children)
      t.flatten(e);
  }
  scanIdentical(e, t) {
    if (!(e instanceof tt))
      return 0;
    let i = 0, [s, r, o, l] = t > 0 ? [0, 0, this.children.length, e.children.length] : [this.children.length - 1, e.children.length - 1, -1, -1];
    for (; ; s += t, r += t) {
      if (s == o || r == l)
        return i;
      let a = this.children[s], h = e.children[r];
      if (a != h)
        return i + a.scanIdentical(h, t);
      i += a.length + 1;
    }
  }
  static from(e, t = e.reduce((i, s) => i + s.length + 1, -1)) {
    let i = 0;
    for (let d of e)
      i += d.lines;
    if (i < 32) {
      let d = [];
      for (let p of e)
        p.flatten(d);
      return new oe(d, t);
    }
    let s = Math.max(
      32,
      i >> 5
      /* Tree.BranchShift */
    ), r = s << 1, o = s >> 1, l = [], a = 0, h = -1, f = [];
    function c(d) {
      let p;
      if (d.lines > r && d instanceof tt)
        for (let m of d.children)
          c(m);
      else
        d.lines > o && (a > o || !a) ? (u(), l.push(d)) : d instanceof oe && a && (p = f[f.length - 1]) instanceof oe && d.lines + p.lines <= 32 ? (a += d.lines, h += d.length + 1, f[f.length - 1] = new oe(p.text.concat(d.text), p.length + 1 + d.length)) : (a + d.lines > s && u(), a += d.lines, h += d.length + 1, f.push(d));
    }
    function u() {
      a != 0 && (l.push(f.length == 1 ? f[0] : tt.from(f, h)), h = -1, a = f.length = 0);
    }
    for (let d of e)
      c(d);
    return u(), l.length == 1 ? l[0] : new tt(l, t);
  }
}
J.empty = /* @__PURE__ */ new oe([""], 0);
function yd(n) {
  let e = -1;
  for (let t of n)
    e += t.length + 1;
  return e;
}
function ts(n, e, t = 0, i = 1e9) {
  for (let s = 0, r = 0, o = !0; r < n.length && s <= i; r++) {
    let l = n[r], a = s + l.length;
    a >= t && (a > i && (l = l.slice(0, i - s)), s < t && (l = l.slice(t - s)), o ? (e[e.length - 1] += l, o = !1) : e.push(l)), s = a + 1;
  }
  return e;
}
function wl(n, e, t) {
  return ts(n, [""], e, t);
}
class en {
  constructor(e, t = 1) {
    this.dir = t, this.done = !1, this.lineBreak = !1, this.value = "", this.nodes = [e], this.offsets = [t > 0 ? 1 : (e instanceof oe ? e.text.length : e.children.length) << 1];
  }
  nextInner(e, t) {
    for (this.done = this.lineBreak = !1; ; ) {
      let i = this.nodes.length - 1, s = this.nodes[i], r = this.offsets[i], o = r >> 1, l = s instanceof oe ? s.text.length : s.children.length;
      if (o == (t > 0 ? l : 0)) {
        if (i == 0)
          return this.done = !0, this.value = "", this;
        t > 0 && this.offsets[i - 1]++, this.nodes.pop(), this.offsets.pop();
      } else if ((r & 1) == (t > 0 ? 0 : 1)) {
        if (this.offsets[i] += t, e == 0)
          return this.lineBreak = !0, this.value = `
`, this;
        e--;
      } else if (s instanceof oe) {
        let a = s.text[o + (t < 0 ? -1 : 0)];
        if (this.offsets[i] += t, a.length > Math.max(0, e))
          return this.value = e == 0 ? a : t > 0 ? a.slice(e) : a.slice(0, a.length - e), this;
        e -= a.length;
      } else {
        let a = s.children[o + (t < 0 ? -1 : 0)];
        e > a.length ? (e -= a.length, this.offsets[i] += t) : (t < 0 && this.offsets[i]--, this.nodes.push(a), this.offsets.push(t > 0 ? 1 : (a instanceof oe ? a.text.length : a.children.length) << 1));
      }
    }
  }
  next(e = 0) {
    return e < 0 && (this.nextInner(-e, -this.dir), e = this.value.length), this.nextInner(e, this.dir);
  }
}
class of {
  constructor(e, t, i) {
    this.value = "", this.done = !1, this.cursor = new en(e, t > i ? -1 : 1), this.pos = t > i ? e.length : 0, this.from = Math.min(t, i), this.to = Math.max(t, i);
  }
  nextInner(e, t) {
    if (t < 0 ? this.pos <= this.from : this.pos >= this.to)
      return this.value = "", this.done = !0, this;
    e += Math.max(0, t < 0 ? this.pos - this.to : this.from - this.pos);
    let i = t < 0 ? this.pos - this.from : this.to - this.pos;
    e > i && (e = i), i -= e;
    let { value: s } = this.cursor.next(e);
    return this.pos += (s.length + e) * t, this.value = s.length <= i ? s : t < 0 ? s.slice(s.length - i) : s.slice(0, i), this.done = !this.value, this;
  }
  next(e = 0) {
    return e < 0 ? e = Math.max(e, this.from - this.pos) : e > 0 && (e = Math.min(e, this.to - this.pos)), this.nextInner(e, this.cursor.dir);
  }
  get lineBreak() {
    return this.cursor.lineBreak && this.value != "";
  }
}
class lf {
  constructor(e) {
    this.inner = e, this.afterBreak = !0, this.value = "", this.done = !1;
  }
  next(e = 0) {
    let { done: t, lineBreak: i, value: s } = this.inner.next(e);
    return t && this.afterBreak ? (this.value = "", this.afterBreak = !1) : t ? (this.done = !0, this.value = "") : i ? this.afterBreak ? this.value = "" : (this.afterBreak = !0, this.next()) : (this.value = s, this.afterBreak = !1), this;
  }
  get lineBreak() {
    return !1;
  }
}
typeof Symbol < "u" && (J.prototype[Symbol.iterator] = function() {
  return this.iter();
}, en.prototype[Symbol.iterator] = of.prototype[Symbol.iterator] = lf.prototype[Symbol.iterator] = function() {
  return this;
});
class wd {
  /**
  @internal
  */
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.number = i, this.text = s;
  }
  /**
  The length of the line (not including any line break after it).
  */
  get length() {
    return this.to - this.from;
  }
}
function Ai(n, e, t) {
  return e = Math.max(0, Math.min(n.length, e)), [e, Math.max(e, Math.min(n.length, t))];
}
let ki = /* @__PURE__ */ "lc,34,7n,7,7b,19,,,,2,,2,,,20,b,1c,l,g,,2t,7,2,6,2,2,,4,z,,u,r,2j,b,1m,9,9,,o,4,,9,,3,,5,17,3,3b,f,,w,1j,,,,4,8,4,,3,7,a,2,t,,1m,,,,2,4,8,,9,,a,2,q,,2,2,1l,,4,2,4,2,2,3,3,,u,2,3,,b,2,1l,,4,5,,2,4,,k,2,m,6,,,1m,,,2,,4,8,,7,3,a,2,u,,1n,,,,c,,9,,14,,3,,1l,3,5,3,,4,7,2,b,2,t,,1m,,2,,2,,3,,5,2,7,2,b,2,s,2,1l,2,,,2,4,8,,9,,a,2,t,,20,,4,,2,3,,,8,,29,,2,7,c,8,2q,,2,9,b,6,22,2,r,,,,,,1j,e,,5,,2,5,b,,10,9,,2u,4,,6,,2,2,2,p,2,4,3,g,4,d,,2,2,6,,f,,jj,3,qa,3,t,3,t,2,u,2,1s,2,,7,8,,2,b,9,,19,3,3b,2,y,,3a,3,4,2,9,,6,3,63,2,2,,1m,,,7,,,,,2,8,6,a,2,,1c,h,1r,4,1c,7,,,5,,14,9,c,2,w,4,2,2,,3,1k,,,2,3,,,3,1m,8,2,2,48,3,,d,,7,4,,6,,3,2,5i,1m,,5,ek,,5f,x,2da,3,3x,,2o,w,fe,6,2x,2,n9w,4,,a,w,2,28,2,7k,,3,,4,,p,2,5,,47,2,q,i,d,,12,8,p,b,1a,3,1c,,2,4,2,2,13,,1v,6,2,2,2,2,c,,8,,1b,,1f,,,3,2,2,5,2,,,16,2,8,,6m,,2,,4,,fn4,,kh,g,g,g,a6,2,gt,,6a,,45,5,1ae,3,,2,5,4,14,3,4,,4l,2,fx,4,ar,2,49,b,4w,,1i,f,1k,3,1d,4,2,2,1x,3,10,5,,8,1q,,c,2,1g,9,a,4,2,,2n,3,2,,,2,6,,4g,,3,8,l,2,1l,2,,,,,m,,e,7,3,5,5f,8,2,3,,,n,,29,,2,6,,,2,,,2,,2,6j,,2,4,6,2,,2,r,2,2d,8,2,,,2,2y,,,,2,6,,,2t,3,2,4,,5,77,9,,2,6t,,a,2,,,4,,40,4,2,2,4,,w,a,14,6,2,4,8,,9,6,2,3,1a,d,,2,ba,7,,6,,,2a,m,2,7,,2,,2,3e,6,3,,,2,,7,,,20,2,3,,,,9n,2,f0b,5,1n,7,t4,,1r,4,29,,f5k,2,43q,,,3,4,5,8,8,2,7,u,4,44,3,1iz,1j,4,1e,8,,e,,m,5,,f,11s,7,,h,2,7,,2,,5,79,7,c5,4,15s,7,31,7,240,5,gx7k,2o,3k,6o".split(",").map((n) => n ? parseInt(n, 36) : 1);
for (let n = 1; n < ki.length; n++)
  ki[n] += ki[n - 1];
function kd(n) {
  for (let e = 1; e < ki.length; e += 2)
    if (ki[e] > n)
      return ki[e - 1] <= n;
  return !1;
}
function kl(n) {
  return n >= 127462 && n <= 127487;
}
const vl = 8205;
function xe(n, e, t = !0, i = !0) {
  return (t ? af : vd)(n, e, i);
}
function af(n, e, t) {
  if (e == n.length)
    return e;
  e && hf(n.charCodeAt(e)) && ff(n.charCodeAt(e - 1)) && e--;
  let i = be(n, e);
  for (e += je(i); e < n.length; ) {
    let s = be(n, e);
    if (i == vl || s == vl || t && kd(s))
      e += je(s), i = s;
    else if (kl(s)) {
      let r = 0, o = e - 2;
      for (; o >= 0 && kl(be(n, o)); )
        r++, o -= 2;
      if (r % 2 == 0)
        break;
      e += 2;
    } else
      break;
  }
  return e;
}
function vd(n, e, t) {
  for (; e > 0; ) {
    let i = af(n, e - 2, t);
    if (i < e)
      return i;
    e--;
  }
  return 0;
}
function hf(n) {
  return n >= 56320 && n < 57344;
}
function ff(n) {
  return n >= 55296 && n < 56320;
}
function be(n, e) {
  let t = n.charCodeAt(e);
  if (!ff(t) || e + 1 == n.length)
    return t;
  let i = n.charCodeAt(e + 1);
  return hf(i) ? (t - 55296 << 10) + (i - 56320) + 65536 : t;
}
function cf(n) {
  return n <= 65535 ? String.fromCharCode(n) : (n -= 65536, String.fromCharCode((n >> 10) + 55296, (n & 1023) + 56320));
}
function je(n) {
  return n < 65536 ? 1 : 2;
}
const Er = /\r\n?|\n/;
var me = /* @__PURE__ */ function(n) {
  return n[n.Simple = 0] = "Simple", n[n.TrackDel = 1] = "TrackDel", n[n.TrackBefore = 2] = "TrackBefore", n[n.TrackAfter = 3] = "TrackAfter", n;
}(me || (me = {}));
class ht {
  // Sections are encoded as pairs of integers. The first is the
  // length in the current document, and the second is -1 for
  // unaffected sections, and the length of the replacement content
  // otherwise. So an insertion would be (0, n>0), a deletion (n>0,
  // 0), and a replacement two positive numbers.
  /**
  @internal
  */
  constructor(e) {
    this.sections = e;
  }
  /**
  The length of the document before the change.
  */
  get length() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2)
      e += this.sections[t];
    return e;
  }
  /**
  The length of the document after the change.
  */
  get newLength() {
    let e = 0;
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t + 1];
      e += i < 0 ? this.sections[t] : i;
    }
    return e;
  }
  /**
  False when there are actual changes in this set.
  */
  get empty() {
    return this.sections.length == 0 || this.sections.length == 2 && this.sections[1] < 0;
  }
  /**
  Iterate over the unchanged parts left by these changes. `posA`
  provides the position of the range in the old document, `posB`
  the new position in the changed document.
  */
  iterGaps(e) {
    for (let t = 0, i = 0, s = 0; t < this.sections.length; ) {
      let r = this.sections[t++], o = this.sections[t++];
      o < 0 ? (e(i, s, r), s += r) : s += o, i += r;
    }
  }
  /**
  Iterate over the ranges changed by these changes. (See
  [`ChangeSet.iterChanges`](https://codemirror.net/6/docs/ref/#state.ChangeSet.iterChanges) for a
  variant that also provides you with the inserted text.)
  `fromA`/`toA` provides the extent of the change in the starting
  document, `fromB`/`toB` the extent of the replacement in the
  changed document.
  
  When `individual` is true, adjacent changes (which are kept
  separate for [position mapping](https://codemirror.net/6/docs/ref/#state.ChangeDesc.mapPos)) are
  reported separately.
  */
  iterChangedRanges(e, t = !1) {
    Rr(this, e, t);
  }
  /**
  Get a description of the inverted form of these changes.
  */
  get invertedDesc() {
    let e = [];
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      s < 0 ? e.push(i, s) : e.push(s, i);
    }
    return new ht(e);
  }
  /**
  Compute the combined effect of applying another set of changes
  after this one. The length of the document after this set should
  match the length before `other`.
  */
  composeDesc(e) {
    return this.empty ? e : e.empty ? this : uf(this, e);
  }
  /**
  Map this description, which should start with the same document
  as `other`, over another set of changes, so that it can be
  applied after it. When `before` is true, map as if the changes
  in `other` happened before the ones in `this`.
  */
  mapDesc(e, t = !1) {
    return e.empty ? this : Ir(this, e, t);
  }
  mapPos(e, t = -1, i = me.Simple) {
    let s = 0, r = 0;
    for (let o = 0; o < this.sections.length; ) {
      let l = this.sections[o++], a = this.sections[o++], h = s + l;
      if (a < 0) {
        if (h > e)
          return r + (e - s);
        r += l;
      } else {
        if (i != me.Simple && h >= e && (i == me.TrackDel && s < e && h > e || i == me.TrackBefore && s < e || i == me.TrackAfter && h > e))
          return null;
        if (h > e || h == e && t < 0 && !l)
          return e == s || t < 0 ? r : r + a;
        r += a;
      }
      s = h;
    }
    if (e > s)
      throw new RangeError(`Position ${e} is out of range for changeset of length ${s}`);
    return r;
  }
  /**
  Check whether these changes touch a given range. When one of the
  changes entirely covers the range, the string `"cover"` is
  returned.
  */
  touchesRange(e, t = e) {
    for (let i = 0, s = 0; i < this.sections.length && s <= t; ) {
      let r = this.sections[i++], o = this.sections[i++], l = s + r;
      if (o >= 0 && s <= t && l >= e)
        return s < e && l > t ? "cover" : !0;
      s = l;
    }
    return !1;
  }
  /**
  @internal
  */
  toString() {
    let e = "";
    for (let t = 0; t < this.sections.length; ) {
      let i = this.sections[t++], s = this.sections[t++];
      e += (e ? " " : "") + i + (s >= 0 ? ":" + s : "");
    }
    return e;
  }
  /**
  Serialize this change desc to a JSON-representable value.
  */
  toJSON() {
    return this.sections;
  }
  /**
  Create a change desc from its JSON representation (as produced
  by [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeDesc.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e) || e.length % 2 || e.some((t) => typeof t != "number"))
      throw new RangeError("Invalid JSON representation of ChangeDesc");
    return new ht(e);
  }
  /**
  @internal
  */
  static create(e) {
    return new ht(e);
  }
}
class fe extends ht {
  constructor(e, t) {
    super(e), this.inserted = t;
  }
  /**
  Apply the changes to a document, returning the modified
  document.
  */
  apply(e) {
    if (this.length != e.length)
      throw new RangeError("Applying change set to a document with the wrong length");
    return Rr(this, (t, i, s, r, o) => e = e.replace(s, s + (i - t), o), !1), e;
  }
  mapDesc(e, t = !1) {
    return Ir(this, e, t, !0);
  }
  /**
  Given the document as it existed _before_ the changes, return a
  change set that represents the inverse of this set, which could
  be used to go from the document created by the changes back to
  the document as it existed before the changes.
  */
  invert(e) {
    let t = this.sections.slice(), i = [];
    for (let s = 0, r = 0; s < t.length; s += 2) {
      let o = t[s], l = t[s + 1];
      if (l >= 0) {
        t[s] = l, t[s + 1] = o;
        let a = s >> 1;
        for (; i.length < a; )
          i.push(J.empty);
        i.push(o ? e.slice(r, r + o) : J.empty);
      }
      r += o;
    }
    return new fe(t, i);
  }
  /**
  Combine two subsequent change sets into a single set. `other`
  must start in the document produced by `this`. If `this` goes
  `docA` → `docB` and `other` represents `docB` → `docC`, the
  returned value will represent the change `docA` → `docC`.
  */
  compose(e) {
    return this.empty ? e : e.empty ? this : uf(this, e, !0);
  }
  /**
  Given another change set starting in the same document, maps this
  change set over the other, producing a new change set that can be
  applied to the document produced by applying `other`. When
  `before` is `true`, order changes as if `this` comes before
  `other`, otherwise (the default) treat `other` as coming first.
  
  Given two changes `A` and `B`, `A.compose(B.map(A))` and
  `B.compose(A.map(B, true))` will produce the same document. This
  provides a basic form of [operational
  transformation](https://en.wikipedia.org/wiki/Operational_transformation),
  and can be used for collaborative editing.
  */
  map(e, t = !1) {
    return e.empty ? this : Ir(this, e, t, !0);
  }
  /**
  Iterate over the changed ranges in the document, calling `f` for
  each, with the range in the original document (`fromA`-`toA`)
  and the range that replaces it in the new document
  (`fromB`-`toB`).
  
  When `individual` is true, adjacent changes are reported
  separately.
  */
  iterChanges(e, t = !1) {
    Rr(this, e, t);
  }
  /**
  Get a [change description](https://codemirror.net/6/docs/ref/#state.ChangeDesc) for this change
  set.
  */
  get desc() {
    return ht.create(this.sections);
  }
  /**
  @internal
  */
  filter(e) {
    let t = [], i = [], s = [], r = new hn(this);
    e:
      for (let o = 0, l = 0; ; ) {
        let a = o == e.length ? 1e9 : e[o++];
        for (; l < a || l == a && r.len == 0; ) {
          if (r.done)
            break e;
          let f = Math.min(r.len, a - l);
          ge(s, f, -1);
          let c = r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0;
          ge(t, f, c), c > 0 && Dt(i, t, r.text), r.forward(f), l += f;
        }
        let h = e[o++];
        for (; l < h; ) {
          if (r.done)
            break e;
          let f = Math.min(r.len, h - l);
          ge(t, f, -1), ge(s, f, r.ins == -1 ? -1 : r.off == 0 ? r.ins : 0), r.forward(f), l += f;
        }
      }
    return {
      changes: new fe(t, i),
      filtered: ht.create(s)
    };
  }
  /**
  Serialize this change set to a JSON-representable value.
  */
  toJSON() {
    let e = [];
    for (let t = 0; t < this.sections.length; t += 2) {
      let i = this.sections[t], s = this.sections[t + 1];
      s < 0 ? e.push(i) : s == 0 ? e.push([i]) : e.push([i].concat(this.inserted[t >> 1].toJSON()));
    }
    return e;
  }
  /**
  Create a change set for the given changes, for a document of the
  given length, using `lineSep` as line separator.
  */
  static of(e, t, i) {
    let s = [], r = [], o = 0, l = null;
    function a(f = !1) {
      if (!f && !s.length)
        return;
      o < t && ge(s, t - o, -1);
      let c = new fe(s, r);
      l = l ? l.compose(c.map(l)) : c, s = [], r = [], o = 0;
    }
    function h(f) {
      if (Array.isArray(f))
        for (let c of f)
          h(c);
      else if (f instanceof fe) {
        if (f.length != t)
          throw new RangeError(`Mismatched change set length (got ${f.length}, expected ${t})`);
        a(), l = l ? l.compose(f.map(l)) : f;
      } else {
        let { from: c, to: u = c, insert: d } = f;
        if (c > u || c < 0 || u > t)
          throw new RangeError(`Invalid change range ${c} to ${u} (in doc of length ${t})`);
        let p = d ? typeof d == "string" ? J.of(d.split(i || Er)) : d : J.empty, m = p.length;
        if (c == u && m == 0)
          return;
        c < o && a(), c > o && ge(s, c - o, -1), ge(s, u - c, m), Dt(r, s, p), o = u;
      }
    }
    return h(e), a(!l), l;
  }
  /**
  Create an empty changeset of the given length.
  */
  static empty(e) {
    return new fe(e ? [e, -1] : [], []);
  }
  /**
  Create a changeset from its JSON representation (as produced by
  [`toJSON`](https://codemirror.net/6/docs/ref/#state.ChangeSet.toJSON).
  */
  static fromJSON(e) {
    if (!Array.isArray(e))
      throw new RangeError("Invalid JSON representation of ChangeSet");
    let t = [], i = [];
    for (let s = 0; s < e.length; s++) {
      let r = e[s];
      if (typeof r == "number")
        t.push(r, -1);
      else {
        if (!Array.isArray(r) || typeof r[0] != "number" || r.some((o, l) => l && typeof o != "string"))
          throw new RangeError("Invalid JSON representation of ChangeSet");
        if (r.length == 1)
          t.push(r[0], 0);
        else {
          for (; i.length < s; )
            i.push(J.empty);
          i[s] = J.of(r.slice(1)), t.push(r[0], i[s].length);
        }
      }
    }
    return new fe(t, i);
  }
  /**
  @internal
  */
  static createSet(e, t) {
    return new fe(e, t);
  }
}
function ge(n, e, t, i = !1) {
  if (e == 0 && t <= 0)
    return;
  let s = n.length - 2;
  s >= 0 && t <= 0 && t == n[s + 1] ? n[s] += e : e == 0 && n[s] == 0 ? n[s + 1] += t : i ? (n[s] += e, n[s + 1] += t) : n.push(e, t);
}
function Dt(n, e, t) {
  if (t.length == 0)
    return;
  let i = e.length - 2 >> 1;
  if (i < n.length)
    n[n.length - 1] = n[n.length - 1].append(t);
  else {
    for (; n.length < i; )
      n.push(J.empty);
    n.push(t);
  }
}
function Rr(n, e, t) {
  let i = n.inserted;
  for (let s = 0, r = 0, o = 0; o < n.sections.length; ) {
    let l = n.sections[o++], a = n.sections[o++];
    if (a < 0)
      s += l, r += l;
    else {
      let h = s, f = r, c = J.empty;
      for (; h += l, f += a, a && i && (c = c.append(i[o - 2 >> 1])), !(t || o == n.sections.length || n.sections[o + 1] < 0); )
        l = n.sections[o++], a = n.sections[o++];
      e(s, h, r, f, c), s = h, r = f;
    }
  }
}
function Ir(n, e, t, i = !1) {
  let s = [], r = i ? [] : null, o = new hn(n), l = new hn(e);
  for (let a = -1; ; )
    if (o.ins == -1 && l.ins == -1) {
      let h = Math.min(o.len, l.len);
      ge(s, h, -1), o.forward(h), l.forward(h);
    } else if (l.ins >= 0 && (o.ins < 0 || a == o.i || o.off == 0 && (l.len < o.len || l.len == o.len && !t))) {
      let h = l.len;
      for (ge(s, l.ins, -1); h; ) {
        let f = Math.min(o.len, h);
        o.ins >= 0 && a < o.i && o.len <= f && (ge(s, 0, o.ins), r && Dt(r, s, o.text), a = o.i), o.forward(f), h -= f;
      }
      l.next();
    } else if (o.ins >= 0) {
      let h = 0, f = o.len;
      for (; f; )
        if (l.ins == -1) {
          let c = Math.min(f, l.len);
          h += c, f -= c, l.forward(c);
        } else if (l.ins == 0 && l.len < f)
          f -= l.len, l.next();
        else
          break;
      ge(s, h, a < o.i ? o.ins : 0), r && a < o.i && Dt(r, s, o.text), a = o.i, o.forward(o.len - f);
    } else {
      if (o.done && l.done)
        return r ? fe.createSet(s, r) : ht.create(s);
      throw new Error("Mismatched change set lengths");
    }
}
function uf(n, e, t = !1) {
  let i = [], s = t ? [] : null, r = new hn(n), o = new hn(e);
  for (let l = !1; ; ) {
    if (r.done && o.done)
      return s ? fe.createSet(i, s) : ht.create(i);
    if (r.ins == 0)
      ge(i, r.len, 0, l), r.next();
    else if (o.len == 0 && !o.done)
      ge(i, 0, o.ins, l), s && Dt(s, i, o.text), o.next();
    else {
      if (r.done || o.done)
        throw new Error("Mismatched change set lengths");
      {
        let a = Math.min(r.len2, o.len), h = i.length;
        if (r.ins == -1) {
          let f = o.ins == -1 ? -1 : o.off ? 0 : o.ins;
          ge(i, a, f, l), s && f && Dt(s, i, o.text);
        } else
          o.ins == -1 ? (ge(i, r.off ? 0 : r.len, a, l), s && Dt(s, i, r.textBit(a))) : (ge(i, r.off ? 0 : r.len, o.off ? 0 : o.ins, l), s && !o.off && Dt(s, i, o.text));
        l = (r.ins > a || o.ins >= 0 && o.len > a) && (l || i.length > h), r.forward2(a), o.forward(a);
      }
    }
  }
}
class hn {
  constructor(e) {
    this.set = e, this.i = 0, this.next();
  }
  next() {
    let { sections: e } = this.set;
    this.i < e.length ? (this.len = e[this.i++], this.ins = e[this.i++]) : (this.len = 0, this.ins = -2), this.off = 0;
  }
  get done() {
    return this.ins == -2;
  }
  get len2() {
    return this.ins < 0 ? this.len : this.ins;
  }
  get text() {
    let { inserted: e } = this.set, t = this.i - 2 >> 1;
    return t >= e.length ? J.empty : e[t];
  }
  textBit(e) {
    let { inserted: t } = this.set, i = this.i - 2 >> 1;
    return i >= t.length && !e ? J.empty : t[i].slice(this.off, e == null ? void 0 : this.off + e);
  }
  forward(e) {
    e == this.len ? this.next() : (this.len -= e, this.off += e);
  }
  forward2(e) {
    this.ins == -1 ? this.forward(e) : e == this.ins ? this.next() : (this.ins -= e, this.off += e);
  }
}
class Ut {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.flags = i;
  }
  /**
  The anchor of the range—the side that doesn't move when you
  extend it.
  */
  get anchor() {
    return this.flags & 32 ? this.to : this.from;
  }
  /**
  The head of the range, which is moved when the range is
  [extended](https://codemirror.net/6/docs/ref/#state.SelectionRange.extend).
  */
  get head() {
    return this.flags & 32 ? this.from : this.to;
  }
  /**
  True when `anchor` and `head` are at the same position.
  */
  get empty() {
    return this.from == this.to;
  }
  /**
  If this is a cursor that is explicitly associated with the
  character on one of its sides, this returns the side. -1 means
  the character before its position, 1 the character after, and 0
  means no association.
  */
  get assoc() {
    return this.flags & 8 ? -1 : this.flags & 16 ? 1 : 0;
  }
  /**
  The bidirectional text level associated with this cursor, if
  any.
  */
  get bidiLevel() {
    let e = this.flags & 7;
    return e == 7 ? null : e;
  }
  /**
  The goal column (stored vertical offset) associated with a
  cursor. This is used to preserve the vertical position when
  [moving](https://codemirror.net/6/docs/ref/#view.EditorView.moveVertically) across
  lines of different length.
  */
  get goalColumn() {
    let e = this.flags >> 6;
    return e == 16777215 ? void 0 : e;
  }
  /**
  Map this range through a change, producing a valid range in the
  updated document.
  */
  map(e, t = -1) {
    let i, s;
    return this.empty ? i = s = e.mapPos(this.from, t) : (i = e.mapPos(this.from, 1), s = e.mapPos(this.to, -1)), i == this.from && s == this.to ? this : new Ut(i, s, this.flags);
  }
  /**
  Extend this range to cover at least `from` to `to`.
  */
  extend(e, t = e) {
    if (e <= this.anchor && t >= this.anchor)
      return C.range(e, t);
    let i = Math.abs(e - this.anchor) > Math.abs(t - this.anchor) ? e : t;
    return C.range(this.anchor, i);
  }
  /**
  Compare this range to another range.
  */
  eq(e, t = !1) {
    return this.anchor == e.anchor && this.head == e.head && (!t || !this.empty || this.assoc == e.assoc);
  }
  /**
  Return a JSON-serializable object representing the range.
  */
  toJSON() {
    return { anchor: this.anchor, head: this.head };
  }
  /**
  Convert a JSON representation of a range to a `SelectionRange`
  instance.
  */
  static fromJSON(e) {
    if (!e || typeof e.anchor != "number" || typeof e.head != "number")
      throw new RangeError("Invalid JSON representation for SelectionRange");
    return C.range(e.anchor, e.head);
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Ut(e, t, i);
  }
}
class C {
  constructor(e, t) {
    this.ranges = e, this.mainIndex = t;
  }
  /**
  Map a selection through a change. Used to adjust the selection
  position for changes.
  */
  map(e, t = -1) {
    return e.empty ? this : C.create(this.ranges.map((i) => i.map(e, t)), this.mainIndex);
  }
  /**
  Compare this selection to another selection. By default, ranges
  are compared only by position. When `includeAssoc` is true,
  cursor ranges must also have the same
  [`assoc`](https://codemirror.net/6/docs/ref/#state.SelectionRange.assoc) value.
  */
  eq(e, t = !1) {
    if (this.ranges.length != e.ranges.length || this.mainIndex != e.mainIndex)
      return !1;
    for (let i = 0; i < this.ranges.length; i++)
      if (!this.ranges[i].eq(e.ranges[i], t))
        return !1;
    return !0;
  }
  /**
  Get the primary selection range. Usually, you should make sure
  your code applies to _all_ ranges, by using methods like
  [`changeByRange`](https://codemirror.net/6/docs/ref/#state.EditorState.changeByRange).
  */
  get main() {
    return this.ranges[this.mainIndex];
  }
  /**
  Make sure the selection only has one range. Returns a selection
  holding only the main range from this selection.
  */
  asSingle() {
    return this.ranges.length == 1 ? this : new C([this.main], 0);
  }
  /**
  Extend this selection with an extra range.
  */
  addRange(e, t = !0) {
    return C.create([e].concat(this.ranges), t ? 0 : this.mainIndex + 1);
  }
  /**
  Replace a given range with another range, and then normalize the
  selection to merge and sort ranges if necessary.
  */
  replaceRange(e, t = this.mainIndex) {
    let i = this.ranges.slice();
    return i[t] = e, C.create(i, this.mainIndex);
  }
  /**
  Convert this selection to an object that can be serialized to
  JSON.
  */
  toJSON() {
    return { ranges: this.ranges.map((e) => e.toJSON()), main: this.mainIndex };
  }
  /**
  Create a selection from a JSON representation.
  */
  static fromJSON(e) {
    if (!e || !Array.isArray(e.ranges) || typeof e.main != "number" || e.main >= e.ranges.length)
      throw new RangeError("Invalid JSON representation for EditorSelection");
    return new C(e.ranges.map((t) => Ut.fromJSON(t)), e.main);
  }
  /**
  Create a selection holding a single range.
  */
  static single(e, t = e) {
    return new C([C.range(e, t)], 0);
  }
  /**
  Sort and merge the given set of ranges, creating a valid
  selection.
  */
  static create(e, t = 0) {
    if (e.length == 0)
      throw new RangeError("A selection needs at least one range");
    for (let i = 0, s = 0; s < e.length; s++) {
      let r = e[s];
      if (r.empty ? r.from <= i : r.from < i)
        return C.normalized(e.slice(), t);
      i = r.to;
    }
    return new C(e, t);
  }
  /**
  Create a cursor selection range at the given position. You can
  safely ignore the optional arguments in most situations.
  */
  static cursor(e, t = 0, i, s) {
    return Ut.create(e, e, (t == 0 ? 0 : t < 0 ? 8 : 16) | (i == null ? 7 : Math.min(6, i)) | (s ?? 16777215) << 6);
  }
  /**
  Create a selection range.
  */
  static range(e, t, i, s) {
    let r = (i ?? 16777215) << 6 | (s == null ? 7 : Math.min(6, s));
    return t < e ? Ut.create(t, e, 48 | r) : Ut.create(e, t, (t > e ? 8 : 0) | r);
  }
  /**
  @internal
  */
  static normalized(e, t = 0) {
    let i = e[t];
    e.sort((s, r) => s.from - r.from), t = e.indexOf(i);
    for (let s = 1; s < e.length; s++) {
      let r = e[s], o = e[s - 1];
      if (r.empty ? r.from <= o.to : r.from < o.to) {
        let l = o.from, a = Math.max(r.to, o.to);
        s <= t && t--, e.splice(--s, 2, r.anchor > r.head ? C.range(a, l) : C.range(l, a));
      }
    }
    return new C(e, t);
  }
}
function df(n, e) {
  for (let t of n.ranges)
    if (t.to > e)
      throw new RangeError("Selection points outside of document");
}
let Eo = 0;
class O {
  constructor(e, t, i, s, r) {
    this.combine = e, this.compareInput = t, this.compare = i, this.isStatic = s, this.id = Eo++, this.default = e([]), this.extensions = typeof r == "function" ? r(this) : r;
  }
  /**
  Returns a facet reader for this facet, which can be used to
  [read](https://codemirror.net/6/docs/ref/#state.EditorState.facet) it but not to define values for it.
  */
  get reader() {
    return this;
  }
  /**
  Define a new facet.
  */
  static define(e = {}) {
    return new O(e.combine || ((t) => t), e.compareInput || ((t, i) => t === i), e.compare || (e.combine ? (t, i) => t === i : Ro), !!e.static, e.enables);
  }
  /**
  Returns an extension that adds the given value to this facet.
  */
  of(e) {
    return new is([], this, 0, e);
  }
  /**
  Create an extension that computes a value for the facet from a
  state. You must take care to declare the parts of the state that
  this value depends on, since your function is only called again
  for a new state when one of those parts changed.
  
  In cases where your value depends only on a single field, you'll
  want to use the [`from`](https://codemirror.net/6/docs/ref/#state.Facet.from) method instead.
  */
  compute(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new is(e, this, 1, t);
  }
  /**
  Create an extension that computes zero or more values for this
  facet from a state.
  */
  computeN(e, t) {
    if (this.isStatic)
      throw new Error("Can't compute a static facet");
    return new is(e, this, 2, t);
  }
  from(e, t) {
    return t || (t = (i) => i), this.compute([e], (i) => t(i.field(e)));
  }
}
function Ro(n, e) {
  return n == e || n.length == e.length && n.every((t, i) => t === e[i]);
}
class is {
  constructor(e, t, i, s) {
    this.dependencies = e, this.facet = t, this.type = i, this.value = s, this.id = Eo++;
  }
  dynamicSlot(e) {
    var t;
    let i = this.value, s = this.facet.compareInput, r = this.id, o = e[r] >> 1, l = this.type == 2, a = !1, h = !1, f = [];
    for (let c of this.dependencies)
      c == "doc" ? a = !0 : c == "selection" ? h = !0 : ((t = e[c.id]) !== null && t !== void 0 ? t : 1) & 1 || f.push(e[c.id]);
    return {
      create(c) {
        return c.values[o] = i(c), 1;
      },
      update(c, u) {
        if (a && u.docChanged || h && (u.docChanged || u.selection) || Nr(c, f)) {
          let d = i(c);
          if (l ? !xl(d, c.values[o], s) : !s(d, c.values[o]))
            return c.values[o] = d, 1;
        }
        return 0;
      },
      reconfigure: (c, u) => {
        let d, p = u.config.address[r];
        if (p != null) {
          let m = ms(u, p);
          if (this.dependencies.every((g) => g instanceof O ? u.facet(g) === c.facet(g) : g instanceof Me ? u.field(g, !1) == c.field(g, !1) : !0) || (l ? xl(d = i(c), m, s) : s(d = i(c), m)))
            return c.values[o] = m, 0;
        } else
          d = i(c);
        return c.values[o] = d, 1;
      }
    };
  }
}
function xl(n, e, t) {
  if (n.length != e.length)
    return !1;
  for (let i = 0; i < n.length; i++)
    if (!t(n[i], e[i]))
      return !1;
  return !0;
}
function Nr(n, e) {
  let t = !1;
  for (let i of e)
    tn(n, i) & 1 && (t = !0);
  return t;
}
function xd(n, e, t) {
  let i = t.map((a) => n[a.id]), s = t.map((a) => a.type), r = i.filter((a) => !(a & 1)), o = n[e.id] >> 1;
  function l(a) {
    let h = [];
    for (let f = 0; f < i.length; f++) {
      let c = ms(a, i[f]);
      if (s[f] == 2)
        for (let u of c)
          h.push(u);
      else
        h.push(c);
    }
    return e.combine(h);
  }
  return {
    create(a) {
      for (let h of i)
        tn(a, h);
      return a.values[o] = l(a), 1;
    },
    update(a, h) {
      if (!Nr(a, r))
        return 0;
      let f = l(a);
      return e.compare(f, a.values[o]) ? 0 : (a.values[o] = f, 1);
    },
    reconfigure(a, h) {
      let f = Nr(a, i), c = h.config.facets[e.id], u = h.facet(e);
      if (c && !f && Ro(t, c))
        return a.values[o] = u, 0;
      let d = l(a);
      return e.compare(d, u) ? (a.values[o] = u, 0) : (a.values[o] = d, 1);
    }
  };
}
const Sl = /* @__PURE__ */ O.define({ static: !0 });
class Me {
  constructor(e, t, i, s, r) {
    this.id = e, this.createF = t, this.updateF = i, this.compareF = s, this.spec = r, this.provides = void 0;
  }
  /**
  Define a state field.
  */
  static define(e) {
    let t = new Me(Eo++, e.create, e.update, e.compare || ((i, s) => i === s), e);
    return e.provide && (t.provides = e.provide(t)), t;
  }
  create(e) {
    let t = e.facet(Sl).find((i) => i.field == this);
    return ((t == null ? void 0 : t.create) || this.createF)(e);
  }
  /**
  @internal
  */
  slot(e) {
    let t = e[this.id] >> 1;
    return {
      create: (i) => (i.values[t] = this.create(i), 1),
      update: (i, s) => {
        let r = i.values[t], o = this.updateF(r, s);
        return this.compareF(r, o) ? 0 : (i.values[t] = o, 1);
      },
      reconfigure: (i, s) => s.config.address[this.id] != null ? (i.values[t] = s.field(this), 0) : (i.values[t] = this.create(i), 1)
    };
  }
  /**
  Returns an extension that enables this field and overrides the
  way it is initialized. Can be useful when you need to provide a
  non-default starting value for the field.
  */
  init(e) {
    return [this, Sl.of({ field: this, create: e })];
  }
  /**
  State field instances can be used as
  [`Extension`](https://codemirror.net/6/docs/ref/#state.Extension) values to enable the field in a
  given state.
  */
  get extension() {
    return this;
  }
}
const jt = { lowest: 4, low: 3, default: 2, high: 1, highest: 0 };
function Vi(n) {
  return (e) => new pf(e, n);
}
const vn = {
  /**
  The highest precedence level, for extensions that should end up
  near the start of the precedence ordering.
  */
  highest: /* @__PURE__ */ Vi(jt.highest),
  /**
  A higher-than-default precedence, for extensions that should
  come before those with default precedence.
  */
  high: /* @__PURE__ */ Vi(jt.high),
  /**
  The default precedence, which is also used for extensions
  without an explicit precedence.
  */
  default: /* @__PURE__ */ Vi(jt.default),
  /**
  A lower-than-default precedence.
  */
  low: /* @__PURE__ */ Vi(jt.low),
  /**
  The lowest precedence level. Meant for things that should end up
  near the end of the extension order.
  */
  lowest: /* @__PURE__ */ Vi(jt.lowest)
};
class pf {
  constructor(e, t) {
    this.inner = e, this.prec = t;
  }
}
class Ls {
  /**
  Create an instance of this compartment to add to your [state
  configuration](https://codemirror.net/6/docs/ref/#state.EditorStateConfig.extensions).
  */
  of(e) {
    return new Fr(this, e);
  }
  /**
  Create an [effect](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) that
  reconfigures this compartment.
  */
  reconfigure(e) {
    return Ls.reconfigure.of({ compartment: this, extension: e });
  }
  /**
  Get the current content of the compartment in the state, or
  `undefined` if it isn't present.
  */
  get(e) {
    return e.config.compartments.get(this);
  }
}
class Fr {
  constructor(e, t) {
    this.compartment = e, this.inner = t;
  }
}
class ps {
  constructor(e, t, i, s, r, o) {
    for (this.base = e, this.compartments = t, this.dynamicSlots = i, this.address = s, this.staticValues = r, this.facets = o, this.statusTemplate = []; this.statusTemplate.length < i.length; )
      this.statusTemplate.push(
        0
        /* SlotStatus.Unresolved */
      );
  }
  staticFacet(e) {
    let t = this.address[e.id];
    return t == null ? e.default : this.staticValues[t >> 1];
  }
  static resolve(e, t, i) {
    let s = [], r = /* @__PURE__ */ Object.create(null), o = /* @__PURE__ */ new Map();
    for (let u of Sd(e, t, o))
      u instanceof Me ? s.push(u) : (r[u.facet.id] || (r[u.facet.id] = [])).push(u);
    let l = /* @__PURE__ */ Object.create(null), a = [], h = [];
    for (let u of s)
      l[u.id] = h.length << 1, h.push((d) => u.slot(d));
    let f = i == null ? void 0 : i.config.facets;
    for (let u in r) {
      let d = r[u], p = d[0].facet, m = f && f[u] || [];
      if (d.every(
        (g) => g.type == 0
        /* Provider.Static */
      ))
        if (l[p.id] = a.length << 1 | 1, Ro(m, d))
          a.push(i.facet(p));
        else {
          let g = p.combine(d.map((y) => y.value));
          a.push(i && p.compare(g, i.facet(p)) ? i.facet(p) : g);
        }
      else {
        for (let g of d)
          g.type == 0 ? (l[g.id] = a.length << 1 | 1, a.push(g.value)) : (l[g.id] = h.length << 1, h.push((y) => g.dynamicSlot(y)));
        l[p.id] = h.length << 1, h.push((g) => xd(g, p, d));
      }
    }
    let c = h.map((u) => u(l));
    return new ps(e, o, c, l, a, r);
  }
}
function Sd(n, e, t) {
  let i = [[], [], [], [], []], s = /* @__PURE__ */ new Map();
  function r(o, l) {
    let a = s.get(o);
    if (a != null) {
      if (a <= l)
        return;
      let h = i[a].indexOf(o);
      h > -1 && i[a].splice(h, 1), o instanceof Fr && t.delete(o.compartment);
    }
    if (s.set(o, l), Array.isArray(o))
      for (let h of o)
        r(h, l);
    else if (o instanceof Fr) {
      if (t.has(o.compartment))
        throw new RangeError("Duplicate use of compartment in extensions");
      let h = e.get(o.compartment) || o.inner;
      t.set(o.compartment, h), r(h, l);
    } else if (o instanceof pf)
      r(o.inner, o.prec);
    else if (o instanceof Me)
      i[l].push(o), o.provides && r(o.provides, l);
    else if (o instanceof is)
      i[l].push(o), o.facet.extensions && r(o.facet.extensions, jt.default);
    else {
      let h = o.extension;
      if (!h)
        throw new Error(`Unrecognized extension value in extension set (${o}). This sometimes happens because multiple instances of @codemirror/state are loaded, breaking instanceof checks.`);
      r(h, l);
    }
  }
  return r(n, jt.default), i.reduce((o, l) => o.concat(l));
}
function tn(n, e) {
  if (e & 1)
    return 2;
  let t = e >> 1, i = n.status[t];
  if (i == 4)
    throw new Error("Cyclic dependency between fields and/or facets");
  if (i & 2)
    return i;
  n.status[t] = 4;
  let s = n.computeSlot(n, n.config.dynamicSlots[t]);
  return n.status[t] = 2 | s;
}
function ms(n, e) {
  return e & 1 ? n.config.staticValues[e >> 1] : n.values[e >> 1];
}
const mf = /* @__PURE__ */ O.define(), Hr = /* @__PURE__ */ O.define({
  combine: (n) => n.some((e) => e),
  static: !0
}), gf = /* @__PURE__ */ O.define({
  combine: (n) => n.length ? n[0] : void 0,
  static: !0
}), bf = /* @__PURE__ */ O.define(), yf = /* @__PURE__ */ O.define(), wf = /* @__PURE__ */ O.define(), kf = /* @__PURE__ */ O.define({
  combine: (n) => n.length ? n[0] : !1
});
class vt {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Define a new type of annotation.
  */
  static define() {
    return new _d();
  }
}
class _d {
  /**
  Create an instance of this annotation.
  */
  of(e) {
    return new vt(this, e);
  }
}
class Cd {
  /**
  @internal
  */
  constructor(e) {
    this.map = e;
  }
  /**
  Create a [state effect](https://codemirror.net/6/docs/ref/#state.StateEffect) instance of this
  type.
  */
  of(e) {
    return new z(this, e);
  }
}
class z {
  /**
  @internal
  */
  constructor(e, t) {
    this.type = e, this.value = t;
  }
  /**
  Map this effect through a position mapping. Will return
  `undefined` when that ends up deleting the effect.
  */
  map(e) {
    let t = this.type.map(this.value, e);
    return t === void 0 ? void 0 : t == this.value ? this : new z(this.type, t);
  }
  /**
  Tells you whether this effect object is of a given
  [type](https://codemirror.net/6/docs/ref/#state.StateEffectType).
  */
  is(e) {
    return this.type == e;
  }
  /**
  Define a new effect type. The type parameter indicates the type
  of values that his effect holds. It should be a type that
  doesn't include `undefined`, since that is used in
  [mapping](https://codemirror.net/6/docs/ref/#state.StateEffect.map) to indicate that an effect is
  removed.
  */
  static define(e = {}) {
    return new Cd(e.map || ((t) => t));
  }
  /**
  Map an array of effects through a change set.
  */
  static mapEffects(e, t) {
    if (!e.length)
      return e;
    let i = [];
    for (let s of e) {
      let r = s.map(t);
      r && i.push(r);
    }
    return i;
  }
}
z.reconfigure = /* @__PURE__ */ z.define();
z.appendConfig = /* @__PURE__ */ z.define();
class le {
  constructor(e, t, i, s, r, o) {
    this.startState = e, this.changes = t, this.selection = i, this.effects = s, this.annotations = r, this.scrollIntoView = o, this._doc = null, this._state = null, i && df(i, t.newLength), r.some((l) => l.type == le.time) || (this.annotations = r.concat(le.time.of(Date.now())));
  }
  /**
  @internal
  */
  static create(e, t, i, s, r, o) {
    return new le(e, t, i, s, r, o);
  }
  /**
  The new document produced by the transaction. Contrary to
  [`.state`](https://codemirror.net/6/docs/ref/#state.Transaction.state)`.doc`, accessing this won't
  force the entire new state to be computed right away, so it is
  recommended that [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) use this getter
  when they need to look at the new document.
  */
  get newDoc() {
    return this._doc || (this._doc = this.changes.apply(this.startState.doc));
  }
  /**
  The new selection produced by the transaction. If
  [`this.selection`](https://codemirror.net/6/docs/ref/#state.Transaction.selection) is undefined,
  this will [map](https://codemirror.net/6/docs/ref/#state.EditorSelection.map) the start state's
  current selection through the changes made by the transaction.
  */
  get newSelection() {
    return this.selection || this.startState.selection.map(this.changes);
  }
  /**
  The new state created by the transaction. Computed on demand
  (but retained for subsequent access), so it is recommended not to
  access it in [transaction
  filters](https://codemirror.net/6/docs/ref/#state.EditorState^transactionFilter) when possible.
  */
  get state() {
    return this._state || this.startState.applyTransaction(this), this._state;
  }
  /**
  Get the value of the given annotation type, if any.
  */
  annotation(e) {
    for (let t of this.annotations)
      if (t.type == e)
        return t.value;
  }
  /**
  Indicates whether the transaction changed the document.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Indicates whether this transaction reconfigures the state
  (through a [configuration compartment](https://codemirror.net/6/docs/ref/#state.Compartment) or
  with a top-level configuration
  [effect](https://codemirror.net/6/docs/ref/#state.StateEffect^reconfigure).
  */
  get reconfigured() {
    return this.startState.config != this.state.config;
  }
  /**
  Returns true if the transaction has a [user
  event](https://codemirror.net/6/docs/ref/#state.Transaction^userEvent) annotation that is equal to
  or more specific than `event`. For example, if the transaction
  has `"select.pointer"` as user event, `"select"` and
  `"select.pointer"` will match it.
  */
  isUserEvent(e) {
    let t = this.annotation(le.userEvent);
    return !!(t && (t == e || t.length > e.length && t.slice(0, e.length) == e && t[e.length] == "."));
  }
}
le.time = /* @__PURE__ */ vt.define();
le.userEvent = /* @__PURE__ */ vt.define();
le.addToHistory = /* @__PURE__ */ vt.define();
le.remote = /* @__PURE__ */ vt.define();
function Ad(n, e) {
  let t = [];
  for (let i = 0, s = 0; ; ) {
    let r, o;
    if (i < n.length && (s == e.length || e[s] >= n[i]))
      r = n[i++], o = n[i++];
    else if (s < e.length)
      r = e[s++], o = e[s++];
    else
      return t;
    !t.length || t[t.length - 1] < r ? t.push(r, o) : t[t.length - 1] < o && (t[t.length - 1] = o);
  }
}
function vf(n, e, t) {
  var i;
  let s, r, o;
  return t ? (s = e.changes, r = fe.empty(e.changes.length), o = n.changes.compose(e.changes)) : (s = e.changes.map(n.changes), r = n.changes.mapDesc(e.changes, !0), o = n.changes.compose(s)), {
    changes: o,
    selection: e.selection ? e.selection.map(r) : (i = n.selection) === null || i === void 0 ? void 0 : i.map(s),
    effects: z.mapEffects(n.effects, s).concat(z.mapEffects(e.effects, r)),
    annotations: n.annotations.length ? n.annotations.concat(e.annotations) : e.annotations,
    scrollIntoView: n.scrollIntoView || e.scrollIntoView
  };
}
function Vr(n, e, t) {
  let i = e.selection, s = vi(e.annotations);
  return e.userEvent && (s = s.concat(le.userEvent.of(e.userEvent))), {
    changes: e.changes instanceof fe ? e.changes : fe.of(e.changes || [], t, n.facet(gf)),
    selection: i && (i instanceof C ? i : C.single(i.anchor, i.head)),
    effects: vi(e.effects),
    annotations: s,
    scrollIntoView: !!e.scrollIntoView
  };
}
function xf(n, e, t) {
  let i = Vr(n, e.length ? e[0] : {}, n.doc.length);
  e.length && e[0].filter === !1 && (t = !1);
  for (let r = 1; r < e.length; r++) {
    e[r].filter === !1 && (t = !1);
    let o = !!e[r].sequential;
    i = vf(i, Vr(n, e[r], o ? i.changes.newLength : n.doc.length), o);
  }
  let s = le.create(n, i.changes, i.selection, i.effects, i.annotations, i.scrollIntoView);
  return Td(t ? Md(s) : s);
}
function Md(n) {
  let e = n.startState, t = !0;
  for (let s of e.facet(bf)) {
    let r = s(n);
    if (r === !1) {
      t = !1;
      break;
    }
    Array.isArray(r) && (t = t === !0 ? r : Ad(t, r));
  }
  if (t !== !0) {
    let s, r;
    if (t === !1)
      r = n.changes.invertedDesc, s = fe.empty(e.doc.length);
    else {
      let o = n.changes.filter(t);
      s = o.changes, r = o.filtered.mapDesc(o.changes).invertedDesc;
    }
    n = le.create(e, s, n.selection && n.selection.map(r), z.mapEffects(n.effects, r), n.annotations, n.scrollIntoView);
  }
  let i = e.facet(yf);
  for (let s = i.length - 1; s >= 0; s--) {
    let r = i[s](n);
    r instanceof le ? n = r : Array.isArray(r) && r.length == 1 && r[0] instanceof le ? n = r[0] : n = xf(e, vi(r), !1);
  }
  return n;
}
function Td(n) {
  let e = n.startState, t = e.facet(wf), i = n;
  for (let s = t.length - 1; s >= 0; s--) {
    let r = t[s](n);
    r && Object.keys(r).length && (i = vf(i, Vr(e, r, n.changes.newLength), !0));
  }
  return i == n ? n : le.create(e, n.changes, n.selection, i.effects, i.annotations, i.scrollIntoView);
}
const Dd = [];
function vi(n) {
  return n == null ? Dd : Array.isArray(n) ? n : [n];
}
var Ee = /* @__PURE__ */ function(n) {
  return n[n.Word = 0] = "Word", n[n.Space = 1] = "Space", n[n.Other = 2] = "Other", n;
}(Ee || (Ee = {}));
const Od = /[\u00df\u0587\u0590-\u05f4\u0600-\u06ff\u3040-\u309f\u30a0-\u30ff\u3400-\u4db5\u4e00-\u9fcc\uac00-\ud7af]/;
let Wr;
try {
  Wr = /* @__PURE__ */ new RegExp("[\\p{Alphabetic}\\p{Number}_]", "u");
} catch {
}
function Bd(n) {
  if (Wr)
    return Wr.test(n);
  for (let e = 0; e < n.length; e++) {
    let t = n[e];
    if (/\w/.test(t) || t > "" && (t.toUpperCase() != t.toLowerCase() || Od.test(t)))
      return !0;
  }
  return !1;
}
function Pd(n) {
  return (e) => {
    if (!/\S/.test(e))
      return Ee.Space;
    if (Bd(e))
      return Ee.Word;
    for (let t = 0; t < n.length; t++)
      if (e.indexOf(n[t]) > -1)
        return Ee.Word;
    return Ee.Other;
  };
}
class G {
  constructor(e, t, i, s, r, o) {
    this.config = e, this.doc = t, this.selection = i, this.values = s, this.status = e.statusTemplate.slice(), this.computeSlot = r, o && (o._state = this);
    for (let l = 0; l < this.config.dynamicSlots.length; l++)
      tn(this, l << 1);
    this.computeSlot = null;
  }
  field(e, t = !0) {
    let i = this.config.address[e.id];
    if (i == null) {
      if (t)
        throw new RangeError("Field is not present in this state");
      return;
    }
    return tn(this, i), ms(this, i);
  }
  /**
  Create a [transaction](https://codemirror.net/6/docs/ref/#state.Transaction) that updates this
  state. Any number of [transaction specs](https://codemirror.net/6/docs/ref/#state.TransactionSpec)
  can be passed. Unless
  [`sequential`](https://codemirror.net/6/docs/ref/#state.TransactionSpec.sequential) is set, the
  [changes](https://codemirror.net/6/docs/ref/#state.TransactionSpec.changes) (if any) of each spec
  are assumed to start in the _current_ document (not the document
  produced by previous specs), and its
  [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection) and
  [effects](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) are assumed to refer
  to the document created by its _own_ changes. The resulting
  transaction contains the combined effect of all the different
  specs. For [selection](https://codemirror.net/6/docs/ref/#state.TransactionSpec.selection), later
  specs take precedence over earlier ones.
  */
  update(...e) {
    return xf(this, e, !0);
  }
  /**
  @internal
  */
  applyTransaction(e) {
    let t = this.config, { base: i, compartments: s } = t;
    for (let l of e.effects)
      l.is(Ls.reconfigure) ? (t && (s = /* @__PURE__ */ new Map(), t.compartments.forEach((a, h) => s.set(h, a)), t = null), s.set(l.value.compartment, l.value.extension)) : l.is(z.reconfigure) ? (t = null, i = l.value) : l.is(z.appendConfig) && (t = null, i = vi(i).concat(l.value));
    let r;
    t ? r = e.startState.values.slice() : (t = ps.resolve(i, s, this), r = new G(t, this.doc, this.selection, t.dynamicSlots.map(() => null), (a, h) => h.reconfigure(a, this), null).values);
    let o = e.startState.facet(Hr) ? e.newSelection : e.newSelection.asSingle();
    new G(t, e.newDoc, o, r, (l, a) => a.update(l, e), e);
  }
  /**
  Create a [transaction spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec) that
  replaces every selection range with the given content.
  */
  replaceSelection(e) {
    return typeof e == "string" && (e = this.toText(e)), this.changeByRange((t) => ({
      changes: { from: t.from, to: t.to, insert: e },
      range: C.cursor(t.from + e.length)
    }));
  }
  /**
  Create a set of changes and a new selection by running the given
  function for each range in the active selection. The function
  can return an optional set of changes (in the coordinate space
  of the start document), plus an updated range (in the coordinate
  space of the document produced by the call's own changes). This
  method will merge all the changes and ranges into a single
  changeset and selection, and return it as a [transaction
  spec](https://codemirror.net/6/docs/ref/#state.TransactionSpec), which can be passed to
  [`update`](https://codemirror.net/6/docs/ref/#state.EditorState.update).
  */
  changeByRange(e) {
    let t = this.selection, i = e(t.ranges[0]), s = this.changes(i.changes), r = [i.range], o = vi(i.effects);
    for (let l = 1; l < t.ranges.length; l++) {
      let a = e(t.ranges[l]), h = this.changes(a.changes), f = h.map(s);
      for (let u = 0; u < l; u++)
        r[u] = r[u].map(f);
      let c = s.mapDesc(h, !0);
      r.push(a.range.map(c)), s = s.compose(f), o = z.mapEffects(o, f).concat(z.mapEffects(vi(a.effects), c));
    }
    return {
      changes: s,
      selection: C.create(r, t.mainIndex),
      effects: o
    };
  }
  /**
  Create a [change set](https://codemirror.net/6/docs/ref/#state.ChangeSet) from the given change
  description, taking the state's document length and line
  separator into account.
  */
  changes(e = []) {
    return e instanceof fe ? e : fe.of(e, this.doc.length, this.facet(G.lineSeparator));
  }
  /**
  Using the state's [line
  separator](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator), create a
  [`Text`](https://codemirror.net/6/docs/ref/#state.Text) instance from the given string.
  */
  toText(e) {
    return J.of(e.split(this.facet(G.lineSeparator) || Er));
  }
  /**
  Return the given range of the document as a string.
  */
  sliceDoc(e = 0, t = this.doc.length) {
    return this.doc.sliceString(e, t, this.lineBreak);
  }
  /**
  Get the value of a state [facet](https://codemirror.net/6/docs/ref/#state.Facet).
  */
  facet(e) {
    let t = this.config.address[e.id];
    return t == null ? e.default : (tn(this, t), ms(this, t));
  }
  /**
  Convert this state to a JSON-serializable object. When custom
  fields should be serialized, you can pass them in as an object
  mapping property names (in the resulting object, which should
  not use `doc` or `selection`) to fields.
  */
  toJSON(e) {
    let t = {
      doc: this.sliceDoc(),
      selection: this.selection.toJSON()
    };
    if (e)
      for (let i in e) {
        let s = e[i];
        s instanceof Me && this.config.address[s.id] != null && (t[i] = s.spec.toJSON(this.field(e[i]), this));
      }
    return t;
  }
  /**
  Deserialize a state from its JSON representation. When custom
  fields should be deserialized, pass the same object you passed
  to [`toJSON`](https://codemirror.net/6/docs/ref/#state.EditorState.toJSON) when serializing as
  third argument.
  */
  static fromJSON(e, t = {}, i) {
    if (!e || typeof e.doc != "string")
      throw new RangeError("Invalid JSON representation for EditorState");
    let s = [];
    if (i) {
      for (let r in i)
        if (Object.prototype.hasOwnProperty.call(e, r)) {
          let o = i[r], l = e[r];
          s.push(o.init((a) => o.spec.fromJSON(l, a)));
        }
    }
    return G.create({
      doc: e.doc,
      selection: C.fromJSON(e.selection),
      extensions: t.extensions ? s.concat([t.extensions]) : s
    });
  }
  /**
  Create a new state. You'll usually only need this when
  initializing an editor—updated states are created by applying
  transactions.
  */
  static create(e = {}) {
    let t = ps.resolve(e.extensions || [], /* @__PURE__ */ new Map()), i = e.doc instanceof J ? e.doc : J.of((e.doc || "").split(t.staticFacet(G.lineSeparator) || Er)), s = e.selection ? e.selection instanceof C ? e.selection : C.single(e.selection.anchor, e.selection.head) : C.single(0);
    return df(s, i.length), t.staticFacet(Hr) || (s = s.asSingle()), new G(t, i, s, t.dynamicSlots.map(() => null), (r, o) => o.create(r), null);
  }
  /**
  The size (in columns) of a tab in the document, determined by
  the [`tabSize`](https://codemirror.net/6/docs/ref/#state.EditorState^tabSize) facet.
  */
  get tabSize() {
    return this.facet(G.tabSize);
  }
  /**
  Get the proper [line-break](https://codemirror.net/6/docs/ref/#state.EditorState^lineSeparator)
  string for this state.
  */
  get lineBreak() {
    return this.facet(G.lineSeparator) || `
`;
  }
  /**
  Returns true when the editor is
  [configured](https://codemirror.net/6/docs/ref/#state.EditorState^readOnly) to be read-only.
  */
  get readOnly() {
    return this.facet(kf);
  }
  /**
  Look up a translation for the given phrase (via the
  [`phrases`](https://codemirror.net/6/docs/ref/#state.EditorState^phrases) facet), or return the
  original string if no translation is found.
  
  If additional arguments are passed, they will be inserted in
  place of markers like `$1` (for the first value) and `$2`, etc.
  A single `$` is equivalent to `$1`, and `$$` will produce a
  literal dollar sign.
  */
  phrase(e, ...t) {
    for (let i of this.facet(G.phrases))
      if (Object.prototype.hasOwnProperty.call(i, e)) {
        e = i[e];
        break;
      }
    return t.length && (e = e.replace(/\$(\$|\d*)/g, (i, s) => {
      if (s == "$")
        return "$";
      let r = +(s || 1);
      return !r || r > t.length ? i : t[r - 1];
    })), e;
  }
  /**
  Find the values for a given language data field, provided by the
  the [`languageData`](https://codemirror.net/6/docs/ref/#state.EditorState^languageData) facet.
  
  Examples of language data fields are...
  
  - [`"commentTokens"`](https://codemirror.net/6/docs/ref/#commands.CommentTokens) for specifying
    comment syntax.
  - [`"autocomplete"`](https://codemirror.net/6/docs/ref/#autocomplete.autocompletion^config.override)
    for providing language-specific completion sources.
  - [`"wordChars"`](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) for adding
    characters that should be considered part of words in this
    language.
  - [`"closeBrackets"`](https://codemirror.net/6/docs/ref/#autocomplete.CloseBracketConfig) controls
    bracket closing behavior.
  */
  languageDataAt(e, t, i = -1) {
    let s = [];
    for (let r of this.facet(mf))
      for (let o of r(this, t, i))
        Object.prototype.hasOwnProperty.call(o, e) && s.push(o[e]);
    return s;
  }
  /**
  Return a function that can categorize strings (expected to
  represent a single [grapheme cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak))
  into one of:
  
   - Word (contains an alphanumeric character or a character
     explicitly listed in the local language's `"wordChars"`
     language data, which should be a string)
   - Space (contains only whitespace)
   - Other (anything else)
  */
  charCategorizer(e) {
    return Pd(this.languageDataAt("wordChars", e).join(""));
  }
  /**
  Find the word at the given position, meaning the range
  containing all [word](https://codemirror.net/6/docs/ref/#state.CharCategory.Word) characters
  around it. If no word characters are adjacent to the position,
  this returns null.
  */
  wordAt(e) {
    let { text: t, from: i, length: s } = this.doc.lineAt(e), r = this.charCategorizer(e), o = e - i, l = e - i;
    for (; o > 0; ) {
      let a = xe(t, o, !1);
      if (r(t.slice(a, o)) != Ee.Word)
        break;
      o = a;
    }
    for (; l < s; ) {
      let a = xe(t, l);
      if (r(t.slice(l, a)) != Ee.Word)
        break;
      l = a;
    }
    return o == l ? null : C.range(o + i, l + i);
  }
}
G.allowMultipleSelections = Hr;
G.tabSize = /* @__PURE__ */ O.define({
  combine: (n) => n.length ? n[0] : 4
});
G.lineSeparator = gf;
G.readOnly = kf;
G.phrases = /* @__PURE__ */ O.define({
  compare(n, e) {
    let t = Object.keys(n), i = Object.keys(e);
    return t.length == i.length && t.every((s) => n[s] == e[s]);
  }
});
G.languageData = mf;
G.changeFilter = bf;
G.transactionFilter = yf;
G.transactionExtender = wf;
Ls.reconfigure = /* @__PURE__ */ z.define();
function ai(n, e, t = {}) {
  let i = {};
  for (let s of n)
    for (let r of Object.keys(s)) {
      let o = s[r], l = i[r];
      if (l === void 0)
        i[r] = o;
      else if (!(l === o || o === void 0))
        if (Object.hasOwnProperty.call(t, r))
          i[r] = t[r](l, o);
        else
          throw new Error("Config merge conflict for field " + r);
    }
  for (let s in e)
    i[s] === void 0 && (i[s] = e[s]);
  return i;
}
class Zt {
  /**
  Compare this value with another value. Used when comparing
  rangesets. The default implementation compares by identity.
  Unless you are only creating a fixed number of unique instances
  of your value type, it is a good idea to implement this
  properly.
  */
  eq(e) {
    return this == e;
  }
  /**
  Create a [range](https://codemirror.net/6/docs/ref/#state.Range) with this value.
  */
  range(e, t = e) {
    return zr.create(e, t, this);
  }
}
Zt.prototype.startSide = Zt.prototype.endSide = 0;
Zt.prototype.point = !1;
Zt.prototype.mapMode = me.TrackDel;
let zr = class Sf {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.value = i;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Sf(e, t, i);
  }
};
function qr(n, e) {
  return n.from - e.from || n.value.startSide - e.value.startSide;
}
class Io {
  constructor(e, t, i, s) {
    this.from = e, this.to = t, this.value = i, this.maxPoint = s;
  }
  get length() {
    return this.to[this.to.length - 1];
  }
  // Find the index of the given position and side. Use the ranges'
  // `from` pos when `end == false`, `to` when `end == true`.
  findIndex(e, t, i, s = 0) {
    let r = i ? this.to : this.from;
    for (let o = s, l = r.length; ; ) {
      if (o == l)
        return o;
      let a = o + l >> 1, h = r[a] - e || (i ? this.value[a].endSide : this.value[a].startSide) - t;
      if (a == o)
        return h >= 0 ? o : l;
      h >= 0 ? l = a : o = a + 1;
    }
  }
  between(e, t, i, s) {
    for (let r = this.findIndex(t, -1e9, !0), o = this.findIndex(i, 1e9, !1, r); r < o; r++)
      if (s(this.from[r] + e, this.to[r] + e, this.value[r]) === !1)
        return !1;
  }
  map(e, t) {
    let i = [], s = [], r = [], o = -1, l = -1;
    for (let a = 0; a < this.value.length; a++) {
      let h = this.value[a], f = this.from[a] + e, c = this.to[a] + e, u, d;
      if (f == c) {
        let p = t.mapPos(f, h.startSide, h.mapMode);
        if (p == null || (u = d = p, h.startSide != h.endSide && (d = t.mapPos(f, h.endSide), d < u)))
          continue;
      } else if (u = t.mapPos(f, h.startSide), d = t.mapPos(c, h.endSide), u > d || u == d && h.startSide > 0 && h.endSide <= 0)
        continue;
      (d - u || h.endSide - h.startSide) < 0 || (o < 0 && (o = u), h.point && (l = Math.max(l, d - u)), i.push(h), s.push(u - o), r.push(d - o));
    }
    return { mapped: i.length ? new Io(s, r, i, l) : null, pos: o };
  }
}
class Y {
  constructor(e, t, i, s) {
    this.chunkPos = e, this.chunk = t, this.nextLayer = i, this.maxPoint = s;
  }
  /**
  @internal
  */
  static create(e, t, i, s) {
    return new Y(e, t, i, s);
  }
  /**
  @internal
  */
  get length() {
    let e = this.chunk.length - 1;
    return e < 0 ? 0 : Math.max(this.chunkEnd(e), this.nextLayer.length);
  }
  /**
  The number of ranges in the set.
  */
  get size() {
    if (this.isEmpty)
      return 0;
    let e = this.nextLayer.size;
    for (let t of this.chunk)
      e += t.value.length;
    return e;
  }
  /**
  @internal
  */
  chunkEnd(e) {
    return this.chunkPos[e] + this.chunk[e].length;
  }
  /**
  Update the range set, optionally adding new ranges or filtering
  out existing ones.
  
  (Note: The type parameter is just there as a kludge to work
  around TypeScript variance issues that prevented `RangeSet<X>`
  from being a subtype of `RangeSet<Y>` when `X` is a subtype of
  `Y`.)
  */
  update(e) {
    let { add: t = [], sort: i = !1, filterFrom: s = 0, filterTo: r = this.length } = e, o = e.filter;
    if (t.length == 0 && !o)
      return this;
    if (i && (t = t.slice().sort(qr)), this.isEmpty)
      return t.length ? Y.of(t) : this;
    let l = new _f(this, null, -1).goto(0), a = 0, h = [], f = new Qt();
    for (; l.value || a < t.length; )
      if (a < t.length && (l.from - t[a].from || l.startSide - t[a].value.startSide) >= 0) {
        let c = t[a++];
        f.addInner(c.from, c.to, c.value) || h.push(c);
      } else
        l.rangeIndex == 1 && l.chunkIndex < this.chunk.length && (a == t.length || this.chunkEnd(l.chunkIndex) < t[a].from) && (!o || s > this.chunkEnd(l.chunkIndex) || r < this.chunkPos[l.chunkIndex]) && f.addChunk(this.chunkPos[l.chunkIndex], this.chunk[l.chunkIndex]) ? l.nextChunk() : ((!o || s > l.to || r < l.from || o(l.from, l.to, l.value)) && (f.addInner(l.from, l.to, l.value) || h.push(zr.create(l.from, l.to, l.value))), l.next());
    return f.finishInner(this.nextLayer.isEmpty && !h.length ? Y.empty : this.nextLayer.update({ add: h, filter: o, filterFrom: s, filterTo: r }));
  }
  /**
  Map this range set through a set of changes, return the new set.
  */
  map(e) {
    if (e.empty || this.isEmpty)
      return this;
    let t = [], i = [], s = -1;
    for (let o = 0; o < this.chunk.length; o++) {
      let l = this.chunkPos[o], a = this.chunk[o], h = e.touchesRange(l, l + a.length);
      if (h === !1)
        s = Math.max(s, a.maxPoint), t.push(a), i.push(e.mapPos(l));
      else if (h === !0) {
        let { mapped: f, pos: c } = a.map(l, e);
        f && (s = Math.max(s, f.maxPoint), t.push(f), i.push(c));
      }
    }
    let r = this.nextLayer.map(e);
    return t.length == 0 ? r : new Y(i, t, r || Y.empty, s);
  }
  /**
  Iterate over the ranges that touch the region `from` to `to`,
  calling `f` for each. There is no guarantee that the ranges will
  be reported in any specific order. When the callback returns
  `false`, iteration stops.
  */
  between(e, t, i) {
    if (!this.isEmpty) {
      for (let s = 0; s < this.chunk.length; s++) {
        let r = this.chunkPos[s], o = this.chunk[s];
        if (t >= r && e <= r + o.length && o.between(r, e - r, t - r, i) === !1)
          return;
      }
      this.nextLayer.between(e, t, i);
    }
  }
  /**
  Iterate over the ranges in this set, in order, including all
  ranges that end at or after `from`.
  */
  iter(e = 0) {
    return fn.from([this]).goto(e);
  }
  /**
  @internal
  */
  get isEmpty() {
    return this.nextLayer == this;
  }
  /**
  Iterate over the ranges in a collection of sets, in order,
  starting from `from`.
  */
  static iter(e, t = 0) {
    return fn.from(e).goto(t);
  }
  /**
  Iterate over two groups of sets, calling methods on `comparator`
  to notify it of possible differences.
  */
  static compare(e, t, i, s, r = -1) {
    let o = e.filter((c) => c.maxPoint > 0 || !c.isEmpty && c.maxPoint >= r), l = t.filter((c) => c.maxPoint > 0 || !c.isEmpty && c.maxPoint >= r), a = _l(o, l, i), h = new Wi(o, a, r), f = new Wi(l, a, r);
    i.iterGaps((c, u, d) => Cl(h, c, f, u, d, s)), i.empty && i.length == 0 && Cl(h, 0, f, 0, 0, s);
  }
  /**
  Compare the contents of two groups of range sets, returning true
  if they are equivalent in the given range.
  */
  static eq(e, t, i = 0, s) {
    s == null && (s = 1e9 - 1);
    let r = e.filter((f) => !f.isEmpty && t.indexOf(f) < 0), o = t.filter((f) => !f.isEmpty && e.indexOf(f) < 0);
    if (r.length != o.length)
      return !1;
    if (!r.length)
      return !0;
    let l = _l(r, o), a = new Wi(r, l, 0).goto(i), h = new Wi(o, l, 0).goto(i);
    for (; ; ) {
      if (a.to != h.to || !jr(a.active, h.active) || a.point && (!h.point || !a.point.eq(h.point)))
        return !1;
      if (a.to > s)
        return !0;
      a.next(), h.next();
    }
  }
  /**
  Iterate over a group of range sets at the same time, notifying
  the iterator about the ranges covering every given piece of
  content. Returns the open count (see
  [`SpanIterator.span`](https://codemirror.net/6/docs/ref/#state.SpanIterator.span)) at the end
  of the iteration.
  */
  static spans(e, t, i, s, r = -1) {
    let o = new Wi(e, null, r).goto(t), l = t, a = o.openStart;
    for (; ; ) {
      let h = Math.min(o.to, i);
      if (o.point) {
        let f = o.activeForPoint(o.to), c = o.pointFrom < t ? f.length + 1 : Math.min(f.length, a);
        s.point(l, h, o.point, f, c, o.pointRank), a = Math.min(o.openEnd(h), f.length);
      } else
        h > l && (s.span(l, h, o.active, a), a = o.openEnd(h));
      if (o.to > i)
        return a + (o.point && o.to > i ? 1 : 0);
      l = o.to, o.next();
    }
  }
  /**
  Create a range set for the given range or array of ranges. By
  default, this expects the ranges to be _sorted_ (by start
  position and, if two start at the same position,
  `value.startSide`). You can pass `true` as second argument to
  cause the method to sort them.
  */
  static of(e, t = !1) {
    let i = new Qt();
    for (let s of e instanceof zr ? [e] : t ? Ld(e) : e)
      i.add(s.from, s.to, s.value);
    return i.finish();
  }
  /**
  Join an array of range sets into a single set.
  */
  static join(e) {
    if (!e.length)
      return Y.empty;
    let t = e[e.length - 1];
    for (let i = e.length - 2; i >= 0; i--)
      for (let s = e[i]; s != Y.empty; s = s.nextLayer)
        t = new Y(s.chunkPos, s.chunk, t, Math.max(s.maxPoint, t.maxPoint));
    return t;
  }
}
Y.empty = /* @__PURE__ */ new Y([], [], null, -1);
function Ld(n) {
  if (n.length > 1)
    for (let e = n[0], t = 1; t < n.length; t++) {
      let i = n[t];
      if (qr(e, i) > 0)
        return n.slice().sort(qr);
      e = i;
    }
  return n;
}
Y.empty.nextLayer = Y.empty;
class Qt {
  finishChunk(e) {
    this.chunks.push(new Io(this.from, this.to, this.value, this.maxPoint)), this.chunkPos.push(this.chunkStart), this.chunkStart = -1, this.setMaxPoint = Math.max(this.setMaxPoint, this.maxPoint), this.maxPoint = -1, e && (this.from = [], this.to = [], this.value = []);
  }
  /**
  Create an empty builder.
  */
  constructor() {
    this.chunks = [], this.chunkPos = [], this.chunkStart = -1, this.last = null, this.lastFrom = -1e9, this.lastTo = -1e9, this.from = [], this.to = [], this.value = [], this.maxPoint = -1, this.setMaxPoint = -1, this.nextLayer = null;
  }
  /**
  Add a range. Ranges should be added in sorted (by `from` and
  `value.startSide`) order.
  */
  add(e, t, i) {
    this.addInner(e, t, i) || (this.nextLayer || (this.nextLayer = new Qt())).add(e, t, i);
  }
  /**
  @internal
  */
  addInner(e, t, i) {
    let s = e - this.lastTo || i.startSide - this.last.endSide;
    if (s <= 0 && (e - this.lastFrom || i.startSide - this.last.startSide) < 0)
      throw new Error("Ranges must be added sorted by `from` position and `startSide`");
    return s < 0 ? !1 : (this.from.length == 250 && this.finishChunk(!0), this.chunkStart < 0 && (this.chunkStart = e), this.from.push(e - this.chunkStart), this.to.push(t - this.chunkStart), this.last = i, this.lastFrom = e, this.lastTo = t, this.value.push(i), i.point && (this.maxPoint = Math.max(this.maxPoint, t - e)), !0);
  }
  /**
  @internal
  */
  addChunk(e, t) {
    if ((e - this.lastTo || t.value[0].startSide - this.last.endSide) < 0)
      return !1;
    this.from.length && this.finishChunk(!0), this.setMaxPoint = Math.max(this.setMaxPoint, t.maxPoint), this.chunks.push(t), this.chunkPos.push(e);
    let i = t.value.length - 1;
    return this.last = t.value[i], this.lastFrom = t.from[i] + e, this.lastTo = t.to[i] + e, !0;
  }
  /**
  Finish the range set. Returns the new set. The builder can't be
  used anymore after this has been called.
  */
  finish() {
    return this.finishInner(Y.empty);
  }
  /**
  @internal
  */
  finishInner(e) {
    if (this.from.length && this.finishChunk(!1), this.chunks.length == 0)
      return e;
    let t = Y.create(this.chunkPos, this.chunks, this.nextLayer ? this.nextLayer.finishInner(e) : e, this.setMaxPoint);
    return this.from = null, t;
  }
}
function _l(n, e, t) {
  let i = /* @__PURE__ */ new Map();
  for (let r of n)
    for (let o = 0; o < r.chunk.length; o++)
      r.chunk[o].maxPoint <= 0 && i.set(r.chunk[o], r.chunkPos[o]);
  let s = /* @__PURE__ */ new Set();
  for (let r of e)
    for (let o = 0; o < r.chunk.length; o++) {
      let l = i.get(r.chunk[o]);
      l != null && (t ? t.mapPos(l) : l) == r.chunkPos[o] && !(t != null && t.touchesRange(l, l + r.chunk[o].length)) && s.add(r.chunk[o]);
    }
  return s;
}
class _f {
  constructor(e, t, i, s = 0) {
    this.layer = e, this.skip = t, this.minPoint = i, this.rank = s;
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  get endSide() {
    return this.value ? this.value.endSide : 0;
  }
  goto(e, t = -1e9) {
    return this.chunkIndex = this.rangeIndex = 0, this.gotoInner(e, t, !1), this;
  }
  gotoInner(e, t, i) {
    for (; this.chunkIndex < this.layer.chunk.length; ) {
      let s = this.layer.chunk[this.chunkIndex];
      if (!(this.skip && this.skip.has(s) || this.layer.chunkEnd(this.chunkIndex) < e || s.maxPoint < this.minPoint))
        break;
      this.chunkIndex++, i = !1;
    }
    if (this.chunkIndex < this.layer.chunk.length) {
      let s = this.layer.chunk[this.chunkIndex].findIndex(e - this.layer.chunkPos[this.chunkIndex], t, !0);
      (!i || this.rangeIndex < s) && this.setRangeIndex(s);
    }
    this.next();
  }
  forward(e, t) {
    (this.to - e || this.endSide - t) < 0 && this.gotoInner(e, t, !0);
  }
  next() {
    for (; ; )
      if (this.chunkIndex == this.layer.chunk.length) {
        this.from = this.to = 1e9, this.value = null;
        break;
      } else {
        let e = this.layer.chunkPos[this.chunkIndex], t = this.layer.chunk[this.chunkIndex], i = e + t.from[this.rangeIndex];
        if (this.from = i, this.to = e + t.to[this.rangeIndex], this.value = t.value[this.rangeIndex], this.setRangeIndex(this.rangeIndex + 1), this.minPoint < 0 || this.value.point && this.to - this.from >= this.minPoint)
          break;
      }
  }
  setRangeIndex(e) {
    if (e == this.layer.chunk[this.chunkIndex].value.length) {
      if (this.chunkIndex++, this.skip)
        for (; this.chunkIndex < this.layer.chunk.length && this.skip.has(this.layer.chunk[this.chunkIndex]); )
          this.chunkIndex++;
      this.rangeIndex = 0;
    } else
      this.rangeIndex = e;
  }
  nextChunk() {
    this.chunkIndex++, this.rangeIndex = 0, this.next();
  }
  compare(e) {
    return this.from - e.from || this.startSide - e.startSide || this.rank - e.rank || this.to - e.to || this.endSide - e.endSide;
  }
}
class fn {
  constructor(e) {
    this.heap = e;
  }
  static from(e, t = null, i = -1) {
    let s = [];
    for (let r = 0; r < e.length; r++)
      for (let o = e[r]; !o.isEmpty; o = o.nextLayer)
        o.maxPoint >= i && s.push(new _f(o, t, i, r));
    return s.length == 1 ? s[0] : new fn(s);
  }
  get startSide() {
    return this.value ? this.value.startSide : 0;
  }
  goto(e, t = -1e9) {
    for (let i of this.heap)
      i.goto(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Xs(this.heap, i);
    return this.next(), this;
  }
  forward(e, t) {
    for (let i of this.heap)
      i.forward(e, t);
    for (let i = this.heap.length >> 1; i >= 0; i--)
      Xs(this.heap, i);
    (this.to - e || this.value.endSide - t) < 0 && this.next();
  }
  next() {
    if (this.heap.length == 0)
      this.from = this.to = 1e9, this.value = null, this.rank = -1;
    else {
      let e = this.heap[0];
      this.from = e.from, this.to = e.to, this.value = e.value, this.rank = e.rank, e.value && e.next(), Xs(this.heap, 0);
    }
  }
}
function Xs(n, e) {
  for (let t = n[e]; ; ) {
    let i = (e << 1) + 1;
    if (i >= n.length)
      break;
    let s = n[i];
    if (i + 1 < n.length && s.compare(n[i + 1]) >= 0 && (s = n[i + 1], i++), t.compare(s) < 0)
      break;
    n[i] = t, n[e] = s, e = i;
  }
}
class Wi {
  constructor(e, t, i) {
    this.minPoint = i, this.active = [], this.activeTo = [], this.activeRank = [], this.minActive = -1, this.point = null, this.pointFrom = 0, this.pointRank = 0, this.to = -1e9, this.endSide = 0, this.openStart = -1, this.cursor = fn.from(e, t, i);
  }
  goto(e, t = -1e9) {
    return this.cursor.goto(e, t), this.active.length = this.activeTo.length = this.activeRank.length = 0, this.minActive = -1, this.to = e, this.endSide = t, this.openStart = -1, this.next(), this;
  }
  forward(e, t) {
    for (; this.minActive > -1 && (this.activeTo[this.minActive] - e || this.active[this.minActive].endSide - t) < 0; )
      this.removeActive(this.minActive);
    this.cursor.forward(e, t);
  }
  removeActive(e) {
    Dn(this.active, e), Dn(this.activeTo, e), Dn(this.activeRank, e), this.minActive = Al(this.active, this.activeTo);
  }
  addActive(e) {
    let t = 0, { value: i, to: s, rank: r } = this.cursor;
    for (; t < this.activeRank.length && (r - this.activeRank[t] || s - this.activeTo[t]) > 0; )
      t++;
    On(this.active, t, i), On(this.activeTo, t, s), On(this.activeRank, t, r), e && On(e, t, this.cursor.from), this.minActive = Al(this.active, this.activeTo);
  }
  // After calling this, if `this.point` != null, the next range is a
  // point. Otherwise, it's a regular range, covered by `this.active`.
  next() {
    let e = this.to, t = this.point;
    this.point = null;
    let i = this.openStart < 0 ? [] : null;
    for (; ; ) {
      let s = this.minActive;
      if (s > -1 && (this.activeTo[s] - this.cursor.from || this.active[s].endSide - this.cursor.startSide) < 0) {
        if (this.activeTo[s] > e) {
          this.to = this.activeTo[s], this.endSide = this.active[s].endSide;
          break;
        }
        this.removeActive(s), i && Dn(i, s);
      } else if (this.cursor.value)
        if (this.cursor.from > e) {
          this.to = this.cursor.from, this.endSide = this.cursor.startSide;
          break;
        } else {
          let r = this.cursor.value;
          if (!r.point)
            this.addActive(i), this.cursor.next();
          else if (t && this.cursor.to == this.to && this.cursor.from < this.cursor.to)
            this.cursor.next();
          else {
            this.point = r, this.pointFrom = this.cursor.from, this.pointRank = this.cursor.rank, this.to = this.cursor.to, this.endSide = r.endSide, this.cursor.next(), this.forward(this.to, this.endSide);
            break;
          }
        }
      else {
        this.to = this.endSide = 1e9;
        break;
      }
    }
    if (i) {
      this.openStart = 0;
      for (let s = i.length - 1; s >= 0 && i[s] < e; s--)
        this.openStart++;
    }
  }
  activeForPoint(e) {
    if (!this.active.length)
      return this.active;
    let t = [];
    for (let i = this.active.length - 1; i >= 0 && !(this.activeRank[i] < this.pointRank); i--)
      (this.activeTo[i] > e || this.activeTo[i] == e && this.active[i].endSide >= this.point.endSide) && t.push(this.active[i]);
    return t.reverse();
  }
  openEnd(e) {
    let t = 0;
    for (let i = this.activeTo.length - 1; i >= 0 && this.activeTo[i] > e; i--)
      t++;
    return t;
  }
}
function Cl(n, e, t, i, s, r) {
  n.goto(e), t.goto(i);
  let o = i + s, l = i, a = i - e;
  for (; ; ) {
    let h = n.to + a - t.to || n.endSide - t.endSide, f = h < 0 ? n.to + a : t.to, c = Math.min(f, o);
    if (n.point || t.point ? n.point && t.point && (n.point == t.point || n.point.eq(t.point)) && jr(n.activeForPoint(n.to), t.activeForPoint(t.to)) || r.comparePoint(l, c, n.point, t.point) : c > l && !jr(n.active, t.active) && r.compareRange(l, c, n.active, t.active), f > o)
      break;
    l = f, h <= 0 && n.next(), h >= 0 && t.next();
  }
}
function jr(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (n[t] != e[t] && !n[t].eq(e[t]))
      return !1;
  return !0;
}
function Dn(n, e) {
  for (let t = e, i = n.length - 1; t < i; t++)
    n[t] = n[t + 1];
  n.pop();
}
function On(n, e, t) {
  for (let i = n.length - 1; i >= e; i--)
    n[i + 1] = n[i];
  n[e] = t;
}
function Al(n, e) {
  let t = -1, i = 1e9;
  for (let s = 0; s < e.length; s++)
    (e[s] - i || n[s].endSide - n[t].endSide) < 0 && (t = s, i = e[s]);
  return t;
}
function Ei(n, e, t = n.length) {
  let i = 0;
  for (let s = 0; s < t; )
    n.charCodeAt(s) == 9 ? (i += e - i % e, s++) : (i++, s = xe(n, s));
  return i;
}
function Kr(n, e, t, i) {
  for (let s = 0, r = 0; ; ) {
    if (r >= e)
      return s;
    if (s == n.length)
      break;
    r += n.charCodeAt(s) == 9 ? t - r % t : 1, s = xe(n, s);
  }
  return i === !0 ? -1 : n.length;
}
const Ur = "ͼ", Ml = typeof Symbol > "u" ? "__" + Ur : Symbol.for(Ur), Gr = typeof Symbol > "u" ? "__styleSet" + Math.floor(Math.random() * 1e8) : Symbol("styleSet"), Tl = typeof globalThis < "u" ? globalThis : typeof window < "u" ? window : {};
class Et {
  // :: (Object<Style>, ?{finish: ?(string) → string})
  // Create a style module from the given spec.
  //
  // When `finish` is given, it is called on regular (non-`@`)
  // selectors (after `&` expansion) to compute the final selector.
  constructor(e, t) {
    this.rules = [];
    let { finish: i } = t || {};
    function s(o) {
      return /^@/.test(o) ? [o] : o.split(/,\s*/);
    }
    function r(o, l, a, h) {
      let f = [], c = /^@(\w+)\b/.exec(o[0]), u = c && c[1] == "keyframes";
      if (c && l == null)
        return a.push(o[0] + ";");
      for (let d in l) {
        let p = l[d];
        if (/&/.test(d))
          r(
            d.split(/,\s*/).map((m) => o.map((g) => m.replace(/&/, g))).reduce((m, g) => m.concat(g)),
            p,
            a
          );
        else if (p && typeof p == "object") {
          if (!c)
            throw new RangeError("The value of a property (" + d + ") should be a primitive value.");
          r(s(d), p, f, u);
        } else
          p != null && f.push(d.replace(/_.*/, "").replace(/[A-Z]/g, (m) => "-" + m.toLowerCase()) + ": " + p + ";");
      }
      (f.length || u) && a.push((i && !c && !h ? o.map(i) : o).join(", ") + " {" + f.join(" ") + "}");
    }
    for (let o in e)
      r(s(o), e[o], this.rules);
  }
  // :: () → string
  // Returns a string containing the module's CSS rules.
  getRules() {
    return this.rules.join(`
`);
  }
  // :: () → string
  // Generate a new unique CSS class name.
  static newName() {
    let e = Tl[Ml] || 1;
    return Tl[Ml] = e + 1, Ur + e.toString(36);
  }
  // :: (union<Document, ShadowRoot>, union<[StyleModule], StyleModule>, ?{nonce: ?string})
  //
  // Mount the given set of modules in the given DOM root, which ensures
  // that the CSS rules defined by the module are available in that
  // context.
  //
  // Rules are only added to the document once per root.
  //
  // Rule order will follow the order of the modules, so that rules from
  // modules later in the array take precedence of those from earlier
  // modules. If you call this function multiple times for the same root
  // in a way that changes the order of already mounted modules, the old
  // order will be changed.
  //
  // If a Content Security Policy nonce is provided, it is added to
  // the `<style>` tag generated by the library.
  static mount(e, t, i) {
    let s = e[Gr], r = i && i.nonce;
    s ? r && s.setNonce(r) : s = new Ed(e, r), s.mount(Array.isArray(t) ? t : [t]);
  }
}
let Dl = /* @__PURE__ */ new Map();
class Ed {
  constructor(e, t) {
    let i = e.ownerDocument || e, s = i.defaultView;
    if (!e.head && e.adoptedStyleSheets && s.CSSStyleSheet) {
      let r = Dl.get(i);
      if (r)
        return e.adoptedStyleSheets = [r.sheet, ...e.adoptedStyleSheets], e[Gr] = r;
      this.sheet = new s.CSSStyleSheet(), e.adoptedStyleSheets = [this.sheet, ...e.adoptedStyleSheets], Dl.set(i, this);
    } else {
      this.styleTag = i.createElement("style"), t && this.styleTag.setAttribute("nonce", t);
      let r = e.head || e;
      r.insertBefore(this.styleTag, r.firstChild);
    }
    this.modules = [], e[Gr] = this;
  }
  mount(e) {
    let t = this.sheet, i = 0, s = 0;
    for (let r = 0; r < e.length; r++) {
      let o = e[r], l = this.modules.indexOf(o);
      if (l < s && l > -1 && (this.modules.splice(l, 1), s--, l = -1), l == -1) {
        if (this.modules.splice(s++, 0, o), t)
          for (let a = 0; a < o.rules.length; a++)
            t.insertRule(o.rules[a], i++);
      } else {
        for (; s < l; )
          i += this.modules[s++].rules.length;
        i += o.rules.length, s++;
      }
    }
    if (!t) {
      let r = "";
      for (let o = 0; o < this.modules.length; o++)
        r += this.modules[o].getRules() + `
`;
      this.styleTag.textContent = r;
    }
  }
  setNonce(e) {
    this.styleTag && this.styleTag.getAttribute("nonce") != e && this.styleTag.setAttribute("nonce", e);
  }
}
var Rt = {
  8: "Backspace",
  9: "Tab",
  10: "Enter",
  12: "NumLock",
  13: "Enter",
  16: "Shift",
  17: "Control",
  18: "Alt",
  20: "CapsLock",
  27: "Escape",
  32: " ",
  33: "PageUp",
  34: "PageDown",
  35: "End",
  36: "Home",
  37: "ArrowLeft",
  38: "ArrowUp",
  39: "ArrowRight",
  40: "ArrowDown",
  44: "PrintScreen",
  45: "Insert",
  46: "Delete",
  59: ";",
  61: "=",
  91: "Meta",
  92: "Meta",
  106: "*",
  107: "+",
  108: ",",
  109: "-",
  110: ".",
  111: "/",
  144: "NumLock",
  145: "ScrollLock",
  160: "Shift",
  161: "Shift",
  162: "Control",
  163: "Control",
  164: "Alt",
  165: "Alt",
  173: "-",
  186: ";",
  187: "=",
  188: ",",
  189: "-",
  190: ".",
  191: "/",
  192: "`",
  219: "[",
  220: "\\",
  221: "]",
  222: "'"
}, cn = {
  48: ")",
  49: "!",
  50: "@",
  51: "#",
  52: "$",
  53: "%",
  54: "^",
  55: "&",
  56: "*",
  57: "(",
  59: ":",
  61: "+",
  173: "_",
  186: ":",
  187: "+",
  188: "<",
  189: "_",
  190: ">",
  191: "?",
  192: "~",
  219: "{",
  220: "|",
  221: "}",
  222: '"'
}, Rd = typeof navigator < "u" && /Mac/.test(navigator.platform), Id = typeof navigator < "u" && /MSIE \d|Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(navigator.userAgent);
for (var pe = 0; pe < 10; pe++)
  Rt[48 + pe] = Rt[96 + pe] = String(pe);
for (var pe = 1; pe <= 24; pe++)
  Rt[pe + 111] = "F" + pe;
for (var pe = 65; pe <= 90; pe++)
  Rt[pe] = String.fromCharCode(pe + 32), cn[pe] = String.fromCharCode(pe);
for (var Zs in Rt)
  cn.hasOwnProperty(Zs) || (cn[Zs] = Rt[Zs]);
function Nd(n) {
  var e = Rd && n.metaKey && n.shiftKey && !n.ctrlKey && !n.altKey || Id && n.shiftKey && n.key && n.key.length == 1 || n.key == "Unidentified", t = !e && n.key || (n.shiftKey ? cn : Rt)[n.keyCode] || n.key || "Unidentified";
  return t == "Esc" && (t = "Escape"), t == "Del" && (t = "Delete"), t == "Left" && (t = "ArrowLeft"), t == "Up" && (t = "ArrowUp"), t == "Right" && (t = "ArrowRight"), t == "Down" && (t = "ArrowDown"), t;
}
function gs(n) {
  let e;
  return n.nodeType == 11 ? e = n.getSelection ? n : n.ownerDocument : e = n, e.getSelection();
}
function Yr(n, e) {
  return e ? n == e || n.contains(e.nodeType != 1 ? e.parentNode : e) : !1;
}
function Fd(n) {
  let e = n.activeElement;
  for (; e && e.shadowRoot; )
    e = e.shadowRoot.activeElement;
  return e;
}
function ns(n, e) {
  if (!e.anchorNode)
    return !1;
  try {
    return Yr(n, e.anchorNode);
  } catch {
    return !1;
  }
}
function Mi(n) {
  return n.nodeType == 3 ? $t(n, 0, n.nodeValue.length).getClientRects() : n.nodeType == 1 ? n.getClientRects() : [];
}
function nn(n, e, t, i) {
  return t ? Ol(n, e, t, i, -1) || Ol(n, e, t, i, 1) : !1;
}
function un(n) {
  for (var e = 0; ; e++)
    if (n = n.previousSibling, !n)
      return e;
}
function Ol(n, e, t, i, s) {
  for (; ; ) {
    if (n == t && e == i)
      return !0;
    if (e == (s < 0 ? 0 : yt(n))) {
      if (n.nodeName == "DIV")
        return !1;
      let r = n.parentNode;
      if (!r || r.nodeType != 1)
        return !1;
      e = un(n) + (s < 0 ? 0 : 1), n = r;
    } else if (n.nodeType == 1) {
      if (n = n.childNodes[e + (s < 0 ? -1 : 0)], n.nodeType == 1 && n.contentEditable == "false")
        return !1;
      e = s < 0 ? yt(n) : 0;
    } else
      return !1;
  }
}
function yt(n) {
  return n.nodeType == 3 ? n.nodeValue.length : n.childNodes.length;
}
function Es(n, e) {
  let t = e ? n.left : n.right;
  return { left: t, right: t, top: n.top, bottom: n.bottom };
}
function Hd(n) {
  return {
    left: 0,
    right: n.innerWidth,
    top: 0,
    bottom: n.innerHeight
  };
}
function Cf(n, e) {
  let t = e.width / n.offsetWidth, i = e.height / n.offsetHeight;
  return (t > 0.995 && t < 1.005 || !isFinite(t) || Math.abs(e.width - n.offsetWidth) < 1) && (t = 1), (i > 0.995 && i < 1.005 || !isFinite(i) || Math.abs(e.height - n.offsetHeight) < 1) && (i = 1), { scaleX: t, scaleY: i };
}
function Vd(n, e, t, i, s, r, o, l) {
  let a = n.ownerDocument, h = a.defaultView || window;
  for (let f = n, c = !1; f && !c; )
    if (f.nodeType == 1) {
      let u, d = f == a.body, p = 1, m = 1;
      if (d)
        u = Hd(h);
      else {
        if (/^(fixed|sticky)$/.test(getComputedStyle(f).position) && (c = !0), f.scrollHeight <= f.clientHeight && f.scrollWidth <= f.clientWidth) {
          f = f.assignedSlot || f.parentNode;
          continue;
        }
        let k = f.getBoundingClientRect();
        ({ scaleX: p, scaleY: m } = Cf(f, k)), u = {
          left: k.left,
          right: k.left + f.clientWidth * p,
          top: k.top,
          bottom: k.top + f.clientHeight * m
        };
      }
      let g = 0, y = 0;
      if (s == "nearest")
        e.top < u.top ? (y = -(u.top - e.top + o), t > 0 && e.bottom > u.bottom + y && (y = e.bottom - u.bottom + y + o)) : e.bottom > u.bottom && (y = e.bottom - u.bottom + o, t < 0 && e.top - y < u.top && (y = -(u.top + y - e.top + o)));
      else {
        let k = e.bottom - e.top, w = u.bottom - u.top;
        y = (s == "center" && k <= w ? e.top + k / 2 - w / 2 : s == "start" || s == "center" && t < 0 ? e.top - o : e.bottom - w + o) - u.top;
      }
      if (i == "nearest" ? e.left < u.left ? (g = -(u.left - e.left + r), t > 0 && e.right > u.right + g && (g = e.right - u.right + g + r)) : e.right > u.right && (g = e.right - u.right + r, t < 0 && e.left < u.left + g && (g = -(u.left + g - e.left + r))) : g = (i == "center" ? e.left + (e.right - e.left) / 2 - (u.right - u.left) / 2 : i == "start" == l ? e.left - r : e.right - (u.right - u.left) + r) - u.left, g || y)
        if (d)
          h.scrollBy(g, y);
        else {
          let k = 0, w = 0;
          if (y) {
            let S = f.scrollTop;
            f.scrollTop += y / m, w = (f.scrollTop - S) * m;
          }
          if (g) {
            let S = f.scrollLeft;
            f.scrollLeft += g / p, k = (f.scrollLeft - S) * p;
          }
          e = {
            left: e.left - k,
            top: e.top - w,
            right: e.right - k,
            bottom: e.bottom - w
          }, k && Math.abs(k - g) < 1 && (i = "nearest"), w && Math.abs(w - y) < 1 && (s = "nearest");
        }
      if (d)
        break;
      f = f.assignedSlot || f.parentNode;
    } else if (f.nodeType == 11)
      f = f.host;
    else
      break;
}
function Wd(n) {
  let e = n.ownerDocument;
  for (let t = n.parentNode; t && t != e.body; )
    if (t.nodeType == 1) {
      if (t.scrollHeight > t.clientHeight || t.scrollWidth > t.clientWidth)
        return t;
      t = t.assignedSlot || t.parentNode;
    } else if (t.nodeType == 11)
      t = t.host;
    else
      break;
  return null;
}
class zd {
  constructor() {
    this.anchorNode = null, this.anchorOffset = 0, this.focusNode = null, this.focusOffset = 0;
  }
  eq(e) {
    return this.anchorNode == e.anchorNode && this.anchorOffset == e.anchorOffset && this.focusNode == e.focusNode && this.focusOffset == e.focusOffset;
  }
  setRange(e) {
    let { anchorNode: t, focusNode: i } = e;
    this.set(t, Math.min(e.anchorOffset, t ? yt(t) : 0), i, Math.min(e.focusOffset, i ? yt(i) : 0));
  }
  set(e, t, i, s) {
    this.anchorNode = e, this.anchorOffset = t, this.focusNode = i, this.focusOffset = s;
  }
}
let hi = null;
function Af(n) {
  if (n.setActive)
    return n.setActive();
  if (hi)
    return n.focus(hi);
  let e = [];
  for (let t = n; t && (e.push(t, t.scrollTop, t.scrollLeft), t != t.ownerDocument); t = t.parentNode)
    ;
  if (n.focus(hi == null ? {
    get preventScroll() {
      return hi = { preventScroll: !0 }, !0;
    }
  } : void 0), !hi) {
    hi = !1;
    for (let t = 0; t < e.length; ) {
      let i = e[t++], s = e[t++], r = e[t++];
      i.scrollTop != s && (i.scrollTop = s), i.scrollLeft != r && (i.scrollLeft = r);
    }
  }
}
let Bl;
function $t(n, e, t = e) {
  let i = Bl || (Bl = document.createRange());
  return i.setEnd(n, t), i.setStart(n, e), i;
}
function xi(n, e, t) {
  let i = { key: e, code: e, keyCode: t, which: t, cancelable: !0 }, s = new KeyboardEvent("keydown", i);
  s.synthetic = !0, n.dispatchEvent(s);
  let r = new KeyboardEvent("keyup", i);
  return r.synthetic = !0, n.dispatchEvent(r), s.defaultPrevented || r.defaultPrevented;
}
function qd(n) {
  for (; n; ) {
    if (n && (n.nodeType == 9 || n.nodeType == 11 && n.host))
      return n;
    n = n.assignedSlot || n.parentNode;
  }
  return null;
}
function Mf(n) {
  for (; n.attributes.length; )
    n.removeAttributeNode(n.attributes[0]);
}
function jd(n, e) {
  let t = e.focusNode, i = e.focusOffset;
  if (!t || e.anchorNode != t || e.anchorOffset != i)
    return !1;
  for (i = Math.min(i, yt(t)); ; )
    if (i) {
      if (t.nodeType != 1)
        return !1;
      let s = t.childNodes[i - 1];
      s.contentEditable == "false" ? i-- : (t = s, i = yt(t));
    } else {
      if (t == n)
        return !0;
      i = un(t), t = t.parentNode;
    }
}
function Tf(n) {
  return n.scrollTop > Math.max(1, n.scrollHeight - n.clientHeight - 4);
}
class ye {
  constructor(e, t, i = !0) {
    this.node = e, this.offset = t, this.precise = i;
  }
  static before(e, t) {
    return new ye(e.parentNode, un(e), t);
  }
  static after(e, t) {
    return new ye(e.parentNode, un(e) + 1, t);
  }
}
const No = [];
class ee {
  constructor() {
    this.parent = null, this.dom = null, this.flags = 2;
  }
  get overrideDOMText() {
    return null;
  }
  get posAtStart() {
    return this.parent ? this.parent.posBefore(this) : 0;
  }
  get posAtEnd() {
    return this.posAtStart + this.length;
  }
  posBefore(e) {
    let t = this.posAtStart;
    for (let i of this.children) {
      if (i == e)
        return t;
      t += i.length + i.breakAfter;
    }
    throw new RangeError("Invalid child in posBefore");
  }
  posAfter(e) {
    return this.posBefore(e) + e.length;
  }
  sync(e, t) {
    if (this.flags & 2) {
      let i = this.dom, s = null, r;
      for (let o of this.children) {
        if (o.flags & 7) {
          if (!o.dom && (r = s ? s.nextSibling : i.firstChild)) {
            let l = ee.get(r);
            (!l || !l.parent && l.canReuseDOM(o)) && o.reuseDOM(r);
          }
          o.sync(e, t), o.flags &= -8;
        }
        if (r = s ? s.nextSibling : i.firstChild, t && !t.written && t.node == i && r != o.dom && (t.written = !0), o.dom.parentNode == i)
          for (; r && r != o.dom; )
            r = Pl(r);
        else
          i.insertBefore(o.dom, r);
        s = o.dom;
      }
      for (r = s ? s.nextSibling : i.firstChild, r && t && t.node == i && (t.written = !0); r; )
        r = Pl(r);
    } else if (this.flags & 1)
      for (let i of this.children)
        i.flags & 7 && (i.sync(e, t), i.flags &= -8);
  }
  reuseDOM(e) {
  }
  localPosFromDOM(e, t) {
    let i;
    if (e == this.dom)
      i = this.dom.childNodes[t];
    else {
      let s = yt(e) == 0 ? 0 : t == 0 ? -1 : 1;
      for (; ; ) {
        let r = e.parentNode;
        if (r == this.dom)
          break;
        s == 0 && r.firstChild != r.lastChild && (e == r.firstChild ? s = -1 : s = 1), e = r;
      }
      s < 0 ? i = e : i = e.nextSibling;
    }
    if (i == this.dom.firstChild)
      return 0;
    for (; i && !ee.get(i); )
      i = i.nextSibling;
    if (!i)
      return this.length;
    for (let s = 0, r = 0; ; s++) {
      let o = this.children[s];
      if (o.dom == i)
        return r;
      r += o.length + o.breakAfter;
    }
  }
  domBoundsAround(e, t, i = 0) {
    let s = -1, r = -1, o = -1, l = -1;
    for (let a = 0, h = i, f = i; a < this.children.length; a++) {
      let c = this.children[a], u = h + c.length;
      if (h < e && u > t)
        return c.domBoundsAround(e, t, h);
      if (u >= e && s == -1 && (s = a, r = h), h > t && c.dom.parentNode == this.dom) {
        o = a, l = f;
        break;
      }
      f = u, h = u + c.breakAfter;
    }
    return {
      from: r,
      to: l < 0 ? i + this.length : l,
      startDOM: (s ? this.children[s - 1].dom.nextSibling : null) || this.dom.firstChild,
      endDOM: o < this.children.length && o >= 0 ? this.children[o].dom : null
    };
  }
  markDirty(e = !1) {
    this.flags |= 2, this.markParentsDirty(e);
  }
  markParentsDirty(e) {
    for (let t = this.parent; t; t = t.parent) {
      if (e && (t.flags |= 2), t.flags & 1)
        return;
      t.flags |= 1, e = !1;
    }
  }
  setParent(e) {
    this.parent != e && (this.parent = e, this.flags & 7 && this.markParentsDirty(!0));
  }
  setDOM(e) {
    this.dom != e && (this.dom && (this.dom.cmView = null), this.dom = e, e.cmView = this);
  }
  get rootView() {
    for (let e = this; ; ) {
      let t = e.parent;
      if (!t)
        return e;
      e = t;
    }
  }
  replaceChildren(e, t, i = No) {
    this.markDirty();
    for (let s = e; s < t; s++) {
      let r = this.children[s];
      r.parent == this && i.indexOf(r) < 0 && r.destroy();
    }
    this.children.splice(e, t - e, ...i);
    for (let s = 0; s < i.length; s++)
      i[s].setParent(this);
  }
  ignoreMutation(e) {
    return !1;
  }
  ignoreEvent(e) {
    return !1;
  }
  childCursor(e = this.length) {
    return new Df(this.children, e, this.children.length);
  }
  childPos(e, t = 1) {
    return this.childCursor().findPos(e, t);
  }
  toString() {
    let e = this.constructor.name.replace("View", "");
    return e + (this.children.length ? "(" + this.children.join() + ")" : this.length ? "[" + (e == "Text" ? this.text : this.length) + "]" : "") + (this.breakAfter ? "#" : "");
  }
  static get(e) {
    return e.cmView;
  }
  get isEditable() {
    return !0;
  }
  get isWidget() {
    return !1;
  }
  get isHidden() {
    return !1;
  }
  merge(e, t, i, s, r, o) {
    return !1;
  }
  become(e) {
    return !1;
  }
  canReuseDOM(e) {
    return e.constructor == this.constructor && !((this.flags | e.flags) & 8);
  }
  // When this is a zero-length view with a side, this should return a
  // number <= 0 to indicate it is before its position, or a
  // number > 0 when after its position.
  getSide() {
    return 0;
  }
  destroy() {
    for (let e of this.children)
      e.parent == this && e.destroy();
    this.parent = null;
  }
}
ee.prototype.breakAfter = 0;
function Pl(n) {
  let e = n.nextSibling;
  return n.parentNode.removeChild(n), e;
}
class Df {
  constructor(e, t, i) {
    this.children = e, this.pos = t, this.i = i, this.off = 0;
  }
  findPos(e, t = 1) {
    for (; ; ) {
      if (e > this.pos || e == this.pos && (t > 0 || this.i == 0 || this.children[this.i - 1].breakAfter))
        return this.off = e - this.pos, this;
      let i = this.children[--this.i];
      this.pos -= i.length + i.breakAfter;
    }
  }
}
function Of(n, e, t, i, s, r, o, l, a) {
  let { children: h } = n, f = h.length ? h[e] : null, c = r.length ? r[r.length - 1] : null, u = c ? c.breakAfter : o;
  if (!(e == i && f && !o && !u && r.length < 2 && f.merge(t, s, r.length ? c : null, t == 0, l, a))) {
    if (i < h.length) {
      let d = h[i];
      d && (s < d.length || d.breakAfter && (c != null && c.breakAfter)) ? (e == i && (d = d.split(s), s = 0), !u && c && d.merge(0, s, c, !0, 0, a) ? r[r.length - 1] = d : ((s || d.children.length && !d.children[0].length) && d.merge(0, s, null, !1, 0, a), r.push(d))) : d != null && d.breakAfter && (c ? c.breakAfter = 1 : o = 1), i++;
    }
    for (f && (f.breakAfter = o, t > 0 && (!o && r.length && f.merge(t, f.length, r[0], !1, l, 0) ? f.breakAfter = r.shift().breakAfter : (t < f.length || f.children.length && f.children[f.children.length - 1].length == 0) && f.merge(t, f.length, null, !1, l, 0), e++)); e < i && r.length; )
      if (h[i - 1].become(r[r.length - 1]))
        i--, r.pop(), a = r.length ? 0 : l;
      else if (h[e].become(r[0]))
        e++, r.shift(), l = r.length ? 0 : a;
      else
        break;
    !r.length && e && i < h.length && !h[e - 1].breakAfter && h[i].merge(0, 0, h[e - 1], !1, l, a) && e--, (e < i || r.length) && n.replaceChildren(e, i, r);
  }
}
function Bf(n, e, t, i, s, r) {
  let o = n.childCursor(), { i: l, off: a } = o.findPos(t, 1), { i: h, off: f } = o.findPos(e, -1), c = e - t;
  for (let u of i)
    c += u.length;
  n.length += c, Of(n, h, f, l, a, i, 0, s, r);
}
let Be = typeof navigator < "u" ? navigator : { userAgent: "", vendor: "", platform: "" }, Jr = typeof document < "u" ? document : { documentElement: { style: {} } };
const Xr = /* @__PURE__ */ /Edge\/(\d+)/.exec(Be.userAgent), Pf = /* @__PURE__ */ /MSIE \d/.test(Be.userAgent), Zr = /* @__PURE__ */ /Trident\/(?:[7-9]|\d{2,})\..*rv:(\d+)/.exec(Be.userAgent), Rs = !!(Pf || Zr || Xr), Ll = !Rs && /* @__PURE__ */ /gecko\/(\d+)/i.test(Be.userAgent), Qs = !Rs && /* @__PURE__ */ /Chrome\/(\d+)/.exec(Be.userAgent), El = "webkitFontSmoothing" in Jr.documentElement.style, Lf = !Rs && /* @__PURE__ */ /Apple Computer/.test(Be.vendor), Rl = Lf && (/* @__PURE__ */ /Mobile\/\w+/.test(Be.userAgent) || Be.maxTouchPoints > 2);
var D = {
  mac: Rl || /* @__PURE__ */ /Mac/.test(Be.platform),
  windows: /* @__PURE__ */ /Win/.test(Be.platform),
  linux: /* @__PURE__ */ /Linux|X11/.test(Be.platform),
  ie: Rs,
  ie_version: Pf ? Jr.documentMode || 6 : Zr ? +Zr[1] : Xr ? +Xr[1] : 0,
  gecko: Ll,
  gecko_version: Ll ? +(/* @__PURE__ */ /Firefox\/(\d+)/.exec(Be.userAgent) || [0, 0])[1] : 0,
  chrome: !!Qs,
  chrome_version: Qs ? +Qs[1] : 0,
  ios: Rl,
  android: /* @__PURE__ */ /Android\b/.test(Be.userAgent),
  webkit: El,
  safari: Lf,
  webkit_version: El ? +(/* @__PURE__ */ /\bAppleWebKit\/(\d+)/.exec(navigator.userAgent) || [0, 0])[1] : 0,
  tabSize: Jr.documentElement.style.tabSize != null ? "tab-size" : "-moz-tab-size"
};
const Kd = 256;
class wt extends ee {
  constructor(e) {
    super(), this.text = e;
  }
  get length() {
    return this.text.length;
  }
  createDOM(e) {
    this.setDOM(e || document.createTextNode(this.text));
  }
  sync(e, t) {
    this.dom || this.createDOM(), this.dom.nodeValue != this.text && (t && t.node == this.dom && (t.written = !0), this.dom.nodeValue = this.text);
  }
  reuseDOM(e) {
    e.nodeType == 3 && this.createDOM(e);
  }
  merge(e, t, i) {
    return this.flags & 8 || i && (!(i instanceof wt) || this.length - (t - e) + i.length > Kd || i.flags & 8) ? !1 : (this.text = this.text.slice(0, e) + (i ? i.text : "") + this.text.slice(t), this.markDirty(), !0);
  }
  split(e) {
    let t = new wt(this.text.slice(e));
    return this.text = this.text.slice(0, e), this.markDirty(), t.flags |= this.flags & 8, t;
  }
  localPosFromDOM(e, t) {
    return e == this.dom ? t : t ? this.text.length : 0;
  }
  domAtPos(e) {
    return new ye(this.dom, e);
  }
  domBoundsAround(e, t, i) {
    return { from: i, to: i + this.length, startDOM: this.dom, endDOM: this.dom.nextSibling };
  }
  coordsAt(e, t) {
    return Ud(this.dom, e, t);
  }
}
class kt extends ee {
  constructor(e, t = [], i = 0) {
    super(), this.mark = e, this.children = t, this.length = i;
    for (let s of t)
      s.setParent(this);
  }
  setAttrs(e) {
    if (Mf(e), this.mark.class && (e.className = this.mark.class), this.mark.attrs)
      for (let t in this.mark.attrs)
        e.setAttribute(t, this.mark.attrs[t]);
    return e;
  }
  canReuseDOM(e) {
    return super.canReuseDOM(e) && !((this.flags | e.flags) & 8);
  }
  reuseDOM(e) {
    e.nodeName == this.mark.tagName.toUpperCase() && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    this.dom ? this.flags & 4 && this.setAttrs(this.dom) : this.setDOM(this.setAttrs(document.createElement(this.mark.tagName))), super.sync(e, t);
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof kt && i.mark.eq(this.mark)) || e && r <= 0 || t < this.length && o <= 0) ? !1 : (Bf(this, e, t, i ? i.children.slice() : [], r - 1, o - 1), this.markDirty(), !0);
  }
  split(e) {
    let t = [], i = 0, s = -1, r = 0;
    for (let l of this.children) {
      let a = i + l.length;
      a > e && t.push(i < e ? l.split(e - i) : l), s < 0 && i >= e && (s = r), i = a, r++;
    }
    let o = this.length - e;
    return this.length = e, s > -1 && (this.children.length = s, this.markDirty()), new kt(this.mark, t, o);
  }
  domAtPos(e) {
    return Ef(this, e);
  }
  coordsAt(e, t) {
    return If(this, e, t);
  }
}
function Ud(n, e, t) {
  let i = n.nodeValue.length;
  e > i && (e = i);
  let s = e, r = e, o = 0;
  e == 0 && t < 0 || e == i && t >= 0 ? D.chrome || D.gecko || (e ? (s--, o = 1) : r < i && (r++, o = -1)) : t < 0 ? s-- : r < i && r++;
  let l = $t(n, s, r).getClientRects();
  if (!l.length)
    return null;
  let a = l[(o ? o < 0 : t >= 0) ? 0 : l.length - 1];
  return D.safari && !o && a.width == 0 && (a = Array.prototype.find.call(l, (h) => h.width) || a), o ? Es(a, o < 0) : a || null;
}
class Ot extends ee {
  static create(e, t, i) {
    return new Ot(e, t, i);
  }
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.side = i, this.prevWidget = null;
  }
  split(e) {
    let t = Ot.create(this.widget, this.length - e, this.side);
    return this.length -= e, t;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  getSide() {
    return this.side;
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof Ot) || !this.widget.compare(i.widget) || e > 0 && r <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  become(e) {
    return e instanceof Ot && e.side == this.side && this.widget.constructor == e.widget.constructor ? (this.widget.compare(e.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get overrideDOMText() {
    if (this.length == 0)
      return J.empty;
    let e = this;
    for (; e.parent; )
      e = e.parent;
    let { view: t } = e, i = t && t.state.doc, s = this.posAtStart;
    return i ? i.slice(s, s + this.length) : J.empty;
  }
  domAtPos(e) {
    return (this.length ? e == 0 : this.side > 0) ? ye.before(this.dom) : ye.after(this.dom, e == this.length);
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e, t) {
    let i = this.widget.coordsAt(this.dom, e, t);
    if (i)
      return i;
    let s = this.dom.getClientRects(), r = null;
    if (!s.length)
      return null;
    let o = this.side ? this.side < 0 : e > 0;
    for (let l = o ? s.length - 1 : 0; r = s[l], !(e > 0 ? l == 0 : l == s.length - 1 || r.top < r.bottom); l += o ? -1 : 1)
      ;
    return Es(r, !o);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  get isHidden() {
    return this.widget.isHidden;
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
}
class Ti extends ee {
  constructor(e) {
    super(), this.side = e;
  }
  get length() {
    return 0;
  }
  merge() {
    return !1;
  }
  become(e) {
    return e instanceof Ti && e.side == this.side;
  }
  split() {
    return new Ti(this.side);
  }
  sync() {
    if (!this.dom) {
      let e = document.createElement("img");
      e.className = "cm-widgetBuffer", e.setAttribute("aria-hidden", "true"), this.setDOM(e);
    }
  }
  getSide() {
    return this.side;
  }
  domAtPos(e) {
    return this.side > 0 ? ye.before(this.dom) : ye.after(this.dom);
  }
  localPosFromDOM() {
    return 0;
  }
  domBoundsAround() {
    return null;
  }
  coordsAt(e) {
    return this.dom.getBoundingClientRect();
  }
  get overrideDOMText() {
    return J.empty;
  }
  get isHidden() {
    return !0;
  }
}
wt.prototype.children = Ot.prototype.children = Ti.prototype.children = No;
function Ef(n, e) {
  let t = n.dom, { children: i } = n, s = 0;
  for (let r = 0; s < i.length; s++) {
    let o = i[s], l = r + o.length;
    if (!(l == r && o.getSide() <= 0)) {
      if (e > r && e < l && o.dom.parentNode == t)
        return o.domAtPos(e - r);
      if (e <= r)
        break;
      r = l;
    }
  }
  for (let r = s; r > 0; r--) {
    let o = i[r - 1];
    if (o.dom.parentNode == t)
      return o.domAtPos(o.length);
  }
  for (let r = s; r < i.length; r++) {
    let o = i[r];
    if (o.dom.parentNode == t)
      return o.domAtPos(0);
  }
  return new ye(t, 0);
}
function Rf(n, e, t) {
  let i, { children: s } = n;
  t > 0 && e instanceof kt && s.length && (i = s[s.length - 1]) instanceof kt && i.mark.eq(e.mark) ? Rf(i, e.children[0], t - 1) : (s.push(e), e.setParent(n)), n.length += e.length;
}
function If(n, e, t) {
  let i = null, s = -1, r = null, o = -1;
  function l(h, f) {
    for (let c = 0, u = 0; c < h.children.length && u <= f; c++) {
      let d = h.children[c], p = u + d.length;
      p >= f && (d.children.length ? l(d, f - u) : (!r || r.isHidden && t > 0) && (p > f || u == p && d.getSide() > 0) ? (r = d, o = f - u) : (u < f || u == p && d.getSide() < 0 && !d.isHidden) && (i = d, s = f - u)), u = p;
    }
  }
  l(n, e);
  let a = (t < 0 ? i : r) || i || r;
  return a ? a.coordsAt(Math.max(0, a == i ? s : o), t) : Gd(n);
}
function Gd(n) {
  let e = n.dom.lastChild;
  if (!e)
    return n.dom.getBoundingClientRect();
  let t = Mi(e);
  return t[t.length - 1] || null;
}
function Qr(n, e) {
  for (let t in n)
    t == "class" && e.class ? e.class += " " + n.class : t == "style" && e.style ? e.style += ";" + n.style : e[t] = n[t];
  return e;
}
const Il = /* @__PURE__ */ Object.create(null);
function Fo(n, e, t) {
  if (n == e)
    return !0;
  n || (n = Il), e || (e = Il);
  let i = Object.keys(n), s = Object.keys(e);
  if (i.length - (t && i.indexOf(t) > -1 ? 1 : 0) != s.length - (t && s.indexOf(t) > -1 ? 1 : 0))
    return !1;
  for (let r of i)
    if (r != t && (s.indexOf(r) == -1 || n[r] !== e[r]))
      return !1;
  return !0;
}
function $r(n, e, t) {
  let i = !1;
  if (e)
    for (let s in e)
      t && s in t || (i = !0, s == "style" ? n.style.cssText = "" : n.removeAttribute(s));
  if (t)
    for (let s in t)
      e && e[s] == t[s] || (i = !0, s == "style" ? n.style.cssText = t[s] : n.setAttribute(s, t[s]));
  return i;
}
function Yd(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t = 0; t < n.attributes.length; t++) {
    let i = n.attributes[t];
    e[i.name] = i.value;
  }
  return e;
}
class he extends ee {
  constructor() {
    super(...arguments), this.children = [], this.length = 0, this.prevAttrs = void 0, this.attrs = null, this.breakAfter = 0;
  }
  // Consumes source
  merge(e, t, i, s, r, o) {
    if (i) {
      if (!(i instanceof he))
        return !1;
      this.dom || i.transferDOM(this);
    }
    return s && this.setDeco(i ? i.attrs : null), Bf(this, e, t, i ? i.children.slice() : [], r, o), !0;
  }
  split(e) {
    let t = new he();
    if (t.breakAfter = this.breakAfter, this.length == 0)
      return t;
    let { i, off: s } = this.childPos(e);
    s && (t.append(this.children[i].split(s), 0), this.children[i].merge(s, this.children[i].length, null, !1, 0, 0), i++);
    for (let r = i; r < this.children.length; r++)
      t.append(this.children[r], 0);
    for (; i > 0 && this.children[i - 1].length == 0; )
      this.children[--i].destroy();
    return this.children.length = i, this.markDirty(), this.length = e, t;
  }
  transferDOM(e) {
    this.dom && (this.markDirty(), e.setDOM(this.dom), e.prevAttrs = this.prevAttrs === void 0 ? this.attrs : this.prevAttrs, this.prevAttrs = void 0, this.dom = null);
  }
  setDeco(e) {
    Fo(this.attrs, e) || (this.dom && (this.prevAttrs = this.attrs, this.markDirty()), this.attrs = e);
  }
  append(e, t) {
    Rf(this, e, t);
  }
  // Only called when building a line view in ContentBuilder
  addLineDeco(e) {
    let t = e.spec.attributes, i = e.spec.class;
    t && (this.attrs = Qr(t, this.attrs || {})), i && (this.attrs = Qr({ class: i }, this.attrs || {}));
  }
  domAtPos(e) {
    return Ef(this, e);
  }
  reuseDOM(e) {
    e.nodeName == "DIV" && (this.setDOM(e), this.flags |= 6);
  }
  sync(e, t) {
    var i;
    this.dom ? this.flags & 4 && (Mf(this.dom), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0) : (this.setDOM(document.createElement("div")), this.dom.className = "cm-line", this.prevAttrs = this.attrs ? null : void 0), this.prevAttrs !== void 0 && ($r(this.dom, this.prevAttrs, this.attrs), this.dom.classList.add("cm-line"), this.prevAttrs = void 0), super.sync(e, t);
    let s = this.dom.lastChild;
    for (; s && ee.get(s) instanceof kt; )
      s = s.lastChild;
    if (!s || !this.length || s.nodeName != "BR" && ((i = ee.get(s)) === null || i === void 0 ? void 0 : i.isEditable) == !1 && (!D.ios || !this.children.some((r) => r instanceof wt))) {
      let r = document.createElement("BR");
      r.cmIgnore = !0, this.dom.appendChild(r);
    }
  }
  measureTextSize() {
    if (this.children.length == 0 || this.length > 20)
      return null;
    let e = 0, t;
    for (let i of this.children) {
      if (!(i instanceof wt) || /[^ -~]/.test(i.text))
        return null;
      let s = Mi(i.dom);
      if (s.length != 1)
        return null;
      e += s[0].width, t = s[0].height;
    }
    return e ? {
      lineHeight: this.dom.getBoundingClientRect().height,
      charWidth: e / this.length,
      textHeight: t
    } : null;
  }
  coordsAt(e, t) {
    let i = If(this, e, t);
    if (!this.children.length && i && this.parent) {
      let { heightOracle: s } = this.parent.view.viewState, r = i.bottom - i.top;
      if (Math.abs(r - s.lineHeight) < 2 && s.textHeight < r) {
        let o = (r - s.textHeight) / 2;
        return { top: i.top + o, bottom: i.bottom - o, left: i.left, right: i.left };
      }
    }
    return i;
  }
  become(e) {
    return !1;
  }
  covers() {
    return !0;
  }
  static find(e, t) {
    for (let i = 0, s = 0; i < e.children.length; i++) {
      let r = e.children[i], o = s + r.length;
      if (o >= t) {
        if (r instanceof he)
          return r;
        if (o > t)
          break;
      }
      s = o + r.breakAfter;
    }
    return null;
  }
}
class Lt extends ee {
  constructor(e, t, i) {
    super(), this.widget = e, this.length = t, this.deco = i, this.breakAfter = 0, this.prevWidget = null;
  }
  merge(e, t, i, s, r, o) {
    return i && (!(i instanceof Lt) || !this.widget.compare(i.widget) || e > 0 && r <= 0 || t < this.length && o <= 0) ? !1 : (this.length = e + (i ? i.length : 0) + (this.length - t), !0);
  }
  domAtPos(e) {
    return e == 0 ? ye.before(this.dom) : ye.after(this.dom, e == this.length);
  }
  split(e) {
    let t = this.length - e;
    this.length = e;
    let i = new Lt(this.widget, t, this.deco);
    return i.breakAfter = this.breakAfter, i;
  }
  get children() {
    return No;
  }
  sync(e) {
    (!this.dom || !this.widget.updateDOM(this.dom, e)) && (this.dom && this.prevWidget && this.prevWidget.destroy(this.dom), this.prevWidget = null, this.setDOM(this.widget.toDOM(e)), this.widget.editable || (this.dom.contentEditable = "false"));
  }
  get overrideDOMText() {
    return this.parent ? this.parent.view.state.doc.slice(this.posAtStart, this.posAtEnd) : J.empty;
  }
  domBoundsAround() {
    return null;
  }
  become(e) {
    return e instanceof Lt && e.widget.constructor == this.widget.constructor ? (e.widget.compare(this.widget) || this.markDirty(!0), this.dom && !this.prevWidget && (this.prevWidget = this.widget), this.widget = e.widget, this.length = e.length, this.deco = e.deco, this.breakAfter = e.breakAfter, !0) : !1;
  }
  ignoreMutation() {
    return !0;
  }
  ignoreEvent(e) {
    return this.widget.ignoreEvent(e);
  }
  get isEditable() {
    return !1;
  }
  get isWidget() {
    return !0;
  }
  coordsAt(e, t) {
    return this.widget.coordsAt(this.dom, e, t);
  }
  destroy() {
    super.destroy(), this.dom && this.widget.destroy(this.dom);
  }
  covers(e) {
    let { startSide: t, endSide: i } = this.deco;
    return t == i ? !1 : e < 0 ? t < 0 : i > 0;
  }
}
class ct {
  /**
  Compare this instance to another instance of the same type.
  (TypeScript can't express this, but only instances of the same
  specific class will be passed to this method.) This is used to
  avoid redrawing widgets when they are replaced by a new
  decoration of the same type. The default implementation just
  returns `false`, which will cause new instances of the widget to
  always be redrawn.
  */
  eq(e) {
    return !1;
  }
  /**
  Update a DOM element created by a widget of the same type (but
  different, non-`eq` content) to reflect this widget. May return
  true to indicate that it could update, false to indicate it
  couldn't (in which case the widget will be redrawn). The default
  implementation just returns false.
  */
  updateDOM(e, t) {
    return !1;
  }
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  The estimated height this widget will have, to be used when
  estimating the height of content that hasn't been drawn. May
  return -1 to indicate you don't know. The default implementation
  returns -1.
  */
  get estimatedHeight() {
    return -1;
  }
  /**
  For inline widgets that are displayed inline (as opposed to
  `inline-block`) and introduce line breaks (through `<br>` tags
  or textual newlines), this must indicate the amount of line
  breaks they introduce. Defaults to 0.
  */
  get lineBreaks() {
    return 0;
  }
  /**
  Can be used to configure which kinds of events inside the widget
  should be ignored by the editor. The default is to ignore all
  events.
  */
  ignoreEvent(e) {
    return !0;
  }
  /**
  Override the way screen coordinates for positions at/in the
  widget are found. `pos` will be the offset into the widget, and
  `side` the side of the position that is being queried—less than
  zero for before, greater than zero for after, and zero for
  directly at that position.
  */
  coordsAt(e, t, i) {
    return null;
  }
  /**
  @internal
  */
  get isHidden() {
    return !1;
  }
  /**
  @internal
  */
  get editable() {
    return !1;
  }
  /**
  This is called when the an instance of the widget is removed
  from the editor view.
  */
  destroy(e) {
  }
}
var Se = /* @__PURE__ */ function(n) {
  return n[n.Text = 0] = "Text", n[n.WidgetBefore = 1] = "WidgetBefore", n[n.WidgetAfter = 2] = "WidgetAfter", n[n.WidgetRange = 3] = "WidgetRange", n;
}(Se || (Se = {}));
class q extends Zt {
  constructor(e, t, i, s) {
    super(), this.startSide = e, this.endSide = t, this.widget = i, this.spec = s;
  }
  /**
  @internal
  */
  get heightRelevant() {
    return !1;
  }
  /**
  Create a mark decoration, which influences the styling of the
  content in its range. Nested mark decorations will cause nested
  DOM elements to be created. Nesting order is determined by
  precedence of the [facet](https://codemirror.net/6/docs/ref/#view.EditorView^decorations), with
  the higher-precedence decorations creating the inner DOM nodes.
  Such elements are split on line boundaries and on the boundaries
  of lower-precedence decorations.
  */
  static mark(e) {
    return new xn(e);
  }
  /**
  Create a widget decoration, which displays a DOM element at the
  given position.
  */
  static widget(e) {
    let t = Math.max(-1e4, Math.min(1e4, e.side || 0)), i = !!e.block;
    return t += i && !e.inlineOrder ? t > 0 ? 3e8 : -4e8 : t > 0 ? 1e8 : -1e8, new It(e, t, t, i, e.widget || null, !1);
  }
  /**
  Create a replace decoration which replaces the given range with
  a widget, or simply hides it.
  */
  static replace(e) {
    let t = !!e.block, i, s;
    if (e.isBlockGap)
      i = -5e8, s = 4e8;
    else {
      let { start: r, end: o } = Nf(e, t);
      i = (r ? t ? -3e8 : -1 : 5e8) - 1, s = (o ? t ? 2e8 : 1 : -6e8) + 1;
    }
    return new It(e, i, s, t, e.widget || null, !0);
  }
  /**
  Create a line decoration, which can add DOM attributes to the
  line starting at the given position.
  */
  static line(e) {
    return new Sn(e);
  }
  /**
  Build a [`DecorationSet`](https://codemirror.net/6/docs/ref/#view.DecorationSet) from the given
  decorated range or ranges. If the ranges aren't already sorted,
  pass `true` for `sort` to make the library sort them for you.
  */
  static set(e, t = !1) {
    return Y.of(e, t);
  }
  /**
  @internal
  */
  hasHeight() {
    return this.widget ? this.widget.estimatedHeight > -1 : !1;
  }
}
q.none = Y.empty;
class xn extends q {
  constructor(e) {
    let { start: t, end: i } = Nf(e);
    super(t ? -1 : 5e8, i ? 1 : -6e8, null, e), this.tagName = e.tagName || "span", this.class = e.class || "", this.attrs = e.attributes || null;
  }
  eq(e) {
    var t, i;
    return this == e || e instanceof xn && this.tagName == e.tagName && (this.class || ((t = this.attrs) === null || t === void 0 ? void 0 : t.class)) == (e.class || ((i = e.attrs) === null || i === void 0 ? void 0 : i.class)) && Fo(this.attrs, e.attrs, "class");
  }
  range(e, t = e) {
    if (e >= t)
      throw new RangeError("Mark decorations may not be empty");
    return super.range(e, t);
  }
}
xn.prototype.point = !1;
class Sn extends q {
  constructor(e) {
    super(-2e8, -2e8, null, e);
  }
  eq(e) {
    return e instanceof Sn && this.spec.class == e.spec.class && Fo(this.spec.attributes, e.spec.attributes);
  }
  range(e, t = e) {
    if (t != e)
      throw new RangeError("Line decoration ranges must be zero-length");
    return super.range(e, t);
  }
}
Sn.prototype.mapMode = me.TrackBefore;
Sn.prototype.point = !0;
class It extends q {
  constructor(e, t, i, s, r, o) {
    super(t, i, r, e), this.block = s, this.isReplace = o, this.mapMode = s ? t <= 0 ? me.TrackBefore : me.TrackAfter : me.TrackDel;
  }
  // Only relevant when this.block == true
  get type() {
    return this.startSide != this.endSide ? Se.WidgetRange : this.startSide <= 0 ? Se.WidgetBefore : Se.WidgetAfter;
  }
  get heightRelevant() {
    return this.block || !!this.widget && (this.widget.estimatedHeight >= 5 || this.widget.lineBreaks > 0);
  }
  eq(e) {
    return e instanceof It && Jd(this.widget, e.widget) && this.block == e.block && this.startSide == e.startSide && this.endSide == e.endSide;
  }
  range(e, t = e) {
    if (this.isReplace && (e > t || e == t && this.startSide > 0 && this.endSide <= 0))
      throw new RangeError("Invalid range for replacement decoration");
    if (!this.isReplace && t != e)
      throw new RangeError("Widget decorations can only have zero-length ranges");
    return super.range(e, t);
  }
}
It.prototype.point = !0;
function Nf(n, e = !1) {
  let { inclusiveStart: t, inclusiveEnd: i } = n;
  return t == null && (t = n.inclusive), i == null && (i = n.inclusive), { start: t ?? e, end: i ?? e };
}
function Jd(n, e) {
  return n == e || !!(n && e && n.compare(e));
}
function eo(n, e, t, i = 0) {
  let s = t.length - 1;
  s >= 0 && t[s] + i >= n ? t[s] = Math.max(t[s], e) : t.push(n, e);
}
class sn {
  constructor(e, t, i, s) {
    this.doc = e, this.pos = t, this.end = i, this.disallowBlockEffectsFor = s, this.content = [], this.curLine = null, this.breakAtStart = 0, this.pendingBuffer = 0, this.bufferMarks = [], this.atCursorPos = !0, this.openStart = -1, this.openEnd = -1, this.text = "", this.textOff = 0, this.cursor = e.iter(), this.skip = t;
  }
  posCovered() {
    if (this.content.length == 0)
      return !this.breakAtStart && this.doc.lineAt(this.pos).from != this.pos;
    let e = this.content[this.content.length - 1];
    return !(e.breakAfter || e instanceof Lt && e.deco.endSide < 0);
  }
  getLine() {
    return this.curLine || (this.content.push(this.curLine = new he()), this.atCursorPos = !0), this.curLine;
  }
  flushBuffer(e = this.bufferMarks) {
    this.pendingBuffer && (this.curLine.append(Bn(new Ti(-1), e), e.length), this.pendingBuffer = 0);
  }
  addBlockWidget(e) {
    this.flushBuffer(), this.curLine = null, this.content.push(e);
  }
  finish(e) {
    this.pendingBuffer && e <= this.bufferMarks.length ? this.flushBuffer() : this.pendingBuffer = 0, !this.posCovered() && !(e && this.content.length && this.content[this.content.length - 1] instanceof Lt) && this.getLine();
  }
  buildText(e, t, i) {
    for (; e > 0; ) {
      if (this.textOff == this.text.length) {
        let { value: r, lineBreak: o, done: l } = this.cursor.next(this.skip);
        if (this.skip = 0, l)
          throw new Error("Ran out of text content when drawing inline views");
        if (o) {
          this.posCovered() || this.getLine(), this.content.length ? this.content[this.content.length - 1].breakAfter = 1 : this.breakAtStart = 1, this.flushBuffer(), this.curLine = null, this.atCursorPos = !0, e--;
          continue;
        } else
          this.text = r, this.textOff = 0;
      }
      let s = Math.min(
        this.text.length - this.textOff,
        e,
        512
        /* T.Chunk */
      );
      this.flushBuffer(t.slice(t.length - i)), this.getLine().append(Bn(new wt(this.text.slice(this.textOff, this.textOff + s)), t), i), this.atCursorPos = !0, this.textOff += s, e -= s, i = 0;
    }
  }
  span(e, t, i, s) {
    this.buildText(t - e, i, s), this.pos = t, this.openStart < 0 && (this.openStart = s);
  }
  point(e, t, i, s, r, o) {
    if (this.disallowBlockEffectsFor[o] && i instanceof It) {
      if (i.block)
        throw new RangeError("Block decorations may not be specified via plugins");
      if (t > this.doc.lineAt(this.pos).to)
        throw new RangeError("Decorations that replace line breaks may not be specified via plugins");
    }
    let l = t - e;
    if (i instanceof It)
      if (i.block)
        i.startSide > 0 && !this.posCovered() && this.getLine(), this.addBlockWidget(new Lt(i.widget || new Nl("div"), l, i));
      else {
        let a = Ot.create(i.widget || new Nl("span"), l, l ? 0 : i.startSide), h = this.atCursorPos && !a.isEditable && r <= s.length && (e < t || i.startSide > 0), f = !a.isEditable && (e < t || r > s.length || i.startSide <= 0), c = this.getLine();
        this.pendingBuffer == 2 && !h && !a.isEditable && (this.pendingBuffer = 0), this.flushBuffer(s), h && (c.append(Bn(new Ti(1), s), r), r = s.length + Math.max(0, r - s.length)), c.append(Bn(a, s), r), this.atCursorPos = f, this.pendingBuffer = f ? e < t || r > s.length ? 1 : 2 : 0, this.pendingBuffer && (this.bufferMarks = s.slice());
      }
    else
      this.doc.lineAt(this.pos).from == this.pos && this.getLine().addLineDeco(i);
    l && (this.textOff + l <= this.text.length ? this.textOff += l : (this.skip += l - (this.text.length - this.textOff), this.text = "", this.textOff = 0), this.pos = t), this.openStart < 0 && (this.openStart = r);
  }
  static build(e, t, i, s, r) {
    let o = new sn(e, t, i, r);
    return o.openEnd = Y.spans(s, t, i, o), o.openStart < 0 && (o.openStart = o.openEnd), o.finish(o.openEnd), o;
  }
}
function Bn(n, e) {
  for (let t of e)
    n = new kt(t, [n], n.length);
  return n;
}
class Nl extends ct {
  constructor(e) {
    super(), this.tag = e;
  }
  eq(e) {
    return e.tag == this.tag;
  }
  toDOM() {
    return document.createElement(this.tag);
  }
  updateDOM(e) {
    return e.nodeName.toLowerCase() == this.tag;
  }
  get isHidden() {
    return !0;
  }
}
var te = /* @__PURE__ */ function(n) {
  return n[n.LTR = 0] = "LTR", n[n.RTL = 1] = "RTL", n;
}(te || (te = {}));
const ei = te.LTR, Ho = te.RTL;
function Ff(n) {
  let e = [];
  for (let t = 0; t < n.length; t++)
    e.push(1 << +n[t]);
  return e;
}
const Xd = /* @__PURE__ */ Ff("88888888888888888888888888888888888666888888787833333333337888888000000000000000000000000008888880000000000000000000000000088888888888888888888888888888888888887866668888088888663380888308888800000000000000000000000800000000000000000000000000000008"), Zd = /* @__PURE__ */ Ff("4444448826627288999999999992222222222222222222222222222222222222222222222229999999999999999999994444444444644222822222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222222999999949999999229989999223333333333"), to = /* @__PURE__ */ Object.create(null), Je = [];
for (let n of ["()", "[]", "{}"]) {
  let e = /* @__PURE__ */ n.charCodeAt(0), t = /* @__PURE__ */ n.charCodeAt(1);
  to[e] = t, to[t] = -e;
}
function Hf(n) {
  return n <= 247 ? Xd[n] : 1424 <= n && n <= 1524 ? 2 : 1536 <= n && n <= 1785 ? Zd[n - 1536] : 1774 <= n && n <= 2220 ? 4 : 8192 <= n && n <= 8204 ? 256 : 64336 <= n && n <= 65023 ? 4 : 1;
}
const Qd = /[\u0590-\u05f4\u0600-\u06ff\u0700-\u08ac\ufb50-\ufdff]/;
class Bt {
  /**
  The direction of this span.
  */
  get dir() {
    return this.level % 2 ? Ho : ei;
  }
  /**
  @internal
  */
  constructor(e, t, i) {
    this.from = e, this.to = t, this.level = i;
  }
  /**
  @internal
  */
  side(e, t) {
    return this.dir == t == e ? this.to : this.from;
  }
  /**
  @internal
  */
  forward(e, t) {
    return e == (this.dir == t);
  }
  /**
  @internal
  */
  static find(e, t, i, s) {
    let r = -1;
    for (let o = 0; o < e.length; o++) {
      let l = e[o];
      if (l.from <= t && l.to >= t) {
        if (l.level == i)
          return o;
        (r < 0 || (s != 0 ? s < 0 ? l.from < t : l.to > t : e[r].level > l.level)) && (r = o);
      }
    }
    if (r < 0)
      throw new RangeError("Index out of range");
    return r;
  }
}
function Vf(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++) {
    let i = n[t], s = e[t];
    if (i.from != s.from || i.to != s.to || i.direction != s.direction || !Vf(i.inner, s.inner))
      return !1;
  }
  return !0;
}
const X = [];
function $d(n, e, t, i, s) {
  for (let r = 0; r <= i.length; r++) {
    let o = r ? i[r - 1].to : e, l = r < i.length ? i[r].from : t, a = r ? 256 : s;
    for (let h = o, f = a, c = a; h < l; h++) {
      let u = Hf(n.charCodeAt(h));
      u == 512 ? u = f : u == 8 && c == 4 && (u = 16), X[h] = u == 4 ? 2 : u, u & 7 && (c = u), f = u;
    }
    for (let h = o, f = a, c = a; h < l; h++) {
      let u = X[h];
      if (u == 128)
        h < l - 1 && f == X[h + 1] && f & 24 ? u = X[h] = f : X[h] = 256;
      else if (u == 64) {
        let d = h + 1;
        for (; d < l && X[d] == 64; )
          d++;
        let p = h && f == 8 || d < t && X[d] == 8 ? c == 1 ? 1 : 8 : 256;
        for (let m = h; m < d; m++)
          X[m] = p;
        h = d - 1;
      } else
        u == 8 && c == 1 && (X[h] = 1);
      f = u, u & 7 && (c = u);
    }
  }
}
function ep(n, e, t, i, s) {
  let r = s == 1 ? 2 : 1;
  for (let o = 0, l = 0, a = 0; o <= i.length; o++) {
    let h = o ? i[o - 1].to : e, f = o < i.length ? i[o].from : t;
    for (let c = h, u, d, p; c < f; c++)
      if (d = to[u = n.charCodeAt(c)])
        if (d < 0) {
          for (let m = l - 3; m >= 0; m -= 3)
            if (Je[m + 1] == -d) {
              let g = Je[m + 2], y = g & 2 ? s : g & 4 ? g & 1 ? r : s : 0;
              y && (X[c] = X[Je[m]] = y), l = m;
              break;
            }
        } else {
          if (Je.length == 189)
            break;
          Je[l++] = c, Je[l++] = u, Je[l++] = a;
        }
      else if ((p = X[c]) == 2 || p == 1) {
        let m = p == s;
        a = m ? 0 : 1;
        for (let g = l - 3; g >= 0; g -= 3) {
          let y = Je[g + 2];
          if (y & 2)
            break;
          if (m)
            Je[g + 2] |= 2;
          else {
            if (y & 4)
              break;
            Je[g + 2] |= 4;
          }
        }
      }
  }
}
function tp(n, e, t, i) {
  for (let s = 0, r = i; s <= t.length; s++) {
    let o = s ? t[s - 1].to : n, l = s < t.length ? t[s].from : e;
    for (let a = o; a < l; ) {
      let h = X[a];
      if (h == 256) {
        let f = a + 1;
        for (; ; )
          if (f == l) {
            if (s == t.length)
              break;
            f = t[s++].to, l = s < t.length ? t[s].from : e;
          } else if (X[f] == 256)
            f++;
          else
            break;
        let c = r == 1, u = (f < e ? X[f] : i) == 1, d = c == u ? c ? 1 : 2 : i;
        for (let p = f, m = s, g = m ? t[m - 1].to : n; p > a; )
          p == g && (p = t[--m].from, g = m ? t[m - 1].to : n), X[--p] = d;
        a = f;
      } else
        r = h, a++;
    }
  }
}
function io(n, e, t, i, s, r, o) {
  let l = i % 2 ? 2 : 1;
  if (i % 2 == s % 2)
    for (let a = e, h = 0; a < t; ) {
      let f = !0, c = !1;
      if (h == r.length || a < r[h].from) {
        let m = X[a];
        m != l && (f = !1, c = m == 16);
      }
      let u = !f && l == 1 ? [] : null, d = f ? i : i + 1, p = a;
      e:
        for (; ; )
          if (h < r.length && p == r[h].from) {
            if (c)
              break e;
            let m = r[h];
            if (!f)
              for (let g = m.to, y = h + 1; ; ) {
                if (g == t)
                  break e;
                if (y < r.length && r[y].from == g)
                  g = r[y++].to;
                else {
                  if (X[g] == l)
                    break e;
                  break;
                }
              }
            if (h++, u)
              u.push(m);
            else {
              m.from > a && o.push(new Bt(a, m.from, d));
              let g = m.direction == ei != !(d % 2);
              no(n, g ? i + 1 : i, s, m.inner, m.from, m.to, o), a = m.to;
            }
            p = m.to;
          } else {
            if (p == t || (f ? X[p] != l : X[p] == l))
              break;
            p++;
          }
      u ? io(n, a, p, i + 1, s, u, o) : a < p && o.push(new Bt(a, p, d)), a = p;
    }
  else
    for (let a = t, h = r.length; a > e; ) {
      let f = !0, c = !1;
      if (!h || a > r[h - 1].to) {
        let m = X[a - 1];
        m != l && (f = !1, c = m == 16);
      }
      let u = !f && l == 1 ? [] : null, d = f ? i : i + 1, p = a;
      e:
        for (; ; )
          if (h && p == r[h - 1].to) {
            if (c)
              break e;
            let m = r[--h];
            if (!f)
              for (let g = m.from, y = h; ; ) {
                if (g == e)
                  break e;
                if (y && r[y - 1].to == g)
                  g = r[--y].from;
                else {
                  if (X[g - 1] == l)
                    break e;
                  break;
                }
              }
            if (u)
              u.push(m);
            else {
              m.to < a && o.push(new Bt(m.to, a, d));
              let g = m.direction == ei != !(d % 2);
              no(n, g ? i + 1 : i, s, m.inner, m.from, m.to, o), a = m.from;
            }
            p = m.from;
          } else {
            if (p == e || (f ? X[p - 1] != l : X[p - 1] == l))
              break;
            p--;
          }
      u ? io(n, p, a, i + 1, s, u, o) : p < a && o.push(new Bt(p, a, d)), a = p;
    }
}
function no(n, e, t, i, s, r, o) {
  let l = e % 2 ? 2 : 1;
  $d(n, s, r, i, l), ep(n, s, r, i, l), tp(s, r, i, l), io(n, s, r, e, t, i, o);
}
function ip(n, e, t) {
  if (!n)
    return [new Bt(0, 0, e == Ho ? 1 : 0)];
  if (e == ei && !t.length && !Qd.test(n))
    return Wf(n.length);
  if (t.length)
    for (; n.length > X.length; )
      X[X.length] = 256;
  let i = [], s = e == ei ? 0 : 1;
  return no(n, s, s, t, 0, n.length, i), i;
}
function Wf(n) {
  return [new Bt(0, n, 0)];
}
let zf = "";
function np(n, e, t, i, s) {
  var r;
  let o = i.head - n.from, l = Bt.find(e, o, (r = i.bidiLevel) !== null && r !== void 0 ? r : -1, i.assoc), a = e[l], h = a.side(s, t);
  if (o == h) {
    let u = l += s ? 1 : -1;
    if (u < 0 || u >= e.length)
      return null;
    a = e[l = u], o = a.side(!s, t), h = a.side(s, t);
  }
  let f = xe(n.text, o, a.forward(s, t));
  (f < a.from || f > a.to) && (f = h), zf = n.text.slice(Math.min(o, f), Math.max(o, f));
  let c = l == (s ? e.length - 1 : 0) ? null : e[l + (s ? 1 : -1)];
  return c && f == h && c.level + (s ? 0 : 1) < a.level ? C.cursor(c.side(!s, t) + n.from, c.forward(s, t) ? 1 : -1, c.level) : C.cursor(f + n.from, a.forward(s, t) ? -1 : 1, a.level);
}
function sp(n, e, t) {
  for (let i = e; i < t; i++) {
    let s = Hf(n.charCodeAt(i));
    if (s == 1)
      return ei;
    if (s == 2 || s == 4)
      return Ho;
  }
  return ei;
}
const qf = /* @__PURE__ */ O.define(), jf = /* @__PURE__ */ O.define(), Kf = /* @__PURE__ */ O.define(), Uf = /* @__PURE__ */ O.define(), so = /* @__PURE__ */ O.define(), Gf = /* @__PURE__ */ O.define(), Yf = /* @__PURE__ */ O.define(), Jf = /* @__PURE__ */ O.define({
  combine: (n) => n.some((e) => e)
}), Xf = /* @__PURE__ */ O.define({
  combine: (n) => n.some((e) => e)
});
class Si {
  constructor(e, t = "nearest", i = "nearest", s = 5, r = 5, o = !1) {
    this.range = e, this.y = t, this.x = i, this.yMargin = s, this.xMargin = r, this.isSnapshot = o;
  }
  map(e) {
    return e.empty ? this : new Si(this.range.map(e), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
  clip(e) {
    return this.range.to <= e.doc.length ? this : new Si(C.cursor(e.doc.length), this.y, this.x, this.yMargin, this.xMargin, this.isSnapshot);
  }
}
const Pn = /* @__PURE__ */ z.define({ map: (n, e) => n.map(e) });
function ft(n, e, t) {
  let i = n.facet(Uf);
  i.length ? i[0](e) : window.onerror ? window.onerror(String(e), t, void 0, void 0, e) : t ? console.error(t + ":", e) : console.error(e);
}
const Is = /* @__PURE__ */ O.define({ combine: (n) => n.length ? n[0] : !0 });
let rp = 0;
const Ji = /* @__PURE__ */ O.define();
class ke {
  constructor(e, t, i, s, r) {
    this.id = e, this.create = t, this.domEventHandlers = i, this.domEventObservers = s, this.extension = r(this);
  }
  /**
  Define a plugin from a constructor function that creates the
  plugin's value, given an editor view.
  */
  static define(e, t) {
    const { eventHandlers: i, eventObservers: s, provide: r, decorations: o } = t || {};
    return new ke(rp++, e, i, s, (l) => {
      let a = [Ji.of(l)];
      return o && a.push(dn.of((h) => {
        let f = h.plugin(l);
        return f ? o(f) : q.none;
      })), r && a.push(r(l)), a;
    });
  }
  /**
  Create a plugin for a class whose constructor takes a single
  editor view as argument.
  */
  static fromClass(e, t) {
    return ke.define((i) => new e(i), t);
  }
}
class $s {
  constructor(e) {
    this.spec = e, this.mustUpdate = null, this.value = null;
  }
  update(e) {
    if (this.value) {
      if (this.mustUpdate) {
        let t = this.mustUpdate;
        if (this.mustUpdate = null, this.value.update)
          try {
            this.value.update(t);
          } catch (i) {
            if (ft(t.state, i, "CodeMirror plugin crashed"), this.value.destroy)
              try {
                this.value.destroy();
              } catch {
              }
            this.deactivate();
          }
      }
    } else if (this.spec)
      try {
        this.value = this.spec.create(e);
      } catch (t) {
        ft(e.state, t, "CodeMirror plugin crashed"), this.deactivate();
      }
    return this;
  }
  destroy(e) {
    var t;
    if (!((t = this.value) === null || t === void 0) && t.destroy)
      try {
        this.value.destroy();
      } catch (i) {
        ft(e.state, i, "CodeMirror plugin crashed");
      }
  }
  deactivate() {
    this.spec = this.value = null;
  }
}
const Zf = /* @__PURE__ */ O.define(), Vo = /* @__PURE__ */ O.define(), dn = /* @__PURE__ */ O.define(), Qf = /* @__PURE__ */ O.define(), Wo = /* @__PURE__ */ O.define(), $f = /* @__PURE__ */ O.define();
function Fl(n, e) {
  let t = n.state.facet($f);
  if (!t.length)
    return t;
  let i = t.map((r) => r instanceof Function ? r(n) : r), s = [];
  return Y.spans(i, e.from, e.to, {
    point() {
    },
    span(r, o, l, a) {
      let h = r - e.from, f = o - e.from, c = s;
      for (let u = l.length - 1; u >= 0; u--, a--) {
        let d = l[u].spec.bidiIsolate, p;
        if (d == null && (d = sp(e.text, h, f)), a > 0 && c.length && (p = c[c.length - 1]).to == h && p.direction == d)
          p.to = f, c = p.inner;
        else {
          let m = { from: h, to: f, direction: d, inner: [] };
          c.push(m), c = m.inner;
        }
      }
    }
  }), s;
}
const ec = /* @__PURE__ */ O.define();
function tc(n) {
  let e = 0, t = 0, i = 0, s = 0;
  for (let r of n.state.facet(ec)) {
    let o = r(n);
    o && (o.left != null && (e = Math.max(e, o.left)), o.right != null && (t = Math.max(t, o.right)), o.top != null && (i = Math.max(i, o.top)), o.bottom != null && (s = Math.max(s, o.bottom)));
  }
  return { left: e, right: t, top: i, bottom: s };
}
const Xi = /* @__PURE__ */ O.define();
class Fe {
  constructor(e, t, i, s) {
    this.fromA = e, this.toA = t, this.fromB = i, this.toB = s;
  }
  join(e) {
    return new Fe(Math.min(this.fromA, e.fromA), Math.max(this.toA, e.toA), Math.min(this.fromB, e.fromB), Math.max(this.toB, e.toB));
  }
  addToSet(e) {
    let t = e.length, i = this;
    for (; t > 0; t--) {
      let s = e[t - 1];
      if (!(s.fromA > i.toA)) {
        if (s.toA < i.fromA)
          break;
        i = i.join(s), e.splice(t - 1, 1);
      }
    }
    return e.splice(t, 0, i), e;
  }
  static extendWithRanges(e, t) {
    if (t.length == 0)
      return e;
    let i = [];
    for (let s = 0, r = 0, o = 0, l = 0; ; s++) {
      let a = s == e.length ? null : e[s], h = o - l, f = a ? a.fromB : 1e9;
      for (; r < t.length && t[r] < f; ) {
        let c = t[r], u = t[r + 1], d = Math.max(l, c), p = Math.min(f, u);
        if (d <= p && new Fe(d + h, p + h, d, p).addToSet(i), u > f)
          break;
        r += 2;
      }
      if (!a)
        return i;
      new Fe(a.fromA, a.toA, a.fromB, a.toB).addToSet(i), o = a.toA, l = a.toB;
    }
  }
}
class bs {
  constructor(e, t, i) {
    this.view = e, this.state = t, this.transactions = i, this.flags = 0, this.startState = e.state, this.changes = fe.empty(this.startState.doc.length);
    for (let r of i)
      this.changes = this.changes.compose(r.changes);
    let s = [];
    this.changes.iterChangedRanges((r, o, l, a) => s.push(new Fe(r, o, l, a))), this.changedRanges = s;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new bs(e, t, i);
  }
  /**
  Tells you whether the [viewport](https://codemirror.net/6/docs/ref/#view.EditorView.viewport) or
  [visible ranges](https://codemirror.net/6/docs/ref/#view.EditorView.visibleRanges) changed in this
  update.
  */
  get viewportChanged() {
    return (this.flags & 4) > 0;
  }
  /**
  Indicates whether the height of a block element in the editor
  changed in this update.
  */
  get heightChanged() {
    return (this.flags & 2) > 0;
  }
  /**
  Returns true when the document was modified or the size of the
  editor, or elements within the editor, changed.
  */
  get geometryChanged() {
    return this.docChanged || (this.flags & 10) > 0;
  }
  /**
  True when this update indicates a focus change.
  */
  get focusChanged() {
    return (this.flags & 1) > 0;
  }
  /**
  Whether the document changed in this update.
  */
  get docChanged() {
    return !this.changes.empty;
  }
  /**
  Whether the selection was explicitly set in this update.
  */
  get selectionSet() {
    return this.transactions.some((e) => e.selection);
  }
  /**
  @internal
  */
  get empty() {
    return this.flags == 0 && this.transactions.length == 0;
  }
}
class Hl extends ee {
  get length() {
    return this.view.state.doc.length;
  }
  constructor(e) {
    super(), this.view = e, this.decorations = [], this.dynamicDecorationMap = [], this.domChanged = null, this.hasComposition = null, this.markedForComposition = /* @__PURE__ */ new Set(), this.minWidth = 0, this.minWidthFrom = 0, this.minWidthTo = 0, this.impreciseAnchor = null, this.impreciseHead = null, this.forceSelection = !1, this.lastUpdate = Date.now(), this.setDOM(e.contentDOM), this.children = [new he()], this.children[0].setParent(this), this.updateDeco(), this.updateInner([new Fe(0, 0, 0, e.state.doc.length)], 0, null);
  }
  // Update the document view to a given state.
  update(e) {
    var t;
    let i = e.changedRanges;
    this.minWidth > 0 && i.length && (i.every(({ fromA: h, toA: f }) => f < this.minWidthFrom || h > this.minWidthTo) ? (this.minWidthFrom = e.changes.mapPos(this.minWidthFrom, 1), this.minWidthTo = e.changes.mapPos(this.minWidthTo, 1)) : this.minWidth = this.minWidthFrom = this.minWidthTo = 0);
    let s = -1;
    this.view.inputState.composing >= 0 && (!((t = this.domChanged) === null || t === void 0) && t.newSel ? s = this.domChanged.newSel.head : !up(e.changes, this.hasComposition) && !e.selectionSet && (s = e.state.selection.main.head));
    let r = s > -1 ? lp(this.view, e.changes, s) : null;
    if (this.domChanged = null, this.hasComposition) {
      this.markedForComposition.clear();
      let { from: h, to: f } = this.hasComposition;
      i = new Fe(h, f, e.changes.mapPos(h, -1), e.changes.mapPos(f, 1)).addToSet(i.slice());
    }
    this.hasComposition = r ? { from: r.range.fromB, to: r.range.toB } : null, (D.ie || D.chrome) && !r && e && e.state.doc.lines != e.startState.doc.lines && (this.forceSelection = !0);
    let o = this.decorations, l = this.updateDeco(), a = fp(o, l, e.changes);
    return i = Fe.extendWithRanges(i, a), !(this.flags & 7) && i.length == 0 ? !1 : (this.updateInner(i, e.startState.doc.length, r), e.transactions.length && (this.lastUpdate = Date.now()), !0);
  }
  // Used by update and the constructor do perform the actual DOM
  // update
  updateInner(e, t, i) {
    this.view.viewState.mustMeasureContent = !0, this.updateChildren(e, t, i);
    let { observer: s } = this.view;
    s.ignore(() => {
      this.dom.style.height = this.view.viewState.contentHeight / this.view.scaleY + "px", this.dom.style.flexBasis = this.minWidth ? this.minWidth + "px" : "";
      let o = D.chrome || D.ios ? { node: s.selectionRange.focusNode, written: !1 } : void 0;
      this.sync(this.view, o), this.flags &= -8, o && (o.written || s.selectionRange.focusNode != o.node) && (this.forceSelection = !0), this.dom.style.height = "";
    }), this.markedForComposition.forEach(
      (o) => o.flags &= -9
      /* ViewFlag.Composition */
    );
    let r = [];
    if (this.view.viewport.from || this.view.viewport.to < this.view.state.doc.length)
      for (let o of this.children)
        o instanceof Lt && o.widget instanceof Vl && r.push(o.dom);
    s.updateGaps(r);
  }
  updateChildren(e, t, i) {
    let s = i ? i.range.addToSet(e.slice()) : e, r = this.childCursor(t);
    for (let o = s.length - 1; ; o--) {
      let l = o >= 0 ? s[o] : null;
      if (!l)
        break;
      let { fromA: a, toA: h, fromB: f, toB: c } = l, u, d, p, m;
      if (i && i.range.fromB < c && i.range.toB > f) {
        let S = sn.build(this.view.state.doc, f, i.range.fromB, this.decorations, this.dynamicDecorationMap), _ = sn.build(this.view.state.doc, i.range.toB, c, this.decorations, this.dynamicDecorationMap);
        d = S.breakAtStart, p = S.openStart, m = _.openEnd;
        let v = this.compositionView(i);
        _.breakAtStart ? v.breakAfter = 1 : _.content.length && v.merge(v.length, v.length, _.content[0], !1, _.openStart, 0) && (v.breakAfter = _.content[0].breakAfter, _.content.shift()), S.content.length && v.merge(0, 0, S.content[S.content.length - 1], !0, 0, S.openEnd) && S.content.pop(), u = S.content.concat(v).concat(_.content);
      } else
        ({ content: u, breakAtStart: d, openStart: p, openEnd: m } = sn.build(this.view.state.doc, f, c, this.decorations, this.dynamicDecorationMap));
      let { i: g, off: y } = r.findPos(h, 1), { i: k, off: w } = r.findPos(a, -1);
      Of(this, k, w, g, y, u, d, p, m);
    }
    i && this.fixCompositionDOM(i);
  }
  compositionView(e) {
    let t = new wt(e.text.nodeValue);
    t.flags |= 8;
    for (let { deco: s } of e.marks)
      t = new kt(s, [t], t.length);
    let i = new he();
    return i.append(t, 0), i;
  }
  fixCompositionDOM(e) {
    let t = (r, o) => {
      o.flags |= 8 | (o.children.some(
        (a) => a.flags & 7
        /* ViewFlag.Dirty */
      ) ? 1 : 0), this.markedForComposition.add(o);
      let l = ee.get(r);
      l && l != o && (l.dom = null), o.setDOM(r);
    }, i = this.childPos(e.range.fromB, 1), s = this.children[i.i];
    t(e.line, s);
    for (let r = e.marks.length - 1; r >= -1; r--)
      i = s.childPos(i.off, 1), s = s.children[i.i], t(r >= 0 ? e.marks[r].node : e.text, s);
  }
  // Sync the DOM selection to this.state.selection
  updateSelection(e = !1, t = !1) {
    (e || !this.view.observer.selectionRange.focusNode) && this.view.observer.readSelectionRange();
    let i = this.view.root.activeElement, s = i == this.dom, r = !s && ns(this.dom, this.view.observer.selectionRange) && !(i && this.dom.contains(i));
    if (!(s || t || r))
      return;
    let o = this.forceSelection;
    this.forceSelection = !1;
    let l = this.view.state.selection.main, a = this.moveToLine(this.domAtPos(l.anchor)), h = l.empty ? a : this.moveToLine(this.domAtPos(l.head));
    if (D.gecko && l.empty && !this.hasComposition && op(a)) {
      let c = document.createTextNode("");
      this.view.observer.ignore(() => a.node.insertBefore(c, a.node.childNodes[a.offset] || null)), a = h = new ye(c, 0), o = !0;
    }
    let f = this.view.observer.selectionRange;
    (o || !f.focusNode || (!nn(a.node, a.offset, f.anchorNode, f.anchorOffset) || !nn(h.node, h.offset, f.focusNode, f.focusOffset)) && !this.suppressWidgetCursorChange(f, l)) && (this.view.observer.ignore(() => {
      D.android && D.chrome && this.dom.contains(f.focusNode) && cp(f.focusNode, this.dom) && (this.dom.blur(), this.dom.focus({ preventScroll: !0 }));
      let c = gs(this.view.root);
      if (c)
        if (l.empty) {
          if (D.gecko) {
            let u = ap(a.node, a.offset);
            if (u && u != 3) {
              let d = nc(a.node, a.offset, u == 1 ? 1 : -1);
              d && (a = new ye(d.node, d.offset));
            }
          }
          c.collapse(a.node, a.offset), l.bidiLevel != null && c.caretBidiLevel !== void 0 && (c.caretBidiLevel = l.bidiLevel);
        } else if (c.extend) {
          c.collapse(a.node, a.offset);
          try {
            c.extend(h.node, h.offset);
          } catch {
          }
        } else {
          let u = document.createRange();
          l.anchor > l.head && ([a, h] = [h, a]), u.setEnd(h.node, h.offset), u.setStart(a.node, a.offset), c.removeAllRanges(), c.addRange(u);
        }
      r && this.view.root.activeElement == this.dom && (this.dom.blur(), i && i.focus());
    }), this.view.observer.setSelectionRange(a, h)), this.impreciseAnchor = a.precise ? null : new ye(f.anchorNode, f.anchorOffset), this.impreciseHead = h.precise ? null : new ye(f.focusNode, f.focusOffset);
  }
  // If a zero-length widget is inserted next to the cursor during
  // composition, avoid moving it across it and disrupting the
  // composition.
  suppressWidgetCursorChange(e, t) {
    return this.hasComposition && t.empty && nn(e.focusNode, e.focusOffset, e.anchorNode, e.anchorOffset) && this.posFromDOM(e.focusNode, e.focusOffset) == t.head;
  }
  enforceCursorAssoc() {
    if (this.hasComposition)
      return;
    let { view: e } = this, t = e.state.selection.main, i = gs(e.root), { anchorNode: s, anchorOffset: r } = e.observer.selectionRange;
    if (!i || !t.empty || !t.assoc || !i.modify)
      return;
    let o = he.find(this, t.head);
    if (!o)
      return;
    let l = o.posAtStart;
    if (t.head == l || t.head == l + o.length)
      return;
    let a = this.coordsAt(t.head, -1), h = this.coordsAt(t.head, 1);
    if (!a || !h || a.bottom > h.top)
      return;
    let f = this.domAtPos(t.head + t.assoc);
    i.collapse(f.node, f.offset), i.modify("move", t.assoc < 0 ? "forward" : "backward", "lineboundary"), e.observer.readSelectionRange();
    let c = e.observer.selectionRange;
    e.docView.posFromDOM(c.anchorNode, c.anchorOffset) != t.from && i.collapse(s, r);
  }
  // If a position is in/near a block widget, move it to a nearby text
  // line, since we don't want the cursor inside a block widget.
  moveToLine(e) {
    let t = this.dom, i;
    if (e.node != t)
      return e;
    for (let s = e.offset; !i && s < t.childNodes.length; s++) {
      let r = ee.get(t.childNodes[s]);
      r instanceof he && (i = r.domAtPos(0));
    }
    for (let s = e.offset - 1; !i && s >= 0; s--) {
      let r = ee.get(t.childNodes[s]);
      r instanceof he && (i = r.domAtPos(r.length));
    }
    return i ? new ye(i.node, i.offset, !0) : e;
  }
  nearest(e) {
    for (let t = e; t; ) {
      let i = ee.get(t);
      if (i && i.rootView == this)
        return i;
      t = t.parentNode;
    }
    return null;
  }
  posFromDOM(e, t) {
    let i = this.nearest(e);
    if (!i)
      throw new RangeError("Trying to find position for a DOM position outside of the document");
    return i.localPosFromDOM(e, t) + i.posAtStart;
  }
  domAtPos(e) {
    let { i: t, off: i } = this.childCursor().findPos(e, -1);
    for (; t < this.children.length - 1; ) {
      let s = this.children[t];
      if (i < s.length || s instanceof he)
        break;
      t++, i = 0;
    }
    return this.children[t].domAtPos(i);
  }
  coordsAt(e, t) {
    let i = null, s = 0;
    for (let r = this.length, o = this.children.length - 1; o >= 0; o--) {
      let l = this.children[o], a = r - l.breakAfter, h = a - l.length;
      if (a < e)
        break;
      h <= e && (h < e || l.covers(-1)) && (a > e || l.covers(1)) && (!i || l instanceof he && !(i instanceof he && t >= 0)) && (i = l, s = h), r = h;
    }
    return i ? i.coordsAt(e - s, t) : null;
  }
  coordsForChar(e) {
    let { i: t, off: i } = this.childPos(e, 1), s = this.children[t];
    if (!(s instanceof he))
      return null;
    for (; s.children.length; ) {
      let { i: l, off: a } = s.childPos(i, 1);
      for (; ; l++) {
        if (l == s.children.length)
          return null;
        if ((s = s.children[l]).length)
          break;
      }
      i = a;
    }
    if (!(s instanceof wt))
      return null;
    let r = xe(s.text, i);
    if (r == i)
      return null;
    let o = $t(s.dom, i, r).getClientRects();
    for (let l = 0; l < o.length; l++) {
      let a = o[l];
      if (l == o.length - 1 || a.top < a.bottom && a.left < a.right)
        return a;
    }
    return null;
  }
  measureVisibleLineHeights(e) {
    let t = [], { from: i, to: s } = e, r = this.view.contentDOM.clientWidth, o = r > Math.max(this.view.scrollDOM.clientWidth, this.minWidth) + 1, l = -1, a = this.view.textDirection == te.LTR;
    for (let h = 0, f = 0; f < this.children.length; f++) {
      let c = this.children[f], u = h + c.length;
      if (u > s)
        break;
      if (h >= i) {
        let d = c.dom.getBoundingClientRect();
        if (t.push(d.height), o) {
          let p = c.dom.lastChild, m = p ? Mi(p) : [];
          if (m.length) {
            let g = m[m.length - 1], y = a ? g.right - d.left : d.right - g.left;
            y > l && (l = y, this.minWidth = r, this.minWidthFrom = h, this.minWidthTo = u);
          }
        }
      }
      h = u + c.breakAfter;
    }
    return t;
  }
  textDirectionAt(e) {
    let { i: t } = this.childPos(e, 1);
    return getComputedStyle(this.children[t].dom).direction == "rtl" ? te.RTL : te.LTR;
  }
  measureTextSize() {
    for (let r of this.children)
      if (r instanceof he) {
        let o = r.measureTextSize();
        if (o)
          return o;
      }
    let e = document.createElement("div"), t, i, s;
    return e.className = "cm-line", e.style.width = "99999px", e.style.position = "absolute", e.textContent = "abc def ghi jkl mno pqr stu", this.view.observer.ignore(() => {
      this.dom.appendChild(e);
      let r = Mi(e.firstChild)[0];
      t = e.getBoundingClientRect().height, i = r ? r.width / 27 : 7, s = r ? r.height : t, e.remove();
    }), { lineHeight: t, charWidth: i, textHeight: s };
  }
  childCursor(e = this.length) {
    let t = this.children.length;
    return t && (e -= this.children[--t].length), new Df(this.children, e, t);
  }
  computeBlockGapDeco() {
    let e = [], t = this.view.viewState;
    for (let i = 0, s = 0; ; s++) {
      let r = s == t.viewports.length ? null : t.viewports[s], o = r ? r.from - 1 : this.length;
      if (o > i) {
        let l = (t.lineBlockAt(o).bottom - t.lineBlockAt(i).top) / this.view.scaleY;
        e.push(q.replace({
          widget: new Vl(l),
          block: !0,
          inclusive: !0,
          isBlockGap: !0
        }).range(i, o));
      }
      if (!r)
        break;
      i = r.to + 1;
    }
    return q.set(e);
  }
  updateDeco() {
    let e = this.view.state.facet(dn).map((s, r) => (this.dynamicDecorationMap[r] = typeof s == "function") ? s(this.view) : s), t = !1, i = this.view.state.facet(Qf).map((s, r) => {
      let o = typeof s == "function";
      return o && (t = !0), o ? s(this.view) : s;
    });
    i.length && (this.dynamicDecorationMap[e.length] = t, e.push(Y.join(i)));
    for (let s = e.length; s < e.length + 3; s++)
      this.dynamicDecorationMap[s] = !1;
    return this.decorations = [
      ...e,
      this.computeBlockGapDeco(),
      this.view.viewState.lineGapDeco
    ];
  }
  scrollIntoView(e) {
    if (e.isSnapshot) {
      let h = this.view.viewState.lineBlockAt(e.range.head);
      this.view.scrollDOM.scrollTop = h.top - e.yMargin, this.view.scrollDOM.scrollLeft = e.xMargin;
      return;
    }
    let { range: t } = e, i = this.coordsAt(t.head, t.empty ? t.assoc : t.head > t.anchor ? -1 : 1), s;
    if (!i)
      return;
    !t.empty && (s = this.coordsAt(t.anchor, t.anchor > t.head ? -1 : 1)) && (i = {
      left: Math.min(i.left, s.left),
      top: Math.min(i.top, s.top),
      right: Math.max(i.right, s.right),
      bottom: Math.max(i.bottom, s.bottom)
    });
    let r = tc(this.view), o = {
      left: i.left - r.left,
      top: i.top - r.top,
      right: i.right + r.right,
      bottom: i.bottom + r.bottom
    }, { offsetWidth: l, offsetHeight: a } = this.view.scrollDOM;
    Vd(this.view.scrollDOM, o, t.head < t.anchor ? -1 : 1, e.x, e.y, Math.max(Math.min(e.xMargin, l), -l), Math.max(Math.min(e.yMargin, a), -a), this.view.textDirection == te.LTR);
  }
}
function op(n) {
  return n.node.nodeType == 1 && n.node.firstChild && (n.offset == 0 || n.node.childNodes[n.offset - 1].contentEditable == "false") && (n.offset == n.node.childNodes.length || n.node.childNodes[n.offset].contentEditable == "false");
}
class Vl extends ct {
  constructor(e) {
    super(), this.height = e;
  }
  toDOM() {
    let e = document.createElement("div");
    return e.className = "cm-gap", this.updateDOM(e), e;
  }
  eq(e) {
    return e.height == this.height;
  }
  updateDOM(e) {
    return e.style.height = this.height + "px", !0;
  }
  get editable() {
    return !0;
  }
  get estimatedHeight() {
    return this.height;
  }
}
function ic(n, e) {
  let t = n.observer.selectionRange, i = t.focusNode && nc(t.focusNode, t.focusOffset, 0);
  if (!i)
    return null;
  let s = e - i.offset;
  return { from: s, to: s + i.node.nodeValue.length, node: i.node };
}
function lp(n, e, t) {
  let i = ic(n, t);
  if (!i)
    return null;
  let { node: s, from: r, to: o } = i, l = s.nodeValue;
  if (/[\n\r]/.test(l) || n.state.doc.sliceString(i.from, i.to) != l)
    return null;
  let a = e.invertedDesc, h = new Fe(a.mapPos(r), a.mapPos(o), r, o), f = [];
  for (let c = s.parentNode; ; c = c.parentNode) {
    let u = ee.get(c);
    if (u instanceof kt)
      f.push({ node: c, deco: u.mark });
    else {
      if (u instanceof he || c.nodeName == "DIV" && c.parentNode == n.contentDOM)
        return { range: h, text: s, marks: f, line: c };
      if (c != n.contentDOM)
        f.push({ node: c, deco: new xn({
          inclusive: !0,
          attributes: Yd(c),
          tagName: c.tagName.toLowerCase()
        }) });
      else
        return null;
    }
  }
}
function nc(n, e, t) {
  if (t <= 0)
    for (let i = n, s = e; ; ) {
      if (i.nodeType == 3)
        return { node: i, offset: s };
      if (i.nodeType == 1 && s > 0)
        i = i.childNodes[s - 1], s = yt(i);
      else
        break;
    }
  if (t >= 0)
    for (let i = n, s = e; ; ) {
      if (i.nodeType == 3)
        return { node: i, offset: s };
      if (i.nodeType == 1 && s < i.childNodes.length && t >= 0)
        i = i.childNodes[s], s = 0;
      else
        break;
    }
  return null;
}
function ap(n, e) {
  return n.nodeType != 1 ? 0 : (e && n.childNodes[e - 1].contentEditable == "false" ? 1 : 0) | (e < n.childNodes.length && n.childNodes[e].contentEditable == "false" ? 2 : 0);
}
let hp = class {
  constructor() {
    this.changes = [];
  }
  compareRange(e, t) {
    eo(e, t, this.changes);
  }
  comparePoint(e, t) {
    eo(e, t, this.changes);
  }
};
function fp(n, e, t) {
  let i = new hp();
  return Y.compare(n, e, t, i), i.changes;
}
function cp(n, e) {
  for (let t = n; t && t != e; t = t.assignedSlot || t.parentNode)
    if (t.nodeType == 1 && t.contentEditable == "false")
      return !0;
  return !1;
}
function up(n, e) {
  let t = !1;
  return e && n.iterChangedRanges((i, s) => {
    i < e.to && s > e.from && (t = !0);
  }), t;
}
function dp(n, e, t = 1) {
  let i = n.charCategorizer(e), s = n.doc.lineAt(e), r = e - s.from;
  if (s.length == 0)
    return C.cursor(e);
  r == 0 ? t = 1 : r == s.length && (t = -1);
  let o = r, l = r;
  t < 0 ? o = xe(s.text, r, !1) : l = xe(s.text, r);
  let a = i(s.text.slice(o, l));
  for (; o > 0; ) {
    let h = xe(s.text, o, !1);
    if (i(s.text.slice(h, o)) != a)
      break;
    o = h;
  }
  for (; l < s.length; ) {
    let h = xe(s.text, l);
    if (i(s.text.slice(l, h)) != a)
      break;
    l = h;
  }
  return C.range(o + s.from, l + s.from);
}
function pp(n, e) {
  return e.left > n ? e.left - n : Math.max(0, n - e.right);
}
function mp(n, e) {
  return e.top > n ? e.top - n : Math.max(0, n - e.bottom);
}
function er(n, e) {
  return n.top < e.bottom - 1 && n.bottom > e.top + 1;
}
function Wl(n, e) {
  return e < n.top ? { top: e, left: n.left, right: n.right, bottom: n.bottom } : n;
}
function zl(n, e) {
  return e > n.bottom ? { top: n.top, left: n.left, right: n.right, bottom: e } : n;
}
function ro(n, e, t) {
  let i, s, r, o, l = !1, a, h, f, c;
  for (let p = n.firstChild; p; p = p.nextSibling) {
    let m = Mi(p);
    for (let g = 0; g < m.length; g++) {
      let y = m[g];
      s && er(s, y) && (y = Wl(zl(y, s.bottom), s.top));
      let k = pp(e, y), w = mp(t, y);
      if (k == 0 && w == 0)
        return p.nodeType == 3 ? ql(p, e, t) : ro(p, e, t);
      if (!i || o > w || o == w && r > k) {
        i = p, s = y, r = k, o = w;
        let S = w ? t < y.top ? -1 : 1 : k ? e < y.left ? -1 : 1 : 0;
        l = !S || (S > 0 ? g < m.length - 1 : g > 0);
      }
      k == 0 ? t > y.bottom && (!f || f.bottom < y.bottom) ? (a = p, f = y) : t < y.top && (!c || c.top > y.top) && (h = p, c = y) : f && er(f, y) ? f = zl(f, y.bottom) : c && er(c, y) && (c = Wl(c, y.top));
    }
  }
  if (f && f.bottom >= t ? (i = a, s = f) : c && c.top <= t && (i = h, s = c), !i)
    return { node: n, offset: 0 };
  let u = Math.max(s.left, Math.min(s.right, e));
  if (i.nodeType == 3)
    return ql(i, u, t);
  if (l && i.contentEditable != "false")
    return ro(i, u, t);
  let d = Array.prototype.indexOf.call(n.childNodes, i) + (e >= (s.left + s.right) / 2 ? 1 : 0);
  return { node: n, offset: d };
}
function ql(n, e, t) {
  let i = n.nodeValue.length, s = -1, r = 1e9, o = 0;
  for (let l = 0; l < i; l++) {
    let a = $t(n, l, l + 1).getClientRects();
    for (let h = 0; h < a.length; h++) {
      let f = a[h];
      if (f.top == f.bottom)
        continue;
      o || (o = e - f.left);
      let c = (f.top > t ? f.top - t : t - f.bottom) - 1;
      if (f.left - 1 <= e && f.right + 1 >= e && c < r) {
        let u = e >= (f.left + f.right) / 2, d = u;
        if ((D.chrome || D.gecko) && $t(n, l).getBoundingClientRect().left == f.right && (d = !u), c <= 0)
          return { node: n, offset: l + (d ? 1 : 0) };
        s = l + (d ? 1 : 0), r = c;
      }
    }
  }
  return { node: n, offset: s > -1 ? s : o > 0 ? n.nodeValue.length : 0 };
}
function sc(n, e, t, i = -1) {
  var s, r;
  let o = n.contentDOM.getBoundingClientRect(), l = o.top + n.viewState.paddingTop, a, { docHeight: h } = n.viewState, { x: f, y: c } = e, u = c - l;
  if (u < 0)
    return 0;
  if (u > h)
    return n.state.doc.length;
  for (let S = n.viewState.heightOracle.textHeight / 2, _ = !1; a = n.elementAtHeight(u), a.type != Se.Text; )
    for (; u = i > 0 ? a.bottom + S : a.top - S, !(u >= 0 && u <= h); ) {
      if (_)
        return t ? null : 0;
      _ = !0, i = -i;
    }
  c = l + u;
  let d = a.from;
  if (d < n.viewport.from)
    return n.viewport.from == 0 ? 0 : t ? null : jl(n, o, a, f, c);
  if (d > n.viewport.to)
    return n.viewport.to == n.state.doc.length ? n.state.doc.length : t ? null : jl(n, o, a, f, c);
  let p = n.dom.ownerDocument, m = n.root.elementFromPoint ? n.root : p, g = m.elementFromPoint(f, c);
  g && !n.contentDOM.contains(g) && (g = null), g || (f = Math.max(o.left + 1, Math.min(o.right - 1, f)), g = m.elementFromPoint(f, c), g && !n.contentDOM.contains(g) && (g = null));
  let y, k = -1;
  if (g && ((s = n.docView.nearest(g)) === null || s === void 0 ? void 0 : s.isEditable) != !1) {
    if (p.caretPositionFromPoint) {
      let S = p.caretPositionFromPoint(f, c);
      S && ({ offsetNode: y, offset: k } = S);
    } else if (p.caretRangeFromPoint) {
      let S = p.caretRangeFromPoint(f, c);
      S && ({ startContainer: y, startOffset: k } = S, (!n.contentDOM.contains(y) || D.safari && gp(y, k, f) || D.chrome && bp(y, k, f)) && (y = void 0));
    }
  }
  if (!y || !n.docView.dom.contains(y)) {
    let S = he.find(n.docView, d);
    if (!S)
      return u > a.top + a.height / 2 ? a.to : a.from;
    ({ node: y, offset: k } = ro(S.dom, f, c));
  }
  let w = n.docView.nearest(y);
  if (!w)
    return null;
  if (w.isWidget && ((r = w.dom) === null || r === void 0 ? void 0 : r.nodeType) == 1) {
    let S = w.dom.getBoundingClientRect();
    return e.y < S.top || e.y <= S.bottom && e.x <= (S.left + S.right) / 2 ? w.posAtStart : w.posAtEnd;
  } else
    return w.localPosFromDOM(y, k) + w.posAtStart;
}
function jl(n, e, t, i, s) {
  let r = Math.round((i - e.left) * n.defaultCharacterWidth);
  if (n.lineWrapping && t.height > n.defaultLineHeight * 1.5) {
    let l = n.viewState.heightOracle.textHeight, a = Math.floor((s - t.top - (n.defaultLineHeight - l) * 0.5) / l);
    r += a * n.viewState.heightOracle.lineLength;
  }
  let o = n.state.sliceDoc(t.from, t.to);
  return t.from + Kr(o, r, n.state.tabSize);
}
function gp(n, e, t) {
  let i;
  if (n.nodeType != 3 || e != (i = n.nodeValue.length))
    return !1;
  for (let s = n.nextSibling; s; s = s.nextSibling)
    if (s.nodeType != 1 || s.nodeName != "BR")
      return !1;
  return $t(n, i - 1, i).getBoundingClientRect().left > t;
}
function bp(n, e, t) {
  if (e != 0)
    return !1;
  for (let s = n; ; ) {
    let r = s.parentNode;
    if (!r || r.nodeType != 1 || r.firstChild != s)
      return !1;
    if (r.classList.contains("cm-line"))
      break;
    s = r;
  }
  let i = n.nodeType == 1 ? n.getBoundingClientRect() : $t(n, 0, Math.max(n.nodeValue.length, 1)).getBoundingClientRect();
  return t - i.left > 5;
}
function oo(n, e) {
  let t = n.lineBlockAt(e);
  if (Array.isArray(t.type)) {
    for (let i of t.type)
      if (i.to > e || i.to == e && (i.to == t.to || i.type == Se.Text))
        return i;
  }
  return t;
}
function yp(n, e, t, i) {
  let s = oo(n, e.head), r = !i || s.type != Se.Text || !(n.lineWrapping || s.widgetLineBreaks) ? null : n.coordsAtPos(e.assoc < 0 && e.head > s.from ? e.head - 1 : e.head);
  if (r) {
    let o = n.dom.getBoundingClientRect(), l = n.textDirectionAt(s.from), a = n.posAtCoords({
      x: t == (l == te.LTR) ? o.right - 1 : o.left + 1,
      y: (r.top + r.bottom) / 2
    });
    if (a != null)
      return C.cursor(a, t ? -1 : 1);
  }
  return C.cursor(t ? s.to : s.from, t ? -1 : 1);
}
function Kl(n, e, t, i) {
  let s = n.state.doc.lineAt(e.head), r = n.bidiSpans(s), o = n.textDirectionAt(s.from);
  for (let l = e, a = null; ; ) {
    let h = np(s, r, o, l, t), f = zf;
    if (!h) {
      if (s.number == (t ? n.state.doc.lines : 1))
        return l;
      f = `
`, s = n.state.doc.line(s.number + (t ? 1 : -1)), r = n.bidiSpans(s), h = n.visualLineSide(s, !t);
    }
    if (a) {
      if (!a(f))
        return l;
    } else {
      if (!i)
        return h;
      a = i(f);
    }
    l = h;
  }
}
function wp(n, e, t) {
  let i = n.state.charCategorizer(e), s = i(t);
  return (r) => {
    let o = i(r);
    return s == Ee.Space && (s = o), s == o;
  };
}
function kp(n, e, t, i) {
  let s = e.head, r = t ? 1 : -1;
  if (s == (t ? n.state.doc.length : 0))
    return C.cursor(s, e.assoc);
  let o = e.goalColumn, l, a = n.contentDOM.getBoundingClientRect(), h = n.coordsAtPos(s, e.assoc || -1), f = n.documentTop;
  if (h)
    o == null && (o = h.left - a.left), l = r < 0 ? h.top : h.bottom;
  else {
    let d = n.viewState.lineBlockAt(s);
    o == null && (o = Math.min(a.right - a.left, n.defaultCharacterWidth * (s - d.from))), l = (r < 0 ? d.top : d.bottom) + f;
  }
  let c = a.left + o, u = i ?? n.viewState.heightOracle.textHeight >> 1;
  for (let d = 0; ; d += 10) {
    let p = l + (u + d) * r, m = sc(n, { x: c, y: p }, !1, r);
    if (p < a.top || p > a.bottom || (r < 0 ? m < s : m > s)) {
      let g = n.docView.coordsForChar(m), y = !g || p < g.top ? -1 : 1;
      return C.cursor(m, y, void 0, o);
    }
  }
}
function ss(n, e, t) {
  for (; ; ) {
    let i = 0;
    for (let s of n)
      s.between(e - 1, e + 1, (r, o, l) => {
        if (e > r && e < o) {
          let a = i || t || (e - r < o - e ? -1 : 1);
          e = a < 0 ? r : o, i = a;
        }
      });
    if (!i)
      return e;
  }
}
function tr(n, e, t) {
  let i = ss(n.state.facet(Wo).map((s) => s(n)), t.from, e.head > t.from ? -1 : 1);
  return i == t.from ? t : C.cursor(i, i < t.from ? 1 : -1);
}
class vp {
  setSelectionOrigin(e) {
    this.lastSelectionOrigin = e, this.lastSelectionTime = Date.now();
  }
  constructor(e) {
    this.view = e, this.lastKeyCode = 0, this.lastKeyTime = 0, this.lastTouchTime = 0, this.lastFocusTime = 0, this.lastScrollTop = 0, this.lastScrollLeft = 0, this.pendingIOSKey = void 0, this.lastSelectionOrigin = null, this.lastSelectionTime = 0, this.lastEscPress = 0, this.lastContextMenu = 0, this.scrollHandlers = [], this.handlers = /* @__PURE__ */ Object.create(null), this.composing = -1, this.compositionFirstChange = null, this.compositionEndedAt = 0, this.compositionPendingKey = !1, this.compositionPendingChange = !1, this.mouseSelection = null, this.draggedContent = null, this.handleEvent = this.handleEvent.bind(this), this.notifiedFocused = e.hasFocus, D.safari && e.contentDOM.addEventListener("input", () => null), D.gecko && Np(e.contentDOM.ownerDocument);
  }
  handleEvent(e) {
    !Dp(this.view, e) || this.ignoreDuringComposition(e) || e.type == "keydown" && this.keydown(e) || this.runHandlers(e.type, e);
  }
  runHandlers(e, t) {
    let i = this.handlers[e];
    if (i) {
      for (let s of i.observers)
        s(this.view, t);
      for (let s of i.handlers) {
        if (t.defaultPrevented)
          break;
        if (s(this.view, t)) {
          t.preventDefault();
          break;
        }
      }
    }
  }
  ensureHandlers(e) {
    let t = xp(e), i = this.handlers, s = this.view.contentDOM;
    for (let r in t)
      if (r != "scroll") {
        let o = !t[r].handlers.length, l = i[r];
        l && o != !l.handlers.length && (s.removeEventListener(r, this.handleEvent), l = null), l || s.addEventListener(r, this.handleEvent, { passive: o });
      }
    for (let r in i)
      r != "scroll" && !t[r] && s.removeEventListener(r, this.handleEvent);
    this.handlers = t;
  }
  keydown(e) {
    if (this.lastKeyCode = e.keyCode, this.lastKeyTime = Date.now(), e.keyCode == 9 && Date.now() < this.lastEscPress + 2e3)
      return !0;
    if (e.keyCode != 27 && oc.indexOf(e.keyCode) < 0 && (this.view.inputState.lastEscPress = 0), D.android && D.chrome && !e.synthetic && (e.keyCode == 13 || e.keyCode == 8))
      return this.view.observer.delayAndroidKey(e.key, e.keyCode), !0;
    let t;
    return D.ios && !e.synthetic && !e.altKey && !e.metaKey && ((t = rc.find((i) => i.keyCode == e.keyCode)) && !e.ctrlKey || Sp.indexOf(e.key) > -1 && e.ctrlKey && !e.shiftKey) ? (this.pendingIOSKey = t || e, setTimeout(() => this.flushIOSKey(), 250), !0) : (e.keyCode != 229 && this.view.observer.forceFlush(), !1);
  }
  flushIOSKey() {
    let e = this.pendingIOSKey;
    return e ? (this.pendingIOSKey = void 0, xi(this.view.contentDOM, e.key, e.keyCode)) : !1;
  }
  ignoreDuringComposition(e) {
    return /^key/.test(e.type) ? this.composing > 0 ? !0 : D.safari && !D.ios && this.compositionPendingKey && Date.now() - this.compositionEndedAt < 100 ? (this.compositionPendingKey = !1, !0) : !1 : !1;
  }
  startMouseSelection(e) {
    this.mouseSelection && this.mouseSelection.destroy(), this.mouseSelection = e;
  }
  update(e) {
    this.mouseSelection && this.mouseSelection.update(e), this.draggedContent && e.docChanged && (this.draggedContent = this.draggedContent.map(e.changes)), e.transactions.length && (this.lastKeyCode = this.lastSelectionTime = 0);
  }
  destroy() {
    this.mouseSelection && this.mouseSelection.destroy();
  }
}
function Ul(n, e) {
  return (t, i) => {
    try {
      return e.call(n, i, t);
    } catch (s) {
      ft(t.state, s);
    }
  };
}
function xp(n) {
  let e = /* @__PURE__ */ Object.create(null);
  function t(i) {
    return e[i] || (e[i] = { observers: [], handlers: [] });
  }
  for (let i of n) {
    let s = i.spec;
    if (s && s.domEventHandlers)
      for (let r in s.domEventHandlers) {
        let o = s.domEventHandlers[r];
        o && t(r).handlers.push(Ul(i.value, o));
      }
    if (s && s.domEventObservers)
      for (let r in s.domEventObservers) {
        let o = s.domEventObservers[r];
        o && t(r).observers.push(Ul(i.value, o));
      }
  }
  for (let i in Ke)
    t(i).handlers.push(Ke[i]);
  for (let i in Ue)
    t(i).observers.push(Ue[i]);
  return e;
}
const rc = [
  { key: "Backspace", keyCode: 8, inputType: "deleteContentBackward" },
  { key: "Enter", keyCode: 13, inputType: "insertParagraph" },
  { key: "Enter", keyCode: 13, inputType: "insertLineBreak" },
  { key: "Delete", keyCode: 46, inputType: "deleteContentForward" }
], Sp = "dthko", oc = [16, 17, 18, 20, 91, 92, 224, 225], Ln = 6;
function En(n) {
  return Math.max(0, n) * 0.7 + 8;
}
function _p(n, e) {
  return Math.max(Math.abs(n.clientX - e.clientX), Math.abs(n.clientY - e.clientY));
}
class Cp {
  constructor(e, t, i, s) {
    this.view = e, this.startEvent = t, this.style = i, this.mustSelect = s, this.scrollSpeed = { x: 0, y: 0 }, this.scrolling = -1, this.lastEvent = t, this.scrollParent = Wd(e.contentDOM), this.atoms = e.state.facet(Wo).map((o) => o(e));
    let r = e.contentDOM.ownerDocument;
    r.addEventListener("mousemove", this.move = this.move.bind(this)), r.addEventListener("mouseup", this.up = this.up.bind(this)), this.extend = t.shiftKey, this.multiple = e.state.facet(G.allowMultipleSelections) && Ap(e, t), this.dragging = Tp(e, t) && fc(t) == 1 ? null : !1;
  }
  start(e) {
    this.dragging === !1 && this.select(e);
  }
  move(e) {
    var t;
    if (e.buttons == 0)
      return this.destroy();
    if (this.dragging || this.dragging == null && _p(this.startEvent, e) < 10)
      return;
    this.select(this.lastEvent = e);
    let i = 0, s = 0, r = ((t = this.scrollParent) === null || t === void 0 ? void 0 : t.getBoundingClientRect()) || { left: 0, top: 0, right: this.view.win.innerWidth, bottom: this.view.win.innerHeight }, o = tc(this.view);
    e.clientX - o.left <= r.left + Ln ? i = -En(r.left - e.clientX) : e.clientX + o.right >= r.right - Ln && (i = En(e.clientX - r.right)), e.clientY - o.top <= r.top + Ln ? s = -En(r.top - e.clientY) : e.clientY + o.bottom >= r.bottom - Ln && (s = En(e.clientY - r.bottom)), this.setScrollSpeed(i, s);
  }
  up(e) {
    this.dragging == null && this.select(this.lastEvent), this.dragging || e.preventDefault(), this.destroy();
  }
  destroy() {
    this.setScrollSpeed(0, 0);
    let e = this.view.contentDOM.ownerDocument;
    e.removeEventListener("mousemove", this.move), e.removeEventListener("mouseup", this.up), this.view.inputState.mouseSelection = this.view.inputState.draggedContent = null;
  }
  setScrollSpeed(e, t) {
    this.scrollSpeed = { x: e, y: t }, e || t ? this.scrolling < 0 && (this.scrolling = setInterval(() => this.scroll(), 50)) : this.scrolling > -1 && (clearInterval(this.scrolling), this.scrolling = -1);
  }
  scroll() {
    this.scrollParent ? (this.scrollParent.scrollLeft += this.scrollSpeed.x, this.scrollParent.scrollTop += this.scrollSpeed.y) : this.view.win.scrollBy(this.scrollSpeed.x, this.scrollSpeed.y), this.dragging === !1 && this.select(this.lastEvent);
  }
  skipAtoms(e) {
    let t = null;
    for (let i = 0; i < e.ranges.length; i++) {
      let s = e.ranges[i], r = null;
      if (s.empty) {
        let o = ss(this.atoms, s.from, 0);
        o != s.from && (r = C.cursor(o, -1));
      } else {
        let o = ss(this.atoms, s.from, -1), l = ss(this.atoms, s.to, 1);
        (o != s.from || l != s.to) && (r = C.range(s.from == s.anchor ? o : l, s.from == s.head ? o : l));
      }
      r && (t || (t = e.ranges.slice()), t[i] = r);
    }
    return t ? C.create(t, e.mainIndex) : e;
  }
  select(e) {
    let { view: t } = this, i = this.skipAtoms(this.style.get(e, this.extend, this.multiple));
    (this.mustSelect || !i.eq(t.state.selection, this.dragging === !1)) && this.view.dispatch({
      selection: i,
      userEvent: "select.pointer"
    }), this.mustSelect = !1;
  }
  update(e) {
    this.style.update(e) && setTimeout(() => this.select(this.lastEvent), 20);
  }
}
function Ap(n, e) {
  let t = n.state.facet(qf);
  return t.length ? t[0](e) : D.mac ? e.metaKey : e.ctrlKey;
}
function Mp(n, e) {
  let t = n.state.facet(jf);
  return t.length ? t[0](e) : D.mac ? !e.altKey : !e.ctrlKey;
}
function Tp(n, e) {
  let { main: t } = n.state.selection;
  if (t.empty)
    return !1;
  let i = gs(n.root);
  if (!i || i.rangeCount == 0)
    return !0;
  let s = i.getRangeAt(0).getClientRects();
  for (let r = 0; r < s.length; r++) {
    let o = s[r];
    if (o.left <= e.clientX && o.right >= e.clientX && o.top <= e.clientY && o.bottom >= e.clientY)
      return !0;
  }
  return !1;
}
function Dp(n, e) {
  if (!e.bubbles)
    return !0;
  if (e.defaultPrevented)
    return !1;
  for (let t = e.target, i; t != n.contentDOM; t = t.parentNode)
    if (!t || t.nodeType == 11 || (i = ee.get(t)) && i.ignoreEvent(e))
      return !1;
  return !0;
}
const Ke = /* @__PURE__ */ Object.create(null), Ue = /* @__PURE__ */ Object.create(null), lc = D.ie && D.ie_version < 15 || D.ios && D.webkit_version < 604;
function Op(n) {
  let e = n.dom.parentNode;
  if (!e)
    return;
  let t = e.appendChild(document.createElement("textarea"));
  t.style.cssText = "position: fixed; left: -10000px; top: 10px", t.focus(), setTimeout(() => {
    n.focus(), t.remove(), ac(n, t.value);
  }, 50);
}
function ac(n, e) {
  let { state: t } = n, i, s = 1, r = t.toText(e), o = r.lines == t.selection.ranges.length;
  if (lo != null && t.selection.ranges.every((a) => a.empty) && lo == r.toString()) {
    let a = -1;
    i = t.changeByRange((h) => {
      let f = t.doc.lineAt(h.from);
      if (f.from == a)
        return { range: h };
      a = f.from;
      let c = t.toText((o ? r.line(s++).text : e) + t.lineBreak);
      return {
        changes: { from: f.from, insert: c },
        range: C.cursor(h.from + c.length)
      };
    });
  } else
    o ? i = t.changeByRange((a) => {
      let h = r.line(s++);
      return {
        changes: { from: a.from, to: a.to, insert: h.text },
        range: C.cursor(a.from + h.length)
      };
    }) : i = t.replaceSelection(r);
  n.dispatch(i, {
    userEvent: "input.paste",
    scrollIntoView: !0
  });
}
Ue.scroll = (n) => {
  n.inputState.lastScrollTop = n.scrollDOM.scrollTop, n.inputState.lastScrollLeft = n.scrollDOM.scrollLeft;
};
Ke.keydown = (n, e) => (n.inputState.setSelectionOrigin("select"), e.keyCode == 27 && (n.inputState.lastEscPress = Date.now()), !1);
Ue.touchstart = (n, e) => {
  n.inputState.lastTouchTime = Date.now(), n.inputState.setSelectionOrigin("select.pointer");
};
Ue.touchmove = (n) => {
  n.inputState.setSelectionOrigin("select.pointer");
};
Ke.mousedown = (n, e) => {
  if (n.observer.flush(), n.inputState.lastTouchTime > Date.now() - 2e3)
    return !1;
  let t = null;
  for (let i of n.state.facet(Kf))
    if (t = i(n, e), t)
      break;
  if (!t && e.button == 0 && (t = Lp(n, e)), t) {
    let i = !n.hasFocus;
    n.inputState.startMouseSelection(new Cp(n, e, t, i)), i && n.observer.ignore(() => Af(n.contentDOM));
    let s = n.inputState.mouseSelection;
    if (s)
      return s.start(e), s.dragging === !1;
  }
  return !1;
};
function Gl(n, e, t, i) {
  if (i == 1)
    return C.cursor(e, t);
  if (i == 2)
    return dp(n.state, e, t);
  {
    let s = he.find(n.docView, e), r = n.state.doc.lineAt(s ? s.posAtEnd : e), o = s ? s.posAtStart : r.from, l = s ? s.posAtEnd : r.to;
    return l < n.state.doc.length && l == r.to && l++, C.range(o, l);
  }
}
let hc = (n, e) => n >= e.top && n <= e.bottom, Yl = (n, e, t) => hc(e, t) && n >= t.left && n <= t.right;
function Bp(n, e, t, i) {
  let s = he.find(n.docView, e);
  if (!s)
    return 1;
  let r = e - s.posAtStart;
  if (r == 0)
    return 1;
  if (r == s.length)
    return -1;
  let o = s.coordsAt(r, -1);
  if (o && Yl(t, i, o))
    return -1;
  let l = s.coordsAt(r, 1);
  return l && Yl(t, i, l) ? 1 : o && hc(i, o) ? -1 : 1;
}
function Jl(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1);
  return { pos: t, bias: Bp(n, t, e.clientX, e.clientY) };
}
const Pp = D.ie && D.ie_version <= 11;
let Xl = null, Zl = 0, Ql = 0;
function fc(n) {
  if (!Pp)
    return n.detail;
  let e = Xl, t = Ql;
  return Xl = n, Ql = Date.now(), Zl = !e || t > Date.now() - 400 && Math.abs(e.clientX - n.clientX) < 2 && Math.abs(e.clientY - n.clientY) < 2 ? (Zl + 1) % 3 : 1;
}
function Lp(n, e) {
  let t = Jl(n, e), i = fc(e), s = n.state.selection;
  return {
    update(r) {
      r.docChanged && (t.pos = r.changes.mapPos(t.pos), s = s.map(r.changes));
    },
    get(r, o, l) {
      let a = Jl(n, r), h, f = Gl(n, a.pos, a.bias, i);
      if (t.pos != a.pos && !o) {
        let c = Gl(n, t.pos, t.bias, i), u = Math.min(c.from, f.from), d = Math.max(c.to, f.to);
        f = u < f.from ? C.range(u, d) : C.range(d, u);
      }
      return o ? s.replaceRange(s.main.extend(f.from, f.to)) : l && i == 1 && s.ranges.length > 1 && (h = Ep(s, a.pos)) ? h : l ? s.addRange(f) : C.create([f]);
    }
  };
}
function Ep(n, e) {
  for (let t = 0; t < n.ranges.length; t++) {
    let { from: i, to: s } = n.ranges[t];
    if (i <= e && s >= e)
      return C.create(n.ranges.slice(0, t).concat(n.ranges.slice(t + 1)), n.mainIndex == t ? 0 : n.mainIndex - (n.mainIndex > t ? 1 : 0));
  }
  return null;
}
Ke.dragstart = (n, e) => {
  let { selection: { main: t } } = n.state;
  if (e.target.draggable) {
    let s = n.docView.nearest(e.target);
    if (s && s.isWidget) {
      let r = s.posAtStart, o = r + s.length;
      (r >= t.to || o <= t.from) && (t = C.range(r, o));
    }
  }
  let { inputState: i } = n;
  return i.mouseSelection && (i.mouseSelection.dragging = !0), i.draggedContent = t, e.dataTransfer && (e.dataTransfer.setData("Text", n.state.sliceDoc(t.from, t.to)), e.dataTransfer.effectAllowed = "copyMove"), !1;
};
Ke.dragend = (n) => (n.inputState.draggedContent = null, !1);
function $l(n, e, t, i) {
  if (!t)
    return;
  let s = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), { draggedContent: r } = n.inputState, o = i && r && Mp(n, e) ? { from: r.from, to: r.to } : null, l = { from: s, insert: t }, a = n.state.changes(o ? [o, l] : l);
  n.focus(), n.dispatch({
    changes: a,
    selection: { anchor: a.mapPos(s, -1), head: a.mapPos(s, 1) },
    userEvent: o ? "move.drop" : "input.drop"
  }), n.inputState.draggedContent = null;
}
Ke.drop = (n, e) => {
  if (!e.dataTransfer)
    return !1;
  if (n.state.readOnly)
    return !0;
  let t = e.dataTransfer.files;
  if (t && t.length) {
    let i = Array(t.length), s = 0, r = () => {
      ++s == t.length && $l(n, e, i.filter((o) => o != null).join(n.state.lineBreak), !1);
    };
    for (let o = 0; o < t.length; o++) {
      let l = new FileReader();
      l.onerror = r, l.onload = () => {
        /[\x00-\x08\x0e-\x1f]{2}/.test(l.result) || (i[o] = l.result), r();
      }, l.readAsText(t[o]);
    }
    return !0;
  } else {
    let i = e.dataTransfer.getData("Text");
    if (i)
      return $l(n, e, i, !0), !0;
  }
  return !1;
};
Ke.paste = (n, e) => {
  if (n.state.readOnly)
    return !0;
  n.observer.flush();
  let t = lc ? null : e.clipboardData;
  return t ? (ac(n, t.getData("text/plain") || t.getData("text/uri-text")), !0) : (Op(n), !1);
};
function Rp(n, e) {
  let t = n.dom.parentNode;
  if (!t)
    return;
  let i = t.appendChild(document.createElement("textarea"));
  i.style.cssText = "position: fixed; left: -10000px; top: 10px", i.value = e, i.focus(), i.selectionEnd = e.length, i.selectionStart = 0, setTimeout(() => {
    i.remove(), n.focus();
  }, 50);
}
function Ip(n) {
  let e = [], t = [], i = !1;
  for (let s of n.selection.ranges)
    s.empty || (e.push(n.sliceDoc(s.from, s.to)), t.push(s));
  if (!e.length) {
    let s = -1;
    for (let { from: r } of n.selection.ranges) {
      let o = n.doc.lineAt(r);
      o.number > s && (e.push(o.text), t.push({ from: o.from, to: Math.min(n.doc.length, o.to + 1) })), s = o.number;
    }
    i = !0;
  }
  return { text: e.join(n.lineBreak), ranges: t, linewise: i };
}
let lo = null;
Ke.copy = Ke.cut = (n, e) => {
  let { text: t, ranges: i, linewise: s } = Ip(n.state);
  if (!t && !s)
    return !1;
  lo = s ? t : null, e.type == "cut" && !n.state.readOnly && n.dispatch({
    changes: i,
    scrollIntoView: !0,
    userEvent: "delete.cut"
  });
  let r = lc ? null : e.clipboardData;
  return r ? (r.clearData(), r.setData("text/plain", t), !0) : (Rp(n, t), !1);
};
const cc = /* @__PURE__ */ vt.define();
function uc(n, e) {
  let t = [];
  for (let i of n.facet(Yf)) {
    let s = i(n, e);
    s && t.push(s);
  }
  return t ? n.update({ effects: t, annotations: cc.of(!0) }) : null;
}
function dc(n) {
  setTimeout(() => {
    let e = n.hasFocus;
    if (e != n.inputState.notifiedFocused) {
      let t = uc(n.state, e);
      t ? n.dispatch(t) : n.update([]);
    }
  }, 10);
}
Ue.focus = (n) => {
  n.inputState.lastFocusTime = Date.now(), !n.scrollDOM.scrollTop && (n.inputState.lastScrollTop || n.inputState.lastScrollLeft) && (n.scrollDOM.scrollTop = n.inputState.lastScrollTop, n.scrollDOM.scrollLeft = n.inputState.lastScrollLeft), dc(n);
};
Ue.blur = (n) => {
  n.observer.clearSelectionRange(), dc(n);
};
Ue.compositionstart = Ue.compositionupdate = (n) => {
  n.inputState.compositionFirstChange == null && (n.inputState.compositionFirstChange = !0), n.inputState.composing < 0 && (n.inputState.composing = 0);
};
Ue.compositionend = (n) => {
  n.inputState.composing = -1, n.inputState.compositionEndedAt = Date.now(), n.inputState.compositionPendingKey = !0, n.inputState.compositionPendingChange = n.observer.pendingRecords().length > 0, n.inputState.compositionFirstChange = null, D.chrome && D.android ? n.observer.flushSoon() : n.inputState.compositionPendingChange ? Promise.resolve().then(() => n.observer.flush()) : setTimeout(() => {
    n.inputState.composing < 0 && n.docView.hasComposition && n.update([]);
  }, 50);
};
Ue.contextmenu = (n) => {
  n.inputState.lastContextMenu = Date.now();
};
Ke.beforeinput = (n, e) => {
  var t;
  let i;
  if (D.chrome && D.android && (i = rc.find((s) => s.inputType == e.inputType)) && (n.observer.delayAndroidKey(i.key, i.keyCode), i.key == "Backspace" || i.key == "Delete")) {
    let s = ((t = window.visualViewport) === null || t === void 0 ? void 0 : t.height) || 0;
    setTimeout(() => {
      var r;
      (((r = window.visualViewport) === null || r === void 0 ? void 0 : r.height) || 0) > s + 10 && n.hasFocus && (n.contentDOM.blur(), n.focus());
    }, 100);
  }
  return !1;
};
const ea = /* @__PURE__ */ new Set();
function Np(n) {
  ea.has(n) || (ea.add(n), n.addEventListener("copy", () => {
  }), n.addEventListener("cut", () => {
  }));
}
const ta = ["pre-wrap", "normal", "pre-line", "break-spaces"];
class Fp {
  constructor(e) {
    this.lineWrapping = e, this.doc = J.empty, this.heightSamples = {}, this.lineHeight = 14, this.charWidth = 7, this.textHeight = 14, this.lineLength = 30, this.heightChanged = !1;
  }
  heightForGap(e, t) {
    let i = this.doc.lineAt(t).number - this.doc.lineAt(e).number + 1;
    return this.lineWrapping && (i += Math.max(0, Math.ceil((t - e - i * this.lineLength * 0.5) / this.lineLength))), this.lineHeight * i;
  }
  heightForLine(e) {
    return this.lineWrapping ? (1 + Math.max(0, Math.ceil((e - this.lineLength) / (this.lineLength - 5)))) * this.lineHeight : this.lineHeight;
  }
  setDoc(e) {
    return this.doc = e, this;
  }
  mustRefreshForWrapping(e) {
    return ta.indexOf(e) > -1 != this.lineWrapping;
  }
  mustRefreshForHeights(e) {
    let t = !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i];
      s < 0 ? i++ : this.heightSamples[Math.floor(s * 10)] || (t = !0, this.heightSamples[Math.floor(s * 10)] = !0);
    }
    return t;
  }
  refresh(e, t, i, s, r, o) {
    let l = ta.indexOf(e) > -1, a = Math.round(t) != Math.round(this.lineHeight) || this.lineWrapping != l;
    if (this.lineWrapping = l, this.lineHeight = t, this.charWidth = i, this.textHeight = s, this.lineLength = r, a) {
      this.heightSamples = {};
      for (let h = 0; h < o.length; h++) {
        let f = o[h];
        f < 0 ? h++ : this.heightSamples[Math.floor(f * 10)] = !0;
      }
    }
    return a;
  }
}
class Hp {
  constructor(e, t) {
    this.from = e, this.heights = t, this.index = 0;
  }
  get more() {
    return this.index < this.heights.length;
  }
}
class it {
  /**
  @internal
  */
  constructor(e, t, i, s, r) {
    this.from = e, this.length = t, this.top = i, this.height = s, this._content = r;
  }
  /**
  The type of element this is. When querying lines, this may be
  an array of all the blocks that make up the line.
  */
  get type() {
    return typeof this._content == "number" ? Se.Text : Array.isArray(this._content) ? this._content : this._content.type;
  }
  /**
  The end of the element as a document position.
  */
  get to() {
    return this.from + this.length;
  }
  /**
  The bottom position of the element.
  */
  get bottom() {
    return this.top + this.height;
  }
  /**
  If this is a widget block, this will return the widget
  associated with it.
  */
  get widget() {
    return this._content instanceof It ? this._content.widget : null;
  }
  /**
  If this is a textblock, this holds the number of line breaks
  that appear in widgets inside the block.
  */
  get widgetLineBreaks() {
    return typeof this._content == "number" ? this._content : 0;
  }
  /**
  @internal
  */
  join(e) {
    let t = (Array.isArray(this._content) ? this._content : [this]).concat(Array.isArray(e._content) ? e._content : [e]);
    return new it(this.from, this.length + e.length, this.top, this.height + e.height, t);
  }
}
var $ = /* @__PURE__ */ function(n) {
  return n[n.ByPos = 0] = "ByPos", n[n.ByHeight = 1] = "ByHeight", n[n.ByPosNoHeight = 2] = "ByPosNoHeight", n;
}($ || ($ = {}));
const rs = 1e-3;
class _e {
  constructor(e, t, i = 2) {
    this.length = e, this.height = t, this.flags = i;
  }
  get outdated() {
    return (this.flags & 2) > 0;
  }
  set outdated(e) {
    this.flags = (e ? 2 : 0) | this.flags & -3;
  }
  setHeight(e, t) {
    this.height != t && (Math.abs(this.height - t) > rs && (e.heightChanged = !0), this.height = t);
  }
  // Base case is to replace a leaf node, which simply builds a tree
  // from the new nodes and returns that (HeightMapBranch and
  // HeightMapGap override this to actually use from/to)
  replace(e, t, i) {
    return _e.of(i);
  }
  // Again, these are base cases, and are overridden for branch and gap nodes.
  decomposeLeft(e, t) {
    t.push(this);
  }
  decomposeRight(e, t) {
    t.push(this);
  }
  applyChanges(e, t, i, s) {
    let r = this, o = i.doc;
    for (let l = s.length - 1; l >= 0; l--) {
      let { fromA: a, toA: h, fromB: f, toB: c } = s[l], u = r.lineAt(a, $.ByPosNoHeight, i.setDoc(t), 0, 0), d = u.to >= h ? u : r.lineAt(h, $.ByPosNoHeight, i, 0, 0);
      for (c += d.to - h, h = d.to; l > 0 && u.from <= s[l - 1].toA; )
        a = s[l - 1].fromA, f = s[l - 1].fromB, l--, a < u.from && (u = r.lineAt(a, $.ByPosNoHeight, i, 0, 0));
      f += u.from - a, a = u.from;
      let p = zo.build(i.setDoc(o), e, f, c);
      r = r.replace(a, h, p);
    }
    return r.updateHeight(i, 0);
  }
  static empty() {
    return new De(0, 0);
  }
  // nodes uses null values to indicate the position of line breaks.
  // There are never line breaks at the start or end of the array, or
  // two line breaks next to each other, and the array isn't allowed
  // to be empty (same restrictions as return value from the builder).
  static of(e) {
    if (e.length == 1)
      return e[0];
    let t = 0, i = e.length, s = 0, r = 0;
    for (; ; )
      if (t == i)
        if (s > r * 2) {
          let l = e[t - 1];
          l.break ? e.splice(--t, 1, l.left, null, l.right) : e.splice(--t, 1, l.left, l.right), i += 1 + l.break, s -= l.size;
        } else if (r > s * 2) {
          let l = e[i];
          l.break ? e.splice(i, 1, l.left, null, l.right) : e.splice(i, 1, l.left, l.right), i += 2 + l.break, r -= l.size;
        } else
          break;
      else if (s < r) {
        let l = e[t++];
        l && (s += l.size);
      } else {
        let l = e[--i];
        l && (r += l.size);
      }
    let o = 0;
    return e[t - 1] == null ? (o = 1, t--) : e[t] == null && (o = 1, i++), new Vp(_e.of(e.slice(0, t)), o, _e.of(e.slice(i)));
  }
}
_e.prototype.size = 1;
class pc extends _e {
  constructor(e, t, i) {
    super(e, t), this.deco = i;
  }
  blockAt(e, t, i, s) {
    return new it(s, this.length, i, this.height, this.deco || 0);
  }
  lineAt(e, t, i, s, r) {
    return this.blockAt(0, i, s, r);
  }
  forEachLine(e, t, i, s, r, o) {
    e <= r + this.length && t >= r && o(this.blockAt(0, i, s, r));
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more && this.setHeight(e, s.heights[s.index++]), this.outdated = !1, this;
  }
  toString() {
    return `block(${this.length})`;
  }
}
class De extends pc {
  constructor(e, t) {
    super(e, t, null), this.collapsed = 0, this.widgetHeight = 0, this.breaks = 0;
  }
  blockAt(e, t, i, s) {
    return new it(s, this.length, i, this.height, this.breaks);
  }
  replace(e, t, i) {
    let s = i[0];
    return i.length == 1 && (s instanceof De || s instanceof de && s.flags & 4) && Math.abs(this.length - s.length) < 10 ? (s instanceof de ? s = new De(s.length, this.height) : s.height = this.height, this.outdated || (s.outdated = !1), s) : _e.of(i);
  }
  updateHeight(e, t = 0, i = !1, s) {
    return s && s.from <= t && s.more ? this.setHeight(e, s.heights[s.index++]) : (i || this.outdated) && this.setHeight(e, Math.max(this.widgetHeight, e.heightForLine(this.length - this.collapsed)) + this.breaks * e.lineHeight), this.outdated = !1, this;
  }
  toString() {
    return `line(${this.length}${this.collapsed ? -this.collapsed : ""}${this.widgetHeight ? ":" + this.widgetHeight : ""})`;
  }
}
class de extends _e {
  constructor(e) {
    super(e, 0);
  }
  heightMetrics(e, t) {
    let i = e.doc.lineAt(t).number, s = e.doc.lineAt(t + this.length).number, r = s - i + 1, o, l = 0;
    if (e.lineWrapping) {
      let a = Math.min(this.height, e.lineHeight * r);
      o = a / r, this.length > r + 1 && (l = (this.height - a) / (this.length - r - 1));
    } else
      o = this.height / r;
    return { firstLine: i, lastLine: s, perLine: o, perChar: l };
  }
  blockAt(e, t, i, s) {
    let { firstLine: r, lastLine: o, perLine: l, perChar: a } = this.heightMetrics(t, s);
    if (t.lineWrapping) {
      let h = s + Math.round(Math.max(0, Math.min(1, (e - i) / this.height)) * this.length), f = t.doc.lineAt(h), c = l + f.length * a, u = Math.max(i, e - c / 2);
      return new it(f.from, f.length, u, c, 0);
    } else {
      let h = Math.max(0, Math.min(o - r, Math.floor((e - i) / l))), { from: f, length: c } = t.doc.line(r + h);
      return new it(f, c, i + l * h, l, 0);
    }
  }
  lineAt(e, t, i, s, r) {
    if (t == $.ByHeight)
      return this.blockAt(e, i, s, r);
    if (t == $.ByPosNoHeight) {
      let { from: d, to: p } = i.doc.lineAt(e);
      return new it(d, p - d, 0, 0, 0);
    }
    let { firstLine: o, perLine: l, perChar: a } = this.heightMetrics(i, r), h = i.doc.lineAt(e), f = l + h.length * a, c = h.number - o, u = s + l * c + a * (h.from - r - c);
    return new it(h.from, h.length, Math.max(s, Math.min(u, s + this.height - f)), f, 0);
  }
  forEachLine(e, t, i, s, r, o) {
    e = Math.max(e, r), t = Math.min(t, r + this.length);
    let { firstLine: l, perLine: a, perChar: h } = this.heightMetrics(i, r);
    for (let f = e, c = s; f <= t; ) {
      let u = i.doc.lineAt(f);
      if (f == e) {
        let p = u.number - l;
        c += a * p + h * (e - r - p);
      }
      let d = a + h * u.length;
      o(new it(u.from, u.length, c, d, 0)), c += d, f = u.to + 1;
    }
  }
  replace(e, t, i) {
    let s = this.length - t;
    if (s > 0) {
      let r = i[i.length - 1];
      r instanceof de ? i[i.length - 1] = new de(r.length + s) : i.push(null, new de(s - 1));
    }
    if (e > 0) {
      let r = i[0];
      r instanceof de ? i[0] = new de(e + r.length) : i.unshift(new de(e - 1), null);
    }
    return _e.of(i);
  }
  decomposeLeft(e, t) {
    t.push(new de(e - 1), null);
  }
  decomposeRight(e, t) {
    t.push(null, new de(this.length - e - 1));
  }
  updateHeight(e, t = 0, i = !1, s) {
    let r = t + this.length;
    if (s && s.from <= t + this.length && s.more) {
      let o = [], l = Math.max(t, s.from), a = -1;
      for (s.from > t && o.push(new de(s.from - t - 1).updateHeight(e, t)); l <= r && s.more; ) {
        let f = e.doc.lineAt(l).length;
        o.length && o.push(null);
        let c = s.heights[s.index++];
        a == -1 ? a = c : Math.abs(c - a) >= rs && (a = -2);
        let u = new De(f, c);
        u.outdated = !1, o.push(u), l += f + 1;
      }
      l <= r && o.push(null, new de(r - l).updateHeight(e, l));
      let h = _e.of(o);
      return (a < 0 || Math.abs(h.height - this.height) >= rs || Math.abs(a - this.heightMetrics(e, t).perLine) >= rs) && (e.heightChanged = !0), h;
    } else
      (i || this.outdated) && (this.setHeight(e, e.heightForGap(t, t + this.length)), this.outdated = !1);
    return this;
  }
  toString() {
    return `gap(${this.length})`;
  }
}
class Vp extends _e {
  constructor(e, t, i) {
    super(e.length + t + i.length, e.height + i.height, t | (e.outdated || i.outdated ? 2 : 0)), this.left = e, this.right = i, this.size = e.size + i.size;
  }
  get break() {
    return this.flags & 1;
  }
  blockAt(e, t, i, s) {
    let r = i + this.left.height;
    return e < r ? this.left.blockAt(e, t, i, s) : this.right.blockAt(e, t, r, s + this.left.length + this.break);
  }
  lineAt(e, t, i, s, r) {
    let o = s + this.left.height, l = r + this.left.length + this.break, a = t == $.ByHeight ? e < o : e < l, h = a ? this.left.lineAt(e, t, i, s, r) : this.right.lineAt(e, t, i, o, l);
    if (this.break || (a ? h.to < l : h.from > l))
      return h;
    let f = t == $.ByPosNoHeight ? $.ByPosNoHeight : $.ByPos;
    return a ? h.join(this.right.lineAt(l, f, i, o, l)) : this.left.lineAt(l, f, i, s, r).join(h);
  }
  forEachLine(e, t, i, s, r, o) {
    let l = s + this.left.height, a = r + this.left.length + this.break;
    if (this.break)
      e < a && this.left.forEachLine(e, t, i, s, r, o), t >= a && this.right.forEachLine(e, t, i, l, a, o);
    else {
      let h = this.lineAt(a, $.ByPos, i, s, r);
      e < h.from && this.left.forEachLine(e, h.from - 1, i, s, r, o), h.to >= e && h.from <= t && o(h), t > h.to && this.right.forEachLine(h.to + 1, t, i, l, a, o);
    }
  }
  replace(e, t, i) {
    let s = this.left.length + this.break;
    if (t < s)
      return this.balanced(this.left.replace(e, t, i), this.right);
    if (e > this.left.length)
      return this.balanced(this.left, this.right.replace(e - s, t - s, i));
    let r = [];
    e > 0 && this.decomposeLeft(e, r);
    let o = r.length;
    for (let l of i)
      r.push(l);
    if (e > 0 && ia(r, o - 1), t < this.length) {
      let l = r.length;
      this.decomposeRight(t, r), ia(r, l);
    }
    return _e.of(r);
  }
  decomposeLeft(e, t) {
    let i = this.left.length;
    if (e <= i)
      return this.left.decomposeLeft(e, t);
    t.push(this.left), this.break && (i++, e >= i && t.push(null)), e > i && this.right.decomposeLeft(e - i, t);
  }
  decomposeRight(e, t) {
    let i = this.left.length, s = i + this.break;
    if (e >= s)
      return this.right.decomposeRight(e - s, t);
    e < i && this.left.decomposeRight(e, t), this.break && e < s && t.push(null), t.push(this.right);
  }
  balanced(e, t) {
    return e.size > 2 * t.size || t.size > 2 * e.size ? _e.of(this.break ? [e, null, t] : [e, t]) : (this.left = e, this.right = t, this.height = e.height + t.height, this.outdated = e.outdated || t.outdated, this.size = e.size + t.size, this.length = e.length + this.break + t.length, this);
  }
  updateHeight(e, t = 0, i = !1, s) {
    let { left: r, right: o } = this, l = t + r.length + this.break, a = null;
    return s && s.from <= t + r.length && s.more ? a = r = r.updateHeight(e, t, i, s) : r.updateHeight(e, t, i), s && s.from <= l + o.length && s.more ? a = o = o.updateHeight(e, l, i, s) : o.updateHeight(e, l, i), a ? this.balanced(r, o) : (this.height = this.left.height + this.right.height, this.outdated = !1, this);
  }
  toString() {
    return this.left + (this.break ? " " : "-") + this.right;
  }
}
function ia(n, e) {
  let t, i;
  n[e] == null && (t = n[e - 1]) instanceof de && (i = n[e + 1]) instanceof de && n.splice(e - 1, 3, new de(t.length + 1 + i.length));
}
const Wp = 5;
class zo {
  constructor(e, t) {
    this.pos = e, this.oracle = t, this.nodes = [], this.lineStart = -1, this.lineEnd = -1, this.covering = null, this.writtenTo = e;
  }
  get isCovered() {
    return this.covering && this.nodes[this.nodes.length - 1] == this.covering;
  }
  span(e, t) {
    if (this.lineStart > -1) {
      let i = Math.min(t, this.lineEnd), s = this.nodes[this.nodes.length - 1];
      s instanceof De ? s.length += i - this.pos : (i > this.pos || !this.isCovered) && this.nodes.push(new De(i - this.pos, -1)), this.writtenTo = i, t > i && (this.nodes.push(null), this.writtenTo++, this.lineStart = -1);
    }
    this.pos = t;
  }
  point(e, t, i) {
    if (e < t || i.heightRelevant) {
      let s = i.widget ? i.widget.estimatedHeight : 0, r = i.widget ? i.widget.lineBreaks : 0;
      s < 0 && (s = this.oracle.lineHeight);
      let o = t - e;
      i.block ? this.addBlock(new pc(o, s, i)) : (o || r || s >= Wp) && this.addLineDeco(s, r, o);
    } else
      t > e && this.span(e, t);
    this.lineEnd > -1 && this.lineEnd < this.pos && (this.lineEnd = this.oracle.doc.lineAt(this.pos).to);
  }
  enterLine() {
    if (this.lineStart > -1)
      return;
    let { from: e, to: t } = this.oracle.doc.lineAt(this.pos);
    this.lineStart = e, this.lineEnd = t, this.writtenTo < e && ((this.writtenTo < e - 1 || this.nodes[this.nodes.length - 1] == null) && this.nodes.push(this.blankContent(this.writtenTo, e - 1)), this.nodes.push(null)), this.pos > e && this.nodes.push(new De(this.pos - e, -1)), this.writtenTo = this.pos;
  }
  blankContent(e, t) {
    let i = new de(t - e);
    return this.oracle.doc.lineAt(e).to == t && (i.flags |= 4), i;
  }
  ensureLine() {
    this.enterLine();
    let e = this.nodes.length ? this.nodes[this.nodes.length - 1] : null;
    if (e instanceof De)
      return e;
    let t = new De(0, -1);
    return this.nodes.push(t), t;
  }
  addBlock(e) {
    this.enterLine();
    let t = e.deco;
    t && t.startSide > 0 && !this.isCovered && this.ensureLine(), this.nodes.push(e), this.writtenTo = this.pos = this.pos + e.length, t && t.endSide > 0 && (this.covering = e);
  }
  addLineDeco(e, t, i) {
    let s = this.ensureLine();
    s.length += i, s.collapsed += i, s.widgetHeight = Math.max(s.widgetHeight, e), s.breaks += t, this.writtenTo = this.pos = this.pos + i;
  }
  finish(e) {
    let t = this.nodes.length == 0 ? null : this.nodes[this.nodes.length - 1];
    this.lineStart > -1 && !(t instanceof De) && !this.isCovered ? this.nodes.push(new De(0, -1)) : (this.writtenTo < this.pos || t == null) && this.nodes.push(this.blankContent(this.writtenTo, this.pos));
    let i = e;
    for (let s of this.nodes)
      s instanceof De && s.updateHeight(this.oracle, i), i += s ? s.length : 1;
    return this.nodes;
  }
  // Always called with a region that on both sides either stretches
  // to a line break or the end of the document.
  // The returned array uses null to indicate line breaks, but never
  // starts or ends in a line break, or has multiple line breaks next
  // to each other.
  static build(e, t, i, s) {
    let r = new zo(i, e);
    return Y.spans(t, i, s, r, 0), r.finish(i);
  }
}
function zp(n, e, t) {
  let i = new qp();
  return Y.compare(n, e, t, i, 0), i.changes;
}
class qp {
  constructor() {
    this.changes = [];
  }
  compareRange() {
  }
  comparePoint(e, t, i, s) {
    (e < t || i && i.heightRelevant || s && s.heightRelevant) && eo(e, t, this.changes, 5);
  }
}
function jp(n, e) {
  let t = n.getBoundingClientRect(), i = n.ownerDocument, s = i.defaultView || window, r = Math.max(0, t.left), o = Math.min(s.innerWidth, t.right), l = Math.max(0, t.top), a = Math.min(s.innerHeight, t.bottom);
  for (let h = n.parentNode; h && h != i.body; )
    if (h.nodeType == 1) {
      let f = h, c = window.getComputedStyle(f);
      if ((f.scrollHeight > f.clientHeight || f.scrollWidth > f.clientWidth) && c.overflow != "visible") {
        let u = f.getBoundingClientRect();
        r = Math.max(r, u.left), o = Math.min(o, u.right), l = Math.max(l, u.top), a = h == n.parentNode ? u.bottom : Math.min(a, u.bottom);
      }
      h = c.position == "absolute" || c.position == "fixed" ? f.offsetParent : f.parentNode;
    } else if (h.nodeType == 11)
      h = h.host;
    else
      break;
  return {
    left: r - t.left,
    right: Math.max(r, o) - t.left,
    top: l - (t.top + e),
    bottom: Math.max(l, a) - (t.top + e)
  };
}
function Kp(n, e) {
  let t = n.getBoundingClientRect();
  return {
    left: 0,
    right: t.right - t.left,
    top: e,
    bottom: t.bottom - (t.top + e)
  };
}
class ir {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.size = i;
  }
  static same(e, t) {
    if (e.length != t.length)
      return !1;
    for (let i = 0; i < e.length; i++) {
      let s = e[i], r = t[i];
      if (s.from != r.from || s.to != r.to || s.size != r.size)
        return !1;
    }
    return !0;
  }
  draw(e, t) {
    return q.replace({
      widget: new Up(this.size * (t ? e.scaleY : e.scaleX), t)
    }).range(this.from, this.to);
  }
}
class Up extends ct {
  constructor(e, t) {
    super(), this.size = e, this.vertical = t;
  }
  eq(e) {
    return e.size == this.size && e.vertical == this.vertical;
  }
  toDOM() {
    let e = document.createElement("div");
    return this.vertical ? e.style.height = this.size + "px" : (e.style.width = this.size + "px", e.style.height = "2px", e.style.display = "inline-block"), e;
  }
  get estimatedHeight() {
    return this.vertical ? this.size : -1;
  }
}
class na {
  constructor(e) {
    this.state = e, this.pixelViewport = { left: 0, right: window.innerWidth, top: 0, bottom: 0 }, this.inView = !0, this.paddingTop = 0, this.paddingBottom = 0, this.contentDOMWidth = 0, this.contentDOMHeight = 0, this.editorHeight = 0, this.editorWidth = 0, this.scrollTop = 0, this.scrolledToBottom = !0, this.scaleX = 1, this.scaleY = 1, this.scrollAnchorPos = 0, this.scrollAnchorHeight = -1, this.scaler = sa, this.scrollTarget = null, this.printing = !1, this.mustMeasureContent = !0, this.defaultTextDirection = te.LTR, this.visibleRanges = [], this.mustEnforceCursorAssoc = !1;
    let t = e.facet(Vo).some((i) => typeof i != "function" && i.class == "cm-lineWrapping");
    this.heightOracle = new Fp(t), this.stateDeco = e.facet(dn).filter((i) => typeof i != "function"), this.heightMap = _e.empty().applyChanges(this.stateDeco, J.empty, this.heightOracle.setDoc(e.doc), [new Fe(0, 0, 0, e.doc.length)]), this.viewport = this.getViewport(0, null), this.updateViewportLines(), this.updateForViewport(), this.lineGaps = this.ensureLineGaps([]), this.lineGapDeco = q.set(this.lineGaps.map((i) => i.draw(this, !1))), this.computeVisibleRanges();
  }
  updateForViewport() {
    let e = [this.viewport], { main: t } = this.state.selection;
    for (let i = 0; i <= 1; i++) {
      let s = i ? t.head : t.anchor;
      if (!e.some(({ from: r, to: o }) => s >= r && s <= o)) {
        let { from: r, to: o } = this.lineBlockAt(s);
        e.push(new Rn(r, o));
      }
    }
    this.viewports = e.sort((i, s) => i.from - s.from), this.scaler = this.heightMap.height <= 7e6 ? sa : new Jp(this.heightOracle, this.heightMap, this.viewports);
  }
  updateViewportLines() {
    this.viewportLines = [], this.heightMap.forEachLine(this.viewport.from, this.viewport.to, this.heightOracle.setDoc(this.state.doc), 0, 0, (e) => {
      this.viewportLines.push(this.scaler.scale == 1 ? e : Zi(e, this.scaler));
    });
  }
  update(e, t = null) {
    this.state = e.state;
    let i = this.stateDeco;
    this.stateDeco = this.state.facet(dn).filter((f) => typeof f != "function");
    let s = e.changedRanges, r = Fe.extendWithRanges(s, zp(i, this.stateDeco, e ? e.changes : fe.empty(this.state.doc.length))), o = this.heightMap.height, l = this.scrolledToBottom ? null : this.scrollAnchorAt(this.scrollTop);
    this.heightMap = this.heightMap.applyChanges(this.stateDeco, e.startState.doc, this.heightOracle.setDoc(this.state.doc), r), this.heightMap.height != o && (e.flags |= 2), l ? (this.scrollAnchorPos = e.changes.mapPos(l.from, -1), this.scrollAnchorHeight = l.top) : (this.scrollAnchorPos = -1, this.scrollAnchorHeight = this.heightMap.height);
    let a = r.length ? this.mapViewport(this.viewport, e.changes) : this.viewport;
    (t && (t.range.head < a.from || t.range.head > a.to) || !this.viewportIsAppropriate(a)) && (a = this.getViewport(0, t));
    let h = !e.changes.empty || e.flags & 2 || a.from != this.viewport.from || a.to != this.viewport.to;
    this.viewport = a, this.updateForViewport(), h && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(this.mapLineGaps(this.lineGaps, e.changes))), e.flags |= this.computeVisibleRanges(), t && (this.scrollTarget = t), !this.mustEnforceCursorAssoc && e.selectionSet && e.view.lineWrapping && e.state.selection.main.empty && e.state.selection.main.assoc && !e.state.facet(Xf) && (this.mustEnforceCursorAssoc = !0);
  }
  measure(e) {
    let t = e.contentDOM, i = window.getComputedStyle(t), s = this.heightOracle, r = i.whiteSpace;
    this.defaultTextDirection = i.direction == "rtl" ? te.RTL : te.LTR;
    let o = this.heightOracle.mustRefreshForWrapping(r), l = t.getBoundingClientRect(), a = o || this.mustMeasureContent || this.contentDOMHeight != l.height;
    this.contentDOMHeight = l.height, this.mustMeasureContent = !1;
    let h = 0, f = 0;
    if (l.width && l.height) {
      let { scaleX: S, scaleY: _ } = Cf(t, l);
      (this.scaleX != S || this.scaleY != _) && (this.scaleX = S, this.scaleY = _, h |= 8, o = a = !0);
    }
    let c = (parseInt(i.paddingTop) || 0) * this.scaleY, u = (parseInt(i.paddingBottom) || 0) * this.scaleY;
    (this.paddingTop != c || this.paddingBottom != u) && (this.paddingTop = c, this.paddingBottom = u, h |= 10), this.editorWidth != e.scrollDOM.clientWidth && (s.lineWrapping && (a = !0), this.editorWidth = e.scrollDOM.clientWidth, h |= 8);
    let d = e.scrollDOM.scrollTop * this.scaleY;
    this.scrollTop != d && (this.scrollAnchorHeight = -1, this.scrollTop = d), this.scrolledToBottom = Tf(e.scrollDOM);
    let p = (this.printing ? Kp : jp)(t, this.paddingTop), m = p.top - this.pixelViewport.top, g = p.bottom - this.pixelViewport.bottom;
    this.pixelViewport = p;
    let y = this.pixelViewport.bottom > this.pixelViewport.top && this.pixelViewport.right > this.pixelViewport.left;
    if (y != this.inView && (this.inView = y, y && (a = !0)), !this.inView && !this.scrollTarget)
      return 0;
    let k = l.width;
    if ((this.contentDOMWidth != k || this.editorHeight != e.scrollDOM.clientHeight) && (this.contentDOMWidth = l.width, this.editorHeight = e.scrollDOM.clientHeight, h |= 8), a) {
      let S = e.docView.measureVisibleLineHeights(this.viewport);
      if (s.mustRefreshForHeights(S) && (o = !0), o || s.lineWrapping && Math.abs(k - this.contentDOMWidth) > s.charWidth) {
        let { lineHeight: _, charWidth: v, textHeight: x } = e.docView.measureTextSize();
        o = _ > 0 && s.refresh(r, _, v, x, k / v, S), o && (e.docView.minWidth = 0, h |= 8);
      }
      m > 0 && g > 0 ? f = Math.max(m, g) : m < 0 && g < 0 && (f = Math.min(m, g)), s.heightChanged = !1;
      for (let _ of this.viewports) {
        let v = _.from == this.viewport.from ? S : e.docView.measureVisibleLineHeights(_);
        this.heightMap = (o ? _e.empty().applyChanges(this.stateDeco, J.empty, this.heightOracle, [new Fe(0, 0, 0, e.state.doc.length)]) : this.heightMap).updateHeight(s, 0, o, new Hp(_.from, v));
      }
      s.heightChanged && (h |= 2);
    }
    let w = !this.viewportIsAppropriate(this.viewport, f) || this.scrollTarget && (this.scrollTarget.range.head < this.viewport.from || this.scrollTarget.range.head > this.viewport.to);
    return w && (this.viewport = this.getViewport(f, this.scrollTarget)), this.updateForViewport(), (h & 2 || w) && this.updateViewportLines(), (this.lineGaps.length || this.viewport.to - this.viewport.from > 4e3) && this.updateLineGaps(this.ensureLineGaps(o ? [] : this.lineGaps, e)), h |= this.computeVisibleRanges(), this.mustEnforceCursorAssoc && (this.mustEnforceCursorAssoc = !1, e.docView.enforceCursorAssoc()), h;
  }
  get visibleTop() {
    return this.scaler.fromDOM(this.pixelViewport.top);
  }
  get visibleBottom() {
    return this.scaler.fromDOM(this.pixelViewport.bottom);
  }
  getViewport(e, t) {
    let i = 0.5 - Math.max(-0.5, Math.min(0.5, e / 1e3 / 2)), s = this.heightMap, r = this.heightOracle, { visibleTop: o, visibleBottom: l } = this, a = new Rn(s.lineAt(o - i * 1e3, $.ByHeight, r, 0, 0).from, s.lineAt(l + (1 - i) * 1e3, $.ByHeight, r, 0, 0).to);
    if (t) {
      let { head: h } = t.range;
      if (h < a.from || h > a.to) {
        let f = Math.min(this.editorHeight, this.pixelViewport.bottom - this.pixelViewport.top), c = s.lineAt(h, $.ByPos, r, 0, 0), u;
        t.y == "center" ? u = (c.top + c.bottom) / 2 - f / 2 : t.y == "start" || t.y == "nearest" && h < a.from ? u = c.top : u = c.bottom - f, a = new Rn(s.lineAt(u - 1e3 / 2, $.ByHeight, r, 0, 0).from, s.lineAt(u + f + 1e3 / 2, $.ByHeight, r, 0, 0).to);
      }
    }
    return a;
  }
  mapViewport(e, t) {
    let i = t.mapPos(e.from, -1), s = t.mapPos(e.to, 1);
    return new Rn(this.heightMap.lineAt(i, $.ByPos, this.heightOracle, 0, 0).from, this.heightMap.lineAt(s, $.ByPos, this.heightOracle, 0, 0).to);
  }
  // Checks if a given viewport covers the visible part of the
  // document and not too much beyond that.
  viewportIsAppropriate({ from: e, to: t }, i = 0) {
    if (!this.inView)
      return !0;
    let { top: s } = this.heightMap.lineAt(e, $.ByPos, this.heightOracle, 0, 0), { bottom: r } = this.heightMap.lineAt(t, $.ByPos, this.heightOracle, 0, 0), { visibleTop: o, visibleBottom: l } = this;
    return (e == 0 || s <= o - Math.max(10, Math.min(
      -i,
      250
      /* VP.MaxCoverMargin */
    ))) && (t == this.state.doc.length || r >= l + Math.max(10, Math.min(
      i,
      250
      /* VP.MaxCoverMargin */
    ))) && s > o - 2 * 1e3 && r < l + 2 * 1e3;
  }
  mapLineGaps(e, t) {
    if (!e.length || t.empty)
      return e;
    let i = [];
    for (let s of e)
      t.touchesRange(s.from, s.to) || i.push(new ir(t.mapPos(s.from), t.mapPos(s.to), s.size));
    return i;
  }
  // Computes positions in the viewport where the start or end of a
  // line should be hidden, trying to reuse existing line gaps when
  // appropriate to avoid unneccesary redraws.
  // Uses crude character-counting for the positioning and sizing,
  // since actual DOM coordinates aren't always available and
  // predictable. Relies on generous margins (see LG.Margin) to hide
  // the artifacts this might produce from the user.
  ensureLineGaps(e, t) {
    let i = this.heightOracle.lineWrapping, s = i ? 1e4 : 2e3, r = s >> 1, o = s << 1;
    if (this.defaultTextDirection != te.LTR && !i)
      return [];
    let l = [], a = (h, f, c, u) => {
      if (f - h < r)
        return;
      let d = this.state.selection.main, p = [d.from];
      d.empty || p.push(d.to);
      for (let g of p)
        if (g > h && g < f) {
          a(h, g - 10, c, u), a(g + 10, f, c, u);
          return;
        }
      let m = Yp(e, (g) => g.from >= c.from && g.to <= c.to && Math.abs(g.from - h) < r && Math.abs(g.to - f) < r && !p.some((y) => g.from < y && g.to > y));
      if (!m) {
        if (f < c.to && t && i && t.visibleRanges.some((g) => g.from <= f && g.to >= f)) {
          let g = t.moveToLineBoundary(C.cursor(f), !1, !0).head;
          g > h && (f = g);
        }
        m = new ir(h, f, this.gapSize(c, h, f, u));
      }
      l.push(m);
    };
    for (let h of this.viewportLines) {
      if (h.length < o)
        continue;
      let f = Gp(h.from, h.to, this.stateDeco);
      if (f.total < o)
        continue;
      let c = this.scrollTarget ? this.scrollTarget.range.head : null, u, d;
      if (i) {
        let p = s / this.heightOracle.lineLength * this.heightOracle.lineHeight, m, g;
        if (c != null) {
          let y = Nn(f, c), k = ((this.visibleBottom - this.visibleTop) / 2 + p) / h.height;
          m = y - k, g = y + k;
        } else
          m = (this.visibleTop - h.top - p) / h.height, g = (this.visibleBottom - h.top + p) / h.height;
        u = In(f, m), d = In(f, g);
      } else {
        let p = f.total * this.heightOracle.charWidth, m = s * this.heightOracle.charWidth, g, y;
        if (c != null) {
          let k = Nn(f, c), w = ((this.pixelViewport.right - this.pixelViewport.left) / 2 + m) / p;
          g = k - w, y = k + w;
        } else
          g = (this.pixelViewport.left - m) / p, y = (this.pixelViewport.right + m) / p;
        u = In(f, g), d = In(f, y);
      }
      u > h.from && a(h.from, u, h, f), d < h.to && a(d, h.to, h, f);
    }
    return l;
  }
  gapSize(e, t, i, s) {
    let r = Nn(s, i) - Nn(s, t);
    return this.heightOracle.lineWrapping ? e.height * r : s.total * this.heightOracle.charWidth * r;
  }
  updateLineGaps(e) {
    ir.same(e, this.lineGaps) || (this.lineGaps = e, this.lineGapDeco = q.set(e.map((t) => t.draw(this, this.heightOracle.lineWrapping))));
  }
  computeVisibleRanges() {
    let e = this.stateDeco;
    this.lineGaps.length && (e = e.concat(this.lineGapDeco));
    let t = [];
    Y.spans(e, this.viewport.from, this.viewport.to, {
      span(s, r) {
        t.push({ from: s, to: r });
      },
      point() {
      }
    }, 20);
    let i = t.length != this.visibleRanges.length || this.visibleRanges.some((s, r) => s.from != t[r].from || s.to != t[r].to);
    return this.visibleRanges = t, i ? 4 : 0;
  }
  lineBlockAt(e) {
    return e >= this.viewport.from && e <= this.viewport.to && this.viewportLines.find((t) => t.from <= e && t.to >= e) || Zi(this.heightMap.lineAt(e, $.ByPos, this.heightOracle, 0, 0), this.scaler);
  }
  lineBlockAtHeight(e) {
    return Zi(this.heightMap.lineAt(this.scaler.fromDOM(e), $.ByHeight, this.heightOracle, 0, 0), this.scaler);
  }
  scrollAnchorAt(e) {
    let t = this.lineBlockAtHeight(e + 8);
    return t.from >= this.viewport.from || this.viewportLines[0].top - e > 200 ? t : this.viewportLines[0];
  }
  elementAtHeight(e) {
    return Zi(this.heightMap.blockAt(this.scaler.fromDOM(e), this.heightOracle, 0, 0), this.scaler);
  }
  get docHeight() {
    return this.scaler.toDOM(this.heightMap.height);
  }
  get contentHeight() {
    return this.docHeight + this.paddingTop + this.paddingBottom;
  }
}
class Rn {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
function Gp(n, e, t) {
  let i = [], s = n, r = 0;
  return Y.spans(t, n, e, {
    span() {
    },
    point(o, l) {
      o > s && (i.push({ from: s, to: o }), r += o - s), s = l;
    }
  }, 20), s < e && (i.push({ from: s, to: e }), r += e - s), { total: r, ranges: i };
}
function In({ total: n, ranges: e }, t) {
  if (t <= 0)
    return e[0].from;
  if (t >= 1)
    return e[e.length - 1].to;
  let i = Math.floor(n * t);
  for (let s = 0; ; s++) {
    let { from: r, to: o } = e[s], l = o - r;
    if (i <= l)
      return r + i;
    i -= l;
  }
}
function Nn(n, e) {
  let t = 0;
  for (let { from: i, to: s } of n.ranges) {
    if (e <= s) {
      t += e - i;
      break;
    }
    t += s - i;
  }
  return t / n.total;
}
function Yp(n, e) {
  for (let t of n)
    if (e(t))
      return t;
}
const sa = {
  toDOM(n) {
    return n;
  },
  fromDOM(n) {
    return n;
  },
  scale: 1
};
class Jp {
  constructor(e, t, i) {
    let s = 0, r = 0, o = 0;
    this.viewports = i.map(({ from: l, to: a }) => {
      let h = t.lineAt(l, $.ByPos, e, 0, 0).top, f = t.lineAt(a, $.ByPos, e, 0, 0).bottom;
      return s += f - h, { from: l, to: a, top: h, bottom: f, domTop: 0, domBottom: 0 };
    }), this.scale = (7e6 - s) / (t.height - s);
    for (let l of this.viewports)
      l.domTop = o + (l.top - r) * this.scale, o = l.domBottom = l.domTop + (l.bottom - l.top), r = l.bottom;
  }
  toDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.top)
        return s + (e - i) * this.scale;
      if (e <= r.bottom)
        return r.domTop + (e - r.top);
      i = r.bottom, s = r.domBottom;
    }
  }
  fromDOM(e) {
    for (let t = 0, i = 0, s = 0; ; t++) {
      let r = t < this.viewports.length ? this.viewports[t] : null;
      if (!r || e < r.domTop)
        return i + (e - s) / this.scale;
      if (e <= r.domBottom)
        return r.top + (e - r.domTop);
      i = r.bottom, s = r.domBottom;
    }
  }
}
function Zi(n, e) {
  if (e.scale == 1)
    return n;
  let t = e.toDOM(n.top), i = e.toDOM(n.bottom);
  return new it(n.from, n.length, t, i - t, Array.isArray(n._content) ? n._content.map((s) => Zi(s, e)) : n._content);
}
const Fn = /* @__PURE__ */ O.define({ combine: (n) => n.join(" ") }), ao = /* @__PURE__ */ O.define({ combine: (n) => n.indexOf(!0) > -1 }), ho = /* @__PURE__ */ Et.newName(), mc = /* @__PURE__ */ Et.newName(), gc = /* @__PURE__ */ Et.newName(), bc = { "&light": "." + mc, "&dark": "." + gc };
function fo(n, e, t) {
  return new Et(e, {
    finish(i) {
      return /&/.test(i) ? i.replace(/&\w*/, (s) => {
        if (s == "&")
          return n;
        if (!t || !t[s])
          throw new RangeError(`Unsupported selector: ${s}`);
        return t[s];
      }) : n + " " + i;
    }
  });
}
const Xp = /* @__PURE__ */ fo("." + ho, {
  "&": {
    position: "relative !important",
    boxSizing: "border-box",
    "&.cm-focused": {
      // Provide a simple default outline to make sure a focused
      // editor is visually distinct. Can't leave the default behavior
      // because that will apply to the content element, which is
      // inside the scrollable container and doesn't include the
      // gutters. We also can't use an 'auto' outline, since those
      // are, for some reason, drawn behind the element content, which
      // will cause things like the active line background to cover
      // the outline (#297).
      outline: "1px dotted #212121"
    },
    display: "flex !important",
    flexDirection: "column"
  },
  ".cm-scroller": {
    display: "flex !important",
    alignItems: "flex-start !important",
    fontFamily: "monospace",
    lineHeight: 1.4,
    height: "100%",
    overflowX: "auto",
    position: "relative",
    zIndex: 0
  },
  ".cm-content": {
    margin: 0,
    flexGrow: 2,
    flexShrink: 0,
    display: "block",
    whiteSpace: "pre",
    wordWrap: "normal",
    // https://github.com/codemirror/dev/issues/456
    boxSizing: "border-box",
    minHeight: "100%",
    padding: "4px 0",
    outline: "none",
    "&[contenteditable=true]": {
      WebkitUserModify: "read-write-plaintext-only"
    }
  },
  ".cm-lineWrapping": {
    whiteSpace_fallback: "pre-wrap",
    // For IE
    whiteSpace: "break-spaces",
    wordBreak: "break-word",
    // For Safari, which doesn't support overflow-wrap: anywhere
    overflowWrap: "anywhere",
    flexShrink: 1
  },
  "&light .cm-content": { caretColor: "black" },
  "&dark .cm-content": { caretColor: "white" },
  ".cm-line": {
    display: "block",
    padding: "0 2px 0 6px"
  },
  ".cm-layer": {
    position: "absolute",
    left: 0,
    top: 0,
    contain: "size style",
    "& > *": {
      position: "absolute"
    }
  },
  "&light .cm-selectionBackground": {
    background: "#d9d9d9"
  },
  "&dark .cm-selectionBackground": {
    background: "#222"
  },
  "&light.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#d7d4f0"
  },
  "&dark.cm-focused > .cm-scroller > .cm-selectionLayer .cm-selectionBackground": {
    background: "#233"
  },
  ".cm-cursorLayer": {
    pointerEvents: "none"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer": {
    animation: "steps(1) cm-blink 1.2s infinite"
  },
  // Two animations defined so that we can switch between them to
  // restart the animation without forcing another style
  // recomputation.
  "@keyframes cm-blink": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  "@keyframes cm-blink2": { "0%": {}, "50%": { opacity: 0 }, "100%": {} },
  ".cm-cursor, .cm-dropCursor": {
    borderLeft: "1.2px solid black",
    marginLeft: "-0.6px",
    pointerEvents: "none"
  },
  ".cm-cursor": {
    display: "none"
  },
  "&dark .cm-cursor": {
    borderLeftColor: "#444"
  },
  ".cm-dropCursor": {
    position: "absolute"
  },
  "&.cm-focused > .cm-scroller > .cm-cursorLayer .cm-cursor": {
    display: "block"
  },
  ".cm-iso": {
    unicodeBidi: "isolate"
  },
  ".cm-announced": {
    position: "fixed",
    top: "-10000px"
  },
  "@media print": {
    ".cm-announced": { display: "none" }
  },
  "&light .cm-activeLine": { backgroundColor: "#cceeff44" },
  "&dark .cm-activeLine": { backgroundColor: "#99eeff33" },
  "&light .cm-specialChar": { color: "red" },
  "&dark .cm-specialChar": { color: "#f78" },
  ".cm-gutters": {
    flexShrink: 0,
    display: "flex",
    height: "100%",
    boxSizing: "border-box",
    insetInlineStart: 0,
    zIndex: 200
  },
  "&light .cm-gutters": {
    backgroundColor: "#f5f5f5",
    color: "#6c6c6c",
    borderRight: "1px solid #ddd"
  },
  "&dark .cm-gutters": {
    backgroundColor: "#333338",
    color: "#ccc"
  },
  ".cm-gutter": {
    display: "flex !important",
    // Necessary -- prevents margin collapsing
    flexDirection: "column",
    flexShrink: 0,
    boxSizing: "border-box",
    minHeight: "100%",
    overflow: "hidden"
  },
  ".cm-gutterElement": {
    boxSizing: "border-box"
  },
  ".cm-lineNumbers .cm-gutterElement": {
    padding: "0 3px 0 5px",
    minWidth: "20px",
    textAlign: "right",
    whiteSpace: "nowrap"
  },
  "&light .cm-activeLineGutter": {
    backgroundColor: "#e2f2ff"
  },
  "&dark .cm-activeLineGutter": {
    backgroundColor: "#222227"
  },
  ".cm-panels": {
    boxSizing: "border-box",
    position: "sticky",
    left: 0,
    right: 0
  },
  "&light .cm-panels": {
    backgroundColor: "#f5f5f5",
    color: "black"
  },
  "&light .cm-panels-top": {
    borderBottom: "1px solid #ddd"
  },
  "&light .cm-panels-bottom": {
    borderTop: "1px solid #ddd"
  },
  "&dark .cm-panels": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tab": {
    display: "inline-block",
    overflow: "hidden",
    verticalAlign: "bottom"
  },
  ".cm-widgetBuffer": {
    verticalAlign: "text-top",
    height: "1em",
    width: 0,
    display: "inline"
  },
  ".cm-placeholder": {
    color: "#888",
    display: "inline-block",
    verticalAlign: "top"
  },
  ".cm-highlightSpace:before": {
    content: "attr(data-display)",
    position: "absolute",
    pointerEvents: "none",
    color: "#888"
  },
  ".cm-highlightTab": {
    backgroundImage: `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="200" height="20"><path stroke="%23888" stroke-width="1" fill="none" d="M1 10H196L190 5M190 15L196 10M197 4L197 16"/></svg>')`,
    backgroundSize: "auto 100%",
    backgroundPosition: "right 90%",
    backgroundRepeat: "no-repeat"
  },
  ".cm-trailingSpace": {
    backgroundColor: "#ff332255"
  },
  ".cm-button": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    padding: ".2em 1em",
    borderRadius: "1px"
  },
  "&light .cm-button": {
    backgroundImage: "linear-gradient(#eff1f5, #d9d9df)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#b4b4b4, #d0d3d6)"
    }
  },
  "&dark .cm-button": {
    backgroundImage: "linear-gradient(#393939, #111)",
    border: "1px solid #888",
    "&:active": {
      backgroundImage: "linear-gradient(#111, #333)"
    }
  },
  ".cm-textfield": {
    verticalAlign: "middle",
    color: "inherit",
    fontSize: "70%",
    border: "1px solid silver",
    padding: ".2em .5em"
  },
  "&light .cm-textfield": {
    backgroundColor: "white"
  },
  "&dark .cm-textfield": {
    border: "1px solid #555",
    backgroundColor: "inherit"
  }
}, bc), Qi = "￿";
class Zp {
  constructor(e, t) {
    this.points = e, this.text = "", this.lineSeparator = t.facet(G.lineSeparator);
  }
  append(e) {
    this.text += e;
  }
  lineBreak() {
    this.text += Qi;
  }
  readRange(e, t) {
    if (!e)
      return this;
    let i = e.parentNode;
    for (let s = e; ; ) {
      this.findPointBefore(i, s);
      let r = this.text.length;
      this.readNode(s);
      let o = s.nextSibling;
      if (o == t)
        break;
      let l = ee.get(s), a = ee.get(o);
      (l && a ? l.breakAfter : (l ? l.breakAfter : ra(s)) || ra(o) && (s.nodeName != "BR" || s.cmIgnore) && this.text.length > r) && this.lineBreak(), s = o;
    }
    return this.findPointBefore(i, t), this;
  }
  readTextNode(e) {
    let t = e.nodeValue;
    for (let i of this.points)
      i.node == e && (i.pos = this.text.length + Math.min(i.offset, t.length));
    for (let i = 0, s = this.lineSeparator ? null : /\r\n?|\n/g; ; ) {
      let r = -1, o = 1, l;
      if (this.lineSeparator ? (r = t.indexOf(this.lineSeparator, i), o = this.lineSeparator.length) : (l = s.exec(t)) && (r = l.index, o = l[0].length), this.append(t.slice(i, r < 0 ? t.length : r)), r < 0)
        break;
      if (this.lineBreak(), o > 1)
        for (let a of this.points)
          a.node == e && a.pos > this.text.length && (a.pos -= o - 1);
      i = r + o;
    }
  }
  readNode(e) {
    if (e.cmIgnore)
      return;
    let t = ee.get(e), i = t && t.overrideDOMText;
    if (i != null) {
      this.findPointInside(e, i.length);
      for (let s = i.iter(); !s.next().done; )
        s.lineBreak ? this.lineBreak() : this.append(s.value);
    } else
      e.nodeType == 3 ? this.readTextNode(e) : e.nodeName == "BR" ? e.nextSibling && this.lineBreak() : e.nodeType == 1 && this.readRange(e.firstChild, null);
  }
  findPointBefore(e, t) {
    for (let i of this.points)
      i.node == e && e.childNodes[i.offset] == t && (i.pos = this.text.length);
  }
  findPointInside(e, t) {
    for (let i of this.points)
      (e.nodeType == 3 ? i.node == e : e.contains(i.node)) && (i.pos = this.text.length + (Qp(e, i.node, i.offset) ? t : 0));
  }
}
function Qp(n, e, t) {
  for (; ; ) {
    if (!e || t < yt(e))
      return !1;
    if (e == n)
      return !0;
    t = un(e) + 1, e = e.parentNode;
  }
}
function ra(n) {
  return n.nodeType == 1 && /^(DIV|P|LI|UL|OL|BLOCKQUOTE|DD|DT|H\d|SECTION|PRE)$/.test(n.nodeName);
}
class oa {
  constructor(e, t) {
    this.node = e, this.offset = t, this.pos = -1;
  }
}
class $p {
  constructor(e, t, i, s) {
    this.typeOver = s, this.bounds = null, this.text = "";
    let { impreciseHead: r, impreciseAnchor: o } = e.docView;
    if (e.state.readOnly && t > -1)
      this.newSel = null;
    else if (t > -1 && (this.bounds = e.docView.domBoundsAround(t, i, 0))) {
      let l = r || o ? [] : im(e), a = new Zp(l, e.state);
      a.readRange(this.bounds.startDOM, this.bounds.endDOM), this.text = a.text, this.newSel = nm(l, this.bounds.from);
    } else {
      let l = e.observer.selectionRange, a = r && r.node == l.focusNode && r.offset == l.focusOffset || !Yr(e.contentDOM, l.focusNode) ? e.state.selection.main.head : e.docView.posFromDOM(l.focusNode, l.focusOffset), h = o && o.node == l.anchorNode && o.offset == l.anchorOffset || !Yr(e.contentDOM, l.anchorNode) ? e.state.selection.main.anchor : e.docView.posFromDOM(l.anchorNode, l.anchorOffset), f = e.viewport;
      if (D.ios && e.state.selection.main.empty && a != h && (f.from > 0 || f.to < e.state.doc.length)) {
        let c = f.from - Math.min(a, h), u = f.to - Math.max(a, h);
        (c == 0 || c == 1) && (u == 0 || u == -1) && (a = 0, h = e.state.doc.length);
      }
      this.newSel = C.single(h, a);
    }
  }
}
function yc(n, e) {
  let t, { newSel: i } = e, s = n.state.selection.main, r = n.inputState.lastKeyTime > Date.now() - 100 ? n.inputState.lastKeyCode : -1;
  if (e.bounds) {
    let { from: o, to: l } = e.bounds, a = s.from, h = null;
    (r === 8 || D.android && e.text.length < l - o) && (a = s.to, h = "end");
    let f = tm(n.state.doc.sliceString(o, l, Qi), e.text, a - o, h);
    f && (D.chrome && r == 13 && f.toB == f.from + 2 && e.text.slice(f.from, f.toB) == Qi + Qi && f.toB--, t = {
      from: o + f.from,
      to: o + f.toA,
      insert: J.of(e.text.slice(f.from, f.toB).split(Qi))
    });
  } else
    i && (!n.hasFocus && n.state.facet(Is) || i.main.eq(s)) && (i = null);
  if (!t && !i)
    return !1;
  if (!t && e.typeOver && !s.empty && i && i.main.empty ? t = { from: s.from, to: s.to, insert: n.state.doc.slice(s.from, s.to) } : t && t.from >= s.from && t.to <= s.to && (t.from != s.from || t.to != s.to) && s.to - s.from - (t.to - t.from) <= 4 ? t = {
    from: s.from,
    to: s.to,
    insert: n.state.doc.slice(s.from, t.from).append(t.insert).append(n.state.doc.slice(t.to, s.to))
  } : (D.mac || D.android) && t && t.from == t.to && t.from == s.head - 1 && /^\. ?$/.test(t.insert.toString()) && n.contentDOM.getAttribute("autocorrect") == "off" ? (i && t.insert.length == 2 && (i = C.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: J.of([" "]) }) : D.chrome && t && t.from == t.to && t.from == s.head && t.insert.toString() == `
 ` && n.lineWrapping && (i && (i = C.single(i.main.anchor - 1, i.main.head - 1)), t = { from: s.from, to: s.to, insert: J.of([" "]) }), t) {
    if (D.ios && n.inputState.flushIOSKey() || D.android && (t.from == s.from && t.to == s.to && t.insert.length == 1 && t.insert.lines == 2 && xi(n.contentDOM, "Enter", 13) || (t.from == s.from - 1 && t.to == s.to && t.insert.length == 0 || r == 8 && t.insert.length < t.to - t.from && t.to > s.head) && xi(n.contentDOM, "Backspace", 8) || t.from == s.from && t.to == s.to + 1 && t.insert.length == 0 && xi(n.contentDOM, "Delete", 46)))
      return !0;
    let o = t.insert.toString();
    n.inputState.composing >= 0 && n.inputState.composing++;
    let l, a = () => l || (l = em(n, t, i));
    return n.state.facet(Gf).some((h) => h(n, t.from, t.to, o, a)) || n.dispatch(a()), !0;
  } else if (i && !i.main.eq(s)) {
    let o = !1, l = "select";
    return n.inputState.lastSelectionTime > Date.now() - 50 && (n.inputState.lastSelectionOrigin == "select" && (o = !0), l = n.inputState.lastSelectionOrigin), n.dispatch({ selection: i, scrollIntoView: o, userEvent: l }), !0;
  } else
    return !1;
}
function em(n, e, t) {
  let i, s = n.state, r = s.selection.main;
  if (e.from >= r.from && e.to <= r.to && e.to - e.from >= (r.to - r.from) / 3 && (!t || t.main.empty && t.main.from == e.from + e.insert.length) && n.inputState.composing < 0) {
    let l = r.from < e.from ? s.sliceDoc(r.from, e.from) : "", a = r.to > e.to ? s.sliceDoc(e.to, r.to) : "";
    i = s.replaceSelection(n.state.toText(l + e.insert.sliceString(0, void 0, n.state.lineBreak) + a));
  } else {
    let l = s.changes(e), a = t && t.main.to <= l.newLength ? t.main : void 0;
    if (s.selection.ranges.length > 1 && n.inputState.composing >= 0 && e.to <= r.to && e.to >= r.to - 10) {
      let h = n.state.sliceDoc(e.from, e.to), f, c = t && ic(n, t.main.head);
      if (c) {
        let p = e.insert.length - (e.to - e.from);
        f = { from: c.from, to: c.to - p };
      } else
        f = n.state.doc.lineAt(r.head);
      let u = r.to - e.to, d = r.to - r.from;
      i = s.changeByRange((p) => {
        if (p.from == r.from && p.to == r.to)
          return { changes: l, range: a || p.map(l) };
        let m = p.to - u, g = m - h.length;
        if (p.to - p.from != d || n.state.sliceDoc(g, m) != h || // Unfortunately, there's no way to make multiple
        // changes in the same node work without aborting
        // composition, so cursors in the composition range are
        // ignored.
        p.to >= f.from && p.from <= f.to)
          return { range: p };
        let y = s.changes({ from: g, to: m, insert: e.insert }), k = p.to - r.to;
        return {
          changes: y,
          range: a ? C.range(Math.max(0, a.anchor + k), Math.max(0, a.head + k)) : p.map(y)
        };
      });
    } else
      i = {
        changes: l,
        selection: a && s.selection.replaceRange(a)
      };
  }
  let o = "input.type";
  return (n.composing || n.inputState.compositionPendingChange && n.inputState.compositionEndedAt > Date.now() - 50) && (n.inputState.compositionPendingChange = !1, o += ".compose", n.inputState.compositionFirstChange && (o += ".start", n.inputState.compositionFirstChange = !1)), s.update(i, { userEvent: o, scrollIntoView: !0 });
}
function tm(n, e, t, i) {
  let s = Math.min(n.length, e.length), r = 0;
  for (; r < s && n.charCodeAt(r) == e.charCodeAt(r); )
    r++;
  if (r == s && n.length == e.length)
    return null;
  let o = n.length, l = e.length;
  for (; o > 0 && l > 0 && n.charCodeAt(o - 1) == e.charCodeAt(l - 1); )
    o--, l--;
  if (i == "end") {
    let a = Math.max(0, r - Math.min(o, l));
    t -= o + a - r;
  }
  if (o < r && n.length < e.length) {
    let a = t <= r && t >= o ? r - t : 0;
    r -= a, l = r + (l - o), o = r;
  } else if (l < r) {
    let a = t <= r && t >= l ? r - t : 0;
    r -= a, o = r + (o - l), l = r;
  }
  return { from: r, toA: o, toB: l };
}
function im(n) {
  let e = [];
  if (n.root.activeElement != n.contentDOM)
    return e;
  let { anchorNode: t, anchorOffset: i, focusNode: s, focusOffset: r } = n.observer.selectionRange;
  return t && (e.push(new oa(t, i)), (s != t || r != i) && e.push(new oa(s, r))), e;
}
function nm(n, e) {
  if (n.length == 0)
    return null;
  let t = n[0].pos, i = n.length == 2 ? n[1].pos : t;
  return t > -1 && i > -1 ? C.single(t + e, i + e) : null;
}
const sm = {
  childList: !0,
  characterData: !0,
  subtree: !0,
  attributes: !0,
  characterDataOldValue: !0
}, nr = D.ie && D.ie_version <= 11;
class rm {
  constructor(e) {
    this.view = e, this.active = !1, this.selectionRange = new zd(), this.selectionChanged = !1, this.delayedFlush = -1, this.resizeTimeout = -1, this.queue = [], this.delayedAndroidKey = null, this.flushingAndroidKey = -1, this.lastChange = 0, this.scrollTargets = [], this.intersection = null, this.resizeScroll = null, this.intersecting = !1, this.gapIntersection = null, this.gaps = [], this.parentCheck = -1, this.dom = e.contentDOM, this.observer = new MutationObserver((t) => {
      for (let i of t)
        this.queue.push(i);
      (D.ie && D.ie_version <= 11 || D.ios && e.composing) && t.some((i) => i.type == "childList" && i.removedNodes.length || i.type == "characterData" && i.oldValue.length > i.target.nodeValue.length) ? this.flushSoon() : this.flush();
    }), nr && (this.onCharData = (t) => {
      this.queue.push({
        target: t.target,
        type: "characterData",
        oldValue: t.prevValue
      }), this.flushSoon();
    }), this.onSelectionChange = this.onSelectionChange.bind(this), this.onResize = this.onResize.bind(this), this.onPrint = this.onPrint.bind(this), this.onScroll = this.onScroll.bind(this), typeof ResizeObserver == "function" && (this.resizeScroll = new ResizeObserver(() => {
      var t;
      ((t = this.view.docView) === null || t === void 0 ? void 0 : t.lastUpdate) < Date.now() - 75 && this.onResize();
    }), this.resizeScroll.observe(e.scrollDOM)), this.addWindowListeners(this.win = e.win), this.start(), typeof IntersectionObserver == "function" && (this.intersection = new IntersectionObserver((t) => {
      this.parentCheck < 0 && (this.parentCheck = setTimeout(this.listenForScroll.bind(this), 1e3)), t.length > 0 && t[t.length - 1].intersectionRatio > 0 != this.intersecting && (this.intersecting = !this.intersecting, this.intersecting != this.view.inView && this.onScrollChanged(document.createEvent("Event")));
    }, { threshold: [0, 1e-3] }), this.intersection.observe(this.dom), this.gapIntersection = new IntersectionObserver((t) => {
      t.length > 0 && t[t.length - 1].intersectionRatio > 0 && this.onScrollChanged(document.createEvent("Event"));
    }, {})), this.listenForScroll(), this.readSelectionRange();
  }
  onScrollChanged(e) {
    this.view.inputState.runHandlers("scroll", e), this.intersecting && this.view.measure();
  }
  onScroll(e) {
    this.intersecting && this.flush(!1), this.onScrollChanged(e);
  }
  onResize() {
    this.resizeTimeout < 0 && (this.resizeTimeout = setTimeout(() => {
      this.resizeTimeout = -1, this.view.requestMeasure();
    }, 50));
  }
  onPrint() {
    this.view.viewState.printing = !0, this.view.measure(), setTimeout(() => {
      this.view.viewState.printing = !1, this.view.requestMeasure();
    }, 500);
  }
  updateGaps(e) {
    if (this.gapIntersection && (e.length != this.gaps.length || this.gaps.some((t, i) => t != e[i]))) {
      this.gapIntersection.disconnect();
      for (let t of e)
        this.gapIntersection.observe(t);
      this.gaps = e;
    }
  }
  onSelectionChange(e) {
    let t = this.selectionChanged;
    if (!this.readSelectionRange() || this.delayedAndroidKey)
      return;
    let { view: i } = this, s = this.selectionRange;
    if (i.state.facet(Is) ? i.root.activeElement != this.dom : !ns(i.dom, s))
      return;
    let r = s.anchorNode && i.docView.nearest(s.anchorNode);
    if (r && r.ignoreEvent(e)) {
      t || (this.selectionChanged = !1);
      return;
    }
    (D.ie && D.ie_version <= 11 || D.android && D.chrome) && !i.state.selection.main.empty && // (Selection.isCollapsed isn't reliable on IE)
    s.focusNode && nn(s.focusNode, s.focusOffset, s.anchorNode, s.anchorOffset) ? this.flushSoon() : this.flush(!1);
  }
  readSelectionRange() {
    let { view: e } = this, t = D.safari && e.root.nodeType == 11 && Fd(this.dom.ownerDocument) == this.dom && om(this.view) || gs(e.root);
    if (!t || this.selectionRange.eq(t))
      return !1;
    let i = ns(this.dom, t);
    return i && !this.selectionChanged && e.inputState.lastFocusTime > Date.now() - 200 && e.inputState.lastTouchTime < Date.now() - 300 && jd(this.dom, t) ? (this.view.inputState.lastFocusTime = 0, e.docView.updateSelection(), !1) : (this.selectionRange.setRange(t), i && (this.selectionChanged = !0), !0);
  }
  setSelectionRange(e, t) {
    this.selectionRange.set(e.node, e.offset, t.node, t.offset), this.selectionChanged = !1;
  }
  clearSelectionRange() {
    this.selectionRange.set(null, 0, null, 0);
  }
  listenForScroll() {
    this.parentCheck = -1;
    let e = 0, t = null;
    for (let i = this.dom; i; )
      if (i.nodeType == 1)
        !t && e < this.scrollTargets.length && this.scrollTargets[e] == i ? e++ : t || (t = this.scrollTargets.slice(0, e)), t && t.push(i), i = i.assignedSlot || i.parentNode;
      else if (i.nodeType == 11)
        i = i.host;
      else
        break;
    if (e < this.scrollTargets.length && !t && (t = this.scrollTargets.slice(0, e)), t) {
      for (let i of this.scrollTargets)
        i.removeEventListener("scroll", this.onScroll);
      for (let i of this.scrollTargets = t)
        i.addEventListener("scroll", this.onScroll);
    }
  }
  ignore(e) {
    if (!this.active)
      return e();
    try {
      return this.stop(), e();
    } finally {
      this.start(), this.clear();
    }
  }
  start() {
    this.active || (this.observer.observe(this.dom, sm), nr && this.dom.addEventListener("DOMCharacterDataModified", this.onCharData), this.active = !0);
  }
  stop() {
    this.active && (this.active = !1, this.observer.disconnect(), nr && this.dom.removeEventListener("DOMCharacterDataModified", this.onCharData));
  }
  // Throw away any pending changes
  clear() {
    this.processRecords(), this.queue.length = 0, this.selectionChanged = !1;
  }
  // Chrome Android, especially in combination with GBoard, not only
  // doesn't reliably fire regular key events, but also often
  // surrounds the effect of enter or backspace with a bunch of
  // composition events that, when interrupted, cause text duplication
  // or other kinds of corruption. This hack makes the editor back off
  // from handling DOM changes for a moment when such a key is
  // detected (via beforeinput or keydown), and then tries to flush
  // them or, if that has no effect, dispatches the given key.
  delayAndroidKey(e, t) {
    var i;
    if (!this.delayedAndroidKey) {
      let s = () => {
        let r = this.delayedAndroidKey;
        r && (this.clearDelayedAndroidKey(), this.view.inputState.lastKeyCode = r.keyCode, this.view.inputState.lastKeyTime = Date.now(), !this.flush() && r.force && xi(this.dom, r.key, r.keyCode));
      };
      this.flushingAndroidKey = this.view.win.requestAnimationFrame(s);
    }
    (!this.delayedAndroidKey || e == "Enter") && (this.delayedAndroidKey = {
      key: e,
      keyCode: t,
      // Only run the key handler when no changes are detected if
      // this isn't coming right after another change, in which case
      // it is probably part of a weird chain of updates, and should
      // be ignored if it returns the DOM to its previous state.
      force: this.lastChange < Date.now() - 50 || !!(!((i = this.delayedAndroidKey) === null || i === void 0) && i.force)
    });
  }
  clearDelayedAndroidKey() {
    this.win.cancelAnimationFrame(this.flushingAndroidKey), this.delayedAndroidKey = null, this.flushingAndroidKey = -1;
  }
  flushSoon() {
    this.delayedFlush < 0 && (this.delayedFlush = this.view.win.requestAnimationFrame(() => {
      this.delayedFlush = -1, this.flush();
    }));
  }
  forceFlush() {
    this.delayedFlush >= 0 && (this.view.win.cancelAnimationFrame(this.delayedFlush), this.delayedFlush = -1), this.flush();
  }
  pendingRecords() {
    for (let e of this.observer.takeRecords())
      this.queue.push(e);
    return this.queue;
  }
  processRecords() {
    let e = this.pendingRecords();
    e.length && (this.queue = []);
    let t = -1, i = -1, s = !1;
    for (let r of e) {
      let o = this.readMutation(r);
      o && (o.typeOver && (s = !0), t == -1 ? { from: t, to: i } = o : (t = Math.min(o.from, t), i = Math.max(o.to, i)));
    }
    return { from: t, to: i, typeOver: s };
  }
  readChange() {
    let { from: e, to: t, typeOver: i } = this.processRecords(), s = this.selectionChanged && ns(this.dom, this.selectionRange);
    if (e < 0 && !s)
      return null;
    e > -1 && (this.lastChange = Date.now()), this.view.inputState.lastFocusTime = 0, this.selectionChanged = !1;
    let r = new $p(this.view, e, t, i);
    return this.view.docView.domChanged = { newSel: r.newSel ? r.newSel.main : null }, r;
  }
  // Apply pending changes, if any
  flush(e = !0) {
    if (this.delayedFlush >= 0 || this.delayedAndroidKey)
      return !1;
    e && this.readSelectionRange();
    let t = this.readChange();
    if (!t)
      return this.view.requestMeasure(), !1;
    let i = this.view.state, s = yc(this.view, t);
    return this.view.state == i && this.view.update([]), s;
  }
  readMutation(e) {
    let t = this.view.docView.nearest(e.target);
    if (!t || t.ignoreMutation(e))
      return null;
    if (t.markDirty(e.type == "attributes"), e.type == "attributes" && (t.flags |= 4), e.type == "childList") {
      let i = la(t, e.previousSibling || e.target.previousSibling, -1), s = la(t, e.nextSibling || e.target.nextSibling, 1);
      return {
        from: i ? t.posAfter(i) : t.posAtStart,
        to: s ? t.posBefore(s) : t.posAtEnd,
        typeOver: !1
      };
    } else
      return e.type == "characterData" ? { from: t.posAtStart, to: t.posAtEnd, typeOver: e.target.nodeValue == e.oldValue } : null;
  }
  setWindow(e) {
    e != this.win && (this.removeWindowListeners(this.win), this.win = e, this.addWindowListeners(this.win));
  }
  addWindowListeners(e) {
    e.addEventListener("resize", this.onResize), e.addEventListener("beforeprint", this.onPrint), e.addEventListener("scroll", this.onScroll), e.document.addEventListener("selectionchange", this.onSelectionChange);
  }
  removeWindowListeners(e) {
    e.removeEventListener("scroll", this.onScroll), e.removeEventListener("resize", this.onResize), e.removeEventListener("beforeprint", this.onPrint), e.document.removeEventListener("selectionchange", this.onSelectionChange);
  }
  destroy() {
    var e, t, i;
    this.stop(), (e = this.intersection) === null || e === void 0 || e.disconnect(), (t = this.gapIntersection) === null || t === void 0 || t.disconnect(), (i = this.resizeScroll) === null || i === void 0 || i.disconnect();
    for (let s of this.scrollTargets)
      s.removeEventListener("scroll", this.onScroll);
    this.removeWindowListeners(this.win), clearTimeout(this.parentCheck), clearTimeout(this.resizeTimeout), this.win.cancelAnimationFrame(this.delayedFlush), this.win.cancelAnimationFrame(this.flushingAndroidKey);
  }
}
function la(n, e, t) {
  for (; e; ) {
    let i = ee.get(e);
    if (i && i.parent == n)
      return i;
    let s = e.parentNode;
    e = s != n.dom ? s : t > 0 ? e.nextSibling : e.previousSibling;
  }
  return null;
}
function om(n) {
  let e = null;
  function t(a) {
    a.preventDefault(), a.stopImmediatePropagation(), e = a.getTargetRanges()[0];
  }
  if (n.contentDOM.addEventListener("beforeinput", t, !0), n.dom.ownerDocument.execCommand("indent"), n.contentDOM.removeEventListener("beforeinput", t, !0), !e)
    return null;
  let i = e.startContainer, s = e.startOffset, r = e.endContainer, o = e.endOffset, l = n.docView.domAtPos(n.state.selection.main.anchor);
  return nn(l.node, l.offset, r, o) && ([i, s, r, o] = [r, o, i, s]), { anchorNode: i, anchorOffset: s, focusNode: r, focusOffset: o };
}
class B {
  /**
  The current editor state.
  */
  get state() {
    return this.viewState.state;
  }
  /**
  To be able to display large documents without consuming too much
  memory or overloading the browser, CodeMirror only draws the
  code that is visible (plus a margin around it) to the DOM. This
  property tells you the extent of the current drawn viewport, in
  document positions.
  */
  get viewport() {
    return this.viewState.viewport;
  }
  /**
  When there are, for example, large collapsed ranges in the
  viewport, its size can be a lot bigger than the actual visible
  content. Thus, if you are doing something like styling the
  content in the viewport, it is preferable to only do so for
  these ranges, which are the subset of the viewport that is
  actually drawn.
  */
  get visibleRanges() {
    return this.viewState.visibleRanges;
  }
  /**
  Returns false when the editor is entirely scrolled out of view
  or otherwise hidden.
  */
  get inView() {
    return this.viewState.inView;
  }
  /**
  Indicates whether the user is currently composing text via
  [IME](https://en.wikipedia.org/wiki/Input_method), and at least
  one change has been made in the current composition.
  */
  get composing() {
    return this.inputState.composing > 0;
  }
  /**
  Indicates whether the user is currently in composing state. Note
  that on some platforms, like Android, this will be the case a
  lot, since just putting the cursor on a word starts a
  composition there.
  */
  get compositionStarted() {
    return this.inputState.composing >= 0;
  }
  /**
  The document or shadow root that the view lives in.
  */
  get root() {
    return this._root;
  }
  /**
  @internal
  */
  get win() {
    return this.dom.ownerDocument.defaultView || window;
  }
  /**
  Construct a new view. You'll want to either provide a `parent`
  option, or put `view.dom` into your document after creating a
  view, so that the user can see the editor.
  */
  constructor(e = {}) {
    this.plugins = [], this.pluginMap = /* @__PURE__ */ new Map(), this.editorAttrs = {}, this.contentAttrs = {}, this.bidiCache = [], this.destroyed = !1, this.updateState = 2, this.measureScheduled = -1, this.measureRequests = [], this.contentDOM = document.createElement("div"), this.scrollDOM = document.createElement("div"), this.scrollDOM.tabIndex = -1, this.scrollDOM.className = "cm-scroller", this.scrollDOM.appendChild(this.contentDOM), this.announceDOM = document.createElement("div"), this.announceDOM.className = "cm-announced", this.announceDOM.setAttribute("aria-live", "polite"), this.dom = document.createElement("div"), this.dom.appendChild(this.announceDOM), this.dom.appendChild(this.scrollDOM), e.parent && e.parent.appendChild(this.dom);
    let { dispatch: t } = e;
    this.dispatchTransactions = e.dispatchTransactions || t && ((i) => i.forEach((s) => t(s, this))) || ((i) => this.update(i)), this.dispatch = this.dispatch.bind(this), this._root = e.root || qd(e.parent) || document, this.viewState = new na(e.state || G.create(e)), e.scrollTo && e.scrollTo.is(Pn) && (this.viewState.scrollTarget = e.scrollTo.value.clip(this.viewState.state)), this.plugins = this.state.facet(Ji).map((i) => new $s(i));
    for (let i of this.plugins)
      i.update(this);
    this.observer = new rm(this), this.inputState = new vp(this), this.inputState.ensureHandlers(this.plugins), this.docView = new Hl(this), this.mountStyles(), this.updateAttrs(), this.updateState = 0, this.requestMeasure();
  }
  dispatch(...e) {
    let t = e.length == 1 && e[0] instanceof le ? e : e.length == 1 && Array.isArray(e[0]) ? e[0] : [this.state.update(...e)];
    this.dispatchTransactions(t, this);
  }
  /**
  Update the view for the given array of transactions. This will
  update the visible document and selection to match the state
  produced by the transactions, and notify view plugins of the
  change. You should usually call
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead, which uses this
  as a primitive.
  */
  update(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.update are not allowed while an update is in progress");
    let t = !1, i = !1, s, r = this.state;
    for (let u of e) {
      if (u.startState != r)
        throw new RangeError("Trying to update state with a transaction that doesn't start from the previous state.");
      r = u.state;
    }
    if (this.destroyed) {
      this.viewState.state = r;
      return;
    }
    let o = this.hasFocus, l = 0, a = null;
    e.some((u) => u.annotation(cc)) ? (this.inputState.notifiedFocused = o, l = 1) : o != this.inputState.notifiedFocused && (this.inputState.notifiedFocused = o, a = uc(r, o), a || (l = 1));
    let h = this.observer.delayedAndroidKey, f = null;
    if (h ? (this.observer.clearDelayedAndroidKey(), f = this.observer.readChange(), (f && !this.state.doc.eq(r.doc) || !this.state.selection.eq(r.selection)) && (f = null)) : this.observer.clear(), r.facet(G.phrases) != this.state.facet(G.phrases))
      return this.setState(r);
    s = bs.create(this, r, e), s.flags |= l;
    let c = this.viewState.scrollTarget;
    try {
      this.updateState = 2;
      for (let u of e) {
        if (c && (c = c.map(u.changes)), u.scrollIntoView) {
          let { main: d } = u.state.selection;
          c = new Si(d.empty ? d : C.cursor(d.head, d.head > d.anchor ? -1 : 1));
        }
        for (let d of u.effects)
          d.is(Pn) && (c = d.value.clip(this.state));
      }
      this.viewState.update(s, c), this.bidiCache = ys.update(this.bidiCache, s.changes), s.empty || (this.updatePlugins(s), this.inputState.update(s)), t = this.docView.update(s), this.state.facet(Xi) != this.styleModules && this.mountStyles(), i = this.updateAttrs(), this.showAnnouncements(e), this.docView.updateSelection(t, e.some((u) => u.isUserEvent("select.pointer")));
    } finally {
      this.updateState = 0;
    }
    if (s.startState.facet(Fn) != s.state.facet(Fn) && (this.viewState.mustMeasureContent = !0), (t || i || c || this.viewState.mustEnforceCursorAssoc || this.viewState.mustMeasureContent) && this.requestMeasure(), !s.empty)
      for (let u of this.state.facet(so))
        try {
          u(s);
        } catch (d) {
          ft(this.state, d, "update listener");
        }
    (a || f) && Promise.resolve().then(() => {
      a && this.state == a.startState && this.dispatch(a), f && !yc(this, f) && h.force && xi(this.contentDOM, h.key, h.keyCode);
    });
  }
  /**
  Reset the view to the given state. (This will cause the entire
  document to be redrawn and all view plugins to be reinitialized,
  so you should probably only use it when the new state isn't
  derived from the old state. Otherwise, use
  [`dispatch`](https://codemirror.net/6/docs/ref/#view.EditorView.dispatch) instead.)
  */
  setState(e) {
    if (this.updateState != 0)
      throw new Error("Calls to EditorView.setState are not allowed while an update is in progress");
    if (this.destroyed) {
      this.viewState.state = e;
      return;
    }
    this.updateState = 2;
    let t = this.hasFocus;
    try {
      for (let i of this.plugins)
        i.destroy(this);
      this.viewState = new na(e), this.plugins = e.facet(Ji).map((i) => new $s(i)), this.pluginMap.clear();
      for (let i of this.plugins)
        i.update(this);
      this.docView.destroy(), this.docView = new Hl(this), this.inputState.ensureHandlers(this.plugins), this.mountStyles(), this.updateAttrs(), this.bidiCache = [];
    } finally {
      this.updateState = 0;
    }
    t && this.focus(), this.requestMeasure();
  }
  updatePlugins(e) {
    let t = e.startState.facet(Ji), i = e.state.facet(Ji);
    if (t != i) {
      let s = [];
      for (let r of i) {
        let o = t.indexOf(r);
        if (o < 0)
          s.push(new $s(r));
        else {
          let l = this.plugins[o];
          l.mustUpdate = e, s.push(l);
        }
      }
      for (let r of this.plugins)
        r.mustUpdate != e && r.destroy(this);
      this.plugins = s, this.pluginMap.clear();
    } else
      for (let s of this.plugins)
        s.mustUpdate = e;
    for (let s = 0; s < this.plugins.length; s++)
      this.plugins[s].update(this);
    t != i && this.inputState.ensureHandlers(this.plugins);
  }
  /**
  @internal
  */
  measure(e = !0) {
    if (this.destroyed)
      return;
    if (this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.observer.delayedAndroidKey) {
      this.measureScheduled = -1, this.requestMeasure();
      return;
    }
    this.measureScheduled = 0, e && this.observer.forceFlush();
    let t = null, i = this.scrollDOM, s = i.scrollTop * this.scaleY, { scrollAnchorPos: r, scrollAnchorHeight: o } = this.viewState;
    Math.abs(s - this.viewState.scrollTop) > 1 && (o = -1), this.viewState.scrollAnchorHeight = -1;
    try {
      for (let l = 0; ; l++) {
        if (o < 0)
          if (Tf(i))
            r = -1, o = this.viewState.heightMap.height;
          else {
            let d = this.viewState.scrollAnchorAt(s);
            r = d.from, o = d.top;
          }
        this.updateState = 1;
        let a = this.viewState.measure(this);
        if (!a && !this.measureRequests.length && this.viewState.scrollTarget == null)
          break;
        if (l > 5) {
          console.warn(this.measureRequests.length ? "Measure loop restarted more than 5 times" : "Viewport failed to stabilize");
          break;
        }
        let h = [];
        a & 4 || ([this.measureRequests, h] = [h, this.measureRequests]);
        let f = h.map((d) => {
          try {
            return d.read(this);
          } catch (p) {
            return ft(this.state, p), aa;
          }
        }), c = bs.create(this, this.state, []), u = !1;
        c.flags |= a, t ? t.flags |= a : t = c, this.updateState = 2, c.empty || (this.updatePlugins(c), this.inputState.update(c), this.updateAttrs(), u = this.docView.update(c));
        for (let d = 0; d < h.length; d++)
          if (f[d] != aa)
            try {
              let p = h[d];
              p.write && p.write(f[d], this);
            } catch (p) {
              ft(this.state, p);
            }
        if (u && this.docView.updateSelection(!0), !c.viewportChanged && this.measureRequests.length == 0) {
          if (this.viewState.editorHeight)
            if (this.viewState.scrollTarget) {
              this.docView.scrollIntoView(this.viewState.scrollTarget), this.viewState.scrollTarget = null, o = -1;
              continue;
            } else {
              let p = (r < 0 ? this.viewState.heightMap.height : this.viewState.lineBlockAt(r).top) - o;
              if (p > 1 || p < -1) {
                s = s + p, i.scrollTop = s / this.scaleY, o = -1;
                continue;
              }
            }
          break;
        }
      }
    } finally {
      this.updateState = 0, this.measureScheduled = -1;
    }
    if (t && !t.empty)
      for (let l of this.state.facet(so))
        l(t);
  }
  /**
  Get the CSS classes for the currently active editor themes.
  */
  get themeClasses() {
    return ho + " " + (this.state.facet(ao) ? gc : mc) + " " + this.state.facet(Fn);
  }
  updateAttrs() {
    let e = ha(this, Zf, {
      class: "cm-editor" + (this.hasFocus ? " cm-focused " : " ") + this.themeClasses
    }), t = {
      spellcheck: "false",
      autocorrect: "off",
      autocapitalize: "off",
      translate: "no",
      contenteditable: this.state.facet(Is) ? "true" : "false",
      class: "cm-content",
      style: `${D.tabSize}: ${this.state.tabSize}`,
      role: "textbox",
      "aria-multiline": "true"
    };
    this.state.readOnly && (t["aria-readonly"] = "true"), ha(this, Vo, t);
    let i = this.observer.ignore(() => {
      let s = $r(this.contentDOM, this.contentAttrs, t), r = $r(this.dom, this.editorAttrs, e);
      return s || r;
    });
    return this.editorAttrs = e, this.contentAttrs = t, i;
  }
  showAnnouncements(e) {
    let t = !0;
    for (let i of e)
      for (let s of i.effects)
        if (s.is(B.announce)) {
          t && (this.announceDOM.textContent = ""), t = !1;
          let r = this.announceDOM.appendChild(document.createElement("div"));
          r.textContent = s.value;
        }
  }
  mountStyles() {
    this.styleModules = this.state.facet(Xi);
    let e = this.state.facet(B.cspNonce);
    Et.mount(this.root, this.styleModules.concat(Xp).reverse(), e ? { nonce: e } : void 0);
  }
  readMeasured() {
    if (this.updateState == 2)
      throw new Error("Reading the editor layout isn't allowed during an update");
    this.updateState == 0 && this.measureScheduled > -1 && this.measure(!1);
  }
  /**
  Schedule a layout measurement, optionally providing callbacks to
  do custom DOM measuring followed by a DOM write phase. Using
  this is preferable reading DOM layout directly from, for
  example, an event handler, because it'll make sure measuring and
  drawing done by other components is synchronized, avoiding
  unnecessary DOM layout computations.
  */
  requestMeasure(e) {
    if (this.measureScheduled < 0 && (this.measureScheduled = this.win.requestAnimationFrame(() => this.measure())), e) {
      if (this.measureRequests.indexOf(e) > -1)
        return;
      if (e.key != null) {
        for (let t = 0; t < this.measureRequests.length; t++)
          if (this.measureRequests[t].key === e.key) {
            this.measureRequests[t] = e;
            return;
          }
      }
      this.measureRequests.push(e);
    }
  }
  /**
  Get the value of a specific plugin, if present. Note that
  plugins that crash can be dropped from a view, so even when you
  know you registered a given plugin, it is recommended to check
  the return value of this method.
  */
  plugin(e) {
    let t = this.pluginMap.get(e);
    return (t === void 0 || t && t.spec != e) && this.pluginMap.set(e, t = this.plugins.find((i) => i.spec == e) || null), t && t.update(this).value;
  }
  /**
  The top position of the document, in screen coordinates. This
  may be negative when the editor is scrolled down. Points
  directly to the top of the first line, not above the padding.
  */
  get documentTop() {
    return this.contentDOM.getBoundingClientRect().top + this.viewState.paddingTop;
  }
  /**
  Reports the padding above and below the document.
  */
  get documentPadding() {
    return { top: this.viewState.paddingTop, bottom: this.viewState.paddingBottom };
  }
  /**
  If the editor is transformed with CSS, this provides the scale
  along the X axis. Otherwise, it will just be 1. Note that
  transforms other than translation and scaling are not supported.
  */
  get scaleX() {
    return this.viewState.scaleX;
  }
  /**
  Provide the CSS transformed scale along the Y axis.
  */
  get scaleY() {
    return this.viewState.scaleY;
  }
  /**
  Find the text line or block widget at the given vertical
  position (which is interpreted as relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop)).
  */
  elementAtHeight(e) {
    return this.readMeasured(), this.viewState.elementAtHeight(e);
  }
  /**
  Find the line block (see
  [`lineBlockAt`](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) at the given
  height, again interpreted relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop).
  */
  lineBlockAtHeight(e) {
    return this.readMeasured(), this.viewState.lineBlockAtHeight(e);
  }
  /**
  Get the extent and vertical position of all [line
  blocks](https://codemirror.net/6/docs/ref/#view.EditorView.lineBlockAt) in the viewport. Positions
  are relative to the [top of the
  document](https://codemirror.net/6/docs/ref/#view.EditorView.documentTop);
  */
  get viewportLineBlocks() {
    return this.viewState.viewportLines;
  }
  /**
  Find the line block around the given document position. A line
  block is a range delimited on both sides by either a
  non-[hidden](https://codemirror.net/6/docs/ref/#view.Decoration^replace) line breaks, or the
  start/end of the document. It will usually just hold a line of
  text, but may be broken into multiple textblocks by block
  widgets.
  */
  lineBlockAt(e) {
    return this.viewState.lineBlockAt(e);
  }
  /**
  The editor's total content height.
  */
  get contentHeight() {
    return this.viewState.contentHeight;
  }
  /**
  Move a cursor position by [grapheme
  cluster](https://codemirror.net/6/docs/ref/#state.findClusterBreak). `forward` determines whether
  the motion is away from the line start, or towards it. In
  bidirectional text, the line is traversed in visual order, using
  the editor's [text direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection).
  When the start position was the last one on the line, the
  returned position will be across the line break. If there is no
  further line, the original position is returned.
  
  By default, this method moves over a single cluster. The
  optional `by` argument can be used to move across more. It will
  be called with the first cluster as argument, and should return
  a predicate that determines, for each subsequent cluster,
  whether it should also be moved over.
  */
  moveByChar(e, t, i) {
    return tr(this, e, Kl(this, e, t, i));
  }
  /**
  Move a cursor position across the next group of either
  [letters](https://codemirror.net/6/docs/ref/#state.EditorState.charCategorizer) or non-letter
  non-whitespace characters.
  */
  moveByGroup(e, t) {
    return tr(this, e, Kl(this, e, t, (i) => wp(this, e.head, i)));
  }
  /**
  Get the cursor position visually at the start or end of a line.
  Note that this may differ from the _logical_ position at its
  start or end (which is simply at `line.from`/`line.to`) if text
  at the start or end goes against the line's base text direction.
  */
  visualLineSide(e, t) {
    let i = this.bidiSpans(e), s = this.textDirectionAt(e.from), r = i[t ? i.length - 1 : 0];
    return C.cursor(r.side(t, s) + e.from, r.forward(!t, s) ? 1 : -1);
  }
  /**
  Move to the next line boundary in the given direction. If
  `includeWrap` is true, line wrapping is on, and there is a
  further wrap point on the current line, the wrap point will be
  returned. Otherwise this function will return the start or end
  of the line.
  */
  moveToLineBoundary(e, t, i = !0) {
    return yp(this, e, t, i);
  }
  /**
  Move a cursor position vertically. When `distance` isn't given,
  it defaults to moving to the next line (including wrapped
  lines). Otherwise, `distance` should provide a positive distance
  in pixels.
  
  When `start` has a
  [`goalColumn`](https://codemirror.net/6/docs/ref/#state.SelectionRange.goalColumn), the vertical
  motion will use that as a target horizontal position. Otherwise,
  the cursor's own horizontal position is used. The returned
  cursor will have its goal column set to whichever column was
  used.
  */
  moveVertically(e, t, i) {
    return tr(this, e, kp(this, e, t, i));
  }
  /**
  Find the DOM parent node and offset (child offset if `node` is
  an element, character offset when it is a text node) at the
  given document position.
  
  Note that for positions that aren't currently in
  `visibleRanges`, the resulting DOM position isn't necessarily
  meaningful (it may just point before or after a placeholder
  element).
  */
  domAtPos(e) {
    return this.docView.domAtPos(e);
  }
  /**
  Find the document position at the given DOM node. Can be useful
  for associating positions with DOM events. Will raise an error
  when `node` isn't part of the editor content.
  */
  posAtDOM(e, t = 0) {
    return this.docView.posFromDOM(e, t);
  }
  posAtCoords(e, t = !0) {
    return this.readMeasured(), sc(this, e, t);
  }
  /**
  Get the screen coordinates at the given document position.
  `side` determines whether the coordinates are based on the
  element before (-1) or after (1) the position (if no element is
  available on the given side, the method will transparently use
  another strategy to get reasonable coordinates).
  */
  coordsAtPos(e, t = 1) {
    this.readMeasured();
    let i = this.docView.coordsAt(e, t);
    if (!i || i.left == i.right)
      return i;
    let s = this.state.doc.lineAt(e), r = this.bidiSpans(s), o = r[Bt.find(r, e - s.from, -1, t)];
    return Es(i, o.dir == te.LTR == t > 0);
  }
  /**
  Return the rectangle around a given character. If `pos` does not
  point in front of a character that is in the viewport and
  rendered (i.e. not replaced, not a line break), this will return
  null. For space characters that are a line wrap point, this will
  return the position before the line break.
  */
  coordsForChar(e) {
    return this.readMeasured(), this.docView.coordsForChar(e);
  }
  /**
  The default width of a character in the editor. May not
  accurately reflect the width of all characters (given variable
  width fonts or styling of invididual ranges).
  */
  get defaultCharacterWidth() {
    return this.viewState.heightOracle.charWidth;
  }
  /**
  The default height of a line in the editor. May not be accurate
  for all lines.
  */
  get defaultLineHeight() {
    return this.viewState.heightOracle.lineHeight;
  }
  /**
  The text direction
  ([`direction`](https://developer.mozilla.org/en-US/docs/Web/CSS/direction)
  CSS property) of the editor's content element.
  */
  get textDirection() {
    return this.viewState.defaultTextDirection;
  }
  /**
  Find the text direction of the block at the given position, as
  assigned by CSS. If
  [`perLineTextDirection`](https://codemirror.net/6/docs/ref/#view.EditorView^perLineTextDirection)
  isn't enabled, or the given position is outside of the viewport,
  this will always return the same as
  [`textDirection`](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection). Note that
  this may trigger a DOM layout.
  */
  textDirectionAt(e) {
    return !this.state.facet(Jf) || e < this.viewport.from || e > this.viewport.to ? this.textDirection : (this.readMeasured(), this.docView.textDirectionAt(e));
  }
  /**
  Whether this editor [wraps lines](https://codemirror.net/6/docs/ref/#view.EditorView.lineWrapping)
  (as determined by the
  [`white-space`](https://developer.mozilla.org/en-US/docs/Web/CSS/white-space)
  CSS property of its content element).
  */
  get lineWrapping() {
    return this.viewState.heightOracle.lineWrapping;
  }
  /**
  Returns the bidirectional text structure of the given line
  (which should be in the current document) as an array of span
  objects. The order of these spans matches the [text
  direction](https://codemirror.net/6/docs/ref/#view.EditorView.textDirection)—if that is
  left-to-right, the leftmost spans come first, otherwise the
  rightmost spans come first.
  */
  bidiSpans(e) {
    if (e.length > lm)
      return Wf(e.length);
    let t = this.textDirectionAt(e.from), i;
    for (let r of this.bidiCache)
      if (r.from == e.from && r.dir == t && (r.fresh || Vf(r.isolates, i = Fl(this, e))))
        return r.order;
    i || (i = Fl(this, e));
    let s = ip(e.text, t, i);
    return this.bidiCache.push(new ys(e.from, e.to, t, i, !0, s)), s;
  }
  /**
  Check whether the editor has focus.
  */
  get hasFocus() {
    var e;
    return (this.dom.ownerDocument.hasFocus() || D.safari && ((e = this.inputState) === null || e === void 0 ? void 0 : e.lastContextMenu) > Date.now() - 3e4) && this.root.activeElement == this.contentDOM;
  }
  /**
  Put focus on the editor.
  */
  focus() {
    this.observer.ignore(() => {
      Af(this.contentDOM), this.docView.updateSelection();
    });
  }
  /**
  Update the [root](https://codemirror.net/6/docs/ref/##view.EditorViewConfig.root) in which the editor lives. This is only
  necessary when moving the editor's existing DOM to a new window or shadow root.
  */
  setRoot(e) {
    this._root != e && (this._root = e, this.observer.setWindow((e.nodeType == 9 ? e : e.ownerDocument).defaultView || window), this.mountStyles());
  }
  /**
  Clean up this editor view, removing its element from the
  document, unregistering event handlers, and notifying
  plugins. The view instance can no longer be used after
  calling this.
  */
  destroy() {
    for (let e of this.plugins)
      e.destroy(this);
    this.plugins = [], this.inputState.destroy(), this.docView.destroy(), this.dom.remove(), this.observer.destroy(), this.measureScheduled > -1 && this.win.cancelAnimationFrame(this.measureScheduled), this.destroyed = !0;
  }
  /**
  Returns an effect that can be
  [added](https://codemirror.net/6/docs/ref/#state.TransactionSpec.effects) to a transaction to
  cause it to scroll the given position or range into view.
  */
  static scrollIntoView(e, t = {}) {
    return Pn.of(new Si(typeof e == "number" ? C.cursor(e) : e, t.y, t.x, t.yMargin, t.xMargin));
  }
  /**
  Return an effect that resets the editor to its current (at the
  time this method was called) scroll position. Note that this
  only affects the editor's own scrollable element, not parents.
  See also
  [`EditorViewConfig.scrollTo`](https://codemirror.net/6/docs/ref/#view.EditorViewConfig.scrollTo).
  
  The effect should be used with a document identical to the one
  it was created for. Failing to do so is not an error, but may
  not scroll to the expected position. You can
  [map](https://codemirror.net/6/docs/ref/#state.StateEffect.map) the effect to account for changes.
  */
  scrollSnapshot() {
    let { scrollTop: e, scrollLeft: t } = this.scrollDOM, i = this.viewState.scrollAnchorAt(e);
    return Pn.of(new Si(C.cursor(i.from), "start", "start", i.top - e, t, !0));
  }
  /**
  Returns an extension that can be used to add DOM event handlers.
  The value should be an object mapping event names to handler
  functions. For any given event, such functions are ordered by
  extension precedence, and the first handler to return true will
  be assumed to have handled that event, and no other handlers or
  built-in behavior will be activated for it. These are registered
  on the [content element](https://codemirror.net/6/docs/ref/#view.EditorView.contentDOM), except
  for `scroll` handlers, which will be called any time the
  editor's [scroll element](https://codemirror.net/6/docs/ref/#view.EditorView.scrollDOM) or one of
  its parent nodes is scrolled.
  */
  static domEventHandlers(e) {
    return ke.define(() => ({}), { eventHandlers: e });
  }
  /**
  Create an extension that registers DOM event observers. Contrary
  to event [handlers](https://codemirror.net/6/docs/ref/#view.EditorView^domEventHandlers),
  observers can't be prevented from running by a higher-precedence
  handler returning true. They also don't prevent other handlers
  and observers from running when they return true, and should not
  call `preventDefault`.
  */
  static domEventObservers(e) {
    return ke.define(() => ({}), { eventObservers: e });
  }
  /**
  Create a theme extension. The first argument can be a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)
  style spec providing the styles for the theme. These will be
  prefixed with a generated class for the style.
  
  Because the selectors will be prefixed with a scope class, rule
  that directly match the editor's [wrapper
  element](https://codemirror.net/6/docs/ref/#view.EditorView.dom)—to which the scope class will be
  added—need to be explicitly differentiated by adding an `&` to
  the selector for that element—for example
  `&.cm-focused`.
  
  When `dark` is set to true, the theme will be marked as dark,
  which will cause the `&dark` rules from [base
  themes](https://codemirror.net/6/docs/ref/#view.EditorView^baseTheme) to be used (as opposed to
  `&light` when a light theme is active).
  */
  static theme(e, t) {
    let i = Et.newName(), s = [Fn.of(i), Xi.of(fo(`.${i}`, e))];
    return t && t.dark && s.push(ao.of(!0)), s;
  }
  /**
  Create an extension that adds styles to the base theme. Like
  with [`theme`](https://codemirror.net/6/docs/ref/#view.EditorView^theme), use `&` to indicate the
  place of the editor wrapper element when directly targeting
  that. You can also use `&dark` or `&light` instead to only
  target editors with a dark or light theme.
  */
  static baseTheme(e) {
    return vn.lowest(Xi.of(fo("." + ho, e, bc)));
  }
  /**
  Retrieve an editor view instance from the view's DOM
  representation.
  */
  static findFromDOM(e) {
    var t;
    let i = e.querySelector(".cm-content"), s = i && ee.get(i) || ee.get(e);
    return ((t = s == null ? void 0 : s.rootView) === null || t === void 0 ? void 0 : t.view) || null;
  }
}
B.styleModule = Xi;
B.inputHandler = Gf;
B.focusChangeEffect = Yf;
B.perLineTextDirection = Jf;
B.exceptionSink = Uf;
B.updateListener = so;
B.editable = Is;
B.mouseSelectionStyle = Kf;
B.dragMovesSelection = jf;
B.clickAddsSelectionRange = qf;
B.decorations = dn;
B.outerDecorations = Qf;
B.atomicRanges = Wo;
B.bidiIsolatedRanges = $f;
B.scrollMargins = ec;
B.darkTheme = ao;
B.cspNonce = /* @__PURE__ */ O.define({ combine: (n) => n.length ? n[0] : "" });
B.contentAttributes = Vo;
B.editorAttributes = Zf;
B.lineWrapping = /* @__PURE__ */ B.contentAttributes.of({ class: "cm-lineWrapping" });
B.announce = /* @__PURE__ */ z.define();
const lm = 4096, aa = {};
class ys {
  constructor(e, t, i, s, r, o) {
    this.from = e, this.to = t, this.dir = i, this.isolates = s, this.fresh = r, this.order = o;
  }
  static update(e, t) {
    if (t.empty && !e.some((r) => r.fresh))
      return e;
    let i = [], s = e.length ? e[e.length - 1].dir : te.LTR;
    for (let r = Math.max(0, e.length - 10); r < e.length; r++) {
      let o = e[r];
      o.dir == s && !t.touchesRange(o.from, o.to) && i.push(new ys(t.mapPos(o.from, 1), t.mapPos(o.to, -1), o.dir, o.isolates, !1, o.order));
    }
    return i;
  }
}
function ha(n, e, t) {
  for (let i = n.state.facet(e), s = i.length - 1; s >= 0; s--) {
    let r = i[s], o = typeof r == "function" ? r(n) : r;
    o && Qr(o, t);
  }
  return t;
}
const am = D.mac ? "mac" : D.windows ? "win" : D.linux ? "linux" : "key";
function hm(n, e) {
  const t = n.split(/-(?!$)/);
  let i = t[t.length - 1];
  i == "Space" && (i = " ");
  let s, r, o, l;
  for (let a = 0; a < t.length - 1; ++a) {
    const h = t[a];
    if (/^(cmd|meta|m)$/i.test(h))
      l = !0;
    else if (/^a(lt)?$/i.test(h))
      s = !0;
    else if (/^(c|ctrl|control)$/i.test(h))
      r = !0;
    else if (/^s(hift)?$/i.test(h))
      o = !0;
    else if (/^mod$/i.test(h))
      e == "mac" ? l = !0 : r = !0;
    else
      throw new Error("Unrecognized modifier name: " + h);
  }
  return s && (i = "Alt-" + i), r && (i = "Ctrl-" + i), l && (i = "Meta-" + i), o && (i = "Shift-" + i), i;
}
function Hn(n, e, t) {
  return e.altKey && (n = "Alt-" + n), e.ctrlKey && (n = "Ctrl-" + n), e.metaKey && (n = "Meta-" + n), t !== !1 && e.shiftKey && (n = "Shift-" + n), n;
}
const fm = /* @__PURE__ */ vn.default(/* @__PURE__ */ B.domEventHandlers({
  keydown(n, e) {
    return pm(cm(e.state), n, e, "editor");
  }
})), Ns = /* @__PURE__ */ O.define({ enables: fm }), fa = /* @__PURE__ */ new WeakMap();
function cm(n) {
  let e = n.facet(Ns), t = fa.get(e);
  return t || fa.set(e, t = dm(e.reduce((i, s) => i.concat(s), []))), t;
}
let Tt = null;
const um = 4e3;
function dm(n, e = am) {
  let t = /* @__PURE__ */ Object.create(null), i = /* @__PURE__ */ Object.create(null), s = (o, l) => {
    let a = i[o];
    if (a == null)
      i[o] = l;
    else if (a != l)
      throw new Error("Key binding " + o + " is used both as a regular binding and as a multi-stroke prefix");
  }, r = (o, l, a, h, f) => {
    var c, u;
    let d = t[o] || (t[o] = /* @__PURE__ */ Object.create(null)), p = l.split(/ (?!$)/).map((y) => hm(y, e));
    for (let y = 1; y < p.length; y++) {
      let k = p.slice(0, y).join(" ");
      s(k, !0), d[k] || (d[k] = {
        preventDefault: !0,
        stopPropagation: !1,
        run: [(w) => {
          let S = Tt = { view: w, prefix: k, scope: o };
          return setTimeout(() => {
            Tt == S && (Tt = null);
          }, um), !0;
        }]
      });
    }
    let m = p.join(" ");
    s(m, !1);
    let g = d[m] || (d[m] = {
      preventDefault: !1,
      stopPropagation: !1,
      run: ((u = (c = d._any) === null || c === void 0 ? void 0 : c.run) === null || u === void 0 ? void 0 : u.slice()) || []
    });
    a && g.run.push(a), h && (g.preventDefault = !0), f && (g.stopPropagation = !0);
  };
  for (let o of n) {
    let l = o.scope ? o.scope.split(" ") : ["editor"];
    if (o.any)
      for (let h of l) {
        let f = t[h] || (t[h] = /* @__PURE__ */ Object.create(null));
        f._any || (f._any = { preventDefault: !1, stopPropagation: !1, run: [] });
        for (let c in f)
          f[c].run.push(o.any);
      }
    let a = o[e] || o.key;
    if (a)
      for (let h of l)
        r(h, a, o.run, o.preventDefault, o.stopPropagation), o.shift && r(h, "Shift-" + a, o.shift, o.preventDefault, o.stopPropagation);
  }
  return t;
}
function pm(n, e, t, i) {
  let s = Nd(e), r = be(s, 0), o = je(r) == s.length && s != " ", l = "", a = !1, h = !1, f = !1;
  Tt && Tt.view == t && Tt.scope == i && (l = Tt.prefix + " ", oc.indexOf(e.keyCode) < 0 && (h = !0, Tt = null));
  let c = /* @__PURE__ */ new Set(), u = (g) => {
    if (g) {
      for (let y of g.run)
        if (!c.has(y) && (c.add(y), y(t, e)))
          return g.stopPropagation && (f = !0), !0;
      g.preventDefault && (g.stopPropagation && (f = !0), h = !0);
    }
    return !1;
  }, d = n[i], p, m;
  return d && (u(d[l + Hn(s, e, !o)]) ? a = !0 : o && (e.altKey || e.metaKey || e.ctrlKey) && // Ctrl-Alt may be used for AltGr on Windows
  !(D.windows && e.ctrlKey && e.altKey) && (p = Rt[e.keyCode]) && p != s ? (u(d[l + Hn(p, e, !0)]) || e.shiftKey && (m = cn[e.keyCode]) != s && m != p && u(d[l + Hn(m, e, !1)])) && (a = !0) : o && e.shiftKey && u(d[l + Hn(s, e, !0)]) && (a = !0), !a && u(d._any) && (a = !0)), h && (a = !0), a && f && e.stopPropagation(), a;
}
class _n {
  /**
  Create a marker with the given class and dimensions. If `width`
  is null, the DOM element will get no width style.
  */
  constructor(e, t, i, s, r) {
    this.className = e, this.left = t, this.top = i, this.width = s, this.height = r;
  }
  draw() {
    let e = document.createElement("div");
    return e.className = this.className, this.adjust(e), e;
  }
  update(e, t) {
    return t.className != this.className ? !1 : (this.adjust(e), !0);
  }
  adjust(e) {
    e.style.left = this.left + "px", e.style.top = this.top + "px", this.width != null && (e.style.width = this.width + "px"), e.style.height = this.height + "px";
  }
  eq(e) {
    return this.left == e.left && this.top == e.top && this.width == e.width && this.height == e.height && this.className == e.className;
  }
  /**
  Create a set of rectangles for the given selection range,
  assigning them theclass`className`. Will create a single
  rectangle for empty ranges, and a set of selection-style
  rectangles covering the range's content (in a bidi-aware
  way) for non-empty ones.
  */
  static forRange(e, t, i) {
    if (i.empty) {
      let s = e.coordsAtPos(i.head, i.assoc || 1);
      if (!s)
        return [];
      let r = wc(e);
      return [new _n(t, s.left - r.left, s.top - r.top, null, s.bottom - s.top)];
    } else
      return mm(e, t, i);
  }
}
function wc(n) {
  let e = n.scrollDOM.getBoundingClientRect();
  return { left: (n.textDirection == te.LTR ? e.left : e.right - n.scrollDOM.clientWidth * n.scaleX) - n.scrollDOM.scrollLeft * n.scaleX, top: e.top - n.scrollDOM.scrollTop * n.scaleY };
}
function ca(n, e, t) {
  let i = C.cursor(e);
  return {
    from: Math.max(t.from, n.moveToLineBoundary(i, !1, !0).from),
    to: Math.min(t.to, n.moveToLineBoundary(i, !0, !0).from),
    type: Se.Text
  };
}
function mm(n, e, t) {
  if (t.to <= n.viewport.from || t.from >= n.viewport.to)
    return [];
  let i = Math.max(t.from, n.viewport.from), s = Math.min(t.to, n.viewport.to), r = n.textDirection == te.LTR, o = n.contentDOM, l = o.getBoundingClientRect(), a = wc(n), h = o.querySelector(".cm-line"), f = h && window.getComputedStyle(h), c = l.left + (f ? parseInt(f.paddingLeft) + Math.min(0, parseInt(f.textIndent)) : 0), u = l.right - (f ? parseInt(f.paddingRight) : 0), d = oo(n, i), p = oo(n, s), m = d.type == Se.Text ? d : null, g = p.type == Se.Text ? p : null;
  if (m && (n.lineWrapping || d.widgetLineBreaks) && (m = ca(n, i, m)), g && (n.lineWrapping || p.widgetLineBreaks) && (g = ca(n, s, g)), m && g && m.from == g.from)
    return k(w(t.from, t.to, m));
  {
    let _ = m ? w(t.from, null, m) : S(d, !1), v = g ? w(null, t.to, g) : S(p, !0), x = [];
    return (m || d).to < (g || p).from - (m && g ? 1 : 0) || d.widgetLineBreaks > 1 && _.bottom + n.defaultLineHeight / 2 < v.top ? x.push(y(c, _.bottom, u, v.top)) : _.bottom < v.top && n.elementAtHeight((_.bottom + v.top) / 2).type == Se.Text && (_.bottom = v.top = (_.bottom + v.top) / 2), k(_).concat(x).concat(k(v));
  }
  function y(_, v, x, P) {
    return new _n(
      e,
      _ - a.left,
      v - a.top - 0.01,
      x - _,
      P - v + 0.01
      /* C.Epsilon */
    );
  }
  function k({ top: _, bottom: v, horizontal: x }) {
    let P = [];
    for (let E = 0; E < x.length; E += 2)
      P.push(y(x[E], _, x[E + 1], v));
    return P;
  }
  function w(_, v, x) {
    let P = 1e9, E = -1e9, I = [];
    function L(H, K, ae, ce, M) {
      let Q = n.coordsAtPos(H, H == x.to ? -2 : 2), j = n.coordsAtPos(ae, ae == x.from ? 2 : -2);
      !Q || !j || (P = Math.min(Q.top, j.top, P), E = Math.max(Q.bottom, j.bottom, E), M == te.LTR ? I.push(r && K ? c : Q.left, r && ce ? u : j.right) : I.push(!r && ce ? c : j.left, !r && K ? u : Q.right));
    }
    let R = _ ?? x.from, W = v ?? x.to;
    for (let H of n.visibleRanges)
      if (H.to > R && H.from < W)
        for (let K = Math.max(H.from, R), ae = Math.min(H.to, W); ; ) {
          let ce = n.state.doc.lineAt(K);
          for (let M of n.bidiSpans(ce)) {
            let Q = M.from + ce.from, j = M.to + ce.from;
            if (Q >= ae)
              break;
            j > K && L(Math.max(Q, K), _ == null && Q <= R, Math.min(j, ae), v == null && j >= W, M.dir);
          }
          if (K = ce.to + 1, K >= ae)
            break;
        }
    return I.length == 0 && L(R, _ == null, W, v == null, n.textDirection), { top: P, bottom: E, horizontal: I };
  }
  function S(_, v) {
    let x = l.top + (v ? _.top : _.bottom);
    return { top: x, bottom: x, horizontal: [] };
  }
}
function gm(n, e) {
  return n.constructor == e.constructor && n.eq(e);
}
class bm {
  constructor(e, t) {
    this.view = e, this.layer = t, this.drawn = [], this.scaleX = 1, this.scaleY = 1, this.measureReq = { read: this.measure.bind(this), write: this.draw.bind(this) }, this.dom = e.scrollDOM.appendChild(document.createElement("div")), this.dom.classList.add("cm-layer"), t.above && this.dom.classList.add("cm-layer-above"), t.class && this.dom.classList.add(t.class), this.scale(), this.dom.setAttribute("aria-hidden", "true"), this.setOrder(e.state), e.requestMeasure(this.measureReq), t.mount && t.mount(this.dom, e);
  }
  update(e) {
    e.startState.facet(os) != e.state.facet(os) && this.setOrder(e.state), (this.layer.update(e, this.dom) || e.geometryChanged) && (this.scale(), e.view.requestMeasure(this.measureReq));
  }
  setOrder(e) {
    let t = 0, i = e.facet(os);
    for (; t < i.length && i[t] != this.layer; )
      t++;
    this.dom.style.zIndex = String((this.layer.above ? 150 : -1) - t);
  }
  measure() {
    return this.layer.markers(this.view);
  }
  scale() {
    let { scaleX: e, scaleY: t } = this.view;
    (e != this.scaleX || t != this.scaleY) && (this.scaleX = e, this.scaleY = t, this.dom.style.transform = `scale(${1 / e}, ${1 / t})`);
  }
  draw(e) {
    if (e.length != this.drawn.length || e.some((t, i) => !gm(t, this.drawn[i]))) {
      let t = this.dom.firstChild, i = 0;
      for (let s of e)
        s.update && t && s.constructor && this.drawn[i].constructor && s.update(t, this.drawn[i]) ? (t = t.nextSibling, i++) : this.dom.insertBefore(s.draw(), t);
      for (; t; ) {
        let s = t.nextSibling;
        t.remove(), t = s;
      }
      this.drawn = e;
    }
  }
  destroy() {
    this.layer.destroy && this.layer.destroy(this.dom, this.view), this.dom.remove();
  }
}
const os = /* @__PURE__ */ O.define();
function kc(n) {
  return [
    ke.define((e) => new bm(e, n)),
    os.of(n)
  ];
}
const vc = !D.ios, pn = /* @__PURE__ */ O.define({
  combine(n) {
    return ai(n, {
      cursorBlinkRate: 1200,
      drawRangeCursor: !0
    }, {
      cursorBlinkRate: (e, t) => Math.min(e, t),
      drawRangeCursor: (e, t) => e || t
    });
  }
});
function ym(n = {}) {
  return [
    pn.of(n),
    wm,
    km,
    vm,
    Xf.of(!0)
  ];
}
function xc(n) {
  return n.startState.facet(pn) != n.state.facet(pn);
}
const wm = /* @__PURE__ */ kc({
  above: !0,
  markers(n) {
    let { state: e } = n, t = e.facet(pn), i = [];
    for (let s of e.selection.ranges) {
      let r = s == e.selection.main;
      if (s.empty ? !r || vc : t.drawRangeCursor) {
        let o = r ? "cm-cursor cm-cursor-primary" : "cm-cursor cm-cursor-secondary", l = s.empty ? s : C.cursor(s.head, s.head > s.anchor ? -1 : 1);
        for (let a of _n.forRange(n, o, l))
          i.push(a);
      }
    }
    return i;
  },
  update(n, e) {
    n.transactions.some((i) => i.selection) && (e.style.animationName = e.style.animationName == "cm-blink" ? "cm-blink2" : "cm-blink");
    let t = xc(n);
    return t && ua(n.state, e), n.docChanged || n.selectionSet || t;
  },
  mount(n, e) {
    ua(e.state, n);
  },
  class: "cm-cursorLayer"
});
function ua(n, e) {
  e.style.animationDuration = n.facet(pn).cursorBlinkRate + "ms";
}
const km = /* @__PURE__ */ kc({
  above: !1,
  markers(n) {
    return n.state.selection.ranges.map((e) => e.empty ? [] : _n.forRange(n, "cm-selectionBackground", e)).reduce((e, t) => e.concat(t));
  },
  update(n, e) {
    return n.docChanged || n.selectionSet || n.viewportChanged || xc(n);
  },
  class: "cm-selectionLayer"
}), co = {
  ".cm-line": {
    "& ::selection": { backgroundColor: "transparent !important" },
    "&::selection": { backgroundColor: "transparent !important" }
  }
};
vc && (co[".cm-line"].caretColor = "transparent !important", co[".cm-content"] = { caretColor: "transparent !important" });
const vm = /* @__PURE__ */ vn.highest(/* @__PURE__ */ B.theme(co));
function da(n, e, t, i, s) {
  e.lastIndex = 0;
  for (let r = n.iterRange(t, i), o = t, l; !r.next().done; o += r.value.length)
    if (!r.lineBreak)
      for (; l = e.exec(r.value); )
        s(o + l.index, l);
}
function xm(n, e) {
  let t = n.visibleRanges;
  if (t.length == 1 && t[0].from == n.viewport.from && t[0].to == n.viewport.to)
    return t;
  let i = [];
  for (let { from: s, to: r } of t)
    s = Math.max(n.state.doc.lineAt(s).from, s - e), r = Math.min(n.state.doc.lineAt(r).to, r + e), i.length && i[i.length - 1].to >= s ? i[i.length - 1].to = r : i.push({ from: s, to: r });
  return i;
}
class Sm {
  /**
  Create a decorator.
  */
  constructor(e) {
    const { regexp: t, decoration: i, decorate: s, boundary: r, maxLength: o = 1e3 } = e;
    if (!t.global)
      throw new RangeError("The regular expression given to MatchDecorator should have its 'g' flag set");
    if (this.regexp = t, s)
      this.addMatch = (l, a, h, f) => s(f, h, h + l[0].length, l, a);
    else if (typeof i == "function")
      this.addMatch = (l, a, h, f) => {
        let c = i(l, a, h);
        c && f(h, h + l[0].length, c);
      };
    else if (i)
      this.addMatch = (l, a, h, f) => f(h, h + l[0].length, i);
    else
      throw new RangeError("Either 'decorate' or 'decoration' should be provided to MatchDecorator");
    this.boundary = r, this.maxLength = o;
  }
  /**
  Compute the full set of decorations for matches in the given
  view's viewport. You'll want to call this when initializing your
  plugin.
  */
  createDeco(e) {
    let t = new Qt(), i = t.add.bind(t);
    for (let { from: s, to: r } of xm(e, this.maxLength))
      da(e.state.doc, this.regexp, s, r, (o, l) => this.addMatch(l, e, o, i));
    return t.finish();
  }
  /**
  Update a set of decorations for a view update. `deco` _must_ be
  the set of decorations produced by _this_ `MatchDecorator` for
  the view state before the update.
  */
  updateDeco(e, t) {
    let i = 1e9, s = -1;
    return e.docChanged && e.changes.iterChanges((r, o, l, a) => {
      a > e.view.viewport.from && l < e.view.viewport.to && (i = Math.min(l, i), s = Math.max(a, s));
    }), e.viewportChanged || s - i > 1e3 ? this.createDeco(e.view) : s > -1 ? this.updateRange(e.view, t.map(e.changes), i, s) : t;
  }
  updateRange(e, t, i, s) {
    for (let r of e.visibleRanges) {
      let o = Math.max(r.from, i), l = Math.min(r.to, s);
      if (l > o) {
        let a = e.state.doc.lineAt(o), h = a.to < l ? e.state.doc.lineAt(l) : a, f = Math.max(r.from, a.from), c = Math.min(r.to, h.to);
        if (this.boundary) {
          for (; o > a.from; o--)
            if (this.boundary.test(a.text[o - 1 - a.from])) {
              f = o;
              break;
            }
          for (; l < h.to; l++)
            if (this.boundary.test(h.text[l - h.from])) {
              c = l;
              break;
            }
        }
        let u = [], d, p = (m, g, y) => u.push(y.range(m, g));
        if (a == h)
          for (this.regexp.lastIndex = f - a.from; (d = this.regexp.exec(a.text)) && d.index < c - a.from; )
            this.addMatch(d, e, d.index + a.from, p);
        else
          da(e.state.doc, this.regexp, f, c, (m, g) => this.addMatch(g, e, m, p));
        t = t.update({ filterFrom: f, filterTo: c, filter: (m, g) => m < f || g > c, add: u });
      }
    }
    return t;
  }
}
const uo = /x/.unicode != null ? "gu" : "g", _m = /* @__PURE__ */ new RegExp(`[\0-\b
--­؜​‎‏\u2028\u2029‭‮⁦⁧⁩\uFEFF￹-￼]`, uo), Cm = {
  0: "null",
  7: "bell",
  8: "backspace",
  10: "newline",
  11: "vertical tab",
  13: "carriage return",
  27: "escape",
  8203: "zero width space",
  8204: "zero width non-joiner",
  8205: "zero width joiner",
  8206: "left-to-right mark",
  8207: "right-to-left mark",
  8232: "line separator",
  8237: "left-to-right override",
  8238: "right-to-left override",
  8294: "left-to-right isolate",
  8295: "right-to-left isolate",
  8297: "pop directional isolate",
  8233: "paragraph separator",
  65279: "zero width no-break space",
  65532: "object replacement"
};
let sr = null;
function Am() {
  var n;
  if (sr == null && typeof document < "u" && document.body) {
    let e = document.body.style;
    sr = ((n = e.tabSize) !== null && n !== void 0 ? n : e.MozTabSize) != null;
  }
  return sr || !1;
}
const ls = /* @__PURE__ */ O.define({
  combine(n) {
    let e = ai(n, {
      render: null,
      specialChars: _m,
      addSpecialChars: null
    });
    return (e.replaceTabs = !Am()) && (e.specialChars = new RegExp("	|" + e.specialChars.source, uo)), e.addSpecialChars && (e.specialChars = new RegExp(e.specialChars.source + "|" + e.addSpecialChars.source, uo)), e;
  }
});
function Mm(n = {}) {
  return [ls.of(n), Tm()];
}
let pa = null;
function Tm() {
  return pa || (pa = ke.fromClass(class {
    constructor(n) {
      this.view = n, this.decorations = q.none, this.decorationCache = /* @__PURE__ */ Object.create(null), this.decorator = this.makeDecorator(n.state.facet(ls)), this.decorations = this.decorator.createDeco(n);
    }
    makeDecorator(n) {
      return new Sm({
        regexp: n.specialChars,
        decoration: (e, t, i) => {
          let { doc: s } = t.state, r = be(e[0], 0);
          if (r == 9) {
            let o = s.lineAt(i), l = t.state.tabSize, a = Ei(o.text, l, i - o.from);
            return q.replace({
              widget: new Pm((l - a % l) * this.view.defaultCharacterWidth / this.view.scaleX)
            });
          }
          return this.decorationCache[r] || (this.decorationCache[r] = q.replace({ widget: new Bm(n, r) }));
        },
        boundary: n.replaceTabs ? void 0 : /[^]/
      });
    }
    update(n) {
      let e = n.state.facet(ls);
      n.startState.facet(ls) != e ? (this.decorator = this.makeDecorator(e), this.decorations = this.decorator.createDeco(n.view)) : this.decorations = this.decorator.updateDeco(n, this.decorations);
    }
  }, {
    decorations: (n) => n.decorations
  }));
}
const Dm = "•";
function Om(n) {
  return n >= 32 ? Dm : n == 10 ? "␤" : String.fromCharCode(9216 + n);
}
class Bm extends ct {
  constructor(e, t) {
    super(), this.options = e, this.code = t;
  }
  eq(e) {
    return e.code == this.code;
  }
  toDOM(e) {
    let t = Om(this.code), i = e.state.phrase("Control character") + " " + (Cm[this.code] || "0x" + this.code.toString(16)), s = this.options.render && this.options.render(this.code, i, t);
    if (s)
      return s;
    let r = document.createElement("span");
    return r.textContent = t, r.title = i, r.setAttribute("aria-label", i), r.className = "cm-specialChar", r;
  }
  ignoreEvent() {
    return !1;
  }
}
class Pm extends ct {
  constructor(e) {
    super(), this.width = e;
  }
  eq(e) {
    return e.width == this.width;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.textContent = "	", e.className = "cm-tab", e.style.width = this.width + "px", e;
  }
  ignoreEvent() {
    return !1;
  }
}
class Lm extends ct {
  constructor(e) {
    super(), this.content = e;
  }
  toDOM() {
    let e = document.createElement("span");
    return e.className = "cm-placeholder", e.style.pointerEvents = "none", e.appendChild(typeof this.content == "string" ? document.createTextNode(this.content) : this.content), typeof this.content == "string" ? e.setAttribute("aria-label", "placeholder " + this.content) : e.setAttribute("aria-hidden", "true"), e;
  }
  coordsAt(e) {
    let t = e.firstChild ? Mi(e.firstChild) : [];
    if (!t.length)
      return null;
    let i = window.getComputedStyle(e.parentNode), s = Es(t[0], i.direction != "rtl"), r = parseInt(i.lineHeight);
    return s.bottom - s.top > r * 1.5 ? { left: s.left, right: s.right, top: s.top, bottom: s.top + r } : s;
  }
  ignoreEvent() {
    return !1;
  }
}
function Em(n) {
  return ke.fromClass(class {
    constructor(e) {
      this.view = e, this.placeholder = n ? q.set([q.widget({ widget: new Lm(n), side: 1 }).range(0)]) : q.none;
    }
    get decorations() {
      return this.view.state.doc.length ? q.none : this.placeholder;
    }
  }, { decorations: (e) => e.decorations });
}
const po = 2e3;
function Rm(n, e, t) {
  let i = Math.min(e.line, t.line), s = Math.max(e.line, t.line), r = [];
  if (e.off > po || t.off > po || e.col < 0 || t.col < 0) {
    let o = Math.min(e.off, t.off), l = Math.max(e.off, t.off);
    for (let a = i; a <= s; a++) {
      let h = n.doc.line(a);
      h.length <= l && r.push(C.range(h.from + o, h.to + l));
    }
  } else {
    let o = Math.min(e.col, t.col), l = Math.max(e.col, t.col);
    for (let a = i; a <= s; a++) {
      let h = n.doc.line(a), f = Kr(h.text, o, n.tabSize, !0);
      if (f < 0)
        r.push(C.cursor(h.to));
      else {
        let c = Kr(h.text, l, n.tabSize);
        r.push(C.range(h.from + f, h.from + c));
      }
    }
  }
  return r;
}
function Im(n, e) {
  let t = n.coordsAtPos(n.viewport.from);
  return t ? Math.round(Math.abs((t.left - e) / n.defaultCharacterWidth)) : -1;
}
function ma(n, e) {
  let t = n.posAtCoords({ x: e.clientX, y: e.clientY }, !1), i = n.state.doc.lineAt(t), s = t - i.from, r = s > po ? -1 : s == i.length ? Im(n, e.clientX) : Ei(i.text, n.state.tabSize, t - i.from);
  return { line: i.number, col: r, off: s };
}
function Nm(n, e) {
  let t = ma(n, e), i = n.state.selection;
  return t ? {
    update(s) {
      if (s.docChanged) {
        let r = s.changes.mapPos(s.startState.doc.line(t.line).from), o = s.state.doc.lineAt(r);
        t = { line: o.number, col: t.col, off: Math.min(t.off, o.length) }, i = i.map(s.changes);
      }
    },
    get(s, r, o) {
      let l = ma(n, s);
      if (!l)
        return i;
      let a = Rm(n.state, t, l);
      return a.length ? o ? C.create(a.concat(i.ranges)) : C.create(a) : i;
    }
  } : null;
}
function Fm(n) {
  let e = (n == null ? void 0 : n.eventFilter) || ((t) => t.altKey && t.button == 0);
  return B.mouseSelectionStyle.of((t, i) => e(i) ? Nm(t, i) : null);
}
const Hm = {
  Alt: [18, (n) => !!n.altKey],
  Control: [17, (n) => !!n.ctrlKey],
  Shift: [16, (n) => !!n.shiftKey],
  Meta: [91, (n) => !!n.metaKey]
}, Vm = { style: "cursor: crosshair" };
function Wm(n = {}) {
  let [e, t] = Hm[n.key || "Alt"], i = ke.fromClass(class {
    constructor(s) {
      this.view = s, this.isDown = !1;
    }
    set(s) {
      this.isDown != s && (this.isDown = s, this.view.update([]));
    }
  }, {
    eventObservers: {
      keydown(s) {
        this.set(s.keyCode == e || t(s));
      },
      keyup(s) {
        (s.keyCode == e || !t(s)) && this.set(!1);
      },
      mousemove(s) {
        this.set(t(s));
      }
    }
  });
  return [
    i,
    B.contentAttributes.of((s) => {
      var r;
      return !((r = s.plugin(i)) === null || r === void 0) && r.isDown ? Vm : null;
    })
  ];
}
const zi = "-10000px";
class Sc {
  constructor(e, t, i, s) {
    this.facet = t, this.createTooltipView = i, this.removeTooltipView = s, this.input = e.state.facet(t), this.tooltips = this.input.filter((r) => r), this.tooltipViews = this.tooltips.map(i);
  }
  update(e, t) {
    var i;
    let s = e.state.facet(this.facet), r = s.filter((a) => a);
    if (s === this.input) {
      for (let a of this.tooltipViews)
        a.update && a.update(e);
      return !1;
    }
    let o = [], l = t ? [] : null;
    for (let a = 0; a < r.length; a++) {
      let h = r[a], f = -1;
      if (h) {
        for (let c = 0; c < this.tooltips.length; c++) {
          let u = this.tooltips[c];
          u && u.create == h.create && (f = c);
        }
        if (f < 0)
          o[a] = this.createTooltipView(h), l && (l[a] = !!h.above);
        else {
          let c = o[a] = this.tooltipViews[f];
          l && (l[a] = t[f]), c.update && c.update(e);
        }
      }
    }
    for (let a of this.tooltipViews)
      o.indexOf(a) < 0 && (this.removeTooltipView(a), (i = a.destroy) === null || i === void 0 || i.call(a));
    return t && (l.forEach((a, h) => t[h] = a), t.length = l.length), this.input = s, this.tooltips = r, this.tooltipViews = o, !0;
  }
}
function zm(n) {
  let { win: e } = n;
  return { top: 0, left: 0, bottom: e.innerHeight, right: e.innerWidth };
}
const rr = /* @__PURE__ */ O.define({
  combine: (n) => {
    var e, t, i;
    return {
      position: D.ios ? "absolute" : ((e = n.find((s) => s.position)) === null || e === void 0 ? void 0 : e.position) || "fixed",
      parent: ((t = n.find((s) => s.parent)) === null || t === void 0 ? void 0 : t.parent) || null,
      tooltipSpace: ((i = n.find((s) => s.tooltipSpace)) === null || i === void 0 ? void 0 : i.tooltipSpace) || zm
    };
  }
}), ga = /* @__PURE__ */ new WeakMap(), qo = /* @__PURE__ */ ke.fromClass(class {
  constructor(n) {
    this.view = n, this.above = [], this.inView = !0, this.madeAbsolute = !1, this.lastTransaction = 0, this.measureTimeout = -1;
    let e = n.state.facet(rr);
    this.position = e.position, this.parent = e.parent, this.classes = n.themeClasses, this.createContainer(), this.measureReq = { read: this.readMeasure.bind(this), write: this.writeMeasure.bind(this), key: this }, this.resizeObserver = typeof ResizeObserver == "function" ? new ResizeObserver(() => this.measureSoon()) : null, this.manager = new Sc(n, jo, (t) => this.createTooltip(t), (t) => {
      this.resizeObserver && this.resizeObserver.unobserve(t.dom), t.dom.remove();
    }), this.above = this.manager.tooltips.map((t) => !!t.above), this.intersectionObserver = typeof IntersectionObserver == "function" ? new IntersectionObserver((t) => {
      Date.now() > this.lastTransaction - 50 && t.length > 0 && t[t.length - 1].intersectionRatio < 1 && this.measureSoon();
    }, { threshold: [1] }) : null, this.observeIntersection(), n.win.addEventListener("resize", this.measureSoon = this.measureSoon.bind(this)), this.maybeMeasure();
  }
  createContainer() {
    this.parent ? (this.container = document.createElement("div"), this.container.style.position = "relative", this.container.className = this.view.themeClasses, this.parent.appendChild(this.container)) : this.container = this.view.dom;
  }
  observeIntersection() {
    if (this.intersectionObserver) {
      this.intersectionObserver.disconnect();
      for (let n of this.manager.tooltipViews)
        this.intersectionObserver.observe(n.dom);
    }
  }
  measureSoon() {
    this.measureTimeout < 0 && (this.measureTimeout = setTimeout(() => {
      this.measureTimeout = -1, this.maybeMeasure();
    }, 50));
  }
  update(n) {
    n.transactions.length && (this.lastTransaction = Date.now());
    let e = this.manager.update(n, this.above);
    e && this.observeIntersection();
    let t = e || n.geometryChanged, i = n.state.facet(rr);
    if (i.position != this.position && !this.madeAbsolute) {
      this.position = i.position;
      for (let s of this.manager.tooltipViews)
        s.dom.style.position = this.position;
      t = !0;
    }
    if (i.parent != this.parent) {
      this.parent && this.container.remove(), this.parent = i.parent, this.createContainer();
      for (let s of this.manager.tooltipViews)
        this.container.appendChild(s.dom);
      t = !0;
    } else
      this.parent && this.view.themeClasses != this.classes && (this.classes = this.container.className = this.view.themeClasses);
    t && this.maybeMeasure();
  }
  createTooltip(n) {
    let e = n.create(this.view);
    if (e.dom.classList.add("cm-tooltip"), n.arrow && !e.dom.querySelector(".cm-tooltip > .cm-tooltip-arrow")) {
      let t = document.createElement("div");
      t.className = "cm-tooltip-arrow", e.dom.appendChild(t);
    }
    return e.dom.style.position = this.position, e.dom.style.top = zi, e.dom.style.left = "0px", this.container.appendChild(e.dom), e.mount && e.mount(this.view), this.resizeObserver && this.resizeObserver.observe(e.dom), e;
  }
  destroy() {
    var n, e, t;
    this.view.win.removeEventListener("resize", this.measureSoon);
    for (let i of this.manager.tooltipViews)
      i.dom.remove(), (n = i.destroy) === null || n === void 0 || n.call(i);
    this.parent && this.container.remove(), (e = this.resizeObserver) === null || e === void 0 || e.disconnect(), (t = this.intersectionObserver) === null || t === void 0 || t.disconnect(), clearTimeout(this.measureTimeout);
  }
  readMeasure() {
    let n = this.view.dom.getBoundingClientRect(), e = 1, t = 1, i = !1;
    if (this.position == "fixed" && this.manager.tooltipViews.length) {
      let { dom: s } = this.manager.tooltipViews[0];
      if (D.gecko)
        i = s.offsetParent != this.container.ownerDocument.body;
      else if (s.style.top == zi && s.style.left == "0px") {
        let r = s.getBoundingClientRect();
        i = Math.abs(r.top + 1e4) > 1 || Math.abs(r.left) > 1;
      }
    }
    if (i || this.position == "absolute")
      if (this.parent) {
        let s = this.parent.getBoundingClientRect();
        s.width && s.height && (e = s.width / this.parent.offsetWidth, t = s.height / this.parent.offsetHeight);
      } else
        ({ scaleX: e, scaleY: t } = this.view.viewState);
    return {
      editor: n,
      parent: this.parent ? this.container.getBoundingClientRect() : n,
      pos: this.manager.tooltips.map((s, r) => {
        let o = this.manager.tooltipViews[r];
        return o.getCoords ? o.getCoords(s.pos) : this.view.coordsAtPos(s.pos);
      }),
      size: this.manager.tooltipViews.map(({ dom: s }) => s.getBoundingClientRect()),
      space: this.view.state.facet(rr).tooltipSpace(this.view),
      scaleX: e,
      scaleY: t,
      makeAbsolute: i
    };
  }
  writeMeasure(n) {
    var e;
    if (n.makeAbsolute) {
      this.madeAbsolute = !0, this.position = "absolute";
      for (let l of this.manager.tooltipViews)
        l.dom.style.position = "absolute";
    }
    let { editor: t, space: i, scaleX: s, scaleY: r } = n, o = [];
    for (let l = 0; l < this.manager.tooltips.length; l++) {
      let a = this.manager.tooltips[l], h = this.manager.tooltipViews[l], { dom: f } = h, c = n.pos[l], u = n.size[l];
      if (!c || c.bottom <= Math.max(t.top, i.top) || c.top >= Math.min(t.bottom, i.bottom) || c.right < Math.max(t.left, i.left) - 0.1 || c.left > Math.min(t.right, i.right) + 0.1) {
        f.style.top = zi;
        continue;
      }
      let d = a.arrow ? h.dom.querySelector(".cm-tooltip-arrow") : null, p = d ? 7 : 0, m = u.right - u.left, g = (e = ga.get(h)) !== null && e !== void 0 ? e : u.bottom - u.top, y = h.offset || jm, k = this.view.textDirection == te.LTR, w = u.width > i.right - i.left ? k ? i.left : i.right - u.width : k ? Math.min(c.left - (d ? 14 : 0) + y.x, i.right - m) : Math.max(i.left, c.left - m + (d ? 14 : 0) - y.x), S = this.above[l];
      !a.strictSide && (S ? c.top - (u.bottom - u.top) - y.y < i.top : c.bottom + (u.bottom - u.top) + y.y > i.bottom) && S == i.bottom - c.bottom > c.top - i.top && (S = this.above[l] = !S);
      let _ = (S ? c.top - i.top : i.bottom - c.bottom) - p;
      if (_ < g && h.resize !== !1) {
        if (_ < this.view.defaultLineHeight) {
          f.style.top = zi;
          continue;
        }
        ga.set(h, g), f.style.height = (g = _) / r + "px";
      } else
        f.style.height && (f.style.height = "");
      let v = S ? c.top - g - p - y.y : c.bottom + p + y.y, x = w + m;
      if (h.overlap !== !0)
        for (let P of o)
          P.left < x && P.right > w && P.top < v + g && P.bottom > v && (v = S ? P.top - g - 2 - p : P.bottom + p + 2);
      if (this.position == "absolute" ? (f.style.top = (v - n.parent.top) / r + "px", f.style.left = (w - n.parent.left) / s + "px") : (f.style.top = v / r + "px", f.style.left = w / s + "px"), d) {
        let P = c.left + (k ? y.x : -y.x) - (w + 14 - 7);
        d.style.left = P / s + "px";
      }
      h.overlap !== !0 && o.push({ left: w, top: v, right: x, bottom: v + g }), f.classList.toggle("cm-tooltip-above", S), f.classList.toggle("cm-tooltip-below", !S), h.positioned && h.positioned(n.space);
    }
  }
  maybeMeasure() {
    if (this.manager.tooltips.length && (this.view.inView && this.view.requestMeasure(this.measureReq), this.inView != this.view.inView && (this.inView = this.view.inView, !this.inView)))
      for (let n of this.manager.tooltipViews)
        n.dom.style.top = zi;
  }
}, {
  eventObservers: {
    scroll() {
      this.maybeMeasure();
    }
  }
}), qm = /* @__PURE__ */ B.baseTheme({
  ".cm-tooltip": {
    zIndex: 100,
    boxSizing: "border-box"
  },
  "&light .cm-tooltip": {
    border: "1px solid #bbb",
    backgroundColor: "#f5f5f5"
  },
  "&light .cm-tooltip-section:not(:first-child)": {
    borderTop: "1px solid #bbb"
  },
  "&dark .cm-tooltip": {
    backgroundColor: "#333338",
    color: "white"
  },
  ".cm-tooltip-arrow": {
    height: "7px",
    width: `${7 * 2}px`,
    position: "absolute",
    zIndex: -1,
    overflow: "hidden",
    "&:before, &:after": {
      content: "''",
      position: "absolute",
      width: 0,
      height: 0,
      borderLeft: "7px solid transparent",
      borderRight: "7px solid transparent"
    },
    ".cm-tooltip-above &": {
      bottom: "-7px",
      "&:before": {
        borderTop: "7px solid #bbb"
      },
      "&:after": {
        borderTop: "7px solid #f5f5f5",
        bottom: "1px"
      }
    },
    ".cm-tooltip-below &": {
      top: "-7px",
      "&:before": {
        borderBottom: "7px solid #bbb"
      },
      "&:after": {
        borderBottom: "7px solid #f5f5f5",
        top: "1px"
      }
    }
  },
  "&dark .cm-tooltip .cm-tooltip-arrow": {
    "&:before": {
      borderTopColor: "#333338",
      borderBottomColor: "#333338"
    },
    "&:after": {
      borderTopColor: "transparent",
      borderBottomColor: "transparent"
    }
  }
}), jm = { x: 0, y: 0 }, jo = /* @__PURE__ */ O.define({
  enables: [qo, qm]
}), ws = /* @__PURE__ */ O.define();
class Fs {
  // Needs to be static so that host tooltip instances always match
  static create(e) {
    return new Fs(e);
  }
  constructor(e) {
    this.view = e, this.mounted = !1, this.dom = document.createElement("div"), this.dom.classList.add("cm-tooltip-hover"), this.manager = new Sc(e, ws, (t) => this.createHostedView(t), (t) => t.dom.remove());
  }
  createHostedView(e) {
    let t = e.create(this.view);
    return t.dom.classList.add("cm-tooltip-section"), this.dom.appendChild(t.dom), this.mounted && t.mount && t.mount(this.view), t;
  }
  mount(e) {
    for (let t of this.manager.tooltipViews)
      t.mount && t.mount(e);
    this.mounted = !0;
  }
  positioned(e) {
    for (let t of this.manager.tooltipViews)
      t.positioned && t.positioned(e);
  }
  update(e) {
    this.manager.update(e);
  }
  destroy() {
    var e;
    for (let t of this.manager.tooltipViews)
      (e = t.destroy) === null || e === void 0 || e.call(t);
  }
  passProp(e) {
    let t;
    for (let i of this.manager.tooltipViews) {
      let s = i[e];
      if (s !== void 0) {
        if (t === void 0)
          t = s;
        else if (t !== s)
          return;
      }
    }
    return t;
  }
  get offset() {
    return this.passProp("offset");
  }
  get getCoords() {
    return this.passProp("getCoords");
  }
  get overlap() {
    return this.passProp("overlap");
  }
  get resize() {
    return this.passProp("resize");
  }
}
const Km = /* @__PURE__ */ jo.compute([ws], (n) => {
  let e = n.facet(ws).filter((t) => t);
  return e.length === 0 ? null : {
    pos: Math.min(...e.map((t) => t.pos)),
    end: Math.max(...e.map((t) => {
      var i;
      return (i = t.end) !== null && i !== void 0 ? i : t.pos;
    })),
    create: Fs.create,
    above: e[0].above,
    arrow: e.some((t) => t.arrow)
  };
});
class Um {
  constructor(e, t, i, s, r) {
    this.view = e, this.source = t, this.field = i, this.setHover = s, this.hoverTime = r, this.hoverTimeout = -1, this.restartTimeout = -1, this.pending = null, this.lastMove = { x: 0, y: 0, target: e.dom, time: 0 }, this.checkHover = this.checkHover.bind(this), e.dom.addEventListener("mouseleave", this.mouseleave = this.mouseleave.bind(this)), e.dom.addEventListener("mousemove", this.mousemove = this.mousemove.bind(this));
  }
  update() {
    this.pending && (this.pending = null, clearTimeout(this.restartTimeout), this.restartTimeout = setTimeout(() => this.startHover(), 20));
  }
  get active() {
    return this.view.state.field(this.field);
  }
  checkHover() {
    if (this.hoverTimeout = -1, this.active)
      return;
    let e = Date.now() - this.lastMove.time;
    e < this.hoverTime ? this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime - e) : this.startHover();
  }
  startHover() {
    clearTimeout(this.restartTimeout);
    let { view: e, lastMove: t } = this, i = e.docView.nearest(t.target);
    if (!i)
      return;
    let s, r = 1;
    if (i instanceof Ot)
      s = i.posAtStart;
    else {
      if (s = e.posAtCoords(t), s == null)
        return;
      let l = e.coordsAtPos(s);
      if (!l || t.y < l.top || t.y > l.bottom || t.x < l.left - e.defaultCharacterWidth || t.x > l.right + e.defaultCharacterWidth)
        return;
      let a = e.bidiSpans(e.state.doc.lineAt(s)).find((f) => f.from <= s && f.to >= s), h = a && a.dir == te.RTL ? -1 : 1;
      r = t.x < l.left ? -h : h;
    }
    let o = this.source(e, s, r);
    if (o != null && o.then) {
      let l = this.pending = { pos: s };
      o.then((a) => {
        this.pending == l && (this.pending = null, a && e.dispatch({ effects: this.setHover.of(a) }));
      }, (a) => ft(e.state, a, "hover tooltip"));
    } else
      o && e.dispatch({ effects: this.setHover.of(o) });
  }
  get tooltip() {
    let e = this.view.plugin(qo), t = e ? e.manager.tooltips.findIndex((i) => i.create == Fs.create) : -1;
    return t > -1 ? e.manager.tooltipViews[t] : null;
  }
  mousemove(e) {
    var t;
    this.lastMove = { x: e.clientX, y: e.clientY, target: e.target, time: Date.now() }, this.hoverTimeout < 0 && (this.hoverTimeout = setTimeout(this.checkHover, this.hoverTime));
    let { active: i, tooltip: s } = this;
    if (i && s && !Gm(s.dom, e) || this.pending) {
      let { pos: r } = i || this.pending, o = (t = i == null ? void 0 : i.end) !== null && t !== void 0 ? t : r;
      (r == o ? this.view.posAtCoords(this.lastMove) != r : !Ym(this.view, r, o, e.clientX, e.clientY)) && (this.view.dispatch({ effects: this.setHover.of(null) }), this.pending = null);
    }
  }
  mouseleave(e) {
    clearTimeout(this.hoverTimeout), this.hoverTimeout = -1;
    let { active: t } = this;
    if (t) {
      let { tooltip: i } = this;
      i && i.dom.contains(e.relatedTarget) ? this.watchTooltipLeave(i.dom) : this.view.dispatch({ effects: this.setHover.of(null) });
    }
  }
  watchTooltipLeave(e) {
    let t = (i) => {
      e.removeEventListener("mouseleave", t), this.active && !this.view.dom.contains(i.relatedTarget) && this.view.dispatch({ effects: this.setHover.of(null) });
    };
    e.addEventListener("mouseleave", t);
  }
  destroy() {
    clearTimeout(this.hoverTimeout), this.view.dom.removeEventListener("mouseleave", this.mouseleave), this.view.dom.removeEventListener("mousemove", this.mousemove);
  }
}
const Vn = 4;
function Gm(n, e) {
  let t = n.getBoundingClientRect();
  return e.clientX >= t.left - Vn && e.clientX <= t.right + Vn && e.clientY >= t.top - Vn && e.clientY <= t.bottom + Vn;
}
function Ym(n, e, t, i, s, r) {
  let o = n.scrollDOM.getBoundingClientRect(), l = n.documentTop + n.documentPadding.top + n.contentHeight;
  if (o.left > i || o.right < i || o.top > s || Math.min(o.bottom, l) < s)
    return !1;
  let a = n.posAtCoords({ x: i, y: s }, !1);
  return a >= e && a <= t;
}
function Jm(n, e = {}) {
  let t = z.define(), i = Me.define({
    create() {
      return null;
    },
    update(s, r) {
      if (s && (e.hideOnChange && (r.docChanged || r.selection) || e.hideOn && e.hideOn(r, s)))
        return null;
      if (s && r.docChanged) {
        let o = r.changes.mapPos(s.pos, -1, me.TrackDel);
        if (o == null)
          return null;
        let l = Object.assign(/* @__PURE__ */ Object.create(null), s);
        l.pos = o, s.end != null && (l.end = r.changes.mapPos(s.end)), s = l;
      }
      for (let o of r.effects)
        o.is(t) && (s = o.value), o.is(Zm) && (s = null);
      return s;
    },
    provide: (s) => ws.from(s)
  });
  return [
    i,
    ke.define((s) => new Um(
      s,
      n,
      i,
      t,
      e.hoverTime || 300
      /* Hover.Time */
    )),
    Km
  ];
}
function Xm(n, e) {
  let t = n.plugin(qo);
  if (!t)
    return null;
  let i = t.manager.tooltips.indexOf(e);
  return i < 0 ? null : t.manager.tooltipViews[i];
}
const Zm = /* @__PURE__ */ z.define(), ba = /* @__PURE__ */ O.define({
  combine(n) {
    let e, t;
    for (let i of n)
      e = e || i.topContainer, t = t || i.bottomContainer;
    return { topContainer: e, bottomContainer: t };
  }
});
function Qm(n, e) {
  let t = n.plugin(_c), i = t ? t.specs.indexOf(e) : -1;
  return i > -1 ? t.panels[i] : null;
}
const _c = /* @__PURE__ */ ke.fromClass(class {
  constructor(n) {
    this.input = n.state.facet(mo), this.specs = this.input.filter((t) => t), this.panels = this.specs.map((t) => t(n));
    let e = n.state.facet(ba);
    this.top = new Wn(n, !0, e.topContainer), this.bottom = new Wn(n, !1, e.bottomContainer), this.top.sync(this.panels.filter((t) => t.top)), this.bottom.sync(this.panels.filter((t) => !t.top));
    for (let t of this.panels)
      t.dom.classList.add("cm-panel"), t.mount && t.mount();
  }
  update(n) {
    let e = n.state.facet(ba);
    this.top.container != e.topContainer && (this.top.sync([]), this.top = new Wn(n.view, !0, e.topContainer)), this.bottom.container != e.bottomContainer && (this.bottom.sync([]), this.bottom = new Wn(n.view, !1, e.bottomContainer)), this.top.syncClasses(), this.bottom.syncClasses();
    let t = n.state.facet(mo);
    if (t != this.input) {
      let i = t.filter((a) => a), s = [], r = [], o = [], l = [];
      for (let a of i) {
        let h = this.specs.indexOf(a), f;
        h < 0 ? (f = a(n.view), l.push(f)) : (f = this.panels[h], f.update && f.update(n)), s.push(f), (f.top ? r : o).push(f);
      }
      this.specs = i, this.panels = s, this.top.sync(r), this.bottom.sync(o);
      for (let a of l)
        a.dom.classList.add("cm-panel"), a.mount && a.mount();
    } else
      for (let i of this.panels)
        i.update && i.update(n);
  }
  destroy() {
    this.top.sync([]), this.bottom.sync([]);
  }
}, {
  provide: (n) => B.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return t && { top: t.top.scrollMargin(), bottom: t.bottom.scrollMargin() };
  })
});
class Wn {
  constructor(e, t, i) {
    this.view = e, this.top = t, this.container = i, this.dom = void 0, this.classes = "", this.panels = [], this.syncClasses();
  }
  sync(e) {
    for (let t of this.panels)
      t.destroy && e.indexOf(t) < 0 && t.destroy();
    this.panels = e, this.syncDOM();
  }
  syncDOM() {
    if (this.panels.length == 0) {
      this.dom && (this.dom.remove(), this.dom = void 0);
      return;
    }
    if (!this.dom) {
      this.dom = document.createElement("div"), this.dom.className = this.top ? "cm-panels cm-panels-top" : "cm-panels cm-panels-bottom", this.dom.style[this.top ? "top" : "bottom"] = "0";
      let t = this.container || this.view.dom;
      t.insertBefore(this.dom, this.top ? t.firstChild : null);
    }
    let e = this.dom.firstChild;
    for (let t of this.panels)
      if (t.dom.parentNode == this.dom) {
        for (; e != t.dom; )
          e = ya(e);
        e = e.nextSibling;
      } else
        this.dom.insertBefore(t.dom, e);
    for (; e; )
      e = ya(e);
  }
  scrollMargin() {
    return !this.dom || this.container ? 0 : Math.max(0, this.top ? this.dom.getBoundingClientRect().bottom - Math.max(0, this.view.scrollDOM.getBoundingClientRect().top) : Math.min(innerHeight, this.view.scrollDOM.getBoundingClientRect().bottom) - this.dom.getBoundingClientRect().top);
  }
  syncClasses() {
    if (!(!this.container || this.classes == this.view.themeClasses)) {
      for (let e of this.classes.split(" "))
        e && this.container.classList.remove(e);
      for (let e of (this.classes = this.view.themeClasses).split(" "))
        e && this.container.classList.add(e);
    }
  }
}
function ya(n) {
  let e = n.nextSibling;
  return n.remove(), e;
}
const mo = /* @__PURE__ */ O.define({
  enables: _c
});
class Nt extends Zt {
  /**
  @internal
  */
  compare(e) {
    return this == e || this.constructor == e.constructor && this.eq(e);
  }
  /**
  Compare this marker to another marker of the same type.
  */
  eq(e) {
    return !1;
  }
  /**
  Called if the marker has a `toDOM` method and its representation
  was removed from a gutter.
  */
  destroy(e) {
  }
}
Nt.prototype.elementClass = "";
Nt.prototype.toDOM = void 0;
Nt.prototype.mapMode = me.TrackBefore;
Nt.prototype.startSide = Nt.prototype.endSide = -1;
Nt.prototype.point = !0;
const or = /* @__PURE__ */ O.define(), $m = {
  class: "",
  renderEmptyElements: !1,
  elementStyle: "",
  markers: () => Y.empty,
  lineMarker: () => null,
  widgetMarker: () => null,
  lineMarkerChange: null,
  initialSpacer: null,
  updateSpacer: null,
  domEventHandlers: {}
}, rn = /* @__PURE__ */ O.define();
function eg(n) {
  return [Cc(), rn.of(Object.assign(Object.assign({}, $m), n))];
}
const go = /* @__PURE__ */ O.define({
  combine: (n) => n.some((e) => e)
});
function Cc(n) {
  let e = [
    tg
  ];
  return n && n.fixed === !1 && e.push(go.of(!0)), e;
}
const tg = /* @__PURE__ */ ke.fromClass(class {
  constructor(n) {
    this.view = n, this.prevViewport = n.viewport, this.dom = document.createElement("div"), this.dom.className = "cm-gutters", this.dom.setAttribute("aria-hidden", "true"), this.dom.style.minHeight = this.view.contentHeight / this.view.scaleY + "px", this.gutters = n.state.facet(rn).map((e) => new ka(n, e));
    for (let e of this.gutters)
      this.dom.appendChild(e.dom);
    this.fixed = !n.state.facet(go), this.fixed && (this.dom.style.position = "sticky"), this.syncGutters(!1), n.scrollDOM.insertBefore(this.dom, n.contentDOM);
  }
  update(n) {
    if (this.updateGutters(n)) {
      let e = this.prevViewport, t = n.view.viewport, i = Math.min(e.to, t.to) - Math.max(e.from, t.from);
      this.syncGutters(i < (t.to - t.from) * 0.8);
    }
    n.geometryChanged && (this.dom.style.minHeight = this.view.contentHeight + "px"), this.view.state.facet(go) != !this.fixed && (this.fixed = !this.fixed, this.dom.style.position = this.fixed ? "sticky" : ""), this.prevViewport = n.view.viewport;
  }
  syncGutters(n) {
    let e = this.dom.nextSibling;
    n && this.dom.remove();
    let t = Y.iter(this.view.state.facet(or), this.view.viewport.from), i = [], s = this.gutters.map((r) => new ig(r, this.view.viewport, -this.view.documentPadding.top));
    for (let r of this.view.viewportLineBlocks)
      if (i.length && (i = []), Array.isArray(r.type)) {
        let o = !0;
        for (let l of r.type)
          if (l.type == Se.Text && o) {
            bo(t, i, l.from);
            for (let a of s)
              a.line(this.view, l, i);
            o = !1;
          } else if (l.widget)
            for (let a of s)
              a.widget(this.view, l);
      } else if (r.type == Se.Text) {
        bo(t, i, r.from);
        for (let o of s)
          o.line(this.view, r, i);
      } else if (r.widget)
        for (let o of s)
          o.widget(this.view, r);
    for (let r of s)
      r.finish();
    n && this.view.scrollDOM.insertBefore(this.dom, e);
  }
  updateGutters(n) {
    let e = n.startState.facet(rn), t = n.state.facet(rn), i = n.docChanged || n.heightChanged || n.viewportChanged || !Y.eq(n.startState.facet(or), n.state.facet(or), n.view.viewport.from, n.view.viewport.to);
    if (e == t)
      for (let s of this.gutters)
        s.update(n) && (i = !0);
    else {
      i = !0;
      let s = [];
      for (let r of t) {
        let o = e.indexOf(r);
        o < 0 ? s.push(new ka(this.view, r)) : (this.gutters[o].update(n), s.push(this.gutters[o]));
      }
      for (let r of this.gutters)
        r.dom.remove(), s.indexOf(r) < 0 && r.destroy();
      for (let r of s)
        this.dom.appendChild(r.dom);
      this.gutters = s;
    }
    return i;
  }
  destroy() {
    for (let n of this.gutters)
      n.destroy();
    this.dom.remove();
  }
}, {
  provide: (n) => B.scrollMargins.of((e) => {
    let t = e.plugin(n);
    return !t || t.gutters.length == 0 || !t.fixed ? null : e.textDirection == te.LTR ? { left: t.dom.offsetWidth * e.scaleX } : { right: t.dom.offsetWidth * e.scaleX };
  })
});
function wa(n) {
  return Array.isArray(n) ? n : [n];
}
function bo(n, e, t) {
  for (; n.value && n.from <= t; )
    n.from == t && e.push(n.value), n.next();
}
class ig {
  constructor(e, t, i) {
    this.gutter = e, this.height = i, this.i = 0, this.cursor = Y.iter(e.markers, t.from);
  }
  addElement(e, t, i) {
    let { gutter: s } = this, r = (t.top - this.height) / e.scaleY, o = t.height / e.scaleY;
    if (this.i == s.elements.length) {
      let l = new Ac(e, o, r, i);
      s.elements.push(l), s.dom.appendChild(l.dom);
    } else
      s.elements[this.i].update(e, o, r, i);
    this.height = t.bottom, this.i++;
  }
  line(e, t, i) {
    let s = [];
    bo(this.cursor, s, t.from), i.length && (s = s.concat(i));
    let r = this.gutter.config.lineMarker(e, t, s);
    r && s.unshift(r);
    let o = this.gutter;
    s.length == 0 && !o.config.renderEmptyElements || this.addElement(e, t, s);
  }
  widget(e, t) {
    let i = this.gutter.config.widgetMarker(e, t.widget, t);
    i && this.addElement(e, t, [i]);
  }
  finish() {
    let e = this.gutter;
    for (; e.elements.length > this.i; ) {
      let t = e.elements.pop();
      e.dom.removeChild(t.dom), t.destroy();
    }
  }
}
class ka {
  constructor(e, t) {
    this.view = e, this.config = t, this.elements = [], this.spacer = null, this.dom = document.createElement("div"), this.dom.className = "cm-gutter" + (this.config.class ? " " + this.config.class : "");
    for (let i in t.domEventHandlers)
      this.dom.addEventListener(i, (s) => {
        let r = s.target, o;
        if (r != this.dom && this.dom.contains(r)) {
          for (; r.parentNode != this.dom; )
            r = r.parentNode;
          let a = r.getBoundingClientRect();
          o = (a.top + a.bottom) / 2;
        } else
          o = s.clientY;
        let l = e.lineBlockAtHeight(o - e.documentTop);
        t.domEventHandlers[i](e, l, s) && s.preventDefault();
      });
    this.markers = wa(t.markers(e)), t.initialSpacer && (this.spacer = new Ac(e, 0, 0, [t.initialSpacer(e)]), this.dom.appendChild(this.spacer.dom), this.spacer.dom.style.cssText += "visibility: hidden; pointer-events: none");
  }
  update(e) {
    let t = this.markers;
    if (this.markers = wa(this.config.markers(e.view)), this.spacer && this.config.updateSpacer) {
      let s = this.config.updateSpacer(this.spacer.markers[0], e);
      s != this.spacer.markers[0] && this.spacer.update(e.view, 0, 0, [s]);
    }
    let i = e.view.viewport;
    return !Y.eq(this.markers, t, i.from, i.to) || (this.config.lineMarkerChange ? this.config.lineMarkerChange(e) : !1);
  }
  destroy() {
    for (let e of this.elements)
      e.destroy();
  }
}
class Ac {
  constructor(e, t, i, s) {
    this.height = -1, this.above = 0, this.markers = [], this.dom = document.createElement("div"), this.dom.className = "cm-gutterElement", this.update(e, t, i, s);
  }
  update(e, t, i, s) {
    this.height != t && (this.height = t, this.dom.style.height = t + "px"), this.above != i && (this.dom.style.marginTop = (this.above = i) ? i + "px" : ""), ng(this.markers, s) || this.setMarkers(e, s);
  }
  setMarkers(e, t) {
    let i = "cm-gutterElement", s = this.dom.firstChild;
    for (let r = 0, o = 0; ; ) {
      let l = o, a = r < t.length ? t[r++] : null, h = !1;
      if (a) {
        let f = a.elementClass;
        f && (i += " " + f);
        for (let c = o; c < this.markers.length; c++)
          if (this.markers[c].compare(a)) {
            l = c, h = !0;
            break;
          }
      } else
        l = this.markers.length;
      for (; o < l; ) {
        let f = this.markers[o++];
        if (f.toDOM) {
          f.destroy(s);
          let c = s.nextSibling;
          s.remove(), s = c;
        }
      }
      if (!a)
        break;
      a.toDOM && (h ? s = s.nextSibling : this.dom.insertBefore(a.toDOM(e), s)), h && o++;
    }
    this.dom.className = i, this.markers = t;
  }
  destroy() {
    this.setMarkers(null, []);
  }
}
function ng(n, e) {
  if (n.length != e.length)
    return !1;
  for (let t = 0; t < n.length; t++)
    if (!n[t].compare(e[t]))
      return !1;
  return !0;
}
const sg = /* @__PURE__ */ O.define(), pi = /* @__PURE__ */ O.define({
  combine(n) {
    return ai(n, { formatNumber: String, domEventHandlers: {} }, {
      domEventHandlers(e, t) {
        let i = Object.assign({}, e);
        for (let s in t) {
          let r = i[s], o = t[s];
          i[s] = r ? (l, a, h) => r(l, a, h) || o(l, a, h) : o;
        }
        return i;
      }
    });
  }
});
class lr extends Nt {
  constructor(e) {
    super(), this.number = e;
  }
  eq(e) {
    return this.number == e.number;
  }
  toDOM() {
    return document.createTextNode(this.number);
  }
}
function ar(n, e) {
  return n.state.facet(pi).formatNumber(e, n.state);
}
const rg = /* @__PURE__ */ rn.compute([pi], (n) => ({
  class: "cm-lineNumbers",
  renderEmptyElements: !1,
  markers(e) {
    return e.state.facet(sg);
  },
  lineMarker(e, t, i) {
    return i.some((s) => s.toDOM) ? null : new lr(ar(e, e.state.doc.lineAt(t.from).number));
  },
  widgetMarker: () => null,
  lineMarkerChange: (e) => e.startState.facet(pi) != e.state.facet(pi),
  initialSpacer(e) {
    return new lr(ar(e, va(e.state.doc.lines)));
  },
  updateSpacer(e, t) {
    let i = ar(t.view, va(t.view.state.doc.lines));
    return i == e.number ? e : new lr(i);
  },
  domEventHandlers: n.facet(pi).domEventHandlers
}));
function og(n = {}) {
  return [
    pi.of(n),
    Cc(),
    rg
  ];
}
function va(n) {
  let e = 9;
  for (; e < n; )
    e = e * 10 + 9;
  return e;
}
const lg = 1024;
let ag = 0;
class Re {
  constructor(e, t) {
    this.from = e, this.to = t;
  }
}
class V {
  /**
  Create a new node prop type.
  */
  constructor(e = {}) {
    this.id = ag++, this.perNode = !!e.perNode, this.deserialize = e.deserialize || (() => {
      throw new Error("This node type doesn't define a deserialize function");
    });
  }
  /**
  This is meant to be used with
  [`NodeSet.extend`](#common.NodeSet.extend) or
  [`LRParser.configure`](#lr.ParserConfig.props) to compute
  prop values for each node type in the set. Takes a [match
  object](#common.NodeType^match) or function that returns undefined
  if the node type doesn't get this prop, and the prop's value if
  it does.
  */
  add(e) {
    if (this.perNode)
      throw new RangeError("Can't add per-node props to node types");
    return typeof e != "function" && (e = Ce.match(e)), (t) => {
      let i = e(t);
      return i === void 0 ? null : [this, i];
    };
  }
}
V.closedBy = new V({ deserialize: (n) => n.split(" ") });
V.openedBy = new V({ deserialize: (n) => n.split(" ") });
V.group = new V({ deserialize: (n) => n.split(" ") });
V.isolate = new V({ deserialize: (n) => {
  if (n && n != "rtl" && n != "ltr" && n != "auto")
    throw new RangeError("Invalid value for isolate: " + n);
  return n || "auto";
} });
V.contextHash = new V({ perNode: !0 });
V.lookAhead = new V({ perNode: !0 });
V.mounted = new V({ perNode: !0 });
class mn {
  constructor(e, t, i) {
    this.tree = e, this.overlay = t, this.parser = i;
  }
  /**
  @internal
  */
  static get(e) {
    return e && e.props && e.props[V.mounted.id];
  }
}
const hg = /* @__PURE__ */ Object.create(null);
class Ce {
  /**
  @internal
  */
  constructor(e, t, i, s = 0) {
    this.name = e, this.props = t, this.id = i, this.flags = s;
  }
  /**
  Define a node type.
  */
  static define(e) {
    let t = e.props && e.props.length ? /* @__PURE__ */ Object.create(null) : hg, i = (e.top ? 1 : 0) | (e.skipped ? 2 : 0) | (e.error ? 4 : 0) | (e.name == null ? 8 : 0), s = new Ce(e.name || "", t, e.id, i);
    if (e.props) {
      for (let r of e.props)
        if (Array.isArray(r) || (r = r(s)), r) {
          if (r[0].perNode)
            throw new RangeError("Can't store a per-node prop on a node type");
          t[r[0].id] = r[1];
        }
    }
    return s;
  }
  /**
  Retrieves a node prop for this type. Will return `undefined` if
  the prop isn't present on this node.
  */
  prop(e) {
    return this.props[e.id];
  }
  /**
  True when this is the top node of a grammar.
  */
  get isTop() {
    return (this.flags & 1) > 0;
  }
  /**
  True when this node is produced by a skip rule.
  */
  get isSkipped() {
    return (this.flags & 2) > 0;
  }
  /**
  Indicates whether this is an error node.
  */
  get isError() {
    return (this.flags & 4) > 0;
  }
  /**
  When true, this node type doesn't correspond to a user-declared
  named node, for example because it is used to cache repetition.
  */
  get isAnonymous() {
    return (this.flags & 8) > 0;
  }
  /**
  Returns true when this node's name or one of its
  [groups](#common.NodeProp^group) matches the given string.
  */
  is(e) {
    if (typeof e == "string") {
      if (this.name == e)
        return !0;
      let t = this.prop(V.group);
      return t ? t.indexOf(e) > -1 : !1;
    }
    return this.id == e;
  }
  /**
  Create a function from node types to arbitrary values by
  specifying an object whose property names are node or
  [group](#common.NodeProp^group) names. Often useful with
  [`NodeProp.add`](#common.NodeProp.add). You can put multiple
  names, separated by spaces, in a single property name to map
  multiple node names to a single value.
  */
  static match(e) {
    let t = /* @__PURE__ */ Object.create(null);
    for (let i in e)
      for (let s of i.split(" "))
        t[s] = e[i];
    return (i) => {
      for (let s = i.prop(V.group), r = -1; r < (s ? s.length : 0); r++) {
        let o = t[r < 0 ? i.name : s[r]];
        if (o)
          return o;
      }
    };
  }
}
Ce.none = new Ce(
  "",
  /* @__PURE__ */ Object.create(null),
  0,
  8
  /* NodeFlag.Anonymous */
);
class Ko {
  /**
  Create a set with the given types. The `id` property of each
  type should correspond to its position within the array.
  */
  constructor(e) {
    this.types = e;
    for (let t = 0; t < e.length; t++)
      if (e[t].id != t)
        throw new RangeError("Node type ids should correspond to array positions when creating a node set");
  }
  /**
  Create a copy of this set with some node properties added. The
  arguments to this method can be created with
  [`NodeProp.add`](#common.NodeProp.add).
  */
  extend(...e) {
    let t = [];
    for (let i of this.types) {
      let s = null;
      for (let r of e) {
        let o = r(i);
        o && (s || (s = Object.assign({}, i.props)), s[o[0].id] = o[1]);
      }
      t.push(s ? new Ce(i.name, s, i.id, i.flags) : i);
    }
    return new Ko(t);
  }
}
const zn = /* @__PURE__ */ new WeakMap(), xa = /* @__PURE__ */ new WeakMap();
var ie;
(function(n) {
  n[n.ExcludeBuffers = 1] = "ExcludeBuffers", n[n.IncludeAnonymous = 2] = "IncludeAnonymous", n[n.IgnoreMounts = 4] = "IgnoreMounts", n[n.IgnoreOverlays = 8] = "IgnoreOverlays";
})(ie || (ie = {}));
class Z {
  /**
  Construct a new tree. See also [`Tree.build`](#common.Tree^build).
  */
  constructor(e, t, i, s, r) {
    if (this.type = e, this.children = t, this.positions = i, this.length = s, this.props = null, r && r.length) {
      this.props = /* @__PURE__ */ Object.create(null);
      for (let [o, l] of r)
        this.props[typeof o == "number" ? o : o.id] = l;
    }
  }
  /**
  @internal
  */
  toString() {
    let e = mn.get(this);
    if (e && !e.overlay)
      return e.tree.toString();
    let t = "";
    for (let i of this.children) {
      let s = i.toString();
      s && (t && (t += ","), t += s);
    }
    return this.type.name ? (/\W/.test(this.type.name) && !this.type.isError ? JSON.stringify(this.type.name) : this.type.name) + (t.length ? "(" + t + ")" : "") : t;
  }
  /**
  Get a [tree cursor](#common.TreeCursor) positioned at the top of
  the tree. Mode can be used to [control](#common.IterMode) which
  nodes the cursor visits.
  */
  cursor(e = 0) {
    return new ks(this.topNode, e);
  }
  /**
  Get a [tree cursor](#common.TreeCursor) pointing into this tree
  at the given position and side (see
  [`moveTo`](#common.TreeCursor.moveTo).
  */
  cursorAt(e, t = 0, i = 0) {
    let s = zn.get(this) || this.topNode, r = new ks(s);
    return r.moveTo(e, t), zn.set(this, r._tree), r;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) object for the top of the
  tree.
  */
  get topNode() {
    return new we(this, 0, 0, null);
  }
  /**
  Get the [syntax node](#common.SyntaxNode) at the given position.
  If `side` is -1, this will move into nodes that end at the
  position. If 1, it'll move into nodes that start at the
  position. With 0, it'll only enter nodes that cover the position
  from both sides.
  
  Note that this will not enter
  [overlays](#common.MountedTree.overlay), and you often want
  [`resolveInner`](#common.Tree.resolveInner) instead.
  */
  resolve(e, t = 0) {
    let i = gn(zn.get(this) || this.topNode, e, t, !1);
    return zn.set(this, i), i;
  }
  /**
  Like [`resolve`](#common.Tree.resolve), but will enter
  [overlaid](#common.MountedTree.overlay) nodes, producing a syntax node
  pointing into the innermost overlaid tree at the given position
  (with parent links going through all parent structure, including
  the host trees).
  */
  resolveInner(e, t = 0) {
    let i = gn(xa.get(this) || this.topNode, e, t, !0);
    return xa.set(this, i), i;
  }
  /**
  In some situations, it can be useful to iterate through all
  nodes around a position, including those in overlays that don't
  directly cover the position. This method gives you an iterator
  that will produce all nodes, from small to big, around the given
  position.
  */
  resolveStack(e, t = 0) {
    return ug(this, e, t);
  }
  /**
  Iterate over the tree and its children, calling `enter` for any
  node that touches the `from`/`to` region (if given) before
  running over such a node's children, and `leave` (if given) when
  leaving the node. When `enter` returns `false`, that node will
  not have its children iterated over (or `leave` called).
  */
  iterate(e) {
    let { enter: t, leave: i, from: s = 0, to: r = this.length } = e, o = e.mode || 0, l = (o & ie.IncludeAnonymous) > 0;
    for (let a = this.cursor(o | ie.IncludeAnonymous); ; ) {
      let h = !1;
      if (a.from <= r && a.to >= s && (!l && a.type.isAnonymous || t(a) !== !1)) {
        if (a.firstChild())
          continue;
        h = !0;
      }
      for (; h && i && (l || !a.type.isAnonymous) && i(a), !a.nextSibling(); ) {
        if (!a.parent())
          return;
        h = !0;
      }
    }
  }
  /**
  Get the value of the given [node prop](#common.NodeProp) for this
  node. Works with both per-node and per-type props.
  */
  prop(e) {
    return e.perNode ? this.props ? this.props[e.id] : void 0 : this.type.prop(e);
  }
  /**
  Returns the node's [per-node props](#common.NodeProp.perNode) in a
  format that can be passed to the [`Tree`](#common.Tree)
  constructor.
  */
  get propValues() {
    let e = [];
    if (this.props)
      for (let t in this.props)
        e.push([+t, this.props[t]]);
    return e;
  }
  /**
  Balance the direct children of this tree, producing a copy of
  which may have children grouped into subtrees with type
  [`NodeType.none`](#common.NodeType^none).
  */
  balance(e = {}) {
    return this.children.length <= 8 ? this : Yo(Ce.none, this.children, this.positions, 0, this.children.length, 0, this.length, (t, i, s) => new Z(this.type, t, i, s, this.propValues), e.makeTree || ((t, i, s) => new Z(Ce.none, t, i, s)));
  }
  /**
  Build a tree from a postfix-ordered buffer of node information,
  or a cursor over such a buffer.
  */
  static build(e) {
    return dg(e);
  }
}
Z.empty = new Z(Ce.none, [], [], 0);
class Uo {
  constructor(e, t) {
    this.buffer = e, this.index = t;
  }
  get id() {
    return this.buffer[this.index - 4];
  }
  get start() {
    return this.buffer[this.index - 3];
  }
  get end() {
    return this.buffer[this.index - 2];
  }
  get size() {
    return this.buffer[this.index - 1];
  }
  get pos() {
    return this.index;
  }
  next() {
    this.index -= 4;
  }
  fork() {
    return new Uo(this.buffer, this.index);
  }
}
class Ft {
  /**
  Create a tree buffer.
  */
  constructor(e, t, i) {
    this.buffer = e, this.length = t, this.set = i;
  }
  /**
  @internal
  */
  get type() {
    return Ce.none;
  }
  /**
  @internal
  */
  toString() {
    let e = [];
    for (let t = 0; t < this.buffer.length; )
      e.push(this.childString(t)), t = this.buffer[t + 3];
    return e.join(",");
  }
  /**
  @internal
  */
  childString(e) {
    let t = this.buffer[e], i = this.buffer[e + 3], s = this.set.types[t], r = s.name;
    if (/\W/.test(r) && !s.isError && (r = JSON.stringify(r)), e += 4, i == e)
      return r;
    let o = [];
    for (; e < i; )
      o.push(this.childString(e)), e = this.buffer[e + 3];
    return r + "(" + o.join(",") + ")";
  }
  /**
  @internal
  */
  findChild(e, t, i, s, r) {
    let { buffer: o } = this, l = -1;
    for (let a = e; a != t && !(Mc(r, s, o[a + 1], o[a + 2]) && (l = a, i > 0)); a = o[a + 3])
      ;
    return l;
  }
  /**
  @internal
  */
  slice(e, t, i) {
    let s = this.buffer, r = new Uint16Array(t - e), o = 0;
    for (let l = e, a = 0; l < t; ) {
      r[a++] = s[l++], r[a++] = s[l++] - i;
      let h = r[a++] = s[l++] - i;
      r[a++] = s[l++] - e, o = Math.max(o, h);
    }
    return new Ft(r, o, this.set);
  }
}
function Mc(n, e, t, i) {
  switch (n) {
    case -2:
      return t < e;
    case -1:
      return i >= e && t < e;
    case 0:
      return t < e && i > e;
    case 1:
      return t <= e && i > e;
    case 2:
      return i > e;
    case 4:
      return !0;
  }
}
function gn(n, e, t, i) {
  for (var s; n.from == n.to || (t < 1 ? n.from >= e : n.from > e) || (t > -1 ? n.to <= e : n.to < e); ) {
    let o = !i && n instanceof we && n.index < 0 ? null : n.parent;
    if (!o)
      return n;
    n = o;
  }
  let r = i ? 0 : ie.IgnoreOverlays;
  if (i)
    for (let o = n, l = o.parent; l; o = l, l = o.parent)
      o instanceof we && o.index < 0 && ((s = l.enter(e, t, r)) === null || s === void 0 ? void 0 : s.from) != o.from && (n = l);
  for (; ; ) {
    let o = n.enter(e, t, r);
    if (!o)
      return n;
    n = o;
  }
}
class Tc {
  cursor(e = 0) {
    return new ks(this, e);
  }
  getChild(e, t = null, i = null) {
    let s = Sa(this, e, t, i);
    return s.length ? s[0] : null;
  }
  getChildren(e, t = null, i = null) {
    return Sa(this, e, t, i);
  }
  resolve(e, t = 0) {
    return gn(this, e, t, !1);
  }
  resolveInner(e, t = 0) {
    return gn(this, e, t, !0);
  }
  matchContext(e) {
    return yo(this, e);
  }
  enterUnfinishedNodesBefore(e) {
    let t = this.childBefore(e), i = this;
    for (; t; ) {
      let s = t.lastChild;
      if (!s || s.to != t.to)
        break;
      s.type.isError && s.from == s.to ? (i = t, t = s.prevSibling) : t = s;
    }
    return i;
  }
  get node() {
    return this;
  }
  get next() {
    return this.parent;
  }
}
class we extends Tc {
  constructor(e, t, i, s) {
    super(), this._tree = e, this.from = t, this.index = i, this._parent = s;
  }
  get type() {
    return this._tree.type;
  }
  get name() {
    return this._tree.type.name;
  }
  get to() {
    return this.from + this._tree.length;
  }
  nextChild(e, t, i, s, r = 0) {
    for (let o = this; ; ) {
      for (let { children: l, positions: a } = o._tree, h = t > 0 ? l.length : -1; e != h; e += t) {
        let f = l[e], c = a[e] + o.from;
        if (Mc(s, i, c, c + f.length)) {
          if (f instanceof Ft) {
            if (r & ie.ExcludeBuffers)
              continue;
            let u = f.findChild(0, f.buffer.length, t, i - c, s);
            if (u > -1)
              return new rt(new fg(o, f, e, c), null, u);
          } else if (r & ie.IncludeAnonymous || !f.type.isAnonymous || Go(f)) {
            let u;
            if (!(r & ie.IgnoreMounts) && (u = mn.get(f)) && !u.overlay)
              return new we(u.tree, c, e, o);
            let d = new we(f, c, e, o);
            return r & ie.IncludeAnonymous || !d.type.isAnonymous ? d : d.nextChild(t < 0 ? f.children.length - 1 : 0, t, i, s);
          }
        }
      }
      if (r & ie.IncludeAnonymous || !o.type.isAnonymous || (o.index >= 0 ? e = o.index + t : e = t < 0 ? -1 : o._parent._tree.children.length, o = o._parent, !o))
        return null;
    }
  }
  get firstChild() {
    return this.nextChild(
      0,
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.nextChild(
      0,
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.nextChild(
      this._tree.children.length - 1,
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    let s;
    if (!(i & ie.IgnoreOverlays) && (s = mn.get(this._tree)) && s.overlay) {
      let r = e - this.from;
      for (let { from: o, to: l } of s.overlay)
        if ((t > 0 ? o <= r : o < r) && (t < 0 ? l >= r : l > r))
          return new we(s.tree, s.overlay[0].from + this.from, -1, this);
    }
    return this.nextChild(0, 1, e, t, i);
  }
  nextSignificantParent() {
    let e = this;
    for (; e.type.isAnonymous && e._parent; )
      e = e._parent;
    return e;
  }
  get parent() {
    return this._parent ? this._parent.nextSignificantParent() : null;
  }
  get nextSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index + 1,
      1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get prevSibling() {
    return this._parent && this.index >= 0 ? this._parent.nextChild(
      this.index - 1,
      -1,
      0,
      4
      /* Side.DontCare */
    ) : null;
  }
  get tree() {
    return this._tree;
  }
  toTree() {
    return this._tree;
  }
  /**
  @internal
  */
  toString() {
    return this._tree.toString();
  }
}
function Sa(n, e, t, i) {
  let s = n.cursor(), r = [];
  if (!s.firstChild())
    return r;
  if (t != null) {
    for (let o = !1; !o; )
      if (o = s.type.is(t), !s.nextSibling())
        return r;
  }
  for (; ; ) {
    if (i != null && s.type.is(i))
      return r;
    if (s.type.is(e) && r.push(s.node), !s.nextSibling())
      return i == null ? r : [];
  }
}
function yo(n, e, t = e.length - 1) {
  for (let i = n.parent; t >= 0; i = i.parent) {
    if (!i)
      return !1;
    if (!i.type.isAnonymous) {
      if (e[t] && e[t] != i.name)
        return !1;
      t--;
    }
  }
  return !0;
}
class fg {
  constructor(e, t, i, s) {
    this.parent = e, this.buffer = t, this.index = i, this.start = s;
  }
}
class rt extends Tc {
  get name() {
    return this.type.name;
  }
  get from() {
    return this.context.start + this.context.buffer.buffer[this.index + 1];
  }
  get to() {
    return this.context.start + this.context.buffer.buffer[this.index + 2];
  }
  constructor(e, t, i) {
    super(), this.context = e, this._parent = t, this.index = i, this.type = e.buffer.set.types[e.buffer.buffer[i]];
  }
  child(e, t, i) {
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.context.start, i);
    return r < 0 ? null : new rt(this.context, this, r);
  }
  get firstChild() {
    return this.child(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  get lastChild() {
    return this.child(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  childAfter(e) {
    return this.child(
      1,
      e,
      2
      /* Side.After */
    );
  }
  childBefore(e) {
    return this.child(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  enter(e, t, i = 0) {
    if (i & ie.ExcludeBuffers)
      return null;
    let { buffer: s } = this.context, r = s.findChild(this.index + 4, s.buffer[this.index + 3], t > 0 ? 1 : -1, e - this.context.start, t);
    return r < 0 ? null : new rt(this.context, this, r);
  }
  get parent() {
    return this._parent || this.context.parent.nextSignificantParent();
  }
  externalSibling(e) {
    return this._parent ? null : this.context.parent.nextChild(
      this.context.index + e,
      e,
      0,
      4
      /* Side.DontCare */
    );
  }
  get nextSibling() {
    let { buffer: e } = this.context, t = e.buffer[this.index + 3];
    return t < (this._parent ? e.buffer[this._parent.index + 3] : e.buffer.length) ? new rt(this.context, this._parent, t) : this.externalSibling(1);
  }
  get prevSibling() {
    let { buffer: e } = this.context, t = this._parent ? this._parent.index + 4 : 0;
    return this.index == t ? this.externalSibling(-1) : new rt(this.context, this._parent, e.findChild(
      t,
      this.index,
      -1,
      0,
      4
      /* Side.DontCare */
    ));
  }
  get tree() {
    return null;
  }
  toTree() {
    let e = [], t = [], { buffer: i } = this.context, s = this.index + 4, r = i.buffer[this.index + 3];
    if (r > s) {
      let o = i.buffer[this.index + 1];
      e.push(i.slice(s, r, o)), t.push(0);
    }
    return new Z(this.type, e, t, this.to - this.from);
  }
  /**
  @internal
  */
  toString() {
    return this.context.buffer.childString(this.index);
  }
}
function Dc(n) {
  if (!n.length)
    return null;
  let e = 0, t = n[0];
  for (let r = 1; r < n.length; r++) {
    let o = n[r];
    (o.from > t.from || o.to < t.to) && (t = o, e = r);
  }
  let i = t instanceof we && t.index < 0 ? null : t.parent, s = n.slice();
  return i ? s[e] = i : s.splice(e, 1), new cg(s, t);
}
class cg {
  constructor(e, t) {
    this.heads = e, this.node = t;
  }
  get next() {
    return Dc(this.heads);
  }
}
function ug(n, e, t) {
  let i = n.resolveInner(e, t), s = null;
  for (let r = i instanceof we ? i : i.context.parent; r; r = r.parent)
    if (r.index < 0) {
      let o = r.parent;
      (s || (s = [i])).push(o.resolve(e, t)), r = o;
    } else {
      let o = mn.get(r.tree);
      if (o && o.overlay && o.overlay[0].from <= e && o.overlay[o.overlay.length - 1].to >= e) {
        let l = new we(o.tree, o.overlay[0].from + r.from, -1, r);
        (s || (s = [i])).push(gn(l, e, t, !1));
      }
    }
  return s ? Dc(s) : i;
}
class ks {
  /**
  Shorthand for `.type.name`.
  */
  get name() {
    return this.type.name;
  }
  /**
  @internal
  */
  constructor(e, t = 0) {
    if (this.mode = t, this.buffer = null, this.stack = [], this.index = 0, this.bufferNode = null, e instanceof we)
      this.yieldNode(e);
    else {
      this._tree = e.context.parent, this.buffer = e.context;
      for (let i = e._parent; i; i = i._parent)
        this.stack.unshift(i.index);
      this.bufferNode = e, this.yieldBuf(e.index);
    }
  }
  yieldNode(e) {
    return e ? (this._tree = e, this.type = e.type, this.from = e.from, this.to = e.to, !0) : !1;
  }
  yieldBuf(e, t) {
    this.index = e;
    let { start: i, buffer: s } = this.buffer;
    return this.type = t || s.set.types[s.buffer[e]], this.from = i + s.buffer[e + 1], this.to = i + s.buffer[e + 2], !0;
  }
  /**
  @internal
  */
  yield(e) {
    return e ? e instanceof we ? (this.buffer = null, this.yieldNode(e)) : (this.buffer = e.context, this.yieldBuf(e.index, e.type)) : !1;
  }
  /**
  @internal
  */
  toString() {
    return this.buffer ? this.buffer.buffer.childString(this.index) : this._tree.toString();
  }
  /**
  @internal
  */
  enterChild(e, t, i) {
    if (!this.buffer)
      return this.yield(this._tree.nextChild(e < 0 ? this._tree._tree.children.length - 1 : 0, e, t, i, this.mode));
    let { buffer: s } = this.buffer, r = s.findChild(this.index + 4, s.buffer[this.index + 3], e, t - this.buffer.start, i);
    return r < 0 ? !1 : (this.stack.push(this.index), this.yieldBuf(r));
  }
  /**
  Move the cursor to this node's first child. When this returns
  false, the node has no child, and the cursor has not been moved.
  */
  firstChild() {
    return this.enterChild(
      1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to this node's last child.
  */
  lastChild() {
    return this.enterChild(
      -1,
      0,
      4
      /* Side.DontCare */
    );
  }
  /**
  Move the cursor to the first child that ends after `pos`.
  */
  childAfter(e) {
    return this.enterChild(
      1,
      e,
      2
      /* Side.After */
    );
  }
  /**
  Move to the last child that starts before `pos`.
  */
  childBefore(e) {
    return this.enterChild(
      -1,
      e,
      -2
      /* Side.Before */
    );
  }
  /**
  Move the cursor to the child around `pos`. If side is -1 the
  child may end at that position, when 1 it may start there. This
  will also enter [overlaid](#common.MountedTree.overlay)
  [mounted](#common.NodeProp^mounted) trees unless `overlays` is
  set to false.
  */
  enter(e, t, i = this.mode) {
    return this.buffer ? i & ie.ExcludeBuffers ? !1 : this.enterChild(1, e, t) : this.yield(this._tree.enter(e, t, i));
  }
  /**
  Move to the node's parent node, if this isn't the top node.
  */
  parent() {
    if (!this.buffer)
      return this.yieldNode(this.mode & ie.IncludeAnonymous ? this._tree._parent : this._tree.parent);
    if (this.stack.length)
      return this.yieldBuf(this.stack.pop());
    let e = this.mode & ie.IncludeAnonymous ? this.buffer.parent : this.buffer.parent.nextSignificantParent();
    return this.buffer = null, this.yieldNode(e);
  }
  /**
  @internal
  */
  sibling(e) {
    if (!this.buffer)
      return this._tree._parent ? this.yield(this._tree.index < 0 ? null : this._tree._parent.nextChild(this._tree.index + e, e, 0, 4, this.mode)) : !1;
    let { buffer: t } = this.buffer, i = this.stack.length - 1;
    if (e < 0) {
      let s = i < 0 ? 0 : this.stack[i] + 4;
      if (this.index != s)
        return this.yieldBuf(t.findChild(
          s,
          this.index,
          -1,
          0,
          4
          /* Side.DontCare */
        ));
    } else {
      let s = t.buffer[this.index + 3];
      if (s < (i < 0 ? t.buffer.length : t.buffer[this.stack[i] + 3]))
        return this.yieldBuf(s);
    }
    return i < 0 ? this.yield(this.buffer.parent.nextChild(this.buffer.index + e, e, 0, 4, this.mode)) : !1;
  }
  /**
  Move to this node's next sibling, if any.
  */
  nextSibling() {
    return this.sibling(1);
  }
  /**
  Move to this node's previous sibling, if any.
  */
  prevSibling() {
    return this.sibling(-1);
  }
  atLastNode(e) {
    let t, i, { buffer: s } = this;
    if (s) {
      if (e > 0) {
        if (this.index < s.buffer.buffer.length)
          return !1;
      } else
        for (let r = 0; r < this.index; r++)
          if (s.buffer.buffer[r + 3] < this.index)
            return !1;
      ({ index: t, parent: i } = s);
    } else
      ({ index: t, _parent: i } = this._tree);
    for (; i; { index: t, _parent: i } = i)
      if (t > -1)
        for (let r = t + e, o = e < 0 ? -1 : i._tree.children.length; r != o; r += e) {
          let l = i._tree.children[r];
          if (this.mode & ie.IncludeAnonymous || l instanceof Ft || !l.type.isAnonymous || Go(l))
            return !1;
        }
    return !0;
  }
  move(e, t) {
    if (t && this.enterChild(
      e,
      0,
      4
      /* Side.DontCare */
    ))
      return !0;
    for (; ; ) {
      if (this.sibling(e))
        return !0;
      if (this.atLastNode(e) || !this.parent())
        return !1;
    }
  }
  /**
  Move to the next node in a
  [pre-order](https://en.wikipedia.org/wiki/Tree_traversal#Pre-order,_NLR)
  traversal, going from a node to its first child or, if the
  current node is empty or `enter` is false, its next sibling or
  the next sibling of the first parent node that has one.
  */
  next(e = !0) {
    return this.move(1, e);
  }
  /**
  Move to the next node in a last-to-first pre-order traveral. A
  node is followed by its last child or, if it has none, its
  previous sibling or the previous sibling of the first parent
  node that has one.
  */
  prev(e = !0) {
    return this.move(-1, e);
  }
  /**
  Move the cursor to the innermost node that covers `pos`. If
  `side` is -1, it will enter nodes that end at `pos`. If it is 1,
  it will enter nodes that start at `pos`.
  */
  moveTo(e, t = 0) {
    for (; (this.from == this.to || (t < 1 ? this.from >= e : this.from > e) || (t > -1 ? this.to <= e : this.to < e)) && this.parent(); )
      ;
    for (; this.enterChild(1, e, t); )
      ;
    return this;
  }
  /**
  Get a [syntax node](#common.SyntaxNode) at the cursor's current
  position.
  */
  get node() {
    if (!this.buffer)
      return this._tree;
    let e = this.bufferNode, t = null, i = 0;
    if (e && e.context == this.buffer)
      e:
        for (let s = this.index, r = this.stack.length; r >= 0; ) {
          for (let o = e; o; o = o._parent)
            if (o.index == s) {
              if (s == this.index)
                return o;
              t = o, i = r + 1;
              break e;
            }
          s = this.stack[--r];
        }
    for (let s = i; s < this.stack.length; s++)
      t = new rt(this.buffer, t, this.stack[s]);
    return this.bufferNode = new rt(this.buffer, t, this.index);
  }
  /**
  Get the [tree](#common.Tree) that represents the current node, if
  any. Will return null when the node is in a [tree
  buffer](#common.TreeBuffer).
  */
  get tree() {
    return this.buffer ? null : this._tree._tree;
  }
  /**
  Iterate over the current node and all its descendants, calling
  `enter` when entering a node and `leave`, if given, when leaving
  one. When `enter` returns `false`, any children of that node are
  skipped, and `leave` isn't called for it.
  */
  iterate(e, t) {
    for (let i = 0; ; ) {
      let s = !1;
      if (this.type.isAnonymous || e(this) !== !1) {
        if (this.firstChild()) {
          i++;
          continue;
        }
        this.type.isAnonymous || (s = !0);
      }
      for (; s && t && t(this), s = this.type.isAnonymous, !this.nextSibling(); ) {
        if (!i)
          return;
        this.parent(), i--, s = !0;
      }
    }
  }
  /**
  Test whether the current node matches a given context—a sequence
  of direct parent node names. Empty strings in the context array
  are treated as wildcards.
  */
  matchContext(e) {
    if (!this.buffer)
      return yo(this.node, e);
    let { buffer: t } = this.buffer, { types: i } = t.set;
    for (let s = e.length - 1, r = this.stack.length - 1; s >= 0; r--) {
      if (r < 0)
        return yo(this.node, e, s);
      let o = i[t.buffer[this.stack[r]]];
      if (!o.isAnonymous) {
        if (e[s] && e[s] != o.name)
          return !1;
        s--;
      }
    }
    return !0;
  }
}
function Go(n) {
  return n.children.some((e) => e instanceof Ft || !e.type.isAnonymous || Go(e));
}
function dg(n) {
  var e;
  let { buffer: t, nodeSet: i, maxBufferLength: s = lg, reused: r = [], minRepeatType: o = i.types.length } = n, l = Array.isArray(t) ? new Uo(t, t.length) : t, a = i.types, h = 0, f = 0;
  function c(_, v, x, P, E, I) {
    let { id: L, start: R, end: W, size: H } = l, K = f;
    for (; H < 0; )
      if (l.next(), H == -1) {
        let j = r[L];
        x.push(j), P.push(R - _);
        return;
      } else if (H == -3) {
        h = L;
        return;
      } else if (H == -4) {
        f = L;
        return;
      } else
        throw new RangeError(`Unrecognized record size: ${H}`);
    let ae = a[L], ce, M, Q = R - _;
    if (W - R <= s && (M = g(l.pos - v, E))) {
      let j = new Uint16Array(M.size - M.skip), se = l.pos - M.size, re = j.length;
      for (; l.pos > se; )
        re = y(M.start, j, re);
      ce = new Ft(j, W - M.start, i), Q = M.start - _;
    } else {
      let j = l.pos - H;
      l.next();
      let se = [], re = [], T = L >= o ? L : -1, dt = 0, Ye = W;
      for (; l.pos > j; )
        T >= 0 && l.id == T && l.size >= 0 ? (l.end <= Ye - s && (p(se, re, R, dt, l.end, Ye, T, K), dt = se.length, Ye = l.end), l.next()) : I > 2500 ? u(R, j, se, re) : c(R, j, se, re, T, I + 1);
      if (T >= 0 && dt > 0 && dt < se.length && p(se, re, R, dt, R, Ye, T, K), se.reverse(), re.reverse(), T > -1 && dt > 0) {
        let Tn = d(ae);
        ce = Yo(ae, se, re, 0, se.length, 0, W - R, Tn, Tn);
      } else
        ce = m(ae, se, re, W - R, K - W);
    }
    x.push(ce), P.push(Q);
  }
  function u(_, v, x, P) {
    let E = [], I = 0, L = -1;
    for (; l.pos > v; ) {
      let { id: R, start: W, end: H, size: K } = l;
      if (K > 4)
        l.next();
      else {
        if (L > -1 && W < L)
          break;
        L < 0 && (L = H - s), E.push(R, W, H), I++, l.next();
      }
    }
    if (I) {
      let R = new Uint16Array(I * 4), W = E[E.length - 2];
      for (let H = E.length - 3, K = 0; H >= 0; H -= 3)
        R[K++] = E[H], R[K++] = E[H + 1] - W, R[K++] = E[H + 2] - W, R[K++] = K;
      x.push(new Ft(R, E[2] - W, i)), P.push(W - _);
    }
  }
  function d(_) {
    return (v, x, P) => {
      let E = 0, I = v.length - 1, L, R;
      if (I >= 0 && (L = v[I]) instanceof Z) {
        if (!I && L.type == _ && L.length == P)
          return L;
        (R = L.prop(V.lookAhead)) && (E = x[I] + L.length + R);
      }
      return m(_, v, x, P, E);
    };
  }
  function p(_, v, x, P, E, I, L, R) {
    let W = [], H = [];
    for (; _.length > P; )
      W.push(_.pop()), H.push(v.pop() + x - E);
    _.push(m(i.types[L], W, H, I - E, R - I)), v.push(E - x);
  }
  function m(_, v, x, P, E = 0, I) {
    if (h) {
      let L = [V.contextHash, h];
      I = I ? [L].concat(I) : [L];
    }
    if (E > 25) {
      let L = [V.lookAhead, E];
      I = I ? [L].concat(I) : [L];
    }
    return new Z(_, v, x, P, I);
  }
  function g(_, v) {
    let x = l.fork(), P = 0, E = 0, I = 0, L = x.end - s, R = { size: 0, start: 0, skip: 0 };
    e:
      for (let W = x.pos - _; x.pos > W; ) {
        let H = x.size;
        if (x.id == v && H >= 0) {
          R.size = P, R.start = E, R.skip = I, I += 4, P += 4, x.next();
          continue;
        }
        let K = x.pos - H;
        if (H < 0 || K < W || x.start < L)
          break;
        let ae = x.id >= o ? 4 : 0, ce = x.start;
        for (x.next(); x.pos > K; ) {
          if (x.size < 0)
            if (x.size == -3)
              ae += 4;
            else
              break e;
          else
            x.id >= o && (ae += 4);
          x.next();
        }
        E = ce, P += H, I += ae;
      }
    return (v < 0 || P == _) && (R.size = P, R.start = E, R.skip = I), R.size > 4 ? R : void 0;
  }
  function y(_, v, x) {
    let { id: P, start: E, end: I, size: L } = l;
    if (l.next(), L >= 0 && P < o) {
      let R = x;
      if (L > 4) {
        let W = l.pos - (L - 4);
        for (; l.pos > W; )
          x = y(_, v, x);
      }
      v[--x] = R, v[--x] = I - _, v[--x] = E - _, v[--x] = P;
    } else
      L == -3 ? h = P : L == -4 && (f = P);
    return x;
  }
  let k = [], w = [];
  for (; l.pos > 0; )
    c(n.start || 0, n.bufferStart || 0, k, w, -1, 0);
  let S = (e = n.length) !== null && e !== void 0 ? e : k.length ? w[0] + k[0].length : 0;
  return new Z(a[n.topID], k.reverse(), w.reverse(), S);
}
const _a = /* @__PURE__ */ new WeakMap();
function as(n, e) {
  if (!n.isAnonymous || e instanceof Ft || e.type != n)
    return 1;
  let t = _a.get(e);
  if (t == null) {
    t = 1;
    for (let i of e.children) {
      if (i.type != n || !(i instanceof Z)) {
        t = 1;
        break;
      }
      t += as(n, i);
    }
    _a.set(e, t);
  }
  return t;
}
function Yo(n, e, t, i, s, r, o, l, a) {
  let h = 0;
  for (let p = i; p < s; p++)
    h += as(n, e[p]);
  let f = Math.ceil(
    h * 1.5 / 8
    /* Balance.BranchFactor */
  ), c = [], u = [];
  function d(p, m, g, y, k) {
    for (let w = g; w < y; ) {
      let S = w, _ = m[w], v = as(n, p[w]);
      for (w++; w < y; w++) {
        let x = as(n, p[w]);
        if (v + x >= f)
          break;
        v += x;
      }
      if (w == S + 1) {
        if (v > f) {
          let x = p[S];
          d(x.children, x.positions, 0, x.children.length, m[S] + k);
          continue;
        }
        c.push(p[S]);
      } else {
        let x = m[w - 1] + p[w - 1].length - _;
        c.push(Yo(n, p, m, S, w, _, x, null, a));
      }
      u.push(_ + k - r);
    }
  }
  return d(e, t, i, s, 0), (l || a)(c, u, o);
}
class ax {
  constructor() {
    this.map = /* @__PURE__ */ new WeakMap();
  }
  setBuffer(e, t, i) {
    let s = this.map.get(e);
    s || this.map.set(e, s = /* @__PURE__ */ new Map()), s.set(t, i);
  }
  getBuffer(e, t) {
    let i = this.map.get(e);
    return i && i.get(t);
  }
  /**
  Set the value for this syntax node.
  */
  set(e, t) {
    e instanceof rt ? this.setBuffer(e.context.buffer, e.index, t) : e instanceof we && this.map.set(e.tree, t);
  }
  /**
  Retrieve value for this syntax node, if it exists in the map.
  */
  get(e) {
    return e instanceof rt ? this.getBuffer(e.context.buffer, e.index) : e instanceof we ? this.map.get(e.tree) : void 0;
  }
  /**
  Set the value for the node that a cursor currently points to.
  */
  cursorSet(e, t) {
    e.buffer ? this.setBuffer(e.buffer.buffer, e.index, t) : this.map.set(e.tree, t);
  }
  /**
  Retrieve the value for the node that a cursor currently points
  to.
  */
  cursorGet(e) {
    return e.buffer ? this.getBuffer(e.buffer.buffer, e.index) : this.map.get(e.tree);
  }
}
class bt {
  /**
  Construct a tree fragment. You'll usually want to use
  [`addTree`](#common.TreeFragment^addTree) and
  [`applyChanges`](#common.TreeFragment^applyChanges) instead of
  calling this directly.
  */
  constructor(e, t, i, s, r = !1, o = !1) {
    this.from = e, this.to = t, this.tree = i, this.offset = s, this.open = (r ? 1 : 0) | (o ? 2 : 0);
  }
  /**
  Whether the start of the fragment represents the start of a
  parse, or the end of a change. (In the second case, it may not
  be safe to reuse some nodes at the start, depending on the
  parsing algorithm.)
  */
  get openStart() {
    return (this.open & 1) > 0;
  }
  /**
  Whether the end of the fragment represents the end of a
  full-document parse, or the start of a change.
  */
  get openEnd() {
    return (this.open & 2) > 0;
  }
  /**
  Create a set of fragments from a freshly parsed tree, or update
  an existing set of fragments by replacing the ones that overlap
  with a tree with content from the new tree. When `partial` is
  true, the parse is treated as incomplete, and the resulting
  fragment has [`openEnd`](#common.TreeFragment.openEnd) set to
  true.
  */
  static addTree(e, t = [], i = !1) {
    let s = [new bt(0, e.length, e, 0, !1, i)];
    for (let r of t)
      r.to > e.length && s.push(r);
    return s;
  }
  /**
  Apply a set of edits to an array of fragments, removing or
  splitting fragments as necessary to remove edited ranges, and
  adjusting offsets for fragments that moved.
  */
  static applyChanges(e, t, i = 128) {
    if (!t.length)
      return e;
    let s = [], r = 1, o = e.length ? e[0] : null;
    for (let l = 0, a = 0, h = 0; ; l++) {
      let f = l < t.length ? t[l] : null, c = f ? f.fromA : 1e9;
      if (c - a >= i)
        for (; o && o.from < c; ) {
          let u = o;
          if (a >= u.from || c <= u.to || h) {
            let d = Math.max(u.from, a) - h, p = Math.min(u.to, c) - h;
            u = d >= p ? null : new bt(d, p, u.tree, u.offset + h, l > 0, !!f);
          }
          if (u && s.push(u), o.to > c)
            break;
          o = r < e.length ? e[r++] : null;
        }
      if (!f)
        break;
      a = f.toA, h = f.toA - f.toB;
    }
    return s;
  }
}
class Oc {
  /**
  Start a parse, returning a [partial parse](#common.PartialParse)
  object. [`fragments`](#common.TreeFragment) can be passed in to
  make the parse incremental.
  
  By default, the entire input is parsed. You can pass `ranges`,
  which should be a sorted array of non-empty, non-overlapping
  ranges, to parse only those ranges. The tree returned in that
  case will start at `ranges[0].from`.
  */
  startParse(e, t, i) {
    return typeof e == "string" && (e = new pg(e)), i = i ? i.length ? i.map((s) => new Re(s.from, s.to)) : [new Re(0, 0)] : [new Re(0, e.length)], this.createParse(e, t || [], i);
  }
  /**
  Run a full parse, returning the resulting tree.
  */
  parse(e, t, i) {
    let s = this.startParse(e, t, i);
    for (; ; ) {
      let r = s.advance();
      if (r)
        return r;
    }
  }
}
class pg {
  constructor(e) {
    this.string = e;
  }
  get length() {
    return this.string.length;
  }
  chunk(e) {
    return this.string.slice(e);
  }
  get lineChunks() {
    return !1;
  }
  read(e, t) {
    return this.string.slice(e, t);
  }
}
function hx(n) {
  return (e, t, i, s) => new gg(e, n, t, i, s);
}
class Ca {
  constructor(e, t, i, s, r) {
    this.parser = e, this.parse = t, this.overlay = i, this.target = s, this.from = r;
  }
}
function Aa(n) {
  if (!n.length || n.some((e) => e.from >= e.to))
    throw new RangeError("Invalid inner parse ranges given: " + JSON.stringify(n));
}
class mg {
  constructor(e, t, i, s, r, o, l) {
    this.parser = e, this.predicate = t, this.mounts = i, this.index = s, this.start = r, this.target = o, this.prev = l, this.depth = 0, this.ranges = [];
  }
}
const wo = new V({ perNode: !0 });
class gg {
  constructor(e, t, i, s, r) {
    this.nest = t, this.input = i, this.fragments = s, this.ranges = r, this.inner = [], this.innerDone = 0, this.baseTree = null, this.stoppedAt = null, this.baseParse = e;
  }
  advance() {
    if (this.baseParse) {
      let i = this.baseParse.advance();
      if (!i)
        return null;
      if (this.baseParse = null, this.baseTree = i, this.startInner(), this.stoppedAt != null)
        for (let s of this.inner)
          s.parse.stopAt(this.stoppedAt);
    }
    if (this.innerDone == this.inner.length) {
      let i = this.baseTree;
      return this.stoppedAt != null && (i = new Z(i.type, i.children, i.positions, i.length, i.propValues.concat([[wo, this.stoppedAt]]))), i;
    }
    let e = this.inner[this.innerDone], t = e.parse.advance();
    if (t) {
      this.innerDone++;
      let i = Object.assign(/* @__PURE__ */ Object.create(null), e.target.props);
      i[V.mounted.id] = new mn(t, e.overlay, e.parser), e.target.props = i;
    }
    return null;
  }
  get parsedPos() {
    if (this.baseParse)
      return 0;
    let e = this.input.length;
    for (let t = this.innerDone; t < this.inner.length; t++)
      this.inner[t].from < e && (e = Math.min(e, this.inner[t].parse.parsedPos));
    return e;
  }
  stopAt(e) {
    if (this.stoppedAt = e, this.baseParse)
      this.baseParse.stopAt(e);
    else
      for (let t = this.innerDone; t < this.inner.length; t++)
        this.inner[t].parse.stopAt(e);
  }
  startInner() {
    let e = new wg(this.fragments), t = null, i = null, s = new ks(new we(this.baseTree, this.ranges[0].from, 0, null), ie.IncludeAnonymous | ie.IgnoreMounts);
    e:
      for (let r, o; ; ) {
        let l = !0, a;
        if (this.stoppedAt != null && s.from >= this.stoppedAt)
          l = !1;
        else if (e.hasNode(s)) {
          if (t) {
            let h = t.mounts.find((f) => f.frag.from <= s.from && f.frag.to >= s.to && f.mount.overlay);
            if (h)
              for (let f of h.mount.overlay) {
                let c = f.from + h.pos, u = f.to + h.pos;
                c >= s.from && u <= s.to && !t.ranges.some((d) => d.from < u && d.to > c) && t.ranges.push({ from: c, to: u });
              }
          }
          l = !1;
        } else if (i && (o = bg(i.ranges, s.from, s.to)))
          l = o != 2;
        else if (!s.type.isAnonymous && (r = this.nest(s, this.input)) && (s.from < s.to || !r.overlay)) {
          s.tree || yg(s);
          let h = e.findMounts(s.from, r.parser);
          if (typeof r.overlay == "function")
            t = new mg(r.parser, r.overlay, h, this.inner.length, s.from, s.tree, t);
          else {
            let f = Da(this.ranges, r.overlay || (s.from < s.to ? [new Re(s.from, s.to)] : []));
            f.length && Aa(f), (f.length || !r.overlay) && this.inner.push(new Ca(r.parser, f.length ? r.parser.startParse(this.input, Oa(h, f), f) : r.parser.startParse(""), r.overlay ? r.overlay.map((c) => new Re(c.from - s.from, c.to - s.from)) : null, s.tree, f.length ? f[0].from : s.from)), r.overlay ? f.length && (i = { ranges: f, depth: 0, prev: i }) : l = !1;
          }
        } else
          t && (a = t.predicate(s)) && (a === !0 && (a = new Re(s.from, s.to)), a.from < a.to && t.ranges.push(a));
        if (l && s.firstChild())
          t && t.depth++, i && i.depth++;
        else
          for (; !s.nextSibling(); ) {
            if (!s.parent())
              break e;
            if (t && !--t.depth) {
              let h = Da(this.ranges, t.ranges);
              h.length && (Aa(h), this.inner.splice(t.index, 0, new Ca(t.parser, t.parser.startParse(this.input, Oa(t.mounts, h), h), t.ranges.map((f) => new Re(f.from - t.start, f.to - t.start)), t.target, h[0].from))), t = t.prev;
            }
            i && !--i.depth && (i = i.prev);
          }
      }
  }
}
function bg(n, e, t) {
  for (let i of n) {
    if (i.from >= t)
      break;
    if (i.to > e)
      return i.from <= e && i.to >= t ? 2 : 1;
  }
  return 0;
}
function Ma(n, e, t, i, s, r) {
  if (e < t) {
    let o = n.buffer[e + 1];
    i.push(n.slice(e, t, o)), s.push(o - r);
  }
}
function yg(n) {
  let { node: e } = n, t = [], i = e.context.buffer;
  do
    t.push(n.index), n.parent();
  while (!n.tree);
  let s = n.tree, r = s.children.indexOf(i), o = s.children[r], l = o.buffer, a = [r];
  function h(f, c, u, d, p, m) {
    let g = t[m], y = [], k = [];
    Ma(o, f, g, y, k, d);
    let w = l[g + 1], S = l[g + 2];
    a.push(y.length);
    let _ = m ? h(g + 4, l[g + 3], o.set.types[l[g]], w, S - w, m - 1) : e.toTree();
    return y.push(_), k.push(w - d), Ma(o, l[g + 3], c, y, k, d), new Z(u, y, k, p);
  }
  s.children[r] = h(0, l.length, Ce.none, 0, o.length, t.length - 1);
  for (let f of a) {
    let c = n.tree.children[f], u = n.tree.positions[f];
    n.yield(new we(c, u + n.from, f, n._tree));
  }
}
class Ta {
  constructor(e, t) {
    this.offset = t, this.done = !1, this.cursor = e.cursor(ie.IncludeAnonymous | ie.IgnoreMounts);
  }
  // Move to the first node (in pre-order) that starts at or after `pos`.
  moveTo(e) {
    let { cursor: t } = this, i = e - this.offset;
    for (; !this.done && t.from < i; )
      t.to >= e && t.enter(i, 1, ie.IgnoreOverlays | ie.ExcludeBuffers) || t.next(!1) || (this.done = !0);
  }
  hasNode(e) {
    if (this.moveTo(e.from), !this.done && this.cursor.from + this.offset == e.from && this.cursor.tree)
      for (let t = this.cursor.tree; ; ) {
        if (t == e.tree)
          return !0;
        if (t.children.length && t.positions[0] == 0 && t.children[0] instanceof Z)
          t = t.children[0];
        else
          break;
      }
    return !1;
  }
}
class wg {
  constructor(e) {
    var t;
    if (this.fragments = e, this.curTo = 0, this.fragI = 0, e.length) {
      let i = this.curFrag = e[0];
      this.curTo = (t = i.tree.prop(wo)) !== null && t !== void 0 ? t : i.to, this.inner = new Ta(i.tree, -i.offset);
    } else
      this.curFrag = this.inner = null;
  }
  hasNode(e) {
    for (; this.curFrag && e.from >= this.curTo; )
      this.nextFrag();
    return this.curFrag && this.curFrag.from <= e.from && this.curTo >= e.to && this.inner.hasNode(e);
  }
  nextFrag() {
    var e;
    if (this.fragI++, this.fragI == this.fragments.length)
      this.curFrag = this.inner = null;
    else {
      let t = this.curFrag = this.fragments[this.fragI];
      this.curTo = (e = t.tree.prop(wo)) !== null && e !== void 0 ? e : t.to, this.inner = new Ta(t.tree, -t.offset);
    }
  }
  findMounts(e, t) {
    var i;
    let s = [];
    if (this.inner) {
      this.inner.cursor.moveTo(e, 1);
      for (let r = this.inner.cursor.node; r; r = r.parent) {
        let o = (i = r.tree) === null || i === void 0 ? void 0 : i.prop(V.mounted);
        if (o && o.parser == t)
          for (let l = this.fragI; l < this.fragments.length; l++) {
            let a = this.fragments[l];
            if (a.from >= r.to)
              break;
            a.tree == this.curFrag.tree && s.push({
              frag: a,
              pos: r.from - a.offset,
              mount: o
            });
          }
      }
    }
    return s;
  }
}
function Da(n, e) {
  let t = null, i = e;
  for (let s = 1, r = 0; s < n.length; s++) {
    let o = n[s - 1].to, l = n[s].from;
    for (; r < i.length; r++) {
      let a = i[r];
      if (a.from >= l)
        break;
      a.to <= o || (t || (i = t = e.slice()), a.from < o ? (t[r] = new Re(a.from, o), a.to > l && t.splice(r + 1, 0, new Re(l, a.to))) : a.to > l ? t[r--] = new Re(l, a.to) : t.splice(r--, 1));
    }
  }
  return i;
}
function kg(n, e, t, i) {
  let s = 0, r = 0, o = !1, l = !1, a = -1e9, h = [];
  for (; ; ) {
    let f = s == n.length ? 1e9 : o ? n[s].to : n[s].from, c = r == e.length ? 1e9 : l ? e[r].to : e[r].from;
    if (o != l) {
      let u = Math.max(a, t), d = Math.min(f, c, i);
      u < d && h.push(new Re(u, d));
    }
    if (a = Math.min(f, c), a == 1e9)
      break;
    f == a && (o ? (o = !1, s++) : o = !0), c == a && (l ? (l = !1, r++) : l = !0);
  }
  return h;
}
function Oa(n, e) {
  let t = [];
  for (let { pos: i, mount: s, frag: r } of n) {
    let o = i + (s.overlay ? s.overlay[0].from : 0), l = o + s.tree.length, a = Math.max(r.from, o), h = Math.min(r.to, l);
    if (s.overlay) {
      let f = s.overlay.map((u) => new Re(u.from + i, u.to + i)), c = kg(e, f, a, h);
      for (let u = 0, d = a; ; u++) {
        let p = u == c.length, m = p ? h : c[u].from;
        if (m > d && t.push(new bt(d, m, s.tree, -o, r.from >= d || r.openStart, r.to <= m || r.openEnd)), p)
          break;
        d = c[u].to;
      }
    } else
      t.push(new bt(a, h, s.tree, -o, r.from >= o || r.openStart, r.to <= l || r.openEnd));
  }
  return t;
}
let vg = 0;
class et {
  /**
  @internal
  */
  constructor(e, t, i) {
    this.set = e, this.base = t, this.modified = i, this.id = vg++;
  }
  /**
  Define a new tag. If `parent` is given, the tag is treated as a
  sub-tag of that parent, and
  [highlighters](#highlight.tagHighlighter) that don't mention
  this tag will try to fall back to the parent tag (or grandparent
  tag, etc).
  */
  static define(e) {
    if (e != null && e.base)
      throw new Error("Can not derive from a modified tag");
    let t = new et([], null, []);
    if (t.set.push(t), e)
      for (let i of e.set)
        t.set.push(i);
    return t;
  }
  /**
  Define a tag _modifier_, which is a function that, given a tag,
  will return a tag that is a subtag of the original. Applying the
  same modifier to a twice tag will return the same value (`m1(t1)
  == m1(t1)`) and applying multiple modifiers will, regardless or
  order, produce the same tag (`m1(m2(t1)) == m2(m1(t1))`).
  
  When multiple modifiers are applied to a given base tag, each
  smaller set of modifiers is registered as a parent, so that for
  example `m1(m2(m3(t1)))` is a subtype of `m1(m2(t1))`,
  `m1(m3(t1)`, and so on.
  */
  static defineModifier() {
    let e = new vs();
    return (t) => t.modified.indexOf(e) > -1 ? t : vs.get(t.base || t, t.modified.concat(e).sort((i, s) => i.id - s.id));
  }
}
let xg = 0;
class vs {
  constructor() {
    this.instances = [], this.id = xg++;
  }
  static get(e, t) {
    if (!t.length)
      return e;
    let i = t[0].instances.find((l) => l.base == e && Sg(t, l.modified));
    if (i)
      return i;
    let s = [], r = new et(s, e, t);
    for (let l of t)
      l.instances.push(r);
    let o = _g(t);
    for (let l of e.set)
      if (!l.modified.length)
        for (let a of o)
          s.push(vs.get(l, a));
    return r;
  }
}
function Sg(n, e) {
  return n.length == e.length && n.every((t, i) => t == e[i]);
}
function _g(n) {
  let e = [[]];
  for (let t = 0; t < n.length; t++)
    for (let i = 0, s = e.length; i < s; i++)
      e.push(e[i].concat(n[t]));
  return e.sort((t, i) => i.length - t.length);
}
function Cg(n) {
  let e = /* @__PURE__ */ Object.create(null);
  for (let t in n) {
    let i = n[t];
    Array.isArray(i) || (i = [i]);
    for (let s of t.split(" "))
      if (s) {
        let r = [], o = 2, l = s;
        for (let c = 0; ; ) {
          if (l == "..." && c > 0 && c + 3 == s.length) {
            o = 1;
            break;
          }
          let u = /^"(?:[^"\\]|\\.)*?"|[^\/!]+/.exec(l);
          if (!u)
            throw new RangeError("Invalid path: " + s);
          if (r.push(u[0] == "*" ? "" : u[0][0] == '"' ? JSON.parse(u[0]) : u[0]), c += u[0].length, c == s.length)
            break;
          let d = s[c++];
          if (c == s.length && d == "!") {
            o = 0;
            break;
          }
          if (d != "/")
            throw new RangeError("Invalid path: " + s);
          l = s.slice(c);
        }
        let a = r.length - 1, h = r[a];
        if (!h)
          throw new RangeError("Invalid path: " + s);
        let f = new xs(i, o, a > 0 ? r.slice(0, a) : null);
        e[h] = f.sort(e[h]);
      }
  }
  return Bc.add(e);
}
const Bc = new V();
class xs {
  constructor(e, t, i, s) {
    this.tags = e, this.mode = t, this.context = i, this.next = s;
  }
  get opaque() {
    return this.mode == 0;
  }
  get inherit() {
    return this.mode == 1;
  }
  sort(e) {
    return !e || e.depth < this.depth ? (this.next = e, this) : (e.next = this.sort(e.next), e);
  }
  get depth() {
    return this.context ? this.context.length : 0;
  }
}
xs.empty = new xs([], 2, null);
function Pc(n, e) {
  let t = /* @__PURE__ */ Object.create(null);
  for (let r of n)
    if (!Array.isArray(r.tag))
      t[r.tag.id] = r.class;
    else
      for (let o of r.tag)
        t[o.id] = r.class;
  let { scope: i, all: s = null } = e || {};
  return {
    style: (r) => {
      let o = s;
      for (let l of r)
        for (let a of l.set) {
          let h = t[a.id];
          if (h) {
            o = o ? o + " " + h : h;
            break;
          }
        }
      return o;
    },
    scope: i
  };
}
function Ag(n, e) {
  let t = null;
  for (let i of n) {
    let s = i.style(e);
    s && (t = t ? t + " " + s : s);
  }
  return t;
}
function Mg(n, e, t, i = 0, s = n.length) {
  let r = new Tg(i, Array.isArray(e) ? e : [e], t);
  r.highlightRange(n.cursor(), i, s, "", r.highlighters), r.flush(s);
}
class Tg {
  constructor(e, t, i) {
    this.at = e, this.highlighters = t, this.span = i, this.class = "";
  }
  startSpan(e, t) {
    t != this.class && (this.flush(e), e > this.at && (this.at = e), this.class = t);
  }
  flush(e) {
    e > this.at && this.class && this.span(this.at, e, this.class);
  }
  highlightRange(e, t, i, s, r) {
    let { type: o, from: l, to: a } = e;
    if (l >= i || a <= t)
      return;
    o.isTop && (r = this.highlighters.filter((d) => !d.scope || d.scope(o)));
    let h = s, f = Dg(e) || xs.empty, c = Ag(r, f.tags);
    if (c && (h && (h += " "), h += c, f.mode == 1 && (s += (s ? " " : "") + c)), this.startSpan(Math.max(t, l), h), f.opaque)
      return;
    let u = e.tree && e.tree.prop(V.mounted);
    if (u && u.overlay) {
      let d = e.node.enter(u.overlay[0].from + l, 1), p = this.highlighters.filter((g) => !g.scope || g.scope(u.tree.type)), m = e.firstChild();
      for (let g = 0, y = l; ; g++) {
        let k = g < u.overlay.length ? u.overlay[g] : null, w = k ? k.from + l : a, S = Math.max(t, y), _ = Math.min(i, w);
        if (S < _ && m)
          for (; e.from < _ && (this.highlightRange(e, S, _, s, r), this.startSpan(Math.min(_, e.to), h), !(e.to >= w || !e.nextSibling())); )
            ;
        if (!k || w > i)
          break;
        y = k.to + l, y > t && (this.highlightRange(d.cursor(), Math.max(t, k.from + l), Math.min(i, y), "", p), this.startSpan(Math.min(i, y), h));
      }
      m && e.parent();
    } else if (e.firstChild()) {
      u && (s = "");
      do
        if (!(e.to <= t)) {
          if (e.from >= i)
            break;
          this.highlightRange(e, t, i, s, r), this.startSpan(Math.min(i, e.to), h);
        }
      while (e.nextSibling());
      e.parent();
    }
  }
}
function Dg(n) {
  let e = n.type.prop(Bc);
  for (; e && e.context && !n.matchContext(e.context); )
    e = e.next;
  return e || null;
}
const A = et.define, qn = A(), At = A(), Ba = A(At), Pa = A(At), Mt = A(), jn = A(Mt), hr = A(Mt), Qe = A(), Wt = A(Qe), Xe = A(), Ze = A(), ko = A(), qi = A(ko), Kn = A(), b = {
  /**
  A comment.
  */
  comment: qn,
  /**
  A line [comment](#highlight.tags.comment).
  */
  lineComment: A(qn),
  /**
  A block [comment](#highlight.tags.comment).
  */
  blockComment: A(qn),
  /**
  A documentation [comment](#highlight.tags.comment).
  */
  docComment: A(qn),
  /**
  Any kind of identifier.
  */
  name: At,
  /**
  The [name](#highlight.tags.name) of a variable.
  */
  variableName: A(At),
  /**
  A type [name](#highlight.tags.name).
  */
  typeName: Ba,
  /**
  A tag name (subtag of [`typeName`](#highlight.tags.typeName)).
  */
  tagName: A(Ba),
  /**
  A property or field [name](#highlight.tags.name).
  */
  propertyName: Pa,
  /**
  An attribute name (subtag of [`propertyName`](#highlight.tags.propertyName)).
  */
  attributeName: A(Pa),
  /**
  The [name](#highlight.tags.name) of a class.
  */
  className: A(At),
  /**
  A label [name](#highlight.tags.name).
  */
  labelName: A(At),
  /**
  A namespace [name](#highlight.tags.name).
  */
  namespace: A(At),
  /**
  The [name](#highlight.tags.name) of a macro.
  */
  macroName: A(At),
  /**
  A literal value.
  */
  literal: Mt,
  /**
  A string [literal](#highlight.tags.literal).
  */
  string: jn,
  /**
  A documentation [string](#highlight.tags.string).
  */
  docString: A(jn),
  /**
  A character literal (subtag of [string](#highlight.tags.string)).
  */
  character: A(jn),
  /**
  An attribute value (subtag of [string](#highlight.tags.string)).
  */
  attributeValue: A(jn),
  /**
  A number [literal](#highlight.tags.literal).
  */
  number: hr,
  /**
  An integer [number](#highlight.tags.number) literal.
  */
  integer: A(hr),
  /**
  A floating-point [number](#highlight.tags.number) literal.
  */
  float: A(hr),
  /**
  A boolean [literal](#highlight.tags.literal).
  */
  bool: A(Mt),
  /**
  Regular expression [literal](#highlight.tags.literal).
  */
  regexp: A(Mt),
  /**
  An escape [literal](#highlight.tags.literal), for example a
  backslash escape in a string.
  */
  escape: A(Mt),
  /**
  A color [literal](#highlight.tags.literal).
  */
  color: A(Mt),
  /**
  A URL [literal](#highlight.tags.literal).
  */
  url: A(Mt),
  /**
  A language keyword.
  */
  keyword: Xe,
  /**
  The [keyword](#highlight.tags.keyword) for the self or this
  object.
  */
  self: A(Xe),
  /**
  The [keyword](#highlight.tags.keyword) for null.
  */
  null: A(Xe),
  /**
  A [keyword](#highlight.tags.keyword) denoting some atomic value.
  */
  atom: A(Xe),
  /**
  A [keyword](#highlight.tags.keyword) that represents a unit.
  */
  unit: A(Xe),
  /**
  A modifier [keyword](#highlight.tags.keyword).
  */
  modifier: A(Xe),
  /**
  A [keyword](#highlight.tags.keyword) that acts as an operator.
  */
  operatorKeyword: A(Xe),
  /**
  A control-flow related [keyword](#highlight.tags.keyword).
  */
  controlKeyword: A(Xe),
  /**
  A [keyword](#highlight.tags.keyword) that defines something.
  */
  definitionKeyword: A(Xe),
  /**
  A [keyword](#highlight.tags.keyword) related to defining or
  interfacing with modules.
  */
  moduleKeyword: A(Xe),
  /**
  An operator.
  */
  operator: Ze,
  /**
  An [operator](#highlight.tags.operator) that dereferences something.
  */
  derefOperator: A(Ze),
  /**
  Arithmetic-related [operator](#highlight.tags.operator).
  */
  arithmeticOperator: A(Ze),
  /**
  Logical [operator](#highlight.tags.operator).
  */
  logicOperator: A(Ze),
  /**
  Bit [operator](#highlight.tags.operator).
  */
  bitwiseOperator: A(Ze),
  /**
  Comparison [operator](#highlight.tags.operator).
  */
  compareOperator: A(Ze),
  /**
  [Operator](#highlight.tags.operator) that updates its operand.
  */
  updateOperator: A(Ze),
  /**
  [Operator](#highlight.tags.operator) that defines something.
  */
  definitionOperator: A(Ze),
  /**
  Type-related [operator](#highlight.tags.operator).
  */
  typeOperator: A(Ze),
  /**
  Control-flow [operator](#highlight.tags.operator).
  */
  controlOperator: A(Ze),
  /**
  Program or markup punctuation.
  */
  punctuation: ko,
  /**
  [Punctuation](#highlight.tags.punctuation) that separates
  things.
  */
  separator: A(ko),
  /**
  Bracket-style [punctuation](#highlight.tags.punctuation).
  */
  bracket: qi,
  /**
  Angle [brackets](#highlight.tags.bracket) (usually `<` and `>`
  tokens).
  */
  angleBracket: A(qi),
  /**
  Square [brackets](#highlight.tags.bracket) (usually `[` and `]`
  tokens).
  */
  squareBracket: A(qi),
  /**
  Parentheses (usually `(` and `)` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  paren: A(qi),
  /**
  Braces (usually `{` and `}` tokens). Subtag of
  [bracket](#highlight.tags.bracket).
  */
  brace: A(qi),
  /**
  Content, for example plain text in XML or markup documents.
  */
  content: Qe,
  /**
  [Content](#highlight.tags.content) that represents a heading.
  */
  heading: Wt,
  /**
  A level 1 [heading](#highlight.tags.heading).
  */
  heading1: A(Wt),
  /**
  A level 2 [heading](#highlight.tags.heading).
  */
  heading2: A(Wt),
  /**
  A level 3 [heading](#highlight.tags.heading).
  */
  heading3: A(Wt),
  /**
  A level 4 [heading](#highlight.tags.heading).
  */
  heading4: A(Wt),
  /**
  A level 5 [heading](#highlight.tags.heading).
  */
  heading5: A(Wt),
  /**
  A level 6 [heading](#highlight.tags.heading).
  */
  heading6: A(Wt),
  /**
  A prose separator (such as a horizontal rule).
  */
  contentSeparator: A(Qe),
  /**
  [Content](#highlight.tags.content) that represents a list.
  */
  list: A(Qe),
  /**
  [Content](#highlight.tags.content) that represents a quote.
  */
  quote: A(Qe),
  /**
  [Content](#highlight.tags.content) that is emphasized.
  */
  emphasis: A(Qe),
  /**
  [Content](#highlight.tags.content) that is styled strong.
  */
  strong: A(Qe),
  /**
  [Content](#highlight.tags.content) that is part of a link.
  */
  link: A(Qe),
  /**
  [Content](#highlight.tags.content) that is styled as code or
  monospace.
  */
  monospace: A(Qe),
  /**
  [Content](#highlight.tags.content) that has a strike-through
  style.
  */
  strikethrough: A(Qe),
  /**
  Inserted text in a change-tracking format.
  */
  inserted: A(),
  /**
  Deleted text.
  */
  deleted: A(),
  /**
  Changed text.
  */
  changed: A(),
  /**
  An invalid or unsyntactic element.
  */
  invalid: A(),
  /**
  Metadata or meta-instruction.
  */
  meta: Kn,
  /**
  [Metadata](#highlight.tags.meta) that applies to the entire
  document.
  */
  documentMeta: A(Kn),
  /**
  [Metadata](#highlight.tags.meta) that annotates or adds
  attributes to a given syntactic element.
  */
  annotation: A(Kn),
  /**
  Processing instruction or preprocessor directive. Subtag of
  [meta](#highlight.tags.meta).
  */
  processingInstruction: A(Kn),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that a
  given element is being defined. Expected to be used with the
  various [name](#highlight.tags.name) tags.
  */
  definition: et.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates that
  something is constant. Mostly expected to be used with
  [variable names](#highlight.tags.variableName).
  */
  constant: et.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) used to indicate that
  a [variable](#highlight.tags.variableName) or [property
  name](#highlight.tags.propertyName) is being called or defined
  as a function.
  */
  function: et.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that can be applied to
  [names](#highlight.tags.name) to indicate that they belong to
  the language's standard environment.
  */
  standard: et.defineModifier(),
  /**
  [Modifier](#highlight.Tag^defineModifier) that indicates a given
  [names](#highlight.tags.name) is local to some scope.
  */
  local: et.defineModifier(),
  /**
  A generic variant [modifier](#highlight.Tag^defineModifier) that
  can be used to tag language-specific alternative variants of
  some common tag. It is recommended for themes to define special
  forms of at least the [string](#highlight.tags.string) and
  [variable name](#highlight.tags.variableName) tags, since those
  come up a lot.
  */
  special: et.defineModifier()
};
Pc([
  { tag: b.link, class: "tok-link" },
  { tag: b.heading, class: "tok-heading" },
  { tag: b.emphasis, class: "tok-emphasis" },
  { tag: b.strong, class: "tok-strong" },
  { tag: b.keyword, class: "tok-keyword" },
  { tag: b.atom, class: "tok-atom" },
  { tag: b.bool, class: "tok-bool" },
  { tag: b.url, class: "tok-url" },
  { tag: b.labelName, class: "tok-labelName" },
  { tag: b.inserted, class: "tok-inserted" },
  { tag: b.deleted, class: "tok-deleted" },
  { tag: b.literal, class: "tok-literal" },
  { tag: b.string, class: "tok-string" },
  { tag: b.number, class: "tok-number" },
  { tag: [b.regexp, b.escape, b.special(b.string)], class: "tok-string2" },
  { tag: b.variableName, class: "tok-variableName" },
  { tag: b.local(b.variableName), class: "tok-variableName tok-local" },
  { tag: b.definition(b.variableName), class: "tok-variableName tok-definition" },
  { tag: b.special(b.variableName), class: "tok-variableName2" },
  { tag: b.definition(b.propertyName), class: "tok-propertyName tok-definition" },
  { tag: b.typeName, class: "tok-typeName" },
  { tag: b.namespace, class: "tok-namespace" },
  { tag: b.className, class: "tok-className" },
  { tag: b.macroName, class: "tok-macroName" },
  { tag: b.propertyName, class: "tok-propertyName" },
  { tag: b.operator, class: "tok-operator" },
  { tag: b.comment, class: "tok-comment" },
  { tag: b.meta, class: "tok-meta" },
  { tag: b.invalid, class: "tok-invalid" },
  { tag: b.punctuation, class: "tok-punctuation" }
]);
var fr;
const Gt = /* @__PURE__ */ new V();
function Lc(n) {
  return O.define({
    combine: n ? (e) => e.concat(n) : void 0
  });
}
const Og = /* @__PURE__ */ new V();
class Ie {
  /**
  Construct a language object. If you need to invoke this
  directly, first define a data facet with
  [`defineLanguageFacet`](https://codemirror.net/6/docs/ref/#language.defineLanguageFacet), and then
  configure your parser to [attach](https://codemirror.net/6/docs/ref/#language.languageDataProp) it
  to the language's outer syntax node.
  */
  constructor(e, t, i = [], s = "") {
    this.data = e, this.name = s, G.prototype.hasOwnProperty("tree") || Object.defineProperty(G.prototype, "tree", { get() {
      return ue(this);
    } }), this.parser = t, this.extension = [
      Ht.of(this),
      G.languageData.of((r, o, l) => {
        let a = La(r, o, l), h = a.type.prop(Gt);
        if (!h)
          return [];
        let f = r.facet(h), c = a.type.prop(Og);
        if (c) {
          let u = a.resolve(o - a.from, l);
          for (let d of c)
            if (d.test(u, r)) {
              let p = r.facet(d.facet);
              return d.type == "replace" ? p : p.concat(f);
            }
        }
        return f;
      })
    ].concat(i);
  }
  /**
  Query whether this language is active at the given position.
  */
  isActiveAt(e, t, i = -1) {
    return La(e, t, i).type.prop(Gt) == this.data;
  }
  /**
  Find the document regions that were parsed using this language.
  The returned regions will _include_ any nested languages rooted
  in this language, when those exist.
  */
  findRegions(e) {
    let t = e.facet(Ht);
    if ((t == null ? void 0 : t.data) == this.data)
      return [{ from: 0, to: e.doc.length }];
    if (!t || !t.allowsNesting)
      return [];
    let i = [], s = (r, o) => {
      if (r.prop(Gt) == this.data) {
        i.push({ from: o, to: o + r.length });
        return;
      }
      let l = r.prop(V.mounted);
      if (l) {
        if (l.tree.prop(Gt) == this.data) {
          if (l.overlay)
            for (let a of l.overlay)
              i.push({ from: a.from + o, to: a.to + o });
          else
            i.push({ from: o, to: o + r.length });
          return;
        } else if (l.overlay) {
          let a = i.length;
          if (s(l.tree, l.overlay[0].from + o), i.length > a)
            return;
        }
      }
      for (let a = 0; a < r.children.length; a++) {
        let h = r.children[a];
        h instanceof Z && s(h, r.positions[a] + o);
      }
    };
    return s(ue(e), 0), i;
  }
  /**
  Indicates whether this language allows nested languages. The
  default implementation returns true.
  */
  get allowsNesting() {
    return !0;
  }
}
Ie.setState = /* @__PURE__ */ z.define();
function La(n, e, t) {
  let i = n.facet(Ht), s = ue(n).topNode;
  if (!i || i.allowsNesting)
    for (let r = s; r; r = r.enter(e, t, ie.ExcludeBuffers))
      r.type.isTop && (s = r);
  return s;
}
class vo extends Ie {
  constructor(e, t, i) {
    super(e, t, [], i), this.parser = t;
  }
  /**
  Define a language from a parser.
  */
  static define(e) {
    let t = Lc(e.languageData);
    return new vo(t, e.parser.configure({
      props: [Gt.add((i) => i.isTop ? t : void 0)]
    }), e.name);
  }
  /**
  Create a new instance of this language with a reconfigured
  version of its parser and optionally a new name.
  */
  configure(e, t) {
    return new vo(this.data, this.parser.configure(e), t || this.name);
  }
  get allowsNesting() {
    return this.parser.hasWrappers();
  }
}
function ue(n) {
  let e = n.field(Ie.state, !1);
  return e ? e.tree : Z.empty;
}
class Bg {
  /**
  Create an input object for the given document.
  */
  constructor(e) {
    this.doc = e, this.cursorPos = 0, this.string = "", this.cursor = e.iter();
  }
  get length() {
    return this.doc.length;
  }
  syncTo(e) {
    return this.string = this.cursor.next(e - this.cursorPos).value, this.cursorPos = e + this.string.length, this.cursorPos - this.string.length;
  }
  chunk(e) {
    return this.syncTo(e), this.string;
  }
  get lineChunks() {
    return !0;
  }
  read(e, t) {
    let i = this.cursorPos - this.string.length;
    return e < i || t >= this.cursorPos ? this.doc.sliceString(e, t) : this.string.slice(e - i, t - i);
  }
}
let ji = null;
class Di {
  constructor(e, t, i = [], s, r, o, l, a) {
    this.parser = e, this.state = t, this.fragments = i, this.tree = s, this.treeLen = r, this.viewport = o, this.skipped = l, this.scheduleOn = a, this.parse = null, this.tempSkipped = [];
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Di(e, t, [], Z.empty, 0, i, [], null);
  }
  startParse() {
    return this.parser.startParse(new Bg(this.state.doc), this.fragments);
  }
  /**
  @internal
  */
  work(e, t) {
    return t != null && t >= this.state.doc.length && (t = void 0), this.tree != Z.empty && this.isDone(t ?? this.state.doc.length) ? (this.takeTree(), !0) : this.withContext(() => {
      var i;
      if (typeof e == "number") {
        let s = Date.now() + e;
        e = () => Date.now() > s;
      }
      for (this.parse || (this.parse = this.startParse()), t != null && (this.parse.stoppedAt == null || this.parse.stoppedAt > t) && t < this.state.doc.length && this.parse.stopAt(t); ; ) {
        let s = this.parse.advance();
        if (s)
          if (this.fragments = this.withoutTempSkipped(bt.addTree(s, this.fragments, this.parse.stoppedAt != null)), this.treeLen = (i = this.parse.stoppedAt) !== null && i !== void 0 ? i : this.state.doc.length, this.tree = s, this.parse = null, this.treeLen < (t ?? this.state.doc.length))
            this.parse = this.startParse();
          else
            return !0;
        if (e())
          return !1;
      }
    });
  }
  /**
  @internal
  */
  takeTree() {
    let e, t;
    this.parse && (e = this.parse.parsedPos) >= this.treeLen && ((this.parse.stoppedAt == null || this.parse.stoppedAt > e) && this.parse.stopAt(e), this.withContext(() => {
      for (; !(t = this.parse.advance()); )
        ;
    }), this.treeLen = e, this.tree = t, this.fragments = this.withoutTempSkipped(bt.addTree(this.tree, this.fragments, !0)), this.parse = null);
  }
  withContext(e) {
    let t = ji;
    ji = this;
    try {
      return e();
    } finally {
      ji = t;
    }
  }
  withoutTempSkipped(e) {
    for (let t; t = this.tempSkipped.pop(); )
      e = Ea(e, t.from, t.to);
    return e;
  }
  /**
  @internal
  */
  changes(e, t) {
    let { fragments: i, tree: s, treeLen: r, viewport: o, skipped: l } = this;
    if (this.takeTree(), !e.empty) {
      let a = [];
      if (e.iterChangedRanges((h, f, c, u) => a.push({ fromA: h, toA: f, fromB: c, toB: u })), i = bt.applyChanges(i, a), s = Z.empty, r = 0, o = { from: e.mapPos(o.from, -1), to: e.mapPos(o.to, 1) }, this.skipped.length) {
        l = [];
        for (let h of this.skipped) {
          let f = e.mapPos(h.from, 1), c = e.mapPos(h.to, -1);
          f < c && l.push({ from: f, to: c });
        }
      }
    }
    return new Di(this.parser, t, i, s, r, o, l, this.scheduleOn);
  }
  /**
  @internal
  */
  updateViewport(e) {
    if (this.viewport.from == e.from && this.viewport.to == e.to)
      return !1;
    this.viewport = e;
    let t = this.skipped.length;
    for (let i = 0; i < this.skipped.length; i++) {
      let { from: s, to: r } = this.skipped[i];
      s < e.to && r > e.from && (this.fragments = Ea(this.fragments, s, r), this.skipped.splice(i--, 1));
    }
    return this.skipped.length >= t ? !1 : (this.reset(), !0);
  }
  /**
  @internal
  */
  reset() {
    this.parse && (this.takeTree(), this.parse = null);
  }
  /**
  Notify the parse scheduler that the given region was skipped
  because it wasn't in view, and the parse should be restarted
  when it comes into view.
  */
  skipUntilInView(e, t) {
    this.skipped.push({ from: e, to: t });
  }
  /**
  Returns a parser intended to be used as placeholder when
  asynchronously loading a nested parser. It'll skip its input and
  mark it as not-really-parsed, so that the next update will parse
  it again.
  
  When `until` is given, a reparse will be scheduled when that
  promise resolves.
  */
  static getSkippingParser(e) {
    return new class extends Oc {
      createParse(t, i, s) {
        let r = s[0].from, o = s[s.length - 1].to;
        return {
          parsedPos: r,
          advance() {
            let a = ji;
            if (a) {
              for (let h of s)
                a.tempSkipped.push(h);
              e && (a.scheduleOn = a.scheduleOn ? Promise.all([a.scheduleOn, e]) : e);
            }
            return this.parsedPos = o, new Z(Ce.none, [], [], o - r);
          },
          stoppedAt: null,
          stopAt() {
          }
        };
      }
    }();
  }
  /**
  @internal
  */
  isDone(e) {
    e = Math.min(e, this.state.doc.length);
    let t = this.fragments;
    return this.treeLen >= e && t.length && t[0].from == 0 && t[0].to >= e;
  }
  /**
  Get the context for the current parse, or `null` if no editor
  parse is in progress.
  */
  static get() {
    return ji;
  }
}
function Ea(n, e, t) {
  return bt.applyChanges(n, [{ fromA: e, toA: t, fromB: e, toB: t }]);
}
class Oi {
  constructor(e) {
    this.context = e, this.tree = e.tree;
  }
  apply(e) {
    if (!e.docChanged && this.tree == this.context.tree)
      return this;
    let t = this.context.changes(e.changes, e.state), i = this.context.treeLen == e.startState.doc.length ? void 0 : Math.max(e.changes.mapPos(this.context.treeLen), t.viewport.to);
    return t.work(20, i) || t.takeTree(), new Oi(t);
  }
  static init(e) {
    let t = Math.min(3e3, e.doc.length), i = Di.create(e.facet(Ht).parser, e, { from: 0, to: t });
    return i.work(20, t) || i.takeTree(), new Oi(i);
  }
}
Ie.state = /* @__PURE__ */ Me.define({
  create: Oi.init,
  update(n, e) {
    for (let t of e.effects)
      if (t.is(Ie.setState))
        return t.value;
    return e.startState.facet(Ht) != e.state.facet(Ht) ? Oi.init(e.state) : n.apply(e);
  }
});
let Ec = (n) => {
  let e = setTimeout(
    () => n(),
    500
    /* Work.MaxPause */
  );
  return () => clearTimeout(e);
};
typeof requestIdleCallback < "u" && (Ec = (n) => {
  let e = -1, t = setTimeout(
    () => {
      e = requestIdleCallback(n, {
        timeout: 500 - 100
        /* Work.MinPause */
      });
    },
    100
    /* Work.MinPause */
  );
  return () => e < 0 ? clearTimeout(t) : cancelIdleCallback(e);
});
const cr = typeof navigator < "u" && (!((fr = navigator.scheduling) === null || fr === void 0) && fr.isInputPending) ? () => navigator.scheduling.isInputPending() : null, Pg = /* @__PURE__ */ ke.fromClass(class {
  constructor(e) {
    this.view = e, this.working = null, this.workScheduled = 0, this.chunkEnd = -1, this.chunkBudget = -1, this.work = this.work.bind(this), this.scheduleWork();
  }
  update(e) {
    let t = this.view.state.field(Ie.state).context;
    (t.updateViewport(e.view.viewport) || this.view.viewport.to > t.treeLen) && this.scheduleWork(), (e.docChanged || e.selectionSet) && (this.view.hasFocus && (this.chunkBudget += 50), this.scheduleWork()), this.checkAsyncSchedule(t);
  }
  scheduleWork() {
    if (this.working)
      return;
    let { state: e } = this.view, t = e.field(Ie.state);
    (t.tree != t.context.tree || !t.context.isDone(e.doc.length)) && (this.working = Ec(this.work));
  }
  work(e) {
    this.working = null;
    let t = Date.now();
    if (this.chunkEnd < t && (this.chunkEnd < 0 || this.view.hasFocus) && (this.chunkEnd = t + 3e4, this.chunkBudget = 3e3), this.chunkBudget <= 0)
      return;
    let { state: i, viewport: { to: s } } = this.view, r = i.field(Ie.state);
    if (r.tree == r.context.tree && r.context.isDone(
      s + 1e5
      /* Work.MaxParseAhead */
    ))
      return;
    let o = Date.now() + Math.min(this.chunkBudget, 100, e && !cr ? Math.max(25, e.timeRemaining() - 5) : 1e9), l = r.context.treeLen < s && i.doc.length > s + 1e3, a = r.context.work(() => cr && cr() || Date.now() > o, s + (l ? 0 : 1e5));
    this.chunkBudget -= Date.now() - t, (a || this.chunkBudget <= 0) && (r.context.takeTree(), this.view.dispatch({ effects: Ie.setState.of(new Oi(r.context)) })), this.chunkBudget > 0 && !(a && !l) && this.scheduleWork(), this.checkAsyncSchedule(r.context);
  }
  checkAsyncSchedule(e) {
    e.scheduleOn && (this.workScheduled++, e.scheduleOn.then(() => this.scheduleWork()).catch((t) => ft(this.view.state, t)).then(() => this.workScheduled--), e.scheduleOn = null);
  }
  destroy() {
    this.working && this.working();
  }
  isWorking() {
    return !!(this.working || this.workScheduled > 0);
  }
}, {
  eventHandlers: { focus() {
    this.scheduleWork();
  } }
}), Ht = /* @__PURE__ */ O.define({
  combine(n) {
    return n.length ? n[0] : null;
  },
  enables: (n) => [
    Ie.state,
    Pg,
    B.contentAttributes.compute([n], (e) => {
      let t = e.facet(n);
      return t && t.name ? { "data-language": t.name } : {};
    })
  ]
});
class cx {
  /**
  Create a language support object.
  */
  constructor(e, t = []) {
    this.language = e, this.support = t, this.extension = [e, t];
  }
}
class Rc {
  constructor(e, t, i, s, r, o = void 0) {
    this.name = e, this.alias = t, this.extensions = i, this.filename = s, this.loadFunc = r, this.support = o, this.loading = null;
  }
  /**
  Start loading the the language. Will return a promise that
  resolves to a [`LanguageSupport`](https://codemirror.net/6/docs/ref/#language.LanguageSupport)
  object when the language successfully loads.
  */
  load() {
    return this.loading || (this.loading = this.loadFunc().then((e) => this.support = e, (e) => {
      throw this.loading = null, e;
    }));
  }
  /**
  Create a language description.
  */
  static of(e) {
    let { load: t, support: i } = e;
    if (!t) {
      if (!i)
        throw new RangeError("Must pass either 'load' or 'support' to LanguageDescription.of");
      t = () => Promise.resolve(i);
    }
    return new Rc(e.name, (e.alias || []).concat(e.name).map((s) => s.toLowerCase()), e.extensions || [], e.filename, t, i);
  }
  /**
  Look for a language in the given array of descriptions that
  matches the filename. Will first match
  [`filename`](https://codemirror.net/6/docs/ref/#language.LanguageDescription.filename) patterns,
  and then [extensions](https://codemirror.net/6/docs/ref/#language.LanguageDescription.extensions),
  and return the first language that matches.
  */
  static matchFilename(e, t) {
    for (let s of e)
      if (s.filename && s.filename.test(t))
        return s;
    let i = /\.([^.]+)$/.exec(t);
    if (i) {
      for (let s of e)
        if (s.extensions.indexOf(i[1]) > -1)
          return s;
    }
    return null;
  }
  /**
  Look for a language whose name or alias matches the the given
  name (case-insensitively). If `fuzzy` is true, and no direct
  matchs is found, this'll also search for a language whose name
  or alias occurs in the string (for names shorter than three
  characters, only when surrounded by non-word characters).
  */
  static matchLanguageName(e, t, i = !0) {
    t = t.toLowerCase();
    for (let s of e)
      if (s.alias.some((r) => r == t))
        return s;
    if (i)
      for (let s of e)
        for (let r of s.alias) {
          let o = t.indexOf(r);
          if (o > -1 && (r.length > 2 || !/\w/.test(t[o - 1]) && !/\w/.test(t[o + r.length])))
            return s;
        }
    return null;
  }
}
const Ic = /* @__PURE__ */ O.define(), Hs = /* @__PURE__ */ O.define({
  combine: (n) => {
    if (!n.length)
      return "  ";
    let e = n[0];
    if (!e || /\S/.test(e) || Array.from(e).some((t) => t != e[0]))
      throw new Error("Invalid indent unit: " + JSON.stringify(n[0]));
    return e;
  }
});
function ti(n) {
  let e = n.facet(Hs);
  return e.charCodeAt(0) == 9 ? n.tabSize * e.length : e.length;
}
function bn(n, e) {
  let t = "", i = n.tabSize, s = n.facet(Hs)[0];
  if (s == "	") {
    for (; e >= i; )
      t += "	", e -= i;
    s = " ";
  }
  for (let r = 0; r < e; r++)
    t += s;
  return t;
}
function Jo(n, e) {
  n instanceof G && (n = new Vs(n));
  for (let i of n.state.facet(Ic)) {
    let s = i(n, e);
    if (s !== void 0)
      return s;
  }
  let t = ue(n.state);
  return t.length >= e ? Eg(n, t, e) : null;
}
class Vs {
  /**
  Create an indent context.
  */
  constructor(e, t = {}) {
    this.state = e, this.options = t, this.unit = ti(e);
  }
  /**
  Get a description of the line at the given position, taking
  [simulated line
  breaks](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  into account. If there is such a break at `pos`, the `bias`
  argument determines whether the part of the line line before or
  after the break is used.
  */
  lineAt(e, t = 1) {
    let i = this.state.doc.lineAt(e), { simulateBreak: s, simulateDoubleBreak: r } = this.options;
    return s != null && s >= i.from && s <= i.to ? r && s == e ? { text: "", from: e } : (t < 0 ? s < e : s <= e) ? { text: i.text.slice(s - i.from), from: s } : { text: i.text.slice(0, s - i.from), from: i.from } : i;
  }
  /**
  Get the text directly after `pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  textAfterPos(e, t = 1) {
    if (this.options.simulateDoubleBreak && e == this.options.simulateBreak)
      return "";
    let { text: i, from: s } = this.lineAt(e, t);
    return i.slice(e - s, Math.min(i.length, e + 100 - s));
  }
  /**
  Find the column for the given position.
  */
  column(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.countColumn(i, e - s), o = this.options.overrideIndentation ? this.options.overrideIndentation(s) : -1;
    return o > -1 && (r += o - this.countColumn(i, i.search(/\S|$/))), r;
  }
  /**
  Find the column position (taking tabs into account) of the given
  position in the given string.
  */
  countColumn(e, t = e.length) {
    return Ei(e, this.state.tabSize, t);
  }
  /**
  Find the indentation column of the line at the given point.
  */
  lineIndent(e, t = 1) {
    let { text: i, from: s } = this.lineAt(e, t), r = this.options.overrideIndentation;
    if (r) {
      let o = r(s);
      if (o > -1)
        return o;
    }
    return this.countColumn(i, i.search(/\S|$/));
  }
  /**
  Returns the [simulated line
  break](https://codemirror.net/6/docs/ref/#language.IndentContext.constructor^options.simulateBreak)
  for this context, if any.
  */
  get simulatedBreak() {
    return this.options.simulateBreak || null;
  }
}
const Lg = /* @__PURE__ */ new V();
function Eg(n, e, t) {
  let i = e.resolveStack(t), s = i.node.enterUnfinishedNodesBefore(t);
  if (s != i.node) {
    let r = [];
    for (let o = s; o != i.node; o = o.parent)
      r.push(o);
    for (let o = r.length - 1; o >= 0; o--)
      i = { node: r[o], next: i };
  }
  return Nc(i, n, t);
}
function Nc(n, e, t) {
  for (let i = n; i; i = i.next) {
    let s = Ig(i.node);
    if (s)
      return s(Xo.create(e, t, i));
  }
  return 0;
}
function Rg(n) {
  return n.pos == n.options.simulateBreak && n.options.simulateDoubleBreak;
}
function Ig(n) {
  let e = n.type.prop(Lg);
  if (e)
    return e;
  let t = n.firstChild, i;
  if (t && (i = t.type.prop(V.closedBy))) {
    let s = n.lastChild, r = s && i.indexOf(s.name) > -1;
    return (o) => Fc(o, !0, 1, void 0, r && !Rg(o) ? s.from : void 0);
  }
  return n.parent == null ? Ng : null;
}
function Ng() {
  return 0;
}
class Xo extends Vs {
  constructor(e, t, i) {
    super(e.state, e.options), this.base = e, this.pos = t, this.context = i;
  }
  /**
  The syntax tree node to which the indentation strategy
  applies.
  */
  get node() {
    return this.context.node;
  }
  /**
  @internal
  */
  static create(e, t, i) {
    return new Xo(e, t, i);
  }
  /**
  Get the text directly after `this.pos`, either the entire line
  or the next 100 characters, whichever is shorter.
  */
  get textAfter() {
    return this.textAfterPos(this.pos);
  }
  /**
  Get the indentation at the reference line for `this.node`, which
  is the line on which it starts, unless there is a node that is
  _not_ a parent of this node covering the start of that line. If
  so, the line at the start of that node is tried, again skipping
  on if it is covered by another such node.
  */
  get baseIndent() {
    return this.baseIndentFor(this.node);
  }
  /**
  Get the indentation for the reference line of the given node
  (see [`baseIndent`](https://codemirror.net/6/docs/ref/#language.TreeIndentContext.baseIndent)).
  */
  baseIndentFor(e) {
    let t = this.state.doc.lineAt(e.from);
    for (; ; ) {
      let i = e.resolve(t.from);
      for (; i.parent && i.parent.from == i.from; )
        i = i.parent;
      if (Fg(i, e))
        break;
      t = this.state.doc.lineAt(i.from);
    }
    return this.lineIndent(t.from);
  }
  /**
  Continue looking for indentations in the node's parent nodes,
  and return the result of that.
  */
  continue() {
    return Nc(this.context.next, this.base, this.pos);
  }
}
function Fg(n, e) {
  for (let t = e; t; t = t.parent)
    if (n == t)
      return !0;
  return !1;
}
function Hg(n) {
  let e = n.node, t = e.childAfter(e.from), i = e.lastChild;
  if (!t)
    return null;
  let s = n.options.simulateBreak, r = n.state.doc.lineAt(t.from), o = s == null || s <= r.from ? r.to : Math.min(r.to, s);
  for (let l = t.to; ; ) {
    let a = e.childAfter(l);
    if (!a || a == i)
      return null;
    if (!a.type.isSkipped)
      return a.from < o ? t : null;
    l = a.to;
  }
}
function ux({ closing: n, align: e = !0, units: t = 1 }) {
  return (i) => Fc(i, e, t, n);
}
function Fc(n, e, t, i, s) {
  let r = n.textAfter, o = r.match(/^\s*/)[0].length, l = i && r.slice(o, o + i.length) == i || s == n.pos + o, a = e ? Hg(n) : null;
  return a ? l ? n.column(a.from) : n.column(a.to) : n.baseIndent + (l ? 0 : n.unit * t);
}
const dx = (n) => n.baseIndent;
function px({ except: n, units: e = 1 } = {}) {
  return (t) => {
    let i = n && n.test(t.textAfter);
    return t.baseIndent + (i ? 0 : e * t.unit);
  };
}
const Vg = 200;
function Wg() {
  return G.transactionFilter.of((n) => {
    if (!n.docChanged || !n.isUserEvent("input.type") && !n.isUserEvent("input.complete"))
      return n;
    let e = n.startState.languageDataAt("indentOnInput", n.startState.selection.main.head);
    if (!e.length)
      return n;
    let t = n.newDoc, { head: i } = n.newSelection.main, s = t.lineAt(i);
    if (i > s.from + Vg)
      return n;
    let r = t.sliceString(s.from, i);
    if (!e.some((h) => h.test(r)))
      return n;
    let { state: o } = n, l = -1, a = [];
    for (let { head: h } of o.selection.ranges) {
      let f = o.doc.lineAt(h);
      if (f.from == l)
        continue;
      l = f.from;
      let c = Jo(o, f.from);
      if (c == null)
        continue;
      let u = /^\s*/.exec(f.text)[0], d = bn(o, c);
      u != d && a.push({ from: f.from, to: f.from + u.length, insert: d });
    }
    return a.length ? [n, { changes: a, sequential: !0 }] : n;
  });
}
const zg = /* @__PURE__ */ O.define(), qg = /* @__PURE__ */ new V();
function mx(n) {
  let e = n.firstChild, t = n.lastChild;
  return e && e.to < t.from ? { from: e.to, to: t.type.isError ? n.to : t.from } : null;
}
function jg(n, e, t) {
  let i = ue(n);
  if (i.length < t)
    return null;
  let s = i.resolveStack(t, 1), r = null;
  for (let o = s; o; o = o.next) {
    let l = o.node;
    if (l.to <= t || l.from > t)
      continue;
    if (r && l.from < e)
      break;
    let a = l.type.prop(qg);
    if (a && (l.to < i.length - 50 || i.length == n.doc.length || !Kg(l))) {
      let h = a(l, n);
      h && h.from <= t && h.from >= e && h.to > t && (r = h);
    }
  }
  return r;
}
function Kg(n) {
  let e = n.lastChild;
  return e && e.to == n.to && e.type.isError;
}
function Ss(n, e, t) {
  for (let i of n.facet(zg)) {
    let s = i(n, e, t);
    if (s)
      return s;
  }
  return jg(n, e, t);
}
function Hc(n, e) {
  let t = e.mapPos(n.from, 1), i = e.mapPos(n.to, -1);
  return t >= i ? void 0 : { from: t, to: i };
}
const Ws = /* @__PURE__ */ z.define({ map: Hc }), Cn = /* @__PURE__ */ z.define({ map: Hc });
function Vc(n) {
  let e = [];
  for (let { head: t } of n.state.selection.ranges)
    e.some((i) => i.from <= t && i.to >= t) || e.push(n.lineBlockAt(t));
  return e;
}
const ii = /* @__PURE__ */ Me.define({
  create() {
    return q.none;
  },
  update(n, e) {
    n = n.map(e.changes);
    for (let t of e.effects)
      if (t.is(Ws) && !Ug(n, t.value.from, t.value.to)) {
        let { preparePlaceholder: i } = e.state.facet(Zo), s = i ? q.replace({ widget: new $g(i(e.state, t.value)) }) : Ra;
        n = n.update({ add: [s.range(t.value.from, t.value.to)] });
      } else
        t.is(Cn) && (n = n.update({
          filter: (i, s) => t.value.from != i || t.value.to != s,
          filterFrom: t.value.from,
          filterTo: t.value.to
        }));
    if (e.selection) {
      let t = !1, { head: i } = e.selection.main;
      n.between(i, i, (s, r) => {
        s < i && r > i && (t = !0);
      }), t && (n = n.update({
        filterFrom: i,
        filterTo: i,
        filter: (s, r) => r <= i || s >= i
      }));
    }
    return n;
  },
  provide: (n) => B.decorations.from(n),
  toJSON(n, e) {
    let t = [];
    return n.between(0, e.doc.length, (i, s) => {
      t.push(i, s);
    }), t;
  },
  fromJSON(n) {
    if (!Array.isArray(n) || n.length % 2)
      throw new RangeError("Invalid JSON for fold state");
    let e = [];
    for (let t = 0; t < n.length; ) {
      let i = n[t++], s = n[t++];
      if (typeof i != "number" || typeof s != "number")
        throw new RangeError("Invalid JSON for fold state");
      e.push(Ra.range(i, s));
    }
    return q.set(e, !0);
  }
});
function _s(n, e, t) {
  var i;
  let s = null;
  return (i = n.field(ii, !1)) === null || i === void 0 || i.between(e, t, (r, o) => {
    (!s || s.from > r) && (s = { from: r, to: o });
  }), s;
}
function Ug(n, e, t) {
  let i = !1;
  return n.between(e, e, (s, r) => {
    s == e && r == t && (i = !0);
  }), i;
}
function Wc(n, e) {
  return n.field(ii, !1) ? e : e.concat(z.appendConfig.of(qc()));
}
const Gg = (n) => {
  for (let e of Vc(n)) {
    let t = Ss(n.state, e.from, e.to);
    if (t)
      return n.dispatch({ effects: Wc(n.state, [Ws.of(t), zc(n, t)]) }), !0;
  }
  return !1;
}, Yg = (n) => {
  if (!n.state.field(ii, !1))
    return !1;
  let e = [];
  for (let t of Vc(n)) {
    let i = _s(n.state, t.from, t.to);
    i && e.push(Cn.of(i), zc(n, i, !1));
  }
  return e.length && n.dispatch({ effects: e }), e.length > 0;
};
function zc(n, e, t = !0) {
  let i = n.state.doc.lineAt(e.from).number, s = n.state.doc.lineAt(e.to).number;
  return B.announce.of(`${n.state.phrase(t ? "Folded lines" : "Unfolded lines")} ${i} ${n.state.phrase("to")} ${s}.`);
}
const Jg = (n) => {
  let { state: e } = n, t = [];
  for (let i = 0; i < e.doc.length; ) {
    let s = n.lineBlockAt(i), r = Ss(e, s.from, s.to);
    r && t.push(Ws.of(r)), i = (r ? n.lineBlockAt(r.to) : s).to + 1;
  }
  return t.length && n.dispatch({ effects: Wc(n.state, t) }), !!t.length;
}, Xg = (n) => {
  let e = n.state.field(ii, !1);
  if (!e || !e.size)
    return !1;
  let t = [];
  return e.between(0, n.state.doc.length, (i, s) => {
    t.push(Cn.of({ from: i, to: s }));
  }), n.dispatch({ effects: t }), !0;
}, Zg = [
  { key: "Ctrl-Shift-[", mac: "Cmd-Alt-[", run: Gg },
  { key: "Ctrl-Shift-]", mac: "Cmd-Alt-]", run: Yg },
  { key: "Ctrl-Alt-[", run: Jg },
  { key: "Ctrl-Alt-]", run: Xg }
], Qg = {
  placeholderDOM: null,
  preparePlaceholder: null,
  placeholderText: "…"
}, Zo = /* @__PURE__ */ O.define({
  combine(n) {
    return ai(n, Qg);
  }
});
function qc(n) {
  let e = [ii, i0];
  return n && e.push(Zo.of(n)), e;
}
function jc(n, e) {
  let { state: t } = n, i = t.facet(Zo), s = (o) => {
    let l = n.lineBlockAt(n.posAtDOM(o.target)), a = _s(n.state, l.from, l.to);
    a && n.dispatch({ effects: Cn.of(a) }), o.preventDefault();
  };
  if (i.placeholderDOM)
    return i.placeholderDOM(n, s, e);
  let r = document.createElement("span");
  return r.textContent = i.placeholderText, r.setAttribute("aria-label", t.phrase("folded code")), r.title = t.phrase("unfold"), r.className = "cm-foldPlaceholder", r.onclick = s, r;
}
const Ra = /* @__PURE__ */ q.replace({ widget: /* @__PURE__ */ new class extends ct {
  toDOM(n) {
    return jc(n, null);
  }
}() });
class $g extends ct {
  constructor(e) {
    super(), this.value = e;
  }
  eq(e) {
    return this.value == e.value;
  }
  toDOM(e) {
    return jc(e, this.value);
  }
}
const e0 = {
  openText: "⌄",
  closedText: "›",
  markerDOM: null,
  domEventHandlers: {},
  foldingChanged: () => !1
};
class ur extends Nt {
  constructor(e, t) {
    super(), this.config = e, this.open = t;
  }
  eq(e) {
    return this.config == e.config && this.open == e.open;
  }
  toDOM(e) {
    if (this.config.markerDOM)
      return this.config.markerDOM(this.open);
    let t = document.createElement("span");
    return t.textContent = this.open ? this.config.openText : this.config.closedText, t.title = e.state.phrase(this.open ? "Fold line" : "Unfold line"), t;
  }
}
function t0(n = {}) {
  let e = Object.assign(Object.assign({}, e0), n), t = new ur(e, !0), i = new ur(e, !1), s = ke.fromClass(class {
    constructor(o) {
      this.from = o.viewport.from, this.markers = this.buildMarkers(o);
    }
    update(o) {
      (o.docChanged || o.viewportChanged || o.startState.facet(Ht) != o.state.facet(Ht) || o.startState.field(ii, !1) != o.state.field(ii, !1) || ue(o.startState) != ue(o.state) || e.foldingChanged(o)) && (this.markers = this.buildMarkers(o.view));
    }
    buildMarkers(o) {
      let l = new Qt();
      for (let a of o.viewportLineBlocks) {
        let h = _s(o.state, a.from, a.to) ? i : Ss(o.state, a.from, a.to) ? t : null;
        h && l.add(a.from, a.from, h);
      }
      return l.finish();
    }
  }), { domEventHandlers: r } = e;
  return [
    s,
    eg({
      class: "cm-foldGutter",
      markers(o) {
        var l;
        return ((l = o.plugin(s)) === null || l === void 0 ? void 0 : l.markers) || Y.empty;
      },
      initialSpacer() {
        return new ur(e, !1);
      },
      domEventHandlers: Object.assign(Object.assign({}, r), { click: (o, l, a) => {
        if (r.click && r.click(o, l, a))
          return !0;
        let h = _s(o.state, l.from, l.to);
        if (h)
          return o.dispatch({ effects: Cn.of(h) }), !0;
        let f = Ss(o.state, l.from, l.to);
        return f ? (o.dispatch({ effects: Ws.of(f) }), !0) : !1;
      } })
    }),
    qc()
  ];
}
const i0 = /* @__PURE__ */ B.baseTheme({
  ".cm-foldPlaceholder": {
    backgroundColor: "#eee",
    border: "1px solid #ddd",
    color: "#888",
    borderRadius: ".2em",
    margin: "0 1px",
    padding: "0 1px",
    cursor: "pointer"
  },
  ".cm-foldGutter span": {
    padding: "0 1px",
    cursor: "pointer"
  }
});
class Ri {
  constructor(e, t) {
    this.specs = e;
    let i;
    function s(l) {
      let a = Et.newName();
      return (i || (i = /* @__PURE__ */ Object.create(null)))["." + a] = l, a;
    }
    const r = typeof t.all == "string" ? t.all : t.all ? s(t.all) : void 0, o = t.scope;
    this.scope = o instanceof Ie ? (l) => l.prop(Gt) == o.data : o ? (l) => l == o : void 0, this.style = Pc(e.map((l) => ({
      tag: l.tag,
      class: l.class || s(Object.assign({}, l, { tag: null }))
    })), {
      all: r
    }).style, this.module = i ? new Et(i) : null, this.themeType = t.themeType;
  }
  /**
  Create a highlighter style that associates the given styles to
  the given tags. The specs must be objects that hold a style tag
  or array of tags in their `tag` property, and either a single
  `class` property providing a static CSS class (for highlighter
  that rely on external styling), or a
  [`style-mod`](https://github.com/marijnh/style-mod#documentation)-style
  set of CSS properties (which define the styling for those tags).
  
  The CSS rules created for a highlighter will be emitted in the
  order of the spec's properties. That means that for elements that
  have multiple tags associated with them, styles defined further
  down in the list will have a higher CSS precedence than styles
  defined earlier.
  */
  static define(e, t) {
    return new Ri(e, t || {});
  }
}
const xo = /* @__PURE__ */ O.define(), Kc = /* @__PURE__ */ O.define({
  combine(n) {
    return n.length ? [n[0]] : null;
  }
});
function dr(n) {
  let e = n.facet(xo);
  return e.length ? e : n.facet(Kc);
}
function Qo(n, e) {
  let t = [s0], i;
  return n instanceof Ri && (n.module && t.push(B.styleModule.of(n.module)), i = n.themeType), e != null && e.fallback ? t.push(Kc.of(n)) : i ? t.push(xo.computeN([B.darkTheme], (s) => s.facet(B.darkTheme) == (i == "dark") ? [n] : [])) : t.push(xo.of(n)), t;
}
class n0 {
  constructor(e) {
    this.markCache = /* @__PURE__ */ Object.create(null), this.tree = ue(e.state), this.decorations = this.buildDeco(e, dr(e.state));
  }
  update(e) {
    let t = ue(e.state), i = dr(e.state), s = i != dr(e.startState);
    t.length < e.view.viewport.to && !s && t.type == this.tree.type ? this.decorations = this.decorations.map(e.changes) : (t != this.tree || e.viewportChanged || s) && (this.tree = t, this.decorations = this.buildDeco(e.view, i));
  }
  buildDeco(e, t) {
    if (!t || !this.tree.length)
      return q.none;
    let i = new Qt();
    for (let { from: s, to: r } of e.visibleRanges)
      Mg(this.tree, t, (o, l, a) => {
        i.add(o, l, this.markCache[a] || (this.markCache[a] = q.mark({ class: a })));
      }, s, r);
    return i.finish();
  }
}
const s0 = /* @__PURE__ */ vn.high(/* @__PURE__ */ ke.fromClass(n0, {
  decorations: (n) => n.decorations
})), r0 = /* @__PURE__ */ Ri.define([
  {
    tag: b.meta,
    color: "#404740"
  },
  {
    tag: b.link,
    textDecoration: "underline"
  },
  {
    tag: b.heading,
    textDecoration: "underline",
    fontWeight: "bold"
  },
  {
    tag: b.emphasis,
    fontStyle: "italic"
  },
  {
    tag: b.strong,
    fontWeight: "bold"
  },
  {
    tag: b.strikethrough,
    textDecoration: "line-through"
  },
  {
    tag: b.keyword,
    color: "#708"
  },
  {
    tag: [b.atom, b.bool, b.url, b.contentSeparator, b.labelName],
    color: "#219"
  },
  {
    tag: [b.literal, b.inserted],
    color: "#164"
  },
  {
    tag: [b.string, b.deleted],
    color: "#a11"
  },
  {
    tag: [b.regexp, b.escape, /* @__PURE__ */ b.special(b.string)],
    color: "#e40"
  },
  {
    tag: /* @__PURE__ */ b.definition(b.variableName),
    color: "#00f"
  },
  {
    tag: /* @__PURE__ */ b.local(b.variableName),
    color: "#30a"
  },
  {
    tag: [b.typeName, b.namespace],
    color: "#085"
  },
  {
    tag: b.className,
    color: "#167"
  },
  {
    tag: [/* @__PURE__ */ b.special(b.variableName), b.macroName],
    color: "#256"
  },
  {
    tag: /* @__PURE__ */ b.definition(b.propertyName),
    color: "#00c"
  },
  {
    tag: b.comment,
    color: "#940"
  },
  {
    tag: b.invalid,
    color: "#f00"
  }
]), o0 = 1e4, l0 = "()[]{}", a0 = /* @__PURE__ */ new V();
function So(n, e, t) {
  let i = n.prop(e < 0 ? V.openedBy : V.closedBy);
  if (i)
    return i;
  if (n.name.length == 1) {
    let s = t.indexOf(n.name);
    if (s > -1 && s % 2 == (e < 0 ? 1 : 0))
      return [t[s + e]];
  }
  return null;
}
function _o(n) {
  let e = n.type.prop(a0);
  return e ? e(n.node) : n;
}
function mi(n, e, t, i = {}) {
  let s = i.maxScanDistance || o0, r = i.brackets || l0, o = ue(n), l = o.resolveInner(e, t);
  for (let a = l; a; a = a.parent) {
    let h = So(a.type, t, r);
    if (h && a.from < a.to) {
      let f = _o(a);
      if (f && (t > 0 ? e >= f.from && e < f.to : e > f.from && e <= f.to))
        return h0(n, e, t, a, f, h, r);
    }
  }
  return f0(n, e, t, o, l.type, s, r);
}
function h0(n, e, t, i, s, r, o) {
  let l = i.parent, a = { from: s.from, to: s.to }, h = 0, f = l == null ? void 0 : l.cursor();
  if (f && (t < 0 ? f.childBefore(i.from) : f.childAfter(i.to)))
    do
      if (t < 0 ? f.to <= i.from : f.from >= i.to) {
        if (h == 0 && r.indexOf(f.type.name) > -1 && f.from < f.to) {
          let c = _o(f);
          return { start: a, end: c ? { from: c.from, to: c.to } : void 0, matched: !0 };
        } else if (So(f.type, t, o))
          h++;
        else if (So(f.type, -t, o)) {
          if (h == 0) {
            let c = _o(f);
            return {
              start: a,
              end: c && c.from < c.to ? { from: c.from, to: c.to } : void 0,
              matched: !1
            };
          }
          h--;
        }
      }
    while (t < 0 ? f.prevSibling() : f.nextSibling());
  return { start: a, matched: !1 };
}
function f0(n, e, t, i, s, r, o) {
  let l = t < 0 ? n.sliceDoc(e - 1, e) : n.sliceDoc(e, e + 1), a = o.indexOf(l);
  if (a < 0 || a % 2 == 0 != t > 0)
    return null;
  let h = { from: t < 0 ? e - 1 : e, to: t > 0 ? e + 1 : e }, f = n.doc.iterRange(e, t > 0 ? n.doc.length : 0), c = 0;
  for (let u = 0; !f.next().done && u <= r; ) {
    let d = f.value;
    t < 0 && (u += d.length);
    let p = e + u * t;
    for (let m = t > 0 ? 0 : d.length - 1, g = t > 0 ? d.length : -1; m != g; m += t) {
      let y = o.indexOf(d[m]);
      if (!(y < 0 || i.resolveInner(p + m, 1).type != s))
        if (y % 2 == 0 == t > 0)
          c++;
        else {
          if (c == 1)
            return { start: h, end: { from: p + m, to: p + m + 1 }, matched: y >> 1 == a >> 1 };
          c--;
        }
    }
    t > 0 && (u += d.length);
  }
  return f.done ? { start: h, matched: !1 } : null;
}
function Ia(n, e, t, i = 0, s = 0) {
  e == null && (e = n.search(/[^\s\u00a0]/), e == -1 && (e = n.length));
  let r = s;
  for (let o = i; o < e; o++)
    n.charCodeAt(o) == 9 ? r += t - r % t : r++;
  return r;
}
class Uc {
  /**
  Create a stream.
  */
  constructor(e, t, i, s) {
    this.string = e, this.tabSize = t, this.indentUnit = i, this.overrideIndent = s, this.pos = 0, this.start = 0, this.lastColumnPos = 0, this.lastColumnValue = 0;
  }
  /**
  True if we are at the end of the line.
  */
  eol() {
    return this.pos >= this.string.length;
  }
  /**
  True if we are at the start of the line.
  */
  sol() {
    return this.pos == 0;
  }
  /**
  Get the next code unit after the current position, or undefined
  if we're at the end of the line.
  */
  peek() {
    return this.string.charAt(this.pos) || void 0;
  }
  /**
  Read the next code unit and advance `this.pos`.
  */
  next() {
    if (this.pos < this.string.length)
      return this.string.charAt(this.pos++);
  }
  /**
  Match the next character against the given string, regular
  expression, or predicate. Consume and return it if it matches.
  */
  eat(e) {
    let t = this.string.charAt(this.pos), i;
    if (typeof e == "string" ? i = t == e : i = t && (e instanceof RegExp ? e.test(t) : e(t)), i)
      return ++this.pos, t;
  }
  /**
  Continue matching characters that match the given string,
  regular expression, or predicate function. Return true if any
  characters were consumed.
  */
  eatWhile(e) {
    let t = this.pos;
    for (; this.eat(e); )
      ;
    return this.pos > t;
  }
  /**
  Consume whitespace ahead of `this.pos`. Return true if any was
  found.
  */
  eatSpace() {
    let e = this.pos;
    for (; /[\s\u00a0]/.test(this.string.charAt(this.pos)); )
      ++this.pos;
    return this.pos > e;
  }
  /**
  Move to the end of the line.
  */
  skipToEnd() {
    this.pos = this.string.length;
  }
  /**
  Move to directly before the given character, if found on the
  current line.
  */
  skipTo(e) {
    let t = this.string.indexOf(e, this.pos);
    if (t > -1)
      return this.pos = t, !0;
  }
  /**
  Move back `n` characters.
  */
  backUp(e) {
    this.pos -= e;
  }
  /**
  Get the column position at `this.pos`.
  */
  column() {
    return this.lastColumnPos < this.start && (this.lastColumnValue = Ia(this.string, this.start, this.tabSize, this.lastColumnPos, this.lastColumnValue), this.lastColumnPos = this.start), this.lastColumnValue;
  }
  /**
  Get the indentation column of the current line.
  */
  indentation() {
    var e;
    return (e = this.overrideIndent) !== null && e !== void 0 ? e : Ia(this.string, null, this.tabSize);
  }
  /**
  Match the input against the given string or regular expression
  (which should start with a `^`). Return true or the regexp match
  if it matches.
  
  Unless `consume` is set to `false`, this will move `this.pos`
  past the matched text.
  
  When matching a string `caseInsensitive` can be set to true to
  make the match case-insensitive.
  */
  match(e, t, i) {
    if (typeof e == "string") {
      let s = (o) => i ? o.toLowerCase() : o, r = this.string.substr(this.pos, e.length);
      return s(r) == s(e) ? (t !== !1 && (this.pos += e.length), !0) : null;
    } else {
      let s = this.string.slice(this.pos).match(e);
      return s && s.index > 0 ? null : (s && t !== !1 && (this.pos += s[0].length), s);
    }
  }
  /**
  Get the current token.
  */
  current() {
    return this.string.slice(this.start, this.pos);
  }
}
function c0(n) {
  return {
    name: n.name || "",
    token: n.token,
    blankLine: n.blankLine || (() => {
    }),
    startState: n.startState || (() => !0),
    copyState: n.copyState || u0,
    indent: n.indent || (() => null),
    languageData: n.languageData || {},
    tokenTable: n.tokenTable || el
  };
}
function u0(n) {
  if (typeof n != "object")
    return n;
  let e = {};
  for (let t in n) {
    let i = n[t];
    e[t] = i instanceof Array ? i.slice() : i;
  }
  return e;
}
const Na = /* @__PURE__ */ new WeakMap();
class gi extends Ie {
  constructor(e) {
    let t = Lc(e.languageData), i = c0(e), s, r = new class extends Oc {
      createParse(o, l, a) {
        return new p0(s, o, l, a);
      }
    }();
    super(t, r, [Ic.of((o, l) => this.getIndent(o, l))], e.name), this.topNode = b0(t), s = this, this.streamParser = i, this.stateAfter = new V({ perNode: !0 }), this.tokenTable = e.tokenTable ? new Xc(i.tokenTable) : g0;
  }
  /**
  Define a stream language.
  */
  static define(e) {
    return new gi(e);
  }
  getIndent(e, t) {
    let i = ue(e.state), s = i.resolve(t);
    for (; s && s.type != this.topNode; )
      s = s.parent;
    if (!s)
      return null;
    let r, { overrideIndentation: o } = e.options;
    o && (r = Na.get(e.state), r != null && r < t - 1e4 && (r = void 0));
    let l = $o(this, i, 0, s.from, r ?? t), a, h;
    if (l ? (h = l.state, a = l.pos + 1) : (h = this.streamParser.startState(e.unit), a = 0), t - a > 1e4)
      return null;
    for (; a < t; ) {
      let c = e.state.doc.lineAt(a), u = Math.min(t, c.to);
      if (c.length) {
        let d = o ? o(c.from) : -1, p = new Uc(c.text, e.state.tabSize, e.unit, d < 0 ? void 0 : d);
        for (; p.pos < u - c.from; )
          Yc(this.streamParser.token, p, h);
      } else
        this.streamParser.blankLine(h, e.unit);
      if (u == t)
        break;
      a = c.to + 1;
    }
    let f = e.lineAt(t);
    return o && r == null && Na.set(e.state, f.from), this.streamParser.indent(h, /^\s*(.*)/.exec(f.text)[1], e);
  }
  get allowsNesting() {
    return !1;
  }
}
function $o(n, e, t, i, s) {
  let r = t >= i && t + e.length <= s && e.prop(n.stateAfter);
  if (r)
    return { state: n.streamParser.copyState(r), pos: t + e.length };
  for (let o = e.children.length - 1; o >= 0; o--) {
    let l = e.children[o], a = t + e.positions[o], h = l instanceof Z && a < s && $o(n, l, a, i, s);
    if (h)
      return h;
  }
  return null;
}
function Gc(n, e, t, i, s) {
  if (s && t <= 0 && i >= e.length)
    return e;
  !s && e.type == n.topNode && (s = !0);
  for (let r = e.children.length - 1; r >= 0; r--) {
    let o = e.positions[r], l = e.children[r], a;
    if (o < i && l instanceof Z) {
      if (!(a = Gc(n, l, t - o, i - o, s)))
        break;
      return s ? new Z(e.type, e.children.slice(0, r).concat(a), e.positions.slice(0, r + 1), o + a.length) : a;
    }
  }
  return null;
}
function d0(n, e, t, i) {
  for (let s of e) {
    let r = s.from + (s.openStart ? 25 : 0), o = s.to - (s.openEnd ? 25 : 0), l = r <= t && o > t && $o(n, s.tree, 0 - s.offset, t, o), a;
    if (l && (a = Gc(n, s.tree, t + s.offset, l.pos + s.offset, !1)))
      return { state: l.state, tree: a };
  }
  return { state: n.streamParser.startState(i ? ti(i) : 4), tree: Z.empty };
}
class p0 {
  constructor(e, t, i, s) {
    this.lang = e, this.input = t, this.fragments = i, this.ranges = s, this.stoppedAt = null, this.chunks = [], this.chunkPos = [], this.chunk = [], this.chunkReused = void 0, this.rangeIndex = 0, this.to = s[s.length - 1].to;
    let r = Di.get(), o = s[0].from, { state: l, tree: a } = d0(e, i, o, r == null ? void 0 : r.state);
    this.state = l, this.parsedPos = this.chunkStart = o + a.length;
    for (let h = 0; h < a.children.length; h++)
      this.chunks.push(a.children[h]), this.chunkPos.push(a.positions[h]);
    r && this.parsedPos < r.viewport.from - 1e5 && (this.state = this.lang.streamParser.startState(ti(r.state)), r.skipUntilInView(this.parsedPos, r.viewport.from), this.parsedPos = r.viewport.from), this.moveRangeIndex();
  }
  advance() {
    let e = Di.get(), t = this.stoppedAt == null ? this.to : Math.min(this.to, this.stoppedAt), i = Math.min(
      t,
      this.chunkStart + 2048
      /* C.ChunkSize */
    );
    for (e && (i = Math.min(i, e.viewport.to)); this.parsedPos < i; )
      this.parseLine(e);
    return this.chunkStart < this.parsedPos && this.finishChunk(), this.parsedPos >= t ? this.finish() : e && this.parsedPos >= e.viewport.to ? (e.skipUntilInView(this.parsedPos, t), this.finish()) : null;
  }
  stopAt(e) {
    this.stoppedAt = e;
  }
  lineAfter(e) {
    let t = this.input.chunk(e);
    if (this.input.lineChunks)
      t == `
` && (t = "");
    else {
      let i = t.indexOf(`
`);
      i > -1 && (t = t.slice(0, i));
    }
    return e + t.length <= this.to ? t : t.slice(0, this.to - e);
  }
  nextLine() {
    let e = this.parsedPos, t = this.lineAfter(e), i = e + t.length;
    for (let s = this.rangeIndex; ; ) {
      let r = this.ranges[s].to;
      if (r >= i || (t = t.slice(0, r - (i - t.length)), s++, s == this.ranges.length))
        break;
      let o = this.ranges[s].from, l = this.lineAfter(o);
      t += l, i = o + l.length;
    }
    return { line: t, end: i };
  }
  skipGapsTo(e, t, i) {
    for (; ; ) {
      let s = this.ranges[this.rangeIndex].to, r = e + t;
      if (i > 0 ? s > r : s >= r)
        break;
      let o = this.ranges[++this.rangeIndex].from;
      t += o - s;
    }
    return t;
  }
  moveRangeIndex() {
    for (; this.ranges[this.rangeIndex].to < this.parsedPos; )
      this.rangeIndex++;
  }
  emitToken(e, t, i, s, r) {
    if (this.ranges.length > 1) {
      r = this.skipGapsTo(t, r, 1), t += r;
      let o = this.chunk.length;
      r = this.skipGapsTo(i, r, -1), i += r, s += this.chunk.length - o;
    }
    return this.chunk.push(e, t, i, s), r;
  }
  parseLine(e) {
    let { line: t, end: i } = this.nextLine(), s = 0, { streamParser: r } = this.lang, o = new Uc(t, e ? e.state.tabSize : 4, e ? ti(e.state) : 2);
    if (o.eol())
      r.blankLine(this.state, o.indentUnit);
    else
      for (; !o.eol(); ) {
        let l = Yc(r.token, o, this.state);
        if (l && (s = this.emitToken(this.lang.tokenTable.resolve(l), this.parsedPos + o.start, this.parsedPos + o.pos, 4, s)), o.start > 1e4)
          break;
      }
    this.parsedPos = i, this.moveRangeIndex(), this.parsedPos < this.to && this.parsedPos++;
  }
  finishChunk() {
    let e = Z.build({
      buffer: this.chunk,
      start: this.chunkStart,
      length: this.parsedPos - this.chunkStart,
      nodeSet: m0,
      topID: 0,
      maxBufferLength: 2048,
      reused: this.chunkReused
    });
    e = new Z(e.type, e.children, e.positions, e.length, [[this.lang.stateAfter, this.lang.streamParser.copyState(this.state)]]), this.chunks.push(e), this.chunkPos.push(this.chunkStart - this.ranges[0].from), this.chunk = [], this.chunkReused = void 0, this.chunkStart = this.parsedPos;
  }
  finish() {
    return new Z(this.lang.topNode, this.chunks, this.chunkPos, this.parsedPos - this.ranges[0].from).balance();
  }
}
function Yc(n, e, t) {
  e.start = e.pos;
  for (let i = 0; i < 10; i++) {
    let s = n(e, t);
    if (e.pos > e.start)
      return s;
  }
  throw new Error("Stream parser failed to advance stream.");
}
const el = /* @__PURE__ */ Object.create(null), yn = [Ce.none], m0 = /* @__PURE__ */ new Ko(yn), Fa = [], Ha = /* @__PURE__ */ Object.create(null), Jc = /* @__PURE__ */ Object.create(null);
for (let [n, e] of [
  ["variable", "variableName"],
  ["variable-2", "variableName.special"],
  ["string-2", "string.special"],
  ["def", "variableName.definition"],
  ["tag", "tagName"],
  ["attribute", "attributeName"],
  ["type", "typeName"],
  ["builtin", "variableName.standard"],
  ["qualifier", "modifier"],
  ["error", "invalid"],
  ["header", "heading"],
  ["property", "propertyName"]
])
  Jc[n] = /* @__PURE__ */ Zc(el, e);
class Xc {
  constructor(e) {
    this.extra = e, this.table = Object.assign(/* @__PURE__ */ Object.create(null), Jc);
  }
  resolve(e) {
    return e ? this.table[e] || (this.table[e] = Zc(this.extra, e)) : 0;
  }
}
const g0 = /* @__PURE__ */ new Xc(el);
function pr(n, e) {
  Fa.indexOf(n) > -1 || (Fa.push(n), console.warn(e));
}
function Zc(n, e) {
  let t = [];
  for (let l of e.split(" ")) {
    let a = [];
    for (let h of l.split(".")) {
      let f = n[h] || b[h];
      f ? typeof f == "function" ? a.length ? a = a.map(f) : pr(h, `Modifier ${h} used at start of tag`) : a.length ? pr(h, `Tag ${h} used as modifier`) : a = Array.isArray(f) ? f : [f] : pr(h, `Unknown highlighting tag ${h}`);
    }
    for (let h of a)
      t.push(h);
  }
  if (!t.length)
    return 0;
  let i = e.replace(/ /g, "_"), s = i + " " + t.map((l) => l.id), r = Ha[s];
  if (r)
    return r.id;
  let o = Ha[s] = Ce.define({
    id: yn.length,
    name: i,
    props: [Cg({ [i]: t })]
  });
  return yn.push(o), o.id;
}
function b0(n) {
  let e = Ce.define({ id: yn.length, name: "Document", props: [Gt.add(() => n)], top: !0 });
  return yn.push(e), e;
}
te.RTL, te.LTR;
const y0 = (n) => {
  let { state: e } = n, t = e.doc.lineAt(e.selection.main.from), i = il(n.state, t.from);
  return i.line ? w0(n) : i.block ? v0(n) : !1;
};
function tl(n, e) {
  return ({ state: t, dispatch: i }) => {
    if (t.readOnly)
      return !1;
    let s = n(e, t);
    return s ? (i(t.update(s)), !0) : !1;
  };
}
const w0 = /* @__PURE__ */ tl(
  _0,
  0
  /* CommentOption.Toggle */
), k0 = /* @__PURE__ */ tl(
  Qc,
  0
  /* CommentOption.Toggle */
), v0 = /* @__PURE__ */ tl(
  (n, e) => Qc(n, e, S0(e)),
  0
  /* CommentOption.Toggle */
);
function il(n, e) {
  let t = n.languageDataAt("commentTokens", e);
  return t.length ? t[0] : {};
}
const Ki = 50;
function x0(n, { open: e, close: t }, i, s) {
  let r = n.sliceDoc(i - Ki, i), o = n.sliceDoc(s, s + Ki), l = /\s*$/.exec(r)[0].length, a = /^\s*/.exec(o)[0].length, h = r.length - l;
  if (r.slice(h - e.length, h) == e && o.slice(a, a + t.length) == t)
    return {
      open: { pos: i - l, margin: l && 1 },
      close: { pos: s + a, margin: a && 1 }
    };
  let f, c;
  s - i <= 2 * Ki ? f = c = n.sliceDoc(i, s) : (f = n.sliceDoc(i, i + Ki), c = n.sliceDoc(s - Ki, s));
  let u = /^\s*/.exec(f)[0].length, d = /\s*$/.exec(c)[0].length, p = c.length - d - t.length;
  return f.slice(u, u + e.length) == e && c.slice(p, p + t.length) == t ? {
    open: {
      pos: i + u + e.length,
      margin: /\s/.test(f.charAt(u + e.length)) ? 1 : 0
    },
    close: {
      pos: s - d - t.length,
      margin: /\s/.test(c.charAt(p - 1)) ? 1 : 0
    }
  } : null;
}
function S0(n) {
  let e = [];
  for (let t of n.selection.ranges) {
    let i = n.doc.lineAt(t.from), s = t.to <= i.to ? i : n.doc.lineAt(t.to), r = e.length - 1;
    r >= 0 && e[r].to > i.from ? e[r].to = s.to : e.push({ from: i.from + /^\s*/.exec(i.text)[0].length, to: s.to });
  }
  return e;
}
function Qc(n, e, t = e.selection.ranges) {
  let i = t.map((r) => il(e, r.from).block);
  if (!i.every((r) => r))
    return null;
  let s = t.map((r, o) => x0(e, i[o], r.from, r.to));
  if (n != 2 && !s.every((r) => r))
    return { changes: e.changes(t.map((r, o) => s[o] ? [] : [{ from: r.from, insert: i[o].open + " " }, { from: r.to, insert: " " + i[o].close }])) };
  if (n != 1 && s.some((r) => r)) {
    let r = [];
    for (let o = 0, l; o < s.length; o++)
      if (l = s[o]) {
        let a = i[o], { open: h, close: f } = l;
        r.push({ from: h.pos - a.open.length, to: h.pos + h.margin }, { from: f.pos - f.margin, to: f.pos + a.close.length });
      }
    return { changes: r };
  }
  return null;
}
function _0(n, e, t = e.selection.ranges) {
  let i = [], s = -1;
  for (let { from: r, to: o } of t) {
    let l = i.length, a = 1e9, h = il(e, r).line;
    if (h) {
      for (let f = r; f <= o; ) {
        let c = e.doc.lineAt(f);
        if (c.from > s && (r == o || o > c.from)) {
          s = c.from;
          let u = /^\s*/.exec(c.text)[0].length, d = u == c.length, p = c.text.slice(u, u + h.length) == h ? u : -1;
          u < c.text.length && u < a && (a = u), i.push({ line: c, comment: p, token: h, indent: u, empty: d, single: !1 });
        }
        f = c.to + 1;
      }
      if (a < 1e9)
        for (let f = l; f < i.length; f++)
          i[f].indent < i[f].line.text.length && (i[f].indent = a);
      i.length == l + 1 && (i[l].single = !0);
    }
  }
  if (n != 2 && i.some((r) => r.comment < 0 && (!r.empty || r.single))) {
    let r = [];
    for (let { line: l, token: a, indent: h, empty: f, single: c } of i)
      (c || !f) && r.push({ from: l.from + h, insert: a + " " });
    let o = e.changes(r);
    return { changes: o, selection: e.selection.map(o, 1) };
  } else if (n != 1 && i.some((r) => r.comment >= 0)) {
    let r = [];
    for (let { line: o, comment: l, token: a } of i)
      if (l >= 0) {
        let h = o.from + l, f = h + a.length;
        o.text[f - o.from] == " " && f++, r.push({ from: h, to: f });
      }
    return { changes: r };
  }
  return null;
}
const Co = /* @__PURE__ */ vt.define(), C0 = /* @__PURE__ */ vt.define(), A0 = /* @__PURE__ */ O.define(), $c = /* @__PURE__ */ O.define({
  combine(n) {
    return ai(n, {
      minDepth: 100,
      newGroupDelay: 500,
      joinToEvent: (e, t) => t
    }, {
      minDepth: Math.max,
      newGroupDelay: Math.min,
      joinToEvent: (e, t) => (i, s) => e(i, s) || t(i, s)
    });
  }
}), eu = /* @__PURE__ */ Me.define({
  create() {
    return ot.empty;
  },
  update(n, e) {
    let t = e.state.facet($c), i = e.annotation(Co);
    if (i) {
      let a = Ae.fromTransaction(e, i.selection), h = i.side, f = h == 0 ? n.undone : n.done;
      return a ? f = Cs(f, f.length, t.minDepth, a) : f = nu(f, e.startState.selection), new ot(h == 0 ? i.rest : f, h == 0 ? f : i.rest);
    }
    let s = e.annotation(C0);
    if ((s == "full" || s == "before") && (n = n.isolate()), e.annotation(le.addToHistory) === !1)
      return e.changes.empty ? n : n.addMapping(e.changes.desc);
    let r = Ae.fromTransaction(e), o = e.annotation(le.time), l = e.annotation(le.userEvent);
    return r ? n = n.addChanges(r, o, l, t, e) : e.selection && (n = n.addSelection(e.startState.selection, o, l, t.newGroupDelay)), (s == "full" || s == "after") && (n = n.isolate()), n;
  },
  toJSON(n) {
    return { done: n.done.map((e) => e.toJSON()), undone: n.undone.map((e) => e.toJSON()) };
  },
  fromJSON(n) {
    return new ot(n.done.map(Ae.fromJSON), n.undone.map(Ae.fromJSON));
  }
});
function M0(n = {}) {
  return [
    eu,
    $c.of(n),
    B.domEventHandlers({
      beforeinput(e, t) {
        let i = e.inputType == "historyUndo" ? tu : e.inputType == "historyRedo" ? Ao : null;
        return i ? (e.preventDefault(), i(t)) : !1;
      }
    })
  ];
}
function zs(n, e) {
  return function({ state: t, dispatch: i }) {
    if (!e && t.readOnly)
      return !1;
    let s = t.field(eu, !1);
    if (!s)
      return !1;
    let r = s.pop(n, t, e);
    return r ? (i(r), !0) : !1;
  };
}
const tu = /* @__PURE__ */ zs(0, !1), Ao = /* @__PURE__ */ zs(1, !1), T0 = /* @__PURE__ */ zs(0, !0), D0 = /* @__PURE__ */ zs(1, !0);
class Ae {
  constructor(e, t, i, s, r) {
    this.changes = e, this.effects = t, this.mapped = i, this.startSelection = s, this.selectionsAfter = r;
  }
  setSelAfter(e) {
    return new Ae(this.changes, this.effects, this.mapped, this.startSelection, e);
  }
  toJSON() {
    var e, t, i;
    return {
      changes: (e = this.changes) === null || e === void 0 ? void 0 : e.toJSON(),
      mapped: (t = this.mapped) === null || t === void 0 ? void 0 : t.toJSON(),
      startSelection: (i = this.startSelection) === null || i === void 0 ? void 0 : i.toJSON(),
      selectionsAfter: this.selectionsAfter.map((s) => s.toJSON())
    };
  }
  static fromJSON(e) {
    return new Ae(e.changes && fe.fromJSON(e.changes), [], e.mapped && ht.fromJSON(e.mapped), e.startSelection && C.fromJSON(e.startSelection), e.selectionsAfter.map(C.fromJSON));
  }
  // This does not check `addToHistory` and such, it assumes the
  // transaction needs to be converted to an item. Returns null when
  // there are no changes or effects in the transaction.
  static fromTransaction(e, t) {
    let i = Ne;
    for (let s of e.startState.facet(A0)) {
      let r = s(e);
      r.length && (i = i.concat(r));
    }
    return !i.length && e.changes.empty ? null : new Ae(e.changes.invert(e.startState.doc), i, void 0, t || e.startState.selection, Ne);
  }
  static selection(e) {
    return new Ae(void 0, Ne, void 0, void 0, e);
  }
}
function Cs(n, e, t, i) {
  let s = e + 1 > t + 20 ? e - t - 1 : 0, r = n.slice(s, e);
  return r.push(i), r;
}
function O0(n, e) {
  let t = [], i = !1;
  return n.iterChangedRanges((s, r) => t.push(s, r)), e.iterChangedRanges((s, r, o, l) => {
    for (let a = 0; a < t.length; ) {
      let h = t[a++], f = t[a++];
      l >= h && o <= f && (i = !0);
    }
  }), i;
}
function B0(n, e) {
  return n.ranges.length == e.ranges.length && n.ranges.filter((t, i) => t.empty != e.ranges[i].empty).length === 0;
}
function iu(n, e) {
  return n.length ? e.length ? n.concat(e) : n : e;
}
const Ne = [], P0 = 200;
function nu(n, e) {
  if (n.length) {
    let t = n[n.length - 1], i = t.selectionsAfter.slice(Math.max(0, t.selectionsAfter.length - P0));
    return i.length && i[i.length - 1].eq(e) ? n : (i.push(e), Cs(n, n.length - 1, 1e9, t.setSelAfter(i)));
  } else
    return [Ae.selection([e])];
}
function L0(n) {
  let e = n[n.length - 1], t = n.slice();
  return t[n.length - 1] = e.setSelAfter(e.selectionsAfter.slice(0, e.selectionsAfter.length - 1)), t;
}
function mr(n, e) {
  if (!n.length)
    return n;
  let t = n.length, i = Ne;
  for (; t; ) {
    let s = E0(n[t - 1], e, i);
    if (s.changes && !s.changes.empty || s.effects.length) {
      let r = n.slice(0, t);
      return r[t - 1] = s, r;
    } else
      e = s.mapped, t--, i = s.selectionsAfter;
  }
  return i.length ? [Ae.selection(i)] : Ne;
}
function E0(n, e, t) {
  let i = iu(n.selectionsAfter.length ? n.selectionsAfter.map((l) => l.map(e)) : Ne, t);
  if (!n.changes)
    return Ae.selection(i);
  let s = n.changes.map(e), r = e.mapDesc(n.changes, !0), o = n.mapped ? n.mapped.composeDesc(r) : r;
  return new Ae(s, z.mapEffects(n.effects, e), o, n.startSelection.map(r), i);
}
const R0 = /^(input\.type|delete)($|\.)/;
class ot {
  constructor(e, t, i = 0, s = void 0) {
    this.done = e, this.undone = t, this.prevTime = i, this.prevUserEvent = s;
  }
  isolate() {
    return this.prevTime ? new ot(this.done, this.undone) : this;
  }
  addChanges(e, t, i, s, r) {
    let o = this.done, l = o[o.length - 1];
    return l && l.changes && !l.changes.empty && e.changes && (!i || R0.test(i)) && (!l.selectionsAfter.length && t - this.prevTime < s.newGroupDelay && s.joinToEvent(r, O0(l.changes, e.changes)) || // For compose (but not compose.start) events, always join with previous event
    i == "input.type.compose") ? o = Cs(o, o.length - 1, s.minDepth, new Ae(e.changes.compose(l.changes), iu(e.effects, l.effects), l.mapped, l.startSelection, Ne)) : o = Cs(o, o.length, s.minDepth, e), new ot(o, Ne, t, i);
  }
  addSelection(e, t, i, s) {
    let r = this.done.length ? this.done[this.done.length - 1].selectionsAfter : Ne;
    return r.length > 0 && t - this.prevTime < s && i == this.prevUserEvent && i && /^select($|\.)/.test(i) && B0(r[r.length - 1], e) ? this : new ot(nu(this.done, e), this.undone, t, i);
  }
  addMapping(e) {
    return new ot(mr(this.done, e), mr(this.undone, e), this.prevTime, this.prevUserEvent);
  }
  pop(e, t, i) {
    let s = e == 0 ? this.done : this.undone;
    if (s.length == 0)
      return null;
    let r = s[s.length - 1], o = r.selectionsAfter[0] || t.selection;
    if (i && r.selectionsAfter.length)
      return t.update({
        selection: r.selectionsAfter[r.selectionsAfter.length - 1],
        annotations: Co.of({ side: e, rest: L0(s), selection: o }),
        userEvent: e == 0 ? "select.undo" : "select.redo",
        scrollIntoView: !0
      });
    if (r.changes) {
      let l = s.length == 1 ? Ne : s.slice(0, s.length - 1);
      return r.mapped && (l = mr(l, r.mapped)), t.update({
        changes: r.changes,
        selection: r.startSelection,
        effects: r.effects,
        annotations: Co.of({ side: e, rest: l, selection: o }),
        filter: !1,
        userEvent: e == 0 ? "undo" : "redo",
        scrollIntoView: !0
      });
    } else
      return null;
  }
}
ot.empty = /* @__PURE__ */ new ot(Ne, Ne);
const I0 = [
  { key: "Mod-z", run: tu, preventDefault: !0 },
  { key: "Mod-y", mac: "Mod-Shift-z", run: Ao, preventDefault: !0 },
  { linux: "Ctrl-Shift-z", run: Ao, preventDefault: !0 },
  { key: "Mod-u", run: T0, preventDefault: !0 },
  { key: "Alt-u", mac: "Mod-Shift-u", run: D0, preventDefault: !0 }
];
function Ii(n, e) {
  return C.create(n.ranges.map(e), n.mainIndex);
}
function ut(n, e) {
  return n.update({ selection: e, scrollIntoView: !0, userEvent: "select" });
}
function Ge({ state: n, dispatch: e }, t) {
  let i = Ii(n.selection, t);
  return i.eq(n.selection, !0) ? !1 : (e(ut(n, i)), !0);
}
function qs(n, e) {
  return C.cursor(e ? n.to : n.from);
}
function su(n, e) {
  return Ge(n, (t) => t.empty ? n.moveByChar(t, e) : qs(t, e));
}
function ve(n) {
  return n.textDirectionAt(n.state.selection.main.head) == te.LTR;
}
const ru = (n) => su(n, !ve(n)), ou = (n) => su(n, ve(n));
function lu(n, e) {
  return Ge(n, (t) => t.empty ? n.moveByGroup(t, e) : qs(t, e));
}
const N0 = (n) => lu(n, !ve(n)), F0 = (n) => lu(n, ve(n));
function H0(n, e, t) {
  if (e.type.prop(t))
    return !0;
  let i = e.to - e.from;
  return i && (i > 2 || /[^\s,.;:]/.test(n.sliceDoc(e.from, e.to))) || e.firstChild;
}
function js(n, e, t) {
  let i = ue(n).resolveInner(e.head), s = t ? V.closedBy : V.openedBy;
  for (let a = e.head; ; ) {
    let h = t ? i.childAfter(a) : i.childBefore(a);
    if (!h)
      break;
    H0(n, h, s) ? i = h : a = t ? h.to : h.from;
  }
  let r = i.type.prop(s), o, l;
  return r && (o = t ? mi(n, i.from, 1) : mi(n, i.to, -1)) && o.matched ? l = t ? o.end.to : o.end.from : l = t ? i.to : i.from, C.cursor(l, t ? -1 : 1);
}
const V0 = (n) => Ge(n, (e) => js(n.state, e, !ve(n))), W0 = (n) => Ge(n, (e) => js(n.state, e, ve(n)));
function au(n, e) {
  return Ge(n, (t) => {
    if (!t.empty)
      return qs(t, e);
    let i = n.moveVertically(t, e);
    return i.head != t.head ? i : n.moveToLineBoundary(t, e);
  });
}
const hu = (n) => au(n, !1), fu = (n) => au(n, !0);
function cu(n) {
  let e = n.scrollDOM.clientHeight < n.scrollDOM.scrollHeight - 2, t = 0, i = 0, s;
  if (e) {
    for (let r of n.state.facet(B.scrollMargins)) {
      let o = r(n);
      o != null && o.top && (t = Math.max(o == null ? void 0 : o.top, t)), o != null && o.bottom && (i = Math.max(o == null ? void 0 : o.bottom, i));
    }
    s = n.scrollDOM.clientHeight - t - i;
  } else
    s = (n.dom.ownerDocument.defaultView || window).innerHeight;
  return {
    marginTop: t,
    marginBottom: i,
    selfScroll: e,
    height: Math.max(n.defaultLineHeight, s - 5)
  };
}
function uu(n, e) {
  let t = cu(n), { state: i } = n, s = Ii(i.selection, (o) => o.empty ? n.moveVertically(o, e, t.height) : qs(o, e));
  if (s.eq(i.selection))
    return !1;
  let r;
  if (t.selfScroll) {
    let o = n.coordsAtPos(i.selection.main.head), l = n.scrollDOM.getBoundingClientRect(), a = l.top + t.marginTop, h = l.bottom - t.marginBottom;
    o && o.top > a && o.bottom < h && (r = B.scrollIntoView(s.main.head, { y: "start", yMargin: o.top - a }));
  }
  return n.dispatch(ut(i, s), { effects: r }), !0;
}
const Va = (n) => uu(n, !1), Mo = (n) => uu(n, !0);
function Vt(n, e, t) {
  let i = n.lineBlockAt(e.head), s = n.moveToLineBoundary(e, t);
  if (s.head == e.head && s.head != (t ? i.to : i.from) && (s = n.moveToLineBoundary(e, t, !1)), !t && s.head == i.from && i.length) {
    let r = /^\s*/.exec(n.state.sliceDoc(i.from, Math.min(i.from + 100, i.to)))[0].length;
    r && e.head != i.from + r && (s = C.cursor(i.from + r));
  }
  return s;
}
const z0 = (n) => Ge(n, (e) => Vt(n, e, !0)), q0 = (n) => Ge(n, (e) => Vt(n, e, !1)), j0 = (n) => Ge(n, (e) => Vt(n, e, !ve(n))), K0 = (n) => Ge(n, (e) => Vt(n, e, ve(n))), U0 = (n) => Ge(n, (e) => C.cursor(n.lineBlockAt(e.head).from, 1)), G0 = (n) => Ge(n, (e) => C.cursor(n.lineBlockAt(e.head).to, -1));
function Y0(n, e, t) {
  let i = !1, s = Ii(n.selection, (r) => {
    let o = mi(n, r.head, -1) || mi(n, r.head, 1) || r.head > 0 && mi(n, r.head - 1, 1) || r.head < n.doc.length && mi(n, r.head + 1, -1);
    if (!o || !o.end)
      return r;
    i = !0;
    let l = o.start.from == r.head ? o.end.to : o.end.from;
    return t ? C.range(r.anchor, l) : C.cursor(l);
  });
  return i ? (e(ut(n, s)), !0) : !1;
}
const J0 = ({ state: n, dispatch: e }) => Y0(n, e, !1);
function Ve(n, e) {
  let t = Ii(n.state.selection, (i) => {
    let s = e(i);
    return C.range(i.anchor, s.head, s.goalColumn, s.bidiLevel || void 0);
  });
  return t.eq(n.state.selection) ? !1 : (n.dispatch(ut(n.state, t)), !0);
}
function du(n, e) {
  return Ve(n, (t) => n.moveByChar(t, e));
}
const pu = (n) => du(n, !ve(n)), mu = (n) => du(n, ve(n));
function gu(n, e) {
  return Ve(n, (t) => n.moveByGroup(t, e));
}
const X0 = (n) => gu(n, !ve(n)), Z0 = (n) => gu(n, ve(n)), Q0 = (n) => Ve(n, (e) => js(n.state, e, !ve(n))), $0 = (n) => Ve(n, (e) => js(n.state, e, ve(n)));
function bu(n, e) {
  return Ve(n, (t) => n.moveVertically(t, e));
}
const yu = (n) => bu(n, !1), wu = (n) => bu(n, !0);
function ku(n, e) {
  return Ve(n, (t) => n.moveVertically(t, e, cu(n).height));
}
const Wa = (n) => ku(n, !1), za = (n) => ku(n, !0), e1 = (n) => Ve(n, (e) => Vt(n, e, !0)), t1 = (n) => Ve(n, (e) => Vt(n, e, !1)), i1 = (n) => Ve(n, (e) => Vt(n, e, !ve(n))), n1 = (n) => Ve(n, (e) => Vt(n, e, ve(n))), s1 = (n) => Ve(n, (e) => C.cursor(n.lineBlockAt(e.head).from)), r1 = (n) => Ve(n, (e) => C.cursor(n.lineBlockAt(e.head).to)), qa = ({ state: n, dispatch: e }) => (e(ut(n, { anchor: 0 })), !0), ja = ({ state: n, dispatch: e }) => (e(ut(n, { anchor: n.doc.length })), !0), Ka = ({ state: n, dispatch: e }) => (e(ut(n, { anchor: n.selection.main.anchor, head: 0 })), !0), Ua = ({ state: n, dispatch: e }) => (e(ut(n, { anchor: n.selection.main.anchor, head: n.doc.length })), !0), o1 = ({ state: n, dispatch: e }) => (e(n.update({ selection: { anchor: 0, head: n.doc.length }, userEvent: "select" })), !0), l1 = ({ state: n, dispatch: e }) => {
  let t = Ks(n).map(({ from: i, to: s }) => C.range(i, Math.min(s + 1, n.doc.length)));
  return e(n.update({ selection: C.create(t), userEvent: "select" })), !0;
}, a1 = ({ state: n, dispatch: e }) => {
  let t = Ii(n.selection, (i) => {
    var s;
    let r = ue(n).resolveStack(i.from, 1);
    for (let o = r; o; o = o.next) {
      let { node: l } = o;
      if ((l.from < i.from && l.to >= i.to || l.to > i.to && l.from <= i.from) && (!((s = l.parent) === null || s === void 0) && s.parent))
        return C.range(l.to, l.from);
    }
    return i;
  });
  return e(ut(n, t)), !0;
}, h1 = ({ state: n, dispatch: e }) => {
  let t = n.selection, i = null;
  return t.ranges.length > 1 ? i = C.create([t.main]) : t.main.empty || (i = C.create([C.cursor(t.main.head)])), i ? (e(ut(n, i)), !0) : !1;
};
function An(n, e) {
  if (n.state.readOnly)
    return !1;
  let t = "delete.selection", { state: i } = n, s = i.changeByRange((r) => {
    let { from: o, to: l } = r;
    if (o == l) {
      let a = e(r);
      a < o ? (t = "delete.backward", a = Un(n, a, !1)) : a > o && (t = "delete.forward", a = Un(n, a, !0)), o = Math.min(o, a), l = Math.max(l, a);
    } else
      o = Un(n, o, !1), l = Un(n, l, !0);
    return o == l ? { range: r } : { changes: { from: o, to: l }, range: C.cursor(o, o < r.head ? -1 : 1) };
  });
  return s.changes.empty ? !1 : (n.dispatch(i.update(s, {
    scrollIntoView: !0,
    userEvent: t,
    effects: t == "delete.selection" ? B.announce.of(i.phrase("Selection deleted")) : void 0
  })), !0);
}
function Un(n, e, t) {
  if (n instanceof B)
    for (let i of n.state.facet(B.atomicRanges).map((s) => s(n)))
      i.between(e, e, (s, r) => {
        s < e && r > e && (e = t ? r : s);
      });
  return e;
}
const vu = (n, e) => An(n, (t) => {
  let i = t.from, { state: s } = n, r = s.doc.lineAt(i), o, l;
  if (!e && i > r.from && i < r.from + 200 && !/[^ \t]/.test(o = r.text.slice(0, i - r.from))) {
    if (o[o.length - 1] == "	")
      return i - 1;
    let a = Ei(o, s.tabSize), h = a % ti(s) || ti(s);
    for (let f = 0; f < h && o[o.length - 1 - f] == " "; f++)
      i--;
    l = i;
  } else
    l = xe(r.text, i - r.from, e, e) + r.from, l == i && r.number != (e ? s.doc.lines : 1) ? l += e ? 1 : -1 : !e && /[\ufe00-\ufe0f]/.test(r.text.slice(l - r.from, i - r.from)) && (l = xe(r.text, l - r.from, !1, !1) + r.from);
  return l;
}), To = (n) => vu(n, !1), xu = (n) => vu(n, !0), Su = (n, e) => An(n, (t) => {
  let i = t.head, { state: s } = n, r = s.doc.lineAt(i), o = s.charCategorizer(i);
  for (let l = null; ; ) {
    if (i == (e ? r.to : r.from)) {
      i == t.head && r.number != (e ? s.doc.lines : 1) && (i += e ? 1 : -1);
      break;
    }
    let a = xe(r.text, i - r.from, e) + r.from, h = r.text.slice(Math.min(i, a) - r.from, Math.max(i, a) - r.from), f = o(h);
    if (l != null && f != l)
      break;
    (h != " " || i != t.head) && (l = f), i = a;
  }
  return i;
}), _u = (n) => Su(n, !1), f1 = (n) => Su(n, !0), c1 = (n) => An(n, (e) => {
  let t = n.lineBlockAt(e.head).to;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), u1 = (n) => An(n, (e) => {
  let t = n.moveToLineBoundary(e, !1).head;
  return e.head > t ? t : Math.max(0, e.head - 1);
}), d1 = (n) => An(n, (e) => {
  let t = n.moveToLineBoundary(e, !0).head;
  return e.head < t ? t : Math.min(n.state.doc.length, e.head + 1);
}), p1 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => ({
    changes: { from: i.from, to: i.to, insert: J.of(["", ""]) },
    range: C.cursor(i.from)
  }));
  return e(n.update(t, { scrollIntoView: !0, userEvent: "input" })), !0;
}, m1 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = n.changeByRange((i) => {
    if (!i.empty || i.from == 0 || i.from == n.doc.length)
      return { range: i };
    let s = i.from, r = n.doc.lineAt(s), o = s == r.from ? s - 1 : xe(r.text, s - r.from, !1) + r.from, l = s == r.to ? s + 1 : xe(r.text, s - r.from, !0) + r.from;
    return {
      changes: { from: o, to: l, insert: n.doc.slice(s, l).append(n.doc.slice(o, s)) },
      range: C.cursor(l)
    };
  });
  return t.changes.empty ? !1 : (e(n.update(t, { scrollIntoView: !0, userEvent: "move.character" })), !0);
};
function Ks(n) {
  let e = [], t = -1;
  for (let i of n.selection.ranges) {
    let s = n.doc.lineAt(i.from), r = n.doc.lineAt(i.to);
    if (!i.empty && i.to == r.from && (r = n.doc.lineAt(i.to - 1)), t >= s.number) {
      let o = e[e.length - 1];
      o.to = r.to, o.ranges.push(i);
    } else
      e.push({ from: s.from, to: r.to, ranges: [i] });
    t = r.number + 1;
  }
  return e;
}
function Cu(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [], s = [];
  for (let r of Ks(n)) {
    if (t ? r.to == n.doc.length : r.from == 0)
      continue;
    let o = n.doc.lineAt(t ? r.to + 1 : r.from - 1), l = o.length + 1;
    if (t) {
      i.push({ from: r.to, to: o.to }, { from: r.from, insert: o.text + n.lineBreak });
      for (let a of r.ranges)
        s.push(C.range(Math.min(n.doc.length, a.anchor + l), Math.min(n.doc.length, a.head + l)));
    } else {
      i.push({ from: o.from, to: r.from }, { from: r.to, insert: n.lineBreak + o.text });
      for (let a of r.ranges)
        s.push(C.range(a.anchor - l, a.head - l));
    }
  }
  return i.length ? (e(n.update({
    changes: i,
    scrollIntoView: !0,
    selection: C.create(s, n.selection.mainIndex),
    userEvent: "move.line"
  })), !0) : !1;
}
const g1 = ({ state: n, dispatch: e }) => Cu(n, e, !1), b1 = ({ state: n, dispatch: e }) => Cu(n, e, !0);
function Au(n, e, t) {
  if (n.readOnly)
    return !1;
  let i = [];
  for (let s of Ks(n))
    t ? i.push({ from: s.from, insert: n.doc.slice(s.from, s.to) + n.lineBreak }) : i.push({ from: s.to, insert: n.lineBreak + n.doc.slice(s.from, s.to) });
  return e(n.update({ changes: i, scrollIntoView: !0, userEvent: "input.copyline" })), !0;
}
const y1 = ({ state: n, dispatch: e }) => Au(n, e, !1), w1 = ({ state: n, dispatch: e }) => Au(n, e, !0), k1 = (n) => {
  if (n.state.readOnly)
    return !1;
  let { state: e } = n, t = e.changes(Ks(e).map(({ from: s, to: r }) => (s > 0 ? s-- : r < e.doc.length && r++, { from: s, to: r }))), i = Ii(e.selection, (s) => n.moveVertically(s, !0)).map(t);
  return n.dispatch({ changes: t, selection: i, scrollIntoView: !0, userEvent: "delete.line" }), !0;
};
function v1(n, e) {
  if (/\(\)|\[\]|\{\}/.test(n.sliceDoc(e - 1, e + 1)))
    return { from: e, to: e };
  let t = ue(n).resolveInner(e), i = t.childBefore(e), s = t.childAfter(e), r;
  return i && s && i.to <= e && s.from >= e && (r = i.type.prop(V.closedBy)) && r.indexOf(s.name) > -1 && n.doc.lineAt(i.to).from == n.doc.lineAt(s.from).from && !/\S/.test(n.sliceDoc(i.to, s.from)) ? { from: i.to, to: s.from } : null;
}
const x1 = /* @__PURE__ */ Mu(!1), S1 = /* @__PURE__ */ Mu(!0);
function Mu(n) {
  return ({ state: e, dispatch: t }) => {
    if (e.readOnly)
      return !1;
    let i = e.changeByRange((s) => {
      let { from: r, to: o } = s, l = e.doc.lineAt(r), a = !n && r == o && v1(e, r);
      n && (r = o = (o <= l.to ? l : e.doc.lineAt(o)).to);
      let h = new Vs(e, { simulateBreak: r, simulateDoubleBreak: !!a }), f = Jo(h, r);
      for (f == null && (f = Ei(/^\s*/.exec(e.doc.lineAt(r).text)[0], e.tabSize)); o < l.to && /\s/.test(l.text[o - l.from]); )
        o++;
      a ? { from: r, to: o } = a : r > l.from && r < l.from + 100 && !/\S/.test(l.text.slice(0, r)) && (r = l.from);
      let c = ["", bn(e, f)];
      return a && c.push(bn(e, h.lineIndent(l.from, -1))), {
        changes: { from: r, to: o, insert: J.of(c) },
        range: C.cursor(r + 1 + c[1].length)
      };
    });
    return t(e.update(i, { scrollIntoView: !0, userEvent: "input" })), !0;
  };
}
function nl(n, e) {
  let t = -1;
  return n.changeByRange((i) => {
    let s = [];
    for (let o = i.from; o <= i.to; ) {
      let l = n.doc.lineAt(o);
      l.number > t && (i.empty || i.to > l.from) && (e(l, s, i), t = l.number), o = l.to + 1;
    }
    let r = n.changes(s);
    return {
      changes: s,
      range: C.range(r.mapPos(i.anchor, 1), r.mapPos(i.head, 1))
    };
  });
}
const _1 = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let t = /* @__PURE__ */ Object.create(null), i = new Vs(n, { overrideIndentation: (r) => {
    let o = t[r];
    return o ?? -1;
  } }), s = nl(n, (r, o, l) => {
    let a = Jo(i, r.from);
    if (a == null)
      return;
    /\S/.test(r.text) || (a = 0);
    let h = /^\s*/.exec(r.text)[0], f = bn(n, a);
    (h != f || l.from < r.from + h.length) && (t[r.from] = a, o.push({ from: r.from, to: r.from + h.length, insert: f }));
  });
  return s.changes.empty || e(n.update(s, { userEvent: "indent" })), !0;
}, Tu = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(nl(n, (t, i) => {
  i.push({ from: t.from, insert: n.facet(Hs) });
}), { userEvent: "input.indent" })), !0), Du = ({ state: n, dispatch: e }) => n.readOnly ? !1 : (e(n.update(nl(n, (t, i) => {
  let s = /^\s*/.exec(t.text)[0];
  if (!s)
    return;
  let r = Ei(s, n.tabSize), o = 0, l = bn(n, Math.max(0, r - ti(n)));
  for (; o < s.length && o < l.length && s.charCodeAt(o) == l.charCodeAt(o); )
    o++;
  i.push({ from: t.from + o, to: t.from + s.length, insert: l.slice(o) });
}), { userEvent: "delete.dedent" })), !0), C1 = [
  { key: "Ctrl-b", run: ru, shift: pu, preventDefault: !0 },
  { key: "Ctrl-f", run: ou, shift: mu },
  { key: "Ctrl-p", run: hu, shift: yu },
  { key: "Ctrl-n", run: fu, shift: wu },
  { key: "Ctrl-a", run: U0, shift: s1 },
  { key: "Ctrl-e", run: G0, shift: r1 },
  { key: "Ctrl-d", run: xu },
  { key: "Ctrl-h", run: To },
  { key: "Ctrl-k", run: c1 },
  { key: "Ctrl-Alt-h", run: _u },
  { key: "Ctrl-o", run: p1 },
  { key: "Ctrl-t", run: m1 },
  { key: "Ctrl-v", run: Mo }
], A1 = /* @__PURE__ */ [
  { key: "ArrowLeft", run: ru, shift: pu, preventDefault: !0 },
  { key: "Mod-ArrowLeft", mac: "Alt-ArrowLeft", run: N0, shift: X0, preventDefault: !0 },
  { mac: "Cmd-ArrowLeft", run: j0, shift: i1, preventDefault: !0 },
  { key: "ArrowRight", run: ou, shift: mu, preventDefault: !0 },
  { key: "Mod-ArrowRight", mac: "Alt-ArrowRight", run: F0, shift: Z0, preventDefault: !0 },
  { mac: "Cmd-ArrowRight", run: K0, shift: n1, preventDefault: !0 },
  { key: "ArrowUp", run: hu, shift: yu, preventDefault: !0 },
  { mac: "Cmd-ArrowUp", run: qa, shift: Ka },
  { mac: "Ctrl-ArrowUp", run: Va, shift: Wa },
  { key: "ArrowDown", run: fu, shift: wu, preventDefault: !0 },
  { mac: "Cmd-ArrowDown", run: ja, shift: Ua },
  { mac: "Ctrl-ArrowDown", run: Mo, shift: za },
  { key: "PageUp", run: Va, shift: Wa },
  { key: "PageDown", run: Mo, shift: za },
  { key: "Home", run: q0, shift: t1, preventDefault: !0 },
  { key: "Mod-Home", run: qa, shift: Ka },
  { key: "End", run: z0, shift: e1, preventDefault: !0 },
  { key: "Mod-End", run: ja, shift: Ua },
  { key: "Enter", run: x1 },
  { key: "Mod-a", run: o1 },
  { key: "Backspace", run: To, shift: To },
  { key: "Delete", run: xu },
  { key: "Mod-Backspace", mac: "Alt-Backspace", run: _u },
  { key: "Mod-Delete", mac: "Alt-Delete", run: f1 },
  { mac: "Mod-Backspace", run: u1 },
  { mac: "Mod-Delete", run: d1 }
].concat(/* @__PURE__ */ C1.map((n) => ({ mac: n.key, run: n.run, shift: n.shift }))), M1 = /* @__PURE__ */ [
  { key: "Alt-ArrowLeft", mac: "Ctrl-ArrowLeft", run: V0, shift: Q0 },
  { key: "Alt-ArrowRight", mac: "Ctrl-ArrowRight", run: W0, shift: $0 },
  { key: "Alt-ArrowUp", run: g1 },
  { key: "Shift-Alt-ArrowUp", run: y1 },
  { key: "Alt-ArrowDown", run: b1 },
  { key: "Shift-Alt-ArrowDown", run: w1 },
  { key: "Escape", run: h1 },
  { key: "Mod-Enter", run: S1 },
  { key: "Alt-l", mac: "Ctrl-l", run: l1 },
  { key: "Mod-i", run: a1, preventDefault: !0 },
  { key: "Mod-[", run: Du },
  { key: "Mod-]", run: Tu },
  { key: "Mod-Alt-\\", run: _1 },
  { key: "Shift-Mod-k", run: k1 },
  { key: "Shift-Mod-\\", run: J0 },
  { key: "Mod-/", run: y0 },
  { key: "Alt-A", run: k0 }
].concat(A1), T1 = { key: "Tab", run: Tu, shift: Du }, D1 = "#2E3235", $e = "#DDDDDD", on = "#B9D2FF", Gn = "#b0b0b0", O1 = "#e0e0e0", Ou = "#808080", gr = "#000000", B1 = "#A54543", Bu = "#fc6d24", zt = "#fda331", br = "#8abeb7", Ga = "#b5bd68", Ui = "#6fb3d2", Gi = "#cc99cc", P1 = "#6987AF", Ya = Bu, Ja = "#292d30", Yn = on + "30", L1 = D1, yr = $e, E1 = "#202325", Xa = $e, R1 = /* @__PURE__ */ B.theme({
  "&": {
    color: $e,
    backgroundColor: L1
  },
  ".cm-content": {
    caretColor: Xa
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: Xa },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: E1 },
  ".cm-panels": { backgroundColor: Ja, color: Gn },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
  ".cm-searchMatch": {
    backgroundColor: on,
    outline: `1px solid ${Gn}`,
    color: gr
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: O1,
    color: gr
  },
  ".cm-activeLine": { backgroundColor: Yn },
  ".cm-selectionMatch": { backgroundColor: Yn },
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    outline: `1px solid ${Gn}`
  },
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: on,
    color: gr
  },
  ".cm-gutters": {
    borderRight: "1px solid #ffffff10",
    color: Ou,
    backgroundColor: Ja
  },
  ".cm-activeLineGutter": {
    backgroundColor: Yn
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: on
  },
  ".cm-tooltip": {
    border: "none",
    backgroundColor: yr
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: yr,
    borderBottomColor: yr
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: Yn,
      color: Gn
    }
  }
}, { dark: !0 }), I1 = /* @__PURE__ */ Ri.define([
  { tag: b.keyword, color: zt },
  {
    tag: [b.name, b.deleted, b.character, b.propertyName, b.macroName],
    color: Ga
  },
  { tag: [b.variableName], color: Ui },
  { tag: [/* @__PURE__ */ b.function(b.variableName)], color: zt },
  { tag: [b.labelName], color: Bu },
  {
    tag: [b.color, /* @__PURE__ */ b.constant(b.name), /* @__PURE__ */ b.standard(b.name)],
    color: zt
  },
  { tag: [/* @__PURE__ */ b.definition(b.name), b.separator], color: Gi },
  { tag: [b.brace], color: Gi },
  {
    tag: [b.annotation],
    color: Ya
  },
  {
    tag: [b.number, b.changed, b.annotation, b.modifier, b.self, b.namespace],
    color: zt
  },
  {
    tag: [b.typeName, b.className],
    color: Ui
  },
  {
    tag: [b.operator, b.operatorKeyword],
    color: Gi
  },
  {
    tag: [b.tagName],
    color: zt
  },
  {
    tag: [b.squareBracket],
    color: Gi
  },
  {
    tag: [b.angleBracket],
    color: Gi
  },
  {
    tag: [b.attributeName],
    color: Ui
  },
  {
    tag: [b.regexp],
    color: zt
  },
  {
    tag: [b.quote],
    color: $e
  },
  { tag: [b.string], color: Ga },
  {
    tag: b.link,
    color: P1,
    textDecoration: "underline",
    textUnderlinePosition: "under"
  },
  {
    tag: [b.url, b.escape, /* @__PURE__ */ b.special(b.string)],
    color: br
  },
  { tag: [b.meta], color: B1 },
  { tag: [b.comment], color: Ou, fontStyle: "italic" },
  { tag: b.monospace, color: $e },
  { tag: b.strong, fontWeight: "bold", color: zt },
  { tag: b.emphasis, fontStyle: "italic", color: Ui },
  { tag: b.strikethrough, textDecoration: "line-through" },
  { tag: b.heading, fontWeight: "bold", color: $e },
  { tag: /* @__PURE__ */ b.special(b.heading1), fontWeight: "bold", color: $e },
  { tag: b.heading1, fontWeight: "bold", color: $e },
  {
    tag: [b.heading2, b.heading3, b.heading4],
    fontWeight: "bold",
    color: $e
  },
  {
    tag: [b.heading5, b.heading6],
    color: $e
  },
  { tag: [b.atom, b.bool, /* @__PURE__ */ b.special(b.variableName)], color: br },
  {
    tag: [b.processingInstruction, b.inserted],
    color: br
  },
  {
    tag: [b.contentSeparator],
    color: Ui
  },
  { tag: b.invalid, color: on, borderBottom: `1px dotted ${Ya}` }
]), N1 = [
  R1,
  /* @__PURE__ */ Qo(I1)
], Za = "#2e3440", sl = "#3b4252", Qa = "#434c5e", Jn = "#4c566a", $a = "#e5e9f0", Do = "#eceff4", wr = "#8fbcbb", eh = "#88c0d0", F1 = "#81a1c1", We = "#5e81ac", H1 = "#bf616a", fi = "#d08770", kr = "#ebcb8b", th = "#a3be8c", V1 = "#b48ead", ih = "#d30102", rl = Do, vr = rl, W1 = "#ffffff", xr = sl, z1 = rl, nh = sl, q1 = /* @__PURE__ */ B.theme({
  "&": {
    color: Za,
    backgroundColor: W1
  },
  ".cm-content": {
    caretColor: nh
  },
  ".cm-cursor, .cm-dropCursor": { borderLeftColor: nh },
  "&.cm-focused .cm-selectionBackground, .cm-selectionBackground, .cm-content ::selection": { backgroundColor: z1 },
  ".cm-panels": { backgroundColor: rl, color: Jn },
  ".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
  ".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },
  ".cm-searchMatch": {
    backgroundColor: "#72a1ff59",
    outline: `1px solid ${Jn}`
  },
  ".cm-searchMatch.cm-searchMatch-selected": {
    backgroundColor: $a
  },
  ".cm-activeLine": { backgroundColor: vr },
  ".cm-selectionMatch": { backgroundColor: $a },
  "&.cm-focused .cm-matchingBracket, &.cm-focused .cm-nonmatchingBracket": {
    outline: `1px solid ${Jn}`
  },
  "&.cm-focused .cm-matchingBracket": {
    backgroundColor: Do
  },
  ".cm-gutters": {
    backgroundColor: Do,
    color: Za,
    border: "none"
  },
  ".cm-activeLineGutter": {
    backgroundColor: vr
  },
  ".cm-foldPlaceholder": {
    backgroundColor: "transparent",
    border: "none",
    color: "#ddd"
  },
  ".cm-tooltip": {
    border: "none",
    backgroundColor: xr
  },
  ".cm-tooltip .cm-tooltip-arrow:before": {
    borderTopColor: "transparent",
    borderBottomColor: "transparent"
  },
  ".cm-tooltip .cm-tooltip-arrow:after": {
    borderTopColor: xr,
    borderBottomColor: xr
  },
  ".cm-tooltip-autocomplete": {
    "& > ul > li[aria-selected]": {
      backgroundColor: vr,
      color: Jn
    }
  }
}, { dark: !1 }), j1 = /* @__PURE__ */ Ri.define([
  { tag: b.keyword, color: We },
  {
    tag: [b.name, b.deleted, b.character, b.propertyName, b.macroName],
    color: fi
  },
  { tag: [b.variableName], color: fi },
  { tag: [/* @__PURE__ */ b.function(b.variableName)], color: We },
  { tag: [b.labelName], color: F1 },
  {
    tag: [b.color, /* @__PURE__ */ b.constant(b.name), /* @__PURE__ */ b.standard(b.name)],
    color: We
  },
  { tag: [/* @__PURE__ */ b.definition(b.name), b.separator], color: th },
  { tag: [b.brace], color: wr },
  {
    tag: [b.annotation],
    color: ih
  },
  {
    tag: [b.number, b.changed, b.annotation, b.modifier, b.self, b.namespace],
    color: eh
  },
  {
    tag: [b.typeName, b.className],
    color: kr
  },
  {
    tag: [b.operator, b.operatorKeyword],
    color: th
  },
  {
    tag: [b.tagName],
    color: V1
  },
  {
    tag: [b.squareBracket],
    color: H1
  },
  {
    tag: [b.angleBracket],
    color: fi
  },
  {
    tag: [b.attributeName],
    color: kr
  },
  {
    tag: [b.regexp],
    color: We
  },
  {
    tag: [b.quote],
    color: sl
  },
  { tag: [b.string], color: fi },
  {
    tag: b.link,
    color: wr,
    textDecoration: "underline",
    textUnderlinePosition: "under"
  },
  {
    tag: [b.url, b.escape, /* @__PURE__ */ b.special(b.string)],
    color: fi
  },
  { tag: [b.meta], color: eh },
  { tag: [b.comment], color: Qa, fontStyle: "italic" },
  { tag: b.strong, fontWeight: "bold", color: We },
  { tag: b.emphasis, fontStyle: "italic", color: We },
  { tag: b.strikethrough, textDecoration: "line-through" },
  { tag: b.heading, fontWeight: "bold", color: We },
  { tag: /* @__PURE__ */ b.special(b.heading1), fontWeight: "bold", color: We },
  { tag: b.heading1, fontWeight: "bold", color: We },
  {
    tag: [b.heading2, b.heading3, b.heading4],
    fontWeight: "bold",
    color: We
  },
  {
    tag: [b.heading5, b.heading6],
    color: We
  },
  { tag: [b.atom, b.bool, /* @__PURE__ */ b.special(b.variableName)], color: fi },
  {
    tag: [b.processingInstruction, b.inserted],
    color: wr
  },
  {
    tag: [b.contentSeparator],
    color: kr
  },
  { tag: b.invalid, color: Qa, borderBottom: `1px dotted ${ih}` }
]), K1 = [
  q1,
  /* @__PURE__ */ Qo(j1)
];
class U1 {
  /**
  Create a new completion context. (Mostly useful for testing
  completion sources—in the editor, the extension will create
  these for you.)
  */
  constructor(e, t, i) {
    this.state = e, this.pos = t, this.explicit = i, this.abortListeners = [];
  }
  /**
  Get the extent, content, and (if there is a token) type of the
  token before `this.pos`.
  */
  tokenBefore(e) {
    let t = ue(this.state).resolveInner(this.pos, -1);
    for (; t && e.indexOf(t.name) < 0; )
      t = t.parent;
    return t ? {
      from: t.from,
      to: this.pos,
      text: this.state.sliceDoc(t.from, this.pos),
      type: t.type
    } : null;
  }
  /**
  Get the match of the given expression directly before the
  cursor.
  */
  matchBefore(e) {
    let t = this.state.doc.lineAt(this.pos), i = Math.max(t.from, this.pos - 250), s = t.text.slice(i - t.from, this.pos - t.from), r = s.search(Pu(e, !1));
    return r < 0 ? null : { from: i + r, to: this.pos, text: s.slice(r) };
  }
  /**
  Yields true when the query has been aborted. Can be useful in
  asynchronous queries to avoid doing work that will be ignored.
  */
  get aborted() {
    return this.abortListeners == null;
  }
  /**
  Allows you to register abort handlers, which will be called when
  the query is
  [aborted](https://codemirror.net/6/docs/ref/#autocomplete.CompletionContext.aborted).
  */
  addEventListener(e, t) {
    e == "abort" && this.abortListeners && this.abortListeners.push(t);
  }
}
function sh(n) {
  let e = Object.keys(n).join(""), t = /\w/.test(e);
  return t && (e = e.replace(/\w/g, "")), `[${t ? "\\w" : ""}${e.replace(/[^\w\s]/g, "\\$&")}]`;
}
function G1(n) {
  let e = /* @__PURE__ */ Object.create(null), t = /* @__PURE__ */ Object.create(null);
  for (let { label: s } of n) {
    e[s[0]] = !0;
    for (let r = 1; r < s.length; r++)
      t[s[r]] = !0;
  }
  let i = sh(e) + sh(t) + "*$";
  return [new RegExp("^" + i), new RegExp(i)];
}
function Y1(n) {
  let e = n.map((s) => typeof s == "string" ? { label: s } : s), [t, i] = e.every((s) => /^\w+$/.test(s.label)) ? [/\w*$/, /\w+$/] : G1(e);
  return (s) => {
    let r = s.matchBefore(i);
    return r || s.explicit ? { from: r ? r.from : s.pos, options: e, validFor: t } : null;
  };
}
function gx(n, e) {
  return (t) => {
    for (let i = ue(t.state).resolveInner(t.pos, -1); i; i = i.parent) {
      if (n.indexOf(i.name) > -1)
        return null;
      if (i.type.isTop)
        break;
    }
    return e(t);
  };
}
class rh {
  constructor(e, t, i, s) {
    this.completion = e, this.source = t, this.match = i, this.score = s;
  }
}
function _i(n) {
  return n.selection.main.from;
}
function Pu(n, e) {
  var t;
  let { source: i } = n, s = e && i[0] != "^", r = i[i.length - 1] != "$";
  return !s && !r ? n : new RegExp(`${s ? "^" : ""}(?:${i})${r ? "$" : ""}`, (t = n.flags) !== null && t !== void 0 ? t : n.ignoreCase ? "i" : "");
}
const Lu = /* @__PURE__ */ vt.define();
function J1(n, e, t, i) {
  let { main: s } = n.selection, r = t - s.from, o = i - s.from;
  return Object.assign(Object.assign({}, n.changeByRange((l) => l != s && t != i && n.sliceDoc(l.from + r, l.from + o) != n.sliceDoc(t, i) ? { range: l } : {
    changes: { from: l.from + r, to: i == s.from ? l.to : l.from + o, insert: e },
    range: C.cursor(l.from + r + e.length)
  })), { scrollIntoView: !0, userEvent: "input.complete" });
}
const oh = /* @__PURE__ */ new WeakMap();
function X1(n) {
  if (!Array.isArray(n))
    return n;
  let e = oh.get(n);
  return e || oh.set(n, e = Y1(n)), e;
}
const Eu = /* @__PURE__ */ z.define(), ol = /* @__PURE__ */ z.define();
class Z1 {
  constructor(e) {
    this.pattern = e, this.chars = [], this.folded = [], this.any = [], this.precise = [], this.byWord = [], this.score = 0, this.matched = [];
    for (let t = 0; t < e.length; ) {
      let i = be(e, t), s = je(i);
      this.chars.push(i);
      let r = e.slice(t, t + s), o = r.toUpperCase();
      this.folded.push(be(o == r ? r.toLowerCase() : o, 0)), t += s;
    }
    this.astral = e.length != this.chars.length;
  }
  ret(e, t) {
    return this.score = e, this.matched = t, !0;
  }
  // Matches a given word (completion) against the pattern (input).
  // Will return a boolean indicating whether there was a match and,
  // on success, set `this.score` to the score, `this.matched` to an
  // array of `from, to` pairs indicating the matched parts of `word`.
  //
  // The score is a number that is more negative the worse the match
  // is. See `Penalty` above.
  match(e) {
    if (this.pattern.length == 0)
      return this.ret(-100, []);
    if (e.length < this.pattern.length)
      return !1;
    let { chars: t, folded: i, any: s, precise: r, byWord: o } = this;
    if (t.length == 1) {
      let k = be(e, 0), w = je(k), S = w == e.length ? 0 : -100;
      if (k != t[0])
        if (k == i[0])
          S += -200;
        else
          return !1;
      return this.ret(S, [0, w]);
    }
    let l = e.indexOf(this.pattern);
    if (l == 0)
      return this.ret(e.length == this.pattern.length ? 0 : -100, [0, this.pattern.length]);
    let a = t.length, h = 0;
    if (l < 0) {
      for (let k = 0, w = Math.min(e.length, 200); k < w && h < a; ) {
        let S = be(e, k);
        (S == t[h] || S == i[h]) && (s[h++] = k), k += je(S);
      }
      if (h < a)
        return !1;
    }
    let f = 0, c = 0, u = !1, d = 0, p = -1, m = -1, g = /[a-z]/.test(e), y = !0;
    for (let k = 0, w = Math.min(e.length, 200), S = 0; k < w && c < a; ) {
      let _ = be(e, k);
      l < 0 && (f < a && _ == t[f] && (r[f++] = k), d < a && (_ == t[d] || _ == i[d] ? (d == 0 && (p = k), m = k + 1, d++) : d = 0));
      let v, x = _ < 255 ? _ >= 48 && _ <= 57 || _ >= 97 && _ <= 122 ? 2 : _ >= 65 && _ <= 90 ? 1 : 0 : (v = cf(_)) != v.toLowerCase() ? 1 : v != v.toUpperCase() ? 2 : 0;
      (!k || x == 1 && g || S == 0 && x != 0) && (t[c] == _ || i[c] == _ && (u = !0) ? o[c++] = k : o.length && (y = !1)), S = x, k += je(_);
    }
    return c == a && o[0] == 0 && y ? this.result(-100 + (u ? -200 : 0), o, e) : d == a && p == 0 ? this.ret(-200 - e.length + (m == e.length ? 0 : -100), [0, m]) : l > -1 ? this.ret(-700 - e.length, [l, l + this.pattern.length]) : d == a ? this.ret(-200 + -700 - e.length, [p, m]) : c == a ? this.result(-100 + (u ? -200 : 0) + -700 + (y ? 0 : -1100), o, e) : t.length == 2 ? !1 : this.result((s[0] ? -700 : 0) + -200 + -1100, s, e);
  }
  result(e, t, i) {
    let s = [], r = 0;
    for (let o of t) {
      let l = o + (this.astral ? je(be(i, o)) : 1);
      r && s[r - 1] == o ? s[r - 1] = l : (s[r++] = o, s[r++] = l);
    }
    return this.ret(e - i.length, s);
  }
}
const nt = /* @__PURE__ */ O.define({
  combine(n) {
    return ai(n, {
      activateOnTyping: !0,
      activateOnTypingDelay: 100,
      selectOnOpen: !0,
      override: null,
      closeOnBlur: !0,
      maxRenderedOptions: 100,
      defaultKeymap: !0,
      tooltipClass: () => "",
      optionClass: () => "",
      aboveCursor: !1,
      icons: !0,
      addToOptions: [],
      positionInfo: Q1,
      compareCompletions: (e, t) => e.label.localeCompare(t.label),
      interactionDelay: 75,
      updateSyncTime: 100
    }, {
      defaultKeymap: (e, t) => e && t,
      closeOnBlur: (e, t) => e && t,
      icons: (e, t) => e && t,
      tooltipClass: (e, t) => (i) => lh(e(i), t(i)),
      optionClass: (e, t) => (i) => lh(e(i), t(i)),
      addToOptions: (e, t) => e.concat(t)
    });
  }
});
function lh(n, e) {
  return n ? e ? n + " " + e : n : e;
}
function Q1(n, e, t, i, s, r) {
  let o = n.textDirection == te.RTL, l = o, a = !1, h = "top", f, c, u = e.left - s.left, d = s.right - e.right, p = i.right - i.left, m = i.bottom - i.top;
  if (l && u < Math.min(p, d) ? l = !1 : !l && d < Math.min(p, u) && (l = !0), p <= (l ? u : d))
    f = Math.max(s.top, Math.min(t.top, s.bottom - m)) - e.top, c = Math.min(400, l ? u : d);
  else {
    a = !0, c = Math.min(
      400,
      (o ? e.right : s.right - e.left) - 30
      /* Info.Margin */
    );
    let k = s.bottom - e.bottom;
    k >= m || k > e.top ? f = t.bottom - e.top : (h = "bottom", f = e.bottom - t.top);
  }
  let g = (e.bottom - e.top) / r.offsetHeight, y = (e.right - e.left) / r.offsetWidth;
  return {
    style: `${h}: ${f / g}px; max-width: ${c / y}px`,
    class: "cm-completionInfo-" + (a ? o ? "left-narrow" : "right-narrow" : l ? "left" : "right")
  };
}
function $1(n) {
  let e = n.addToOptions.slice();
  return n.icons && e.push({
    render(t) {
      let i = document.createElement("div");
      return i.classList.add("cm-completionIcon"), t.type && i.classList.add(...t.type.split(/\s+/g).map((s) => "cm-completionIcon-" + s)), i.setAttribute("aria-hidden", "true"), i;
    },
    position: 20
  }), e.push({
    render(t, i, s, r) {
      let o = document.createElement("span");
      o.className = "cm-completionLabel";
      let l = t.displayLabel || t.label, a = 0;
      for (let h = 0; h < r.length; ) {
        let f = r[h++], c = r[h++];
        f > a && o.appendChild(document.createTextNode(l.slice(a, f)));
        let u = o.appendChild(document.createElement("span"));
        u.appendChild(document.createTextNode(l.slice(f, c))), u.className = "cm-completionMatchedText", a = c;
      }
      return a < l.length && o.appendChild(document.createTextNode(l.slice(a))), o;
    },
    position: 50
  }, {
    render(t) {
      if (!t.detail)
        return null;
      let i = document.createElement("span");
      return i.className = "cm-completionDetail", i.textContent = t.detail, i;
    },
    position: 80
  }), e.sort((t, i) => t.position - i.position).map((t) => t.render);
}
function Sr(n, e, t) {
  if (n <= t)
    return { from: 0, to: n };
  if (e < 0 && (e = 0), e <= n >> 1) {
    let s = Math.floor(e / t);
    return { from: s * t, to: (s + 1) * t };
  }
  let i = Math.floor((n - e) / t);
  return { from: n - (i + 1) * t, to: n - i * t };
}
class eb {
  constructor(e, t, i) {
    this.view = e, this.stateField = t, this.applyCompletion = i, this.info = null, this.infoDestroy = null, this.placeInfoReq = {
      read: () => this.measureInfo(),
      write: (a) => this.placeInfo(a),
      key: this
    }, this.space = null, this.currentClass = "";
    let s = e.state.field(t), { options: r, selected: o } = s.open, l = e.state.facet(nt);
    this.optionContent = $1(l), this.optionClass = l.optionClass, this.tooltipClass = l.tooltipClass, this.range = Sr(r.length, o, l.maxRenderedOptions), this.dom = document.createElement("div"), this.dom.className = "cm-tooltip-autocomplete", this.updateTooltipClass(e.state), this.dom.addEventListener("mousedown", (a) => {
      let { options: h } = e.state.field(t).open;
      for (let f = a.target, c; f && f != this.dom; f = f.parentNode)
        if (f.nodeName == "LI" && (c = /-(\d+)$/.exec(f.id)) && +c[1] < h.length) {
          this.applyCompletion(e, h[+c[1]]), a.preventDefault();
          return;
        }
    }), this.dom.addEventListener("focusout", (a) => {
      let h = e.state.field(this.stateField, !1);
      h && h.tooltip && e.state.facet(nt).closeOnBlur && a.relatedTarget != e.contentDOM && e.dispatch({ effects: ol.of(null) });
    }), this.showOptions(r, s.id);
  }
  mount() {
    this.updateSel();
  }
  showOptions(e, t) {
    this.list && this.list.remove(), this.list = this.dom.appendChild(this.createListBox(e, t, this.range)), this.list.addEventListener("scroll", () => {
      this.info && this.view.requestMeasure(this.placeInfoReq);
    });
  }
  update(e) {
    var t;
    let i = e.state.field(this.stateField), s = e.startState.field(this.stateField);
    if (this.updateTooltipClass(e.state), i != s) {
      let { options: r, selected: o, disabled: l } = i.open;
      (!s.open || s.open.options != r) && (this.range = Sr(r.length, o, e.state.facet(nt).maxRenderedOptions), this.showOptions(r, i.id)), this.updateSel(), l != ((t = s.open) === null || t === void 0 ? void 0 : t.disabled) && this.dom.classList.toggle("cm-tooltip-autocomplete-disabled", !!l);
    }
  }
  updateTooltipClass(e) {
    let t = this.tooltipClass(e);
    if (t != this.currentClass) {
      for (let i of this.currentClass.split(" "))
        i && this.dom.classList.remove(i);
      for (let i of t.split(" "))
        i && this.dom.classList.add(i);
      this.currentClass = t;
    }
  }
  positioned(e) {
    this.space = e, this.info && this.view.requestMeasure(this.placeInfoReq);
  }
  updateSel() {
    let e = this.view.state.field(this.stateField), t = e.open;
    if ((t.selected > -1 && t.selected < this.range.from || t.selected >= this.range.to) && (this.range = Sr(t.options.length, t.selected, this.view.state.facet(nt).maxRenderedOptions), this.showOptions(t.options, e.id)), this.updateSelectedOption(t.selected)) {
      this.destroyInfo();
      let { completion: i } = t.options[t.selected], { info: s } = i;
      if (!s)
        return;
      let r = typeof s == "string" ? document.createTextNode(s) : s(i);
      if (!r)
        return;
      "then" in r ? r.then((o) => {
        o && this.view.state.field(this.stateField, !1) == e && this.addInfoPane(o, i);
      }).catch((o) => ft(this.view.state, o, "completion info")) : this.addInfoPane(r, i);
    }
  }
  addInfoPane(e, t) {
    this.destroyInfo();
    let i = this.info = document.createElement("div");
    if (i.className = "cm-tooltip cm-completionInfo", e.nodeType != null)
      i.appendChild(e), this.infoDestroy = null;
    else {
      let { dom: s, destroy: r } = e;
      i.appendChild(s), this.infoDestroy = r || null;
    }
    this.dom.appendChild(i), this.view.requestMeasure(this.placeInfoReq);
  }
  updateSelectedOption(e) {
    let t = null;
    for (let i = this.list.firstChild, s = this.range.from; i; i = i.nextSibling, s++)
      i.nodeName != "LI" || !i.id ? s-- : s == e ? i.hasAttribute("aria-selected") || (i.setAttribute("aria-selected", "true"), t = i) : i.hasAttribute("aria-selected") && i.removeAttribute("aria-selected");
    return t && ib(this.list, t), t;
  }
  measureInfo() {
    let e = this.dom.querySelector("[aria-selected]");
    if (!e || !this.info)
      return null;
    let t = this.dom.getBoundingClientRect(), i = this.info.getBoundingClientRect(), s = e.getBoundingClientRect(), r = this.space;
    if (!r) {
      let o = this.dom.ownerDocument.defaultView || window;
      r = { left: 0, top: 0, right: o.innerWidth, bottom: o.innerHeight };
    }
    return s.top > Math.min(r.bottom, t.bottom) - 10 || s.bottom < Math.max(r.top, t.top) + 10 ? null : this.view.state.facet(nt).positionInfo(this.view, t, s, i, r, this.dom);
  }
  placeInfo(e) {
    this.info && (e ? (e.style && (this.info.style.cssText = e.style), this.info.className = "cm-tooltip cm-completionInfo " + (e.class || "")) : this.info.style.cssText = "top: -1e6px");
  }
  createListBox(e, t, i) {
    const s = document.createElement("ul");
    s.id = t, s.setAttribute("role", "listbox"), s.setAttribute("aria-expanded", "true"), s.setAttribute("aria-label", this.view.state.phrase("Completions"));
    let r = null;
    for (let o = i.from; o < i.to; o++) {
      let { completion: l, match: a } = e[o], { section: h } = l;
      if (h) {
        let u = typeof h == "string" ? h : h.name;
        if (u != r && (o > i.from || i.from == 0))
          if (r = u, typeof h != "string" && h.header)
            s.appendChild(h.header(h));
          else {
            let d = s.appendChild(document.createElement("completion-section"));
            d.textContent = u;
          }
      }
      const f = s.appendChild(document.createElement("li"));
      f.id = t + "-" + o, f.setAttribute("role", "option");
      let c = this.optionClass(l);
      c && (f.className = c);
      for (let u of this.optionContent) {
        let d = u(l, this.view.state, this.view, a);
        d && f.appendChild(d);
      }
    }
    return i.from && s.classList.add("cm-completionListIncompleteTop"), i.to < e.length && s.classList.add("cm-completionListIncompleteBottom"), s;
  }
  destroyInfo() {
    this.info && (this.infoDestroy && this.infoDestroy(), this.info.remove(), this.info = null);
  }
  destroy() {
    this.destroyInfo();
  }
}
function tb(n, e) {
  return (t) => new eb(t, n, e);
}
function ib(n, e) {
  let t = n.getBoundingClientRect(), i = e.getBoundingClientRect(), s = t.height / n.offsetHeight;
  i.top < t.top ? n.scrollTop -= (t.top - i.top) / s : i.bottom > t.bottom && (n.scrollTop += (i.bottom - t.bottom) / s);
}
function ah(n) {
  return (n.boost || 0) * 100 + (n.apply ? 10 : 0) + (n.info ? 5 : 0) + (n.type ? 1 : 0);
}
function nb(n, e) {
  let t = [], i = null, s = (a) => {
    t.push(a);
    let { section: h } = a.completion;
    if (h) {
      i || (i = []);
      let f = typeof h == "string" ? h : h.name;
      i.some((c) => c.name == f) || i.push(typeof h == "string" ? { name: f } : h);
    }
  };
  for (let a of n)
    if (a.hasResult()) {
      let h = a.result.getMatch;
      if (a.result.filter === !1)
        for (let f of a.result.options)
          s(new rh(f, a.source, h ? h(f) : [], 1e9 - t.length));
      else {
        let f = new Z1(e.sliceDoc(a.from, a.to));
        for (let c of a.result.options)
          if (f.match(c.label)) {
            let u = c.displayLabel ? h ? h(c, f.matched) : [] : f.matched;
            s(new rh(c, a.source, u, f.score + (c.boost || 0)));
          }
      }
    }
  if (i) {
    let a = /* @__PURE__ */ Object.create(null), h = 0, f = (c, u) => {
      var d, p;
      return ((d = c.rank) !== null && d !== void 0 ? d : 1e9) - ((p = u.rank) !== null && p !== void 0 ? p : 1e9) || (c.name < u.name ? -1 : 1);
    };
    for (let c of i.sort(f))
      h -= 1e5, a[c.name] = h;
    for (let c of t) {
      let { section: u } = c.completion;
      u && (c.score += a[typeof u == "string" ? u : u.name]);
    }
  }
  let r = [], o = null, l = e.facet(nt).compareCompletions;
  for (let a of t.sort((h, f) => f.score - h.score || l(h.completion, f.completion))) {
    let h = a.completion;
    !o || o.label != h.label || o.detail != h.detail || o.type != null && h.type != null && o.type != h.type || o.apply != h.apply || o.boost != h.boost ? r.push(a) : ah(a.completion) > ah(o) && (r[r.length - 1] = a), o = a.completion;
  }
  return r;
}
class bi {
  constructor(e, t, i, s, r, o) {
    this.options = e, this.attrs = t, this.tooltip = i, this.timestamp = s, this.selected = r, this.disabled = o;
  }
  setSelected(e, t) {
    return e == this.selected || e >= this.options.length ? this : new bi(this.options, hh(t, e), this.tooltip, this.timestamp, e, this.disabled);
  }
  static build(e, t, i, s, r) {
    let o = nb(e, t);
    if (!o.length)
      return s && e.some(
        (a) => a.state == 1
        /* State.Pending */
      ) ? new bi(s.options, s.attrs, s.tooltip, s.timestamp, s.selected, !0) : null;
    let l = t.facet(nt).selectOnOpen ? 0 : -1;
    if (s && s.selected != l && s.selected != -1) {
      let a = s.options[s.selected].completion;
      for (let h = 0; h < o.length; h++)
        if (o[h].completion == a) {
          l = h;
          break;
        }
    }
    return new bi(o, hh(i, l), {
      pos: e.reduce((a, h) => h.hasResult() ? Math.min(a, h.from) : a, 1e8),
      create: fb,
      above: r.aboveCursor
    }, s ? s.timestamp : Date.now(), l, !1);
  }
  map(e) {
    return new bi(this.options, this.attrs, Object.assign(Object.assign({}, this.tooltip), { pos: e.mapPos(this.tooltip.pos) }), this.timestamp, this.selected, this.disabled);
  }
}
class As {
  constructor(e, t, i) {
    this.active = e, this.id = t, this.open = i;
  }
  static start() {
    return new As(ob, "cm-ac-" + Math.floor(Math.random() * 2e6).toString(36), null);
  }
  update(e) {
    let { state: t } = e, i = t.facet(nt), r = (i.override || t.languageDataAt("autocomplete", _i(t)).map(X1)).map((l) => (this.active.find((h) => h.source == l) || new Oe(
      l,
      this.active.some(
        (h) => h.state != 0
        /* State.Inactive */
      ) ? 1 : 0
      /* State.Inactive */
    )).update(e, i));
    r.length == this.active.length && r.every((l, a) => l == this.active[a]) && (r = this.active);
    let o = this.open;
    o && e.docChanged && (o = o.map(e.changes)), e.selection || r.some((l) => l.hasResult() && e.changes.touchesRange(l.from, l.to)) || !sb(r, this.active) ? o = bi.build(r, t, this.id, o, i) : o && o.disabled && !r.some(
      (l) => l.state == 1
      /* State.Pending */
    ) && (o = null), !o && r.every(
      (l) => l.state != 1
      /* State.Pending */
    ) && r.some((l) => l.hasResult()) && (r = r.map((l) => l.hasResult() ? new Oe(
      l.source,
      0
      /* State.Inactive */
    ) : l));
    for (let l of e.effects)
      l.is(Ru) && (o = o && o.setSelected(l.value, this.id));
    return r == this.active && o == this.open ? this : new As(r, this.id, o);
  }
  get tooltip() {
    return this.open ? this.open.tooltip : null;
  }
  get attrs() {
    return this.open ? this.open.attrs : rb;
  }
}
function sb(n, e) {
  if (n == e)
    return !0;
  for (let t = 0, i = 0; ; ) {
    for (; t < n.length && !n[t].hasResult; )
      t++;
    for (; i < e.length && !e[i].hasResult; )
      i++;
    let s = t == n.length, r = i == e.length;
    if (s || r)
      return s == r;
    if (n[t++].result != e[i++].result)
      return !1;
  }
}
const rb = {
  "aria-autocomplete": "list"
};
function hh(n, e) {
  let t = {
    "aria-autocomplete": "list",
    "aria-haspopup": "listbox",
    "aria-controls": n
  };
  return e > -1 && (t["aria-activedescendant"] = n + "-" + e), t;
}
const ob = [];
function lb(n) {
  return n.isUserEvent("input.type") ? "input" : n.isUserEvent("delete.backward") ? "delete" : null;
}
class Oe {
  constructor(e, t, i = -1) {
    this.source = e, this.state = t, this.explicitPos = i;
  }
  hasResult() {
    return !1;
  }
  update(e, t) {
    let i = lb(e), s = this;
    i ? s = s.handleUserEvent(e, i, t) : e.docChanged ? s = s.handleChange(e) : e.selection && s.state != 0 && (s = new Oe(
      s.source,
      0
      /* State.Inactive */
    ));
    for (let r of e.effects)
      if (r.is(Eu))
        s = new Oe(s.source, 1, r.value ? _i(e.state) : -1);
      else if (r.is(ol))
        s = new Oe(
          s.source,
          0
          /* State.Inactive */
        );
      else if (r.is(hb))
        for (let o of r.value)
          o.source == s.source && (s = o);
    return s;
  }
  handleUserEvent(e, t, i) {
    return t == "delete" || !i.activateOnTyping ? this.map(e.changes) : new Oe(
      this.source,
      1
      /* State.Pending */
    );
  }
  handleChange(e) {
    return e.changes.touchesRange(_i(e.startState)) ? new Oe(
      this.source,
      0
      /* State.Inactive */
    ) : this.map(e.changes);
  }
  map(e) {
    return e.empty || this.explicitPos < 0 ? this : new Oe(this.source, this.state, e.mapPos(this.explicitPos));
  }
}
class ln extends Oe {
  constructor(e, t, i, s, r) {
    super(e, 2, t), this.result = i, this.from = s, this.to = r;
  }
  hasResult() {
    return !0;
  }
  handleUserEvent(e, t, i) {
    var s;
    let r = e.changes.mapPos(this.from), o = e.changes.mapPos(this.to, 1), l = _i(e.state);
    if ((this.explicitPos < 0 ? l <= r : l < this.from) || l > o || t == "delete" && _i(e.startState) == this.from)
      return new Oe(
        this.source,
        t == "input" && i.activateOnTyping ? 1 : 0
        /* State.Inactive */
      );
    let a = this.explicitPos < 0 ? -1 : e.changes.mapPos(this.explicitPos), h;
    return ab(this.result.validFor, e.state, r, o) ? new ln(this.source, a, this.result, r, o) : this.result.update && (h = this.result.update(this.result, r, o, new U1(e.state, l, a >= 0))) ? new ln(this.source, a, h, h.from, (s = h.to) !== null && s !== void 0 ? s : _i(e.state)) : new Oe(this.source, 1, a);
  }
  handleChange(e) {
    return e.changes.touchesRange(this.from, this.to) ? new Oe(
      this.source,
      0
      /* State.Inactive */
    ) : this.map(e.changes);
  }
  map(e) {
    return e.empty ? this : new ln(this.source, this.explicitPos < 0 ? -1 : e.mapPos(this.explicitPos), this.result, e.mapPos(this.from), e.mapPos(this.to, 1));
  }
}
function ab(n, e, t, i) {
  if (!n)
    return !1;
  let s = e.sliceDoc(t, i);
  return typeof n == "function" ? n(s, t, i, e) : Pu(n, !0).test(s);
}
const hb = /* @__PURE__ */ z.define({
  map(n, e) {
    return n.map((t) => t.map(e));
  }
}), Ru = /* @__PURE__ */ z.define(), Ni = /* @__PURE__ */ Me.define({
  create() {
    return As.start();
  },
  update(n, e) {
    return n.update(e);
  },
  provide: (n) => [
    jo.from(n, (e) => e.tooltip),
    B.contentAttributes.from(n, (e) => e.attrs)
  ]
});
function Iu(n, e) {
  const t = e.completion.apply || e.completion.label;
  let i = n.state.field(Ni).active.find((s) => s.source == e.source);
  return i instanceof ln ? (typeof t == "string" ? n.dispatch(Object.assign(Object.assign({}, J1(n.state, t, i.from, i.to)), { annotations: Lu.of(e.completion) })) : t(n, e.completion, i.from, i.to), !0) : !1;
}
const fb = /* @__PURE__ */ tb(Ni, Iu);
function Xn(n, e = "option") {
  return (t) => {
    let i = t.state.field(Ni, !1);
    if (!i || !i.open || i.open.disabled || Date.now() - i.open.timestamp < t.state.facet(nt).interactionDelay)
      return !1;
    let s = 1, r;
    e == "page" && (r = Xm(t, i.open.tooltip)) && (s = Math.max(2, Math.floor(r.dom.offsetHeight / r.dom.querySelector("li").offsetHeight) - 1));
    let { length: o } = i.open.options, l = i.open.selected > -1 ? i.open.selected + s * (n ? 1 : -1) : n ? 0 : o - 1;
    return l < 0 ? l = e == "page" ? 0 : o - 1 : l >= o && (l = e == "page" ? o - 1 : 0), t.dispatch({ effects: Ru.of(l) }), !0;
  };
}
const cb = (n) => {
  let e = n.state.field(Ni, !1);
  return n.state.readOnly || !e || !e.open || e.open.selected < 0 || e.open.disabled || Date.now() - e.open.timestamp < n.state.facet(nt).interactionDelay ? !1 : Iu(n, e.open.options[e.open.selected]);
}, ub = (n) => n.state.field(Ni, !1) ? (n.dispatch({ effects: Eu.of(!0) }), !0) : !1, db = (n) => {
  let e = n.state.field(Ni, !1);
  return !e || !e.active.some(
    (t) => t.state != 0
    /* State.Inactive */
  ) ? !1 : (n.dispatch({ effects: ol.of(null) }), !0);
}, pb = /* @__PURE__ */ B.baseTheme({
  ".cm-tooltip.cm-tooltip-autocomplete": {
    "& > ul": {
      fontFamily: "monospace",
      whiteSpace: "nowrap",
      overflow: "hidden auto",
      maxWidth_fallback: "700px",
      maxWidth: "min(700px, 95vw)",
      minWidth: "250px",
      maxHeight: "10em",
      height: "100%",
      listStyle: "none",
      margin: 0,
      padding: 0,
      "& > li, & > completion-section": {
        padding: "1px 3px",
        lineHeight: 1.2
      },
      "& > li": {
        overflowX: "hidden",
        textOverflow: "ellipsis",
        cursor: "pointer"
      },
      "& > completion-section": {
        display: "list-item",
        borderBottom: "1px solid silver",
        paddingLeft: "0.5em",
        opacity: 0.7
      }
    }
  },
  "&light .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#17c",
    color: "white"
  },
  "&light .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#777"
  },
  "&dark .cm-tooltip-autocomplete ul li[aria-selected]": {
    background: "#347",
    color: "white"
  },
  "&dark .cm-tooltip-autocomplete-disabled ul li[aria-selected]": {
    background: "#444"
  },
  ".cm-completionListIncompleteTop:before, .cm-completionListIncompleteBottom:after": {
    content: '"···"',
    opacity: 0.5,
    display: "block",
    textAlign: "center"
  },
  ".cm-tooltip.cm-completionInfo": {
    position: "absolute",
    padding: "3px 9px",
    width: "max-content",
    maxWidth: "400px",
    boxSizing: "border-box"
  },
  ".cm-completionInfo.cm-completionInfo-left": { right: "100%" },
  ".cm-completionInfo.cm-completionInfo-right": { left: "100%" },
  ".cm-completionInfo.cm-completionInfo-left-narrow": { right: "30px" },
  ".cm-completionInfo.cm-completionInfo-right-narrow": { left: "30px" },
  "&light .cm-snippetField": { backgroundColor: "#00000022" },
  "&dark .cm-snippetField": { backgroundColor: "#ffffff22" },
  ".cm-snippetFieldPosition": {
    verticalAlign: "text-top",
    width: 0,
    height: "1.15em",
    display: "inline-block",
    margin: "0 -0.7px -.7em",
    borderLeft: "1.4px dotted #888"
  },
  ".cm-completionMatchedText": {
    textDecoration: "underline"
  },
  ".cm-completionDetail": {
    marginLeft: "0.5em",
    fontStyle: "italic"
  },
  ".cm-completionIcon": {
    fontSize: "90%",
    width: ".8em",
    display: "inline-block",
    textAlign: "center",
    paddingRight: ".6em",
    opacity: "0.6",
    boxSizing: "content-box"
  },
  ".cm-completionIcon-function, .cm-completionIcon-method": {
    "&:after": { content: "'ƒ'" }
  },
  ".cm-completionIcon-class": {
    "&:after": { content: "'○'" }
  },
  ".cm-completionIcon-interface": {
    "&:after": { content: "'◌'" }
  },
  ".cm-completionIcon-variable": {
    "&:after": { content: "'𝑥'" }
  },
  ".cm-completionIcon-constant": {
    "&:after": { content: "'𝐶'" }
  },
  ".cm-completionIcon-type": {
    "&:after": { content: "'𝑡'" }
  },
  ".cm-completionIcon-enum": {
    "&:after": { content: "'∪'" }
  },
  ".cm-completionIcon-property": {
    "&:after": { content: "'□'" }
  },
  ".cm-completionIcon-keyword": {
    "&:after": { content: "'🔑︎'" }
    // Disable emoji rendering
  },
  ".cm-completionIcon-namespace": {
    "&:after": { content: "'▢'" }
  },
  ".cm-completionIcon-text": {
    "&:after": { content: "'abc'", fontSize: "50%", verticalAlign: "middle" }
  }
});
class mb {
  constructor(e, t, i, s) {
    this.field = e, this.line = t, this.from = i, this.to = s;
  }
}
class ll {
  constructor(e, t, i) {
    this.field = e, this.from = t, this.to = i;
  }
  map(e) {
    let t = e.mapPos(this.from, -1, me.TrackDel), i = e.mapPos(this.to, 1, me.TrackDel);
    return t == null || i == null ? null : new ll(this.field, t, i);
  }
}
class al {
  constructor(e, t) {
    this.lines = e, this.fieldPositions = t;
  }
  instantiate(e, t) {
    let i = [], s = [t], r = e.doc.lineAt(t), o = /^\s*/.exec(r.text)[0];
    for (let a of this.lines) {
      if (i.length) {
        let h = o, f = /^\t*/.exec(a)[0].length;
        for (let c = 0; c < f; c++)
          h += e.facet(Hs);
        s.push(t + h.length - f), a = h + a.slice(f);
      }
      i.push(a), t += a.length + 1;
    }
    let l = this.fieldPositions.map((a) => new ll(a.field, s[a.line] + a.from, s[a.line] + a.to));
    return { text: i, ranges: l };
  }
  static parse(e) {
    let t = [], i = [], s = [], r;
    for (let o of e.split(/\r\n?|\n/)) {
      for (; r = /[#$]\{(?:(\d+)(?::([^}]*))?|([^}]*))\}/.exec(o); ) {
        let l = r[1] ? +r[1] : null, a = r[2] || r[3] || "", h = -1;
        for (let f = 0; f < t.length; f++)
          (l != null ? t[f].seq == l : a && t[f].name == a) && (h = f);
        if (h < 0) {
          let f = 0;
          for (; f < t.length && (l == null || t[f].seq != null && t[f].seq < l); )
            f++;
          t.splice(f, 0, { seq: l, name: a }), h = f;
          for (let c of s)
            c.field >= h && c.field++;
        }
        s.push(new mb(h, i.length, r.index, r.index + a.length)), o = o.slice(0, r.index) + a + o.slice(r.index + r[0].length);
      }
      for (let l; l = /\\([{}])/.exec(o); ) {
        o = o.slice(0, l.index) + l[1] + o.slice(l.index + l[0].length);
        for (let a of s)
          a.line == i.length && a.from > l.index && (a.from--, a.to--);
      }
      i.push(o);
    }
    return new al(i, s);
  }
}
let gb = /* @__PURE__ */ q.widget({ widget: /* @__PURE__ */ new class extends ct {
  toDOM() {
    let n = document.createElement("span");
    return n.className = "cm-snippetFieldPosition", n;
  }
  ignoreEvent() {
    return !1;
  }
}() }), bb = /* @__PURE__ */ q.mark({ class: "cm-snippetField" });
class Fi {
  constructor(e, t) {
    this.ranges = e, this.active = t, this.deco = q.set(e.map((i) => (i.from == i.to ? gb : bb).range(i.from, i.to)));
  }
  map(e) {
    let t = [];
    for (let i of this.ranges) {
      let s = i.map(e);
      if (!s)
        return null;
      t.push(s);
    }
    return new Fi(t, this.active);
  }
  selectionInsideField(e) {
    return e.ranges.every((t) => this.ranges.some((i) => i.field == this.active && i.from <= t.from && i.to >= t.to));
  }
}
const Mn = /* @__PURE__ */ z.define({
  map(n, e) {
    return n && n.map(e);
  }
}), yb = /* @__PURE__ */ z.define(), wn = /* @__PURE__ */ Me.define({
  create() {
    return null;
  },
  update(n, e) {
    for (let t of e.effects) {
      if (t.is(Mn))
        return t.value;
      if (t.is(yb) && n)
        return new Fi(n.ranges, t.value);
    }
    return n && e.docChanged && (n = n.map(e.changes)), n && e.selection && !n.selectionInsideField(e.selection) && (n = null), n;
  },
  provide: (n) => B.decorations.from(n, (e) => e ? e.deco : q.none)
});
function hl(n, e) {
  return C.create(n.filter((t) => t.field == e).map((t) => C.range(t.from, t.to)));
}
function wb(n) {
  let e = al.parse(n);
  return (t, i, s, r) => {
    let { text: o, ranges: l } = e.instantiate(t.state, s), a = {
      changes: { from: s, to: r, insert: J.of(o) },
      scrollIntoView: !0,
      annotations: i ? [Lu.of(i), le.userEvent.of("input.complete")] : void 0
    };
    if (l.length && (a.selection = hl(l, 0)), l.some((h) => h.field > 0)) {
      let h = new Fi(l, 0), f = a.effects = [Mn.of(h)];
      t.state.field(wn, !1) === void 0 && f.push(z.appendConfig.of([wn, _b, Cb, pb]));
    }
    t.dispatch(t.state.update(a));
  };
}
function Nu(n) {
  return ({ state: e, dispatch: t }) => {
    let i = e.field(wn, !1);
    if (!i || n < 0 && i.active == 0)
      return !1;
    let s = i.active + n, r = n > 0 && !i.ranges.some((o) => o.field == s + n);
    return t(e.update({
      selection: hl(i.ranges, s),
      effects: Mn.of(r ? null : new Fi(i.ranges, s)),
      scrollIntoView: !0
    })), !0;
  };
}
const kb = ({ state: n, dispatch: e }) => n.field(wn, !1) ? (e(n.update({ effects: Mn.of(null) })), !0) : !1, vb = /* @__PURE__ */ Nu(1), xb = /* @__PURE__ */ Nu(-1), Sb = [
  { key: "Tab", run: vb, shift: xb },
  { key: "Escape", run: kb }
], fh = /* @__PURE__ */ O.define({
  combine(n) {
    return n.length ? n[0] : Sb;
  }
}), _b = /* @__PURE__ */ vn.highest(/* @__PURE__ */ Ns.compute([fh], (n) => n.facet(fh)));
function bx(n, e) {
  return Object.assign(Object.assign({}, e), { apply: wb(n) });
}
const Cb = /* @__PURE__ */ B.domEventHandlers({
  mousedown(n, e) {
    let t = e.state.field(wn, !1), i;
    if (!t || (i = e.posAtCoords({ x: n.clientX, y: n.clientY })) == null)
      return !1;
    let s = t.ranges.find((r) => r.from <= i && r.to >= i);
    return !s || s.field == t.active ? !1 : (e.dispatch({
      selection: hl(t.ranges, s.field),
      effects: Mn.of(t.ranges.some((r) => r.field > s.field) ? new Fi(t.ranges, s.field) : null),
      scrollIntoView: !0
    }), !0);
  }
}), kn = {
  brackets: ["(", "[", "{", "'", '"'],
  before: ")]}:;>",
  stringPrefixes: []
}, Yt = /* @__PURE__ */ z.define({
  map(n, e) {
    let t = e.mapPos(n, -1, me.TrackAfter);
    return t ?? void 0;
  }
}), fl = /* @__PURE__ */ new class extends Zt {
}();
fl.startSide = 1;
fl.endSide = -1;
const Fu = /* @__PURE__ */ Me.define({
  create() {
    return Y.empty;
  },
  update(n, e) {
    if (n = n.map(e.changes), e.selection) {
      let t = e.state.doc.lineAt(e.selection.main.head);
      n = n.update({ filter: (i) => i >= t.from && i <= t.to });
    }
    for (let t of e.effects)
      t.is(Yt) && (n = n.update({ add: [fl.range(t.value, t.value + 1)] }));
    return n;
  }
});
function Ab() {
  return [Tb, Fu];
}
const _r = "()[]{}<>";
function Hu(n) {
  for (let e = 0; e < _r.length; e += 2)
    if (_r.charCodeAt(e) == n)
      return _r.charAt(e + 1);
  return cf(n < 128 ? n : n + 1);
}
function Vu(n, e) {
  return n.languageDataAt("closeBrackets", e)[0] || kn;
}
const Mb = typeof navigator == "object" && /* @__PURE__ */ /Android\b/.test(navigator.userAgent), Tb = /* @__PURE__ */ B.inputHandler.of((n, e, t, i) => {
  if ((Mb ? n.composing : n.compositionStarted) || n.state.readOnly)
    return !1;
  let s = n.state.selection.main;
  if (i.length > 2 || i.length == 2 && je(be(i, 0)) == 1 || e != s.from || t != s.to)
    return !1;
  let r = Bb(n.state, i);
  return r ? (n.dispatch(r), !0) : !1;
}), Db = ({ state: n, dispatch: e }) => {
  if (n.readOnly)
    return !1;
  let i = Vu(n, n.selection.main.head).brackets || kn.brackets, s = null, r = n.changeByRange((o) => {
    if (o.empty) {
      let l = Pb(n.doc, o.head);
      for (let a of i)
        if (a == l && Us(n.doc, o.head) == Hu(be(a, 0)))
          return {
            changes: { from: o.head - a.length, to: o.head + a.length },
            range: C.cursor(o.head - a.length)
          };
    }
    return { range: s = o };
  });
  return s || e(n.update(r, { scrollIntoView: !0, userEvent: "delete.backward" })), !s;
}, Ob = [
  { key: "Backspace", run: Db }
];
function Bb(n, e) {
  let t = Vu(n, n.selection.main.head), i = t.brackets || kn.brackets;
  for (let s of i) {
    let r = Hu(be(s, 0));
    if (e == s)
      return r == s ? Rb(n, s, i.indexOf(s + s + s) > -1, t) : Lb(n, s, r, t.before || kn.before);
    if (e == r && Wu(n, n.selection.main.from))
      return Eb(n, s, r);
  }
  return null;
}
function Wu(n, e) {
  let t = !1;
  return n.field(Fu).between(0, n.doc.length, (i) => {
    i == e && (t = !0);
  }), t;
}
function Us(n, e) {
  let t = n.sliceString(e, e + 2);
  return t.slice(0, je(be(t, 0)));
}
function Pb(n, e) {
  let t = n.sliceString(e - 2, e);
  return je(be(t, 0)) == t.length ? t : t.slice(1);
}
function Lb(n, e, t, i) {
  let s = null, r = n.changeByRange((o) => {
    if (!o.empty)
      return {
        changes: [{ insert: e, from: o.from }, { insert: t, from: o.to }],
        effects: Yt.of(o.to + e.length),
        range: C.range(o.anchor + e.length, o.head + e.length)
      };
    let l = Us(n.doc, o.head);
    return !l || /\s/.test(l) || i.indexOf(l) > -1 ? {
      changes: { insert: e + t, from: o.head },
      effects: Yt.of(o.head + e.length),
      range: C.cursor(o.head + e.length)
    } : { range: s = o };
  });
  return s ? null : n.update(r, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Eb(n, e, t) {
  let i = null, s = n.changeByRange((r) => r.empty && Us(n.doc, r.head) == t ? {
    changes: { from: r.head, to: r.head + t.length, insert: t },
    range: C.cursor(r.head + t.length)
  } : i = { range: r });
  return i ? null : n.update(s, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function Rb(n, e, t, i) {
  let s = i.stringPrefixes || kn.stringPrefixes, r = null, o = n.changeByRange((l) => {
    if (!l.empty)
      return {
        changes: [{ insert: e, from: l.from }, { insert: e, from: l.to }],
        effects: Yt.of(l.to + e.length),
        range: C.range(l.anchor + e.length, l.head + e.length)
      };
    let a = l.head, h = Us(n.doc, a), f;
    if (h == e) {
      if (ch(n, a))
        return {
          changes: { insert: e + e, from: a },
          effects: Yt.of(a + e.length),
          range: C.cursor(a + e.length)
        };
      if (Wu(n, a)) {
        let u = t && n.sliceDoc(a, a + e.length * 3) == e + e + e ? e + e + e : e;
        return {
          changes: { from: a, to: a + u.length, insert: u },
          range: C.cursor(a + u.length)
        };
      }
    } else {
      if (t && n.sliceDoc(a - 2 * e.length, a) == e + e && (f = uh(n, a - 2 * e.length, s)) > -1 && ch(n, f))
        return {
          changes: { insert: e + e + e + e, from: a },
          effects: Yt.of(a + e.length),
          range: C.cursor(a + e.length)
        };
      if (n.charCategorizer(a)(h) != Ee.Word && uh(n, a, s) > -1 && !Ib(n, a, e, s))
        return {
          changes: { insert: e + e, from: a },
          effects: Yt.of(a + e.length),
          range: C.cursor(a + e.length)
        };
    }
    return { range: r = l };
  });
  return r ? null : n.update(o, {
    scrollIntoView: !0,
    userEvent: "input.type"
  });
}
function ch(n, e) {
  let t = ue(n).resolveInner(e + 1);
  return t.parent && t.from == e;
}
function Ib(n, e, t, i) {
  let s = ue(n).resolveInner(e, -1), r = i.reduce((o, l) => Math.max(o, l.length), 0);
  for (let o = 0; o < 5; o++) {
    let l = n.sliceDoc(s.from, Math.min(s.to, s.from + t.length + r)), a = l.indexOf(t);
    if (!a || a > -1 && i.indexOf(l.slice(0, a)) > -1) {
      let f = s.firstChild;
      for (; f && f.from == s.from && f.to - f.from > t.length + a; ) {
        if (n.sliceDoc(f.to - t.length, f.to) == t)
          return !1;
        f = f.firstChild;
      }
      return !0;
    }
    let h = s.to == e && s.parent;
    if (!h)
      break;
    s = h;
  }
  return !1;
}
function uh(n, e, t) {
  let i = n.charCategorizer(e);
  if (i(n.sliceDoc(e - 1, e)) != Ee.Word)
    return e;
  for (let s of t) {
    let r = e - s.length;
    if (n.sliceDoc(r, e) == s && i(n.sliceDoc(r - 1, r)) != Ee.Word)
      return r;
  }
  return -1;
}
const Nb = [
  { key: "Ctrl-Space", run: ub },
  { key: "Escape", run: db },
  { key: "ArrowDown", run: /* @__PURE__ */ Xn(!0) },
  { key: "ArrowUp", run: /* @__PURE__ */ Xn(!1) },
  { key: "PageDown", run: /* @__PURE__ */ Xn(!0, "page") },
  { key: "PageUp", run: /* @__PURE__ */ Xn(!1, "page") },
  { key: "Enter", run: cb }
];
function st() {
  var n = arguments[0];
  typeof n == "string" && (n = document.createElement(n));
  var e = 1, t = arguments[1];
  if (t && typeof t == "object" && t.nodeType == null && !Array.isArray(t)) {
    for (var i in t)
      if (Object.prototype.hasOwnProperty.call(t, i)) {
        var s = t[i];
        typeof s == "string" ? n.setAttribute(i, s) : s != null && (n[i] = s);
      }
    e++;
  }
  for (; e < arguments.length; e++)
    zu(n, arguments[e]);
  return n;
}
function zu(n, e) {
  if (typeof e == "string")
    n.appendChild(document.createTextNode(e));
  else if (e != null)
    if (e.nodeType != null)
      n.appendChild(e);
    else if (Array.isArray(e))
      for (var t = 0; t < e.length; t++)
        zu(n, e[t]);
    else
      throw new RangeError("Unsupported child node: " + e);
}
class Fb {
  constructor(e, t, i) {
    this.from = e, this.to = t, this.diagnostic = i;
  }
}
class Kt {
  constructor(e, t, i) {
    this.diagnostics = e, this.panel = t, this.selected = i;
  }
  static init(e, t, i) {
    let s = e, r = i.facet(Ku).markerFilter;
    r && (s = r(s, i));
    let o = q.set(s.map((l) => l.from == l.to || l.from == l.to - 1 && i.doc.lineAt(l.from).to == l.from ? q.widget({
      widget: new Gb(l),
      diagnostic: l
    }).range(l.from) : q.mark({
      attributes: { class: "cm-lintRange cm-lintRange-" + l.severity + (l.markClass ? " " + l.markClass : "") },
      diagnostic: l,
      inclusive: !0
    }).range(l.from, l.to)), !0);
    return new Kt(o, t, Bi(o));
  }
}
function Bi(n, e = null, t = 0) {
  let i = null;
  return n.between(t, 1e9, (s, r, { spec: o }) => {
    if (!(e && o.diagnostic != e))
      return i = new Fb(s, r, o.diagnostic), !1;
  }), i;
}
function Hb(n, e) {
  let t = n.startState.doc.lineAt(e.pos);
  return !!(n.effects.some((i) => i.is(qu)) || n.changes.touchesRange(t.from, t.to));
}
function Vb(n, e) {
  return n.field(Pe, !1) ? e : e.concat(z.appendConfig.of(Xb));
}
const qu = /* @__PURE__ */ z.define(), cl = /* @__PURE__ */ z.define(), ju = /* @__PURE__ */ z.define(), Pe = /* @__PURE__ */ Me.define({
  create() {
    return new Kt(q.none, null, null);
  },
  update(n, e) {
    if (e.docChanged) {
      let t = n.diagnostics.map(e.changes), i = null;
      if (n.selected) {
        let s = e.changes.mapPos(n.selected.from, 1);
        i = Bi(t, n.selected.diagnostic, s) || Bi(t, null, s);
      }
      n = new Kt(t, n.panel, i);
    }
    for (let t of e.effects)
      t.is(qu) ? n = Kt.init(t.value, n.panel, e.state) : t.is(cl) ? n = new Kt(n.diagnostics, t.value ? Gs.open : null, n.selected) : t.is(ju) && (n = new Kt(n.diagnostics, n.panel, t.value));
    return n;
  },
  provide: (n) => [
    mo.from(n, (e) => e.panel),
    B.decorations.from(n, (e) => e.diagnostics)
  ]
}), Wb = /* @__PURE__ */ q.mark({ class: "cm-lintRange cm-lintRange-active", inclusive: !0 });
function zb(n, e, t) {
  let { diagnostics: i } = n.state.field(Pe), s = [], r = 2e8, o = 0;
  i.between(e - (t < 0 ? 1 : 0), e + (t > 0 ? 1 : 0), (a, h, { spec: f }) => {
    e >= a && e <= h && (a == h || (e > a || t > 0) && (e < h || t < 0)) && (s.push(f.diagnostic), r = Math.min(a, r), o = Math.max(h, o));
  });
  let l = n.state.facet(Ku).tooltipFilter;
  return l && (s = l(s, n.state)), s.length ? {
    pos: r,
    end: o,
    above: n.state.doc.lineAt(r).to < o,
    create() {
      return { dom: qb(n, s) };
    }
  } : null;
}
function qb(n, e) {
  return st("ul", { class: "cm-tooltip-lint" }, e.map((t) => Gu(n, t, !1)));
}
const jb = (n) => {
  let e = n.state.field(Pe, !1);
  (!e || !e.panel) && n.dispatch({ effects: Vb(n.state, [cl.of(!0)]) });
  let t = Qm(n, Gs.open);
  return t && t.dom.querySelector(".cm-panel-lint ul").focus(), !0;
}, dh = (n) => {
  let e = n.state.field(Pe, !1);
  return !e || !e.panel ? !1 : (n.dispatch({ effects: cl.of(!1) }), !0);
}, Kb = (n) => {
  let e = n.state.field(Pe, !1);
  if (!e)
    return !1;
  let t = n.state.selection.main, i = e.diagnostics.iter(t.to + 1);
  return !i.value && (i = e.diagnostics.iter(0), !i.value || i.from == t.from && i.to == t.to) ? !1 : (n.dispatch({ selection: { anchor: i.from, head: i.to }, scrollIntoView: !0 }), !0);
}, Ub = [
  { key: "Mod-Shift-m", run: jb, preventDefault: !0 },
  { key: "F8", run: Kb }
], Ku = /* @__PURE__ */ O.define({
  combine(n) {
    return Object.assign({ sources: n.map((e) => e.source).filter((e) => e != null) }, ai(n.map((e) => e.config), {
      delay: 750,
      markerFilter: null,
      tooltipFilter: null,
      needsRefresh: null
    }, {
      needsRefresh: (e, t) => e ? t ? (i) => e(i) || t(i) : e : t
    }));
  }
});
function Uu(n) {
  let e = [];
  if (n)
    e:
      for (let { name: t } of n) {
        for (let i = 0; i < t.length; i++) {
          let s = t[i];
          if (/[a-zA-Z]/.test(s) && !e.some((r) => r.toLowerCase() == s.toLowerCase())) {
            e.push(s);
            continue e;
          }
        }
        e.push("");
      }
  return e;
}
function Gu(n, e, t) {
  var i;
  let s = t ? Uu(e.actions) : [];
  return st("li", { class: "cm-diagnostic cm-diagnostic-" + e.severity }, st("span", { class: "cm-diagnosticText" }, e.renderMessage ? e.renderMessage() : e.message), (i = e.actions) === null || i === void 0 ? void 0 : i.map((r, o) => {
    let l = !1, a = (u) => {
      if (u.preventDefault(), l)
        return;
      l = !0;
      let d = Bi(n.state.field(Pe).diagnostics, e);
      d && r.apply(n, d.from, d.to);
    }, { name: h } = r, f = s[o] ? h.indexOf(s[o]) : -1, c = f < 0 ? h : [
      h.slice(0, f),
      st("u", h.slice(f, f + 1)),
      h.slice(f + 1)
    ];
    return st("button", {
      type: "button",
      class: "cm-diagnosticAction",
      onclick: a,
      onmousedown: a,
      "aria-label": ` Action: ${h}${f < 0 ? "" : ` (access key "${s[o]})"`}.`
    }, c);
  }), e.source && st("div", { class: "cm-diagnosticSource" }, e.source));
}
class Gb extends ct {
  constructor(e) {
    super(), this.diagnostic = e;
  }
  eq(e) {
    return e.diagnostic == this.diagnostic;
  }
  toDOM() {
    return st("span", { class: "cm-lintPoint cm-lintPoint-" + this.diagnostic.severity });
  }
}
class ph {
  constructor(e, t) {
    this.diagnostic = t, this.id = "item_" + Math.floor(Math.random() * 4294967295).toString(16), this.dom = Gu(e, t, !0), this.dom.id = this.id, this.dom.setAttribute("role", "option");
  }
}
class Gs {
  constructor(e) {
    this.view = e, this.items = [];
    let t = (s) => {
      if (s.keyCode == 27)
        dh(this.view), this.view.focus();
      else if (s.keyCode == 38 || s.keyCode == 33)
        this.moveSelection((this.selectedIndex - 1 + this.items.length) % this.items.length);
      else if (s.keyCode == 40 || s.keyCode == 34)
        this.moveSelection((this.selectedIndex + 1) % this.items.length);
      else if (s.keyCode == 36)
        this.moveSelection(0);
      else if (s.keyCode == 35)
        this.moveSelection(this.items.length - 1);
      else if (s.keyCode == 13)
        this.view.focus();
      else if (s.keyCode >= 65 && s.keyCode <= 90 && this.selectedIndex >= 0) {
        let { diagnostic: r } = this.items[this.selectedIndex], o = Uu(r.actions);
        for (let l = 0; l < o.length; l++)
          if (o[l].toUpperCase().charCodeAt(0) == s.keyCode) {
            let a = Bi(this.view.state.field(Pe).diagnostics, r);
            a && r.actions[l].apply(e, a.from, a.to);
          }
      } else
        return;
      s.preventDefault();
    }, i = (s) => {
      for (let r = 0; r < this.items.length; r++)
        this.items[r].dom.contains(s.target) && this.moveSelection(r);
    };
    this.list = st("ul", {
      tabIndex: 0,
      role: "listbox",
      "aria-label": this.view.state.phrase("Diagnostics"),
      onkeydown: t,
      onclick: i
    }), this.dom = st("div", { class: "cm-panel-lint" }, this.list, st("button", {
      type: "button",
      name: "close",
      "aria-label": this.view.state.phrase("close"),
      onclick: () => dh(this.view)
    }, "×")), this.update();
  }
  get selectedIndex() {
    let e = this.view.state.field(Pe).selected;
    if (!e)
      return -1;
    for (let t = 0; t < this.items.length; t++)
      if (this.items[t].diagnostic == e.diagnostic)
        return t;
    return -1;
  }
  update() {
    let { diagnostics: e, selected: t } = this.view.state.field(Pe), i = 0, s = !1, r = null;
    for (e.between(0, this.view.state.doc.length, (o, l, { spec: a }) => {
      let h = -1, f;
      for (let c = i; c < this.items.length; c++)
        if (this.items[c].diagnostic == a.diagnostic) {
          h = c;
          break;
        }
      h < 0 ? (f = new ph(this.view, a.diagnostic), this.items.splice(i, 0, f), s = !0) : (f = this.items[h], h > i && (this.items.splice(i, h - i), s = !0)), t && f.diagnostic == t.diagnostic ? f.dom.hasAttribute("aria-selected") || (f.dom.setAttribute("aria-selected", "true"), r = f) : f.dom.hasAttribute("aria-selected") && f.dom.removeAttribute("aria-selected"), i++;
    }); i < this.items.length && !(this.items.length == 1 && this.items[0].diagnostic.from < 0); )
      s = !0, this.items.pop();
    this.items.length == 0 && (this.items.push(new ph(this.view, {
      from: -1,
      to: -1,
      severity: "info",
      message: this.view.state.phrase("No diagnostics")
    })), s = !0), r ? (this.list.setAttribute("aria-activedescendant", r.id), this.view.requestMeasure({
      key: this,
      read: () => ({ sel: r.dom.getBoundingClientRect(), panel: this.list.getBoundingClientRect() }),
      write: ({ sel: o, panel: l }) => {
        let a = l.height / this.list.offsetHeight;
        o.top < l.top ? this.list.scrollTop -= (l.top - o.top) / a : o.bottom > l.bottom && (this.list.scrollTop += (o.bottom - l.bottom) / a);
      }
    })) : this.selectedIndex < 0 && this.list.removeAttribute("aria-activedescendant"), s && this.sync();
  }
  sync() {
    let e = this.list.firstChild;
    function t() {
      let i = e;
      e = i.nextSibling, i.remove();
    }
    for (let i of this.items)
      if (i.dom.parentNode == this.list) {
        for (; e != i.dom; )
          t();
        e = i.dom.nextSibling;
      } else
        this.list.insertBefore(i.dom, e);
    for (; e; )
      t();
  }
  moveSelection(e) {
    if (this.selectedIndex < 0)
      return;
    let t = this.view.state.field(Pe), i = Bi(t.diagnostics, this.items[e].diagnostic);
    i && this.view.dispatch({
      selection: { anchor: i.from, head: i.to },
      scrollIntoView: !0,
      effects: ju.of(i)
    });
  }
  static open(e) {
    return new Gs(e);
  }
}
function Yb(n, e = 'viewBox="0 0 40 40"') {
  return `url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" ${e}>${encodeURIComponent(n)}</svg>')`;
}
function Zn(n) {
  return Yb(`<path d="m0 2.5 l2 -1.5 l1 0 l2 1.5 l1 0" stroke="${n}" fill="none" stroke-width=".7"/>`, 'width="6" height="3"');
}
const Jb = /* @__PURE__ */ B.baseTheme({
  ".cm-diagnostic": {
    padding: "3px 6px 3px 8px",
    marginLeft: "-1px",
    display: "block",
    whiteSpace: "pre-wrap"
  },
  ".cm-diagnostic-error": { borderLeft: "5px solid #d11" },
  ".cm-diagnostic-warning": { borderLeft: "5px solid orange" },
  ".cm-diagnostic-info": { borderLeft: "5px solid #999" },
  ".cm-diagnostic-hint": { borderLeft: "5px solid #66d" },
  ".cm-diagnosticAction": {
    font: "inherit",
    border: "none",
    padding: "2px 4px",
    backgroundColor: "#444",
    color: "white",
    borderRadius: "3px",
    marginLeft: "8px",
    cursor: "pointer"
  },
  ".cm-diagnosticSource": {
    fontSize: "70%",
    opacity: 0.7
  },
  ".cm-lintRange": {
    backgroundPosition: "left bottom",
    backgroundRepeat: "repeat-x",
    paddingBottom: "0.7px"
  },
  ".cm-lintRange-error": { backgroundImage: /* @__PURE__ */ Zn("#d11") },
  ".cm-lintRange-warning": { backgroundImage: /* @__PURE__ */ Zn("orange") },
  ".cm-lintRange-info": { backgroundImage: /* @__PURE__ */ Zn("#999") },
  ".cm-lintRange-hint": { backgroundImage: /* @__PURE__ */ Zn("#66d") },
  ".cm-lintRange-active": { backgroundColor: "#ffdd9980" },
  ".cm-tooltip-lint": {
    padding: 0,
    margin: 0
  },
  ".cm-lintPoint": {
    position: "relative",
    "&:after": {
      content: '""',
      position: "absolute",
      bottom: 0,
      left: "-2px",
      borderLeft: "3px solid transparent",
      borderRight: "3px solid transparent",
      borderBottom: "4px solid #d11"
    }
  },
  ".cm-lintPoint-warning": {
    "&:after": { borderBottomColor: "orange" }
  },
  ".cm-lintPoint-info": {
    "&:after": { borderBottomColor: "#999" }
  },
  ".cm-lintPoint-hint": {
    "&:after": { borderBottomColor: "#66d" }
  },
  ".cm-panel.cm-panel-lint": {
    position: "relative",
    "& ul": {
      maxHeight: "100px",
      overflowY: "auto",
      "& [aria-selected]": {
        backgroundColor: "#ddd",
        "& u": { textDecoration: "underline" }
      },
      "&:focus [aria-selected]": {
        background_fallback: "#bdf",
        backgroundColor: "Highlight",
        color_fallback: "white",
        color: "HighlightText"
      },
      "& u": { textDecoration: "none" },
      padding: 0,
      margin: 0
    },
    "& [name=close]": {
      position: "absolute",
      top: "0",
      right: "2px",
      background: "inherit",
      border: "none",
      font: "inherit",
      padding: 0,
      margin: 0
    }
  }
}), Xb = [
  Pe,
  /* @__PURE__ */ B.decorations.compute([Pe], (n) => {
    let { selected: e, panel: t } = n.field(Pe);
    return !e || !t || e.from == e.to ? q.none : q.set([
      Wb.range(e.from, e.to)
    ]);
  }),
  /* @__PURE__ */ Jm(zb, { hideOn: Hb }),
  Jb
], Zb = /* @__PURE__ */ (() => [
  og(),
  Mm(),
  M0(),
  t0(),
  ym(),
  G.allowMultipleSelections.of(!0),
  Wg(),
  Qo(r0, { fallback: !0 }),
  Ab(),
  Fm(),
  Wm(),
  Ns.of([
    ...Ob,
    ...M1,
    ...I0,
    ...Zg,
    ...Nb,
    ...Ub
  ])
])(), mh = {
  python: () => import("./index-8d61f887.js").then((n) => n.python()),
  markdown: async () => {
    const [n, e] = await Promise.all([
      import("./index-b8615717.js"),
      import("./frontmatter-4dfee5e8.js")
    ]);
    return n.markdown({ extensions: [e.frontmatter] });
  },
  json: () => import("./index-55bcb1bf.js").then((n) => n.json()),
  html: () => import("./index-6c267d21.js").then((n) => n.html()),
  css: () => import("./index-8ba95b76.js").then((n) => n.css()),
  javascript: () => import("./index-9f51af45.js").then((n) => n.javascript()),
  typescript: () => import("./index-9f51af45.js").then(
    (n) => n.javascript({ typescript: !0 })
  ),
  yaml: () => import("./yaml-cef3802d.js").then(
    (n) => gi.define(n.yaml)
  ),
  dockerfile: () => import("./dockerfile-1dc69d82.js").then(
    (n) => gi.define(n.dockerFile)
  ),
  shell: () => import("./shell-9b920301.js").then(
    (n) => gi.define(n.shell)
  ),
  r: () => import("./r-1df568be.js").then(
    (n) => gi.define(n.r)
  )
}, Qb = {
  py: "python",
  md: "markdown",
  js: "javascript",
  ts: "typescript",
  sh: "shell"
};
async function $b(n) {
  const e = mh[n] || mh[Qb[n]] || void 0;
  if (e)
    return e();
}
const {
  SvelteComponent: ey,
  append: ty,
  attr: Cr,
  binding_callbacks: iy,
  detach: ny,
  element: gh,
  init: sy,
  insert: ry,
  noop: bh,
  safe_not_equal: oy
} = window.__gradio__svelte__internal, { createEventDispatcher: ly, onMount: ay } = window.__gradio__svelte__internal;
function hy(n) {
  let e, t, i;
  return {
    c() {
      e = gh("div"), t = gh("div"), Cr(t, "class", i = "codemirror-wrapper " + /*classNames*/
      n[0] + " svelte-1f1hlu0"), Cr(e, "class", "wrap svelte-1f1hlu0");
    },
    m(s, r) {
      ry(s, e, r), ty(e, t), n[13](t);
    },
    p(s, [r]) {
      r & /*classNames*/
      1 && i !== (i = "codemirror-wrapper " + /*classNames*/
      s[0] + " svelte-1f1hlu0") && Cr(t, "class", i);
    },
    i: bh,
    o: bh,
    d(s) {
      s && ny(e), n[13](null);
    }
  };
}
function Oo(n, e) {
  return n ?? e();
}
function hs(n) {
  let e, t = n[0], i = 1;
  for (; i < n.length; ) {
    const s = n[i], r = n[i + 1];
    if (i += 2, (s === "optionalAccess" || s === "optionalCall") && t == null)
      return;
    s === "access" || s === "optionalAccess" ? (e = t, t = r(t)) : (s === "call" || s === "optionalCall") && (t = r((...o) => t.call(e, ...o)), e = void 0);
  }
  return t;
}
function fy(n) {
  let e = n.dom.querySelectorAll(".cm-gutterElement");
  if (e.length === 0)
    return null;
  for (var t = 0; t < e.length; t++) {
    let i = e[t], s = Oo(hs([getComputedStyle, "call", (r) => r(i), "optionalAccess", (r) => r.height]), () => "0px");
    if (s != "0px")
      return s;
  }
  return null;
}
function cy(n, e, t) {
  let { classNames: i = "" } = e, { value: s = "" } = e, { dark_mode: r } = e, { basic: o = !0 } = e, { language: l } = e, { lines: a = 5 } = e, { extensions: h = [] } = e, { highlights: f = [] } = e, { useTab: c = !0 } = e, { readonly: u = !1 } = e, { placeholder: d = void 0 } = e;
  const p = ly();
  let m, g, y;
  async function k(M) {
    const Q = await $b(M);
    t(12, m = Q);
  }
  function w(M) {
    const Q = M.querySelectorAll(".cm-line");
    let j = "transparent";
    Q.forEach((se, re) => {
      const T = re + 1;
      let dt = Oo(
        hs([
          f,
          "access",
          (Ye) => Ye.find,
          "call",
          (Ye) => Ye(([Tn, ox]) => Tn === T),
          "optionalAccess",
          (Ye) => Ye[1]
        ]),
        () => j
      );
      se.style.backgroundColor = dt, j = dt;
    });
  }
  function S(M) {
    y && M !== y.state.doc.toString() && y.dispatch({
      changes: {
        from: 0,
        to: y.state.doc.length,
        insert: M
      }
    });
  }
  function _() {
    y && y.requestMeasure({ read: E });
  }
  function v() {
    const M = new B({
      parent: g,
      state: W(s)
    });
    return M.dom.addEventListener("focus", x, !0), M.dom.addEventListener("blur", P, !0), M;
  }
  function x() {
    p("focus");
  }
  function P() {
    p("blur");
  }
  function E(M) {
    let Q = M.dom.querySelectorAll(".cm-gutter"), j = a + 1, se = fy(M);
    if (!se)
      return null;
    for (var re = 0; re < Q.length; re++) {
      let T = Q[re];
      T.style.minHeight = `calc(${se} * ${j})`;
    }
    return w(g), null;
  }
  function I(M) {
    if (M.docChanged) {
      const j = M.state.doc.toString();
      t(2, s = j), p("change", j);
    }
    y.requestMeasure({ read: E });
  }
  function L() {
    return [
      ...H(o, c, d, u, m),
      R,
      ...K(),
      ...h
    ];
  }
  const R = B.theme({
    "&": {
      fontSize: "var(--text-sm)",
      backgroundColor: "var(--border-color-secondary)"
    },
    ".cm-content": {
      paddingTop: "5px",
      paddingBottom: "5px",
      color: "var(--body-text-color)",
      fontFamily: "var(--font-mono)",
      minHeight: "100%"
    },
    ".cm-gutters": {
      marginRight: "1px",
      borderRight: "1px solid var(--border-color-primary)",
      backgroundColor: "transparent",
      color: "var(--body-text-color-subdued)"
    },
    ".cm-focused": { outline: "none" },
    ".cm-scroller": { height: "auto" },
    ".cm-cursor": {
      borderLeftColor: "var(--body-text-color)"
    }
  });
  function W(M) {
    return G.create({
      doc: Oo(M, () => {
      }),
      extensions: L()
    });
  }
  function H(M, Q, j, se, re) {
    const T = [
      B.editable.of(!se),
      G.readOnly.of(se),
      B.contentAttributes.of({ "aria-label": "Code input container" })
    ];
    return M && T.push(Zb), Q && T.push(Ns.of([T1])), j && T.push(Em(j)), re && T.push(re), T.push(B.updateListener.of(I)), T;
  }
  function K() {
    const M = [];
    return r ? M.push(N1) : M.push(K1), M;
  }
  function ae() {
    hs([
      y,
      "optionalAccess",
      (M) => M.dispatch,
      "call",
      (M) => M({
        effects: z.reconfigure.of(L())
      })
    ]);
  }
  ay(() => (y = v(), () => hs([y, "optionalAccess", (M) => M.destroy, "call", (M) => M()])));
  function ce(M) {
    iy[M ? "unshift" : "push"](() => {
      g = M, t(1, g);
    });
  }
  return n.$$set = (M) => {
    "classNames" in M && t(0, i = M.classNames), "value" in M && t(2, s = M.value), "dark_mode" in M && t(3, r = M.dark_mode), "basic" in M && t(4, o = M.basic), "language" in M && t(5, l = M.language), "lines" in M && t(6, a = M.lines), "extensions" in M && t(7, h = M.extensions), "highlights" in M && t(8, f = M.highlights), "useTab" in M && t(9, c = M.useTab), "readonly" in M && t(10, u = M.readonly), "placeholder" in M && t(11, d = M.placeholder);
  }, n.$$.update = () => {
    n.$$.dirty & /*language*/
    32 && k(l), n.$$.dirty & /*lang_extension*/
    4096 && ae(), n.$$.dirty & /*value*/
    4 && S(s);
  }, _(), [
    i,
    g,
    s,
    r,
    o,
    l,
    a,
    h,
    f,
    c,
    u,
    d,
    m,
    ce
  ];
}
let uy = class extends ey {
  constructor(e) {
    super(), sy(this, e, cy, hy, oy, {
      classNames: 0,
      value: 2,
      dark_mode: 3,
      basic: 4,
      language: 5,
      lines: 6,
      extensions: 7,
      highlights: 8,
      useTab: 9,
      readonly: 10,
      placeholder: 11
    });
  }
};
function fs() {
}
const dy = (n) => n;
function py(n, e) {
  return n != n ? e == e : n !== e || n && typeof n == "object" || typeof n == "function";
}
const Yu = typeof window < "u";
let yh = Yu ? () => window.performance.now() : () => Date.now(), Ju = Yu ? (n) => requestAnimationFrame(n) : fs;
const Ci = /* @__PURE__ */ new Set();
function Xu(n) {
  Ci.forEach((e) => {
    e.c(n) || (Ci.delete(e), e.f());
  }), Ci.size !== 0 && Ju(Xu);
}
function my(n) {
  let e;
  return Ci.size === 0 && Ju(Xu), {
    promise: new Promise((t) => {
      Ci.add(e = { c: n, f: t });
    }),
    abort() {
      Ci.delete(e);
    }
  };
}
function Ms(n, { delay: e = 0, duration: t = 400, easing: i = dy } = {}) {
  const s = +getComputedStyle(n).opacity;
  return {
    delay: e,
    duration: t,
    easing: i,
    css: (r) => `opacity: ${r * s}`
  };
}
const ci = [];
function gy(n, e = fs) {
  let t;
  const i = /* @__PURE__ */ new Set();
  function s(l) {
    if (py(n, l) && (n = l, t)) {
      const a = !ci.length;
      for (const h of i)
        h[1](), ci.push(h, n);
      if (a) {
        for (let h = 0; h < ci.length; h += 2)
          ci[h][0](ci[h + 1]);
        ci.length = 0;
      }
    }
  }
  function r(l) {
    s(l(n));
  }
  function o(l, a = fs) {
    const h = [l, a];
    return i.add(h), i.size === 1 && (t = e(s, r) || fs), l(n), () => {
      i.delete(h), i.size === 0 && t && (t(), t = null);
    };
  }
  return { set: s, update: r, subscribe: o };
}
function wh(n) {
  return Object.prototype.toString.call(n) === "[object Date]";
}
function Bo(n, e, t, i) {
  if (typeof t == "number" || wh(t)) {
    const s = i - t, r = (t - e) / (n.dt || 1 / 60), o = n.opts.stiffness * s, l = n.opts.damping * r, a = (o - l) * n.inv_mass, h = (r + a) * n.dt;
    return Math.abs(h) < n.opts.precision && Math.abs(s) < n.opts.precision ? i : (n.settled = !1, wh(t) ? new Date(t.getTime() + h) : t + h);
  } else {
    if (Array.isArray(t))
      return t.map(
        (s, r) => Bo(n, e[r], t[r], i[r])
      );
    if (typeof t == "object") {
      const s = {};
      for (const r in t)
        s[r] = Bo(n, e[r], t[r], i[r]);
      return s;
    } else
      throw new Error(`Cannot spring ${typeof t} values`);
  }
}
function kh(n, e = {}) {
  const t = gy(n), { stiffness: i = 0.15, damping: s = 0.8, precision: r = 0.01 } = e;
  let o, l, a, h = n, f = n, c = 1, u = 0, d = !1;
  function p(g, y = {}) {
    f = g;
    const k = a = {};
    return n == null || y.hard || m.stiffness >= 1 && m.damping >= 1 ? (d = !0, o = yh(), h = g, t.set(n = f), Promise.resolve()) : (y.soft && (u = 1 / ((y.soft === !0 ? 0.5 : +y.soft) * 60), c = 0), l || (o = yh(), d = !1, l = my((w) => {
      if (d)
        return d = !1, l = null, !1;
      c = Math.min(c + u, 1);
      const S = {
        inv_mass: c,
        opts: m,
        settled: !0,
        dt: (w - o) * 60 / 1e3
      }, _ = Bo(S, h, n, f);
      return o = w, h = n, t.set(n = _), S.settled && (l = null), !S.settled;
    })), new Promise((w) => {
      l.promise.then(() => {
        k === a && w();
      });
    }));
  }
  const m = {
    set: p,
    update: (g, y) => p(g(f, n), y),
    subscribe: t.subscribe,
    stiffness: i,
    damping: s,
    precision: r
  };
  return m;
}
const {
  SvelteComponent: by,
  append: yy,
  attr: xt,
  detach: wy,
  init: ky,
  insert: vy,
  noop: Ar,
  safe_not_equal: xy,
  svg_element: vh
} = window.__gradio__svelte__internal;
function Sy(n) {
  let e, t;
  return {
    c() {
      e = vh("svg"), t = vh("polyline"), xt(t, "points", "20 6 9 17 4 12"), xt(e, "xmlns", "http://www.w3.org/2000/svg"), xt(e, "viewBox", "2 0 20 20"), xt(e, "fill", "none"), xt(e, "stroke", "currentColor"), xt(e, "stroke-width", "3"), xt(e, "stroke-linecap", "round"), xt(e, "stroke-linejoin", "round");
    },
    m(i, s) {
      vy(i, e, s), yy(e, t);
    },
    p: Ar,
    i: Ar,
    o: Ar,
    d(i) {
      i && wy(e);
    }
  };
}
class Zu extends by {
  constructor(e) {
    super(), ky(this, e, null, Sy, xy, {});
  }
}
const {
  SvelteComponent: _y,
  append: Cy,
  attr: Yi,
  detach: Ay,
  init: My,
  insert: Ty,
  noop: Mr,
  safe_not_equal: Dy,
  svg_element: xh
} = window.__gradio__svelte__internal;
function Oy(n) {
  let e, t;
  return {
    c() {
      e = xh("svg"), t = xh("path"), Yi(t, "fill", "currentColor"), Yi(t, "d", "m31 16l-7 7l-1.41-1.41L28.17 16l-5.58-5.59L24 9l7 7zM1 16l7-7l1.41 1.41L3.83 16l5.58 5.59L8 23l-7-7zm11.42 9.484L17.64 6l1.932.517L14.352 26z"), Yi(e, "width", "100%"), Yi(e, "height", "100%"), Yi(e, "viewBox", "0 0 32 32");
    },
    m(i, s) {
      Ty(i, e, s), Cy(e, t);
    },
    p: Mr,
    i: Mr,
    o: Mr,
    d(i) {
      i && Ay(e);
    }
  };
}
class Qu extends _y {
  constructor(e) {
    super(), My(this, e, null, Oy, Dy, {});
  }
}
const {
  SvelteComponent: By,
  append: Sh,
  attr: qt,
  detach: Py,
  init: Ly,
  insert: Ey,
  noop: Tr,
  safe_not_equal: Ry,
  svg_element: Dr
} = window.__gradio__svelte__internal;
function Iy(n) {
  let e, t, i;
  return {
    c() {
      e = Dr("svg"), t = Dr("path"), i = Dr("path"), qt(t, "fill", "currentColor"), qt(t, "d", "M28 10v18H10V10h18m0-2H10a2 2 0 0 0-2 2v18a2 2 0 0 0 2 2h18a2 2 0 0 0 2-2V10a2 2 0 0 0-2-2Z"), qt(i, "fill", "currentColor"), qt(i, "d", "M4 18H2V4a2 2 0 0 1 2-2h14v2H4Z"), qt(e, "xmlns", "http://www.w3.org/2000/svg"), qt(e, "viewBox", "0 0 33 33"), qt(e, "color", "currentColor");
    },
    m(s, r) {
      Ey(s, e, r), Sh(e, t), Sh(e, i);
    },
    p: Tr,
    i: Tr,
    o: Tr,
    d(s) {
      s && Py(e);
    }
  };
}
class Ny extends By {
  constructor(e) {
    super(), Ly(this, e, null, Iy, Ry, {});
  }
}
const {
  SvelteComponent: Fy,
  append: Hy,
  attr: ui,
  detach: Vy,
  init: Wy,
  insert: zy,
  noop: Or,
  safe_not_equal: qy,
  svg_element: _h
} = window.__gradio__svelte__internal;
function jy(n) {
  let e, t;
  return {
    c() {
      e = _h("svg"), t = _h("path"), ui(t, "fill", "currentColor"), ui(t, "d", "M26 24v4H6v-4H4v4a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2v-4zm0-10l-1.41-1.41L17 20.17V2h-2v18.17l-7.59-7.58L6 14l10 10l10-10z"), ui(e, "xmlns", "http://www.w3.org/2000/svg"), ui(e, "width", "100%"), ui(e, "height", "100%"), ui(e, "viewBox", "0 0 32 32");
    },
    m(i, s) {
      zy(i, e, s), Hy(e, t);
    },
    p: Or,
    i: Or,
    o: Or,
    d(i) {
      i && Vy(e);
    }
  };
}
class Ky extends Fy {
  constructor(e) {
    super(), Wy(this, e, null, jy, qy, {});
  }
}
const {
  SvelteComponent: Uy,
  add_render_callback: Gy,
  append: Yy,
  attr: Jt,
  check_outros: Jy,
  create_bidirectional_transition: Ch,
  create_component: $u,
  destroy_component: ed,
  detach: td,
  element: id,
  group_outros: Xy,
  init: Zy,
  insert: nd,
  listen: Qy,
  mount_component: sd,
  safe_not_equal: $y,
  space: ew,
  toggle_class: Ah,
  transition_in: $i,
  transition_out: cs
} = window.__gradio__svelte__internal, { onDestroy: tw } = window.__gradio__svelte__internal;
function Mh(n) {
  let e, t, i, s;
  return t = new Zu({}), {
    c() {
      e = id("span"), $u(t.$$.fragment), Jt(e, "class", "check svelte-qjb524"), Jt(e, "aria-roledescription", "Value copied"), Jt(e, "aria-label", "Copied");
    },
    m(r, o) {
      nd(r, e, o), sd(t, e, null), s = !0;
    },
    i(r) {
      s || ($i(t.$$.fragment, r), r && Gy(() => {
        s && (i || (i = Ch(e, Ms, {}, !0)), i.run(1));
      }), s = !0);
    },
    o(r) {
      cs(t.$$.fragment, r), r && (i || (i = Ch(e, Ms, {}, !1)), i.run(0)), s = !1;
    },
    d(r) {
      r && td(e), ed(t), r && i && i.end();
    }
  };
}
function iw(n) {
  let e, t, i, s, r, o;
  t = new Ny({});
  let l = (
    /*copied*/
    n[0] && Mh()
  );
  return {
    c() {
      e = id("button"), $u(t.$$.fragment), i = ew(), l && l.c(), Jt(e, "title", "copy"), Jt(e, "aria-roledescription", "Copy value"), Jt(e, "aria-label", "Copy"), Jt(e, "class", "svelte-qjb524"), Ah(
        e,
        "copied",
        /*copied*/
        n[0]
      );
    },
    m(a, h) {
      nd(a, e, h), sd(t, e, null), Yy(e, i), l && l.m(e, null), s = !0, r || (o = Qy(
        e,
        "click",
        /*handle_copy*/
        n[1]
      ), r = !0);
    },
    p(a, [h]) {
      /*copied*/
      a[0] ? l ? h & /*copied*/
      1 && $i(l, 1) : (l = Mh(), l.c(), $i(l, 1), l.m(e, null)) : l && (Xy(), cs(l, 1, 1, () => {
        l = null;
      }), Jy()), (!s || h & /*copied*/
      1) && Ah(
        e,
        "copied",
        /*copied*/
        a[0]
      );
    },
    i(a) {
      s || ($i(t.$$.fragment, a), $i(l), s = !0);
    },
    o(a) {
      cs(t.$$.fragment, a), cs(l), s = !1;
    },
    d(a) {
      a && td(e), ed(t), l && l.d(), r = !1, o();
    }
  };
}
function nw(n, e, t) {
  let i = !1, { value: s } = e, r;
  function o() {
    t(0, i = !0), r && clearTimeout(r), r = setTimeout(
      () => {
        t(0, i = !1);
      },
      2e3
    );
  }
  async function l() {
    "clipboard" in navigator && (await navigator.clipboard.writeText(s), o());
  }
  return tw(() => {
    r && clearTimeout(r);
  }), n.$$set = (a) => {
    "value" in a && t(2, s = a.value);
  }, [i, l, s];
}
class sw extends Uy {
  constructor(e) {
    super(), Zy(this, e, nw, iw, $y, { value: 2 });
  }
}
const { setContext: wx, getContext: rw } = window.__gradio__svelte__internal, ow = "WORKER_PROXY_CONTEXT_KEY";
function lw() {
  return rw(ow);
}
function aw(n) {
  return n.host === window.location.host || n.host === "localhost:7860" || n.host === "127.0.0.1:7860" || // Ref: https://github.com/gradio-app/gradio/blob/v3.32.0/js/app/src/Index.svelte#L194
  n.host === "lite.local";
}
function hw(n, e) {
  const t = e.toLowerCase();
  for (const [i, s] of Object.entries(n))
    if (i.toLowerCase() === t)
      return s;
}
function fw(n) {
  if (n == null)
    return !1;
  const e = new URL(n);
  return !(!aw(e) || e.protocol !== "http:" && e.protocol !== "https:");
}
const {
  SvelteComponent: cw,
  assign: Ts,
  check_outros: rd,
  compute_rest_props: Th,
  create_slot: ul,
  detach: Ys,
  element: od,
  empty: ld,
  exclude_internal_props: uw,
  get_all_dirty_from_scope: dl,
  get_slot_changes: pl,
  get_spread_update: ad,
  group_outros: hd,
  init: dw,
  insert: Js,
  listen: fd,
  prevent_default: pw,
  safe_not_equal: mw,
  set_attributes: Ds,
  transition_in: ni,
  transition_out: si,
  update_slot_base: ml
} = window.__gradio__svelte__internal, { createEventDispatcher: gw } = window.__gradio__svelte__internal;
function bw(n) {
  let e, t, i, s, r;
  const o = (
    /*#slots*/
    n[8].default
  ), l = ul(
    o,
    n,
    /*$$scope*/
    n[7],
    null
  );
  let a = [
    { href: (
      /*href*/
      n[0]
    ) },
    {
      target: t = typeof window < "u" && window.__is_colab__ ? "_blank" : null
    },
    { rel: "noopener noreferrer" },
    { download: (
      /*download*/
      n[1]
    ) },
    /*$$restProps*/
    n[6]
  ], h = {};
  for (let f = 0; f < a.length; f += 1)
    h = Ts(h, a[f]);
  return {
    c() {
      e = od("a"), l && l.c(), Ds(e, h);
    },
    m(f, c) {
      Js(f, e, c), l && l.m(e, null), i = !0, s || (r = fd(
        e,
        "click",
        /*dispatch*/
        n[3].bind(null, "click")
      ), s = !0);
    },
    p(f, c) {
      l && l.p && (!i || c & /*$$scope*/
      128) && ml(
        l,
        o,
        f,
        /*$$scope*/
        f[7],
        i ? pl(
          o,
          /*$$scope*/
          f[7],
          c,
          null
        ) : dl(
          /*$$scope*/
          f[7]
        ),
        null
      ), Ds(e, h = ad(a, [
        (!i || c & /*href*/
        1) && { href: (
          /*href*/
          f[0]
        ) },
        { target: t },
        { rel: "noopener noreferrer" },
        (!i || c & /*download*/
        2) && { download: (
          /*download*/
          f[1]
        ) },
        c & /*$$restProps*/
        64 && /*$$restProps*/
        f[6]
      ]));
    },
    i(f) {
      i || (ni(l, f), i = !0);
    },
    o(f) {
      si(l, f), i = !1;
    },
    d(f) {
      f && Ys(e), l && l.d(f), s = !1, r();
    }
  };
}
function yw(n) {
  let e, t, i, s;
  const r = [kw, ww], o = [];
  function l(a, h) {
    return (
      /*is_downloading*/
      a[2] ? 0 : 1
    );
  }
  return e = l(n), t = o[e] = r[e](n), {
    c() {
      t.c(), i = ld();
    },
    m(a, h) {
      o[e].m(a, h), Js(a, i, h), s = !0;
    },
    p(a, h) {
      let f = e;
      e = l(a), e === f ? o[e].p(a, h) : (hd(), si(o[f], 1, 1, () => {
        o[f] = null;
      }), rd(), t = o[e], t ? t.p(a, h) : (t = o[e] = r[e](a), t.c()), ni(t, 1), t.m(i.parentNode, i));
    },
    i(a) {
      s || (ni(t), s = !0);
    },
    o(a) {
      si(t), s = !1;
    },
    d(a) {
      a && Ys(i), o[e].d(a);
    }
  };
}
function ww(n) {
  let e, t, i, s;
  const r = (
    /*#slots*/
    n[8].default
  ), o = ul(
    r,
    n,
    /*$$scope*/
    n[7],
    null
  );
  let l = [
    /*$$restProps*/
    n[6],
    { href: (
      /*href*/
      n[0]
    ) }
  ], a = {};
  for (let h = 0; h < l.length; h += 1)
    a = Ts(a, l[h]);
  return {
    c() {
      e = od("a"), o && o.c(), Ds(e, a);
    },
    m(h, f) {
      Js(h, e, f), o && o.m(e, null), t = !0, i || (s = fd(e, "click", pw(
        /*wasm_click_handler*/
        n[5]
      )), i = !0);
    },
    p(h, f) {
      o && o.p && (!t || f & /*$$scope*/
      128) && ml(
        o,
        r,
        h,
        /*$$scope*/
        h[7],
        t ? pl(
          r,
          /*$$scope*/
          h[7],
          f,
          null
        ) : dl(
          /*$$scope*/
          h[7]
        ),
        null
      ), Ds(e, a = ad(l, [
        f & /*$$restProps*/
        64 && /*$$restProps*/
        h[6],
        (!t || f & /*href*/
        1) && { href: (
          /*href*/
          h[0]
        ) }
      ]));
    },
    i(h) {
      t || (ni(o, h), t = !0);
    },
    o(h) {
      si(o, h), t = !1;
    },
    d(h) {
      h && Ys(e), o && o.d(h), i = !1, s();
    }
  };
}
function kw(n) {
  let e;
  const t = (
    /*#slots*/
    n[8].default
  ), i = ul(
    t,
    n,
    /*$$scope*/
    n[7],
    null
  );
  return {
    c() {
      i && i.c();
    },
    m(s, r) {
      i && i.m(s, r), e = !0;
    },
    p(s, r) {
      i && i.p && (!e || r & /*$$scope*/
      128) && ml(
        i,
        t,
        s,
        /*$$scope*/
        s[7],
        e ? pl(
          t,
          /*$$scope*/
          s[7],
          r,
          null
        ) : dl(
          /*$$scope*/
          s[7]
        ),
        null
      );
    },
    i(s) {
      e || (ni(i, s), e = !0);
    },
    o(s) {
      si(i, s), e = !1;
    },
    d(s) {
      i && i.d(s);
    }
  };
}
function vw(n) {
  let e, t, i, s, r;
  const o = [yw, bw], l = [];
  function a(h, f) {
    return f & /*href*/
    1 && (e = null), e == null && (e = !!/*worker_proxy*/
    (h[4] && fw(
      /*href*/
      h[0]
    ))), e ? 0 : 1;
  }
  return t = a(n, -1), i = l[t] = o[t](n), {
    c() {
      i.c(), s = ld();
    },
    m(h, f) {
      l[t].m(h, f), Js(h, s, f), r = !0;
    },
    p(h, [f]) {
      let c = t;
      t = a(h, f), t === c ? l[t].p(h, f) : (hd(), si(l[c], 1, 1, () => {
        l[c] = null;
      }), rd(), i = l[t], i ? i.p(h, f) : (i = l[t] = o[t](h), i.c()), ni(i, 1), i.m(s.parentNode, s));
    },
    i(h) {
      r || (ni(i), r = !0);
    },
    o(h) {
      si(i), r = !1;
    },
    d(h) {
      h && Ys(s), l[t].d(h);
    }
  };
}
function xw(n, e, t) {
  const i = ["href", "download"];
  let s = Th(e, i), { $$slots: r = {}, $$scope: o } = e, { href: l = void 0 } = e, { download: a } = e;
  const h = gw();
  let f = !1;
  const c = lw();
  async function u() {
    if (f)
      return;
    if (h("click"), l == null)
      throw new Error("href is not defined.");
    if (c == null)
      throw new Error("Wasm worker proxy is not available.");
    const p = new URL(l).pathname;
    t(2, f = !0), c.httpRequest({
      method: "GET",
      path: p,
      headers: {},
      query_string: ""
    }).then((m) => {
      if (m.status !== 200)
        throw new Error(`Failed to get file ${p} from the Wasm worker.`);
      const g = new Blob(
        [m.body],
        {
          type: hw(m.headers, "content-type")
        }
      ), y = URL.createObjectURL(g), k = document.createElement("a");
      k.href = y, k.download = a, k.click(), URL.revokeObjectURL(y);
    }).finally(() => {
      t(2, f = !1);
    });
  }
  return n.$$set = (d) => {
    e = Ts(Ts({}, e), uw(d)), t(6, s = Th(e, i)), "href" in d && t(0, l = d.href), "download" in d && t(1, a = d.download), "$$scope" in d && t(7, o = d.$$scope);
  }, [
    l,
    a,
    f,
    h,
    c,
    u,
    s,
    o,
    r
  ];
}
class Sw extends cw {
  constructor(e) {
    super(), dw(this, e, xw, vw, mw, { href: 0, download: 1 });
  }
}
const {
  SvelteComponent: _w,
  add_render_callback: Cw,
  attr: cd,
  check_outros: Aw,
  create_bidirectional_transition: Dh,
  create_component: gl,
  destroy_component: bl,
  detach: Os,
  element: ud,
  empty: Mw,
  group_outros: Tw,
  init: Dw,
  insert: Bs,
  mount_component: yl,
  safe_not_equal: Ow,
  space: Bw,
  transition_in: yi,
  transition_out: an
} = window.__gradio__svelte__internal, { onDestroy: Pw } = window.__gradio__svelte__internal;
function Oh(n) {
  let e, t, i, s;
  return t = new Zu({}), {
    c() {
      e = ud("span"), gl(t.$$.fragment), cd(e, "class", "check svelte-peh06t");
    },
    m(r, o) {
      Bs(r, e, o), yl(t, e, null), s = !0;
    },
    i(r) {
      s || (yi(t.$$.fragment, r), r && Cw(() => {
        s && (i || (i = Dh(e, Ms, {}, !0)), i.run(1));
      }), s = !0);
    },
    o(r) {
      an(t.$$.fragment, r), r && (i || (i = Dh(e, Ms, {}, !1)), i.run(0)), s = !1;
    },
    d(r) {
      r && Os(e), bl(t), r && i && i.end();
    }
  };
}
function Lw(n) {
  let e, t, i, s;
  e = new Ky({});
  let r = (
    /*copied*/
    n[0] && Oh()
  );
  return {
    c() {
      gl(e.$$.fragment), t = Bw(), r && r.c(), i = Mw();
    },
    m(o, l) {
      yl(e, o, l), Bs(o, t, l), r && r.m(o, l), Bs(o, i, l), s = !0;
    },
    p(o, l) {
      /*copied*/
      o[0] ? r ? l & /*copied*/
      1 && yi(r, 1) : (r = Oh(), r.c(), yi(r, 1), r.m(i.parentNode, i)) : r && (Tw(), an(r, 1, 1, () => {
        r = null;
      }), Aw());
    },
    i(o) {
      s || (yi(e.$$.fragment, o), yi(r), s = !0);
    },
    o(o) {
      an(e.$$.fragment, o), an(r), s = !1;
    },
    d(o) {
      o && (Os(t), Os(i)), bl(e, o), r && r.d(o);
    }
  };
}
function Ew(n) {
  let e, t, i;
  return t = new Sw({
    props: {
      download: "file." + /*ext*/
      n[2],
      href: (
        /*download_value*/
        n[1]
      ),
      $$slots: { default: [Lw] },
      $$scope: { ctx: n }
    }
  }), t.$on(
    "click",
    /*copy_feedback*/
    n[3]
  ), {
    c() {
      e = ud("div"), gl(t.$$.fragment), cd(e, "class", "container svelte-peh06t");
    },
    m(s, r) {
      Bs(s, e, r), yl(t, e, null), i = !0;
    },
    p(s, [r]) {
      const o = {};
      r & /*ext*/
      4 && (o.download = "file." + /*ext*/
      s[2]), r & /*download_value*/
      2 && (o.href = /*download_value*/
      s[1]), r & /*$$scope, copied*/
      129 && (o.$$scope = { dirty: r, ctx: s }), t.$set(o);
    },
    i(s) {
      i || (yi(t.$$.fragment, s), i = !0);
    },
    o(s) {
      an(t.$$.fragment, s), i = !1;
    },
    d(s) {
      s && Os(e), bl(t);
    }
  };
}
function Rw(n) {
  return {
    py: "py",
    python: "py",
    md: "md",
    markdown: "md",
    json: "json",
    html: "html",
    css: "css",
    js: "js",
    javascript: "js",
    ts: "ts",
    typescript: "ts",
    yaml: "yaml",
    yml: "yml",
    dockerfile: "dockerfile",
    sh: "sh",
    shell: "sh",
    r: "r"
  }[n] || "txt";
}
function Iw(n, e, t) {
  let i, s, { value: r } = e, { language: o } = e, l = !1, a;
  function h() {
    t(0, l = !0), a && clearTimeout(a), a = setTimeout(
      () => {
        t(0, l = !1);
      },
      2e3
    );
  }
  return Pw(() => {
    a && clearTimeout(a);
  }), n.$$set = (f) => {
    "value" in f && t(4, r = f.value), "language" in f && t(5, o = f.language);
  }, n.$$.update = () => {
    n.$$.dirty & /*language*/
    32 && t(2, i = Rw(o)), n.$$.dirty & /*value*/
    16 && t(1, s = URL.createObjectURL(new Blob([r])));
  }, [l, s, i, h, r, o];
}
class Nw extends _w {
  constructor(e) {
    super(), Dw(this, e, Iw, Ew, Ow, { value: 4, language: 5 });
  }
}
const {
  SvelteComponent: Fw,
  append: Hw,
  attr: Vw,
  create_component: Bh,
  destroy_component: Ph,
  detach: Ww,
  element: zw,
  init: qw,
  insert: jw,
  mount_component: Lh,
  safe_not_equal: Kw,
  space: Uw,
  transition_in: Eh,
  transition_out: Rh
} = window.__gradio__svelte__internal;
function Gw(n) {
  let e, t, i, s, r;
  return t = new Nw({
    props: {
      value: (
        /*value*/
        n[0]
      ),
      language: (
        /*language*/
        n[1]
      )
    }
  }), s = new sw({ props: { value: (
    /*value*/
    n[0]
  ) } }), {
    c() {
      e = zw("div"), Bh(t.$$.fragment), i = Uw(), Bh(s.$$.fragment), Vw(e, "class", "svelte-1bqqv16");
    },
    m(o, l) {
      jw(o, e, l), Lh(t, e, null), Hw(e, i), Lh(s, e, null), r = !0;
    },
    p(o, [l]) {
      const a = {};
      l & /*value*/
      1 && (a.value = /*value*/
      o[0]), l & /*language*/
      2 && (a.language = /*language*/
      o[1]), t.$set(a);
      const h = {};
      l & /*value*/
      1 && (h.value = /*value*/
      o[0]), s.$set(h);
    },
    i(o) {
      r || (Eh(t.$$.fragment, o), Eh(s.$$.fragment, o), r = !0);
    },
    o(o) {
      Rh(t.$$.fragment, o), Rh(s.$$.fragment, o), r = !1;
    },
    d(o) {
      o && Ww(e), Ph(t), Ph(s);
    }
  };
}
function Yw(n, e, t) {
  let { value: i } = e, { language: s } = e;
  return n.$$set = (r) => {
    "value" in r && t(0, i = r.value), "language" in r && t(1, s = r.language);
  }, [i, s];
}
class Jw extends Fw {
  constructor(e) {
    super(), qw(this, e, Yw, Gw, Kw, { value: 0, language: 1 });
  }
}
function wi(n) {
  let e = ["", "k", "M", "G", "T", "P", "E", "Z"], t = 0;
  for (; n > 1e3 && t < e.length - 1; )
    n /= 1e3, t++;
  let i = e[t];
  return (Number.isInteger(n) ? n : n.toFixed(1)) + i;
}
const {
  SvelteComponent: Xw,
  append: ze,
  attr: U,
  component_subscribe: Ih,
  detach: Zw,
  element: Qw,
  init: $w,
  insert: ek,
  noop: Nh,
  safe_not_equal: tk,
  set_style: Qn,
  svg_element: qe,
  toggle_class: Fh
} = window.__gradio__svelte__internal, { onMount: ik } = window.__gradio__svelte__internal;
function nk(n) {
  let e, t, i, s, r, o, l, a, h, f, c, u;
  return {
    c() {
      e = Qw("div"), t = qe("svg"), i = qe("g"), s = qe("path"), r = qe("path"), o = qe("path"), l = qe("path"), a = qe("g"), h = qe("path"), f = qe("path"), c = qe("path"), u = qe("path"), U(s, "d", "M255.926 0.754768L509.702 139.936V221.027L255.926 81.8465V0.754768Z"), U(s, "fill", "#FF7C00"), U(s, "fill-opacity", "0.4"), U(s, "class", "svelte-43sxxs"), U(r, "d", "M509.69 139.936L254.981 279.641V361.255L509.69 221.55V139.936Z"), U(r, "fill", "#FF7C00"), U(r, "class", "svelte-43sxxs"), U(o, "d", "M0.250138 139.937L254.981 279.641V361.255L0.250138 221.55V139.937Z"), U(o, "fill", "#FF7C00"), U(o, "fill-opacity", "0.4"), U(o, "class", "svelte-43sxxs"), U(l, "d", "M255.923 0.232622L0.236328 139.936V221.55L255.923 81.8469V0.232622Z"), U(l, "fill", "#FF7C00"), U(l, "class", "svelte-43sxxs"), Qn(i, "transform", "translate(" + /*$top*/
      n[1][0] + "px, " + /*$top*/
      n[1][1] + "px)"), U(h, "d", "M255.926 141.5L509.702 280.681V361.773L255.926 222.592V141.5Z"), U(h, "fill", "#FF7C00"), U(h, "fill-opacity", "0.4"), U(h, "class", "svelte-43sxxs"), U(f, "d", "M509.69 280.679L254.981 420.384V501.998L509.69 362.293V280.679Z"), U(f, "fill", "#FF7C00"), U(f, "class", "svelte-43sxxs"), U(c, "d", "M0.250138 280.681L254.981 420.386V502L0.250138 362.295V280.681Z"), U(c, "fill", "#FF7C00"), U(c, "fill-opacity", "0.4"), U(c, "class", "svelte-43sxxs"), U(u, "d", "M255.923 140.977L0.236328 280.68V362.294L255.923 222.591V140.977Z"), U(u, "fill", "#FF7C00"), U(u, "class", "svelte-43sxxs"), Qn(a, "transform", "translate(" + /*$bottom*/
      n[2][0] + "px, " + /*$bottom*/
      n[2][1] + "px)"), U(t, "viewBox", "-1200 -1200 3000 3000"), U(t, "fill", "none"), U(t, "xmlns", "http://www.w3.org/2000/svg"), U(t, "class", "svelte-43sxxs"), U(e, "class", "svelte-43sxxs"), Fh(
        e,
        "margin",
        /*margin*/
        n[0]
      );
    },
    m(d, p) {
      ek(d, e, p), ze(e, t), ze(t, i), ze(i, s), ze(i, r), ze(i, o), ze(i, l), ze(t, a), ze(a, h), ze(a, f), ze(a, c), ze(a, u);
    },
    p(d, [p]) {
      p & /*$top*/
      2 && Qn(i, "transform", "translate(" + /*$top*/
      d[1][0] + "px, " + /*$top*/
      d[1][1] + "px)"), p & /*$bottom*/
      4 && Qn(a, "transform", "translate(" + /*$bottom*/
      d[2][0] + "px, " + /*$bottom*/
      d[2][1] + "px)"), p & /*margin*/
      1 && Fh(
        e,
        "margin",
        /*margin*/
        d[0]
      );
    },
    i: Nh,
    o: Nh,
    d(d) {
      d && Zw(e);
    }
  };
}
function sk(n, e, t) {
  let i, s, { margin: r = !0 } = e;
  const o = kh([0, 0]);
  Ih(n, o, (u) => t(1, i = u));
  const l = kh([0, 0]);
  Ih(n, l, (u) => t(2, s = u));
  let a;
  async function h() {
    await Promise.all([o.set([125, 140]), l.set([-125, -140])]), await Promise.all([o.set([-125, 140]), l.set([125, -140])]), await Promise.all([o.set([-125, 0]), l.set([125, -0])]), await Promise.all([o.set([125, 0]), l.set([-125, 0])]);
  }
  async function f() {
    await h(), a || f();
  }
  async function c() {
    await Promise.all([o.set([125, 0]), l.set([-125, 0])]), f();
  }
  return ik(() => (c(), () => a = !0)), n.$$set = (u) => {
    "margin" in u && t(0, r = u.margin);
  }, [r, i, s, o, l];
}
class rk extends Xw {
  constructor(e) {
    super(), $w(this, e, sk, nk, tk, { margin: 0 });
  }
}
const {
  SvelteComponent: ok,
  append: Xt,
  attr: lt,
  binding_callbacks: Hh,
  check_outros: dd,
  create_component: lk,
  create_slot: ak,
  destroy_component: hk,
  destroy_each: pd,
  detach: N,
  element: pt,
  empty: Hi,
  ensure_array_like: Ps,
  get_all_dirty_from_scope: fk,
  get_slot_changes: ck,
  group_outros: md,
  init: uk,
  insert: F,
  mount_component: dk,
  noop: Po,
  safe_not_equal: pk,
  set_data: He,
  set_style: Pt,
  space: at,
  text: ne,
  toggle_class: Le,
  transition_in: Pi,
  transition_out: Li,
  update_slot_base: mk
} = window.__gradio__svelte__internal, { tick: gk } = window.__gradio__svelte__internal, { onDestroy: bk } = window.__gradio__svelte__internal, yk = (n) => ({}), Vh = (n) => ({});
function Wh(n, e, t) {
  const i = n.slice();
  return i[38] = e[t], i[40] = t, i;
}
function zh(n, e, t) {
  const i = n.slice();
  return i[38] = e[t], i;
}
function wk(n) {
  let e, t = (
    /*i18n*/
    n[1]("common.error") + ""
  ), i, s, r;
  const o = (
    /*#slots*/
    n[29].error
  ), l = ak(
    o,
    n,
    /*$$scope*/
    n[28],
    Vh
  );
  return {
    c() {
      e = pt("span"), i = ne(t), s = at(), l && l.c(), lt(e, "class", "error svelte-1txqlrd");
    },
    m(a, h) {
      F(a, e, h), Xt(e, i), F(a, s, h), l && l.m(a, h), r = !0;
    },
    p(a, h) {
      (!r || h[0] & /*i18n*/
      2) && t !== (t = /*i18n*/
      a[1]("common.error") + "") && He(i, t), l && l.p && (!r || h[0] & /*$$scope*/
      268435456) && mk(
        l,
        o,
        a,
        /*$$scope*/
        a[28],
        r ? ck(
          o,
          /*$$scope*/
          a[28],
          h,
          yk
        ) : fk(
          /*$$scope*/
          a[28]
        ),
        Vh
      );
    },
    i(a) {
      r || (Pi(l, a), r = !0);
    },
    o(a) {
      Li(l, a), r = !1;
    },
    d(a) {
      a && (N(e), N(s)), l && l.d(a);
    }
  };
}
function kk(n) {
  let e, t, i, s, r, o, l, a, h, f = (
    /*variant*/
    n[8] === "default" && /*show_eta_bar*/
    n[18] && /*show_progress*/
    n[6] === "full" && qh(n)
  );
  function c(w, S) {
    if (
      /*progress*/
      w[7]
    )
      return Sk;
    if (
      /*queue_position*/
      w[2] !== null && /*queue_size*/
      w[3] !== void 0 && /*queue_position*/
      w[2] >= 0
    )
      return xk;
    if (
      /*queue_position*/
      w[2] === 0
    )
      return vk;
  }
  let u = c(n), d = u && u(n), p = (
    /*timer*/
    n[5] && Uh(n)
  );
  const m = [Mk, Ak], g = [];
  function y(w, S) {
    return (
      /*last_progress_level*/
      w[15] != null ? 0 : (
        /*show_progress*/
        w[6] === "full" ? 1 : -1
      )
    );
  }
  ~(r = y(n)) && (o = g[r] = m[r](n));
  let k = !/*timer*/
  n[5] && $h(n);
  return {
    c() {
      f && f.c(), e = at(), t = pt("div"), d && d.c(), i = at(), p && p.c(), s = at(), o && o.c(), l = at(), k && k.c(), a = Hi(), lt(t, "class", "progress-text svelte-1txqlrd"), Le(
        t,
        "meta-text-center",
        /*variant*/
        n[8] === "center"
      ), Le(
        t,
        "meta-text",
        /*variant*/
        n[8] === "default"
      );
    },
    m(w, S) {
      f && f.m(w, S), F(w, e, S), F(w, t, S), d && d.m(t, null), Xt(t, i), p && p.m(t, null), F(w, s, S), ~r && g[r].m(w, S), F(w, l, S), k && k.m(w, S), F(w, a, S), h = !0;
    },
    p(w, S) {
      /*variant*/
      w[8] === "default" && /*show_eta_bar*/
      w[18] && /*show_progress*/
      w[6] === "full" ? f ? f.p(w, S) : (f = qh(w), f.c(), f.m(e.parentNode, e)) : f && (f.d(1), f = null), u === (u = c(w)) && d ? d.p(w, S) : (d && d.d(1), d = u && u(w), d && (d.c(), d.m(t, i))), /*timer*/
      w[5] ? p ? p.p(w, S) : (p = Uh(w), p.c(), p.m(t, null)) : p && (p.d(1), p = null), (!h || S[0] & /*variant*/
      256) && Le(
        t,
        "meta-text-center",
        /*variant*/
        w[8] === "center"
      ), (!h || S[0] & /*variant*/
      256) && Le(
        t,
        "meta-text",
        /*variant*/
        w[8] === "default"
      );
      let _ = r;
      r = y(w), r === _ ? ~r && g[r].p(w, S) : (o && (md(), Li(g[_], 1, 1, () => {
        g[_] = null;
      }), dd()), ~r ? (o = g[r], o ? o.p(w, S) : (o = g[r] = m[r](w), o.c()), Pi(o, 1), o.m(l.parentNode, l)) : o = null), /*timer*/
      w[5] ? k && (k.d(1), k = null) : k ? k.p(w, S) : (k = $h(w), k.c(), k.m(a.parentNode, a));
    },
    i(w) {
      h || (Pi(o), h = !0);
    },
    o(w) {
      Li(o), h = !1;
    },
    d(w) {
      w && (N(e), N(t), N(s), N(l), N(a)), f && f.d(w), d && d.d(), p && p.d(), ~r && g[r].d(w), k && k.d(w);
    }
  };
}
function qh(n) {
  let e, t = `translateX(${/*eta_level*/
  (n[17] || 0) * 100 - 100}%)`;
  return {
    c() {
      e = pt("div"), lt(e, "class", "eta-bar svelte-1txqlrd"), Pt(e, "transform", t);
    },
    m(i, s) {
      F(i, e, s);
    },
    p(i, s) {
      s[0] & /*eta_level*/
      131072 && t !== (t = `translateX(${/*eta_level*/
      (i[17] || 0) * 100 - 100}%)`) && Pt(e, "transform", t);
    },
    d(i) {
      i && N(e);
    }
  };
}
function vk(n) {
  let e;
  return {
    c() {
      e = ne("processing |");
    },
    m(t, i) {
      F(t, e, i);
    },
    p: Po,
    d(t) {
      t && N(e);
    }
  };
}
function xk(n) {
  let e, t = (
    /*queue_position*/
    n[2] + 1 + ""
  ), i, s, r, o;
  return {
    c() {
      e = ne("queue: "), i = ne(t), s = ne("/"), r = ne(
        /*queue_size*/
        n[3]
      ), o = ne(" |");
    },
    m(l, a) {
      F(l, e, a), F(l, i, a), F(l, s, a), F(l, r, a), F(l, o, a);
    },
    p(l, a) {
      a[0] & /*queue_position*/
      4 && t !== (t = /*queue_position*/
      l[2] + 1 + "") && He(i, t), a[0] & /*queue_size*/
      8 && He(
        r,
        /*queue_size*/
        l[3]
      );
    },
    d(l) {
      l && (N(e), N(i), N(s), N(r), N(o));
    }
  };
}
function Sk(n) {
  let e, t = Ps(
    /*progress*/
    n[7]
  ), i = [];
  for (let s = 0; s < t.length; s += 1)
    i[s] = Kh(zh(n, t, s));
  return {
    c() {
      for (let s = 0; s < i.length; s += 1)
        i[s].c();
      e = Hi();
    },
    m(s, r) {
      for (let o = 0; o < i.length; o += 1)
        i[o] && i[o].m(s, r);
      F(s, e, r);
    },
    p(s, r) {
      if (r[0] & /*progress*/
      128) {
        t = Ps(
          /*progress*/
          s[7]
        );
        let o;
        for (o = 0; o < t.length; o += 1) {
          const l = zh(s, t, o);
          i[o] ? i[o].p(l, r) : (i[o] = Kh(l), i[o].c(), i[o].m(e.parentNode, e));
        }
        for (; o < i.length; o += 1)
          i[o].d(1);
        i.length = t.length;
      }
    },
    d(s) {
      s && N(e), pd(i, s);
    }
  };
}
function jh(n) {
  let e, t = (
    /*p*/
    n[38].unit + ""
  ), i, s, r = " ", o;
  function l(f, c) {
    return (
      /*p*/
      f[38].length != null ? Ck : _k
    );
  }
  let a = l(n), h = a(n);
  return {
    c() {
      h.c(), e = at(), i = ne(t), s = ne(" | "), o = ne(r);
    },
    m(f, c) {
      h.m(f, c), F(f, e, c), F(f, i, c), F(f, s, c), F(f, o, c);
    },
    p(f, c) {
      a === (a = l(f)) && h ? h.p(f, c) : (h.d(1), h = a(f), h && (h.c(), h.m(e.parentNode, e))), c[0] & /*progress*/
      128 && t !== (t = /*p*/
      f[38].unit + "") && He(i, t);
    },
    d(f) {
      f && (N(e), N(i), N(s), N(o)), h.d(f);
    }
  };
}
function _k(n) {
  let e = wi(
    /*p*/
    n[38].index || 0
  ) + "", t;
  return {
    c() {
      t = ne(e);
    },
    m(i, s) {
      F(i, t, s);
    },
    p(i, s) {
      s[0] & /*progress*/
      128 && e !== (e = wi(
        /*p*/
        i[38].index || 0
      ) + "") && He(t, e);
    },
    d(i) {
      i && N(t);
    }
  };
}
function Ck(n) {
  let e = wi(
    /*p*/
    n[38].index || 0
  ) + "", t, i, s = wi(
    /*p*/
    n[38].length
  ) + "", r;
  return {
    c() {
      t = ne(e), i = ne("/"), r = ne(s);
    },
    m(o, l) {
      F(o, t, l), F(o, i, l), F(o, r, l);
    },
    p(o, l) {
      l[0] & /*progress*/
      128 && e !== (e = wi(
        /*p*/
        o[38].index || 0
      ) + "") && He(t, e), l[0] & /*progress*/
      128 && s !== (s = wi(
        /*p*/
        o[38].length
      ) + "") && He(r, s);
    },
    d(o) {
      o && (N(t), N(i), N(r));
    }
  };
}
function Kh(n) {
  let e, t = (
    /*p*/
    n[38].index != null && jh(n)
  );
  return {
    c() {
      t && t.c(), e = Hi();
    },
    m(i, s) {
      t && t.m(i, s), F(i, e, s);
    },
    p(i, s) {
      /*p*/
      i[38].index != null ? t ? t.p(i, s) : (t = jh(i), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(i) {
      i && N(e), t && t.d(i);
    }
  };
}
function Uh(n) {
  let e, t = (
    /*eta*/
    n[0] ? `/${/*formatted_eta*/
    n[19]}` : ""
  ), i, s;
  return {
    c() {
      e = ne(
        /*formatted_timer*/
        n[20]
      ), i = ne(t), s = ne("s");
    },
    m(r, o) {
      F(r, e, o), F(r, i, o), F(r, s, o);
    },
    p(r, o) {
      o[0] & /*formatted_timer*/
      1048576 && He(
        e,
        /*formatted_timer*/
        r[20]
      ), o[0] & /*eta, formatted_eta*/
      524289 && t !== (t = /*eta*/
      r[0] ? `/${/*formatted_eta*/
      r[19]}` : "") && He(i, t);
    },
    d(r) {
      r && (N(e), N(i), N(s));
    }
  };
}
function Ak(n) {
  let e, t;
  return e = new rk({
    props: { margin: (
      /*variant*/
      n[8] === "default"
    ) }
  }), {
    c() {
      lk(e.$$.fragment);
    },
    m(i, s) {
      dk(e, i, s), t = !0;
    },
    p(i, s) {
      const r = {};
      s[0] & /*variant*/
      256 && (r.margin = /*variant*/
      i[8] === "default"), e.$set(r);
    },
    i(i) {
      t || (Pi(e.$$.fragment, i), t = !0);
    },
    o(i) {
      Li(e.$$.fragment, i), t = !1;
    },
    d(i) {
      hk(e, i);
    }
  };
}
function Mk(n) {
  let e, t, i, s, r, o = `${/*last_progress_level*/
  n[15] * 100}%`, l = (
    /*progress*/
    n[7] != null && Gh(n)
  );
  return {
    c() {
      e = pt("div"), t = pt("div"), l && l.c(), i = at(), s = pt("div"), r = pt("div"), lt(t, "class", "progress-level-inner svelte-1txqlrd"), lt(r, "class", "progress-bar svelte-1txqlrd"), Pt(r, "width", o), lt(s, "class", "progress-bar-wrap svelte-1txqlrd"), lt(e, "class", "progress-level svelte-1txqlrd");
    },
    m(a, h) {
      F(a, e, h), Xt(e, t), l && l.m(t, null), Xt(e, i), Xt(e, s), Xt(s, r), n[30](r);
    },
    p(a, h) {
      /*progress*/
      a[7] != null ? l ? l.p(a, h) : (l = Gh(a), l.c(), l.m(t, null)) : l && (l.d(1), l = null), h[0] & /*last_progress_level*/
      32768 && o !== (o = `${/*last_progress_level*/
      a[15] * 100}%`) && Pt(r, "width", o);
    },
    i: Po,
    o: Po,
    d(a) {
      a && N(e), l && l.d(), n[30](null);
    }
  };
}
function Gh(n) {
  let e, t = Ps(
    /*progress*/
    n[7]
  ), i = [];
  for (let s = 0; s < t.length; s += 1)
    i[s] = Qh(Wh(n, t, s));
  return {
    c() {
      for (let s = 0; s < i.length; s += 1)
        i[s].c();
      e = Hi();
    },
    m(s, r) {
      for (let o = 0; o < i.length; o += 1)
        i[o] && i[o].m(s, r);
      F(s, e, r);
    },
    p(s, r) {
      if (r[0] & /*progress_level, progress*/
      16512) {
        t = Ps(
          /*progress*/
          s[7]
        );
        let o;
        for (o = 0; o < t.length; o += 1) {
          const l = Wh(s, t, o);
          i[o] ? i[o].p(l, r) : (i[o] = Qh(l), i[o].c(), i[o].m(e.parentNode, e));
        }
        for (; o < i.length; o += 1)
          i[o].d(1);
        i.length = t.length;
      }
    },
    d(s) {
      s && N(e), pd(i, s);
    }
  };
}
function Yh(n) {
  let e, t, i, s, r = (
    /*i*/
    n[40] !== 0 && Tk()
  ), o = (
    /*p*/
    n[38].desc != null && Jh(n)
  ), l = (
    /*p*/
    n[38].desc != null && /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null && Xh()
  ), a = (
    /*progress_level*/
    n[14] != null && Zh(n)
  );
  return {
    c() {
      r && r.c(), e = at(), o && o.c(), t = at(), l && l.c(), i = at(), a && a.c(), s = Hi();
    },
    m(h, f) {
      r && r.m(h, f), F(h, e, f), o && o.m(h, f), F(h, t, f), l && l.m(h, f), F(h, i, f), a && a.m(h, f), F(h, s, f);
    },
    p(h, f) {
      /*p*/
      h[38].desc != null ? o ? o.p(h, f) : (o = Jh(h), o.c(), o.m(t.parentNode, t)) : o && (o.d(1), o = null), /*p*/
      h[38].desc != null && /*progress_level*/
      h[14] && /*progress_level*/
      h[14][
        /*i*/
        h[40]
      ] != null ? l || (l = Xh(), l.c(), l.m(i.parentNode, i)) : l && (l.d(1), l = null), /*progress_level*/
      h[14] != null ? a ? a.p(h, f) : (a = Zh(h), a.c(), a.m(s.parentNode, s)) : a && (a.d(1), a = null);
    },
    d(h) {
      h && (N(e), N(t), N(i), N(s)), r && r.d(h), o && o.d(h), l && l.d(h), a && a.d(h);
    }
  };
}
function Tk(n) {
  let e;
  return {
    c() {
      e = ne(" /");
    },
    m(t, i) {
      F(t, e, i);
    },
    d(t) {
      t && N(e);
    }
  };
}
function Jh(n) {
  let e = (
    /*p*/
    n[38].desc + ""
  ), t;
  return {
    c() {
      t = ne(e);
    },
    m(i, s) {
      F(i, t, s);
    },
    p(i, s) {
      s[0] & /*progress*/
      128 && e !== (e = /*p*/
      i[38].desc + "") && He(t, e);
    },
    d(i) {
      i && N(t);
    }
  };
}
function Xh(n) {
  let e;
  return {
    c() {
      e = ne("-");
    },
    m(t, i) {
      F(t, e, i);
    },
    d(t) {
      t && N(e);
    }
  };
}
function Zh(n) {
  let e = (100 * /*progress_level*/
  (n[14][
    /*i*/
    n[40]
  ] || 0)).toFixed(1) + "", t, i;
  return {
    c() {
      t = ne(e), i = ne("%");
    },
    m(s, r) {
      F(s, t, r), F(s, i, r);
    },
    p(s, r) {
      r[0] & /*progress_level*/
      16384 && e !== (e = (100 * /*progress_level*/
      (s[14][
        /*i*/
        s[40]
      ] || 0)).toFixed(1) + "") && He(t, e);
    },
    d(s) {
      s && (N(t), N(i));
    }
  };
}
function Qh(n) {
  let e, t = (
    /*p*/
    (n[38].desc != null || /*progress_level*/
    n[14] && /*progress_level*/
    n[14][
      /*i*/
      n[40]
    ] != null) && Yh(n)
  );
  return {
    c() {
      t && t.c(), e = Hi();
    },
    m(i, s) {
      t && t.m(i, s), F(i, e, s);
    },
    p(i, s) {
      /*p*/
      i[38].desc != null || /*progress_level*/
      i[14] && /*progress_level*/
      i[14][
        /*i*/
        i[40]
      ] != null ? t ? t.p(i, s) : (t = Yh(i), t.c(), t.m(e.parentNode, e)) : t && (t.d(1), t = null);
    },
    d(i) {
      i && N(e), t && t.d(i);
    }
  };
}
function $h(n) {
  let e, t;
  return {
    c() {
      e = pt("p"), t = ne(
        /*loading_text*/
        n[9]
      ), lt(e, "class", "loading svelte-1txqlrd");
    },
    m(i, s) {
      F(i, e, s), Xt(e, t);
    },
    p(i, s) {
      s[0] & /*loading_text*/
      512 && He(
        t,
        /*loading_text*/
        i[9]
      );
    },
    d(i) {
      i && N(e);
    }
  };
}
function Dk(n) {
  let e, t, i, s, r;
  const o = [kk, wk], l = [];
  function a(h, f) {
    return (
      /*status*/
      h[4] === "pending" ? 0 : (
        /*status*/
        h[4] === "error" ? 1 : -1
      )
    );
  }
  return ~(t = a(n)) && (i = l[t] = o[t](n)), {
    c() {
      e = pt("div"), i && i.c(), lt(e, "class", s = "wrap " + /*variant*/
      n[8] + " " + /*show_progress*/
      n[6] + " svelte-1txqlrd"), Le(e, "hide", !/*status*/
      n[4] || /*status*/
      n[4] === "complete" || /*show_progress*/
      n[6] === "hidden"), Le(
        e,
        "translucent",
        /*variant*/
        n[8] === "center" && /*status*/
        (n[4] === "pending" || /*status*/
        n[4] === "error") || /*translucent*/
        n[11] || /*show_progress*/
        n[6] === "minimal"
      ), Le(
        e,
        "generating",
        /*status*/
        n[4] === "generating"
      ), Le(
        e,
        "border",
        /*border*/
        n[12]
      ), Pt(
        e,
        "position",
        /*absolute*/
        n[10] ? "absolute" : "static"
      ), Pt(
        e,
        "padding",
        /*absolute*/
        n[10] ? "0" : "var(--size-8) 0"
      );
    },
    m(h, f) {
      F(h, e, f), ~t && l[t].m(e, null), n[31](e), r = !0;
    },
    p(h, f) {
      let c = t;
      t = a(h), t === c ? ~t && l[t].p(h, f) : (i && (md(), Li(l[c], 1, 1, () => {
        l[c] = null;
      }), dd()), ~t ? (i = l[t], i ? i.p(h, f) : (i = l[t] = o[t](h), i.c()), Pi(i, 1), i.m(e, null)) : i = null), (!r || f[0] & /*variant, show_progress*/
      320 && s !== (s = "wrap " + /*variant*/
      h[8] + " " + /*show_progress*/
      h[6] + " svelte-1txqlrd")) && lt(e, "class", s), (!r || f[0] & /*variant, show_progress, status, show_progress*/
      336) && Le(e, "hide", !/*status*/
      h[4] || /*status*/
      h[4] === "complete" || /*show_progress*/
      h[6] === "hidden"), (!r || f[0] & /*variant, show_progress, variant, status, translucent, show_progress*/
      2384) && Le(
        e,
        "translucent",
        /*variant*/
        h[8] === "center" && /*status*/
        (h[4] === "pending" || /*status*/
        h[4] === "error") || /*translucent*/
        h[11] || /*show_progress*/
        h[6] === "minimal"
      ), (!r || f[0] & /*variant, show_progress, status*/
      336) && Le(
        e,
        "generating",
        /*status*/
        h[4] === "generating"
      ), (!r || f[0] & /*variant, show_progress, border*/
      4416) && Le(
        e,
        "border",
        /*border*/
        h[12]
      ), f[0] & /*absolute*/
      1024 && Pt(
        e,
        "position",
        /*absolute*/
        h[10] ? "absolute" : "static"
      ), f[0] & /*absolute*/
      1024 && Pt(
        e,
        "padding",
        /*absolute*/
        h[10] ? "0" : "var(--size-8) 0"
      );
    },
    i(h) {
      r || (Pi(i), r = !0);
    },
    o(h) {
      Li(i), r = !1;
    },
    d(h) {
      h && N(e), ~t && l[t].d(), n[31](null);
    }
  };
}
let $n = [], Br = !1;
async function Ok(n, e = !0) {
  if (!(window.__gradio_mode__ === "website" || window.__gradio_mode__ !== "app" && e !== !0)) {
    if ($n.push(n), !Br)
      Br = !0;
    else
      return;
    await gk(), requestAnimationFrame(() => {
      let t = [0, 0];
      for (let i = 0; i < $n.length; i++) {
        const r = $n[i].getBoundingClientRect();
        (i === 0 || r.top + window.scrollY <= t[0]) && (t[0] = r.top + window.scrollY, t[1] = i);
      }
      window.scrollTo({ top: t[0] - 20, behavior: "smooth" }), Br = !1, $n = [];
    });
  }
}
function Bk(n, e, t) {
  let i, { $$slots: s = {}, $$scope: r } = e, { i18n: o } = e, { eta: l = null } = e, { queue_position: a } = e, { queue_size: h } = e, { status: f } = e, { scroll_to_output: c = !1 } = e, { timer: u = !0 } = e, { show_progress: d = "full" } = e, { message: p = null } = e, { progress: m = null } = e, { variant: g = "default" } = e, { loading_text: y = "Loading..." } = e, { absolute: k = !0 } = e, { translucent: w = !1 } = e, { border: S = !1 } = e, { autoscroll: _ } = e, v, x = !1, P = 0, E = 0, I = null, L = null, R = 0, W = null, H, K = null, ae = !0;
  const ce = () => {
    t(0, l = t(26, I = t(19, j = null))), t(24, P = performance.now()), t(25, E = 0), x = !0, M();
  };
  function M() {
    requestAnimationFrame(() => {
      t(25, E = (performance.now() - P) / 1e3), x && M();
    });
  }
  function Q() {
    t(25, E = 0), t(0, l = t(26, I = t(19, j = null))), x && (x = !1);
  }
  bk(() => {
    x && Q();
  });
  let j = null;
  function se(T) {
    Hh[T ? "unshift" : "push"](() => {
      K = T, t(16, K), t(7, m), t(14, W), t(15, H);
    });
  }
  function re(T) {
    Hh[T ? "unshift" : "push"](() => {
      v = T, t(13, v);
    });
  }
  return n.$$set = (T) => {
    "i18n" in T && t(1, o = T.i18n), "eta" in T && t(0, l = T.eta), "queue_position" in T && t(2, a = T.queue_position), "queue_size" in T && t(3, h = T.queue_size), "status" in T && t(4, f = T.status), "scroll_to_output" in T && t(21, c = T.scroll_to_output), "timer" in T && t(5, u = T.timer), "show_progress" in T && t(6, d = T.show_progress), "message" in T && t(22, p = T.message), "progress" in T && t(7, m = T.progress), "variant" in T && t(8, g = T.variant), "loading_text" in T && t(9, y = T.loading_text), "absolute" in T && t(10, k = T.absolute), "translucent" in T && t(11, w = T.translucent), "border" in T && t(12, S = T.border), "autoscroll" in T && t(23, _ = T.autoscroll), "$$scope" in T && t(28, r = T.$$scope);
  }, n.$$.update = () => {
    n.$$.dirty[0] & /*eta, old_eta, timer_start, eta_from_start*/
    218103809 && (l === null && t(0, l = I), l != null && I !== l && (t(27, L = (performance.now() - P) / 1e3 + l), t(19, j = L.toFixed(1)), t(26, I = l))), n.$$.dirty[0] & /*eta_from_start, timer_diff*/
    167772160 && t(17, R = L === null || L <= 0 || !E ? null : Math.min(E / L, 1)), n.$$.dirty[0] & /*progress*/
    128 && m != null && t(18, ae = !1), n.$$.dirty[0] & /*progress, progress_level, progress_bar, last_progress_level*/
    114816 && (m != null ? t(14, W = m.map((T) => {
      if (T.index != null && T.length != null)
        return T.index / T.length;
      if (T.progress != null)
        return T.progress;
    })) : t(14, W = null), W ? (t(15, H = W[W.length - 1]), K && (H === 0 ? t(16, K.style.transition = "0", K) : t(16, K.style.transition = "150ms", K))) : t(15, H = void 0)), n.$$.dirty[0] & /*status*/
    16 && (f === "pending" ? ce() : Q()), n.$$.dirty[0] & /*el, scroll_to_output, status, autoscroll*/
    10493968 && v && c && (f === "pending" || f === "complete") && Ok(v, _), n.$$.dirty[0] & /*status, message*/
    4194320, n.$$.dirty[0] & /*timer_diff*/
    33554432 && t(20, i = E.toFixed(1));
  }, [
    l,
    o,
    a,
    h,
    f,
    u,
    d,
    m,
    g,
    y,
    k,
    w,
    S,
    v,
    W,
    H,
    K,
    R,
    ae,
    j,
    i,
    c,
    p,
    _,
    P,
    E,
    I,
    L,
    r,
    s,
    se,
    re
  ];
}
class Pk extends ok {
  constructor(e) {
    super(), uk(
      this,
      e,
      Bk,
      Dk,
      pk,
      {
        i18n: 1,
        eta: 0,
        queue_position: 2,
        queue_size: 3,
        status: 4,
        scroll_to_output: 21,
        timer: 5,
        show_progress: 6,
        message: 22,
        progress: 7,
        variant: 8,
        loading_text: 9,
        absolute: 10,
        translucent: 11,
        border: 12,
        autoscroll: 23
      },
      null,
      [-1, -1]
    );
  }
}
const {
  SvelteComponent: Lk,
  assign: Ek,
  create_slot: Rk,
  detach: Ik,
  element: Nk,
  get_all_dirty_from_scope: Fk,
  get_slot_changes: Hk,
  get_spread_update: Vk,
  init: Wk,
  insert: zk,
  safe_not_equal: qk,
  set_dynamic_element_data: ef,
  set_style: Te,
  toggle_class: St,
  transition_in: gd,
  transition_out: bd,
  update_slot_base: jk
} = window.__gradio__svelte__internal;
function Kk(n) {
  let e, t, i;
  const s = (
    /*#slots*/
    n[18].default
  ), r = Rk(
    s,
    n,
    /*$$scope*/
    n[17],
    null
  );
  let o = [
    { "data-testid": (
      /*test_id*/
      n[7]
    ) },
    { id: (
      /*elem_id*/
      n[2]
    ) },
    {
      class: t = "block " + /*elem_classes*/
      n[3].join(" ") + " svelte-1t38q2d"
    }
  ], l = {};
  for (let a = 0; a < o.length; a += 1)
    l = Ek(l, o[a]);
  return {
    c() {
      e = Nk(
        /*tag*/
        n[14]
      ), r && r.c(), ef(
        /*tag*/
        n[14]
      )(e, l), St(
        e,
        "hidden",
        /*visible*/
        n[10] === !1
      ), St(
        e,
        "padded",
        /*padding*/
        n[6]
      ), St(
        e,
        "border_focus",
        /*border_mode*/
        n[5] === "focus"
      ), St(e, "hide-container", !/*explicit_call*/
      n[8] && !/*container*/
      n[9]), Te(
        e,
        "height",
        /*get_dimension*/
        n[15](
          /*height*/
          n[0]
        )
      ), Te(e, "width", typeof /*width*/
      n[1] == "number" ? `calc(min(${/*width*/
      n[1]}px, 100%))` : (
        /*get_dimension*/
        n[15](
          /*width*/
          n[1]
        )
      )), Te(
        e,
        "border-style",
        /*variant*/
        n[4]
      ), Te(
        e,
        "overflow",
        /*allow_overflow*/
        n[11] ? "visible" : "hidden"
      ), Te(
        e,
        "flex-grow",
        /*scale*/
        n[12]
      ), Te(e, "min-width", `calc(min(${/*min_width*/
      n[13]}px, 100%))`), Te(e, "border-width", "var(--block-border-width)");
    },
    m(a, h) {
      zk(a, e, h), r && r.m(e, null), i = !0;
    },
    p(a, h) {
      r && r.p && (!i || h & /*$$scope*/
      131072) && jk(
        r,
        s,
        a,
        /*$$scope*/
        a[17],
        i ? Hk(
          s,
          /*$$scope*/
          a[17],
          h,
          null
        ) : Fk(
          /*$$scope*/
          a[17]
        ),
        null
      ), ef(
        /*tag*/
        a[14]
      )(e, l = Vk(o, [
        (!i || h & /*test_id*/
        128) && { "data-testid": (
          /*test_id*/
          a[7]
        ) },
        (!i || h & /*elem_id*/
        4) && { id: (
          /*elem_id*/
          a[2]
        ) },
        (!i || h & /*elem_classes*/
        8 && t !== (t = "block " + /*elem_classes*/
        a[3].join(" ") + " svelte-1t38q2d")) && { class: t }
      ])), St(
        e,
        "hidden",
        /*visible*/
        a[10] === !1
      ), St(
        e,
        "padded",
        /*padding*/
        a[6]
      ), St(
        e,
        "border_focus",
        /*border_mode*/
        a[5] === "focus"
      ), St(e, "hide-container", !/*explicit_call*/
      a[8] && !/*container*/
      a[9]), h & /*height*/
      1 && Te(
        e,
        "height",
        /*get_dimension*/
        a[15](
          /*height*/
          a[0]
        )
      ), h & /*width*/
      2 && Te(e, "width", typeof /*width*/
      a[1] == "number" ? `calc(min(${/*width*/
      a[1]}px, 100%))` : (
        /*get_dimension*/
        a[15](
          /*width*/
          a[1]
        )
      )), h & /*variant*/
      16 && Te(
        e,
        "border-style",
        /*variant*/
        a[4]
      ), h & /*allow_overflow*/
      2048 && Te(
        e,
        "overflow",
        /*allow_overflow*/
        a[11] ? "visible" : "hidden"
      ), h & /*scale*/
      4096 && Te(
        e,
        "flex-grow",
        /*scale*/
        a[12]
      ), h & /*min_width*/
      8192 && Te(e, "min-width", `calc(min(${/*min_width*/
      a[13]}px, 100%))`);
    },
    i(a) {
      i || (gd(r, a), i = !0);
    },
    o(a) {
      bd(r, a), i = !1;
    },
    d(a) {
      a && Ik(e), r && r.d(a);
    }
  };
}
function Uk(n) {
  let e, t = (
    /*tag*/
    n[14] && Kk(n)
  );
  return {
    c() {
      t && t.c();
    },
    m(i, s) {
      t && t.m(i, s), e = !0;
    },
    p(i, [s]) {
      /*tag*/
      i[14] && t.p(i, s);
    },
    i(i) {
      e || (gd(t, i), e = !0);
    },
    o(i) {
      bd(t, i), e = !1;
    },
    d(i) {
      t && t.d(i);
    }
  };
}
function Gk(n, e, t) {
  let { $$slots: i = {}, $$scope: s } = e, { height: r = void 0 } = e, { width: o = void 0 } = e, { elem_id: l = "" } = e, { elem_classes: a = [] } = e, { variant: h = "solid" } = e, { border_mode: f = "base" } = e, { padding: c = !0 } = e, { type: u = "normal" } = e, { test_id: d = void 0 } = e, { explicit_call: p = !1 } = e, { container: m = !0 } = e, { visible: g = !0 } = e, { allow_overflow: y = !0 } = e, { scale: k = null } = e, { min_width: w = 0 } = e, S = u === "fieldset" ? "fieldset" : "div";
  const _ = (v) => {
    if (v !== void 0) {
      if (typeof v == "number")
        return v + "px";
      if (typeof v == "string")
        return v;
    }
  };
  return n.$$set = (v) => {
    "height" in v && t(0, r = v.height), "width" in v && t(1, o = v.width), "elem_id" in v && t(2, l = v.elem_id), "elem_classes" in v && t(3, a = v.elem_classes), "variant" in v && t(4, h = v.variant), "border_mode" in v && t(5, f = v.border_mode), "padding" in v && t(6, c = v.padding), "type" in v && t(16, u = v.type), "test_id" in v && t(7, d = v.test_id), "explicit_call" in v && t(8, p = v.explicit_call), "container" in v && t(9, m = v.container), "visible" in v && t(10, g = v.visible), "allow_overflow" in v && t(11, y = v.allow_overflow), "scale" in v && t(12, k = v.scale), "min_width" in v && t(13, w = v.min_width), "$$scope" in v && t(17, s = v.$$scope);
  }, [
    r,
    o,
    l,
    a,
    h,
    f,
    c,
    d,
    p,
    m,
    g,
    y,
    k,
    w,
    S,
    _,
    u,
    s,
    i
  ];
}
class Yk extends Lk {
  constructor(e) {
    super(), Wk(this, e, Gk, Uk, qk, {
      height: 0,
      width: 1,
      elem_id: 2,
      elem_classes: 3,
      variant: 4,
      border_mode: 5,
      padding: 6,
      type: 16,
      test_id: 7,
      explicit_call: 8,
      container: 9,
      visible: 10,
      allow_overflow: 11,
      scale: 12,
      min_width: 13
    });
  }
}
const {
  SvelteComponent: Jk,
  append: Pr,
  attr: es,
  create_component: Xk,
  destroy_component: Zk,
  detach: Qk,
  element: tf,
  init: $k,
  insert: ev,
  mount_component: tv,
  safe_not_equal: iv,
  set_data: nv,
  space: sv,
  text: rv,
  toggle_class: _t,
  transition_in: ov,
  transition_out: lv
} = window.__gradio__svelte__internal;
function av(n) {
  let e, t, i, s, r, o;
  return i = new /*Icon*/
  n[1]({}), {
    c() {
      e = tf("label"), t = tf("span"), Xk(i.$$.fragment), s = sv(), r = rv(
        /*label*/
        n[0]
      ), es(t, "class", "svelte-9gxdi0"), es(e, "for", ""), es(e, "data-testid", "block-label"), es(e, "class", "svelte-9gxdi0"), _t(e, "hide", !/*show_label*/
      n[2]), _t(e, "sr-only", !/*show_label*/
      n[2]), _t(
        e,
        "float",
        /*float*/
        n[4]
      ), _t(
        e,
        "hide-label",
        /*disable*/
        n[3]
      );
    },
    m(l, a) {
      ev(l, e, a), Pr(e, t), tv(i, t, null), Pr(e, s), Pr(e, r), o = !0;
    },
    p(l, [a]) {
      (!o || a & /*label*/
      1) && nv(
        r,
        /*label*/
        l[0]
      ), (!o || a & /*show_label*/
      4) && _t(e, "hide", !/*show_label*/
      l[2]), (!o || a & /*show_label*/
      4) && _t(e, "sr-only", !/*show_label*/
      l[2]), (!o || a & /*float*/
      16) && _t(
        e,
        "float",
        /*float*/
        l[4]
      ), (!o || a & /*disable*/
      8) && _t(
        e,
        "hide-label",
        /*disable*/
        l[3]
      );
    },
    i(l) {
      o || (ov(i.$$.fragment, l), o = !0);
    },
    o(l) {
      lv(i.$$.fragment, l), o = !1;
    },
    d(l) {
      l && Qk(e), Zk(i);
    }
  };
}
function hv(n, e, t) {
  let { label: i = null } = e, { Icon: s } = e, { show_label: r = !0 } = e, { disable: o = !1 } = e, { float: l = !0 } = e;
  return n.$$set = (a) => {
    "label" in a && t(0, i = a.label), "Icon" in a && t(1, s = a.Icon), "show_label" in a && t(2, r = a.show_label), "disable" in a && t(3, o = a.disable), "float" in a && t(4, l = a.float);
  }, [i, s, r, o, l];
}
class fv extends Jk {
  constructor(e) {
    super(), $k(this, e, hv, av, iv, {
      label: 0,
      Icon: 1,
      show_label: 2,
      disable: 3,
      float: 4
    });
  }
}
const {
  SvelteComponent: cv,
  append: uv,
  attr: Lr,
  binding_callbacks: dv,
  create_slot: pv,
  detach: mv,
  element: nf,
  get_all_dirty_from_scope: gv,
  get_slot_changes: bv,
  init: yv,
  insert: wv,
  safe_not_equal: kv,
  toggle_class: Ct,
  transition_in: vv,
  transition_out: xv,
  update_slot_base: Sv
} = window.__gradio__svelte__internal;
function _v(n) {
  let e, t, i;
  const s = (
    /*#slots*/
    n[5].default
  ), r = pv(
    s,
    n,
    /*$$scope*/
    n[4],
    null
  );
  return {
    c() {
      e = nf("div"), t = nf("div"), r && r.c(), Lr(t, "class", "icon svelte-3w3rth"), Lr(e, "class", "empty svelte-3w3rth"), Lr(e, "aria-label", "Empty value"), Ct(
        e,
        "small",
        /*size*/
        n[0] === "small"
      ), Ct(
        e,
        "large",
        /*size*/
        n[0] === "large"
      ), Ct(
        e,
        "unpadded_box",
        /*unpadded_box*/
        n[1]
      ), Ct(
        e,
        "small_parent",
        /*parent_height*/
        n[3]
      );
    },
    m(o, l) {
      wv(o, e, l), uv(e, t), r && r.m(t, null), n[6](e), i = !0;
    },
    p(o, [l]) {
      r && r.p && (!i || l & /*$$scope*/
      16) && Sv(
        r,
        s,
        o,
        /*$$scope*/
        o[4],
        i ? bv(
          s,
          /*$$scope*/
          o[4],
          l,
          null
        ) : gv(
          /*$$scope*/
          o[4]
        ),
        null
      ), (!i || l & /*size*/
      1) && Ct(
        e,
        "small",
        /*size*/
        o[0] === "small"
      ), (!i || l & /*size*/
      1) && Ct(
        e,
        "large",
        /*size*/
        o[0] === "large"
      ), (!i || l & /*unpadded_box*/
      2) && Ct(
        e,
        "unpadded_box",
        /*unpadded_box*/
        o[1]
      ), (!i || l & /*parent_height*/
      8) && Ct(
        e,
        "small_parent",
        /*parent_height*/
        o[3]
      );
    },
    i(o) {
      i || (vv(r, o), i = !0);
    },
    o(o) {
      xv(r, o), i = !1;
    },
    d(o) {
      o && mv(e), r && r.d(o), n[6](null);
    }
  };
}
function Cv(n) {
  let e, t = n[0], i = 1;
  for (; i < n.length; ) {
    const s = n[i], r = n[i + 1];
    if (i += 2, (s === "optionalAccess" || s === "optionalCall") && t == null)
      return;
    s === "access" || s === "optionalAccess" ? (e = t, t = r(t)) : (s === "call" || s === "optionalCall") && (t = r((...o) => t.call(e, ...o)), e = void 0);
  }
  return t;
}
function Av(n, e, t) {
  let i, { $$slots: s = {}, $$scope: r } = e, { size: o = "small" } = e, { unpadded_box: l = !1 } = e, a;
  function h(c) {
    if (!c)
      return !1;
    const { height: u } = c.getBoundingClientRect(), { height: d } = Cv([
      c,
      "access",
      (p) => p.parentElement,
      "optionalAccess",
      (p) => p.getBoundingClientRect,
      "call",
      (p) => p()
    ]) || { height: u };
    return u > d + 2;
  }
  function f(c) {
    dv[c ? "unshift" : "push"](() => {
      a = c, t(2, a);
    });
  }
  return n.$$set = (c) => {
    "size" in c && t(0, o = c.size), "unpadded_box" in c && t(1, l = c.unpadded_box), "$$scope" in c && t(4, r = c.$$scope);
  }, n.$$.update = () => {
    n.$$.dirty & /*el*/
    4 && t(3, i = h(a));
  }, [o, l, a, i, r, s, f];
}
class Mv extends cv {
  constructor(e) {
    super(), yv(this, e, Av, _v, kv, { size: 0, unpadded_box: 1 });
  }
}
const Tv = [
  { color: "red", primary: 600, secondary: 100 },
  { color: "green", primary: 600, secondary: 100 },
  { color: "blue", primary: 600, secondary: 100 },
  { color: "yellow", primary: 500, secondary: 100 },
  { color: "purple", primary: 600, secondary: 100 },
  { color: "teal", primary: 600, secondary: 100 },
  { color: "orange", primary: 600, secondary: 100 },
  { color: "cyan", primary: 600, secondary: 100 },
  { color: "lime", primary: 500, secondary: 100 },
  { color: "pink", primary: 600, secondary: 100 }
], sf = {
  inherit: "inherit",
  current: "currentColor",
  transparent: "transparent",
  black: "#000",
  white: "#fff",
  slate: {
    50: "#f8fafc",
    100: "#f1f5f9",
    200: "#e2e8f0",
    300: "#cbd5e1",
    400: "#94a3b8",
    500: "#64748b",
    600: "#475569",
    700: "#334155",
    800: "#1e293b",
    900: "#0f172a",
    950: "#020617"
  },
  gray: {
    50: "#f9fafb",
    100: "#f3f4f6",
    200: "#e5e7eb",
    300: "#d1d5db",
    400: "#9ca3af",
    500: "#6b7280",
    600: "#4b5563",
    700: "#374151",
    800: "#1f2937",
    900: "#111827",
    950: "#030712"
  },
  zinc: {
    50: "#fafafa",
    100: "#f4f4f5",
    200: "#e4e4e7",
    300: "#d4d4d8",
    400: "#a1a1aa",
    500: "#71717a",
    600: "#52525b",
    700: "#3f3f46",
    800: "#27272a",
    900: "#18181b",
    950: "#09090b"
  },
  neutral: {
    50: "#fafafa",
    100: "#f5f5f5",
    200: "#e5e5e5",
    300: "#d4d4d4",
    400: "#a3a3a3",
    500: "#737373",
    600: "#525252",
    700: "#404040",
    800: "#262626",
    900: "#171717",
    950: "#0a0a0a"
  },
  stone: {
    50: "#fafaf9",
    100: "#f5f5f4",
    200: "#e7e5e4",
    300: "#d6d3d1",
    400: "#a8a29e",
    500: "#78716c",
    600: "#57534e",
    700: "#44403c",
    800: "#292524",
    900: "#1c1917",
    950: "#0c0a09"
  },
  red: {
    50: "#fef2f2",
    100: "#fee2e2",
    200: "#fecaca",
    300: "#fca5a5",
    400: "#f87171",
    500: "#ef4444",
    600: "#dc2626",
    700: "#b91c1c",
    800: "#991b1b",
    900: "#7f1d1d",
    950: "#450a0a"
  },
  orange: {
    50: "#fff7ed",
    100: "#ffedd5",
    200: "#fed7aa",
    300: "#fdba74",
    400: "#fb923c",
    500: "#f97316",
    600: "#ea580c",
    700: "#c2410c",
    800: "#9a3412",
    900: "#7c2d12",
    950: "#431407"
  },
  amber: {
    50: "#fffbeb",
    100: "#fef3c7",
    200: "#fde68a",
    300: "#fcd34d",
    400: "#fbbf24",
    500: "#f59e0b",
    600: "#d97706",
    700: "#b45309",
    800: "#92400e",
    900: "#78350f",
    950: "#451a03"
  },
  yellow: {
    50: "#fefce8",
    100: "#fef9c3",
    200: "#fef08a",
    300: "#fde047",
    400: "#facc15",
    500: "#eab308",
    600: "#ca8a04",
    700: "#a16207",
    800: "#854d0e",
    900: "#713f12",
    950: "#422006"
  },
  lime: {
    50: "#f7fee7",
    100: "#ecfccb",
    200: "#d9f99d",
    300: "#bef264",
    400: "#a3e635",
    500: "#84cc16",
    600: "#65a30d",
    700: "#4d7c0f",
    800: "#3f6212",
    900: "#365314",
    950: "#1a2e05"
  },
  green: {
    50: "#f0fdf4",
    100: "#dcfce7",
    200: "#bbf7d0",
    300: "#86efac",
    400: "#4ade80",
    500: "#22c55e",
    600: "#16a34a",
    700: "#15803d",
    800: "#166534",
    900: "#14532d",
    950: "#052e16"
  },
  emerald: {
    50: "#ecfdf5",
    100: "#d1fae5",
    200: "#a7f3d0",
    300: "#6ee7b7",
    400: "#34d399",
    500: "#10b981",
    600: "#059669",
    700: "#047857",
    800: "#065f46",
    900: "#064e3b",
    950: "#022c22"
  },
  teal: {
    50: "#f0fdfa",
    100: "#ccfbf1",
    200: "#99f6e4",
    300: "#5eead4",
    400: "#2dd4bf",
    500: "#14b8a6",
    600: "#0d9488",
    700: "#0f766e",
    800: "#115e59",
    900: "#134e4a",
    950: "#042f2e"
  },
  cyan: {
    50: "#ecfeff",
    100: "#cffafe",
    200: "#a5f3fc",
    300: "#67e8f9",
    400: "#22d3ee",
    500: "#06b6d4",
    600: "#0891b2",
    700: "#0e7490",
    800: "#155e75",
    900: "#164e63",
    950: "#083344"
  },
  sky: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
    950: "#082f49"
  },
  blue: {
    50: "#eff6ff",
    100: "#dbeafe",
    200: "#bfdbfe",
    300: "#93c5fd",
    400: "#60a5fa",
    500: "#3b82f6",
    600: "#2563eb",
    700: "#1d4ed8",
    800: "#1e40af",
    900: "#1e3a8a",
    950: "#172554"
  },
  indigo: {
    50: "#eef2ff",
    100: "#e0e7ff",
    200: "#c7d2fe",
    300: "#a5b4fc",
    400: "#818cf8",
    500: "#6366f1",
    600: "#4f46e5",
    700: "#4338ca",
    800: "#3730a3",
    900: "#312e81",
    950: "#1e1b4b"
  },
  violet: {
    50: "#f5f3ff",
    100: "#ede9fe",
    200: "#ddd6fe",
    300: "#c4b5fd",
    400: "#a78bfa",
    500: "#8b5cf6",
    600: "#7c3aed",
    700: "#6d28d9",
    800: "#5b21b6",
    900: "#4c1d95",
    950: "#2e1065"
  },
  purple: {
    50: "#faf5ff",
    100: "#f3e8ff",
    200: "#e9d5ff",
    300: "#d8b4fe",
    400: "#c084fc",
    500: "#a855f7",
    600: "#9333ea",
    700: "#7e22ce",
    800: "#6b21a8",
    900: "#581c87",
    950: "#3b0764"
  },
  fuchsia: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
    950: "#4a044e"
  },
  pink: {
    50: "#fdf2f8",
    100: "#fce7f3",
    200: "#fbcfe8",
    300: "#f9a8d4",
    400: "#f472b6",
    500: "#ec4899",
    600: "#db2777",
    700: "#be185d",
    800: "#9d174d",
    900: "#831843",
    950: "#500724"
  },
  rose: {
    50: "#fff1f2",
    100: "#ffe4e6",
    200: "#fecdd3",
    300: "#fda4af",
    400: "#fb7185",
    500: "#f43f5e",
    600: "#e11d48",
    700: "#be123c",
    800: "#9f1239",
    900: "#881337",
    950: "#4c0519"
  }
};
Tv.reduce(
  (n, { color: e, primary: t, secondary: i }) => ({
    ...n,
    [e]: {
      primary: sf[e][t],
      secondary: sf[e][i]
    }
  }),
  {}
);
const {
  SvelteComponent: Dv,
  append: Ov,
  attr: Bv,
  detach: Pv,
  element: Lv,
  init: Ev,
  insert: Rv,
  noop: rf,
  safe_not_equal: Iv,
  set_data: Nv,
  text: Fv,
  toggle_class: di
} = window.__gradio__svelte__internal;
function Hv(n) {
  let e, t = (
    /*value*/
    (n[0] ? (
      /*value*/
      n[0]
    ) : "") + ""
  ), i;
  return {
    c() {
      e = Lv("pre"), i = Fv(t), Bv(e, "class", "svelte-1ioyqn2"), di(
        e,
        "table",
        /*type*/
        n[1] === "table"
      ), di(
        e,
        "gallery",
        /*type*/
        n[1] === "gallery"
      ), di(
        e,
        "selected",
        /*selected*/
        n[2]
      );
    },
    m(s, r) {
      Rv(s, e, r), Ov(e, i);
    },
    p(s, [r]) {
      r & /*value*/
      1 && t !== (t = /*value*/
      (s[0] ? (
        /*value*/
        s[0]
      ) : "") + "") && Nv(i, t), r & /*type*/
      2 && di(
        e,
        "table",
        /*type*/
        s[1] === "table"
      ), r & /*type*/
      2 && di(
        e,
        "gallery",
        /*type*/
        s[1] === "gallery"
      ), r & /*selected*/
      4 && di(
        e,
        "selected",
        /*selected*/
        s[2]
      );
    },
    i: rf,
    o: rf,
    d(s) {
      s && Pv(e);
    }
  };
}
function Vv(n, e, t) {
  let { value: i } = e, { type: s } = e, { selected: r = !1 } = e;
  return n.$$set = (o) => {
    "value" in o && t(0, i = o.value), "type" in o && t(1, s = o.type), "selected" in o && t(2, r = o.selected);
  }, [i, s, r];
}
class kx extends Dv {
  constructor(e) {
    super(), Ev(this, e, Vv, Hv, Iv, { value: 0, type: 1, selected: 2 });
  }
}
const {
  SvelteComponent: Wv,
  add_flush_callback: zv,
  assign: qv,
  bind: jv,
  binding_callbacks: Kv,
  check_outros: Uv,
  create_component: ri,
  destroy_component: oi,
  detach: us,
  empty: Gv,
  get_spread_object: Yv,
  get_spread_update: Jv,
  group_outros: Xv,
  init: Zv,
  insert: ds,
  mount_component: li,
  safe_not_equal: Qv,
  space: Lo,
  transition_in: mt,
  transition_out: gt
} = window.__gradio__svelte__internal, { afterUpdate: $v } = window.__gradio__svelte__internal;
function ex(n) {
  let e, t, i, s, r;
  e = new Jw({
    props: {
      language: (
        /*language*/
        n[2]
      ),
      value: (
        /*value*/
        n[0]
      )
    }
  });
  function o(a) {
    n[16](a);
  }
  let l = {
    language: (
      /*language*/
      n[2]
    ),
    lines: (
      /*lines*/
      n[3]
    ),
    dark_mode: (
      /*dark_mode*/
      n[13]
    ),
    highlights: (
      /*highlights*/
      n[11]
    ),
    readonly: !/*interactive*/
    n[12]
  };
  return (
    /*value*/
    n[0] !== void 0 && (l.value = /*value*/
    n[0]), i = new uy({ props: l }), Kv.push(() => jv(i, "value", o)), i.$on(
      "blur",
      /*blur_handler*/
      n[17]
    ), i.$on(
      "focus",
      /*focus_handler*/
      n[18]
    ), {
      c() {
        ri(e.$$.fragment), t = Lo(), ri(i.$$.fragment);
      },
      m(a, h) {
        li(e, a, h), ds(a, t, h), li(i, a, h), r = !0;
      },
      p(a, h) {
        const f = {};
        h & /*language*/
        4 && (f.language = /*language*/
        a[2]), h & /*value*/
        1 && (f.value = /*value*/
        a[0]), e.$set(f);
        const c = {};
        h & /*language*/
        4 && (c.language = /*language*/
        a[2]), h & /*lines*/
        8 && (c.lines = /*lines*/
        a[3]), h & /*highlights*/
        2048 && (c.highlights = /*highlights*/
        a[11]), h & /*interactive*/
        4096 && (c.readonly = !/*interactive*/
        a[12]), !s && h & /*value*/
        1 && (s = !0, c.value = /*value*/
        a[0], zv(() => s = !1)), i.$set(c);
      },
      i(a) {
        r || (mt(e.$$.fragment, a), mt(i.$$.fragment, a), r = !0);
      },
      o(a) {
        gt(e.$$.fragment, a), gt(i.$$.fragment, a), r = !1;
      },
      d(a) {
        a && us(t), oi(e, a), oi(i, a);
      }
    }
  );
}
function tx(n) {
  let e, t;
  return e = new Mv({
    props: {
      unpadded_box: !0,
      size: "large",
      $$slots: { default: [ix] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      ri(e.$$.fragment);
    },
    m(i, s) {
      li(e, i, s), t = !0;
    },
    p(i, s) {
      const r = {};
      s & /*$$scope*/
      1048576 && (r.$$scope = { dirty: s, ctx: i }), e.$set(r);
    },
    i(i) {
      t || (mt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      gt(e.$$.fragment, i), t = !1;
    },
    d(i) {
      oi(e, i);
    }
  };
}
function ix(n) {
  let e, t;
  return e = new Qu({}), {
    c() {
      ri(e.$$.fragment);
    },
    m(i, s) {
      li(e, i, s), t = !0;
    },
    i(i) {
      t || (mt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      gt(e.$$.fragment, i), t = !1;
    },
    d(i) {
      oi(e, i);
    }
  };
}
function nx(n) {
  let e, t, i, s, r, o, l, a;
  const h = [
    { autoscroll: (
      /*gradio*/
      n[1].autoscroll
    ) },
    { i18n: (
      /*gradio*/
      n[1].i18n
    ) },
    /*loading_status*/
    n[9]
  ];
  let f = {};
  for (let p = 0; p < h.length; p += 1)
    f = qv(f, h[p]);
  e = new Pk({ props: f }), i = new fv({
    props: {
      Icon: Qu,
      show_label: (
        /*show_label*/
        n[8]
      ),
      label: (
        /*label*/
        n[7]
      ),
      float: !1
    }
  });
  const c = [tx, ex], u = [];
  function d(p, m) {
    return !/*value*/
    p[0] && !/*interactive*/
    p[12] ? 0 : 1;
  }
  return r = d(n), o = u[r] = c[r](n), {
    c() {
      ri(e.$$.fragment), t = Lo(), ri(i.$$.fragment), s = Lo(), o.c(), l = Gv();
    },
    m(p, m) {
      li(e, p, m), ds(p, t, m), li(i, p, m), ds(p, s, m), u[r].m(p, m), ds(p, l, m), a = !0;
    },
    p(p, m) {
      const g = m & /*gradio, loading_status*/
      514 ? Jv(h, [
        m & /*gradio*/
        2 && { autoscroll: (
          /*gradio*/
          p[1].autoscroll
        ) },
        m & /*gradio*/
        2 && { i18n: (
          /*gradio*/
          p[1].i18n
        ) },
        m & /*loading_status*/
        512 && Yv(
          /*loading_status*/
          p[9]
        )
      ]) : {};
      e.$set(g);
      const y = {};
      m & /*show_label*/
      256 && (y.show_label = /*show_label*/
      p[8]), m & /*label*/
      128 && (y.label = /*label*/
      p[7]), i.$set(y);
      let k = r;
      r = d(p), r === k ? u[r].p(p, m) : (Xv(), gt(u[k], 1, 1, () => {
        u[k] = null;
      }), Uv(), o = u[r], o ? o.p(p, m) : (o = u[r] = c[r](p), o.c()), mt(o, 1), o.m(l.parentNode, l));
    },
    i(p) {
      a || (mt(e.$$.fragment, p), mt(i.$$.fragment, p), mt(o), a = !0);
    },
    o(p) {
      gt(e.$$.fragment, p), gt(i.$$.fragment, p), gt(o), a = !1;
    },
    d(p) {
      p && (us(t), us(s), us(l)), oi(e, p), oi(i, p), u[r].d(p);
    }
  };
}
function sx(n) {
  let e, t;
  return e = new Yk({
    props: {
      variant: "solid",
      padding: !1,
      elem_id: (
        /*elem_id*/
        n[4]
      ),
      elem_classes: (
        /*elem_classes*/
        n[5]
      ),
      visible: (
        /*visible*/
        n[6]
      ),
      scale: (
        /*scale*/
        n[10]
      ),
      $$slots: { default: [nx] },
      $$scope: { ctx: n }
    }
  }), {
    c() {
      ri(e.$$.fragment);
    },
    m(i, s) {
      li(e, i, s), t = !0;
    },
    p(i, [s]) {
      const r = {};
      s & /*elem_id*/
      16 && (r.elem_id = /*elem_id*/
      i[4]), s & /*elem_classes*/
      32 && (r.elem_classes = /*elem_classes*/
      i[5]), s & /*visible*/
      64 && (r.visible = /*visible*/
      i[6]), s & /*scale*/
      1024 && (r.scale = /*scale*/
      i[10]), s & /*$$scope, value, interactive, language, lines, highlights, gradio, show_label, label, loading_status*/
      1055631 && (r.$$scope = { dirty: s, ctx: i }), e.$set(r);
    },
    i(i) {
      t || (mt(e.$$.fragment, i), t = !0);
    },
    o(i) {
      gt(e.$$.fragment, i), t = !1;
    },
    d(i) {
      oi(e, i);
    }
  };
}
function rx(n, e, t) {
  let { gradio: i } = e, { value: s = "" } = e, { value_is_output: r = !1 } = e, { language: o = "" } = e, { lines: l = 5 } = e, { target: a } = e, { elem_id: h = "" } = e, { elem_classes: f = [] } = e, { visible: c = !0 } = e, { label: u = i.i18n("code.code") } = e, { show_label: d = !0 } = e, { loading_status: p } = e, { scale: m = null } = e, { highlights: g = [] } = e, { interactive: y } = e, k = a.classList.contains("dark");
  function w() {
    i.dispatch("change", s), r || i.dispatch("input");
  }
  $v(() => {
    t(14, r = !1);
  });
  function S(x) {
    s = x, t(0, s);
  }
  const _ = () => i.dispatch("blur"), v = () => i.dispatch("focus");
  return n.$$set = (x) => {
    "gradio" in x && t(1, i = x.gradio), "value" in x && t(0, s = x.value), "value_is_output" in x && t(14, r = x.value_is_output), "language" in x && t(2, o = x.language), "lines" in x && t(3, l = x.lines), "target" in x && t(15, a = x.target), "elem_id" in x && t(4, h = x.elem_id), "elem_classes" in x && t(5, f = x.elem_classes), "visible" in x && t(6, c = x.visible), "label" in x && t(7, u = x.label), "show_label" in x && t(8, d = x.show_label), "loading_status" in x && t(9, p = x.loading_status), "scale" in x && t(10, m = x.scale), "highlights" in x && t(11, g = x.highlights), "interactive" in x && t(12, y = x.interactive);
  }, n.$$.update = () => {
    n.$$.dirty & /*value*/
    1 && w();
  }, [
    s,
    i,
    o,
    l,
    h,
    f,
    c,
    u,
    d,
    p,
    m,
    g,
    y,
    k,
    r,
    a,
    S,
    _,
    v
  ];
}
class vx extends Wv {
  constructor(e) {
    super(), Zv(this, e, rx, sx, Qv, {
      gradio: 1,
      value: 0,
      value_is_output: 14,
      language: 2,
      lines: 3,
      target: 15,
      elem_id: 4,
      elem_classes: 5,
      visible: 6,
      label: 7,
      show_label: 8,
      loading_status: 9,
      scale: 10,
      highlights: 11,
      interactive: 12
    });
  }
}
export {
  Di as A,
  px as B,
  U1 as C,
  a0 as D,
  C as E,
  B as F,
  dx as G,
  Og as H,
  ie as I,
  lg as J,
  vx as K,
  vo as L,
  kx as M,
  ax as N,
  Nw as O,
  Oc as P,
  sw as Q,
  uy as R,
  gi as S,
  et as T,
  Jw as W,
  ue as a,
  Lg as b,
  mx as c,
  ux as d,
  cx as e,
  qg as f,
  Y1 as g,
  bx as h,
  gx as i,
  Ce as j,
  V as k,
  Ko as l,
  Z as m,
  Ei as n,
  vn as o,
  hx as p,
  Ns as q,
  G as r,
  Cg as s,
  b as t,
  Ie as u,
  Hs as v,
  Lc as w,
  Gt as x,
  zg as y,
  Rc as z
};
