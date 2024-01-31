import { j as _, k as H, s as Ae, l as Ie, t as c, P as rt, T as nt, m as E, p as st, a as q, E as P, n as T, e as ae, o as it, q as ot, C as at, r as lt, u as ht, v as ft, w as ut, f as Be, b as dt, x as pt, y as ct, z as le, A as mt } from "./Index-2933bd90.js";
import { htmlCompletionSource as gt, html as kt } from "./index-f8c771ea.js";
import "./index-f4953321.js";
import "./index-d8995119.js";
import "./index-5dd45a26.js";
class j {
  static create(e, r, n, s, i) {
    let o = s + (s << 8) + e + (r << 4) | 0;
    return new j(e, r, n, o, i, [], []);
  }
  constructor(e, r, n, s, i, o, a) {
    this.type = e, this.value = r, this.from = n, this.hash = s, this.end = i, this.children = o, this.positions = a, this.hashProp = [[H.contextHash, s]];
  }
  addChild(e, r) {
    e.prop(H.contextHash) != this.hash && (e = new E(e.type, e.children, e.positions, e.length, this.hashProp)), this.children.push(e), this.positions.push(r);
  }
  toTree(e, r = this.end) {
    let n = this.children.length - 1;
    return n >= 0 && (r = Math.max(r, this.positions[n] + this.children[n].length + this.from)), new E(e.types[this.type], this.children, this.positions, r - this.from).balance({
      makeTree: (s, i, o) => new E(_.none, s, i, o, this.hashProp)
    });
  }
}
var u;
(function(t) {
  t[t.Document = 1] = "Document", t[t.CodeBlock = 2] = "CodeBlock", t[t.FencedCode = 3] = "FencedCode", t[t.Blockquote = 4] = "Blockquote", t[t.HorizontalRule = 5] = "HorizontalRule", t[t.BulletList = 6] = "BulletList", t[t.OrderedList = 7] = "OrderedList", t[t.ListItem = 8] = "ListItem", t[t.ATXHeading1 = 9] = "ATXHeading1", t[t.ATXHeading2 = 10] = "ATXHeading2", t[t.ATXHeading3 = 11] = "ATXHeading3", t[t.ATXHeading4 = 12] = "ATXHeading4", t[t.ATXHeading5 = 13] = "ATXHeading5", t[t.ATXHeading6 = 14] = "ATXHeading6", t[t.SetextHeading1 = 15] = "SetextHeading1", t[t.SetextHeading2 = 16] = "SetextHeading2", t[t.HTMLBlock = 17] = "HTMLBlock", t[t.LinkReference = 18] = "LinkReference", t[t.Paragraph = 19] = "Paragraph", t[t.CommentBlock = 20] = "CommentBlock", t[t.ProcessingInstructionBlock = 21] = "ProcessingInstructionBlock", t[t.Escape = 22] = "Escape", t[t.Entity = 23] = "Entity", t[t.HardBreak = 24] = "HardBreak", t[t.Emphasis = 25] = "Emphasis", t[t.StrongEmphasis = 26] = "StrongEmphasis", t[t.Link = 27] = "Link", t[t.Image = 28] = "Image", t[t.InlineCode = 29] = "InlineCode", t[t.HTMLTag = 30] = "HTMLTag", t[t.Comment = 31] = "Comment", t[t.ProcessingInstruction = 32] = "ProcessingInstruction", t[t.Autolink = 33] = "Autolink", t[t.HeaderMark = 34] = "HeaderMark", t[t.QuoteMark = 35] = "QuoteMark", t[t.ListMark = 36] = "ListMark", t[t.LinkMark = 37] = "LinkMark", t[t.EmphasisMark = 38] = "EmphasisMark", t[t.CodeMark = 39] = "CodeMark", t[t.CodeText = 40] = "CodeText", t[t.CodeInfo = 41] = "CodeInfo", t[t.LinkTitle = 42] = "LinkTitle", t[t.LinkLabel = 43] = "LinkLabel", t[t.URL = 44] = "URL";
})(u || (u = {}));
class Lt {
  /// @internal
  constructor(e, r) {
    this.start = e, this.content = r, this.marks = [], this.parsers = [];
  }
}
class bt {
  constructor() {
    this.text = "", this.baseIndent = 0, this.basePos = 0, this.depth = 0, this.markers = [], this.pos = 0, this.indent = 0, this.next = -1;
  }
  /// @internal
  forward() {
    this.basePos > this.pos && this.forwardInner();
  }
  /// @internal
  forwardInner() {
    let e = this.skipSpace(this.basePos);
    this.indent = this.countIndent(e, this.pos, this.indent), this.pos = e, this.next = e == this.text.length ? -1 : this.text.charCodeAt(e);
  }
  /// Skip whitespace after the given position, return the position of
  /// the next non-space character or the end of the line if there's
  /// only space after `from`.
  skipSpace(e) {
    return R(this.text, e);
  }
  /// @internal
  reset(e) {
    for (this.text = e, this.baseIndent = this.basePos = this.pos = this.indent = 0, this.forwardInner(), this.depth = 1; this.markers.length; )
      this.markers.pop();
  }
  /// Move the line's base position forward to the given position.
  /// This should only be called by composite [block
  /// parsers](#BlockParser.parse) or [markup skipping
  /// functions](#NodeSpec.composite).
  moveBase(e) {
    this.basePos = e, this.baseIndent = this.countIndent(e, this.pos, this.indent);
  }
  /// Move the line's base position forward to the given _column_.
  moveBaseColumn(e) {
    this.baseIndent = e, this.basePos = this.findColumn(e);
  }
  /// Store a composite-block-level marker. Should be called from
  /// [markup skipping functions](#NodeSpec.composite) when they
  /// consume any non-whitespace characters.
  addMarker(e) {
    this.markers.push(e);
  }
  /// Find the column position at `to`, optionally starting at a given
  /// position and column.
  countIndent(e, r = 0, n = 0) {
    for (let s = r; s < e; s++)
      n += this.text.charCodeAt(s) == 9 ? 4 - n % 4 : 1;
    return n;
  }
  /// Find the position corresponding to the given column.
  findColumn(e) {
    let r = 0;
    for (let n = 0; r < this.text.length && n < e; r++)
      n += this.text.charCodeAt(r) == 9 ? 4 - n % 4 : 1;
    return r;
  }
  /// @internal
  scrub() {
    if (!this.baseIndent)
      return this.text;
    let e = "";
    for (let r = 0; r < this.basePos; r++)
      e += " ";
    return e + this.text.slice(this.basePos);
  }
}
function he(t, e, r) {
  if (r.pos == r.text.length || t != e.block && r.indent >= e.stack[r.depth + 1].value + r.baseIndent)
    return !0;
  if (r.indent >= r.baseIndent + 4)
    return !1;
  let n = (t.type == u.OrderedList ? se : ne)(r, e, !1);
  return n > 0 && (t.type != u.BulletList || re(r, e, !1) < 0) && r.text.charCodeAt(r.pos + n - 1) == t.value;
}
const Ee = {
  [u.Blockquote](t, e, r) {
    return r.next != 62 ? !1 : (r.markers.push(g(u.QuoteMark, e.lineStart + r.pos, e.lineStart + r.pos + 1)), r.moveBase(r.pos + (C(r.text.charCodeAt(r.pos + 1)) ? 2 : 1)), t.end = e.lineStart + r.text.length, !0);
  },
  [u.ListItem](t, e, r) {
    return r.indent < r.baseIndent + t.value && r.next > -1 ? !1 : (r.moveBaseColumn(r.baseIndent + t.value), !0);
  },
  [u.OrderedList]: he,
  [u.BulletList]: he,
  [u.Document]() {
    return !0;
  }
};
function C(t) {
  return t == 32 || t == 9 || t == 10 || t == 13;
}
function R(t, e = 0) {
  for (; e < t.length && C(t.charCodeAt(e)); )
    e++;
  return e;
}
function fe(t, e, r) {
  for (; e > r && C(t.charCodeAt(e - 1)); )
    e--;
  return e;
}
function Me(t) {
  if (t.next != 96 && t.next != 126)
    return -1;
  let e = t.pos + 1;
  for (; e < t.text.length && t.text.charCodeAt(e) == t.next; )
    e++;
  if (e < t.pos + 3)
    return -1;
  if (t.next == 96) {
    for (let r = e; r < t.text.length; r++)
      if (t.text.charCodeAt(r) == 96)
        return -1;
  }
  return e;
}
function Pe(t) {
  return t.next != 62 ? -1 : t.text.charCodeAt(t.pos + 1) == 32 ? 2 : 1;
}
function re(t, e, r) {
  if (t.next != 42 && t.next != 45 && t.next != 95)
    return -1;
  let n = 1;
  for (let s = t.pos + 1; s < t.text.length; s++) {
    let i = t.text.charCodeAt(s);
    if (i == t.next)
      n++;
    else if (!C(i))
      return -1;
  }
  return r && t.next == 45 && Ne(t) > -1 && t.depth == e.stack.length || n < 3 ? -1 : 1;
}
function He(t, e) {
  for (let r = t.stack.length - 1; r >= 0; r--)
    if (t.stack[r].type == e)
      return !0;
  return !1;
}
function ne(t, e, r) {
  return (t.next == 45 || t.next == 43 || t.next == 42) && (t.pos == t.text.length - 1 || C(t.text.charCodeAt(t.pos + 1))) && (!r || He(e, u.BulletList) || t.skipSpace(t.pos + 2) < t.text.length) ? 1 : -1;
}
function se(t, e, r) {
  let n = t.pos, s = t.next;
  for (; s >= 48 && s <= 57; ) {
    n++;
    if (n == t.text.length)
      return -1;
    s = t.text.charCodeAt(n);
  }
  return n == t.pos || n > t.pos + 9 || s != 46 && s != 41 || n < t.text.length - 1 && !C(t.text.charCodeAt(n + 1)) || r && !He(e, u.OrderedList) && (t.skipSpace(n + 1) == t.text.length || n > t.pos + 1 || t.next != 49) ? -1 : n + 1 - t.pos;
}
function ve(t) {
  if (t.next != 35)
    return -1;
  let e = t.pos + 1;
  for (; e < t.text.length && t.text.charCodeAt(e) == 35; )
    e++;
  if (e < t.text.length && t.text.charCodeAt(e) != 32)
    return -1;
  let r = e - t.pos;
  return r > 6 ? -1 : r;
}
function Ne(t) {
  if (t.next != 45 && t.next != 61 || t.indent >= t.baseIndent + 4)
    return -1;
  let e = t.pos + 1;
  for (; e < t.text.length && t.text.charCodeAt(e) == t.next; )
    e++;
  let r = e;
  for (; e < t.text.length && C(t.text.charCodeAt(e)); )
    e++;
  return e == t.text.length ? r : -1;
}
const K = /^[ \t]*$/, ye = /-->/, Re = /\?>/, J = [
  [/^<(?:script|pre|style)(?:\s|>|$)/i, /<\/(?:script|pre|style)>/i],
  [/^\s*<!--/, ye],
  [/^\s*<\?/, Re],
  [/^\s*<![A-Z]/, />/],
  [/^\s*<!\[CDATA\[/, /\]\]>/],
  [/^\s*<\/?(?:address|article|aside|base|basefont|blockquote|body|caption|center|col|colgroup|dd|details|dialog|dir|div|dl|dt|fieldset|figcaption|figure|footer|form|frame|frameset|h1|h2|h3|h4|h5|h6|head|header|hr|html|iframe|legend|li|link|main|menu|menuitem|nav|noframes|ol|optgroup|option|p|param|section|source|summary|table|tbody|td|tfoot|th|thead|title|tr|track|ul)(?:\s|\/?>|$)/i, K],
  [/^\s*(?:<\/[a-z][\w-]*\s*>|<[a-z][\w-]*(\s+[a-z:_][\w-.]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*>)\s*$/i, K]
];
function Oe(t, e, r) {
  if (t.next != 60)
    return -1;
  let n = t.text.slice(t.pos);
  for (let s = 0, i = J.length - (r ? 1 : 0); s < i; s++)
    if (J[s][0].test(n))
      return s;
  return -1;
}
function ue(t, e) {
  let r = t.countIndent(e, t.pos, t.indent), n = t.countIndent(t.skipSpace(e), e, r);
  return n >= r + 5 ? r + 1 : n;
}
function B(t, e, r) {
  let n = t.length - 1;
  n >= 0 && t[n].to == e && t[n].type == u.CodeText ? t[n].to = r : t.push(g(u.CodeText, e, r));
}
const F = {
  LinkReference: void 0,
  IndentedCode(t, e) {
    let r = e.baseIndent + 4;
    if (e.indent < r)
      return !1;
    let n = e.findColumn(r), s = t.lineStart + n, i = t.lineStart + e.text.length, o = [], a = [];
    for (B(o, s, i); t.nextLine() && e.depth >= t.stack.length; )
      if (e.pos == e.text.length) {
        B(a, t.lineStart - 1, t.lineStart);
        for (let l of e.markers)
          a.push(l);
      } else {
        if (e.indent < r)
          break;
        {
          if (a.length) {
            for (let f of a)
              f.type == u.CodeText ? B(o, f.from, f.to) : o.push(f);
            a = [];
          }
          B(o, t.lineStart - 1, t.lineStart);
          for (let f of e.markers)
            o.push(f);
          i = t.lineStart + e.text.length;
          let l = t.lineStart + e.findColumn(e.baseIndent + 4);
          l < i && B(o, l, i);
        }
      }
    return a.length && (a = a.filter((l) => l.type != u.CodeText), a.length && (e.markers = a.concat(e.markers))), t.addNode(t.buffer.writeElements(o, -s).finish(u.CodeBlock, i - s), s), !0;
  },
  FencedCode(t, e) {
    let r = Me(e);
    if (r < 0)
      return !1;
    let n = t.lineStart + e.pos, s = e.next, i = r - e.pos, o = e.skipSpace(r), a = fe(e.text, e.text.length, o), l = [g(u.CodeMark, n, n + i)];
    o < a && l.push(g(u.CodeInfo, t.lineStart + o, t.lineStart + a));
    for (let f = !0; t.nextLine() && e.depth >= t.stack.length; f = !1) {
      let h = e.pos;
      if (e.indent - e.baseIndent < 4)
        for (; h < e.text.length && e.text.charCodeAt(h) == s; )
          h++;
      if (h - e.pos >= i && e.skipSpace(h) == e.text.length) {
        for (let p of e.markers)
          l.push(p);
        l.push(g(u.CodeMark, t.lineStart + e.pos, t.lineStart + h)), t.nextLine();
        break;
      } else {
        f || B(l, t.lineStart - 1, t.lineStart);
        for (let m of e.markers)
          l.push(m);
        let p = t.lineStart + e.basePos, d = t.lineStart + e.text.length;
        p < d && B(l, p, d);
      }
    }
    return t.addNode(t.buffer.writeElements(l, -n).finish(u.FencedCode, t.prevLineEnd() - n), n), !0;
  },
  Blockquote(t, e) {
    let r = Pe(e);
    return r < 0 ? !1 : (t.startContext(u.Blockquote, e.pos), t.addNode(u.QuoteMark, t.lineStart + e.pos, t.lineStart + e.pos + 1), e.moveBase(e.pos + r), null);
  },
  HorizontalRule(t, e) {
    if (re(e, t, !1) < 0)
      return !1;
    let r = t.lineStart + e.pos;
    return t.nextLine(), t.addNode(u.HorizontalRule, r), !0;
  },
  BulletList(t, e) {
    let r = ne(e, t, !1);
    if (r < 0)
      return !1;
    t.block.type != u.BulletList && t.startContext(u.BulletList, e.basePos, e.next);
    let n = ue(e, e.pos + 1);
    return t.startContext(u.ListItem, e.basePos, n - e.baseIndent), t.addNode(u.ListMark, t.lineStart + e.pos, t.lineStart + e.pos + r), e.moveBaseColumn(n), null;
  },
  OrderedList(t, e) {
    let r = se(e, t, !1);
    if (r < 0)
      return !1;
    t.block.type != u.OrderedList && t.startContext(u.OrderedList, e.basePos, e.text.charCodeAt(e.pos + r - 1));
    let n = ue(e, e.pos + r);
    return t.startContext(u.ListItem, e.basePos, n - e.baseIndent), t.addNode(u.ListMark, t.lineStart + e.pos, t.lineStart + e.pos + r), e.moveBaseColumn(n), null;
  },
  ATXHeading(t, e) {
    let r = ve(e);
    if (r < 0)
      return !1;
    let n = e.pos, s = t.lineStart + n, i = fe(e.text, e.text.length, n), o = i;
    for (; o > n && e.text.charCodeAt(o - 1) == e.next; )
      o--;
    (o == i || o == n || !C(e.text.charCodeAt(o - 1))) && (o = e.text.length);
    let a = t.buffer.write(u.HeaderMark, 0, r).writeElements(t.parser.parseInline(e.text.slice(n + r + 1, o), s + r + 1), -s);
    o < e.text.length && a.write(u.HeaderMark, o - n, i - n);
    let l = a.finish(u.ATXHeading1 - 1 + r, e.text.length - n);
    return t.nextLine(), t.addNode(l, s), !0;
  },
  HTMLBlock(t, e) {
    let r = Oe(e, t, !1);
    if (r < 0)
      return !1;
    let n = t.lineStart + e.pos, s = J[r][1], i = [], o = s != K;
    for (; !s.test(e.text) && t.nextLine(); ) {
      if (e.depth < t.stack.length) {
        o = !1;
        break;
      }
      for (let f of e.markers)
        i.push(f);
    }
    o && t.nextLine();
    let a = s == ye ? u.CommentBlock : s == Re ? u.ProcessingInstructionBlock : u.HTMLBlock, l = t.prevLineEnd();
    return t.addNode(t.buffer.writeElements(i, -n).finish(a, l - n), n), !0;
  },
  SetextHeading: void 0
  // Specifies relative precedence for block-continue function
};
class wt {
  constructor(e) {
    this.stage = 0, this.elts = [], this.pos = 0, this.start = e.start, this.advance(e.content);
  }
  nextLine(e, r, n) {
    if (this.stage == -1)
      return !1;
    let s = n.content + `
` + r.scrub(), i = this.advance(s);
    return i > -1 && i < s.length ? this.complete(e, n, i) : !1;
  }
  finish(e, r) {
    return (this.stage == 2 || this.stage == 3) && R(r.content, this.pos) == r.content.length ? this.complete(e, r, r.content.length) : !1;
  }
  complete(e, r, n) {
    return e.addLeafElement(r, g(u.LinkReference, this.start, this.start + n, this.elts)), !0;
  }
  nextStage(e) {
    return e ? (this.pos = e.to - this.start, this.elts.push(e), this.stage++, !0) : (e === !1 && (this.stage = -1), !1);
  }
  advance(e) {
    for (; ; ) {
      if (this.stage == -1)
        return -1;
      if (this.stage == 0) {
        if (!this.nextStage(qe(e, this.pos, this.start, !0)))
          return -1;
        if (e.charCodeAt(this.pos) != 58)
          return this.stage = -1;
        this.elts.push(g(u.LinkMark, this.pos + this.start, this.pos + this.start + 1)), this.pos++;
      } else if (this.stage == 1) {
        if (!this.nextStage(je(e, R(e, this.pos), this.start)))
          return -1;
      } else if (this.stage == 2) {
        let r = R(e, this.pos), n = 0;
        if (r > this.pos) {
          let s = _e(e, r, this.start);
          if (s) {
            let i = Q(e, s.to - this.start);
            i > 0 && (this.nextStage(s), n = i);
          }
        }
        return n || (n = Q(e, this.pos)), n > 0 && n < e.length ? n : -1;
      } else
        return Q(e, this.pos);
    }
  }
}
function Q(t, e) {
  for (; e < t.length; e++) {
    let r = t.charCodeAt(e);
    if (r == 10)
      break;
    if (!C(r))
      return -1;
  }
  return e;
}
class St {
  nextLine(e, r, n) {
    let s = r.depth < e.stack.length ? -1 : Ne(r), i = r.next;
    if (s < 0)
      return !1;
    let o = g(u.HeaderMark, e.lineStart + r.pos, e.lineStart + s);
    return e.nextLine(), e.addLeafElement(n, g(i == 61 ? u.SetextHeading1 : u.SetextHeading2, n.start, e.prevLineEnd(), [
      ...e.parser.parseInline(n.content, n.start),
      o
    ])), !0;
  }
  finish() {
    return !1;
  }
}
const Ct = {
  LinkReference(t, e) {
    return e.content.charCodeAt(0) == 91 ? new wt(e) : null;
  },
  SetextHeading() {
    return new St();
  }
}, xt = [
  (t, e) => ve(e) >= 0,
  (t, e) => Me(e) >= 0,
  (t, e) => Pe(e) >= 0,
  (t, e) => ne(e, t, !0) >= 0,
  (t, e) => se(e, t, !0) >= 0,
  (t, e) => re(e, t, !0) >= 0,
  (t, e) => Oe(e, t, !0) >= 0
], At = { text: "", end: 0 };
class It {
  /// @internal
  constructor(e, r, n, s) {
    this.parser = e, this.input = r, this.ranges = s, this.line = new bt(), this.atEnd = !1, this.reusePlaceholders = /* @__PURE__ */ new Map(), this.stoppedAt = null, this.rangeI = 0, this.to = s[s.length - 1].to, this.lineStart = this.absoluteLineStart = this.absoluteLineEnd = s[0].from, this.block = j.create(u.Document, 0, this.lineStart, 0, 0), this.stack = [this.block], this.fragments = n.length ? new Pt(n, r) : null, this.readLine();
  }
  get parsedPos() {
    return this.absoluteLineStart;
  }
  advance() {
    if (this.stoppedAt != null && this.absoluteLineStart > this.stoppedAt)
      return this.finish();
    let { line: e } = this;
    for (; ; ) {
      for (let n = 0; ; ) {
        let s = e.depth < this.stack.length ? this.stack[this.stack.length - 1] : null;
        for (; n < e.markers.length && (!s || e.markers[n].from < s.end); ) {
          let i = e.markers[n++];
          this.addNode(i.type, i.from, i.to);
        }
        if (!s)
          break;
        this.finishContext();
      }
      if (e.pos < e.text.length)
        break;
      if (!this.nextLine())
        return this.finish();
    }
    if (this.fragments && this.reuseFragment(e.basePos))
      return null;
    e:
      for (; ; ) {
        for (let n of this.parser.blockParsers)
          if (n) {
            let s = n(this, e);
            if (s != !1) {
              if (s == !0)
                return null;
              e.forward();
              continue e;
            }
          }
        break;
      }
    let r = new Lt(this.lineStart + e.pos, e.text.slice(e.pos));
    for (let n of this.parser.leafBlockParsers)
      if (n) {
        let s = n(this, r);
        s && r.parsers.push(s);
      }
    e:
      for (; this.nextLine() && e.pos != e.text.length; ) {
        if (e.indent < e.baseIndent + 4) {
          for (let n of this.parser.endLeafBlock)
            if (n(this, e, r))
              break e;
        }
        for (let n of r.parsers)
          if (n.nextLine(this, e, r))
            return null;
        r.content += `
` + e.scrub();
        for (let n of e.markers)
          r.marks.push(n);
      }
    return this.finishLeaf(r), null;
  }
  stopAt(e) {
    if (this.stoppedAt != null && this.stoppedAt < e)
      throw new RangeError("Can't move stoppedAt forward");
    this.stoppedAt = e;
  }
  reuseFragment(e) {
    if (!this.fragments.moveTo(this.absoluteLineStart + e, this.absoluteLineStart) || !this.fragments.matches(this.block.hash))
      return !1;
    let r = this.fragments.takeNodes(this);
    return r ? (this.absoluteLineStart += r, this.lineStart = Ue(this.absoluteLineStart, this.ranges), this.moveRangeI(), this.absoluteLineStart < this.to ? (this.lineStart++, this.absoluteLineStart++, this.readLine()) : (this.atEnd = !0, this.readLine()), !0) : !1;
  }
  /// The number of parent blocks surrounding the current block.
  get depth() {
    return this.stack.length;
  }
  /// Get the type of the parent block at the given depth. When no
  /// depth is passed, return the type of the innermost parent.
  parentType(e = this.depth - 1) {
    return this.parser.nodeSet.types[this.stack[e].type];
  }
  /// Move to the next input line. This should only be called by
  /// (non-composite) [block parsers](#BlockParser.parse) that consume
  /// the line directly, or leaf block parser
  /// [`nextLine`](#LeafBlockParser.nextLine) methods when they
  /// consume the current line (and return true).
  nextLine() {
    return this.lineStart += this.line.text.length, this.absoluteLineEnd >= this.to ? (this.absoluteLineStart = this.absoluteLineEnd, this.atEnd = !0, this.readLine(), !1) : (this.lineStart++, this.absoluteLineStart = this.absoluteLineEnd + 1, this.moveRangeI(), this.readLine(), !0);
  }
  moveRangeI() {
    for (; this.rangeI < this.ranges.length - 1 && this.absoluteLineStart >= this.ranges[this.rangeI].to; )
      this.rangeI++, this.absoluteLineStart = Math.max(this.absoluteLineStart, this.ranges[this.rangeI].from);
  }
  /// @internal
  scanLine(e) {
    let r = At;
    if (r.end = e, e >= this.to)
      r.text = "";
    else if (r.text = this.lineChunkAt(e), r.end += r.text.length, this.ranges.length > 1) {
      let n = this.absoluteLineStart, s = this.rangeI;
      for (; this.ranges[s].to < r.end; ) {
        s++;
        let i = this.ranges[s].from, o = this.lineChunkAt(i);
        r.end = i + o.length, r.text = r.text.slice(0, this.ranges[s - 1].to - n) + o, n = r.end - r.text.length;
      }
    }
    return r;
  }
  /// @internal
  readLine() {
    let { line: e } = this, { text: r, end: n } = this.scanLine(this.absoluteLineStart);
    for (this.absoluteLineEnd = n, e.reset(r); e.depth < this.stack.length; e.depth++) {
      let s = this.stack[e.depth], i = this.parser.skipContextMarkup[s.type];
      if (!i)
        throw new Error("Unhandled block context " + u[s.type]);
      if (!i(s, this, e))
        break;
      e.forward();
    }
  }
  lineChunkAt(e) {
    let r = this.input.chunk(e), n;
    if (this.input.lineChunks)
      n = r == `
` ? "" : r;
    else {
      let s = r.indexOf(`
`);
      n = s < 0 ? r : r.slice(0, s);
    }
    return e + n.length > this.to ? n.slice(0, this.to - e) : n;
  }
  /// The end position of the previous line.
  prevLineEnd() {
    return this.atEnd ? this.lineStart : this.lineStart - 1;
  }
  /// @internal
  startContext(e, r, n = 0) {
    this.block = j.create(e, n, this.lineStart + r, this.block.hash, this.lineStart + this.line.text.length), this.stack.push(this.block);
  }
  /// Start a composite block. Should only be called from [block
  /// parser functions](#BlockParser.parse) that return null.
  startComposite(e, r, n = 0) {
    this.startContext(this.parser.getNodeType(e), r, n);
  }
  /// @internal
  addNode(e, r, n) {
    typeof e == "number" && (e = new E(this.parser.nodeSet.types[e], v, v, (n ?? this.prevLineEnd()) - r)), this.block.addChild(e, r - this.block.from);
  }
  /// Add a block element. Can be called by [block
  /// parsers](#BlockParser.parse).
  addElement(e) {
    this.block.addChild(e.toTree(this.parser.nodeSet), e.from - this.block.from);
  }
  /// Add a block element from a [leaf parser](#LeafBlockParser). This
  /// makes sure any extra composite block markup (such as blockquote
  /// markers) inside the block are also added to the syntax tree.
  addLeafElement(e, r) {
    this.addNode(this.buffer.writeElements(W(r.children, e.marks), -r.from).finish(r.type, r.to - r.from), r.from);
  }
  /// @internal
  finishContext() {
    let e = this.stack.pop(), r = this.stack[this.stack.length - 1];
    r.addChild(e.toTree(this.parser.nodeSet), e.from - r.from), this.block = r;
  }
  finish() {
    for (; this.stack.length > 1; )
      this.finishContext();
    return this.addGaps(this.block.toTree(this.parser.nodeSet, this.lineStart));
  }
  addGaps(e) {
    return this.ranges.length > 1 ? Te(this.ranges, 0, e.topNode, this.ranges[0].from, this.reusePlaceholders) : e;
  }
  /// @internal
  finishLeaf(e) {
    for (let n of e.parsers)
      if (n.finish(this, e))
        return;
    let r = W(this.parser.parseInline(e.content, e.start), e.marks);
    this.addNode(this.buffer.writeElements(r, -e.start).finish(u.Paragraph, e.content.length), e.start);
  }
  elt(e, r, n, s) {
    return typeof e == "string" ? g(this.parser.getNodeType(e), r, n, s) : new Fe(e, r);
  }
  /// @internal
  get buffer() {
    return new De(this.parser.nodeSet);
  }
}
function Te(t, e, r, n, s) {
  let i = t[e].to, o = [], a = [], l = r.from + n;
  function f(h, p) {
    for (; p ? h >= i : h > i; ) {
      let d = t[e + 1].from - i;
      n += d, h += d, e++, i = t[e].to;
    }
  }
  for (let h = r.firstChild; h; h = h.nextSibling) {
    f(h.from + n, !0);
    let p = h.from + n, d, m = s.get(h.tree);
    m ? d = m : h.to + n > i ? (d = Te(t, e, h, n, s), f(h.to + n, !1)) : d = h.toTree(), o.push(d), a.push(p - l);
  }
  return f(r.to + n, !1), new E(r.type, o, a, r.to + n - l, r.tree ? r.tree.propValues : void 0);
}
class U extends rt {
  /// @internal
  constructor(e, r, n, s, i, o, a, l, f) {
    super(), this.nodeSet = e, this.blockParsers = r, this.leafBlockParsers = n, this.blockNames = s, this.endLeafBlock = i, this.skipContextMarkup = o, this.inlineParsers = a, this.inlineNames = l, this.wrappers = f, this.nodeTypes = /* @__PURE__ */ Object.create(null);
    for (let h of e.types)
      this.nodeTypes[h.name] = h.id;
  }
  createParse(e, r, n) {
    let s = new It(this, e, r, n);
    for (let i of this.wrappers)
      s = i(s, e, r, n);
    return s;
  }
  /// Reconfigure the parser.
  configure(e) {
    let r = Y(e);
    if (!r)
      return this;
    let { nodeSet: n, skipContextMarkup: s } = this, i = this.blockParsers.slice(), o = this.leafBlockParsers.slice(), a = this.blockNames.slice(), l = this.inlineParsers.slice(), f = this.inlineNames.slice(), h = this.endLeafBlock.slice(), p = this.wrappers;
    if (N(r.defineNodes)) {
      s = Object.assign({}, s);
      let d = n.types.slice(), m;
      for (let L of r.defineNodes) {
        let { name: k, block: w, composite: S, style: b } = typeof L == "string" ? { name: L } : L;
        if (d.some((I) => I.name == k))
          continue;
        S && (s[d.length] = (I, et, tt) => S(et, tt, I.value));
        let A = d.length, M = S ? ["Block", "BlockContext"] : w ? A >= u.ATXHeading1 && A <= u.SetextHeading2 ? ["Block", "LeafBlock", "Heading"] : ["Block", "LeafBlock"] : void 0;
        d.push(_.define({
          id: A,
          name: k,
          props: M && [[H.group, M]]
        })), b && (m || (m = {}), Array.isArray(b) || b instanceof nt ? m[k] = b : Object.assign(m, b));
      }
      n = new Ie(d), m && (n = n.extend(Ae(m)));
    }
    if (N(r.props) && (n = n.extend(...r.props)), N(r.remove))
      for (let d of r.remove) {
        let m = this.blockNames.indexOf(d), L = this.inlineNames.indexOf(d);
        m > -1 && (i[m] = o[m] = void 0), L > -1 && (l[L] = void 0);
      }
    if (N(r.parseBlock))
      for (let d of r.parseBlock) {
        let m = a.indexOf(d.name);
        if (m > -1)
          i[m] = d.parse, o[m] = d.leaf;
        else {
          let L = d.before ? X(a, d.before) : d.after ? X(a, d.after) + 1 : a.length - 1;
          i.splice(L, 0, d.parse), o.splice(L, 0, d.leaf), a.splice(L, 0, d.name);
        }
        d.endLeaf && h.push(d.endLeaf);
      }
    if (N(r.parseInline))
      for (let d of r.parseInline) {
        let m = f.indexOf(d.name);
        if (m > -1)
          l[m] = d.parse;
        else {
          let L = d.before ? X(f, d.before) : d.after ? X(f, d.after) + 1 : f.length - 1;
          l.splice(L, 0, d.parse), f.splice(L, 0, d.name);
        }
      }
    return r.wrap && (p = p.concat(r.wrap)), new U(n, i, o, a, h, s, l, f, p);
  }
  /// @internal
  getNodeType(e) {
    let r = this.nodeTypes[e];
    if (r == null)
      throw new RangeError(`Unknown node type '${e}'`);
    return r;
  }
  /// Parse the given piece of inline text at the given offset,
  /// returning an array of [`Element`](#Element) objects representing
  /// the inline content.
  parseInline(e, r) {
    let n = new Et(this, e, r);
    e:
      for (let s = r; s < n.end; ) {
        let i = n.char(s);
        for (let o of this.inlineParsers)
          if (o) {
            let a = o(n, i, s);
            if (a >= 0) {
              s = a;
              continue e;
            }
          }
        s++;
      }
    return n.resolveMarkers(0);
  }
}
function N(t) {
  return t != null && t.length > 0;
}
function Y(t) {
  if (!Array.isArray(t))
    return t;
  if (t.length == 0)
    return null;
  let e = Y(t[0]);
  if (t.length == 1)
    return e;
  let r = Y(t.slice(1));
  if (!r || !e)
    return e || r;
  let n = (o, a) => (o || v).concat(a || v), s = e.wrap, i = r.wrap;
  return {
    props: n(e.props, r.props),
    defineNodes: n(e.defineNodes, r.defineNodes),
    parseBlock: n(e.parseBlock, r.parseBlock),
    parseInline: n(e.parseInline, r.parseInline),
    remove: n(e.remove, r.remove),
    wrap: s ? i ? (o, a, l, f) => s(i(o, a, l, f), a, l, f) : s : i
  };
}
function X(t, e) {
  let r = t.indexOf(e);
  if (r < 0)
    throw new RangeError(`Position specified relative to unknown parser ${e}`);
  return r;
}
let ze = [_.none];
for (let t = 1, e; e = u[t]; t++)
  ze[t] = _.define({
    id: t,
    name: e,
    props: t >= u.Escape ? [] : [[H.group, t in Ee ? ["Block", "BlockContext"] : ["Block", "LeafBlock"]]],
    top: e == "Document"
  });
const v = [];
class De {
  constructor(e) {
    this.nodeSet = e, this.content = [], this.nodes = [];
  }
  write(e, r, n, s = 0) {
    return this.content.push(e, r, n, 4 + s * 4), this;
  }
  writeElements(e, r = 0) {
    for (let n of e)
      n.writeTo(this, r);
    return this;
  }
  finish(e, r) {
    return E.build({
      buffer: this.content,
      nodeSet: this.nodeSet,
      reused: this.nodes,
      topID: e,
      length: r
    });
  }
}
class z {
  /// @internal
  constructor(e, r, n, s = v) {
    this.type = e, this.from = r, this.to = n, this.children = s;
  }
  /// @internal
  writeTo(e, r) {
    let n = e.content.length;
    e.writeElements(this.children, r), e.content.push(this.type, this.from + r, this.to + r, e.content.length + 4 - n);
  }
  /// @internal
  toTree(e) {
    return new De(e).writeElements(this.children, -this.from).finish(this.type, this.to - this.from);
  }
}
class Fe {
  constructor(e, r) {
    this.tree = e, this.from = r;
  }
  get to() {
    return this.from + this.tree.length;
  }
  get type() {
    return this.tree.type.id;
  }
  get children() {
    return v;
  }
  writeTo(e, r) {
    e.nodes.push(this.tree), e.content.push(e.nodes.length - 1, this.from + r, this.to + r, -1);
  }
  toTree() {
    return this.tree;
  }
}
function g(t, e, r, n) {
  return new z(t, e, r, n);
}
const Xe = { resolve: "Emphasis", mark: "EmphasisMark" }, $e = { resolve: "Emphasis", mark: "EmphasisMark" }, y = {}, de = {};
class x {
  constructor(e, r, n, s) {
    this.type = e, this.from = r, this.to = n, this.side = s;
  }
}
const pe = "!\"#$%&'()*+,-./:;<=>?@[\\]^_`{|}~";
let D = /[!"#$%&'()*+,\-.\/:;<=>?@\[\\\]^_`{|}~\xA1\u2010-\u2027]/;
try {
  D = new RegExp("[\\p{Pc}|\\p{Pd}|\\p{Pe}|\\p{Pf}|\\p{Pi}|\\p{Po}|\\p{Ps}]", "u");
} catch {
}
const Z = {
  Escape(t, e, r) {
    if (e != 92 || r == t.end - 1)
      return -1;
    let n = t.char(r + 1);
    for (let s = 0; s < pe.length; s++)
      if (pe.charCodeAt(s) == n)
        return t.append(g(u.Escape, r, r + 2));
    return -1;
  },
  Entity(t, e, r) {
    if (e != 38)
      return -1;
    let n = /^(?:#\d+|#x[a-f\d]+|\w+);/i.exec(t.slice(r + 1, r + 31));
    return n ? t.append(g(u.Entity, r, r + 1 + n[0].length)) : -1;
  },
  InlineCode(t, e, r) {
    if (e != 96 || r && t.char(r - 1) == 96)
      return -1;
    let n = r + 1;
    for (; n < t.end && t.char(n) == 96; )
      n++;
    let s = n - r, i = 0;
    for (; n < t.end; n++)
      if (t.char(n) == 96) {
        if (i++, i == s && t.char(n + 1) != 96)
          return t.append(g(u.InlineCode, r, n + 1, [
            g(u.CodeMark, r, r + s),
            g(u.CodeMark, n + 1 - s, n + 1)
          ]));
      } else
        i = 0;
    return -1;
  },
  HTMLTag(t, e, r) {
    if (e != 60 || r == t.end - 1)
      return -1;
    let n = t.slice(r + 1, t.end), s = /^(?:[a-z][-\w+.]+:[^\s>]+|[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?(?:\.[a-z\d](?:[a-z\d-]{0,61}[a-z\d])?)*)>/i.exec(n);
    if (s)
      return t.append(g(u.Autolink, r, r + 1 + s[0].length, [
        g(u.LinkMark, r, r + 1),
        // url[0] includes the closing bracket, so exclude it from this slice
        g(u.URL, r + 1, r + s[0].length),
        g(u.LinkMark, r + s[0].length, r + 1 + s[0].length)
      ]));
    let i = /^!--[^>](?:-[^-]|[^-])*?-->/i.exec(n);
    if (i)
      return t.append(g(u.Comment, r, r + 1 + i[0].length));
    let o = /^\?[^]*?\?>/.exec(n);
    if (o)
      return t.append(g(u.ProcessingInstruction, r, r + 1 + o[0].length));
    let a = /^(?:![A-Z][^]*?>|!\[CDATA\[[^]*?\]\]>|\/\s*[a-zA-Z][\w-]*\s*>|\s*[a-zA-Z][\w-]*(\s+[a-zA-Z:_][\w-.:]*(?:\s*=\s*(?:[^\s"'=<>`]+|'[^']*'|"[^"]*"))?)*\s*(\/\s*)?>)/.exec(n);
    return a ? t.append(g(u.HTMLTag, r, r + 1 + a[0].length)) : -1;
  },
  Emphasis(t, e, r) {
    if (e != 95 && e != 42)
      return -1;
    let n = r + 1;
    for (; t.char(n) == e; )
      n++;
    let s = t.slice(r - 1, r), i = t.slice(n, n + 1), o = D.test(s), a = D.test(i), l = /\s|^$/.test(s), f = /\s|^$/.test(i), h = !f && (!a || l || o), p = !l && (!o || f || a), d = h && (e == 42 || !p || o), m = p && (e == 42 || !h || a);
    return t.append(new x(e == 95 ? Xe : $e, r, n, (d ? 1 : 0) | (m ? 2 : 0)));
  },
  HardBreak(t, e, r) {
    if (e == 92 && t.char(r + 1) == 10)
      return t.append(g(u.HardBreak, r, r + 2));
    if (e == 32) {
      let n = r + 1;
      for (; t.char(n) == 32; )
        n++;
      if (t.char(n) == 10 && n >= r + 2)
        return t.append(g(u.HardBreak, r, n + 1));
    }
    return -1;
  },
  Link(t, e, r) {
    return e == 91 ? t.append(new x(
      y,
      r,
      r + 1,
      1
      /* Mark.Open */
    )) : -1;
  },
  Image(t, e, r) {
    return e == 33 && t.char(r + 1) == 91 ? t.append(new x(
      de,
      r,
      r + 2,
      1
      /* Mark.Open */
    )) : -1;
  },
  LinkEnd(t, e, r) {
    if (e != 93)
      return -1;
    for (let n = t.parts.length - 1; n >= 0; n--) {
      let s = t.parts[n];
      if (s instanceof x && (s.type == y || s.type == de)) {
        if (!s.side || t.skipSpace(s.to) == r && !/[(\[]/.test(t.slice(r + 1, r + 2)))
          return t.parts[n] = null, -1;
        let i = t.takeContent(n), o = t.parts[n] = Bt(t, i, s.type == y ? u.Link : u.Image, s.from, r + 1);
        if (s.type == y)
          for (let a = 0; a < n; a++) {
            let l = t.parts[a];
            l instanceof x && l.type == y && (l.side = 0);
          }
        return o.to;
      }
    }
    return -1;
  }
};
function Bt(t, e, r, n, s) {
  let { text: i } = t, o = t.char(s), a = s;
  if (e.unshift(g(u.LinkMark, n, n + (r == u.Image ? 2 : 1))), e.push(g(u.LinkMark, s - 1, s)), o == 40) {
    let l = t.skipSpace(s + 1), f = je(i, l - t.offset, t.offset), h;
    f && (l = t.skipSpace(f.to), l != f.to && (h = _e(i, l - t.offset, t.offset), h && (l = t.skipSpace(h.to)))), t.char(l) == 41 && (e.push(g(u.LinkMark, s, s + 1)), a = l + 1, f && e.push(f), h && e.push(h), e.push(g(u.LinkMark, l, a)));
  } else if (o == 91) {
    let l = qe(i, s - t.offset, t.offset, !1);
    l && (e.push(l), a = l.to);
  }
  return g(r, n, a, e);
}
function je(t, e, r) {
  if (t.charCodeAt(e) == 60) {
    for (let s = e + 1; s < t.length; s++) {
      let i = t.charCodeAt(s);
      if (i == 62)
        return g(u.URL, e + r, s + 1 + r);
      if (i == 60 || i == 10)
        return !1;
    }
    return null;
  } else {
    let s = 0, i = e;
    for (let o = !1; i < t.length; i++) {
      let a = t.charCodeAt(i);
      if (C(a))
        break;
      if (o)
        o = !1;
      else if (a == 40)
        s++;
      else if (a == 41) {
        if (!s)
          break;
        s--;
      } else
        a == 92 && (o = !0);
    }
    return i > e ? g(u.URL, e + r, i + r) : i == t.length ? null : !1;
  }
}
function _e(t, e, r) {
  let n = t.charCodeAt(e);
  if (n != 39 && n != 34 && n != 40)
    return !1;
  let s = n == 40 ? 41 : n;
  for (let i = e + 1, o = !1; i < t.length; i++) {
    let a = t.charCodeAt(i);
    if (o)
      o = !1;
    else {
      if (a == s)
        return g(u.LinkTitle, e + r, i + 1 + r);
      a == 92 && (o = !0);
    }
  }
  return null;
}
function qe(t, e, r, n) {
  for (let s = !1, i = e + 1, o = Math.min(t.length, i + 999); i < o; i++) {
    let a = t.charCodeAt(i);
    if (s)
      s = !1;
    else {
      if (a == 93)
        return n ? !1 : g(u.LinkLabel, e + r, i + 1 + r);
      if (n && !C(a) && (n = !1), a == 91)
        return !1;
      a == 92 && (s = !0);
    }
  }
  return null;
}
class Et {
  /// @internal
  constructor(e, r, n) {
    this.parser = e, this.text = r, this.offset = n, this.parts = [];
  }
  /// Get the character code at the given (document-relative)
  /// position.
  char(e) {
    return e >= this.end ? -1 : this.text.charCodeAt(e - this.offset);
  }
  /// The position of the end of this inline section.
  get end() {
    return this.offset + this.text.length;
  }
  /// Get a substring of this inline section. Again uses
  /// document-relative positions.
  slice(e, r) {
    return this.text.slice(e - this.offset, r - this.offset);
  }
  /// @internal
  append(e) {
    return this.parts.push(e), e.to;
  }
  /// Add a [delimiter](#DelimiterType) at this given position. `open`
  /// and `close` indicate whether this delimiter is opening, closing,
  /// or both. Returns the end of the delimiter, for convenient
  /// returning from [parse functions](#InlineParser.parse).
  addDelimiter(e, r, n, s, i) {
    return this.append(new x(e, r, n, (s ? 1 : 0) | (i ? 2 : 0)));
  }
  /// Add an inline element. Returns the end of the element.
  addElement(e) {
    return this.append(e);
  }
  /// Resolve markers between this.parts.length and from, wrapping matched markers in the
  /// appropriate node and updating the content of this.parts. @internal
  resolveMarkers(e) {
    for (let n = e; n < this.parts.length; n++) {
      let s = this.parts[n];
      if (!(s instanceof x && s.type.resolve && s.side & 2))
        continue;
      let i = s.type == Xe || s.type == $e, o = s.to - s.from, a, l = n - 1;
      for (; l >= e; l--) {
        let k = this.parts[l];
        if (k instanceof x && k.side & 1 && k.type == s.type && // Ignore emphasis delimiters where the character count doesn't match
        !(i && (s.side & 1 || k.side & 2) && (k.to - k.from + o) % 3 == 0 && ((k.to - k.from) % 3 || o % 3))) {
          a = k;
          break;
        }
      }
      if (!a)
        continue;
      let f = s.type.resolve, h = [], p = a.from, d = s.to;
      if (i) {
        let k = Math.min(2, a.to - a.from, o);
        p = a.to - k, d = s.from + k, f = k == 1 ? "Emphasis" : "StrongEmphasis";
      }
      a.type.mark && h.push(this.elt(a.type.mark, p, a.to));
      for (let k = l + 1; k < n; k++)
        this.parts[k] instanceof z && h.push(this.parts[k]), this.parts[k] = null;
      s.type.mark && h.push(this.elt(s.type.mark, s.from, d));
      let m = this.elt(f, p, d, h);
      this.parts[l] = i && a.from != p ? new x(a.type, a.from, p, a.side) : null, (this.parts[n] = i && s.to != d ? new x(s.type, d, s.to, s.side) : null) ? this.parts.splice(n, 0, m) : this.parts[n] = m;
    }
    let r = [];
    for (let n = e; n < this.parts.length; n++) {
      let s = this.parts[n];
      s instanceof z && r.push(s);
    }
    return r;
  }
  /// Find an opening delimiter of the given type. Returns `null` if
  /// no delimiter is found, or an index that can be passed to
  /// [`takeContent`](#InlineContext.takeContent) otherwise.
  findOpeningDelimiter(e) {
    for (let r = this.parts.length - 1; r >= 0; r--) {
      let n = this.parts[r];
      if (n instanceof x && n.type == e)
        return r;
    }
    return null;
  }
  /// Remove all inline elements and delimiters starting from the
  /// given index (which you should get from
  /// [`findOpeningDelimiter`](#InlineContext.findOpeningDelimiter),
  /// resolve delimiters inside of them, and return them as an array
  /// of elements.
  takeContent(e) {
    let r = this.resolveMarkers(e);
    return this.parts.length = e, r;
  }
  /// Skip space after the given (document) position, returning either
  /// the position of the next non-space character or the end of the
  /// section.
  skipSpace(e) {
    return R(this.text, e - this.offset) + this.offset;
  }
  elt(e, r, n, s) {
    return typeof e == "string" ? g(this.parser.getNodeType(e), r, n, s) : new Fe(e, r);
  }
}
function W(t, e) {
  if (!e.length)
    return t;
  if (!t.length)
    return e;
  let r = t.slice(), n = 0;
  for (let s of e) {
    for (; n < r.length && r[n].to < s.to; )
      n++;
    if (n < r.length && r[n].from < s.from) {
      let i = r[n];
      i instanceof z && (r[n] = new z(i.type, i.from, i.to, W(i.children, [s])));
    } else
      r.splice(n++, 0, s);
  }
  return r;
}
const Mt = [u.CodeBlock, u.ListItem, u.OrderedList, u.BulletList];
class Pt {
  constructor(e, r) {
    this.fragments = e, this.input = r, this.i = 0, this.fragment = null, this.fragmentEnd = -1, this.cursor = null, e.length && (this.fragment = e[this.i++]);
  }
  nextFragment() {
    this.fragment = this.i < this.fragments.length ? this.fragments[this.i++] : null, this.cursor = null, this.fragmentEnd = -1;
  }
  moveTo(e, r) {
    for (; this.fragment && this.fragment.to <= e; )
      this.nextFragment();
    if (!this.fragment || this.fragment.from > (e ? e - 1 : 0))
      return !1;
    if (this.fragmentEnd < 0) {
      let i = this.fragment.to;
      for (; i > 0 && this.input.read(i - 1, i) != `
`; )
        i--;
      this.fragmentEnd = i ? i - 1 : 0;
    }
    let n = this.cursor;
    n || (n = this.cursor = this.fragment.tree.cursor(), n.firstChild());
    let s = e + this.fragment.offset;
    for (; n.to <= s; )
      if (!n.parent())
        return !1;
    for (; ; ) {
      if (n.from >= s)
        return this.fragment.from <= r;
      if (!n.childAfter(s))
        return !1;
    }
  }
  matches(e) {
    let r = this.cursor.tree;
    return r && r.prop(H.contextHash) == e;
  }
  takeNodes(e) {
    let r = this.cursor, n = this.fragment.offset, s = this.fragmentEnd - (this.fragment.openEnd ? 1 : 0), i = e.absoluteLineStart, o = i, a = e.block.children.length, l = o, f = a;
    for (; ; ) {
      if (r.to - n > s) {
        if (r.type.isAnonymous && r.firstChild())
          continue;
        break;
      }
      let h = Ue(r.from - n, e.ranges);
      if (r.to - n <= e.ranges[e.rangeI].to)
        e.addNode(r.tree, h);
      else {
        let p = new E(e.parser.nodeSet.types[u.Paragraph], [], [], 0, e.block.hashProp);
        e.reusePlaceholders.set(p, r.tree), e.addNode(p, h);
      }
      if (r.type.is("Block") && (Mt.indexOf(r.type.id) < 0 ? (o = r.to - n, a = e.block.children.length) : (o = l, a = f, l = r.to - n, f = e.block.children.length)), !r.nextSibling())
        break;
    }
    for (; e.block.children.length > a; )
      e.block.children.pop(), e.block.positions.pop();
    return o - i;
  }
}
function Ue(t, e) {
  let r = t;
  for (let n = 1; n < e.length; n++) {
    let s = e[n - 1].to, i = e[n].from;
    s < t && (r -= i - s);
  }
  return r;
}
const Ht = Ae({
  "Blockquote/...": c.quote,
  HorizontalRule: c.contentSeparator,
  "ATXHeading1/... SetextHeading1/...": c.heading1,
  "ATXHeading2/... SetextHeading2/...": c.heading2,
  "ATXHeading3/...": c.heading3,
  "ATXHeading4/...": c.heading4,
  "ATXHeading5/...": c.heading5,
  "ATXHeading6/...": c.heading6,
  "Comment CommentBlock": c.comment,
  Escape: c.escape,
  Entity: c.character,
  "Emphasis/...": c.emphasis,
  "StrongEmphasis/...": c.strong,
  "Link/... Image/...": c.link,
  "OrderedList/... BulletList/...": c.list,
  "BlockQuote/...": c.quote,
  "InlineCode CodeText": c.monospace,
  "URL Autolink": c.url,
  "HeaderMark HardBreak QuoteMark ListMark LinkMark EmphasisMark CodeMark": c.processingInstruction,
  "CodeInfo LinkLabel": c.labelName,
  LinkTitle: c.string,
  Paragraph: c.content
}), vt = new U(new Ie(ze).extend(Ht), Object.keys(F).map((t) => F[t]), Object.keys(F).map((t) => Ct[t]), Object.keys(F), xt, Ee, Object.keys(Z).map((t) => Z[t]), Object.keys(Z), []);
function Nt(t, e, r) {
  let n = [];
  for (let s = t.firstChild, i = e; ; s = s.nextSibling) {
    let o = s ? s.from : r;
    if (o > i && n.push({ from: i, to: o }), !s)
      break;
    i = s.to;
  }
  return n;
}
function yt(t) {
  let { codeParser: e, htmlParser: r } = t;
  return { wrap: st((s, i) => {
    let o = s.type.id;
    if (e && (o == u.CodeBlock || o == u.FencedCode)) {
      let a = "";
      if (o == u.FencedCode) {
        let f = s.node.getChild(u.CodeInfo);
        f && (a = i.read(f.from, f.to));
      }
      let l = e(a);
      if (l)
        return { parser: l, overlay: (f) => f.type.id == u.CodeText };
    } else if (r && (o == u.HTMLBlock || o == u.HTMLTag))
      return { parser: r, overlay: Nt(s.node, s.from, s.to) };
    return null;
  }) };
}
const Rt = { resolve: "Strikethrough", mark: "StrikethroughMark" }, Ot = {
  defineNodes: [{
    name: "Strikethrough",
    style: { "Strikethrough/...": c.strikethrough }
  }, {
    name: "StrikethroughMark",
    style: c.processingInstruction
  }],
  parseInline: [{
    name: "Strikethrough",
    parse(t, e, r) {
      if (e != 126 || t.char(r + 1) != 126 || t.char(r + 2) == 126)
        return -1;
      let n = t.slice(r - 1, r), s = t.slice(r + 2, r + 3), i = /\s|^$/.test(n), o = /\s|^$/.test(s), a = D.test(n), l = D.test(s);
      return t.addDelimiter(Rt, r, r + 2, !o && (!l || i || a), !i && (!a || o || l));
    },
    after: "Emphasis"
  }]
};
function O(t, e, r = 0, n, s = 0) {
  let i = 0, o = !0, a = -1, l = -1, f = !1, h = () => {
    n.push(t.elt("TableCell", s + a, s + l, t.parser.parseInline(e.slice(a, l), s + a)));
  };
  for (let p = r; p < e.length; p++) {
    let d = e.charCodeAt(p);
    d == 124 && !f ? ((!o || a > -1) && i++, o = !1, n && (a > -1 && h(), n.push(t.elt("TableDelimiter", p + s, p + s + 1))), a = l = -1) : (f || d != 32 && d != 9) && (a < 0 && (a = p), l = p + 1), f = !f && d == 92;
  }
  return a > -1 && (i++, n && h()), i;
}
function ce(t, e) {
  for (let r = e; r < t.length; r++) {
    let n = t.charCodeAt(r);
    if (n == 124)
      return !0;
    n == 92 && r++;
  }
  return !1;
}
const Qe = /^\|?(\s*:?-+:?\s*\|)+(\s*:?-+:?\s*)?$/;
class me {
  constructor() {
    this.rows = null;
  }
  nextLine(e, r, n) {
    if (this.rows == null) {
      this.rows = !1;
      let s;
      if ((r.next == 45 || r.next == 58 || r.next == 124) && Qe.test(s = r.text.slice(r.pos))) {
        let i = [];
        O(e, n.content, 0, i, n.start) == O(e, s, r.pos) && (this.rows = [
          e.elt("TableHeader", n.start, n.start + n.content.length, i),
          e.elt("TableDelimiter", e.lineStart + r.pos, e.lineStart + r.text.length)
        ]);
      }
    } else if (this.rows) {
      let s = [];
      O(e, r.text, r.pos, s, e.lineStart), this.rows.push(e.elt("TableRow", e.lineStart + r.pos, e.lineStart + r.text.length, s));
    }
    return !1;
  }
  finish(e, r) {
    return this.rows ? (e.addLeafElement(r, e.elt("Table", r.start, r.start + r.content.length, this.rows)), !0) : !1;
  }
}
const Tt = {
  defineNodes: [
    { name: "Table", block: !0 },
    { name: "TableHeader", style: { "TableHeader/...": c.heading } },
    "TableRow",
    { name: "TableCell", style: c.content },
    { name: "TableDelimiter", style: c.processingInstruction }
  ],
  parseBlock: [{
    name: "Table",
    leaf(t, e) {
      return ce(e.content, 0) ? new me() : null;
    },
    endLeaf(t, e, r) {
      if (r.parsers.some((s) => s instanceof me) || !ce(e.text, e.basePos))
        return !1;
      let n = t.scanLine(t.absoluteLineEnd + 1).text;
      return Qe.test(n) && O(t, e.text, e.basePos) == O(t, n, e.basePos);
    },
    before: "SetextHeading"
  }]
};
class zt {
  nextLine() {
    return !1;
  }
  finish(e, r) {
    return e.addLeafElement(r, e.elt("Task", r.start, r.start + r.content.length, [
      e.elt("TaskMarker", r.start, r.start + 3),
      ...e.parser.parseInline(r.content.slice(3), r.start + 3)
    ])), !0;
  }
}
const Dt = {
  defineNodes: [
    { name: "Task", block: !0, style: c.list },
    { name: "TaskMarker", style: c.atom }
  ],
  parseBlock: [{
    name: "TaskList",
    leaf(t, e) {
      return /^\[[ xX]\][ \t]/.test(e.content) && t.parentType().name == "ListItem" ? new zt() : null;
    },
    after: "SetextHeading"
  }]
}, ge = /(www\.)|(https?:\/\/)|([\w.+-]+@)|(mailto:|xmpp:)/gy, ke = /[\w-]+(\.[\w-]+)+(\/[^\s<]*)?/gy, Ft = /[\w-]+\.[\w-]+($|\/)/, Le = /[\w.+-]+@[\w-]+(\.[\w.-]+)+/gy, be = /\/[a-zA-Z\d@.]+/gy;
function we(t, e, r, n) {
  let s = 0;
  for (let i = e; i < r; i++)
    t[i] == n && s++;
  return s;
}
function Xt(t, e) {
  ke.lastIndex = e;
  let r = ke.exec(t);
  if (!r || Ft.exec(r[0])[0].indexOf("_") > -1)
    return -1;
  let n = e + r[0].length;
  for (; ; ) {
    let s = t[n - 1], i;
    if (/[?!.,:*_~]/.test(s) || s == ")" && we(t, e, n, ")") > we(t, e, n, "("))
      n--;
    else if (s == ";" && (i = /&(?:#\d+|#x[a-f\d]+|\w+);$/.exec(t.slice(e, n))))
      n = e + i.index;
    else
      break;
  }
  return n;
}
function Se(t, e) {
  Le.lastIndex = e;
  let r = Le.exec(t);
  if (!r)
    return -1;
  let n = r[0][r[0].length - 1];
  return n == "_" || n == "-" ? -1 : e + r[0].length - (n == "." ? 1 : 0);
}
const $t = {
  parseInline: [{
    name: "Autolink",
    parse(t, e, r) {
      let n = r - t.offset;
      ge.lastIndex = n;
      let s = ge.exec(t.text), i = -1;
      return !s || (s[1] || s[2] ? i = Xt(t.text, n + s[0].length) : s[3] ? i = Se(t.text, n) : (i = Se(t.text, n + s[0].length), i > -1 && s[0] == "xmpp:" && (be.lastIndex = i, s = be.exec(t.text), s && (i = s.index + s[0].length))), i < 0) ? -1 : (t.addElement(t.elt("URL", r, i + t.offset)), i + t.offset);
    }
  }]
}, jt = [Tt, Dt, Ot, $t];
function Ze(t, e, r) {
  return (n, s, i) => {
    if (s != t || n.char(i + 1) == t)
      return -1;
    let o = [n.elt(r, i, i + 1)];
    for (let a = i + 1; a < n.end; a++) {
      let l = n.char(a);
      if (l == t)
        return n.addElement(n.elt(e, i, a + 1, o.concat(n.elt(r, a, a + 1))));
      if (l == 92 && o.push(n.elt("Escape", a, a++ + 2)), C(l))
        break;
    }
    return -1;
  };
}
const _t = {
  defineNodes: [
    { name: "Superscript", style: c.special(c.content) },
    { name: "SuperscriptMark", style: c.processingInstruction }
  ],
  parseInline: [{
    name: "Superscript",
    parse: Ze(94, "Superscript", "SuperscriptMark")
  }]
}, qt = {
  defineNodes: [
    { name: "Subscript", style: c.special(c.content) },
    { name: "SubscriptMark", style: c.processingInstruction }
  ],
  parseInline: [{
    name: "Subscript",
    parse: Ze(126, "Subscript", "SubscriptMark")
  }]
}, Ut = {
  defineNodes: [{ name: "Emoji", style: c.character }],
  parseInline: [{
    name: "Emoji",
    parse(t, e, r) {
      let n;
      return e != 58 || !(n = /^[a-zA-Z_0-9]+:/.exec(t.slice(r + 1, t.end))) ? -1 : t.addElement(t.elt("Emoji", r, r + 1 + n[0].length));
    }
  }]
}, Ge = /* @__PURE__ */ ut({ commentTokens: { block: { open: "<!--", close: "-->" } } }), Ve = /* @__PURE__ */ new H(), Ke = /* @__PURE__ */ vt.configure({
  props: [
    /* @__PURE__ */ Be.add((t) => !t.is("Block") || t.is("Document") || ee(t) != null ? void 0 : (e, r) => ({ from: r.doc.lineAt(e.from).to, to: e.to })),
    /* @__PURE__ */ Ve.add(ee),
    /* @__PURE__ */ dt.add({
      Document: () => null
    }),
    /* @__PURE__ */ pt.add({
      Document: Ge
    })
  ]
});
function ee(t) {
  let e = /^(?:ATX|Setext)Heading(\d)$/.exec(t.name);
  return e ? +e[1] : void 0;
}
function Qt(t, e) {
  let r = t;
  for (; ; ) {
    let n = r.nextSibling, s;
    if (!n || (s = ee(n.type)) != null && s <= e)
      break;
    r = n;
  }
  return r.to;
}
const Zt = /* @__PURE__ */ ct.of((t, e, r) => {
  for (let n = q(t).resolveInner(r, -1); n && !(n.from < e); n = n.parent) {
    let s = n.type.prop(Ve);
    if (s == null)
      continue;
    let i = Qt(n, s);
    if (i > r)
      return { from: r, to: i };
  }
  return null;
});
function ie(t) {
  return new ht(Ge, t, [Zt], "markdown");
}
const Gt = /* @__PURE__ */ ie(Ke), Vt = /* @__PURE__ */ Ke.configure([jt, qt, _t, Ut, {
  props: [
    /* @__PURE__ */ Be.add({
      Table: (t, e) => ({ from: e.doc.lineAt(t.from).to, to: t.to })
    })
  ]
}]), Je = /* @__PURE__ */ ie(Vt);
function Kt(t, e) {
  return (r) => {
    if (r && t) {
      let n = null;
      if (r = /\S*/.exec(r)[0], typeof t == "function" ? n = t(r) : n = le.matchLanguageName(t, r, !0), n instanceof le)
        return n.support ? n.support.language.parser : mt.getSkippingParser(n.load());
      if (n)
        return n.parser;
    }
    return e ? e.parser : null;
  };
}
class $ {
  constructor(e, r, n, s, i, o, a) {
    this.node = e, this.from = r, this.to = n, this.spaceBefore = s, this.spaceAfter = i, this.type = o, this.item = a;
  }
  blank(e, r = !0) {
    let n = this.spaceBefore + (this.node.name == "Blockquote" ? ">" : "");
    if (e != null) {
      for (; n.length < e; )
        n += " ";
      return n;
    } else {
      for (let s = this.to - this.from - n.length - this.spaceAfter.length; s > 0; s--)
        n += " ";
      return n + (r ? this.spaceAfter : "");
    }
  }
  marker(e, r) {
    let n = this.node.name == "OrderedList" ? String(+We(this.item, e)[2] + r) : "";
    return this.spaceBefore + n + this.type + this.spaceAfter;
  }
}
function Ye(t, e) {
  let r = [];
  for (let s = t; s && s.name != "Document"; s = s.parent)
    (s.name == "ListItem" || s.name == "Blockquote" || s.name == "FencedCode") && r.push(s);
  let n = [];
  for (let s = r.length - 1; s >= 0; s--) {
    let i = r[s], o, a = e.lineAt(i.from), l = i.from - a.from;
    if (i.name == "FencedCode")
      n.push(new $(i, l, l, "", "", "", null));
    else if (i.name == "Blockquote" && (o = /^ *>( ?)/.exec(a.text.slice(l))))
      n.push(new $(i, l, l + o[0].length, "", o[1], ">", null));
    else if (i.name == "ListItem" && i.parent.name == "OrderedList" && (o = /^( *)\d+([.)])( *)/.exec(a.text.slice(l)))) {
      let f = o[3], h = o[0].length;
      f.length >= 4 && (f = f.slice(0, f.length - 4), h -= 4), n.push(new $(i.parent, l, l + h, o[1], f, o[2], i));
    } else if (i.name == "ListItem" && i.parent.name == "BulletList" && (o = /^( *)([-+*])( {1,4}\[[ xX]\])?( +)/.exec(a.text.slice(l)))) {
      let f = o[4], h = o[0].length;
      f.length > 4 && (f = f.slice(0, f.length - 4), h -= 4);
      let p = o[2];
      o[3] && (p += o[3].replace(/[xX]/, " ")), n.push(new $(i.parent, l, l + h, o[1], f, p, i));
    }
  }
  return n;
}
function We(t, e) {
  return /^(\s*)(\d+)(?=[.)])/.exec(e.sliceString(t.from, t.from + 10));
}
function G(t, e, r, n = 0) {
  for (let s = -1, i = t; ; ) {
    if (i.name == "ListItem") {
      let a = We(i, e), l = +a[2];
      if (s >= 0) {
        if (l != s + 1)
          return;
        r.push({ from: i.from + a[1].length, to: i.from + a[0].length, insert: String(s + 2 + n) });
      }
      s = l;
    }
    let o = i.nextSibling;
    if (!o)
      break;
    i = o;
  }
}
function oe(t, e) {
  let r = /^[ \t]*/.exec(t)[0].length;
  if (!r || e.facet(ft) != "	")
    return t;
  let n = T(t, 4, r), s = "";
  for (let i = n; i > 0; )
    i >= 4 ? (s += "	", i -= 4) : (s += " ", i--);
  return s + t.slice(r);
}
const Jt = ({ state: t, dispatch: e }) => {
  let r = q(t), { doc: n } = t, s = null, i = t.changeByRange((o) => {
    if (!o.empty || !Je.isActiveAt(t, o.from))
      return s = { range: o };
    let a = o.from, l = n.lineAt(a), f = Ye(r.resolveInner(a, -1), n);
    for (; f.length && f[f.length - 1].from > a - l.from; )
      f.pop();
    if (!f.length)
      return s = { range: o };
    let h = f[f.length - 1];
    if (h.to - h.spaceAfter.length > a - l.from)
      return s = { range: o };
    let p = a >= h.to - h.spaceAfter.length && !/\S/.test(l.text.slice(h.to));
    if (h.item && p) {
      let w = h.node.firstChild, S = h.node.getChild("ListItem", "ListItem");
      if (w.to >= a || S && S.to < a || l.from > 0 && !/[^\s>]/.test(n.lineAt(l.from - 1).text)) {
        let b = f.length > 1 ? f[f.length - 2] : null, A, M = "";
        b && b.item ? (A = l.from + b.from, M = b.marker(n, 1)) : A = l.from + (b ? b.to : 0);
        let I = [{ from: A, to: a, insert: M }];
        return h.node.name == "OrderedList" && G(h.item, n, I, -2), b && b.node.name == "OrderedList" && G(b.item, n, I), { range: P.cursor(A + M.length), changes: I };
      } else {
        let b = xe(f, t, l);
        return {
          range: P.cursor(a + b.length + 1),
          changes: { from: l.from, insert: b + t.lineBreak }
        };
      }
    }
    if (h.node.name == "Blockquote" && p && l.from) {
      let w = n.lineAt(l.from - 1), S = />\s*$/.exec(w.text);
      if (S && S.index == h.from) {
        let b = t.changes([
          { from: w.from + S.index, to: w.to },
          { from: l.from + h.from, to: l.to }
        ]);
        return { range: o.map(b), changes: b };
      }
    }
    let d = [];
    h.node.name == "OrderedList" && G(h.item, n, d);
    let m = h.item && h.item.from < l.from, L = "";
    if (!m || /^[\s\d.)\-+*>]*/.exec(l.text)[0].length >= h.to)
      for (let w = 0, S = f.length - 1; w <= S; w++)
        L += w == S && !m ? f[w].marker(n, 1) : f[w].blank(w < S ? T(l.text, 4, f[w + 1].from) - L.length : null);
    let k = a;
    for (; k > l.from && /\s/.test(l.text.charAt(k - l.from - 1)); )
      k--;
    return L = oe(L, t), Yt(h.node, t.doc) && (L = xe(f, t, l) + t.lineBreak + L), d.push({ from: k, to: a, insert: t.lineBreak + L }), { range: P.cursor(k + L.length + 1), changes: d };
  });
  return s ? !1 : (e(t.update(i, { scrollIntoView: !0, userEvent: "input" })), !0);
};
function Ce(t) {
  return t.name == "QuoteMark" || t.name == "ListMark";
}
function Yt(t, e) {
  if (t.name != "OrderedList" && t.name != "BulletList")
    return !1;
  let r = t.firstChild, n = t.getChild("ListItem", "ListItem");
  if (!n)
    return !1;
  let s = e.lineAt(r.to), i = e.lineAt(n.from), o = /^[\s>]*$/.test(s.text);
  return s.number + (o ? 0 : 1) < i.number;
}
function xe(t, e, r) {
  let n = "";
  for (let s = 0, i = t.length - 2; s <= i; s++)
    n += t[s].blank(s < i ? T(r.text, 4, t[s + 1].from) - n.length : null, s < i);
  return oe(n, e);
}
function Wt(t, e) {
  let r = t.resolveInner(e, -1), n = e;
  Ce(r) && (n = r.from, r = r.parent);
  for (let s; s = r.childBefore(n); )
    if (Ce(s))
      n = s.from;
    else if (s.name == "OrderedList" || s.name == "BulletList")
      r = s.lastChild, n = r.to;
    else
      break;
  return r;
}
const er = ({ state: t, dispatch: e }) => {
  let r = q(t), n = null, s = t.changeByRange((i) => {
    let o = i.from, { doc: a } = t;
    if (i.empty && Je.isActiveAt(t, i.from)) {
      let l = a.lineAt(o), f = Ye(Wt(r, o), a);
      if (f.length) {
        let h = f[f.length - 1], p = h.to - h.spaceAfter.length + (h.spaceAfter ? 1 : 0);
        if (o - l.from > p && !/\S/.test(l.text.slice(p, o - l.from)))
          return {
            range: P.cursor(l.from + p),
            changes: { from: l.from + p, to: o }
          };
        if (o - l.from == p && // Only apply this if we're on the line that has the
        // construct's syntax, or there's only indentation in the
        // target range
        (!h.item || l.from <= h.item.from || !/\S/.test(l.text.slice(0, h.to)))) {
          let d = l.from + h.from;
          if (h.item && h.node.from < h.item.from && /\S/.test(l.text.slice(h.from, h.to))) {
            let m = h.blank(T(l.text, 4, h.to) - T(l.text, 4, h.from));
            return d == l.from && (m = oe(m, t)), {
              range: P.cursor(d + m.length),
              changes: { from: d, to: l.from + h.to, insert: m }
            };
          }
          if (d < o)
            return { range: P.cursor(d), changes: { from: d, to: o } };
        }
      }
    }
    return n = { range: i };
  });
  return n ? !1 : (e(t.update(s, { scrollIntoView: !0, userEvent: "delete" })), !0);
}, tr = [
  { key: "Enter", run: Jt },
  { key: "Backspace", run: er }
], te = /* @__PURE__ */ kt({ matchClosingTags: !1 });
function hr(t = {}) {
  let { codeLanguages: e, defaultCodeLanguage: r, addKeymap: n = !0, base: { parser: s } = Gt, completeHTMLTags: i = !0 } = t;
  if (!(s instanceof U))
    throw new RangeError("Base parser provided to `markdown` should be a Markdown parser");
  let o = t.extensions ? [t.extensions] : [], a = [te.support], l;
  r instanceof ae ? (a.push(r.support), l = r.language) : r && (l = r);
  let f = e || l ? Kt(e, l) : void 0;
  o.push(yt({ codeParser: f, htmlParser: te.language.parser })), n && a.push(it.high(ot.of(tr)));
  let h = ie(s.configure(o));
  return i && a.push(h.data.of({ autocomplete: rr })), new ae(h, a);
}
function rr(t) {
  let { state: e, pos: r } = t, n = /<[:\-\.\w\u00b7-\uffff]*$/.exec(e.sliceDoc(r - 25, r));
  if (!n)
    return null;
  let s = q(e).resolveInner(r, -1);
  for (; s && !s.type.isTop; ) {
    if (s.name == "CodeBlock" || s.name == "FencedCode" || s.name == "ProcessingInstructionBlock" || s.name == "CommentBlock" || s.name == "Link" || s.name == "Image")
      return null;
    s = s.parent;
  }
  return {
    from: r - n[0].length,
    to: r,
    options: nr(),
    validFor: /^<[:\-\.\w\u00b7-\uffff]*$/
  };
}
let V = null;
function nr() {
  if (V)
    return V;
  let t = gt(new at(lt.create({ extensions: te }), 0, !0));
  return V = t ? t.options : [];
}
export {
  Gt as commonmarkLanguage,
  er as deleteMarkupBackward,
  Jt as insertNewlineContinueMarkup,
  hr as markdown,
  tr as markdownKeymap,
  Je as markdownLanguage
};
