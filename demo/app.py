
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
