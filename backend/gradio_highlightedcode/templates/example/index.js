const {
  SvelteComponent: u,
  append: c,
  attr: o,
  detach: r,
  element: d,
  init: g,
  insert: v,
  noop: f,
  safe_not_equal: y,
  set_data: m,
  text: b,
  toggle_class: i
} = window.__gradio__svelte__internal;
function h(a) {
  let e, n = (
    /*value*/
    (a[0] ? (
      /*value*/
      a[0]
    ) : "") + ""
  ), s;
  return {
    c() {
      e = d("pre"), s = b(n), o(e, "class", "svelte-1ioyqn2"), i(
        e,
        "table",
        /*type*/
        a[1] === "table"
      ), i(
        e,
        "gallery",
        /*type*/
        a[1] === "gallery"
      ), i(
        e,
        "selected",
        /*selected*/
        a[2]
      );
    },
    m(t, l) {
      v(t, e, l), c(e, s);
    },
    p(t, [l]) {
      l & /*value*/
      1 && n !== (n = /*value*/
      (t[0] ? (
        /*value*/
        t[0]
      ) : "") + "") && m(s, n), l & /*type*/
      2 && i(
        e,
        "table",
        /*type*/
        t[1] === "table"
      ), l & /*type*/
      2 && i(
        e,
        "gallery",
        /*type*/
        t[1] === "gallery"
      ), l & /*selected*/
      4 && i(
        e,
        "selected",
        /*selected*/
        t[2]
      );
    },
    i: f,
    o: f,
    d(t) {
      t && r(e);
    }
  };
}
function p(a, e, n) {
  let { value: s } = e, { type: t } = e, { selected: l = !1 } = e;
  return a.$$set = (_) => {
    "value" in _ && n(0, s = _.value), "type" in _ && n(1, t = _.type), "selected" in _ && n(2, l = _.selected);
  }, [s, t, l];
}
class q extends u {
  constructor(e) {
    super(), g(this, e, p, h, y, { value: 0, type: 1, selected: 2 });
  }
}
export {
  q as default
};
