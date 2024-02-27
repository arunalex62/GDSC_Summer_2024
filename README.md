## Inspiration

The initial inspiration for this project was about enabling students with a means to get the most out of courses when they simply don't match up well with the professors teaching style. We have both experienced this before, and it's very frustrating to be paying so much for a non-optimal learning experience. It's something that has affected us personally and we believe that a solution would benefit a lot of students.

Of course, a solution to the above problem would also have other uses such as summarizing missed lectures (in the event that a professor either uses this tool or provides full video/audio recordings) and creating study plans for exams.

We decided to build a project focused around AI because it is a modern tool that neither of us had ever worked with in a project of our own, outside of using existing tools like _ChatGPT_ or _Copilot_.

## What it does

The **Lecture Resources Generator (LRG)** is a web app that allows for the recording of audio in order to generate a shortened summary of the content and provide links to relevant media such as YouTube videos or other educational platforms. The site is focused around being used to record lectures or similar educational conversations or presentations. 

It is also possible to provide a text input much like how _ChatGPT_ would normally be used, the only difference being that the prompt is sent to our tuned assistant model based off of **gpt-4-turbo**.

## How we built it

Because of the limited time we chose to use the **Python OpenAI library** along with a Uvicorn based Python web server and FastAPI as a framework for building our RESTful API. This acted as an all-in-one solution requiring only a single Python file for the entire backend.

React as a frontend framework was chosen because of both our familiarity with it. Overall our choices for a tech stack greatly streamlined our development process.

As for the functionality of the site, once a recording is saved it is sent to the backend server and a request to OpenAI's **whisper-1** speech-to-text model is made. That first request provides us with the text transcript, which is then sent to our tuned assistant model in order to provide a reasonable summary and media resources.

## Challenges we ran into

The biggest challenges by far were learning how to use **FastAPI** and the **Python OpenAI Library**, which neither of us have ever used before. Luckily both are mostly well documented, however there were some specific annoyances with the OpenAI API that took significant research + trial and error to move past. These were namely formatting the audio files to be accepted by the API and using the assistant based model rather than a standard one.

Assistants are currently a beta feature of OpenAI so the documentation and features are not completed. This is actually why our AI response does not continuously stream as the generation occurs, it's simply not supported by the API yet.

Due to the nature of a hackathon and the limited time available, one of the things we had to sacrifice was fully deploying our web app. We have so far only used it in our own local development environments but plan on setting up some hosting for it shortly after the jam.

## Accomplishments that we're proud of

We are both are proud to say that this is both of our first times using AI in a programming project, and we are happy to report that it is a success because our concept is functional as we hoped for it to be.

 We're also proud of the functionality being open in terms of barriers, as we have added both text input and microphone support, and support for different languages. The output itself is just text rendering on the screen, so this should be accessible to a wide variety of individuals and users. The tool is used for education purposes and learning, so anyone with an internet connection and a device can take advantage of the AI Resources Generator we created. 

## What we learned

We both learned how to use an AI model in a programming project, which provides us with a baseline understanding of how AI can be integrated into software easily, this is especially beneficial for us, given the popularity and potential dominance of AI in the upcoming future. 

## What's next for AI Lecture Resources Generator

With the hack4everyone hackathon over, we want to continue working on the LRG in order to improve the UI, add functionality including a history, uploading of pre-recorded audio, and integrated tuning of the openAI assistant model, and finally have the app deployed. 
