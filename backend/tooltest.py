
from ibm_watsonx_orchestrate.agent_builder.tools import tool

@tool
def add(a: int, b: int):
    return a+b
