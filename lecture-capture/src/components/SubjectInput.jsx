import { useState, useRef } from "react";
import recording from "./recording.svg";

export const SubjectInput = () => {
    const [permission, setPermission] = useState(false);
    const mediaRecorder = useRef(null);
    const [recordingStatus, setRecordingStatus] = useState("inactive");
    const [stream, setStream] = useState(null);
    const [audioChunks, setAudioChunks] = useState([]);
    const [audio, setAudio] = useState(null);
    const mimeType = "audio/mp3";
    const [isRecording, setIsRecording] = useState(false);

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

    return (
        <form>
            <div className="relative">
                <input className="w-2/3 h-16 rounded-md border-slate-300 border-4 font-mono indent-6 text-slate-800 text-lg" type="text" placeholder="Please enter your course topic to generate resources"/>
                <div className="absolute inset-y-0 right-3 
                    flex items-center
                    w-1/5"
                    onClick={getMicrophonePermission}>
                    {isRecording ? (<img src={recording} alt="recording" /> ) : (
                    <svg fill="#94a3b8" height="40px" width="40px" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" xmlnsXlink="http://www.w3.org/1999/xlink">
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
            <div className="flex justify-center items-center">
                {audio ? (
                    <audio controls src={audio} className="w-1/3 pt-8 flex justify-center items-center h-20 rounded-md font-mono indent-6 text-slate-800 text-lg"></audio>
                ) : (
                    <div></div>
                )} 
            </div>
        </form>
    )
}