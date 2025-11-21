
Project Summary

Chathy is an enterprise‑grade AI assistant designed for small business owners who struggle with maintaining digital tools. Instead of logging into dashboards or editing knowledge bases, business owners update their AI assistant simply by sending a message through Telegram. Chathy instantly updates itself using watsonx.ai and IBM Watson automation.
The Issue We Are Hoping to Solve

Many small businesses lack the time, expertise, or resources needed to maintain traditional chatbots or digital tools. They often fall behind on updating hours, service details, availability, inventory, and pricing. This “maintenance gap” makes existing chatbots outdated, unhelpful, and unusable within weeks.
How Our Technology Solution Can Help

A Telegram-based “text‑to‑train” AI assistant powered by IBM watsonx and Watson Orchestrate.
Our Idea

Chathy is the first Text‑to‑Train business assistant built specifically for small business owners who prefer simple, low‑tech interactions. Instead of logging into a dashboard, uploading documents, or updating structured fields, business owners simply send a Telegram message. For example:

    “We’re closed next Friday.”

    “Add brow lamination for $85.”

    “Stop offering same‑day appointments.”

Chathy processes this message through IBM watsonx.ai (Granite models), interprets the intent, extracts the relevant structured changes, and sends it to IBM Watson Orchestrate, which updates the backend knowledge base and triggers any required actions (e.g., modifying business hours, adding new services, adjusting pricing).

Chathy also integrates with customer-facing chat widgets or messaging channels, allowing it to respond to customer inquiries in real time using the most up-to-date business information. This solves the major problem of chatbot decay—where traditional chatbots quickly become outdated because small business owners do not maintain them.

Compared to existing solutions:

    No dashboards

    No manual knowledge base editing

    No technical skills required

    No expensive custom integrations

Chathy uses Telegram, a free and scalable platform, as the primary owner interface. This avoids SMS fees and WhatsApp onboarding friction while giving business owners a familiar and simple chat environment.

More detail is available in our description document.
Technology Implementation
IBM watsonx Products Used
watsonx.ai

Used to interpret natural‑language Telegram messages from business owners. Granite LLMs classify intent, extract structured data, and transform owner messages into defined update actions (e.g., “Change hours”, “Add service”, “Adjust price”, etc.).
watsonx.governance

Ensures responsible AI use by monitoring for hallucinations, enforcing data privacy, and validating model behavior in production—critical for high‑trust industries (medical spas, dental offices, law firms).
watsonx Assistant

Used for the customer-facing bot experience. It receives updated business logic and instantly improves responses to customers based on new owner-provided data.
Other IBM Technology Used
Watson Orchestrate

Acts as the orchestration layer. It receives structured actions from watsonx.ai (e.g., “update hours”) and executes workflows:

    Update business metadata

    Sync with customer chat assistant

    Store changes in the business knowledge base

    Trigger automated responses

Natural Language Understanding (Optional)

Used for additional classification or entity extraction for highly complex business updates.
Solution Architecture
Flow Overview

    Business owner sends an update message through Telegram
    Example: “We’re closed next Friday and add brow tinting for $25.”

    Telegram Bot API receives the message
    The message is forwarded to backend services.

    watsonx.ai interprets the message

        Extracts intent

        Extracts entities (date, service name, price, etc.)

        Produces structured JSON output describing the update

    Watson Orchestrate applies the changes

        Updates business database

        Syncs the business profile with the customer-facing assistant

        Logs the update to the activity timeline

    watsonx Assistant updates immediately
    Customer-facing chatbot now uses the updated information.

    Owner receives a Telegram confirmation
    “Your hours have been updated. Your assistant now knows you are closed next Friday.”
