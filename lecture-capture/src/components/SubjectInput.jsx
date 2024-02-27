import React, { useState, useRef } from "react";
import { OneEightyRingWithBg } from "react-svg-spinners";
import recording from "./recording.svg";
import Markdown from "react-markdown";
import axios from "axios";

export const SubjectInput = () => {
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const mimeType = "audio/mp3";
    const [isRecording, setIsRecording] = useState(false);

    const [waitingResponse, setWaitingResponse] = useState(false);
    const [textResponse, setTextResponse] = useState("");
    var markdown = ``;

    const abortController = new AbortController();
    const signal = abortController.signal;

    const getMicrophonePermission = async () => {
        console.log("isRecording:" + isRecording + " permission:" + permission);
        if(isRecording){ 
            setRecordingStatus("inactive");
            setIsRecording(false);
            mediaRecorder.current.stop();
            mediaRecorder.current.onstop = () => {
                const audioBlob = new Blob(audioChunks, { type: mimeType });
                const audioUrl = URL.createObjectURL(audioBlob);
                setAudio(audioUrl);
                setAudioChunks([]);

                var transcript = sendToServer(audioBlob);
                console.log(transcript);
        };
        }
        else if(permission === false){ 
            if ("MediaRecorder" in window) {
                try {
                    const streamData = await navigator.mediaDevices.getUserMedia({
                        audio: true,
                        video: false,
                    });
                    setPermission(true);
                    setStream(streamData);
                    console.log(isRecording);
                } catch (err) {
                    alert(err.message);
                }
            } else {
                alert("The MediaRecorder API is not supported in your browser.");
            }
        } else{ 
            console.log("recording");
            setRecordingStatus("recording");
            setIsRecording(true);
            const media = new MediaRecorder(stream, { type: mimeType });
            mediaRecorder.current = media;
            mediaRecorder.current.start();
            let localAudioChunks = [];
            mediaRecorder.current.ondataavailable = (event) => {
                if (typeof event.data === "undefined") return;
                if (event.data.size === 0) return;
                localAudioChunks.push(event.data);
            };
            setAudioChunks(localAudioChunks);
        }
    };

    const removeAudio = () => {
        setAudio(null); 
        abortController.abort();
        setWaitingResponse(false);
        setTextResponse("");
    }

    const sendToServer = async (audioFile) => {
        const formData = new FormData();
        formData.append("file", audioFile);

        setWaitingResponse(true);

        // Smoothly scroll down to near the bottom of the page
        window.scrollTo({ top: 600, behavior: "smooth" });

        try {
            const response = await fetch("http://127.0.0.1:8000/transcribe", {
                method: "POST",
                body: formData,
                signal: signal,
            });
        
            if (response.ok) {
                const data = await response.json();

                const prompt = data.transcript;

                // This uses axios because of issues formatting the request with fetch
                axios.post('http://127.0.0.1:8000/generate', { prompt })
                .then(response => {
                    console.log('Response:', response);
                    setTextResponse(response.data.summary);
                    markdown = `${response.data.summary}`;
                    setWaitingResponse(false);
                })
                .catch(error => {
                    console.error('Error:', error);
                    setWaitingResponse(false);
                });
            }
        }
        catch (error) {
            console.error("Error:", error);
            setWaitingResponse(false);
        }
    };

    return (
        <form>
            <div className="relative">
                <input className="w-2/3 h-16 rounded-md border-slate-300 border-4 font-mono indent-6 text-slate-800 text-lg" type="text" placeholder="Please enter your course topic to generate resources"/>
                <div className="absolute inset-y-0 right-3 
                    flex items-center
                    w-1/5"
                    onClick={getMicrophonePermission}>
                    {isRecording ? (<img src={recording} alt="recording" /> ) : (
                    <svg className="hover:fill-slate-700 hover:cursor-pointer" fill="#94a3b8" height="40px" width="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlnsXlink="http://www.w3.org/1999/xlink">
                        <g>
                            <rect className="stroke: #fff; fill: #fff; fill-opacity: 0; stroke-opacity: 0;" x="0" y="0" width="10" height="10" />
                            <g>
                                <path d="m439.5,236c0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,70-64,126.9-142.7,126.9-78.7,0-142.7-56.9-142.7-126.9 0-11.3-9.1-20.4-20.4-20.4s-20.4,9.1-20.4,20.4c0,86.2 71.5,157.4 163.1,166.7v57.5h-23.6c-11.3,0-20.4,9.1-20.4,20.4 0,11.3 9.1,20.4 20.4,20.4h88c11.3,0 20.4-9.1 20.4-20.4 0-11.3-9.1-20.4-20.4-20.4h-23.6v-57.5c91.6-9.3 163.1-80.5 163.1-166.7z"/>
                                <path d="m256,323.5c51,0 92.3-41.3 92.3-92.3v-127.9c0-51-41.3-92.3-92.3-92.3s-92.3,41.3-92.3,92.3v127.9c0,51 41.3,92.3 92.3,92.3zm-52.3-220.2c0-28.8 23.5-52.3 52.3-52.3s52.3,23.5 52.3,52.3v127.9c0,28.8-23.5,52.3-52.3,52.3s-52.3-23.5-52.3-52.3v-127.9z"/>
                            </g>
                        </g>
                    </svg> 
                    )}
                </div>
            </div>

            <div className="flex justify-center items-center mt-8">
                {audio ? (
                    <div className="w-2/5 flex gap-4 justify-center items-center">
                        <label className="text-xl text-white">
                            Recording:
                        </label>
                        <audio controls src={audio} 
                        className="h-14 w-full rounded-md font-mono indent-6 text-slate-800 text-lg">
                        </audio>
                        <button aria-description="Remove recording" type="button" className="active:scale-95 bg-white rounded-full" onClick={removeAudio}>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="#dc2626" className="w-12 h-12">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m9.75 9.75 4.5 4.5m0-4.5-4.5 4.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                            </svg>
                        </button>
                    </div>
                ) : (
                    <div></div>
                )} 
            </div>

            { waitingResponse ? ( 

            <div className="flex justify-center mt-8">
                <button type="button" 
                className="flex items-center h-16 p-4 bg-white rounded-md border-slate-300 border-4 font-mono indent-6
                text-slate-800 text-lg" disabled>
                <OneEightyRingWithBg />
                    Processing...
                </button>
            </div>
            ) : (
                <div></div>
            )} 

            { textResponse ? ( 
            <Markdown className="m-auto p-8 my-8 text-left justify-center text-slate-800 bg-white w-2/3 rounded-md border-slate-300 border-4">
                { textResponse }
            </Markdown>
            ) : (
                <div></div>
            )}
        </form>
    )
}