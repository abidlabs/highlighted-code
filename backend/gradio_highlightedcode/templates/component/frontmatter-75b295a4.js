import { s, f as m, c as l, p as i, t as o, S as f } from "./Index-2933bd90.js";
import { yaml as p } from "./yaml-cef3802d.js";
const n = /^---\s*$/m, F = {
  defineNodes: [{ name: "Frontmatter", block: !0 }, "FrontmatterMark"],
  props: [
    s({
      Frontmatter: [o.documentMeta, o.monospace],
      FrontmatterMark: o.processingInstruction
    }),
    m.add({
      Frontmatter: l,
      FrontmatterMark: () => null
    })
  ],
  wrap: i((t) => {
    const { parser: e } = f.define(p);
    return t.type.name === "Frontmatter" ? {
      parser: e,
      overlay: [{ from: t.from + 4, to: t.to - 4 }]
    } : null;
  }),
  parseBlock: [
    {
      name: "Frontmatter",
      before: "HorizontalRule",
      parse: (t, e) => {
        let r;
        const a = new Array();
        if (t.lineStart === 0 && n.test(e.text)) {
          for (a.push(t.elt("FrontmatterMark", 0, 4)); t.nextLine(); )
            if (n.test(e.text)) {
              r = t.lineStart + 4;
              break;
            }
          return r !== void 0 && (a.push(t.elt("FrontmatterMark", r - 4, r)), t.addElement(t.elt("Frontmatter", 0, r, a))), !0;
        }
        return !1;
      }
    }
  ]
};
export {
  F as frontmatter
};
