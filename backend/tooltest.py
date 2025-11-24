import pprint
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.tools import tool


# Example usage of Google Gemini AI with tools
@tool
def get_business_info() -> str:
    """Get basic business information."""
    return "Business: Chatherine Demo - AI Business Assistant"


@tool
def add(a: int, b: int) -> int:
    """Add two numbers."""
    return a + b


def test_gemini_with_tools():
    api_key = os.environ.get("GOOGLE_API_KEY")

    if not api_key:
        print("Please set GOOGLE_API_KEY environment variable")
        return

    # Initialize Gemini with tools
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.0-flash-exp",
        google_api_key=api_key,
        temperature=0.7,
        max_tokens=512,
    )

    # Bind tools
    tools = [get_business_info, add]
    llm_with_tools = llm.bind_tools(tools)

    # Test message
    message = "What can you tell me about my business? Also, what's 15 + 27?"
    response = llm_with_tools.invoke([message])

    print("Gemini Response with Tools:")
    pprint.pprint(response.content)


if __name__ == "__main__":
    test_gemini_with_tools()
