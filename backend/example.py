import pprint
from ibm_watsonx_ai import APIClient
from ibm_watsonx_ai import Credentials
from ibm_watsonx_ai.foundation_models import ModelInference
from ibm_watsonx_orchestrate.agent_builder.tools import tool
model_id = "ibm/granite-3-8b-instruct"
space_id=None
verify=False
credentials = Credentials(
    url = dallas,
    api_key = apikey,
)

client = APIClient(credentials)

params = {
    "time_limit": 10000,
    "max_tokens": 256
}
model = ModelInference(
    model_id=model_id,
    api_client=client,
    project_id=pid,
    params=params,
    space_id=space_id,
    verify=verify,
)
space_id = None # optional
verify = False
prompt = 'How far is Paris from Bangalore?'
## text generation
# print(model.generate(prompt))
# print(model.generate_text(prompt))
## chat example
messages = [
  {
    "role": "system",
    "content": "You are a helpful assistant."
  },
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "How far is Paris from Bangalore?"
      }
    ]
  },
  {
    "role": "assistant",
    "content": "The distance between Paris, France, and Bangalore, India, is approximately 7,800 kilometers (4,850 miles)"
  },
  {
    "role": "user",
    "content": [
      {
        "type": "text",
        "text": "What is the flight distance?"
      }
    ]
  }
]
# chat = model.chat(messages=messages)
# print(chat)
# print(f"{chat["choices"][0]['message']['content']=}")

messages = [
    {
        "role": "user",
        "content": [
            {
                "type": "text",
                "text": "What is 2 plus 4?"
            }
        ]
    }
]

@tool
def add(a: int, b: int):
    return a+b

tools = [
    {
        "type": "function",
        "function": {
            "name": "add",
            "description": "Adds the values a and b to get a sum.",
            "parameters": {
                "type": "object",
                "properties": {
                    "a": {
                        "description": "A number value",
                        "type": "number"
                    },
                    "b": {
                        "description": "A number value",
                        "type": "number"
                    }
                },
                "required": [
                    "a",
                    "b"
                ]
            }
        }
    }
]

pprint.pprint(model.chat(messages=messages, tools=tools))
