React Gemini Chat 🤖
A simple and beautiful chat application built with React and powered by the Google Gemini API. This project serves as a starter kit for anyone looking to build a modern AI chat interface.

This application allows users to have a real-time, text-based conversation with Google's Gemini Pro model, featuring a clean, responsive UI that supports Markdown rendering for rich text responses.

## Features
Google Gemini Integration: Real-time conversational responses from the gemini-1.5-flash-latest model.

Markdown Support: Responses are parsed and rendered as rich text, including lists, bold/italic text, and code blocks.

Conversation History: The chat interface displays the full conversation.

Auto-Scrolling: The chat view automatically scrolls to the latest message.

Responsive Design: A clean and modern user interface that works on both desktop and mobile devices.

Loading & Error States: Clear visual feedback for when the app is waiting for a response or if an error occurs.

## Tech Stack
Framework: React (with Vite)

AI: Google Gemini API

Markdown Parsing: react-markdown

Styling: CSS with a modern, dark-themed UI

## Getting Started
Follow these instructions to get a copy of the project up and running on your local machine.

### Prerequisites
You need to have Node.js (version 18 or later) and npm installed on your machine.

### Installation & Setup
Clone the repository:
Open your terminal and clone the repository to your local machine.

Bash

git clone https://github.com/photon05/gemini-chat-app.git
cd gemini-chat-app
Install dependencies:
Install all the required npm packages.

Bash

npm install
Set up your environment variables:
You'll need a Google Gemini API key. You can get one for free from Google AI Studio.

Create a new file named .env in the root of your project.

Add your API key to this file as shown below:

Code snippet

# .env
VITE_GEMINI_API_KEY="YOUR_API_KEY_HERE"
Important: The variable name must start with VITE_ for it to be accessible in the React application.

## Running the Application
Once the setup is complete, you can run the development server:

Bash

npm run dev
This will start the application, and you can view it in your browser at http://localhost:5173 (or another port if 5173 is busy).
