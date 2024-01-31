
# `gradio_highlightedcode`
<a href="https://pypi.org/project/gradio_highlightedcode/" target="_blank"><img alt="PyPI - Version" src="https://img.shields.io/pypi/v/gradio_highlightedcode"></a>  

A variant of the Code component that supports highlighting lines of code.

## Installation
    
```bash 
pip install gradio_highlightedcode
```

## Usage

```python

import time
import gradio as gr
from gradio_highlightedcode import HighlightedCode


example = HighlightedCode().example_inputs()

initial_value = """import random

def scramble_name(name):
    name_list = list(name)
"""

completion = """    random.shuffle(name_list)
    return ''.join(name_list)

# Example usage:
print(scramble_name("Python"))
"""

def generate_code():
    for i in range(len(completion)):
        time.sleep(0.03)
        yield HighlightedCode(initial_value + completion[:i], highlights=[(5, "rgb(255 254 213)")])

with gr.Blocks() as demo:
    code = HighlightedCode(initial_value, language="python")
    btn = gr.Button("Generate", variant="primary")
    btn.click(generate_code, outputs=code)

if __name__ == "__main__":
    demo.launch()

```

## `HighlightedCode`

### Initialization

<table>
<thead>
<tr>
<th align="left">name</th>
<th align="left" style="width: 25%;">type</th>
<th align="left">default</th>
<th align="left">description</th>
</tr>
</thead>
<tbody>
<tr>
<td align="left"><code>value</code></td>
<td align="left" style="width: 25%;">

```python
str | tuple[str] | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">Default value to show in the code editor. If callable, the function will be called whenever the app loads to set the initial value of the component.</td>
</tr>

<tr>
<td align="left"><code>language</code></td>
<td align="left" style="width: 25%;">

```python
"python"
    | "markdown"
    | "json"
    | "html"
    | "css"
    | "javascript"
    | "typescript"
    | "yaml"
    | "dockerfile"
    | "shell"
    | "r"
    | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">The language to display the code as. Supported languages listed in `gr.Code.languages`.</td>
</tr>

<tr>
<td align="left"><code>highlights</code></td>
<td align="left" style="width: 25%;">

```python
list[tuple[int, str]] | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">A list of tuples indicating lines to highlight. The first element of the tuple is the starting line number (1-indexed) and the second element is the highlight color (as a CSS hex string). The highlights are applied in order, with later highlights taking precedence over earlier ones.</td>
</tr>

<tr>
<td align="left"><code>every</code></td>
<td align="left" style="width: 25%;">

```python
float | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">If `value` is a callable, run the function 'every' number of seconds while the client connection is open. Has no effect otherwise. The event can be accessed (e.g. to cancel it) via this component's .load_event attribute.</td>
</tr>

<tr>
<td align="left"><code>lines</code></td>
<td align="left" style="width: 25%;">

```python
int
```

</td>
<td align="left"><code>5</code></td>
<td align="left">None</td>
</tr>

<tr>
<td align="left"><code>label</code></td>
<td align="left" style="width: 25%;">

```python
str | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">The label for this component. Appears above the component and is also used as the header if there are a table of examples for this component. If None and used in a `gr.Interface`, the label will be the name of the parameter this component is assigned to.</td>
</tr>

<tr>
<td align="left"><code>interactive</code></td>
<td align="left" style="width: 25%;">

```python
bool | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">Whether user should be able to enter code or only view it.</td>
</tr>

<tr>
<td align="left"><code>show_label</code></td>
<td align="left" style="width: 25%;">

```python
bool | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">if True, will display label.</td>
</tr>

<tr>
<td align="left"><code>container</code></td>
<td align="left" style="width: 25%;">

```python
bool
```

</td>
<td align="left"><code>True</code></td>
<td align="left">If True, will place the component in a container - providing some extra padding around the border.</td>
</tr>

<tr>
<td align="left"><code>scale</code></td>
<td align="left" style="width: 25%;">

```python
int | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">relative width compared to adjacent Components in a Row. For example, if Component A has scale=2, and Component B has scale=1, A will be twice as wide as B. Should be an integer.</td>
</tr>

<tr>
<td align="left"><code>min_width</code></td>
<td align="left" style="width: 25%;">

```python
int
```

</td>
<td align="left"><code>160</code></td>
<td align="left">minimum pixel width, will wrap if not sufficient screen space to satisfy this value. If a certain scale value results in this Component being narrower than min_width, the min_width parameter will be respected first.</td>
</tr>

<tr>
<td align="left"><code>visible</code></td>
<td align="left" style="width: 25%;">

```python
bool
```

</td>
<td align="left"><code>True</code></td>
<td align="left">If False, component will be hidden.</td>
</tr>

<tr>
<td align="left"><code>elem_id</code></td>
<td align="left" style="width: 25%;">

```python
str | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">An optional string that is assigned as the id of this component in the HTML DOM. Can be used for targeting CSS styles.</td>
</tr>

<tr>
<td align="left"><code>elem_classes</code></td>
<td align="left" style="width: 25%;">

```python
list[str] | str | None
```

</td>
<td align="left"><code>None</code></td>
<td align="left">An optional list of strings that are assigned as the classes of this component in the HTML DOM. Can be used for targeting CSS styles.</td>
</tr>

<tr>
<td align="left"><code>render</code></td>
<td align="left" style="width: 25%;">

```python
bool
```

</td>
<td align="left"><code>True</code></td>
<td align="left">If False, component will not render be rendered in the Blocks context. Should be used if the intention is to assign event listeners now but render the component later.</td>
</tr>
</tbody></table>


### Events

| name | description |
|:-----|:------------|
| `change` | Triggered when the value of the HighlightedCode changes either because of user input (e.g. a user types in a textbox) OR because of a function update (e.g. an image receives a value from the output of an event trigger). See `.input()` for a listener that is only triggered by user input. |
| `input` | This listener is triggered when the user changes the value of the HighlightedCode. |
| `focus` | This listener is triggered when the HighlightedCode is focused. |
| `blur` | This listener is triggered when the HighlightedCode is unfocused/blurred. |



### User function

The impact on the users predict function varies depending on whether the component is used as an input or output for an event (or both).

- When used as an Input, the component only impacts the input signature of the user function. 
- When used as an output, the component only impacts the return signature of the user function. 

The code snippet below is accurate in cases where the component is used as both an input and an output.

- **As output:** Is passed, passes the code entered as a `str`.
- **As input:** Should return, expects a `str` of code or a single-element `tuple`: (filepath,) with the `str` path to a file containing the code.

 ```python
 def predict(
     value: str | None
 ) -> tuple[str] | str | None:
     return value
 ```
 
