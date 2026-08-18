const { Document, Packer, Paragraph, TextRun, HeadingLevel } = require('docx');
const fs = require('fs');

const doc = new Document({
    sections: [{
        properties: {},
        children: [
            new Paragraph({ text: "Real-Time Multiplayer Logo Game Architecture", heading: HeadingLevel.HEADING_1 }),
            new Paragraph({ text: "This document outlines the roadmap to transition the single-player prototype into a full real-time multiplayer architecture. Because you are working with a partner (Deekshita), the best approach is to divide the project into Feature Branches. Deekshita wants to handle the Admin Panel, which leaves the Player Lobby and Real-Time Sync to you." }),
            new Paragraph({ text: "" }),
            
            new Paragraph({ text: "Branch 1: The Admin Panel & Game Controls (Deekshita's Task)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Goal: Build the Host Dashboard where the host can create games, add questions, and act as the 'Remote Control' for the live game." }),
            new Paragraph({ children: [new TextRun({ text: "Frontend Tasks:", bold: true })] }),
            new Paragraph({ text: "- Create the /admin route in Next.js." }),
            new Paragraph({ text: "- Build a UI form to add a new question (Image upload, Text input for Answer, Number input for Max Points)." }),
            new Paragraph({ text: "- Build a UI list to display all created questions." }),
            new Paragraph({ text: "- Build the 'Host Remote Control' UI: A dashboard with buttons like 'Start Round', 'Next Question', and 'Show Leaderboard'." }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Backend / Database Tasks:", bold: true })] }),
            new Paragraph({ text: "- Set up a Supabase project." }),
            new Paragraph({ text: "- Create a 'questions' table and a 'games' table in Supabase." }),
            new Paragraph({ text: "- Create a Supabase Storage Bucket called 'question-images'." }),
            new Paragraph({ text: "- Write the API routes to upload images and save questions." }),
            new Paragraph({ text: "- Implement the Game Controller logic: When the Host clicks 'Start Round' on the frontend, update the 'games' database table status to 'playing'. (This database change is what the players' phones will listen to in order to start the game!)" }),
            new Paragraph({ text: "" }),
            new Paragraph({ text: "" }),
            
            new Paragraph({ text: "Branch 2: Player Lobby & Multiplayer Logic (Your Task)", heading: HeadingLevel.HEADING_2 }),
            new Paragraph({ text: "Goal: Build the player-facing screens and the real-time connection that links the host to the players." }),
            new Paragraph({ children: [new TextRun({ text: "Frontend Tasks:", bold: true })] }),
            new Paragraph({ text: "- Create the /join route for players." }),
            new Paragraph({ text: "- Build a simple UI where players enter a 6-digit Game Code and their Name." }),
            new Paragraph({ text: "- Build the 'Waiting Room' UI ('Waiting for Host to start...')." }),
            new Paragraph({ text: "" }),
            new Paragraph({ children: [new TextRun({ text: "Backend / Real-Time Tasks:", bold: true })] }),
            new Paragraph({ text: "- Use Supabase Realtime instead of Socket.IO! It is built directly into Supabase and completely eliminates the need for a separate Render/Railway backend." }),
            new Paragraph({ text: "- Create a 'players' table in the database." }),
            new Paragraph({ text: "- Write the API route (/api/join) that checks if a game code is valid and adds the player to the database." }),
            new Paragraph({ text: "- Implement Supabase Realtime 'Listeners': Make the player's phone listen to the 'games' database table. When Deekshita's Admin button changes the status to 'playing', your code hears it and instantly redirects the player to the active game screen!" })
        ],
    }],
});

Packer.toBuffer(doc).then((buffer) => {
    fs.writeFileSync("Multiplayer_Implementation_Plan_V2.docx", buffer);
    console.log("DOCX generated successfully!");
}).catch(console.error);
