
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
