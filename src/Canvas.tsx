import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { Prediction } from "./App";
import { EraserIcon } from "./components/icons";
import { setupCanvas } from "./utils";

const canvasSize = 600;

type CanvasProps = {
  onPredictionReceived: (data: Prediction) => void;
  onCanvasClear: () => void;
};
function Canvas(
  { onPredictionReceived = () => {}, onCanvasClear = () => {} }: CanvasProps,
  ref
) {
  const canvasRef = useRef<HTMLCanvasElement>();
  const clearButtonRef = useRef<HTMLButtonElement>();
  const [isCanvasClear, setIsCanvasClear] = useState(true);

  useImperativeHandle(
    ref,
    () => {
      return {
        clear() {
          clearButtonRef.current.click();
        },
      };
    },
    []
  );
  useEffect(() => {
    setupCanvas(canvasRef.current, canvasSize, {
      mousedown: [() => setIsCanvasClear(false)],
    });
  }, []);

  useEffect(() => {
    if (isCanvasClear) {
      onCanvasClear();
    }
  }, [isCanvasClear, onCanvasClear]);

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext("2d");
    ctx.clearRect(0, 0, canvasSize, canvasSize);
    setIsCanvasClear(true);
  };

  const handleSubmit = () => {
    canvasRef.current.toBlob((blob) => {
      const file = new FormData();
      file.append("fname", "image.png");
      file.append("data", blob);
      fetch("http://127.0.0.1:5000/recognize", {
        method: "POST",
        mode: "cors",
        headers: {
          Accept: "application/json",
        },
        body: file,
      })
        .then((res) => res.json())
        .then((data: CanvasProps["onPredictionReceived"]["arguments"]) => {
          onPredictionReceived(data);
        });
    });
  };

  return (
    <>
      <Container>
        <ClearButton
          ref={clearButtonRef}
          onClick={clearCanvas}
          id="clear-button"
        >
          <EraserIcon width={50} height={50} fill="white" />
        </ClearButton>
        <Board ref={canvasRef} />
      </Container>
      <SubmitButtoContainer>
        {!isCanvasClear && (
          <SubmitButton onClick={handleSubmit} id="submit-button">
            Recognize
          </SubmitButton>
        )}
      </SubmitButtoContainer>
    </>
  );
}

const Container = styled.div`
  position: relative;
  display: flex;
  flex-flow: column nowrap;
  justify-content: flex-end;
`;

const Board = styled.canvas`
  background-color: black;
  border: 1px solid white;
`;

const ClearButton = styled.button`
  position: absolute;
  bottom: 5px;
  right: 5px;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  background-color: transparent;
`;

const SubmitButtoContainer = styled.div`
  display: flex;
  flex-flow: row nowrap;
  justify-content: center;
  align-items: center;
  /* flex: 1; */
  height: 100px;
`;

const SubmitButton = styled.button`
  border: none;
  background-color: F0EEED;
  font-size: 32px;
  padding: 10px;
  border-radius: 10px;
  color: black;
`;

export default forwardRef(Canvas);
