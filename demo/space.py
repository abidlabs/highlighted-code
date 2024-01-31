
import gradio as gr
from app import demo as app
import os

_docs = {'HighlightedCode': {'description': 'Creates a code editor for viewing code (as an ouptut component), or for entering and editing code (as an input component).', 'members': {'__init__': {'value': {'type': 'str | tuple[str] | None', 'default': 'None', 'description': 'Default value to show in the code editor. If callable, the function will be called whenever the app loads to set the initial value of the component.'}, 'language': {'type': '"python"\n    | "markdown"\n    | "json"\n    | "html"\n    | "css"\n    | "javascript"\n    | "typescript"\n    | "yaml"\n    | "dockerfile"\n    | "shell"\n    | "r"\n    | None', 'default': 'None', 'description': 'The language to display the code as. Supported languages listed in `gr.Code.languages`.'}, 'highlights': {'type': 'list[tuple[int, str]] | None', 'default': 'None', 'description': 'A list of tuples indicating lines to highlight. The first element of the tuple is the starting line number (1-indexed) and the second element is the highlight color (as a CSS hex string). The highlights are applied in order, with later highlights taking precedence over earlier ones.'}, 'every': {'type': 'float | None', 'default': 'None', 'description': "If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute."}, 'lines': {'type': 'int', 'default': '5', 'description': None}, 'label': {'type': 'str | None', 'default': 'None', 'description': 'The label for this component. Appears above the component and is also used as the header if there are a table of examples for this component. If None and used in a `gr.Interface`, the label will be the name of the parameter this component is assigned to.'}, 'interactive': {'type': 'bool | None', 'default': 'None', 'description': 'Whether user should be able to enter code or only view it.'}, 'show_label': {'type': 'bool | None', 'default': 'None', 'description': 'if True, will display label.'}, 'container': {'type': 'bool', 'default': 'True', 'description': 'If True, will place the component in a container - providing some extra padding around the border.'}, 'scale': {'type': 'int | None', 'default': 'None', 'description': 'relative width compared to adjacent Components in a Row. For example, if Component A has scale=2, and Component B has scale=1, A will be twice as wide as B. Should be an integer.'}, 'min_width': {'type': 'int', 'default': '160', 'description': 'minimum pixel width, will wrap if not sufficient screen space to satisfy this value. If a certain scale value results in this Component being narrower than min_width, the min_width parameter will be respected first.'}, 'visible': {'type': 'bool', 'default': 'True', 'description': 'If False, component will be hidden.'}, 'elem_id': {'type': 'str | None', 'default': 'None', 'description': 'An optional string that is assigned as the id of this component in the HTML DOM. Can be used for targeting CSS styles.'}, 'elem_classes': {'type': 'list[str] | str | None', 'default': 'None', 'description': 'An optional list of strings that are assigned as the classes of this component in the HTML DOM. Can be used for targeting CSS styles.'}, 'render': {'type': 'bool', 'default': 'True', 'description': 'If False, component will not render be rendered in the Blocks context. Should be used if the intention is to assign event listeners now but render the component later.'}}, 'postprocess': {'value': {'type': 'tuple[str] | str | None', 'description': 'Expects a `str` of code or a single-element `tuple`: (filepath,) with the `str` path to a file containing the code.'}}, 'preprocess': {'return': {'type': 'str | None', 'description': 'Passes the code entered as a `str`.'}, 'value': None}}, 'events': {'change': {'type': None, 'default': None, 'description': 'Triggered when the value of the HighlightedCode changes either because of user input (e.g. a user types in a textbox) OR because of a function update (e.g. an image receives a value from the output of an event trigger). See `.input()` for a listener that is only triggered by user input.'}, 'input': {'type': None, 'default': None, 'description': 'This listener is triggered when the user changes the value of the HighlightedCode.'}, 'focus': {'type': None, 'default': None, 'description': 'This listener is triggered when the HighlightedCode is focused.'}, 'blur': {'type': None, 'default': None, 'description': 'This listener is triggered when the HighlightedCode is unfocused/blurred.'}}}, '__meta__': {'additional_interfaces': {}, 'user_fn_refs': {'HighlightedCode': []}}}
    
abs_path = os.path.join(os.path.dirname(__file__), "css.css")

with gr.Blocks(
    css=abs_path,
    theme=gr.themes.Default(
        font_mono=[
            gr.themes.GoogleFont("Inconsolata"),
            "monospace",
        ],
    ),
) as demo:
    gr.Markdown(
"""
# `gradio_highlightedcode`

<div style="display: flex; gap: 7px;">
<img alt="Static Badge" src="https://img.shields.io/badge/version%20-%200.0.1%20-%20orange">  
</div>

A variant of the Code component that supports highlighting lines of code.
""", elem_classes=["md-custom"], header_links=True)
    app.render()
    gr.Markdown(
"""
## Installation

```bash
pip install gradio_highlightedcode
```

## Usage

```python

import gradio as gr
from gradio_highlightedcode import HighlightedCode


example = HighlightedCode().example_inputs()

demo = gr.Interface(
    lambda x:x,
    HighlightedCode(),  # interactive version of your component
    HighlightedCode(),  # static version of your component
    # examples=[[example]],  # uncomment this line to view the "example version" of your component
)


if __name__ == "__main__":
    demo.launch()

```
""", elem_classes=["md-custom"], header_links=True)


    gr.Markdown("""
## `HighlightedCode`

### Initialization
""", elem_classes=["md-custom"], header_links=True)

    gr.ParamViewer(value=_docs["HighlightedCode"]["members"]["__init__"], linkify=[])


    gr.Markdown("### Events")
    gr.ParamViewer(value=_docs["HighlightedCode"]["events"], linkify=['Event'])




    gr.Markdown("""

### User function

The impact on the users predict function varies depending on whether the component is used as an input or output for an event (or both).

- When used as an Input, the component only impacts the input signature of the user function. 
- When used as an output, the component only impacts the return signature of the user function. 

The code snippet below is accurate in cases where the component is used as both an input and an output.

- **As input:** Is passed, passes the code entered as a `str`.
- **As output:** Should return, expects a `str` of code or a single-element `tuple`: (filepath,) with the `str` path to a file containing the code.

 ```python
def predict(
    value: str | None
) -> tuple[str] | str | None:
    return value
```
""", elem_classes=["md-custom", "HighlightedCode-user-fn"], header_links=True)




    demo.load(None, js=r"""function() {
    const refs = {};
    const user_fn_refs = {
          HighlightedCode: [], };
    requestAnimationFrame(() => {

        Object.entries(user_fn_refs).forEach(([key, refs]) => {
            if (refs.length > 0) {
                const el = document.querySelector(`.${key}-user-fn`);
                if (!el) return;
                refs.forEach(ref => {
                    el.innerHTML = el.innerHTML.replace(
                        new RegExp("\\b"+ref+"\\b", "g"),
                        `<a href="#h-${ref.toLowerCase()}">${ref}</a>`
                    );
                })
            }
        })
        
        Object.entries(refs).forEach(([key, refs]) => {
            if (refs.length > 0) {
                const el = document.querySelector(`.${key}`);
                if (!el) return;
                refs.forEach(ref => {
                    el.innerHTML = el.innerHTML.replace(
                        new RegExp("\\b"+ref+"\\b", "g"),
                        `<a href="#h-${ref.toLowerCase()}">${ref}</a>`
                    );
                })
            }
        })
    })
}

""")

demo.launch()
