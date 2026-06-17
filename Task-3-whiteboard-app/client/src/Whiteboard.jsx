import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";
import "./Whiteboard.css";

const socket = io("http://localhost:5000");

function Whiteboard() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const colorRef = useRef("#000000");
  const hasPrompted = useRef(false);

  const [drawing, setDrawing] = useState(false);
  const [color, setColor] = useState("#000000");
  const [brushSize, setBrushSize] = useState(5);
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (hasPrompted.current) return;

    hasPrompted.current = true;

    const enteredUsername = window.prompt("Enter your username");
    const enteredRoom = window.prompt("Enter room ID");

    setUsername(enteredUsername?.trim() || "Guest");
    setRoom(enteredRoom?.trim() || "default-room");
  }, []);

  useEffect(() => {
    if (username === "" || room === "") return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 95;

    ctx.lineCap = "round";
    ctx.lineJoin = "round";

    ctxRef.current = ctx;

    socket.emit("joinRoom", { room, username });

    socket.on("userJoined", (msg) => {
      setMessage(msg);

      setTimeout(() => {
        setMessage("");
      }, 5000);
    });

    socket.on("loadBoard", (strokes) => {
      strokes.forEach((stroke) => {
        drawLine(
          stroke.x0,
          stroke.y0,
          stroke.x1,
          stroke.y1,
          stroke.color,
          stroke.brushSize
        );
      });
    });

    socket.on("drawing", (stroke) => {
      drawLine(
        stroke.x0,
        stroke.y0,
        stroke.x1,
        stroke.y1,
        stroke.color,
        stroke.brushSize
      );
    });

    socket.on("clearBoard", () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
    });

    return () => {
      socket.off("userJoined");
      socket.off("loadBoard");
      socket.off("drawing");
      socket.off("clearBoard");
    };
  }, [username, room]);

  const drawLine = (x0, y0, x1, y1, drawColor, size) => {
    const ctx = ctxRef.current;

    ctx.beginPath();
    ctx.strokeStyle = drawColor;
    ctx.lineWidth = size;
    ctx.moveTo(x0, y0);
    ctx.lineTo(x1, y1);
    ctx.stroke();
    ctx.closePath();
  };

  const startDrawing = (e) => {
    setDrawing(true);

    const { offsetX, offsetY } = e.nativeEvent;

    ctxRef.current.lastX = offsetX;
    ctxRef.current.lastY = offsetY;
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const draw = (e) => {
    if (!drawing) return;

    const { offsetX, offsetY } = e.nativeEvent;

    const lastX = ctxRef.current.lastX;
    const lastY = ctxRef.current.lastY;

    drawLine(
      lastX,
      lastY,
      offsetX,
      offsetY,
      colorRef.current,
      brushSize
    );

    socket.emit("drawing", {
      room,
      stroke: {
        x0: lastX,
        y0: lastY,
        x1: offsetX,
        y1: offsetY,
        color: colorRef.current,
        brushSize,
      },
    });

    ctxRef.current.lastX = offsetX;
    ctxRef.current.lastY = offsetY;
  };

  const clearBoard = () => {
    const canvas = canvasRef.current;

    ctxRef.current.clearRect(0, 0, canvas.width, canvas.height);

    socket.emit("clearBoard", room);
  };

  const downloadBoard = () => {
    const canvas = canvasRef.current;

    const link = document.createElement("a");
    link.download = "whiteboard.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  if (username === "" || room === "") {
    return null;
  }

  return (
    <div className="container">
      <div className="toolbar">
        <div className="title">🎨 Whiteboard</div>

        <input
          type="color"
          className="color-picker"
          value={color}
          onChange={(e) => {
            setColor(e.target.value);
            colorRef.current = e.target.value;
          }}
        />

        <input
          type="range"
          className="slider"
          min="1"
          max="20"
          value={brushSize}
          onChange={(e) => setBrushSize(Number(e.target.value))}
        />

        <button
          className="eraser-btn"
          onClick={() => {
            setColor("#ffffff");
            colorRef.current = "#ffffff";
          }}
        >
          Eraser
        </button>

        <button className="clear-btn" onClick={clearBoard}>
          Clear
        </button>

        <button className="download-btn" onClick={downloadBoard}>
          Download
        </button>
      </div>

      {message && <div className="message">{message}</div>}

      <canvas
        ref={canvasRef}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
    </div>
  );
}

export default Whiteboard;