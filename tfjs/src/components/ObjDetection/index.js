// Import dependencies
import React, {useRef, useEffect} from "react";
import * as tf from "@tensorflow/tfjs";
import * as cocossd from "@tensorflow-models/coco-ssd";
import Webcam from "react-webcam";
import * as S from "./styles";

const drawRect = (detections, ctx) => {
    detections.forEach((prediction) => {
        const [x, y, width, height] = prediction["bbox"];
        const text = prediction["class"];

        const color = Math.floor(Math.random() * 16777215).toString(16);
        ctx.strokeStyle = "#" + color;
        ctx.font = "18px Arial";

        ctx.beginPath();
        ctx.fillStyle = "#" + color;
        ctx.fillText(text, x, y);
        ctx.rect(x, y, width, height);
        ctx.stroke();
    });
};

function ObjDetection() {
    const webcamRef = useRef(null);
    const canvasRef = useRef(null);

    const runCoco = async () => {
        const net = await cocossd.load();
        console.log("model loaded");

        setInterval(() => {
            detect(net);
        }, 10);
    };

    const detect = async (net) => {
        if (
            typeof webcamRef.current !== "undefined" &&
            webcamRef.current !== null &&
            webcamRef.current.video.readyState === 4
        ) {
            const video = webcamRef.current.video;
            const videoWidth = webcamRef.current.video.videoWidth;
            const videoHeight = webcamRef.current.video.videoHeight;

            webcamRef.current.video.width = videoWidth;
            webcamRef.current.video.height = videoHeight;

            canvasRef.current.width = videoWidth;
            canvasRef.current.height = videoHeight;

            const obj = await net.detect(video);

            const ctx = canvasRef.current.getContext("2d");
            drawRect(obj, ctx);
        }
    };

    useEffect(() => {
        runCoco();
    }, []);

    return (
        <S.ObjDetectionContainer>
            <div>
                <Webcam
                    ref={webcamRef}
                    muted={true}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 9,
                        width: 640,
                        height: 480,
                    }}
                />

                <canvas
                    ref={canvasRef}
                    style={{
                        position: "absolute",
                        marginLeft: "auto",
                        marginRight: "auto",
                        left: 0,
                        right: 0,
                        textAlign: "center",
                        zindex: 8,
                        width: 640,
                        height: 480,
                    }}
                />
            </div>
        </S.ObjDetectionContainer>
    );
}

export default ObjDetection;
