import pprint
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage


# Example usage of Google Gemini AI
def test_gemini():
    api_key = os.environ.get("GOOGLE_API_KEY")

    if not api_key:
        print("Please set GOOGLE_API_KEY environment variable")
        return

    # Initialize Gemini
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=api_key,
        temperature=0.7,
        max_tokens=512,
    )

    # Test message
    message = "Hello, can you help me manage my business?"
    response = llm.invoke([HumanMessage(content=message)])

    print("Gemini Response:")
    pprint.pprint(response.content)


if __name__ == "__main__":
    test_gemini()
